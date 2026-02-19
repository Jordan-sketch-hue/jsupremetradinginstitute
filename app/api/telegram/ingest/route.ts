import { NextRequest, NextResponse } from 'next/server'
import { createAlert, validateAlert } from '@/lib/telegramClient'
import { validateAlertScore } from '@/lib/alertValidator'
import { executeTradeFromSignal } from '@/lib/tradeExecutor'
import { sendTelegramUpdate } from '@/lib/telegramNotifier'

interface IngestPayload {
  text: string
  chatId: number
  chatName: string
  source?: 'PROVIDER' | 'WEBSITE' | 'EMAIL' | 'USER'
}

export async function POST(request: NextRequest) {
  try {
    const payload: IngestPayload = await request.json()

    if (!payload.text || !payload.chatId || !payload.chatName) {
      return NextResponse.json(
        { ok: false, error: 'Missing text, chatId, or chatName' },
        { status: 400 }
      )
    }

    const providerGroupId = parseInt(process.env.PROVIDER_GROUP_ID || '0')
    if (providerGroupId && payload.chatId !== providerGroupId) {
      return NextResponse.json({ ok: true, ignored: true })
    }

    if (!process.env.ALLOW_TRADING || process.env.ALLOW_TRADING !== 'true') {
      return NextResponse.json({ ok: true, tradingDisabled: true })
    }

    const alert = createAlert(payload.text, payload.chatId, payload.chatName, 'PROVIDER')
    const validation = validateAlert(alert)

    if (!validation.valid) {
      return NextResponse.json({ ok: true, rejected: validation.reason })
    }

    const scoreResult = validateAlertScore(alert)
    const confidence = scoreResult.confidence
    const grade = scoreResult.grade

    const minConfidence = parseFloat(process.env.MIN_ALERT_CONFIDENCE || '0.65')
    if (confidence < minConfidence) {
      await sendTelegramUpdate(
        `⚠️ **LOW CONFIDENCE ALERT REJECTED**\n\n` +
          `Asset: ${alert.asset}\n` +
          `Signal: ${alert.signal}\n` +
          `Confidence: ${(confidence * 100).toFixed(1)}%\n` +
          `Threshold: ${(minConfidence * 100).toFixed(1)}%\n` +
          `Grade: ${grade}\n\n` +
          `Status: ❌ NOT EXECUTED`
      )
      return NextResponse.json({ ok: true, rejected: 'low_confidence' })
    }

    const armed = process.env.ARMED === 'true'
    if (!armed) {
      await sendTelegramUpdate(
        `🔴 **ALERT RECEIVED (BOT DISARMED)**\n\n` +
          `Asset: ${alert.asset}\n` +
          `Signal: ${alert.signal}\n` +
          `Entry: ${alert.entryPrice}\n` +
          `SL: ${alert.stopLoss}\n` +
          `TP: ${alert.takeProfit}\n` +
          `Confidence: ${(confidence * 100).toFixed(1)}%\n\n` +
          `Status: ⏸️ WAITING FOR ARM`
      )
      return NextResponse.json({ ok: true, armed: false })
    }

    if (alert.signal === 'CLOSE') {
      await sendTelegramUpdate(
        `⭐ **CLOSE SIGNAL RECEIVED**\n\n` +
          `Asset: ${alert.asset}\n` +
          `Signal: CLOSE\n` +
          `Status: Would close matching open positions\n` +
          `Confidence: ${(confidence * 100).toFixed(1)}%`
      )
      return NextResponse.json({ ok: true, closeSignal: true })
    }

    const trade = await executeTradeFromSignal({
      asset: alert.asset,
      symbol: alert.asset,
      signal: alert.signal as 'BUY' | 'SELL',
      entryPrice: alert.entryPrice || 0,
      entryZone: alert.entryZone,
      stopLoss: alert.stopLoss || 0,
      takeProfit: alert.takeProfit || 0,
      takeProfitTargets: alert.takeProfitTargets,
      orderType: 'MARKET',
      category: alert.category,
      confidence,
      accountBalance: parseFloat(process.env.ACCOUNT_BALANCE || '10000'),
      source: 'TELEGRAM_USER',
    })

    if (!trade.success) {
      await sendTelegramUpdate(
        `❌ **ALERT EXECUTION FAILED**\n\n` +
          `Asset: ${alert.asset}\n` +
          `Signal: ${alert.signal}\n` +
          `Reason: ${trade.reason}\n` +
          `Confidence: ${(confidence * 100).toFixed(1)}%`
      )

      return NextResponse.json({ ok: false, error: trade.reason })
    }

    await sendTelegramUpdate(
      `✅ **TRADE EXECUTED** ${alert.signal}\n\n` +
        `Asset: ${alert.asset}\n` +
        `Entry: ${alert.entryPrice}\n` +
        `SL: ${alert.stopLoss}\n` +
        `TP: ${alert.takeProfit}\n` +
        `Confidence: ${(confidence * 100).toFixed(1)}%\n` +
        `Grade: ${grade}\n` +
        `Trade ID: ${trade.tradeId}\n\n` +
        `Status: ✅ LIVE`
    )

    return NextResponse.json({ ok: true, tradeId: trade.tradeId })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
