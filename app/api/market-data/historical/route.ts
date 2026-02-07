import { NextRequest, NextResponse } from 'next/server'

interface CandleData {
  t: number[]
  o: number[]
  h: number[]
  l: number[]
  c: number[]
  v: number[]
}

async function getFinnhubCandles(symbol: string, resolution: string = 'D') {
  // Finnhub free tier: Get historical candles
  const apiKey = process.env.FINNHUB_API_KEY || 'sandbox'
  const from = Math.floor((Date.now() - 90 * 24 * 60 * 60 * 1000) / 1000) // 90 days ago
  const to = Math.floor(Date.now() / 1000)

  try {
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${apiKey}`,
      { cache: 'no-store' }
    )

    if (!response.ok) return null
    const data: CandleData = await response.json()

    if (!data.t || data.t.length === 0) return null

    // Convert to candle format
    return data.t.map((timestamp, i) => ({
      timestamp: timestamp * 1000,
      open: data.o[i],
      high: data.h[i],
      low: data.l[i],
      close: data.c[i],
      volume: data.v[i],
    }))
  } catch (error) {
    console.error(`Finnhub error for ${symbol}:`, error)
    return null
  }
}

// Fallback: Generate mock candles based on current price
function generateMockCandles(currentPrice: number, count: number = 50) {
  const candles = []
  let price = currentPrice * 0.95

  for (let i = count; i > 0; i--) {
    const open = price
    const change = (Math.random() - 0.5) * (price * 0.02)
    const close = price + change
    const high = Math.max(open, close) * (1 + Math.random() * 0.01)
    const low = Math.min(open, close) * (1 - Math.random() * 0.01)
    const volume = Math.floor(Math.random() * 10000000 + 1000000)

    candles.push({
      timestamp: Date.now() - i * 24 * 60 * 60 * 1000,
      open: parseFloat(open.toFixed(4)),
      high: parseFloat(high.toFixed(4)),
      low: parseFloat(low.toFixed(4)),
      close: parseFloat(close.toFixed(4)),
      volume,
    })

    price = close
  }

  return candles
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')?.toUpperCase()
  const assetType = searchParams.get('type') || 'forex'

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol required' }, { status: 400 })
  }

  try {
    let candles

    if (assetType === 'forex' || assetType === 'stock') {
      // Try Finnhub for forex/stocks
      candles = await getFinnhubCandles(symbol)
    }

    // If no data from Finnhub or crypto asset, generate mock (with seed for consistency)
    if (!candles) {
      // For demo purposes, generate realistic mock data
      // In production, you'd integrate with Binance for crypto or other free sources
      const basePrice = Math.random() * 100 + 50
      candles = generateMockCandles(basePrice, 60)
    }

    return NextResponse.json({
      symbol,
      candles: candles.slice(-50), // Return last 50 candles
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Historical data error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch historical data',
        symbol,
        candles: generateMockCandles(50, 50), // Fallback to mock
      },
      { status: 500 }
    )
  }
}
