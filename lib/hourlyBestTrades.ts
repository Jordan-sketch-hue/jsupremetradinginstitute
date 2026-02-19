/**
 * Hourly Best Trades Analyzer
 * Analyzes trends and sends best trade recommendations hourly
 */

interface TradeRecommendation {
  symbol: string
  signal: 'BUY' | 'SELL'
  entry: number
  sl: number
  tp: number
  confidence: number
  reasoning: string
  timeframe: string
}

interface HourlyUpdate {
  timestamp: string
  topTrades: TradeRecommendation[]
  marketPhase: string
  summary: string
}

/**
 * Analyze all trending assets and return top trades for the hour
 */
export async function getHourlyBestTrades(): Promise<HourlyUpdate> {
  try {
    // Fetch current trends from your trends page data
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/trends-data`, {
      cache: 'no-store',
    })

    if (!response.ok) {
      console.warn('Failed to fetch trends data')
      return getDefaultHourlyUpdate()
    }

    const trendsData = await response.json()

    // Score and rank trades by confidence
    const recommendations = trendsData.assets
      .filter((asset: any) => asset.technicals?.signal)
      .map((asset: any) => ({
        symbol: asset.symbol,
        signal: asset.technicals.signal || 'BUY',
        entry: asset.currentPrice,
        sl: calculateSL(asset),
        tp: calculateTP(asset),
        confidence: calculateConfidence(asset),
        reasoning: asset.reasoning.substring(0, 100),
        timeframe: '1H',
      }))
      .sort((a: TradeRecommendation, b: TradeRecommendation) => b.confidence - a.confidence)
      .slice(0, 5) // Top 5 trades

    return {
      timestamp: new Date().toISOString(),
      topTrades: recommendations,
      marketPhase: trendsData.marketPhase || 'ACCUMULATION',
      summary: generateSummary(recommendations),
    }
  } catch (error) {
    console.error('Error in getHourlyBestTrades:', error)
    return getDefaultHourlyUpdate()
  }
}

/**
 * Calculate stop loss for asset
 */
function calculateSL(asset: any): number {
  // Use the provided SL from technicals, or calculate
  if (asset.stopLoss) {
    const slStr = asset.stopLoss.replace(/[^\d.]/g, '')
    return parseFloat(slStr) || asset.currentPrice * 0.98
  }
  return asset.currentPrice * 0.98 // 2% SL default
}

/**
 * Calculate take profit for asset
 */
function calculateTP(asset: any): number {
  // Use the provided TP from technicals
  if (asset.takeProfit) {
    const tpStr = asset.takeProfit.replace(/[^\d.]/g, '')
    return parseFloat(tpStr) || asset.currentPrice * 1.03
  }
  return asset.currentPrice * 1.03 // 3% TP default
}

/**
 * Calculate confidence score (0-100)
 */
function calculateConfidence(asset: any): number {
  let score = 50

  // Add points for strong technicals
  if (asset.technicals?.rsi) {
    const rsi = asset.technicals.rsi
    if (
      (asset.technicals.signal === 'BUY' && rsi > 40 && rsi < 70) ||
      (asset.technicals.signal === 'SELL' && rsi > 30 && rsi < 60)
    ) {
      score += 20
    }
  }

  // Add points for positive price change
  if (asset.changePercent24h > 0) {
    score += 10
  }

  // Add points for clear trend
  if (asset.technicals?.trend === 'UP' || asset.technicals?.trend === 'DOWN') {
    score += 15
  }

  return Math.min(score, 95)
}

/**
 * Generate summary text for the update
 */
function generateSummary(trades: TradeRecommendation[]): string {
  if (trades.length === 0) {
    return 'No strong setup detected this hour. Wait for better confirmation.'
  }

  const topTrade = trades[0]
  return `🎯 TOP SETUP: ${topTrade.symbol} ${topTrade.signal} @ ${topTrade.entry.toFixed(4)}. Confidence: ${topTrade.confidence}%`
}

/**
 * Default update if no data available
 */
function getDefaultHourlyUpdate(): HourlyUpdate {
  return {
    timestamp: new Date().toISOString(),
    topTrades: [],
    marketPhase: 'WAITING',
    summary: 'Data loading... check /bot-dashboard for live trends',
  }
}

/**
 * Format recommendation for Telegram message
 */
export function formatRecommendationForTelegram(trade: TradeRecommendation): string {
  const emoji = trade.signal === 'BUY' ? '🟢' : '🔴'
  return (
    `${emoji} **${trade.symbol}** ${trade.signal}\n` +
    `📍 Entry: ${trade.entry.toFixed(4)}\n` +
    `🛑 SL: ${trade.sl.toFixed(4)}\n` +
    `🎯 TP: ${trade.tp.toFixed(4)}\n` +
    `💪 Confidence: ${trade.confidence}%\n` +
    `📊 TF: ${trade.timeframe}`
  )
}

/**
 * Format hourly update message
 */
export function formatHourlyUpdateForTelegram(update: HourlyUpdate): string {
  const lines = [
    `⏰ **HOURLY MARKET UPDATE** - ${new Date(update.timestamp).toLocaleTimeString()}`,
    ``,
    `**Market Phase:** ${update.marketPhase}`,
    ``,
    `📊 **TOP 5 SETUPS:**`,
  ]

  update.topTrades.forEach((trade, idx) => {
    lines.push(
      `\n${idx + 1}. ${trade.symbol} ${trade.signal === 'BUY' ? '🟢' : '🔴'}`,
      `   Entry: ${trade.entry.toFixed(4)} | SL: ${trade.sl.toFixed(4)} | TP: ${trade.tp.toFixed(4)}`,
      `   Confidence: ${trade.confidence}% | Use /trade${idx + 1} to set limits`
    )
  })

  lines.push(`\n${update.summary}`)

  return lines.join('\n')
}
