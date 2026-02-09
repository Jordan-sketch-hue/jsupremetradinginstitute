import { NextRequest, NextResponse } from 'next/server'

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'sandbox'
const FCS_API_KEY = process.env.FCS_API_KEY || ''

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

const fcsSymbolMap: Record<string, string> = {
  XAUUSD: 'XAUUSD',
  XAGUSD: 'XAGUSD',
  XPTUSD: 'XPTUSD',
  WTI: 'WTIUSD',
}

async function fetchCommodityFromFCS(symbol: string): Promise<CommodityPrice | null> {
  if (!FCS_API_KEY) return null

  try {
    const fcsSymbol = fcsSymbolMap[symbol] || symbol.replace('/', '')
    const url = `https://api-v4.fcsapi.com/forex/latest?symbol=${fcsSymbol}&access_key=${FCS_API_KEY}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status && Array.isArray(data.response) && data.response.length > 0) {
      const priceEntry = data.response[0]
      const active = priceEntry.active || {}
      const currentPrice = parseFloat(active.c)
      const change = parseFloat(active.ch || 0)
      const changePercent = parseFloat(active.chp || 0)

      if (Number.isFinite(currentPrice) && currentPrice > 0) {
        return {
          symbol,
          price: currentPrice,
          change,
          changePercent,
          timestamp: new Date().toISOString(),
          dataSource: 'LIVE',
        }
      }
    }
  } catch (error) {
    console.error(`FCS error for ${symbol}:`, error)
  }

  return null
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

    let priceData = await fetchCommodityFromFCS(symbol)

    if (!priceData) {
      priceData = await fetchCommodityFromFinnhub(symbol)
    }

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
