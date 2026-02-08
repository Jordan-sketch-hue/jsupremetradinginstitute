import { NextRequest, NextResponse } from 'next/server'

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'sandbox'

interface CryptoPrice {
  symbol: string
  price: number
  marketCap: number
  volume24h: number
  change24h: number
  changePercent24h: number
  timestamp: string
  dataSource: 'LIVE' | 'DEMO'
}

const cache = new Map<string, { data: CryptoPrice[]; timestamp: number }>()
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes

const finnhubSymbolMap: Record<string, string> = {
  'BTC/USD': 'BINANCE:BTCUSDT',
  'ETH/USD': 'BINANCE:ETHUSDT',
  'BCH/USD': 'BINANCE:BCHUSDT',
  'XRP/USD': 'BINANCE:XRPUSDT',
  'LTC/USD': 'BINANCE:LTCUSDT',
}

async function fetchCryptoFromFinnhub(symbol: string): Promise<CryptoPrice | null> {
  try {
    const finnhubSymbol = finnhubSymbolMap[symbol] || `BINANCE:${symbol.replace('/', '')}USDT`
    const url = `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${FINNHUB_API_KEY}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.c && data.c > 0) {
      return {
        symbol,
        price: data.c,
        marketCap: 0,
        volume24h: 0,
        change24h: data.d || 0,
        changePercent24h: data.dp || 0,
        timestamp: new Date().toISOString(),
        dataSource: 'LIVE',
      }
    }
  } catch (error) {
    console.error(`Finnhub error for ${symbol}:`, error)
  }
  return null
}

async function fetchCryptoData(symbols: string[]): Promise<CryptoPrice[]> {
  const results: CryptoPrice[] = []

  for (const symbol of symbols) {
    const cacheKey = `crypto-${symbol}`
    const cached = cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      results.push(...cached.data)
      continue
    }

    let priceData = await fetchCryptoFromFinnhub(symbol)

    // Fallback to demo data
    if (!priceData) {
      const basePrices: Record<string, number> = {
        'BTC/USD': 45000,
        'ETH/USD': 2500,
        'BCH/USD': 300,
      }
      const basePrice = basePrices[symbol] || 100
      priceData = {
        symbol,
        price: basePrice + (Math.random() - 0.5) * (basePrice * 0.02),
        marketCap: 0,
        volume24h: 0,
        change24h: (Math.random() - 0.5) * (basePrice * 0.01),
        changePercent24h: (Math.random() - 0.5) * 2,
        timestamp: new Date().toISOString(),
        dataSource: 'DEMO',
      }
    }

    results.push(priceData)
    cache.set(cacheKey, { data: [priceData], timestamp: Date.now() })
  }

  return results
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbols = searchParams.get('symbols')?.split(',') || []

  if (symbols.length === 0) {
    return NextResponse.json({ error: 'No symbols provided' }, { status: 400 })
  }

  try {
    const data = await fetchCryptoData(symbols)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Crypto API error:', error)
    return NextResponse.json({ error: 'Failed to fetch crypto data' }, { status: 500 })
  }
}
