import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

/**
 * Binance Historical Data API
 * Fetches real OHLCV candles from Binance public API (no key required)
 * Used for proper technical analysis and order block detection
 */

interface BinanceKline {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

// Symbol mapping: our format → Binance format
const SYMBOL_MAP: Record<string, string> = {
  BTCUSD: 'BTCUSDT',
  ETHUSD: 'ETHUSDT',
  SOLUSD: 'SOLUSDT',
  XRPUSD: 'XRPUSDT',
  ADAUSD: 'ADAUSDT',
  DOGEUSD: 'DOGEUSDT',
  MATICUSD: 'MATICUSDT',
  LINKUSD: 'LINKUSDT',
  AVAXUSD: 'AVAXUSDT',
  ATOMUSD: 'ATOMUSDT',
}

async function fetchBinanceCandles(
  symbol: string,
  interval: string = '1h',
  limit: number = 100
): Promise<BinanceKline[] | null> {
  try {
    const binanceSymbol = SYMBOL_MAP[symbol] || symbol

    // Binance public API endpoint (no authentication required)
    const url = `https://api.binance.com/api/v3/klines?symbol=${binanceSymbol}&interval=${interval}&limit=${limit}`

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error(`Binance API error for ${symbol}: ${response.status}`)
      return null
    }

    const data = await response.json()

    if (!Array.isArray(data) || data.length === 0) {
      console.error(`No Binance data for ${symbol}`)
      return null
    }

    // Binance kline format:
    // [
    //   [timestamp, open, high, low, close, volume, closeTime, ...]
    // ]
    const candles: BinanceKline[] = data.map((kline: any[]) => ({
      timestamp: kline[0], // Open time in milliseconds
      open: parseFloat(kline[1]),
      high: parseFloat(kline[2]),
      low: parseFloat(kline[3]),
      close: parseFloat(kline[4]),
      volume: parseFloat(kline[5]),
    }))

    return candles
  } catch (error) {
    console.error(`Failed to fetch Binance data for ${symbol}:`, error)
    return null
  }
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

    const candles = await fetchBinanceCandles(symbol, interval, limit)

    if (!candles) {
      return NextResponse.json(
        {
          error: 'Failed to fetch Binance data',
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
      dataSource: 'BINANCE',
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error('Binance history API error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: String(error) },
      { status: 500 }
    )
  }
}
