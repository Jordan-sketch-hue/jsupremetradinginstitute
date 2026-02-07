import { NextRequest, NextResponse } from 'next/server'

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

// CoinGecko free API - no rate limits
const cache = new Map<string, { data: CryptoPrice[]; timestamp: number }>()
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes

const coinGeckoMap: Record<string, string> = {
  'BTC/USD': 'bitcoin',
  'ETH/USD': 'ethereum',
  'BCH/USD': 'bitcoin-cash',
  'XNG/USD': 'tether', // placeholder
}

async function fetchCryptoFromCoinGecko(symbols: string[]): Promise<CryptoPrice[]> {
  const results: CryptoPrice[] = []

  for (const symbol of symbols) {
    const cacheKey = `crypto-${symbol}`
    const cached = cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      results.push(...cached.data)
      continue
    }

    try {
      const coinId = coinGeckoMap[symbol] || symbol.split('/')[0].toLowerCase()
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=true&include_24hr_change=true`

      const response = await fetch(url)
      const data = await response.json()

      if (data[coinId]) {
        const coin = data[coinId]
        const price: CryptoPrice = {
          symbol,
          price: coin.usd,
          marketCap: coin.usd_market_cap || 0,
          volume24h: coin.usd_24h_vol || 0,
          change24h: coin.usd * (coin.usd_24h_change / 100),
          changePercent24h: coin.usd_24h_change || 0,
          timestamp: new Date().toISOString(),
          dataSource: 'LIVE',
        }

        results.push(price)
        cache.set(cacheKey, { data: [price], timestamp: Date.now() })
      }
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error)
    }
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
    const data = await fetchCryptoFromCoinGecko(symbols)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Crypto API error:', error)
    return NextResponse.json({ error: 'Failed to fetch crypto data' }, { status: 500 })
  }
}
