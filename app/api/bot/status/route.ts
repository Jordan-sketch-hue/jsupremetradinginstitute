import { NextResponse } from 'next/server'
import { getTradeJournal } from '@/lib/tradeJournal'
import { getOpenTrades } from '@/lib/tradeExecutor'

export async function GET() {
  try {
    const journal = getTradeJournal()
    const openTrades = getOpenTrades()
    const allTrades = journal.getAllTrades()
    const stats = journal.calculateStats()

    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayTrades = journal.getTradesByDateRange(today, new Date())
    const todayStats = journal.calculateStats(todayTrades)

    return NextResponse.json({
      status: 'ONLINE',
      armed: process.env.ARMED === 'true',
      trading: process.env.ALLOW_TRADING === 'true',
      timestamp: new Date().toISOString(),
      summary: {
        totalTrades: stats.totalTrades,
        openTrades: openTrades.length,
        closedTrades: stats.closedTrades,
        winRate: stats.winRate,
        profitFactor: stats.profitFactor,
        totalPnL: stats.totalPnL,
        totalPnLPercent: stats.totalPnLPercent,
      },
      today: {
        trades: todayTrades.length,
        wins: todayStats.winningTrades,
        losses: todayStats.losingTrades,
        winRate: todayStats.winRate,
      },
      openPositions: openTrades.map(t => ({
        id: t.id,
        asset: t.asset,
        signal: t.signal,
        entry: t.entryPrice,
        quantity: t.quantity,
        riskReward: t.riskReward,
      })),
    })
  } catch (error) {
    return NextResponse.json({ status: 'ERROR' }, { status: 500 })
  }
}
