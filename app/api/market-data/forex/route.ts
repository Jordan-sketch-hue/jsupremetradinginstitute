import { NextRequest, NextResponse } from 'next/server'
import { getForexQuote } from '@/lib/marketDataProvider'

interface ForexPrice {
  symbol: string
  bid: number
  ask: number
  timestamp: string
  change: number
  changePercent: number
  dataSource: 'LIVE'
}

// Cache with TTL to respect rate limits
const cache = new Map<string, { data: ForexPrice[]; timestamp: number }>()
const CACHE_TTL = 30 * 1000 // 30 seconds for fresh data

async function fetchForexData(symbols: string[]): Promise<ForexPrice[]> {
  const results: ForexPrice[] = []

  for (const symbol of symbols) {
    const cacheKey = `forex-${symbol}`
    const cached = cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      results.push(...cached.data)
      continue
    }

    const quote = await getForexQuote(symbol)

    let priceData: ForexPrice | null = null
    if (quote) {
      priceData = {
        symbol,
        bid: quote.price * 0.9999,
        ask: quote.price * 1.0001,
        timestamp: new Date().toISOString(),
        change: quote.change,
        changePercent: quote.changePercent,
        dataSource: 'LIVE',
      }
    }

    if (!priceData) {
      continue
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
    const data = await fetchForexData(symbols)

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'No live forex data available', unavailableSymbols: symbols },
        { status: 503 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Forex API error:', error)
    return NextResponse.json({ error: 'Failed to fetch forex data' }, { status: 500 })
  }
}
