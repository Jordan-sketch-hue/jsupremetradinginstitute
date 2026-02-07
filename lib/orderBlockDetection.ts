/**
 * Order Block Detection Algorithm
 * Identifies institutional order clusters from price action
 */

export interface Candle {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface OrderBlock {
  type: 'BULLISH' | 'BEARISH'
  priceLevel: number
  range: { high: number; low: number }
  strength: number // 0-100, based on how many times price tested/bounced
  timestamp: number
  description: string
}

/**
 * Detect order blocks from candle data
 * Bullish OB: Support zone where price consolidated then broke higher
 * Bearish OB: Resistance zone where price consolidated then broke lower
 */
export function detectOrderBlocks(candles: Candle[]): OrderBlock[] {
  if (candles.length < 10) return []

  const orderBlocks: OrderBlock[] = []
  const lookback = Math.min(50, candles.length)

  for (let i = lookback; i < candles.length; i++) {
    const current = candles[i]
    const prev = candles[i - 1]
    const prevPrev = candles[i - 2]

    // Detect consolidation + breakout pattern (bullish OB)
    if (
      i >= 3 &&
      candles[i - 2].high <= candles[i - 3].high &&
      candles[i - 2].low >= candles[i - 3].low &&
      current.close > candles[i - 1].high
    ) {
      const obLevel = (candles[i - 2].high + candles[i - 2].low) / 2
      const strength = Math.min(100, 50 + Math.abs((current.close - obLevel) / obLevel) * 200)

      orderBlocks.push({
        type: 'BULLISH',
        priceLevel: obLevel,
        range: { high: candles[i - 2].high, low: candles[i - 2].low },
        strength: Math.round(strength),
        timestamp: candles[i - 2].timestamp,
        description: `Bullish OB at ${obLevel.toFixed(4)} - consolidation zone`,
      })
    }

    // Detect consolidation + breakout pattern (bearish OB)
    if (
      i >= 3 &&
      candles[i - 2].high <= candles[i - 3].high &&
      candles[i - 2].low >= candles[i - 3].low &&
      current.close < candles[i - 1].low
    ) {
      const obLevel = (candles[i - 2].high + candles[i - 2].low) / 2
      const strength = Math.min(100, 50 + Math.abs((current.close - obLevel) / obLevel) * 200)

      orderBlocks.push({
        type: 'BEARISH',
        priceLevel: obLevel,
        range: { high: candles[i - 2].high, low: candles[i - 2].low },
        strength: Math.round(strength),
        timestamp: candles[i - 2].timestamp,
        description: `Bearish OB at ${obLevel.toFixed(4)} - distribution zone`,
      })
    }
  }

  return orderBlocks
}

/**
 * Score price action based on order block setup
 * Returns confidence boost if price is near untested order block
 */
export function scoreOrderBlockSetup(
  currentPrice: number,
  candles: Candle[],
  signal: string
): { obConfidence: number; nearestOB: OrderBlock | null } {
  const orderBlocks = detectOrderBlocks(candles)

  if (orderBlocks.length === 0) {
    return { obConfidence: 0, nearestOB: null }
  }

  // Find nearest unmitigated order block
  const relevantOBs = orderBlocks.filter(ob => {
    if (signal === 'BUY') return ob.type === 'BULLISH'
    if (signal === 'SELL') return ob.type === 'BEARISH'
    return true
  })

  if (relevantOBs.length === 0) {
    return { obConfidence: 0, nearestOB: null }
  }

  // Find closest OB
  const nearestOB = relevantOBs.reduce((closest, ob) => {
    const dist = Math.abs(currentPrice - ob.priceLevel)
    const closestDist = Math.abs(currentPrice - closest.priceLevel)
    return dist < closestDist ? ob : closest
  })

  // Score based on distance and OB strength
  const distance = Math.abs(currentPrice - nearestOB.priceLevel)
  const pricePercent = (distance / currentPrice) * 100
  const obConfidence =
    Math.max(0, Math.min(100, 100 - pricePercent * 50)) * (nearestOB.strength / 100)

  return { obConfidence: Math.round(obConfidence), nearestOB }
}

/**
 * Identify support and resistance levels from price history
 */
export function findLevels(candles: Candle[]): { support: number[]; resistance: number[] } {
  if (candles.length < 20) return { support: [], resistance: [] }

  const lows = candles.slice(-20).map(c => c.low)
  const highs = candles.slice(-20).map(c => c.high)

  const support = [Math.min(...lows)]
  const resistance = [Math.max(...highs)]

  // Find secondary levels (local extremes)
  for (let i = 1; i < lows.length - 1; i++) {
    if (lows[i] < lows[i - 1] && lows[i] < lows[i + 1]) {
      if (!support.some(s => Math.abs(s - lows[i]) < lows[i] * 0.001)) {
        support.push(lows[i])
      }
    }
    if (highs[i] > highs[i - 1] && highs[i] > highs[i + 1]) {
      if (!resistance.some(r => Math.abs(r - highs[i]) < highs[i] * 0.001)) {
        resistance.push(highs[i])
      }
    }
  }

  return {
    support: support.sort((a, b) => b - a).slice(0, 3),
    resistance: resistance.sort((a, b) => a - b).slice(0, 3),
  }
}
