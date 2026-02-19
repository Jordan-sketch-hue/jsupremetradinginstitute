/**
 * Telegram Notifier - Send trade updates to your execution group
 * Handles all outgoing bot messages with formatting
 */

interface TelegramMessage {
  chat_id: string | number
  text: string
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2'
  disable_web_page_preview?: boolean
}

// Track sent messages for edit capability
const sentMessages = new Map<string, { messageId: number; timestamp: number }>()

// Cleanup old message tracking
setInterval(() => {
  const now = Date.now()
  for (const [key, msg] of sentMessages.entries()) {
    if (now - msg.timestamp > 3600000) {
      // 1 hour
      sentMessages.delete(key)
    }
  }
}, 600000)

/**
 * Send a message to the execution telegram group
 */
export async function sendTelegramUpdate(
  message: string,
  editMessageId?: string
): Promise<boolean> {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN
    const execGroupId = process.env.EXEC_GROUP_ID || process.env.EXEC_GROUP_NAME_OR_ID

    if (!botToken || !execGroupId) {
      console.warn('[TELEGRAM_NOTIFIER] Bot token or group ID not configured')
      return false
    }

    const telegramMessage: TelegramMessage = {
      chat_id: execGroupId,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true,
    }

    const url = editMessageId
      ? `https://api.telegram.org/bot${botToken}/editMessageText`
      : `https://api.telegram.org/bot${botToken}/sendMessage`

    if (editMessageId) {
      ;(telegramMessage as any).message_id = editMessageId
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telegramMessage),
    })

    if (!response.ok) {
      console.error(`[TELEGRAM_NOTIFIER_ERROR] Status ${response.status}`)
      return false
    }

    const data = await response.json()

    if (!data.ok) {
      console.error('[TELEGRAM_NOTIFIER_ERROR]', data.description)
      return false
    }

    // Track sent message
    const messageKey = `${execGroupId}-${data.result.message_id}`
    sentMessages.set(messageKey, {
      messageId: data.result.message_id,
      timestamp: Date.now(),
    })

    console.log(`[TELEGRAM_NOTIFIER] Message sent (ID: ${data.result.message_id})`)
    return true
  } catch (error) {
    console.error('[TELEGRAM_NOTIFIER_ERROR]', error)
    return false
  }
}

/**
 * Send trade opened notification
 */
export async function notifyTradeOpened(tradeData: {
  tradeId: string
  asset: string
  signal: string
  entry: number
  sl: number
  tp: number
  lotSize: number
  rr: number
  confidence: number
  category: string
}): Promise<boolean> {
  const categoryEmoji =
    {
      FOREX: '💱',
      CRYPTO: '₿',
      INDICES: '📊',
      COMMODITIES: '⛽',
    }[tradeData.category] || '📈'

  const signalEmoji = tradeData.signal === 'BUY' ? '🟢' : '🔴'
  const rrColor = tradeData.rr >= 2.0 ? '✅' : tradeData.rr >= 1.5 ? '⚠️' : '❗'

  const message = `
${categoryEmoji} ${signalEmoji} **TRADE OPENED**

**Asset:** \`${tradeData.asset}\`
**Signal:** ${tradeData.signal}
**Entry:** $${tradeData.entry.toFixed(4)}
**SL:** $${tradeData.sl.toFixed(4)}
**TP:** $${tradeData.tp.toFixed(4)}
**Lot Size:** ${tradeData.lotSize.toFixed(2)} 📊
**R:R:** ${rrColor} 1:${tradeData.rr.toFixed(2)}
**Confidence:** ${(tradeData.confidence * 100).toFixed(0)}% 🎯
**Trade ID:** \`${tradeData.tradeId}\`

**Status:** 🟢 LIVE
**Time:** ${new Date().toLocaleTimeString()}
  `.trim()

  return await sendTelegramUpdate(message)
}

/**
 * Send trade closed notification
 */
export async function notifyTradeClosed(tradeData: {
  tradeId: string
  asset: string
  signal: string
  entry: number
  exit: number
  pnl: number
  pnlPercent: number
  lotSize: number
  duration: string
}): Promise<boolean> {
  const isProfitable = tradeData.pnl >= 0
  const statusEmoji = isProfitable ? '✅' : '❌'
  const pnlColor = isProfitable ? '🟢' : '🔴'

  const message = `
${statusEmoji} **TRADE CLOSED**

**Asset:** \`${tradeData.asset}\`
**Signal:** ${tradeData.signal}
**Entry:** $${tradeData.entry.toFixed(4)}
**Exit:** $${tradeData.exit.toFixed(4)}
**Lot Size:** ${tradeData.lotSize.toFixed(2)}
**P&L:** ${pnlColor} $${tradeData.pnl.toFixed(2)}
**P&L %:** ${tradeData.pnlPercent.toFixed(2)}%
**Duration:** ⏱️ ${tradeData.duration}
**Trade ID:** \`${tradeData.tradeId}\`

**Status:** 🏁 CLOSED
**Time:** ${new Date().toLocaleTimeString()}
  `.trim()

  return await sendTelegramUpdate(message)
}

/**
 * Send daily summary
 */
export async function notifyDailySummary(summary: {
  totalTrades: number
  winTrades: number
  lossTrades: number
  winRate: number
  grossProfit: number
  grossLoss: number
  netProfit: number
  profitFactor: number
  largestWin: number
  largestLoss: number
}): Promise<boolean> {
  const statusEmoji = summary.netProfit >= 0 ? '📈' : '📉'
  const profitEmoji = summary.netProfit >= 0 ? '🟢' : '🔴'

  const message = `
${statusEmoji} **DAILY SUMMARY**

**Total Trades:** ${summary.totalTrades}
**Wins:** 🟢 ${summary.winTrades}
**Losses:** 🔴 ${summary.lossTrades}
**Win Rate:** ${(summary.winRate * 100).toFixed(1)}%
**Profit Factor:** ${summary.profitFactor.toFixed(2)}
**Largest Win:** 📈 $${summary.largestWin.toFixed(2)}
**Largest Loss:** 📉 $${Math.abs(summary.largestLoss).toFixed(2)}

**Net P&L:** ${profitEmoji} $${summary.netProfit.toFixed(2)}

**Time:** 📅 ${new Date().toLocaleDateString()}
  `.trim()

  return await sendTelegramUpdate(message)
}

/**
 * Send bot status
 */
export async function notifyBotStatus(status: {
  armed: boolean
  trading: boolean
  openPositions: number
  totalPnl: number
  balance: number
  equity: number
}): Promise<boolean> {
  const armedStatus = status.armed ? '🟢 ARMED' : '🔴 DISARMED'
  const tradingStatus = status.trading ? '✅ ENABLED' : '⛔ DISABLED'
  const pnlEmoji = status.totalPnl >= 0 ? '📈' : '📉'

  const message = `
🤖 **BOT STATUS**

**Armed:** ${armedStatus}
**Trading:** ${tradingStatus}
**Open Positions:** ${status.openPositions}
**Balance:** 💰 $${status.balance.toFixed(2)}
**Equity:** 📊 $${status.equity.toFixed(2)}
**Total P&L:** ${pnlEmoji} $${status.totalPnl.toFixed(2)}

**Status:** ✅ ONLINE
**Time:** ${new Date().toLocaleTimeString()}
  `.trim()

  return await sendTelegramUpdate(message)
}

/**
 * Send error notification
 */
export async function notifyError(error: {
  type: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  message: string
  details?: string
}): Promise<boolean> {
  const severityEmoji =
    {
      LOW: '⚠️',
      MEDIUM: '⚠️⚠️',
      HIGH: '🚨',
      CRITICAL: '🔥',
    }[error.severity] || '⚠️'

  const message = `
${severityEmoji} **ERROR ALERT**

**Type:** ${error.type}
**Severity:** ${error.severity}
**Message:** ${error.message}
${error.details ? `**Details:** \`${error.details}\`` : ''}

**Time:** ${new Date().toLocaleTimeString()}
**Bot Status:** ✅ OPERATIONAL
  `.trim()

  return await sendTelegramUpdate(message)
}

/**
 * Send validation failure notification
 */
export async function notifyValidationFailed(alert: {
  asset: string
  signal: string
  confidence: number
  failureReason: string
}): Promise<boolean> {
  const message = `
❌ **ALERT REJECTED**

**Asset:** \`${alert.asset}\`
**Signal:** ${alert.signal}
**Confidence:** ${(alert.confidence * 100).toFixed(1)}%
**Reason:** ${alert.failureReason}

**Status:** NOT EXECUTED
**Time:** ${new Date().toLocaleTimeString()}
  `.trim()

  return await sendTelegramUpdate(message)
}

/**
 * Send heartbeat (bot is alive)
 */
export async function sendHeartbeat(): Promise<boolean> {
  const message = `
💓 **BOT HEARTBEAT**

**Status:** 🟢 ONLINE & OPERATIONAL
**Time:** ${new Date().toLocaleTimeString()}
  `.trim()

  return await sendTelegramUpdate(message)
}

/**
 * Check if notifier is configured
 */
export function isNotifierConfigured(): boolean {
  return !!(process.env.TELEGRAM_BOT_TOKEN && process.env.EXEC_GROUP_ID)
}
