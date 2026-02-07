import { NextRequest, NextResponse } from 'next/server'
import { detectOrderBlocks, findLevels, scoreOrderBlockSetup } from '@/lib/orderBlockDetection'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')?.toUpperCase()
  const signal = searchParams.get('signal') || 'BUY'
  const currentPrice = parseFloat(searchParams.get('price') || '0')
  const assetType = searchParams.get('type') || 'forex'

  if (!symbol || currentPrice === 0) {
    return NextResponse.json({ error: 'Symbol and price required' }, { status: 400 })
  }

  try {
    // Fetch historical candles
    const histResponse = await fetch(
      `${request.nextUrl.origin}/api/market-data/historical?symbol=${symbol}&type=${assetType}`,
      { cache: 'no-store' }
    )

    if (!histResponse.ok) {
      throw new Error('Failed to fetch candles')
    }

    const { candles } = await histResponse.json()

    // Detect order blocks
    const orderBlocks = detectOrderBlocks(candles)

    // Score the setup
    const { obConfidence, nearestOB } = scoreOrderBlockSetup(currentPrice, candles, signal)

    // Find support/resistance
    const { support, resistance } = findLevels(candles)

    return NextResponse.json({
      symbol,
      signal,
      currentPrice,
      orderBlocks: orderBlocks.slice(-10), // Last 10 OBs
      obConfidence,
      nearestOB,
      support,
      resistance,
      candleCount: candles.length,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Order block analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed', symbol }, { status: 500 })
  }
}
