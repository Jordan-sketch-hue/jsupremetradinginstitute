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

async function fetchYahooChart(
  ticker: string,
  interval: string,
  range: string
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
      return null
    }

    const data = (await response.json()) as YahooChartResponse
    const result = data?.chart?.result?.[0]
    return result || null
  } catch (error) {
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

async function fetchYahooQuote(ticker: string): Promise<UnifiedQuote | null> {
  const result = await fetchYahooChart(ticker, '1d', '5d')
  if (!result) return null

  const quote = result.indicators?.quote?.[0]
  const closePrice = getLastFinite(quote?.close)
  const metaPrice = toNumber(result.meta?.regularMarketPrice)
  const previousClose = toNumber(result.meta?.previousClose)
  const price = metaPrice ?? closePrice

  if (!price || price <= 0) return null

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
  const result = await fetchYahooChart(ticker, interval, period)
  if (!result) return null

  const timestamps = result.timestamp || []
  const quote = result.indicators?.quote?.[0]
  const openList = quote?.open || []
  const highList = quote?.high || []
  const lowList = quote?.low || []
  const closeList = quote?.close || []
  const volumeList = quote?.volume || []

  if (timestamps.length === 0 || closeList.length === 0) return null

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
