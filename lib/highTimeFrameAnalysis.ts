// Utility for analyzing high time frame (HTF) zones
// Example: find major support/resistance from daily/4H for use on lower timeframes

export interface HTFZone {
  timeframe: string
  type: 'SUPPORT' | 'RESISTANCE'
  price: number
  description: string
}

export function analyzeHighTimeFrameZones(htfCandles: {
  [tf: string]: { high: number; low: number; close: number; timestamp: number }[]
}): HTFZone[] {
  const zones: HTFZone[] = []
  for (const tf of Object.keys(htfCandles)) {
    const candles = htfCandles[tf]
    if (!candles || candles.length < 20) continue
    // Support: recent swing lows
    const lows = candles.map(c => c.low)
    const minLow = Math.min(...lows)
    zones.push({
      timeframe: tf,
      type: 'SUPPORT',
      price: minLow,
      description: `Major support on ${tf}`,
    })
    // Resistance: recent swing highs
    const highs = candles.map(c => c.high)
    const maxHigh = Math.max(...highs)
    zones.push({
      timeframe: tf,
      type: 'RESISTANCE',
      price: maxHigh,
      description: `Major resistance on ${tf}`,
    })
  }
  return zones
}
