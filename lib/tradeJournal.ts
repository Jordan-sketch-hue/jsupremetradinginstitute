/**
 * Trade Journal - In-memory store for trades with CSV/JSON export
 * In production, this would connect to a real database (PostgreSQL, Supabase, etc.)
 */

import { BotTrade } from './tradeExecutor'
import fs from 'fs'
import path from 'path'

interface TradeStats {
  totalTrades: number
  openTrades: number
  closedTrades: number
  winningTrades: number
  losingTrades: number
  winRate: number
  totalPnL: number
  totalPnLPercent: number
  averageWin: number
  averageLoss: number
  largestWin: number
  largestLoss: number
  profitFactor: number
  riskRewardRatio: number
}

interface TradeFilter {
  status?: string
  asset?: string
  signal?: 'BUY' | 'SELL'
  startDate?: number
  endDate?: number
  minPnL?: number
  maxPnL?: number
}

class TradeJournal {
  private trades: Map<string, BotTrade> = new Map()
  private journalFile = process.env.TRADE_JOURNAL_FILE || 'trade_journal.csv'
  private jsonFile = process.env.TRADE_JOURNAL_JSON || 'trade_journal.jsonl'

  constructor() {
    this.loadTrades()
  }

  /**
   * Add or update trade
   */
  addTrade(trade: BotTrade): void {
    this.trades.set(trade.id, trade)
    this.saveTrades()
  }

  /**
   * Get trade by ID
   */
  getTrade(id: string): BotTrade | undefined {
    return this.trades.get(id)
  }

  /**
   * Get all trades
   */
  getAllTrades(): BotTrade[] {
    return Array.from(this.trades.values()).sort((a, b) => b.timestamp - a.timestamp)
  }

  /**
   * Filter trades
   */
  filterTrades(filter: TradeFilter): BotTrade[] {
    return this.getAllTrades().filter(trade => {
      if (filter.status && trade.status !== filter.status) return false
      if (filter.asset && trade.asset !== filter.asset) return false
      if (filter.signal && trade.signal !== filter.signal) return false
      if (filter.startDate && trade.timestamp < filter.startDate) return false
      if (filter.endDate && trade.timestamp > filter.endDate) return false
      if (filter.minPnL !== undefined && (trade.pnl === undefined || trade.pnl < filter.minPnL))
        return false
      if (filter.maxPnL !== undefined && (trade.pnl === undefined || trade.pnl > filter.maxPnL))
        return false
      return true
    })
  }

  /**
   * Calculate trading statistics
   */
  calculateStats(trades: BotTrade[] = this.getAllTrades()): TradeStats {
    const closed = trades.filter(t => t.status === 'CLOSED' && t.pnl !== undefined)
    const winning = closed.filter(t => t.pnl! > 0)
    const losing = closed.filter(t => t.pnl! < 0)

    const totalPnL = closed.reduce((sum, t) => sum + (t.pnl || 0), 0)
    const grossProfit = winning.reduce((sum, t) => sum + (t.pnl || 0), 0)
    const grossLoss = Math.abs(losing.reduce((sum, t) => sum + (t.pnl || 0), 0))

    const winRate = closed.length > 0 ? (winning.length / closed.length) * 100 : 0
    const averageWin = winning.length > 0 ? grossProfit / winning.length : 0
    const averageLoss = losing.length > 0 ? grossLoss / losing.length : 0
    const profitFactor = grossLoss > 0 ? grossProfit / grossLoss : grossProfit > 0 ? 999 : 0

    const allRiskRewards = trades.map(t => t.riskReward || 0).filter(r => r > 0)
    const riskRewardRatio =
      allRiskRewards.length > 0 ? allRiskRewards.reduce((a, b) => a + b) / allRiskRewards.length : 0

    const largestWin = winning.length > 0 ? Math.max(...winning.map(t => t.pnl || 0)) : 0
    const largestLoss = losing.length > 0 ? Math.min(...losing.map(t => t.pnl || 0)) : 0

    const totalPnLPercent =
      closed.length > 0
        ? closed.reduce((sum, t) => sum + (t.pnlPercent || 0), 0) / closed.length
        : 0

    return {
      totalTrades: trades.length,
      openTrades: trades.filter(t => t.status === 'OPEN' || t.status === 'PENDING').length,
      closedTrades: closed.length,
      winningTrades: winning.length,
      losingTrades: losing.length,
      winRate: Math.round(winRate * 100) / 100,
      totalPnL: Math.round(totalPnL * 100) / 100,
      totalPnLPercent: Math.round(totalPnLPercent * 100) / 100,
      averageWin: Math.round(averageWin * 100) / 100,
      averageLoss: Math.round(averageLoss * 100) / 100,
      largestWin: Math.round(largestWin * 100) / 100,
      largestLoss: Math.round(largestLoss * 100) / 100,
      profitFactor: Math.round(profitFactor * 100) / 100,
      riskRewardRatio: Math.round(riskRewardRatio * 100) / 100,
    }
  }

  /**
   * Export trades to CSV
   */
  exportCSV(trades: BotTrade[] = this.getAllTrades()): string {
    const headers = [
      'ID',
      'Date',
      'Asset',
      'Signal',
      'Type',
      'Entry',
      'EntryZone',
      'SL',
      'TP',
      'TPTargets',
      'Qty',
      'Status',
      'ExitPrice',
      'PnL',
      'PnL%',
      'RiskReward',
      'TargetHit',
    ]

    const rows = trades.map(t => [
      t.id,
      new Date(t.timestamp).toISOString(),
      t.asset,
      t.signal,
      t.orderType,
      t.entryPrice,
      t.entryZone || '',
      t.stopLoss,
      t.takeProfit,
      t.takeProfitTargets?.map(tp => `${tp.label} ${tp.value}`).join(' | ') || '',
      t.quantity,
      t.status,
      t.exitPrice || '',
      t.pnl || '',
      t.pnlPercent || '',
      t.riskReward || '',
      t.targetHit || '',
    ])

    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  /**
   * Export trades to JSONL (one JSON object per line)
   */
  exportJSONL(trades: BotTrade[] = this.getAllTrades()): string {
    return trades.map(t => JSON.stringify(t)).join('\n')
  }

  /**
   * Save trades to files
   */
  private saveTrades(): void {
    try {
      if (process.env.JOURNAL_ENABLED === 'true') {
        const csv = this.exportCSV()
        fs.writeFileSync(this.journalFile, csv, 'utf-8')
      }

      const jsonl = this.exportJSONL()
      fs.writeFileSync(this.jsonFile, jsonl, 'utf-8')
    } catch (error) {
      console.error('Failed to save trades:', error)
    }
  }

  /**
   * Load trades from files
   */
  private loadTrades(): void {
    try {
      if (fs.existsSync(this.jsonFile)) {
        const content = fs.readFileSync(this.jsonFile, 'utf-8')
        const lines = content.split('\n').filter(l => l.trim())

        for (const line of lines) {
          try {
            const trade = JSON.parse(line) as BotTrade
            this.trades.set(trade.id, trade)
          } catch {
            console.warn('Failed to parse trade line')
          }
        }
      }
    } catch (error) {
      console.error('Failed to load trades:', error)
    }
  }

  /**
   * Get trades by date range
   */
  getTradesByDateRange(startDate: Date, endDate: Date): BotTrade[] {
    return this.filterTrades({
      startDate: startDate.getTime(),
      endDate: endDate.getTime(),
    })
  }

  /**
   * Get trades by asset
   */
  getTradesByAsset(asset: string): BotTrade[] {
    return this.filterTrades({ asset })
  }

  /**
   * Get daily P&L
   */
  getDailyPnL(): Record<string, number> {
    const byDay: Record<string, BotTrade[]> = {}

    for (const trade of this.getAllTrades()) {
      const day = new Date(trade.timestamp).toISOString().split('T')[0]
      if (!byDay[day]) byDay[day] = []
      byDay[day].push(trade)
    }

    const result: Record<string, number> = {}
    for (const [day, trades] of Object.entries(byDay)) {
      const closed = trades.filter(t => t.status === 'CLOSED' && t.pnl !== undefined)
      result[day] = closed.reduce((sum, t) => sum + (t.pnl || 0), 0)
    }

    return result
  }

  /**
   * Get monthly summary
   */
  getMonthlySummary(): Record<string, TradeStats> {
    const byMonth: Record<string, BotTrade[]> = {}

    for (const trade of this.getAllTrades()) {
      const month = new Date(trade.timestamp).toISOString().substring(0, 7)
      if (!byMonth[month]) byMonth[month] = []
      byMonth[month].push(trade)
    }

    const result: Record<string, TradeStats> = {}
    for (const [month, trades] of Object.entries(byMonth)) {
      result[month] = this.calculateStats(trades)
    }

    return result
  }
}

// Create singleton instance
let journalInstance: TradeJournal | null = null

export function getTradeJournal(): TradeJournal {
  if (!journalInstance) {
    journalInstance = new TradeJournal()
  }
  return journalInstance
}

export type { TradeStats, TradeFilter }
export { TradeJournal }
