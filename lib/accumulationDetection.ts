// Utility for detecting accumulation ranges in price data
// Accumulation = sideways, tight range, low volatility, multiple equal highs/lows

export interface AccumulationRange {
  start: number // timestamp
  end: number // timestamp
  high: number
  low: number
  candles: number // count
  description: string
}

export function detectAccumulationRanges(
  candles: { high: number; low: number; close: number; timestamp: number }[]
): AccumulationRange[] {
  if (!candles || candles.length < 20) return []
  const ranges: AccumulationRange[] = []
  let i = 0
  while (i < candles.length - 10) {
    // Look for 8+ candles with tight range (<1% spread)
    const window = candles.slice(i, i + 8)
    const highs = window.map(c => c.high)
    const lows = window.map(c => c.low)
    const maxHigh = Math.max(...highs)
    const minLow = Math.min(...lows)
    const spread = (maxHigh - minLow) / minLow
    if (spread < 0.012 && maxHigh !== minLow) {
      // Check for multiple equal highs/lows
      const eqHighs = highs.filter(h => Math.abs(h - maxHigh) < minLow * 0.0015).length
      const eqLows = lows.filter(l => Math.abs(l - minLow) < minLow * 0.0015).length
      if (eqHighs >= 2 && eqLows >= 2) {
        // Extend range until breakout
        let end = i + 8
        while (
          end < candles.length &&
          Math.abs(candles[end].high - maxHigh) < minLow * 0.012 &&
          Math.abs(candles[end].low - minLow) < minLow * 0.012
        ) {
          end++
        }
        ranges.push({
          start: candles[i].timestamp,
          end: candles[end - 1].timestamp,
          high: maxHigh,
          low: minLow,
          candles: end - i,
          description: `Accumulation range (${end - i} candles)`,
        })
        i = end
        continue
      }
    }
    i++
  }
  return ranges
}
