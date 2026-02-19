import { NextRequest, NextResponse } from 'next/server'
import { getTradeJournal } from '@/lib/tradeJournal'
import { closeTrade } from '@/lib/tradeExecutor'
import { categorizeAsset } from '@/lib/telegramClient'
import {
  getForexQuote,
  getCryptoQuote,
  getIndexQuote,
  getCommodityQuote,
} from '@/lib/marketDataProvider'
import { notifyTradeClosed } from '@/lib/telegramNotifier'

async function getLivePrice(symbol: string, category: string): Promise<number | null> {
  if (category === 'FOREX') {
    const quote = await getForexQuote(symbol)
    return quote?.price ?? null
  }
  if (category === 'CRYPTO') {
    const quote = await getCryptoQuote(symbol)
    return quote?.price ?? null
  }
  if (category === 'INDICES') {
    const quote = await getIndexQuote(symbol)
    return quote?.price ?? null
  }
  if (category === 'COMMODITIES') {
    const quote = await getCommodityQuote(symbol)
    return quote?.price ?? null
  }
  return null
}

function pickTargetPrice(
  trade: {
    signal: 'BUY' | 'SELL'
    takeProfit: number
    takeProfitTargets?: Array<{ label: string; value: number }>
  },
  price: number
): { label: string; value: number } | null {
  const targets = trade.takeProfitTargets?.length
    ? trade.takeProfitTargets
    : [{ label: 'TP', value: trade.takeProfit }]

  if (!targets.length) return null

  const sorted = targets
    .slice()
    .sort((a, b) => (trade.signal === 'BUY' ? a.value - b.value : b.value - a.value))

  if (trade.signal === 'BUY') {
    const hit = sorted.filter(t => price >= t.value)
    return hit.length ? hit[hit.length - 1] : null
  }

  const hit = sorted.filter(t => price <= t.value)
  return hit.length ? hit[hit.length - 1] : null
}

function formatDuration(start?: number, end?: number): string {
  if (!start || !end) return 'n/a'
  const seconds = Math.max(1, Math.floor((end - start) / 1000))
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m`
  return `${seconds}s`
}

export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret')
  const expected = process.env.CRON_SECRET

  if (expected && secret !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const journal = getTradeJournal()
  const openTrades = journal.getAllTrades().filter(trade => trade.status === 'OPEN')

  const closed: Array<{ id: string; symbol: string; target: string }> = []
  const skipped: Array<{ id: string; reason: string }> = []

  for (const trade of openTrades) {
    try {
      const category = trade.category || categorizeAsset(trade.symbol)
      const livePrice = await getLivePrice(trade.symbol, category)
      if (!livePrice) {
        skipped.push({ id: trade.id, reason: 'No live price' })
        continue
      }

      const target = pickTargetPrice(trade, livePrice)
      if (!target) {
        continue
      }

      const result = closeTrade(trade, target.value)
      journal.addTrade(result.updatedTrade)

      await notifyTradeClosed({
        tradeId: result.updatedTrade.id,
        asset: result.updatedTrade.asset,
        signal: result.updatedTrade.signal,
        entry: result.updatedTrade.entryPrice,
        exit: target.value,
        pnl: result.updatedTrade.pnl || 0,
        pnlPercent: result.updatedTrade.pnlPercent || 0,
        lotSize: result.updatedTrade.quantity,
        duration: formatDuration(result.updatedTrade.openTime, result.updatedTrade.closeTime),
      })

      closed.push({
        id: result.updatedTrade.id,
        symbol: result.updatedTrade.symbol,
        target: target.label,
      })
    } catch (error) {
      skipped.push({ id: trade.id, reason: error instanceof Error ? error.message : 'Error' })
    }
  }

  return NextResponse.json({
    ok: true,
    checked: openTrades.length,
    closed: closed.length,
    closedTrades: closed,
    skipped,
  })
}
