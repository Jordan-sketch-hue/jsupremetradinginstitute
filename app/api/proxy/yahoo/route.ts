import { NextRequest, NextResponse } from 'next/server'

/**
 * Yahoo Finance Proxy API
 * Proxies Yahoo Finance chart requests server-side to bypass CORS.
 * Usage: /api/proxy/yahoo?symbol=BTC-USD&interval=1h&range=2mo
 * Only for fallback/debugging. Prefer Twelve Data for all production use.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const symbol = searchParams.get('symbol')
  const interval = searchParams.get('interval') || '1h'
  const range = searchParams.get('range') || '2mo'
  if (!symbol) {
    return NextResponse.json({ error: 'symbol required' }, { status: 400 })
  }
  const url =
    `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}` +
    `?interval=${encodeURIComponent(interval)}&range=${encodeURIComponent(range)}` +
    '&includePrePost=false&events=div%2Csplits'
  try {
    const res = await fetch(url, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
      cache: 'no-store',
    })
    if (!res.ok) {
      return NextResponse.json({ error: `Yahoo error ${res.status}` }, { status: res.status })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Proxy error', details: String(error) }, { status: 500 })
  }
}
