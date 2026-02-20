import { NextRequest, NextResponse } from 'next/server'
import { getCommodityQuote, fetchTwelveDataRSI } from '@/lib/marketDataProvider'

interface CommodityPrice {
  symbol: string
  price: number
  change: number
  changePercent: number
  rsi: number | null
  timestamp: string
  dataSource: 'LIVE'
}

const cache = new Map<string, { data: CommodityPrice[]; timestamp: number }>()
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbols = searchParams.get('symbols')?.split(',') || []

  if (symbols.length === 0) {
    return NextResponse.json({ error: 'No symbols provided' }, { status: 400 })
  }

  const results: CommodityPrice[] = []

  for (const symbol of symbols) {
    const cacheKey = `commodity-${symbol}`
    const cached = cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      results.push(...cached.data)
      continue
    }

    const quote = await getCommodityQuote(symbol)

    let priceData: CommodityPrice | null = null
    if (quote) {
      // Fetch RSI from Twelve Data
      const rsi = await fetchTwelveDataRSI(symbol, '1h', 14)
      priceData = {
        symbol,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        rsi,
        timestamp: new Date().toISOString(),
        dataSource: 'LIVE',
      }
    }

    if (!priceData) {
      continue
    }

    results.push(priceData)
    cache.set(cacheKey, { data: [priceData], timestamp: Date.now() })
  }

  if (results.length === 0) {
    return NextResponse.json(
      { error: 'No live commodity data available', unavailableSymbols: symbols },
      { status: 503 }
    )
  }

  return NextResponse.json(results)
}
