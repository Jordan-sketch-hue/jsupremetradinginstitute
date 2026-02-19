import { NextRequest, NextResponse } from 'next/server'
import { getHistoricalCandles } from '@/lib/marketDataProvider'

interface Candle {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
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
  const rawSymbol = searchParams.get('symbol')
  const symbol = rawSymbol?.toUpperCase()
  const normalizedSymbol = symbol ? symbol.replace(/[^A-Z0-9/\-]/g, '') : ''
  const assetType = searchParams.get('type') || 'forex'

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol required' }, { status: 400 })
  }

  try {
    let candles: Candle[] | null = null
    let dataSource = 'DEMO'

    const historical = await getHistoricalCandles(normalizedSymbol, assetType)
    if (historical) {
      candles = historical.candles
      dataSource = historical.provider
      console.log(
        `✅ Using ${historical.provider} data for ${normalizedSymbol}: ${candles.length} candles`
      )
    }

    // Priority 3: Mock data fallback (demo)
    if (!candles) {
      const basePrice = Math.random() * 100 + 50
      candles = generateMockCandles(basePrice, 60)
      dataSource = 'DEMO'
      console.log(`⚠️ Using DEMO data for ${symbol}`)
    }

    return NextResponse.json({
      symbol,
      candles: candles.slice(-50), // Return last 50 candles for order block detection
      count: candles.slice(-50).length,
      dataSource,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Historical data error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch historical data',
        symbol,
        candles: generateMockCandles(50, 50), // Fallback to mock
        dataSource: 'DEMO',
      },
      { status: 500 }
    )
  }
}
