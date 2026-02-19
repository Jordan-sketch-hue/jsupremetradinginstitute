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
      throw new Error('Failed to fetch candles')
    }

    const { candles } = await histResponse.json()

    // Detect order blocks
    let orderBlocks = detectOrderBlocks(candles)

    // Find support/resistance
    const { support, resistance } = findLevels(candles)

    // If no order blocks detected, create proxy zones from support/resistance
    if (orderBlocks.length === 0) {
      const rangePct = assetType === 'forex' ? 0.002 : assetType === 'crypto' ? 0.01 : 0.004
      const supportBlocks = support.map(level => ({
        type: 'BULLISH' as const,
        priceLevel: level,
        range: { high: level * (1 + rangePct), low: level * (1 - rangePct) },
        strength: 55,
        timestamp: Date.now(),
        description: `Proxy bullish zone at ${level.toFixed(4)} (support-derived)`,
      }))
      const resistanceBlocks = resistance.map(level => ({
        type: 'BEARISH' as const,
        priceLevel: level,
        range: { high: level * (1 + rangePct), low: level * (1 - rangePct) },
        strength: 55,
        timestamp: Date.now(),
        description: `Proxy bearish zone at ${level.toFixed(4)} (resistance-derived)`,
      }))
      orderBlocks = [...supportBlocks, ...resistanceBlocks]
    }

    // Score the setup
    const { obConfidence, nearestOB } = scoreOrderBlockSetup(currentPrice, candles, signal)

    return NextResponse.json({
      symbol,
      signal,
      currentPrice,
      orderBlocks: orderBlocks.slice(-10), // Last 10 OBs
      obConfidence,
      nearestOB,
      support,
      resistance,
      timeframe,
      candleCount: candles.length,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Order block analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed', symbol }, { status: 500 })
  }
}
