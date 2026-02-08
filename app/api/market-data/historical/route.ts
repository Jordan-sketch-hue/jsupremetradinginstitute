import { NextRequest, NextResponse } from 'next/server'

interface CandleData {
  t: number[]
  o: number[]
  h: number[]
  l: number[]
  c: number[]
  v: number[]
}

interface Candle {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Crypto symbols that should use Binance
const CRYPTO_SYMBOLS = ['BTCUSD', 'ETHUSD', 'SOLUSD', 'XRPUSD', 'ADAUSD', 'DOGEUSD']

async function getBinanceCandles(symbol: string): Promise<Candle[] | null> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/market-data/binance-history?symbol=${symbol}&interval=1h&limit=100`,
      { cache: 'no-store' }
    )

    if (!response.ok) return null
    const data = await response.json()

    if (!data.candles || data.candles.length === 0) return null

    return data.candles
  } catch (error) {
    console.error(`Binance fetch error for ${symbol}:`, error)
    return null
  }
}

async function getFinnhubCandles(symbol: string, resolution: string = 'D') {
  // Finnhub free tier: Get historical candles
  const apiKey = process.env.FINNHUB_API_KEY || 'sandbox'
  const from = Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000) // 90 days ago
  const to = Math.floor(Date.now() / 1000)

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`,
      { cache: 'no-store' }
    )

    if (!response.ok) return null
    const data: CandleData = await response.json()

    if (!data.t || data.t.length === 0) return null

    // Convert to candle format
    return data.t.map((timestamp, i) => ({
      timestamp: timestamp * 1000,
      open: data.o[i],
      high: data.h[i],
      low: data.l[i],
      close: data.c[i],
      volume: data.v[i],
    }))
  } catch (error) {
    console.error(`Finnhub error for ${symbol}:`, error)
    return null
  }
}

// Fallback: Generate mock candles based on current price
function generateMockCandles(currentPrice: number, count: number = 50) {
  const candles = []
  let price = currentPrice * 0.95

  for (let i = count; i > 0; i--) {
    const open = price
    const change = (Math.random() - 0.5) * (price * 0.02)
    const close = price + change
    const high = Math.max(open, close) * (1 + Math.random() * 0.01)
    const low = Math.min(open, close) * (1 - Math.random() * 0.01)
    const volume = Math.floor(Math.random() * 10000000 + 1000000)

    candles.push({
      timestamp: Date.now() - i * 24 * 60 * 60 * 1000,
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(low.toFixed(4)),
      close: parseFloat(close.toFixed(4)),
      volume,
    })

    price = close
  }

  return candles
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const rawSymbol = searchParams.get('symbol')
  const symbol = rawSymbol?.toUpperCase()
  const normalizedSymbol = symbol ? symbol.replace(/[^A-Z0-9]/g, '') : ''
  const assetType = searchParams.get('type') || 'forex'

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol required' }, { status: 400 })
  }

  const forexSymbolToFinnhub = (value: string) => {
    const base = value.slice(0, 3)
    const quote = value.slice(3)
    return `OANDA:${base}_${quote}`
  }

  const commoditiesSymbolMap: Record<string, string> = {
    XAUUSD: 'OANDA:XAU_USD',
    XAGUSD: 'OANDA:XAG_USD',
    XPTUSD: 'OANDA:XPT_USD',
    WTI: 'OANDA:WTICO_USD',
  }

  const indicesSymbolMap: Record<string, string> = {
    US500: '^GSPC',
    US30: '^DJI',
    USTEC: '^IXIC',
    DE40: '^GDAXI',
    UK100: '^FTSE',
  }

  try {
    let candles: Candle[] | null = null
    let dataSource = 'DEMO'

    // Priority 1: Binance for crypto (real data, free, no key)
    if (assetType === 'crypto' || CRYPTO_SYMBOLS.includes(normalizedSymbol)) {
      candles = await getBinanceCandles(normalizedSymbol)
      if (candles) {
        dataSource = 'BINANCE'
        console.log(`✅ Using BINANCE data for ${normalizedSymbol}: ${candles.length} candles`)
      }
    }

    // Priority 2: Finnhub for forex/stocks/indices (real data, API key)
    if (
      !candles &&
      (assetType === 'forex' ||
        assetType === 'stock' ||
        assetType === 'index' ||
        assetType === 'indices')
    ) {
      const finnhubSymbol =
        assetType === 'forex'
          ? forexSymbolToFinnhub(normalizedSymbol)
          : assetType === 'index' || assetType === 'indices'
            ? indicesSymbolMap[normalizedSymbol] || normalizedSymbol
            : normalizedSymbol
      candles = await getFinnhubCandles(finnhubSymbol)
      if (candles) {
        dataSource = 'FINNHUB'
        console.log(`✅ Using FINNHUB data for ${finnhubSymbol}: ${candles.length} candles`)
      }
    }

    if (!candles && assetType === 'commodities') {
      const finnhubSymbol = commoditiesSymbolMap[normalizedSymbol] || normalizedSymbol
      candles = await getFinnhubCandles(finnhubSymbol)
      if (candles) {
        dataSource = 'FINNHUB'
        console.log(`✅ Using FINNHUB data for ${finnhubSymbol}: ${candles.length} candles`)
      }
    }

    // Priority 3: Mock data fallback (demo)
    if (!candles) {
      const basePrice = Math.random() * 100 + 50
      candles = generateMockCandles(basePrice, 60)
      dataSource = 'DEMO'
      console.log(`⚠️ Using DEMO data for ${symbol}`)
    }

    return NextResponse.json({
      symbol,
      candles: candles.slice(-50), // Return last 50 candles for order block detection
      count: candles.slice(-50).length,
      dataSource,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Historical data error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch historical data',
        symbol,
        candles: generateMockCandles(50, 50), // Fallback to mock
        dataSource: 'DEMO',
      },
      { status: 500 }
    )
  }
}
