import { NextRequest, NextResponse } from 'next/server'
import { createAlert, validateAlert } from '@/lib/telegramClient'
import { executeTradeFromSignal } from '@/lib/tradeExecutor'
import { validateAlertScore } from '@/lib/alertValidator'
import { sendTelegramUpdate } from '@/lib/telegramNotifier'
import {
  getMainMenuKeyboard,
  startTradeMenu,
  getStopLossKeyboard,
  getConfirmationKeyboard,
  processMenuCallback,
  setCustomPrice,
  getMenuState,
} from '@/lib/telegramMenuHandler'
import { getHourlyBestTrades, formatHourlyUpdateForTelegram } from '@/lib/hourlyBestTrades'

/**
 * /api/telegram/webhook - Receive alerts from Telegram VIP group
 * Telegram sends updates here, we parse and auto-execute
 */

interface TelegramUpdate {
  update_id: number
  message?: {
    message_id: number
    date: number
    chat: { id: number; title?: string; type: string }
    text?: string
    from?: { id: number; first_name: string; username?: string }
  }
  callback_query?: {
    id: string
    data?: string
    from: { id: number; first_name?: string; username?: string }
    message?: {
      message_id: number
      chat: { id: number; title?: string; type: string }
    }
  }
  channel_post?: {
    message_id: number
    date: number
    chat: { id: number; title?: string; type: string }
    text?: string
  }
  edited_message?: {
    message_id: number
    date: number
    chat: { id: number; title?: string; type: string }
    text?: string
  }
}

// Track processed updates to prevent duplicates
const processedUpdates = new Set<number>()

// Clean old entries every 10 minutes
setInterval(() => {
  if (processedUpdates.size > 10000) {
    processedUpdates.clear()
  }
}, 600000)

export async function POST(request: NextRequest) {
  try {
    // Verify webhook secret if configured
    const secret = request.headers.get('x-telegram-bot-api-secret-token')
    const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET

    if (expectedSecret && secret !== expectedSecret) {
      console.warn('[TELEGRAM_WEBHOOK] Invalid secret token')
      return NextResponse.json({ ok: true })
    }

    const update: TelegramUpdate = await request.json()

    // Prevent duplicate processing
    if (processedUpdates.has(update.update_id)) {
      return NextResponse.json({ ok: true })
    }
    processedUpdates.add(update.update_id)

    // Handle callback queries (menu buttons)
    if (update.callback_query?.data && update.callback_query.message?.chat?.id) {
      const chatId = update.callback_query.message.chat.id
      const userId = update.callback_query.from.id
      const action = processMenuCallback(userId, update.callback_query.data)

      if (action.action === 'show_main_menu') {
        await sendTelegramUpdate('🤖 **Bot Menu**\nChoose an option:', {
          chatId,
          replyMarkup: getMainMenuKeyboard(),
        })
      }

      if (action.action === 'show_stop_loss_menu') {
        const { message, keyboard } = getStopLossKeyboard(
          action.data.tradeId,
          action.data.buyPrice,
          action.data.originalSL
        )
        await sendTelegramUpdate(message, { chatId, replyMarkup: keyboard })
      }

      if (action.action === 'show_confirmation_menu') {
        const { message, keyboard } = getConfirmationKeyboard(
          action.data.tradeId,
          action.data.symbol,
          action.data.signal,
          action.data.entry,
          action.data.sl,
          action.data.tp,
          action.data.buyLimit,
          action.data.stopLimit
        )
        await sendTelegramUpdate(message, { chatId, replyMarkup: keyboard })
      }

      if (action.action === 'ask_custom_price') {
        await sendTelegramUpdate(
          `✍️ Send your custom price for **${action.data.field}**. Example: 1.17450`,
          { chatId }
        )
      }

      if (action.action === 'send_hourly_trades') {
        const hourly = await getHourlyBestTrades()
        const message = formatHourlyUpdateForTelegram(hourly)
        await sendTelegramUpdate(message, { chatId })
      }

      if (action.action === 'execute_trade') {
        const executeResult = await executeTradeFromSignal({
          asset: action.data.symbol,
          symbol: action.data.symbol,
          signal: action.data.signal,
          entryPrice: action.data.entry,
          stopLoss: action.data.sl,
          takeProfit: action.data.tp,
          orderType: 'LIMIT',
          category: 'FOREX',
          confidence: action.data.confidence / 100,
          accountBalance: parseFloat(process.env.ACCOUNT_BALANCE || '10000'),
          source: 'TELEGRAM_MENU',
        })

        if (executeResult.success) {
          await sendTelegramUpdate(`✅ Trade executed!\nTrade ID: ${executeResult.tradeId}`, {
            chatId,
          })
        } else {
          await sendTelegramUpdate(`❌ Trade failed: ${executeResult.reason}`, { chatId })
        }
      }

      return NextResponse.json({ ok: true })
    }

    // Extract message text and chat info
    let messageText: string | undefined
    let chatId: number | undefined
    let chatName: string | undefined
    let fromUserId: number | undefined

    if (update.message) {
      messageText = update.message.text
      chatId = update.message.chat.id
      chatName = update.message.chat.title || `${update.message.from?.first_name}`
      fromUserId = update.message.from?.id
    } else if (update.channel_post) {
      messageText = update.channel_post.text
      chatId = update.channel_post.chat.id
      chatName = update.channel_post.chat.title
    }

    // Ignore if no text content
    if (!messageText || !chatId || !chatName) {
      return NextResponse.json({ ok: true })
    }

    // Handle menu commands for execution group
    const execGroupId = parseInt(
      process.env.EXEC_GROUP_ID || process.env.EXEC_GROUP_NAME_OR_ID || '0'
    )
    if (execGroupId && chatId === execGroupId) {
      if (messageText.startsWith('/menu') || messageText.startsWith('/start')) {
        await sendTelegramUpdate('🤖 **Bot Menu**\nChoose an option:', {
          chatId,
          replyMarkup: getMainMenuKeyboard(),
        })
        return NextResponse.json({ ok: true })
      }

      if (messageText.startsWith('/hourly')) {
        const hourly = await getHourlyBestTrades()
        const message = formatHourlyUpdateForTelegram(hourly)
        await sendTelegramUpdate(message, { chatId })
        return NextResponse.json({ ok: true })
      }

      const state = fromUserId ? getMenuState(fromUserId) : undefined
      if (state?.active && messageText && /^\d+(\.\d+)?$/.test(messageText.trim())) {
        const value = parseFloat(messageText.trim())
        const updateResult = setCustomPrice(
          fromUserId as number,
          state.step === 'set_buy' ? 'buy_limit' : 'stop_loss',
          value
        )
        if (updateResult.action === 'menu_updated' && state.step === 'set_stop') {
          const { message, keyboard } = getStopLossKeyboard(
            state.currentTrade?.tradeId || 'N/A',
            state.currentTrade?.buyLimit || state.currentTrade?.entry || value,
            state.currentTrade?.sl || value
          )
          await sendTelegramUpdate(message, { chatId, replyMarkup: keyboard })
        }
        if (updateResult.action === 'menu_updated' && state.step === 'confirm') {
          const trade = state.currentTrade
          if (trade) {
            const { message, keyboard } = getConfirmationKeyboard(
              trade.tradeId,
              trade.symbol,
              trade.signal,
              trade.entry,
              trade.sl,
              trade.tp,
              trade.buyLimit,
              trade.stopLimit
            )
            await sendTelegramUpdate(message, { chatId, replyMarkup: keyboard })
          }
        }
        return NextResponse.json({ ok: true })
      }
    }

    // Check if message is from provider group
    const providerGroupId = parseInt(process.env.PROVIDER_GROUP_ID || '0')
    if (!providerGroupId || chatId !== providerGroupId) {
      return NextResponse.json({ ok: true })
    }

    console.log(`[TELEGRAM_ALERT] From: ${chatName}, Text: ${messageText.substring(0, 50)}...`)

    // Check if trading is allowed
    if (!process.env.ALLOW_TRADING || process.env.ALLOW_TRADING !== 'true') {
      console.warn('[TELEGRAM_ALERT] Trading is disabled')
      return NextResponse.json({ ok: true })
    }

    // Parse the alert
    const alert = createAlert(messageText, chatId, chatName, 'PROVIDER')

    // Validate alert
    const validation = validateAlert(alert)
    if (!validation.valid) {
      console.warn(`[TELEGRAM_ALERT_REJECTED] ${validation.reason}`)
      return NextResponse.json({ ok: true })
    }

    // Score the alert for confidence
    const scoreResult = validateAlertScore(alert)
    const confidence = scoreResult.confidence
    const grade = scoreResult.grade

    console.log(
      `[TELEGRAM_ALERT_SCORED] ${alert.asset} ${alert.signal} - Grade: ${grade}, Confidence: ${(confidence * 100).toFixed(1)}%`
    )

    // Check minimum confidence threshold
    const minConfidence = parseFloat(process.env.MIN_ALERT_CONFIDENCE || '0.65')
    if (confidence < minConfidence) {
      console.log(
        `[TELEGRAM_ALERT_LOW_CONFIDENCE] Confidence ${(confidence * 100).toFixed(1)}% below threshold ${(minConfidence * 100).toFixed(1)}%`
      )

      // Notify user
      await sendTelegramUpdate(
        `⚠️ **LOW CONFIDENCE ALERT REJECTED**\n\n` +
          `Asset: ${alert.asset}\n` +
          `Signal: ${alert.signal}\n` +
          `Confidence: ${(confidence * 100).toFixed(1)}%\n` +
          `Threshold: ${(minConfidence * 100).toFixed(1)}%\n` +
          `Grade: ${grade}\n\n` +
          `Status: ❌ NOT EXECUTED`
      )

      return NextResponse.json({ ok: true })
    }

    // Check if bot is armed
    const armed = process.env.ARMED === 'true'
    if (!armed) {
      console.log('[TELEGRAM_ALERT] Bot is disarmed, skipping execution')

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

      return NextResponse.json({ ok: true })
    }

    // Handle CLOSE signals separately
    if (alert.signal === 'CLOSE') {
      await sendTelegramUpdate(
        `⭐ **CLOSE SIGNAL RECEIVED**\n\n` +
          `Asset: ${alert.asset}\n` +
          `Signal: CLOSE\n` +
          `Status: Would close matching open positions\n` +
          `Confidence: ${(confidence * 100).toFixed(1)}%`
      )
      return NextResponse.json({ ok: true })
    }

    // Execute the trade (BUY or SELL only)
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
      source: 'TELEGRAM',
    })

    if (!trade.success) {
      console.error('[TELEGRAM_TRADE_FAILED]', trade.reason)

      await sendTelegramUpdate(
        `❌ **ALERT EXECUTION FAILED**\n\n` +
          `Asset: ${alert.asset}\n` +
          `Signal: ${alert.signal}\n` +
          `Reason: ${trade.reason}\n` +
          `Confidence: ${(confidence * 100).toFixed(1)}%`
      )

      return NextResponse.json({ ok: true })
    }

    // Get category emoji
    const categoryEmoji =
      {
        FOREX: '💱',
        CRYPTO: '₿',
        INDICES: '📊',
        COMMODITIES: '⛽',
      }[alert.category] || '📈'

    // Send execution confirmation to Telegram
    await sendTelegramUpdate(
      `${categoryEmoji} **TRADE EXECUTED** ${alert.signal}\n\n` +
        `Asset: ${alert.asset}\n` +
        `Entry: ${alert.entryPrice}\n` +
        `SL: ${alert.stopLoss}\n` +
        `TP: ${alert.takeProfit}\n` +
        `Confidence: ${(confidence * 100).toFixed(1)}%\n` +
        `Grade: ${grade}\n` +
        `Trade ID: ${trade.tradeId}\n\n` +
        `Status: ✅ LIVE`
    )

    console.log(`[TELEGRAM_TRADE_EXECUTED] Trade ${trade.tradeId} for ${alert.asset}`)

    // Always return 200 to Telegram to confirm receipt
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[TELEGRAM_WEBHOOK_ERROR]', error)
    // Still return 200 to Telegram
    return NextResponse.json({ ok: true })
  }
}

/**
 * GET /api/telegram/webhook - Check webhook status
 */
export async function GET() {
  return NextResponse.json({
    status: 'active',
    endpoint: '/api/telegram/webhook',
    method: 'POST',
    description: 'Telegram webhook for auto-executing alerts',
    setup: 'Configure telegram.setWebhook() with your bot token',
    requiresSecret: !!process.env.TELEGRAM_WEBHOOK_SECRET,
    tradingEnabled: process.env.ALLOW_TRADING === 'true',
    botArmed: process.env.ARMED === 'true',
    minConfidence: process.env.MIN_ALERT_CONFIDENCE || '65%',
  })
}
