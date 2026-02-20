/**
 * Fetch historical closes for a symbol using Twelve Data as the primary source, with Yahoo as backend fallback only.
 * Returns array of closing prices (most recent last) or null if unavailable.
 *
 * NOTE: All frontend code must fetch historical data via the backend API (e.g. /api/market-data/historical), never directly from Yahoo or Twelve Data.
 * Yahoo fallback is only used server-side to avoid CORS issues.
 */
export async function getHistoricalCloses(
  symbol: string,
  assetType: string = 'forex',
  timeframe: string = '1h'
): Promise<number[] | null> {
  // Only use Twelve Data, never Yahoo fallback
  const mapped = mapTwelveInterval(timeframe)
  let twelveSymbol = symbol
  if (assetType === 'forex') twelveSymbol = normalizeForex(symbol)
  if (assetType === 'crypto') twelveSymbol = normalizeCrypto(symbol)
  if (assetType === 'indices') twelveSymbol = INDEX_TWELVE_SYMBOL_MAP[symbol] || symbol
  if (assetType === 'commodities') twelveSymbol = COMMODITY_TWELVE_SYMBOL_MAP[symbol] || symbol
  const url = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(twelveSymbol)}&interval=${mapped.interval}&outputsize=${mapped.outputsize}&apikey=${process.env.TWELVE_DATA_API_KEY}`
  try {
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) return null
    const data = await response.json()
    if (data?.status === 'error' || !Array.isArray(data?.values) || data.values.length === 0)
      return null
    let closes = data.values
      .map((entry: any) => {
        const close = toNumber(entry.close)
        return close
      })
      .filter((v: number | null) => typeof v === 'number' && Number.isFinite(v))
      .reverse()
    // If not enough closes, retry with longer interval
    if (closes.length < 15) {
      const fallbackIntervals = ['4h', '1d', '1w']
      for (const interval of fallbackIntervals) {
        const mappedFallback = mapTwelveInterval(interval)
        const fallbackUrl = `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(twelveSymbol)}&interval=${mappedFallback.interval}&outputsize=${mappedFallback.outputsize}&apikey=${process.env.TWELVE_DATA_API_KEY}`
        const fallbackResp = await fetch(fallbackUrl, { cache: 'no-store' })
        if (!fallbackResp.ok) continue
        const fallbackData = await fallbackResp.json()
        if (
          fallbackData?.status === 'error' ||
          !Array.isArray(fallbackData?.values) ||
          fallbackData.values.length === 0
        )
          continue
        const fallbackCloses = fallbackData.values
          .map((entry: any) => {
            const close = toNumber(entry.close)
            return close
          })
          .filter((v: number | null) => typeof v === 'number' && Number.isFinite(v))
          .reverse()
        if (fallbackCloses.length >= 15) {
          closes = fallbackCloses
          break
        }
      }
    }
    if (closes.length === 0) return null
    return closes
  } catch {
    return null
  }
}
import yahooFinance from 'yahoo-finance2'
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

export interface LiveFailureReportEntry {
  assetType: string
  symbol: string
  reasons: string[]
  timestamp: string
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

interface YahooChartMeta {
  regularMarketPrice?: number
  previousClose?: number
}

interface YahooChartQuote {
  open?: Array<number | null>
  high?: Array<number | null>
  low?: Array<number | null>
  close?: Array<number | null>
  volume?: Array<number | null>
}

interface YahooChartResult {
  meta?: YahooChartMeta
  timestamp?: number[]
  indicators?: {
    quote?: YahooChartQuote[]
  }
}

interface YahooChartResponse {
  chart?: {
    result?: YahooChartResult[]
  }
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

const liveFailureReport: LiveFailureReportEntry[] = []
const LIVE_FAILURE_REPORT_MAX = 300

function recordLiveFailure(assetType: string, symbol: string, reasons: string[]) {
  const uniqueReasons = Array.from(new Set(reasons.filter(reason => Boolean(reason?.trim()))))

  liveFailureReport.unshift({
    assetType,
    symbol,
    reasons: uniqueReasons.length > 0 ? uniqueReasons : ['Unknown live provider failure'],
    timestamp: new Date().toISOString(),
  })

  if (liveFailureReport.length > LIVE_FAILURE_REPORT_MAX) {
    liveFailureReport.length = LIVE_FAILURE_REPORT_MAX
  }
}

export function getLiveFailureReport(limit: number = 100): LiveFailureReportEntry[] {
  return liveFailureReport.slice(0, Math.max(1, limit))
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

type HistoryTimeframe =
  | '1m'
  | '5m'
  | '15m'
  | '30m'
  | '1h'
  | '4h'
  | '1d'
  | '1w'
  | '1mo'
  | '3mo'
  | '6mo'
  | 'ytd'
  | '12mo'
  | 'all'

function normalizeTimeframe(timeframe?: string): HistoryTimeframe {
  const value = (timeframe || '').toLowerCase()
  if (
    value === '1m' ||
    value === '5m' ||
    value === '15m' ||
    value === '30m' ||
    value === '1h' ||
    value === '4h' ||
    value === '1d' ||
    value === '1w' ||
    value === '1mo' ||
    value === '3mo' ||
    value === '6mo' ||
    value === 'ytd' ||
    value === '12mo' ||
    value === 'all'
  ) {
    return value
  }
  return '1h'
}

function mapTwelveInterval(timeframe?: string): { interval: string; outputsize: number } {
  const normalized = normalizeTimeframe(timeframe)
  if (normalized === '1m') return { interval: '1min', outputsize: 360 }
  if (normalized === '5m') return { interval: '5min', outputsize: 500 }
  if (normalized === '15m') return { interval: '15min', outputsize: 500 }
  if (normalized === '30m') return { interval: '30min', outputsize: 500 }
  if (normalized === '1h') return { interval: '1h', outputsize: 500 }
  if (normalized === '4h') return { interval: '4h', outputsize: 500 }
  if (normalized === '1d') return { interval: '1day', outputsize: 500 }
  if (normalized === '1w') return { interval: '1week', outputsize: 260 }
  if (normalized === '1mo') return { interval: '1month', outputsize: 240 }
  if (normalized === '3mo') return { interval: '1month', outputsize: 240 }
  if (normalized === '6mo') return { interval: '1month', outputsize: 240 }
  if (normalized === 'ytd') return { interval: '1day', outputsize: 400 }
  if (normalized === '12mo') return { interval: '1day', outputsize: 500 }
  return { interval: '1week', outputsize: 520 }
}

function mapYahooInterval(timeframe?: string): { interval: string; period: string } {
  const normalized = normalizeTimeframe(timeframe)
  if (normalized === '1m') {
    return { interval: '1m', period: '5d' }
  }
  if (normalized === '5m') {
    return { interval: '5m', period: '1mo' }
  }
  if (normalized === '15m') {
    return { interval: '15m', period: '5d' }
  }
  if (normalized === '30m') {
    return { interval: '30m', period: '1mo' }
  }
  if (normalized === '1h') {
    return { interval: '1h', period: '2mo' }
  }
  if (normalized === '4h') {
    return { interval: '1h', period: '6mo' }
  }
  if (normalized === '1d') {
    return { interval: '1d', period: '6mo' }
  }
  if (normalized === '1w') {
    return { interval: '1wk', period: '5y' }
  }
  if (normalized === '1mo') {
    return { interval: '1mo', period: '10y' }
  }
  if (normalized === '3mo') {
    return { interval: '3mo', period: '10y' }
  }
  if (normalized === '6mo') {
    return { interval: '1mo', period: '10y' }
  }
  if (normalized === 'ytd') {
    return { interval: '1d', period: 'ytd' }
  }
  if (normalized === '12mo') {
    return { interval: '1d', period: '1y' }
  }
  return { interval: '1wk', period: 'max' }
}

async function fetchTwelveDataQuote(
  symbol: string,
  reasons?: string[]
): Promise<UnifiedQuote | null> {
  if (!TWELVE_DATA_API_KEY) return null

  try {
    const url = `https://api.twelvedata.com/quote?symbol=${encodeURIComponent(symbol)}&apikey=${TWELVE_DATA_API_KEY}`
    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      reasons?.push(`Twelve Data HTTP error ${response.status} for ${symbol}`)
      return null
    }

    const data = await response.json()
    if (data?.status === 'error') {
      reasons?.push(
        `Twelve Data rejected ${symbol}: ${String(data?.message || data?.code || 'Unknown error')}`
      )
      return null
    }

    const price = toNumber(data?.close ?? data?.price)
    const previousClose = toNumber(data?.previous_close)
    const rawChange = toNumber(data?.change)
    const rawChangePercent = toNumber(data?.percent_change)

    if (!price || price <= 0) {
      reasons?.push(`Twelve Data returned invalid price for ${symbol}`)
      return null
    }

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
    reasons?.push(`Twelve Data exception for ${symbol}`)
    console.error(`Twelve Data quote error for ${symbol}:`, error)
    return null
  }
}

async function fetchYahooChart(
  ticker: string,
  interval: string,
  range: string,
  reasons?: string[]
): Promise<YahooChartResult | null> {
  try {
    const url =
      `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(ticker)}` +
      `?interval=${encodeURIComponent(interval)}&range=${encodeURIComponent(range)}` +
      '&includePrePost=false&events=div%2Csplits'

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
    })

    if (!response.ok) {
      reasons?.push(`Yahoo HTTP error ${response.status} for ${ticker}`)
      return null
    }

    const data = (await response.json()) as YahooChartResponse
    const result = data?.chart?.result?.[0]
    if (!result) {
      reasons?.push(`Yahoo returned empty chart result for ${ticker}`)
      return null
    }

    return result
  } catch (error) {
    reasons?.push(`Yahoo exception for ${ticker}`)
    console.error(`Yahoo chart error for ${ticker}:`, error)
    return null
  }
}

function getLastFinite(values: Array<number | null> | undefined): number | null {
  if (!Array.isArray(values)) return null

  for (let index = values.length - 1; index >= 0; index--) {
    const value = values[index]
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }
  }

  return null
}

async function fetchYahooQuote(ticker: string, reasons?: string[]): Promise<UnifiedQuote | null> {
  const result = await fetchYahooChart(ticker, '1d', '5d', reasons)
  if (!result) return null

  const quote = result.indicators?.quote?.[0]
  const closePrice = getLastFinite(quote?.close)
  const metaPrice = toNumber(result.meta?.regularMarketPrice)
  const previousClose = toNumber(result.meta?.previousClose)
  const price = metaPrice ?? closePrice

  if (!price || price <= 0) {
    reasons?.push(`Yahoo returned invalid price for ${ticker}`)
    return null
  }

  const change = previousClose ? price - previousClose : 0
  const changePercent = previousClose && previousClose !== 0 ? (change / previousClose) * 100 : 0

  return {
    price,
    change,
    changePercent,
    provider: 'YAHOO',
  }
}

async function fetchTwelveDataHistory(
  symbol: string,
  _assetType: string,
  timeframe?: string,
  reasons?: string[]
): Promise<UnifiedHistory | null> {
  if (!TWELVE_DATA_API_KEY) return null

  try {
    const mapped = mapTwelveInterval(timeframe)
    const url =
      `https://api.twelvedata.com/time_series?symbol=${encodeURIComponent(symbol)}` +
      `&interval=${mapped.interval}&outputsize=${mapped.outputsize}&apikey=${TWELVE_DATA_API_KEY}`

    const response = await fetch(url, { cache: 'no-store' })
    if (!response.ok) {
      reasons?.push(`Twelve Data history HTTP error ${response.status} for ${symbol}`)
      return null
    }

    const data = (await response.json()) as TwelveDataTimeSeriesResponse
    if (data?.status === 'error' || !Array.isArray(data?.values) || data.values.length === 0) {
      reasons?.push(`Twelve Data history unavailable for ${symbol}`)
      return null
    }

    const candles: UnifiedCandle[] = data.values
      .map((entry: TwelveDataTimeSeriesEntry) => {
        if (!entry.datetime) {
          return null
        }

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

    if (candles.length === 0) {
      reasons?.push(`Twelve Data history contained no valid candles for ${symbol}`)
      return null
    }

    return {
      candles,
      provider: 'TWELVE_DATA',
    }
  } catch (error) {
    reasons?.push(`Twelve Data history exception for ${symbol}`)
    console.error(`Twelve Data history error for ${symbol}:`, error)
    return null
  }
}

async function fetchYahooHistory(
  ticker: string,
  _assetType: string,
  timeframe?: string,
  reasons?: string[]
): Promise<UnifiedHistory | null> {
  const { interval, period } = mapYahooInterval(timeframe)
  const result = await fetchYahooChart(ticker, interval, period, reasons)
  if (!result) return null

  const timestamps = result.timestamp || []
  const quote = result.indicators?.quote?.[0]
  const openList = quote?.open || []
  const highList = quote?.high || []
  const lowList = quote?.low || []
  const closeList = quote?.close || []
  const volumeList = quote?.volume || []

  if (timestamps.length === 0 || closeList.length === 0) {
    reasons?.push(`Yahoo history unavailable for ${ticker}`)
    return null
  }

  const candles: UnifiedCandle[] = timestamps
    .map((timestampSeconds, index) => {
      const timestamp = timestampSeconds * 1000
      const open = toNumber(openList[index])
      const high = toNumber(highList[index])
      const low = toNumber(lowList[index])
      const close = toNumber(closeList[index])
      const volume = toNumber(volumeList[index]) ?? 0

      if (!open || !high || !low || !close) {
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

  if (candles.length === 0) {
    reasons?.push(`Yahoo history contained no valid candles for ${ticker}`)
    return null
  }

  return {
    candles,
    provider: 'YAHOO',
  }
}

export async function getForexQuote(symbol: string): Promise<UnifiedQuote | null> {
  const normalized = normalizeForex(symbol)
  const reasons: string[] = []
  const quote =
    (await fetchTwelveDataQuote(normalized, reasons)) ||
    (await fetchYahooQuote(toYahooForexTicker(normalized), reasons))

  if (!quote) {
    recordLiveFailure('forex', symbol, reasons)
  }

  return quote
}

export async function getCommodityQuote(symbol: string): Promise<UnifiedQuote | null> {
  const normalized = symbol.toUpperCase().replace(/[^A-Z]/g, '')
  const twelveSymbol = COMMODITY_TWELVE_SYMBOL_MAP[normalized] || normalized
  const yahooSymbol = COMMODITY_YAHOO_SYMBOL_MAP[normalized] || normalized

  const reasons: string[] = []
  const quote =
    (await fetchTwelveDataQuote(twelveSymbol, reasons)) ||
    (await fetchYahooQuote(yahooSymbol, reasons))

  if (!quote) {
    recordLiveFailure('commodities', symbol, reasons)
  }

  return quote
}

export async function getIndexQuote(symbol: string): Promise<UnifiedQuote | null> {
  const normalized = symbol.toUpperCase().replace(/[^A-Z0-9]/g, '')
  const twelveSymbol = INDEX_TWELVE_SYMBOL_MAP[normalized] || normalized
  const yahooSymbol = INDEX_YAHOO_SYMBOL_MAP[normalized] || normalized

  const reasons: string[] = []
  const quote =
    (await fetchTwelveDataQuote(twelveSymbol, reasons)) ||
    (await fetchYahooQuote(yahooSymbol, reasons))

  if (!quote) {
    recordLiveFailure('indices', symbol, reasons)
  }

  return quote
}

export async function getCryptoQuote(symbol: string): Promise<UnifiedQuote | null> {
  const normalized = normalizeCrypto(symbol)
  const reasons: string[] = []
  const quote =
    (await fetchTwelveDataQuote(normalized, reasons)) ||
    (await fetchYahooQuote(toYahooCryptoTicker(normalized), reasons))

  if (!quote) {
    recordLiveFailure('crypto', symbol, reasons)
  }

  return quote
}

/**
 * Fetch historical candles for a symbol using Twelve Data as the primary source, with Yahoo as backend fallback only.
 * This function is only called server-side. All frontend code must use backend API endpoints.
 */
export async function getHistoricalCandles(
  symbol: string,
  assetType: string,
  timeframe?: string
): Promise<UnifiedHistory | null> {
  const normalizedAssetType = assetType.toLowerCase()
  const normalizedSymbol = symbol.toUpperCase()
  const reasons: string[] = []

  // Always use Twelve Data first, Yahoo only as backend fallback
  if (normalizedAssetType === 'forex') {
    const twelveSymbol = normalizeForex(normalizedSymbol)
    const yahooSymbol = toYahooForexTicker(normalizedSymbol)
    const history =
      (await fetchTwelveDataHistory(twelveSymbol, normalizedAssetType, timeframe, reasons)) ||
      (await fetchYahooHistory(yahooSymbol, normalizedAssetType, timeframe, reasons))

    if (!history) {
      recordLiveFailure('forex-history', symbol, reasons)
    }

    return history
  }

  if (normalizedAssetType === 'crypto') {
    const twelveSymbol = normalizeCrypto(normalizedSymbol)
    const yahooSymbol = toYahooCryptoTicker(normalizedSymbol)
    const history =
      (await fetchTwelveDataHistory(twelveSymbol, normalizedAssetType, timeframe, reasons)) ||
      (await fetchYahooHistory(yahooSymbol, normalizedAssetType, timeframe, reasons))

    if (!history) {
      recordLiveFailure('crypto-history', symbol, reasons)
    }

    return history
  }

  if (normalizedAssetType === 'commodities') {
    const clean = normalizedSymbol.replace(/[^A-Z]/g, '')
    const twelveSymbol = COMMODITY_TWELVE_SYMBOL_MAP[clean] || clean
    const yahooSymbol = COMMODITY_YAHOO_SYMBOL_MAP[clean] || clean
    const history =
      (await fetchTwelveDataHistory(twelveSymbol, normalizedAssetType, timeframe, reasons)) ||
      (await fetchYahooHistory(yahooSymbol, normalizedAssetType, timeframe, reasons))

    if (!history) {
      recordLiveFailure('commodities-history', symbol, reasons)
    }

    return history
  }

  if (normalizedAssetType === 'index' || normalizedAssetType === 'indices') {
    const clean = normalizedSymbol.replace(/[^A-Z0-9]/g, '')
    const twelveSymbol = INDEX_TWELVE_SYMBOL_MAP[clean] || clean
    const yahooSymbol = INDEX_YAHOO_SYMBOL_MAP[clean] || clean
    const history =
      (await fetchTwelveDataHistory(twelveSymbol, 'indices', timeframe, reasons)) ||
      (await fetchYahooHistory(yahooSymbol, 'indices', timeframe, reasons))

    if (!history) {
      recordLiveFailure('indices-history', symbol, reasons)
    }

    return history
  }

  // Default: try Twelve Data, then Yahoo as backend fallback
  const history =
    (await fetchTwelveDataHistory(normalizedSymbol, normalizedAssetType, timeframe, reasons)) ||
    (await fetchYahooHistory(normalizedSymbol, normalizedAssetType, timeframe, reasons))

  if (!history) {
    recordLiveFailure(`${normalizedAssetType}-history`, symbol, reasons)
  }

  return history
}
