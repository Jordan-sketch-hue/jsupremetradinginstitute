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
      candles: candles.slice(-120),
      count: candles.slice(-120).length,
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
