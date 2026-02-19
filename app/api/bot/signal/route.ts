import { NextRequest, NextResponse } from 'next/server'
import { createAlert, validateAlert } from '@/lib/telegramClient'
import { executeTradeFromSignal } from '@/lib/tradeExecutor'
import { getTradeJournal } from '@/lib/tradeJournal'
import { validateAlertScore } from '@/lib/alertValidator'
import { sendTelegramUpdate } from '@/lib/telegramNotifier'

/**
 * /api/bot/signal - Accept trading signals from your website
 * POST with trading signal data and bot executes automatically
 */

interface WebsiteSignal {
  asset: string
  symbol: string
  signal: 'BUY' | 'SELL' | 'CLOSE'
  entryPrice: number
  stopLoss: number
  takeProfit: number
  source?: string
  apiKey?: string
  confidence?: number
  timeframe?: string
  reason?: string
}

export async function POST(request: NextRequest) {
  try {
    // Verify API key if configured
    const apiKey = request.headers.get('x-api-key') || (await request.json()).apiKey
    const expectedKey = process.env.WEBSITE_SIGNAL_API_KEY

    if (expectedKey && apiKey !== expectedKey) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Invalid API key' },
        { status: 401 }
      )
    }

    if (!process.env.ALLOW_TRADING || process.env.ALLOW_TRADING !== 'true') {
      return NextResponse.json({ success: false, error: 'Trading is disabled' }, { status: 403 })
    }

    const body: WebsiteSignal = await request.json()

    // Validate required fields
    if (!body.asset || !body.symbol || !body.signal) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: asset, symbol, signal' },
        { status: 400 }
      )
    }

    if (!['BUY', 'SELL', 'CLOSE'].includes(body.signal)) {
      return NextResponse.json(
        { success: false, error: 'Signal must be BUY, SELL, or CLOSE' },
        { status: 400 }
      )
    }

    // Convert website signal to telegram alert format
    const alertText = `${body.signal} ${body.asset} ${body.entryPrice} SL: ${body.stopLoss} TP: ${body.takeProfit}`
    const alert = createAlert(alertText, 0, 'WEBSITE_SIGNAL', 'WEBSITE')

    // Validate alert
    const validation = validateAlert(alert)
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: `Alert validation failed: ${validation.reason}` },
        { status: 400 }
      )
    }

    // Score the alert
    const scoreResult = validateAlertScore(alert)
    const confidence = scoreResult.confidence

    console.log(`[WEBSITE SIGNAL] ${body.asset} ${body.signal} - Confidence: ${confidence}`)

    // Check if bot is armed for automatic execution
    const armed = process.env.ARMED === 'true'

    // If not armed, return the alert details without executing
    if (!armed) {
      return NextResponse.json({
        success: true,
        message: 'Bot is disarmed - signal received but not executed',
        alert: {
          asset: alert.asset,
          signal: alert.signal,
          entry: body.entryPrice,
          sl: body.stopLoss,
          tp: body.takeProfit,
          confidence: (confidence * 100).toFixed(1),
          category: alert.category,
          source: body.source || 'website',
        },
        armed: false,
      })
    }

    // Handle CLOSE signal separately (don't execute as new trade)
    if (body.signal === 'CLOSE') {
      return NextResponse.json({
        success: true,
        message: 'Close signal received - would close matching open positions',
        alert: {
          asset: alert.asset,
          signal: body.signal,
          confidence: (confidence * 100).toFixed(1),
          status: 'CLOSE_SIGNAL_RECEIVED',
        },
      })
    }

    // Execute the trade (BUY or SELL)
    const trade = await executeTradeFromSignal({
      asset: body.asset,
      symbol: body.symbol,
      signal: body.signal as 'BUY' | 'SELL',
      entryPrice: body.entryPrice,
      stopLoss: body.stopLoss,
      takeProfit: body.takeProfit,
      orderType: 'MARKET',
      category: alert.category,
      confidence,
      accountBalance: parseFloat(process.env.ACCOUNT_BALANCE || '10000'),
      source: 'WEBSITE',
    })

    if (!trade.success) {
      return NextResponse.json(
        {
          success: false,
          error: trade.reason || 'Trade execution failed',
          confidence: (confidence * 100).toFixed(1),
        },
        { status: 400 }
      )
    }

    // Get trade label by category
    const categoryLabel =
      {
        FOREX: '💱',
        CRYPTO: '₿',
        INDICES: '📊',
        COMMODITIES: '⛽',
      }[alert.category] || '📈'

    // Send Telegram update to execution group
    await sendTelegramUpdate(
      `${categoryLabel} **NEW TRADE FROM WEBSITE** ${body.signal}\n\n` +
        `Asset: ${body.asset}\n` +
        `Entry: ${body.entryPrice}\n` +
        `SL: ${body.stopLoss}\n` +
        `TP: ${body.takeProfit}\n` +
        `Confidence: ${(confidence * 100).toFixed(1)}%\n` +
        `Status: ✅ EXECUTED`
    )

    return NextResponse.json({
      success: true,
      message: 'Trade executed successfully',
      trade: {
        id: trade.tradeId,
        asset: body.asset,
        signal: body.signal,
        entry: body.entryPrice,
        sl: body.stopLoss,
        tp: body.takeProfit,
        confidence: (confidence * 100).toFixed(1),
        status: 'PENDING',
        source: 'WEBSITE',
      },
    })
  } catch (error) {
    console.error('[WEBSITE_SIGNAL_ERROR]', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/bot/signal - Check if website signal endpoint is active
 */
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/bot/signal',
    method: 'POST',
    description: 'Accept trading signals from your website',
    requiresAuth: !!process.env.WEBSITE_SIGNAL_API_KEY,
    tradingEnabled: process.env.ALLOW_TRADING === 'true',
    botArmed: process.env.ARMED === 'true',
  })
}
