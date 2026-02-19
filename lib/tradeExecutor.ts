/**
 * Trade Executor - Handles MT5 order placement, validation, and tracking
 * Supports LIMIT and MARKET orders with risk management
 */

import { LRUCache } from 'lru-cache'

export interface BotTrade {
  id: string
  timestamp: number
  asset: string
  symbol: string
  signal: 'BUY' | 'SELL'
  orderType: 'MARKET' | 'LIMIT'
  entryPrice: number
  stopLoss: number
  takeProfit: number
  quantity: number
  status: 'PENDING' | 'OPEN' | 'PARTIAL' | 'CLOSED' | 'CANCELLED' | 'ERROR'
  openTime?: number
  closeTime?: number
  exitPrice?: number
  pnl?: number
  pnlPercent?: number
  reason?: string
  confidence?: number
  category: string
  riskReward?: number
}

export interface ExecutionResult {
  success: boolean
  trade?: BotTrade
  error?: string
  message?: string
}

// Risk management settings
const RISK_CONFIG = {
  perTradePct: parseFloat(process.env.RISK_PER_TRADE || '0.10'),
  maxSpreadPoints: parseInt(process.env.MAX_SPREAD_POINTS || '50'),
  maxOpenTrades: parseInt(process.env.MAX_TRADES_OPEN || '5'),
  defaultLot: parseFloat(process.env.DEFAULT_LOT || '0.10'),
  maxLot: parseFloat(process.env.DEFAULT_MAX_LOT || '2.0'),
}

// Track open trades per asset (prevent overlapping)
const openTradesCache = new LRUCache<string, BotTrade[]>({
  max: 100,
  ttl: 1000 * 60 * 60, // 1 hour
})

/**
 * Validate trade parameters before execution
 */
export function validateTradeParams(
  asset: string,
  entryPrice: number,
  stopLoss: number,
  takeProfit: number,
  signal: 'BUY' | 'SELL'
): { valid: boolean; reason?: string } {
  // Entry price must be set
  if (!entryPrice || entryPrice <= 0) {
    return { valid: false, reason: 'Invalid entry price' }
  }

  // SL and TP must be different from entry
  if (stopLoss === entryPrice || takeProfit === entryPrice) {
    return { valid: false, reason: 'SL/TP cannot equal entry price' }
  }

  // For BUY: SL < Entry < TP
  if (signal === 'BUY') {
    if (stopLoss >= entryPrice || takeProfit <= entryPrice) {
      return { valid: false, reason: 'BUY: SL must be < Entry, TP must be > Entry' }
    }
  }

  // For SELL: TP < Entry < SL
  if (signal === 'SELL') {
    if (takeProfit >= entryPrice || stopLoss <= entryPrice) {
      return { valid: false, reason: 'SELL: TP must be < Entry, SL must be > Entry' }
    }
  }

  // Risk/Reward ratio should be at least 1:1
  const riskPoints = Math.abs(entryPrice - stopLoss)
  const rewardPoints = Math.abs(takeProfit - entryPrice)
  const riskReward = rewardPoints / riskPoints

  if (riskReward < 0.5) {
    return { valid: false, reason: 'Risk/Reward too low (0.5:1 minimum)' }
  }

  return { valid: true }
}

/**
 * Calculate position size based on risk percentage
 */
export function calculatePositionSize(
  accountBalance: number,
  riskPct: number = RISK_CONFIG.perTradePct,
  entryPrice: number,
  stopLoss: number
): { quantity: number; riskAmount: number } {
  const riskAmount = accountBalance * riskPct
  const riskPoints = Math.abs(entryPrice - stopLoss)

  let quantity = riskAmount / riskPoints
  quantity = Math.min(quantity, RISK_CONFIG.maxLot)
  quantity = Math.max(quantity, RISK_CONFIG.defaultLot)

  // Round to 2 decimals
  quantity = Math.round(quantity * 100) / 100

  return { quantity, riskAmount }
}

/**
 * Calculate risk/reward ratio
 */
export function calculateRiskReward(
  entryPrice: number,
  stopLoss: number,
  takeProfit: number
): number {
  const risk = Math.abs(entryPrice - stopLoss)
  const reward = Math.abs(takeProfit - entryPrice)
  return reward / risk
}

/**
 * Create trade order (LIMIT or MARKET)
 */
export function createTradeOrder(
  asset: string,
  symbol: string,
  signal: 'BUY' | 'SELL',
  entryPrice: number,
  stopLoss: number,
  takeProfit: number,
  quantity: number,
  orderType: 'LIMIT' | 'MARKET' = 'MARKET',
  category: string = 'FOREX',
  confidence?: number
): BotTrade {
  const riskReward = calculateRiskReward(entryPrice, stopLoss, takeProfit)

  const trade: BotTrade = {
    id: `TRADE-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: Date.now(),
    asset,
    symbol,
    signal,
    orderType,
    entryPrice,
    stopLoss,
    takeProfit,
    quantity,
    status: orderType === 'LIMIT' ? 'PENDING' : 'OPEN',
    reason: `Bot execution: ${orderType} order @ ${entryPrice}`,
    confidence,
    category,
    riskReward,
  }

  return trade
}

/**
 * Simulate trade execution (for backtesting/paper trading)
 */
export function simulateTradeExecution(
  trade: BotTrade,
  currentPrice: number
): { executed: boolean; reason: string } {
  // For MARKET orders, execute immediately if reasonable
  if (trade.orderType === 'MARKET') {
    const slippage = Math.abs(currentPrice - trade.entryPrice) / trade.entryPrice

    if (slippage > 0.02) {
      // 2% slippage tolerance
      return {
        executed: false,
        reason: `Market slippage too high: ${(slippage * 100).toFixed(2)}%`,
      }
    }

    return { executed: true, reason: 'Market order executed' }
  }

  // For LIMIT orders, check if price hits entry
  if (trade.orderType === 'LIMIT') {
    if (trade.signal === 'BUY' && currentPrice <= trade.entryPrice) {
      return { executed: true, reason: 'Limit order filled' }
    }

    if (trade.signal === 'SELL' && currentPrice >= trade.entryPrice) {
      return { executed: true, reason: 'Limit order filled' }
    }

    return { executed: false, reason: 'Limit order pending' }
  }

  return { executed: false, reason: 'Unknown order type' }
}

/**
 * Close trade with exit price
 */
export function closeTrade(
  trade: BotTrade,
  exitPrice: number
): { success: boolean; updatedTrade: BotTrade; message: string } {
  const pnlPoints = (exitPrice - trade.entryPrice) * (trade.signal === 'BUY' ? 1 : -1)
  const pnl = pnlPoints * trade.quantity
  const pnlPercent = (pnlPoints / trade.entryPrice) * 100

  const closedTrade: BotTrade = {
    ...trade,
    status: 'CLOSED',
    closeTime: Date.now(),
    exitPrice,
    pnl,
    pnlPercent,
  }

  const message = `Trade closed: ${trade.asset} ${trade.signal} @ ${exitPrice}. P&L: $${pnl.toFixed(2)} (${pnlPercent.toFixed(2)}%)`

  return {
    success: true,
    updatedTrade: closedTrade,
    message,
  }
}

/**
 * Check if max open trades exceeded
 */
export function canOpenNewTrade(symbol: string): { allowed: boolean; reason?: string } {
  let totalOpen = 0

  for (const [, trades] of openTradesCache) {
    totalOpen += trades.filter(t => t.status === 'OPEN' || t.status === 'PENDING').length
  }

  if (totalOpen >= RISK_CONFIG.maxOpenTrades) {
    return {
      allowed: false,
      reason: `Max open trades (${RISK_CONFIG.maxOpenTrades}) reached`,
    }
  }

  // Check if already have open trade on this symbol
  const symbolTrades = openTradesCache.get(symbol) || []
  const openOnSymbol = symbolTrades.filter(t => t.status === 'OPEN' || t.status === 'PENDING')

  if (openOnSymbol.length > 0) {
    return {
      allowed: false,
      reason: `Already have ${openOnSymbol.length} open trade(s) on ${symbol}`,
    }
  }

  return { allowed: true }
}

/**
 * Track open trade
 */
export function trackOpenTrade(trade: BotTrade): void {
  const trades = openTradesCache.get(trade.symbol) || []
  trades.push(trade)
  openTradesCache.set(trade.symbol, trades)
}

/**
 * Get open trades
 */
export function getOpenTrades(symbol?: string): BotTrade[] {
  if (symbol) {
    const trades = openTradesCache.get(symbol) || []
    return trades.filter(t => t.status === 'OPEN' || t.status === 'PENDING')
  }

  const allTrades: BotTrade[] = []
  for (const trades of openTradesCache.values()) {
    allTrades.push(...trades.filter(t => t.status === 'OPEN' || t.status === 'PENDING'))
  }

  return allTrades
}

/**
 * Format trade for display
 */
export function formatTradeForDisplay(trade: BotTrade): string {
  const emoji = trade.signal === 'BUY' ? '📈' : '📉'
  const statusEmoji =
    {
      PENDING: '⏳',
      OPEN: '✅',
      PARTIAL: '⚡',
      CLOSED: '🏁',
      CANCELLED: '❌',
      ERROR: '⚠️',
    }[trade.status] || '❓'

  const lines = [
    `${emoji} ${statusEmoji} ${trade.asset} ${trade.signal} ${trade.orderType}`,
    `Entry: $${trade.entryPrice} | SL: $${trade.stopLoss} | TP: $${trade.takeProfit}`,
    `Qty: ${trade.quantity} | R/R: ${trade.riskReward?.toFixed(2) || 'N/A'}:1`,
  ]

  if (trade.pnl !== undefined) {
    const pnlEmoji = trade.pnl >= 0 ? '💰' : '📉'
    lines.push(
      `${pnlEmoji} P&L: $${trade.pnl.toFixed(2)} (${trade.pnlPercent?.toFixed(2) || 'N/A'}%)`
    )
  }

  return lines.join('\n')
}
