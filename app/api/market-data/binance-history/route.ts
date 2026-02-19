import { NextRequest, NextResponse } from 'next/server'
import { getHistoricalCandles } from '@/lib/marketDataProvider'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

/**
 * Historical Data API (crypto-focused compatibility route)
 * Uses Twelve Data first, then Yahoo (yfinance) fallback.
 */

interface HistoricalKline {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const interval = searchParams.get('interval') || '1h'
    const limit = parseInt(searchParams.get('limit') || '100', 10)

    if (!symbol) {
      return NextResponse.json({ error: 'Symbol parameter required' }, { status: 400 })
    }

    const normalized = symbol.toUpperCase().replace(/[^A-Z0-9/\-]/g, '')
    const withSlash = normalized.includes('/')
      ? normalized
      : normalized.length >= 6
        ? `${normalized.slice(0, 3)}/${normalized.slice(3, 6)}`
        : normalized

    const history = await getHistoricalCandles(withSlash, 'crypto')
    const candles: HistoricalKline[] = history?.candles?.slice(-limit) || []

    if (candles.length === 0) {
      return NextResponse.json(
        {
          error: 'Failed to fetch historical data',
          symbol,
          dataSource: 'NONE',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      symbol,
      interval,
      candles,
      count: candles.length,
      dataSource: history?.provider || 'NONE',
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Historical API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
