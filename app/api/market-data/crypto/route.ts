import { NextRequest, NextResponse } from 'next/server'
import { getCryptoQuote } from '@/lib/marketDataProvider'

interface CryptoPrice {
  symbol: string
  price: number
  marketCap: number
  volume24h: number
  change24h: number
  changePercent24h: number
  timestamp: string
  dataSource: 'LIVE'
}

const cache = new Map<string, { data: CryptoPrice[]; timestamp: number }>()
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes

async function fetchCryptoData(symbols: string[]): Promise<CryptoPrice[]> {
  const results: CryptoPrice[] = []

  for (const symbol of symbols) {
    const cacheKey = `crypto-${symbol}`
    const cached = cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      results.push(...cached.data)
      continue
    }

    const quote = await getCryptoQuote(symbol)

    let priceData: CryptoPrice | null = null
    if (quote) {
      priceData = {
        symbol,
        price: quote.price,
        marketCap: 0,
        volume24h: 0,
        change24h: quote.change,
        changePercent24h: quote.changePercent,
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

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'No live crypto data available', unavailableSymbols: symbols },
        { status: 503 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Crypto API error:', error)
    return NextResponse.json({ error: 'Failed to fetch crypto data' }, { status: 500 })
  }
}
