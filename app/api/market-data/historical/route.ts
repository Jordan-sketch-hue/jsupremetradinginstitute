// This API route provides historical candles for all asset types.
// All frontend code must use this endpoint for historical data (never fetch Yahoo/Twelve Data directly from the browser).
// Yahoo fallback is only used server-side to avoid CORS issues.
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

function candleLimitForTimeframe(timeframe: string): number {
  const normalized = timeframe.toLowerCase()

  if (normalized === '1m') return 240
  if (normalized === '5m') return 300
  if (normalized === '15m') return 320
  if (normalized === '30m') return 320
  if (normalized === '1h') return 360
  if (normalized === '4h') return 420
  if (normalized === '1d') return 420
  if (normalized === '1w') return 520
  if (normalized === '1mo') return 240
  if (normalized === '3mo') return 240
  if (normalized === '6mo') return 240
  if (normalized === 'ytd') return 320
  if (normalized === '12mo') return 360
  if (normalized === 'all') return 720

  return 240
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const rawSymbol = searchParams.get('symbol')
  const symbol = rawSymbol?.toUpperCase()
  const normalizedSymbol = symbol ? symbol.replace(/[^A-Z0-9/\-]/g, '') : ''
  const assetType = searchParams.get('type') || 'forex'
  const timeframe = (searchParams.get('timeframe') || '1h').toLowerCase()

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol required' }, { status: 400 })
  }

  try {
    let candles: Candle[] | null = null
    let dataSource = 'LIVE'
    const candleLimit = candleLimitForTimeframe(timeframe)

    const historical = await getHistoricalCandles(normalizedSymbol, assetType, timeframe)
    if (historical) {
      candles = historical.candles
      dataSource = historical.provider
      console.log(
        `✅ Using ${historical.provider} data for ${normalizedSymbol}: ${candles.length} candles`
      )
    }

    if (!candles) {
      return NextResponse.json(
        {
          error: 'No live historical data available',
          symbol,
          dataSource: 'NONE',
        },
        { status: 503 }
      )
    }

    return NextResponse.json({
      symbol,
      candles: candles.slice(-candleLimit),
      count: candles.slice(-candleLimit).length,
      timeframe,
      dataSource,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Historical data error:', error)
    return NextResponse.json(
      {
        error: 'Failed to fetch historical data',
        symbol,
        dataSource: 'NONE',
      },
      { status: 500 }
    )
  }
}
