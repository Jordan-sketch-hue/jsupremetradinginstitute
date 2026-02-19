import { NextRequest, NextResponse } from 'next/server'
import {
  validateTradeParams,
  calculatePositionSize,
  createTradeOrder,
  canOpenNewTrade,
  trackOpenTrade,
} from '@/lib/tradeExecutor'
import { getTradeJournal } from '@/lib/tradeJournal'

interface ExecuteRequest {
  asset: string
  symbol: string
  signal: 'BUY' | 'SELL'
  entryPrice?: number
  entryZone?: string
  stopLoss: number
  takeProfit?: number
  takeProfitTargets?: Array<{ label: string; value: number }>
  orderType?: 'MARKET' | 'LIMIT'
  category?: string
  confidence?: number
  accountBalance?: number
}

function parseEntryZone(entryZone?: string): { low: number; high: number } | null {
  if (!entryZone) return null
  const match = entryZone.match(/([\d.]+)\s*-\s*([\d.]+)/)
  if (!match) return null
  const low = parseFloat(match[1])
  const high = parseFloat(match[2])
  if (!Number.isFinite(low) || !Number.isFinite(high)) return null
  return { low, high }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.ALLOW_TRADING || process.env.ALLOW_TRADING !== 'true') {
      return NextResponse.json({ success: false, error: 'Trading is disabled' }, { status: 403 })
    }

    if (!process.env.ARMED || process.env.ARMED !== 'true') {
      return NextResponse.json({ success: false, error: 'Bot is not armed' }, { status: 403 })
    }

    const body: ExecuteRequest = await request.json()

    const entryZone = parseEntryZone(body.entryZone)
    const entryPrice =
      body.entryPrice || (entryZone ? (body.signal === 'BUY' ? entryZone.low : entryZone.high) : 0)
    const takeProfit = body.takeProfit || body.takeProfitTargets?.[0]?.value || 0

    const paramValidation = validateTradeParams(
      body.asset,
      entryPrice,
      body.stopLoss,
      takeProfit,
      body.signal
    )
    if (!paramValidation.valid) {
      return NextResponse.json({ success: false, error: paramValidation.reason }, { status: 400 })
    }

    const openCheck = canOpenNewTrade(body.symbol)
    if (!openCheck.allowed) {
      return NextResponse.json({ success: false, error: openCheck.reason }, { status: 429 })
    }

    const accountBalance = body.accountBalance || 10000
    const { quantity } = calculatePositionSize(accountBalance, undefined, entryPrice, body.stopLoss)

    const trade = createTradeOrder(
      body.asset,
      body.symbol,
      body.signal,
      entryPrice,
      body.stopLoss,
      takeProfit,
      quantity,
      body.orderType || 'MARKET',
      body.category || 'FOREX',
      body.confidence,
      body.entryZone,
      body.takeProfitTargets
    )

    trackOpenTrade(trade)
    const journal = getTradeJournal()
    journal.addTrade(trade)

    return NextResponse.json({
      success: true,
      trade,
      message: `${body.signal} ${body.asset} order created`,
    })
  } catch (error) {
    console.error('Trade execution error:', error)
    return NextResponse.json({ success: false, error: 'Trade execution failed' }, { status: 500 })
  }
}
