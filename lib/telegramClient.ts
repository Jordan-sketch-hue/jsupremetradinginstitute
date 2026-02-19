/**
 * Telegram Client - Listens to VIP provider group and personal execution group
 * Parses alerts, validates signals, and sends updates back
 */

interface TelegramAlert {
  id: string
  timestamp: number
  groupId: number
  groupName: string
  messageText: string
  asset: string
  signal: 'BUY' | 'SELL' | 'CLOSE' | 'WAIT'
  entryPrice?: number
  entryZone?: string
  stopLoss?: number
  takeProfit?: number
  takeProfitTargets?: Array<{ label: string; value: number }>
  confidence?: number
  category: 'FOREX' | 'CRYPTO' | 'INDICES' | 'COMMODITIES'
  source: 'PROVIDER' | 'WEBSITE' | 'EMAIL'
  parsed: boolean
  error?: string
}

interface TradeAlert {
  asset: string
  signal: 'BUY' | 'SELL' | 'CLOSE'
  entryPrice?: number
  entryZone?: string
  stopLoss?: number
  takeProfit?: number
  takeProfitTargets?: Array<{ label: string; value: number }>
  timeframe?: string
  confluence?: string[]
  source: string
}

// Parse telegram message for trading signal
export function parseAlertMessage(text: string): Partial<TradeAlert> | null {
  try {
    // Pattern 0: Entry range + TP targets
    // BUY EURUSD | Entry: 1.17443 - 1.17914 | Stop: 1.16501 | TP Range: TP1 1.18149 | TP2 1.18620
    const rangePattern =
      /(BUY|SELL)\s+([A-Z0-9/]+).*?Entry:\s*([\d.]+)\s*-\s*([\d.]+).*?Stop:\s*([\d.]+).*?TP\s*Range:\s*(.+)$/i
    const rangeMatch = text.match(rangePattern)

    if (rangeMatch) {
      const signal = rangeMatch[1].toUpperCase() as 'BUY' | 'SELL' | 'CLOSE'
      const asset = rangeMatch[2].toUpperCase()
      const entryLow = parseFloat(rangeMatch[3])
      const entryHigh = parseFloat(rangeMatch[4])
      const stopLoss = parseFloat(rangeMatch[5])
      const tpText = rangeMatch[6]

      const tpMatches = Array.from(tpText.matchAll(/TP\s*(\d+)\s*([\d.]+)/gi))
      const takeProfitTargets = tpMatches.map(match => ({
        label: `TP${match[1]}`,
        value: parseFloat(match[2]),
      }))

      const entryPrice = signal === 'BUY' ? entryLow : entryHigh
      const takeProfit = takeProfitTargets[0]?.value

      return {
        signal,
        asset,
        entryPrice,
        entryZone: `${entryLow} - ${entryHigh}`,
        stopLoss,
        takeProfit,
        takeProfitTargets,
      }
    }

    // Pattern 1: "BUY EURUSD 1.0900 SL: 1.0880 TP: 1.0950"
    const pattern1 =
      /(\w+)\s+([A-Z0-9]+)\s+([\d.]+)\s+(?:SL|SL:)?\s*([\d.]+)?\s+(?:TP|TP:)?\s*([\d.]+)?/i
    const match1 = text.match(pattern1)

    if (match1) {
      return {
        signal: match1[1].toUpperCase() as 'BUY' | 'SELL' | 'CLOSE',
        asset: match1[2].toUpperCase(),
        entryPrice: match1[3] ? parseFloat(match1[3]) : undefined,
        stopLoss: match1[4] ? parseFloat(match1[4]) : undefined,
        takeProfit: match1[5] ? parseFloat(match1[5]) : undefined,
      }
    }

    // Pattern 2: Markdown formatted
    // **SELL** BTCUSD @ 42500 | SL 41800 | TP 43200
    const pattern2 = /\*\*(\w+)\*\*\s+([A-Z0-9]+)\s+@\s*([\d.]+).*?SL\s*([\d.]+).*?TP\s*([\d.]+)/i
    const match2 = text.match(pattern2)

    if (match2) {
      return {
        signal: match2[1].toUpperCase() as 'BUY' | 'SELL' | 'CLOSE',
        asset: match2[2].toUpperCase(),
        entryPrice: match2[3] ? parseFloat(match2[3]) : undefined,
        stopLoss: match2[4] ? parseFloat(match2[4]) : undefined,
        takeProfit: match2[5] ? parseFloat(match2[5]) : undefined,
      }
    }

    // Pattern 3: JSON-like
    // {"signal": "BUY", "asset": "EURUSD", "entry": 1.0900}
    try {
      const json = JSON.parse(text)
      if (json.signal && json.asset) {
        return {
          signal: json.signal.toUpperCase() as 'BUY' | 'SELL' | 'CLOSE',
          asset: json.asset.toUpperCase(),
          entryPrice: json.entry || json.entryPrice,
          stopLoss: json.sl || json.stopLoss,
          takeProfit: json.tp || json.takeProfit,
        }
      }
    } catch {
      // Not JSON, continue
    }

    return null
  } catch (error) {
    console.error('Parse error:', error)
    return null
  }
}

// Categorize asset by symbol
export function categorizeAsset(symbol: string): 'FOREX' | 'CRYPTO' | 'INDICES' | 'COMMODITIES' {
  const upper = symbol.toUpperCase()

  if (/^BTC|^ETH|^XRP|^ADA|^SOL|^BNB|^DOGE|USD$/.test(upper)) {
    return 'CRYPTO'
  }
  if (/^XAU|^XAG|^WTI|^BRENT|^NG|^CL|OIL|GAS|GOLD|SILVER/.test(upper)) {
    return 'COMMODITIES'
  }
  if (/^US|^UK|^DE|^FR|^JP|^CN|^IN|^100|^500|^2000|^NDX|^DAX|^FTSE/.test(upper)) {
    return 'INDICES'
  }

  return 'FOREX' // Default for currency pairs
}

// Create telegram alert object
export function createAlert(
  text: string,
  groupId: number,
  groupName: string,
  source: 'PROVIDER' | 'WEBSITE' | 'EMAIL' = 'PROVIDER'
): TelegramAlert {
  const parsed = parseAlertMessage(text)
  const fallbackTakeProfit = parsed?.takeProfitTargets?.[0]?.value

  return {
    id: `${groupId}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    timestamp: Date.now(),
    groupId,
    groupName,
    messageText: text,
    asset: parsed?.asset || 'UNKNOWN',
    signal: parsed?.signal || 'WAIT',
    entryPrice: parsed?.entryPrice,
    entryZone: parsed?.entryZone,
    stopLoss: parsed?.stopLoss,
    takeProfit: parsed?.takeProfit || fallbackTakeProfit,
    takeProfitTargets: parsed?.takeProfitTargets,
    category: categorizeAsset(parsed?.asset || ''),
    source,
    parsed: !!parsed,
    error: parsed ? undefined : 'Failed to parse alert',
  }
}

// Validate alert meets minimum criteria
export function validateAlert(alert: TelegramAlert): { valid: boolean; reason?: string } {
  if (!alert.parsed) {
    return { valid: false, reason: 'Alert parsing failed' }
  }

  if (!alert.asset || alert.asset === 'UNKNOWN') {
    return { valid: false, reason: 'Asset symbol not recognized' }
  }

  if (!['BUY', 'SELL', 'CLOSE', 'WAIT'].includes(alert.signal)) {
    return { valid: false, reason: 'Invalid signal type' }
  }

  // Entry price optional for some sources, but must have SL/TP for execution
  if (['BUY', 'SELL'].includes(alert.signal)) {
    if (!alert.stopLoss || (!alert.takeProfit && !alert.takeProfitTargets?.length)) {
      return { valid: false, reason: 'BUY/SELL requires SL and TP' }
    }
  }

  return { valid: true }
}

// Format alert for Telegram update message
export function formatAlertForTelegram(alert: TelegramAlert): string {
  const emoji =
    {
      BUY: '🟢',
      SELL: '🔴',
      CLOSE: '⭐',
      WAIT: '⏸',
    }[alert.signal] || '❓'

  const lines = [
    `${emoji} **${alert.signal}** ${alert.asset}`,
    `Group: ${alert.groupName}`,
    `Category: ${alert.category}`,
    alert.entryZone ? `Entry Zone: ${alert.entryZone}` : null,
    alert.entryPrice ? `Entry: $${alert.entryPrice}` : null,
    alert.stopLoss ? `🛑 SL: $${alert.stopLoss}` : null,
    alert.takeProfit ? `🎯 TP: $${alert.takeProfit}` : null,
    alert.takeProfitTargets?.length
      ? `TP Range: ${alert.takeProfitTargets.map(tp => `${tp.label} ${tp.value}`).join(' | ')}`
      : null,
    `Source: ${alert.source}`,
    `Time: ${new Date(alert.timestamp).toLocaleTimeString()}`,
  ].filter(Boolean)

  return lines.join('\n')
}

// Deduplicate recent alerts (prevent re-trading same signal)
const recentAlerts = new Map<string, number>()

export function isDuplicate(asset: string, signal: string): boolean {
  const key = `${asset}-${signal}`
  const lastTime = recentAlerts.get(key)

  if (lastTime && Date.now() - lastTime < 60000) {
    // Same signal within 60 seconds
    return true
  }

  recentAlerts.set(key, Date.now())
  return false
}

// Clean old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, time] of recentAlerts.entries()) {
    if (now - time > 300000) {
      // 5 minutes
      recentAlerts.delete(key)
    }
  }
}, 60000)
