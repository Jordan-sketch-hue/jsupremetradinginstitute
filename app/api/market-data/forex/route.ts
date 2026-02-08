import { NextRequest, NextResponse } from 'next/server'

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'sandbox'
const FCS_API_KEY = process.env.FCS_API_KEY || ''
const ALLTICK_API_KEY = process.env.ALLTICK_API_KEY || ''

interface ForexPrice {
  symbol: string
  bid: number
  ask: number
  timestamp: string
  change: number
  changePercent: number
  dataSource: 'LIVE' | 'DEMO'
}

// Cache with TTL to respect rate limits
const cache = new Map<string, { data: ForexPrice[]; timestamp: number }>()
const previousPrices = new Map<string, number>()
const CACHE_TTL = 30 * 1000 // 30 seconds for fresh data

async function fetchForexFromFCS(symbol: string): Promise<ForexPrice | null> {
  if (!FCS_API_KEY) return null

  try {
    // FCS uses format like EUR/USD
    const formatted = symbol.includes('/') ? symbol : `${symbol.slice(0, 3)}/${symbol.slice(3)}`
    const url = `https://fcsapi.com/api-v3/forex/latest?symbol=${formatted}&access_key=${FCS_API_KEY}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.status && data.response && data.response.length > 0) {
      const price = parseFloat(data.response[0].price || data.response[0].c)
      const change = parseFloat(data.response[0].ch || 0)
      const changePercent = parseFloat(data.response[0].cp || 0)

      return {
        symbol,
        bid: price * 0.9999,
        ask: price * 1.0001,
        timestamp: new Date().toISOString(),
        change,
        changePercent,
        dataSource: 'LIVE',
      }
    }
  } catch (error) {
    console.error(`FCS error for ${symbol}:`, error)
  }
  return null
}

async function fetchForexFromFinnhub(symbol: string): Promise<ForexPrice | null> {
  try {
    const normalized = symbol.includes('/') ? symbol.replace('/', '') : symbol
    const base = normalized.slice(0, 3)
    const quote = normalized.slice(3)
    const finnhubSymbol = `OANDA:${base}_${quote}`
    const url = `https://finnhub.io/api/v1/quote?symbol=${finnhubSymbol}&token=${FINNHUB_API_KEY}`

    const response = await fetch(url)
    const data = await response.json()

    if (data.c && data.c > 0) {
      return {
        symbol,
        bid: data.c * 0.9999,
        ask: data.c * 1.0001,
        timestamp: new Date().toISOString(),
        change: data.d || 0,
        changePercent: data.dp || 0,
        dataSource: 'LIVE',
      }
    }
  } catch (error) {
    console.error(`Finnhub error for ${symbol}:`, error)
  }
  return null
}

async function fetchForexFromAlphaVantage(symbols: string[]): Promise<ForexPrice[]> {
  const results: ForexPrice[] = []

  for (const symbol of symbols) {
    const cacheKey = `forex-${symbol}`
    const cached = cache.get(cacheKey)

    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      results.push(...cached.data)
      continue
    }

    let priceData: ForexPrice | null = null

    // Try AlphaVantage with key rotation
    for (let attempt = 0; attempt < ALPHA_VANTAGE_KEYS.length; attempt++) {
      try {
        const apiKey = ALPHA_VANTAGE_KEYS[currentKeyIndex]
        currentKeyIndex = (currentKeyIndex + 1) % ALPHA_VANTAGE_KEYS.length

        const [base, quote] = symbol.split('/')
        const url = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${base}&to_currency=${quote}&apikey=${apiKey}`

        const response = await fetch(url)
        const data = await response.json()

        if (data['Realtime Currency Exchange Rate']) {
          const rate = data['Realtime Currency Exchange Rate']
          const currentPrice = parseFloat(rate['5. Exchange Rate'])

          // Calculate real change% from previous price
          const previousPrice = previousPrices.get(symbol)
          const change = previousPrice ? currentPrice - previousPrice : 0
          const changePercent = previousPrice
            ? ((currentPrice - previousPrice) / previousPrice) * 100
            : 0

          // Store current price for next comparison
          previousPrices.set(symbol, currentPrice)

          priceData = {
            symbol,
            bid: currentPrice * 0.9999,
            ask: currentPrice * 1.0001,
            timestamp: new Date().toISOString(),
            change: change,
            changePercent: changePercent,
            dataSource: 'LIVE',
          }
          break
        }
      } catch (error) {
        console.error(`AlphaVantage attempt ${attempt + 1} failed for ${symbol}`)
      }
    }

    // Fallback to Finnhub if AlphaVantage fails
    if (!priceData) {
      priceData = await fetchForexFromFinnhub(symbol)
    }

    // Last resort: demo data
    if (!priceData) {
      const basePrice = Math.random() * 2 + 0.5
      priceData = {
        symbol,
        bid: basePrice * 0.9999,
        ask: basePrice * 1.0001,
        timestamp: new Date().toISOString(),
        change: (Math.random() - 0.5) * 0.01,
        changePercent: (Math.random() - 0.5) * 0.5,
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
    const data = await fetchForexData(symbols)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Forex API error:', error)
    return NextResponse.json({ error: 'Failed to fetch forex data' }, { status: 500 })
  }
}
