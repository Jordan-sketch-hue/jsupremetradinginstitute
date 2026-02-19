import { NextRequest, NextResponse } from 'next/server'
import { getIndexQuote } from '@/lib/marketDataProvider'

interface IndexPrice {
  symbol: string
  price: number
  change: number
  changePercent: number
  timestamp: string
  dataSource: 'LIVE' | 'DEMO'
}

const cache = new Map<string, { data: IndexPrice[]; timestamp: number }>()
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbols = searchParams.get('symbols')?.split(',') || []

  if (symbols.length === 0) {
    return NextResponse.json({ error: 'No symbols provided' }, { status: 400 })
  }

  const results: IndexPrice[] = []

  for (const symbol of symbols) {
    const cacheKey = `index-${symbol}`
    const cached = cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      results.push(...cached.data)
      continue
    }

    const quote = await getIndexQuote(symbol)

    let priceData: IndexPrice | null = null
    if (quote) {
      priceData = {
        symbol,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        timestamp: new Date().toISOString(),
        dataSource: 'LIVE',
      }
    }

    // Fallback to demo data if API fails
    if (!priceData) {
      const basePrice = symbol === 'US500' ? 4500 : symbol === 'US30' ? 35000 : 14000
      priceData = {
        symbol,
        price: basePrice + (Math.random() - 0.5) * 100,
        change: (Math.random() - 0.5) * 50,
        changePercent: (Math.random() - 0.5) * 1,
        timestamp: new Date().toISOString(),
        dataSource: 'DEMO',
      }
    }

    results.push(priceData)
    cache.set(cacheKey, { data: [priceData], timestamp: Date.now() })
  }

  return NextResponse.json(results)
}
