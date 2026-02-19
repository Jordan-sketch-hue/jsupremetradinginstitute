import { spawn } from 'child_process'
import path from 'path'

type Provider = 'TWELVE_DATA' | 'YAHOO'

export interface UnifiedQuote {
  price: number
  change: number
  changePercent: number
  provider: Provider
}

export interface UnifiedCandle {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface UnifiedHistory {
  candles: UnifiedCandle[]
  provider: Provider
}

interface YfinanceQuoteResult {
  ok: boolean
  price?: unknown
  change?: unknown
  changePercent?: unknown
}

interface YfinanceHistoryCandle {
  timestamp?: unknown
  open?: unknown
  high?: unknown
  low?: unknown
  close?: unknown
  volume?: unknown
}

interface YfinanceHistoryResult {
  ok: boolean
  candles?: YfinanceHistoryCandle[]
}

interface TwelveDataTimeSeriesEntry {
  datetime?: string
  open?: unknown
  high?: unknown
  low?: unknown
  close?: unknown
  volume?: unknown
}

interface TwelveDataTimeSeriesResponse {
  status?: string
  values?: TwelveDataTimeSeriesEntry[]
}

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY || ''

const INDEX_TWELVE_SYMBOL_MAP: Record<string, string> = {
  US500: 'SPX',
  US30: 'DJI',
  USTEC: 'IXIC',
  DE40: 'GDAXI',
  UK100: 'FTSE',
  JP225: 'N225',
  HK50: 'HSI',
  FR40: 'FCHI',
}

const INDEX_YAHOO_SYMBOL_MAP: Record<string, string> = {
  US500: '^GSPC',
  US30: '^DJI',
  USTEC: '^IXIC',
  DE40: '^GDAXI',
  UK100: '^FTSE',
  JP225: '^N225',
  HK50: '^HSI',
  FR40: '^FCHI',
}

const COMMODITY_TWELVE_SYMBOL_MAP: Record<string, string> = {
  XAUUSD: 'XAU/USD',
  XAGUSD: 'XAG/USD',
  XPTUSD: 'XPT/USD',
  WTI: 'USOIL',
}

const COMMODITY_YAHOO_SYMBOL_MAP: Record<string, string> = {
  XAUUSD: 'GC=F',
  XAGUSD: 'SI=F',
  XPTUSD: 'PL=F',
  WTI: 'CL=F',
}

function toNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return Number.isFinite(parsed) ? parsed : null
  }
  return null
}

function normalizeForex(value: string): string {
  const clean = value.toUpperCase().replace(/[^A-Z]/g, '')
  if (clean.length >= 6) {
    return `${clean.slice(0, 3)}/${clean.slice(3, 6)}`
  }
  return value.toUpperCase()
}

function normalizeCrypto(value: string): string {
  const clean = value.toUpperCase().replace(/[^A-Z]/g, '')
  if (clean.length >= 6) {
    return `${clean.slice(0, 3)}/${clean.slice(3, 6)}`
  }
  return value.toUpperCase()
}

function toYahooForexTicker(value: string): string {
  const clean = value.toUpperCase().replace(/[^A-Z]/g, '')
  return `${clean}=X`
}

function toYahooCryptoTicker(value: string): string {
  const clean = value.toUpperCase().replace(/[^A-Z]/g, '')
  return `${clean.slice(0, 3)}-${clean.slice(3, 6)}`
}

function mapTwelveInterval(assetType: string): string {
  if (assetType === 'crypto') return '1h'
  return '1day'
}

function mapYahooInterval(assetType: string): { interval: string; period: string } {
  if (assetType === 'crypto') {
    return { interval: '1h', period: '2mo' }
  }
  return { interval: '1d', period: '6mo' }
}

async function fetchTwelveDataQuote(symbol: string): Promise<UnifiedQuote | null> {
  if (!TWELVE_DATA_API_KEY) return null

  try {
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${TWELVE_DATA_API_KEY}`
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) return null

    const data = await response.json()
    if (data?.status === 'error') return null

    const price = toNumber(data?.close ?? data?.price)
    const previousClose = toNumber(data?.previous_close)
    const rawChange = toNumber(data?.change)
    const rawChangePercent = toNumber(data?.percent_change)

    if (!price || price <= 0) return null

    const change = rawChange ?? (previousClose ? price - previousClose : 0)
    const changePercent =
      rawChangePercent ??
      (previousClose && previousClose !== 0 ? (change / previousClose) * 100 : 0)

    return {
      price,
      change,
      changePercent,
      provider: 'TWELVE_DATA',
    }
  } catch (error) {
    console.error(`Twelve Data quote error for ${symbol}:`, error)
    return null
  }
}

async function runPythonYfinance(args: string[]): Promise<unknown | null> {
  const scriptPath = path.join(process.cwd(), 'scripts', 'yfinance_fallback.py')
  const attempts: Array<{ cmd: string; cmdArgs: string[] }> = [
    { cmd: 'python3', cmdArgs: [scriptPath, ...args] },
    { cmd: 'python', cmdArgs: [scriptPath, ...args] },
    { cmd: 'py', cmdArgs: ['-3', scriptPath, ...args] },
    { cmd: 'py', cmdArgs: [scriptPath, ...args] },
  ]

  for (const attempt of attempts) {
    const result = await new Promise<{ stdout: string; stderr: string; code: number }>(resolve => {
      const child = spawn(attempt.cmd, attempt.cmdArgs, {
        stdio: ['ignore', 'pipe', 'pipe'],
      })

      let stdout = ''
      let stderr = ''

      child.stdout.on('data', data => {
        stdout += String(data)
      })

      child.stderr.on('data', data => {
        stderr += String(data)
      })

      child.on('error', err => {
        resolve({ stdout: '', stderr: String(err), code: -1 })
      })

      child.on('close', code => {
        resolve({ stdout, stderr, code: code ?? 1 })
      })
    })

    if (result.code === 0 && result.stdout.trim()) {
      try {
        return JSON.parse(result.stdout)
      } catch {
        return null
      }
    }
  }

  return null
}

async function fetchYahooQuote(ticker: string): Promise<UnifiedQuote | null> {
  const result = (await runPythonYfinance(['quote', ticker])) as YfinanceQuoteResult | null
  if (!result?.ok) return null

  const price = toNumber(result.price)
  const change = toNumber(result.change) ?? 0
  const changePercent = toNumber(result.changePercent) ?? 0

  if (!price || price <= 0) return null

  return {
    price,
    change,
    changePercent,
    provider: 'YAHOO',
  }
}

async function fetchTwelveDataHistory(
  symbol: string,
  assetType: string
): Promise<UnifiedHistory | null> {
  if (!TWELVE_DATA_API_KEY) return null

  try {
    const interval = mapTwelveInterval(assetType)
    const url =
      `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}` +
      `&interval=${interval}&outputsize=120&apikey=${TWELVE_DATA_API_KEY}`

    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) return null

    const data = (await response.json()) as TwelveDataTimeSeriesResponse
    if (data?.status === 'error' || !Array.isArray(data?.values) || data.values.length === 0) {
      return null
    }

    const candles: UnifiedCandle[] = data.values
      .map((entry: TwelveDataTimeSeriesEntry) => {
        const timestamp = Date.parse(entry.datetime)
        const open = toNumber(entry.open)
        const high = toNumber(entry.high)
        const low = toNumber(entry.low)
        const close = toNumber(entry.close)
        const volume = toNumber(entry.volume) ?? 0

        if (!Number.isFinite(timestamp) || !open || !high || !low || !close) {
          return null
        }

        return { timestamp, open, high, low, close, volume }
      })
      .filter((value: UnifiedCandle | null): value is UnifiedCandle => value !== null)
      .reverse()

    if (candles.length === 0) return null

    return {
      candles,
      provider: 'TWELVE_DATA',
    }
  } catch (error) {
    console.error(`Twelve Data history error for ${symbol}:`, error)
    return null
  }
}

async function fetchYahooHistory(
  ticker: string,
  assetType: string
): Promise<UnifiedHistory | null> {
  const { interval, period } = mapYahooInterval(assetType)
  const result = (await runPythonYfinance(['history', ticker, interval, period])) as
    | YfinanceHistoryResult
    | null
  if (!result?.ok || !Array.isArray(result?.candles) || result.candles.length === 0) return null

  const candles: UnifiedCandle[] = result.candles
    .map((entry: YfinanceHistoryCandle) => {
      const timestamp = toNumber(entry.timestamp)
      const open = toNumber(entry.open)
      const high = toNumber(entry.high)
      const low = toNumber(entry.low)
      const close = toNumber(entry.close)
      const volume = toNumber(entry.volume) ?? 0

      if (!timestamp || !open || !high || !low || !close) {
        return null
      }

      return {
        timestamp,
        open,
        high,
        low,
        close,
        volume,
      }
    })
    .filter((value: UnifiedCandle | null): value is UnifiedCandle => value !== null)

  if (candles.length === 0) return null

  return {
    candles,
    provider: 'YAHOO',
  }
}

export async function getForexQuote(symbol: string): Promise<UnifiedQuote | null> {
  const normalized = normalizeForex(symbol)
  return (await fetchTwelveDataQuote(normalized)) || fetchYahooQuote(toYahooForexTicker(normalized))
}

export async function getCommodityQuote(symbol: string): Promise<UnifiedQuote | null> {
  const normalized = symbol.toUpperCase().replace(/[^A-Z]/g, '')
  const twelveSymbol = COMMODITY_TWELVE_SYMBOL_MAP[normalized] || normalized
  const yahooSymbol = COMMODITY_YAHOO_SYMBOL_MAP[normalized] || normalized

  return (await fetchTwelveDataQuote(twelveSymbol)) || fetchYahooQuote(yahooSymbol)
}

export async function getIndexQuote(symbol: string): Promise<UnifiedQuote | null> {
  const normalized = symbol.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const twelveSymbol = INDEX_TWELVE_SYMBOL_MAP[normalized] || normalized
  const yahooSymbol = INDEX_YAHOO_SYMBOL_MAP[normalized] || normalized

  return (await fetchTwelveDataQuote(twelveSymbol)) || fetchYahooQuote(yahooSymbol)
}

export async function getCryptoQuote(symbol: string): Promise<UnifiedQuote | null> {
  const normalized = normalizeCrypto(symbol)
  return (
    (await fetchTwelveDataQuote(normalized)) || fetchYahooQuote(toYahooCryptoTicker(normalized))
  )
}

export async function getHistoricalCandles(
  symbol: string,
  assetType: string
): Promise<UnifiedHistory | null> {
  const normalizedAssetType = assetType.toLowerCase()
  const normalizedSymbol = symbol.toUpperCase()

  if (normalizedAssetType === 'forex') {
    const twelveSymbol = normalizeForex(normalizedSymbol)
    const yahooSymbol = toYahooForexTicker(normalizedSymbol)
    return (
      (await fetchTwelveDataHistory(twelveSymbol, normalizedAssetType)) ||
      fetchYahooHistory(yahooSymbol, normalizedAssetType)
    )
  }

  if (normalizedAssetType === 'crypto') {
    const twelveSymbol = normalizeCrypto(normalizedSymbol)
    const yahooSymbol = toYahooCryptoTicker(normalizedSymbol)
    return (
      (await fetchTwelveDataHistory(twelveSymbol, normalizedAssetType)) ||
      fetchYahooHistory(yahooSymbol, normalizedAssetType)
    )
  }

  if (normalizedAssetType === 'commodities') {
    const clean = normalizedSymbol.replace(/[^A-Z]/g, '')
    const twelveSymbol = COMMODITY_TWELVE_SYMBOL_MAP[clean] || clean
    const yahooSymbol = COMMODITY_YAHOO_SYMBOL_MAP[clean] || clean
    return (
      (await fetchTwelveDataHistory(twelveSymbol, normalizedAssetType)) ||
      fetchYahooHistory(yahooSymbol, normalizedAssetType)
    )
  }

  if (normalizedAssetType === 'index' || normalizedAssetType === 'indices') {
    const clean = normalizedSymbol.replace(/[^A-Z0-9]/g, '')
    const twelveSymbol = INDEX_TWELVE_SYMBOL_MAP[clean] || clean
    const yahooSymbol = INDEX_YAHOO_SYMBOL_MAP[clean] || clean
    return (
      (await fetchTwelveDataHistory(twelveSymbol, 'indices')) ||
      fetchYahooHistory(yahooSymbol, 'indices')
    )
  }

  return (
    (await fetchTwelveDataHistory(normalizedSymbol, normalizedAssetType)) ||
    fetchYahooHistory(normalizedSymbol, normalizedAssetType)
  )
}
