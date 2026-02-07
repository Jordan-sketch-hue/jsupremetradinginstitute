import { NextRequest, NextResponse } from 'next/server'

// AlphaVantage free tier: 5 calls/min, 500/day
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'demo'

interface ForexPrice {
  symbol: string
  bid: number
  ask: number
  timestamp: string
  change: number
  changePercent: number
}

// Cache with TTL to respect rate limits
const cache = new Map<string, { data: ForexPrice[]; timestamp: number }>()
const CACHE_TTL = 60 * 1000 // 1 minute

async function fetchForexFromAlphaVantage(symbols: string[]): Promise<ForexPrice[]> {
  const results: ForexPrice[] = []

  for (const symbol of symbols) {
    const cacheKey = `forex-${symbol}`
    const cached = cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      results.push(...cached.data)
      continue
    }

    try {
      const [base, quote] = symbol.split('/')
      const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${base}&to_currency=${quote}&apikey=${ALPHA_VANTAGE_API_KEY}`

      const response = await fetch(url)
      const data = await response.json()

      if (data['Realtime Currency Exchange Rate']) {
        const rate = data['Realtime Currency Exchange Rate']
        const price: ForexPrice = {
          symbol,
          bid: parseFloat(rate['5. Exchange Rate']) * 0.9999,
          ask: parseFloat(rate['5. Exchange Rate']) * 1.0001,
          timestamp: new Date().toISOString(),
          change:
            parseFloat(rate['5. Exchange Rate']) - parseFloat(rate['5. Exchange Rate']) * 0.995,
          changePercent: Math.random() * 2 - 1, // Placeholder: 0.5% range
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
    const data = await fetchForexFromAlphaVantage(symbols)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Forex API error:', error)
    return NextResponse.json({ error: 'Failed to fetch forex data' }, { status: 500 })
  }
}
