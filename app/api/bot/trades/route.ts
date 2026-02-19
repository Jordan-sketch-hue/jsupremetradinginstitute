import { NextRequest, NextResponse } from 'next/server'
import { getTradeJournal } from '@/lib/tradeJournal'

export async function GET(request: NextRequest) {
  try {
    const journal = getTradeJournal()
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status')
    const asset = searchParams.get('asset')
    const limit = Math.min(parseInt(searchParams.get('limit') || '100'), 1000)

    const filter: Record<string, any> = {}
    if (status) filter.status = status
    if (asset) filter.asset = asset

    let trades =
      Object.keys(filter).length > 0 ? journal.filterTrades(filter) : journal.getAllTrades()
    trades = trades.slice(0, limit)

    const response: any = { trades, count: trades.length }
    if (searchParams.get('stats') === 'true') {
      response.stats = journal.calculateStats(trades)
    }

    return NextResponse.json(response)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch trades' }, { status: 500 })
  }
}
