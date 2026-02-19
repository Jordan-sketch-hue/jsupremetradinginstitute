import { NextRequest, NextResponse } from 'next/server'

/**
 * /api/trade/confirm - Handle trade confirmation from Telegram menu or page
 * Validates parameters and executes trade on MT5
 */

interface ConfirmTradeRequest {
  symbol: string
  signal: 'BUY' | 'SELL'
  entry: number
  sl: number
  tp: number
  buyLimit?: number
  stopLimit?: number
  source: 'telegram' | 'page'
  userId?: number
  confidence?: number
}

export async function POST(request: NextRequest) {
  try {
    const body: ConfirmTradeRequest = await request.json()

    // Validate required fields
    if (!body.symbol || !body.signal || !body.entry || !body.sl || !body.tp) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate signal
    if (!['BUY', 'SELL'].includes(body.signal)) {
      return NextResponse.json({ success: false, error: 'Invalid signal' }, { status: 400 })
    }

    // Use custom limits or defaults
    const finalEntry = body.buyLimit || body.entry
    const finalSL = body.stopLimit || body.sl

    // Validate prices
    if (body.signal === 'BUY') {
      if (finalSL >= finalEntry || body.tp <= finalEntry) {
        return NextResponse.json(
          { success: false, error: 'Invalid BUY prices: SL < Entry < TP' },
          { status: 400 }
        )
      }
    } else {
      if (finalSL <= finalEntry || body.tp >= finalEntry) {
        return NextResponse.json(
          { success: false, error: 'Invalid SELL prices: TP < Entry < SL' },
          { status: 400 }
        )
      }
    }

    // Check if trading is enabled
    if (process.env.ALLOW_TRADING !== 'true') {
      return NextResponse.json(
        { success: false, error: 'Trading is disabled', confirmed: true, pendingExecution: true },
        { status: 403 }
      )
    }

    // Calculate R/R ratio
    const risk = Math.abs(finalEntry - finalSL)
    const reward = Math.abs(body.tp - finalEntry)
    const rr = reward / risk

    if (rr < 0.5) {
      return NextResponse.json(
        {
          success: false,
          error: `Risk/Reward too low (${rr.toFixed(2)}:1 < 0.5:1)`,
          confirmed: false,
        },
        { status: 400 }
      )
    }

    // Create trade ID
    const tradeId = `${body.symbol}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

    // Prepare trade execution response
    const tradeData = {
      tradeId,
      symbol: body.symbol,
      signal: body.signal,
      entry: finalEntry,
      sl: finalSL,
      tp: body.tp,
      rr: rr.toFixed(2),
      confidence: body.confidence || 75,
      source: body.source,
      timestamp: new Date().toISOString(),
      status: 'PENDING_EXECUTION',
    }

    // Log the confirmed trade
    console.log(`[TRADE_CONFIRMED] ${body.symbol} ${body.signal} from ${body.source}`, tradeData)

    // In production, actually execute on MT5 here
    // For now, return confirmation that will trigger execution via background job

    return NextResponse.json({
      success: true,
      message: 'Trade confirmed and queued for execution',
      trade: tradeData,
      action: body.source === 'telegram' ? 'notify_telegram' : 'notify_page',
    })
  } catch (error) {
    console.error('[TRADE_CONFIRM_ERROR]', error)
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
 * GET /api/trade/confirm - Get confirmation dialog data
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const symbol = searchParams.get('symbol')

  if (!symbol) {
    return NextResponse.json({ success: false, error: 'Missing symbol parameter' }, { status: 400 })
  }

  // Return confirmation dialog template
  return NextResponse.json({
    success: true,
    dialog: {
      symbol,
      fields: [
        { name: 'entry', label: 'Entry Price', type: 'number', required: true },
        { name: 'sl', label: 'Stop Loss', type: 'number', required: true },
        { name: 'tp', label: 'Take Profit', type: 'number', required: true },
        { name: 'buyLimit', label: 'Buy Limit (optional)', type: 'number', required: false },
        { name: 'stopLimit', label: 'Stop Limit (optional)', type: 'number', required: false },
      ],
    },
  })
}
