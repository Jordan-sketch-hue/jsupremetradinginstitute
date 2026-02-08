import { NextRequest, NextResponse } from 'next/server'

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'sandbox'

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

const finnhubSymbolMap: Record<string, string> = {
  US500: '^GSPC', // S&P 500
  US30: '^DJI', // Dow Jones
  USTEC: '^IXIC', // Nasdaq
  DE40: '^GDAXI', // DAX
  UK100: '^FTSE', // FTSE 100
  JP225: '^N225', // Nikkei
  HK50: '^HSI', // Hang Seng
  FR40: '^FCHI', // CAC 40
}

async function fetchIndexFromFinnhub(symbol: string): Promise<IndexPrice | null> {
  try {
    const finnhubSymbol = finnhubSymbolMap[symbol] || symbol
    const url = `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${FINNHUB_API_KEY}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.c && data.c > 0) {
      return {
        symbol,
        price: data.c,
        change: data.d || 0,
        changePercent: data.dp || 0,
        timestamp: new Date().toISOString(),
        dataSource: 'LIVE',
      }
    }
  } catch (error) {
    console.error(`Finnhub error for ${symbol}:`, error)
  }
  return null
}

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

    let priceData = await fetchIndexFromFinnhub(symbol)

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
