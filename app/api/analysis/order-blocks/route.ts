import { NextRequest, NextResponse } from 'next/server'
import { detectOrderBlocks, findLevels, scoreOrderBlockSetup } from '@/lib/orderBlockDetection'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')?.toUpperCase()
  const signal = searchParams.get('signal') || 'BUY'
  const currentPrice = parseFloat(searchParams.get('price') || '0')
  const assetType = searchParams.get('type') || 'forex'
  const timeframe = (searchParams.get('timeframe') || '1h').toLowerCase()

  if (!symbol || currentPrice === 0) {
    return NextResponse.json({ error: 'Symbol and price required' }, { status: 400 })
  }

  try {
    // Fetch historical candles
    const histResponse = await fetch(
      `${request.nextUrl.origin}/api/market-data/historical?symbol=${symbol}&type=${assetType}&timeframe=${timeframe}`,
      { cache: 'no-store' }
    )

    if (!histResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch candles' }, { status: 500 })
    }

    const { candles } = await histResponse.json()
    if (!candles || !Array.isArray(candles) || candles.length === 0) {
      return NextResponse.json(
        {
          orderBlocks: [],
          error: 'No live candle data available',
          obConfidence: 0,
          nearestOB: null,
          candlesCount: 0,
          provider: 'LIVE',
        },
        { status: 500 }
      )
    }

    // Detect order blocks
    let orderBlocks = detectOrderBlocks(candles)

    // Find support/resistance
    const { support, resistance } = findLevels(candles)

    // If no order blocks detected, return empty array
    if (orderBlocks.length === 0) {
      return NextResponse.json(
        {
          orderBlocks: [],
          error: 'No live order blocks detected',
          obConfidence: 0,
          nearestOB: null,
          candlesCount: candles.length,
          provider: 'LIVE',
        },
        { status: 500 }
      )
    }

    // Score the setup
    const { obConfidence, nearestOB } = scoreOrderBlockSetup(currentPrice, candles, signal)

    return NextResponse.json({
      orderBlocks,
      obConfidence,
      nearestOB,
      candlesCount: candles.length,
      provider: 'LIVE',
    })
  } catch (err) {
    console.error('Order block analysis error:', err)
    return NextResponse.json(
      { error: 'Order block analysis error', details: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    )
  }
}
