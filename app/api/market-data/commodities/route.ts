import { NextRequest, NextResponse } from 'next/server'

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'sandbox'

interface CommodityPrice {
  symbol: string
  price: number
  change: number
  changePercent: number
  timestamp: string
  dataSource: 'LIVE' | 'DEMO'
}

const cache = new Map<string, { data: CommodityPrice[]; timestamp: number }>()
const CACHE_TTL = 2 * 60 * 1000 // 2 minutes

const finnhubSymbolMap: Record<string, string> = {
  XAUUSD: 'OANDA:XAU_USD', // Gold
  XAGUSD: 'OANDA:XAG_USD', // Silver
  XPTUSD: 'OANDA:XPT_USD', // Platinum
  WTI: 'OANDA:WTICO_USD', // WTI Crude Oil
}

async function fetchCommodityFromFinnhub(symbol: string): Promise<CommodityPrice | null> {
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

  const results: CommodityPrice[] = []

  for (const symbol of symbols) {
    const cacheKey = `commodity-${symbol}`
    const cached = cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      results.push(...cached.data)
      continue
    }

    let priceData = await fetchCommodityFromFinnhub(symbol)

    // Fallback to demo data if API fails
    if (!priceData) {
      const basePrices: Record<string, number> = {
        XAUUSD: 2000,
        XAGUSD: 24,
        XPTUSD: 950,
        WTI: 75,
      }
      const basePrice = basePrices[symbol] || 100
      priceData = {
        symbol,
        price: basePrice + (Math.random() - 0.5) * (basePrice * 0.02),
        change: (Math.random() - 0.5) * 5,
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
