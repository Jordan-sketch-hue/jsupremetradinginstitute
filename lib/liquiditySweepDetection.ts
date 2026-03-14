// Utility for detecting liquidity sweeps (stop hunts, wicks beyond previous highs/lows)

export interface LiquiditySweep {
  timestamp: number
  type: 'HIGH' | 'LOW'
  price: number
  description: string
}

export function detectLiquiditySweeps(
  candles: { high: number; low: number; close: number; timestamp: number }[]
): LiquiditySweep[] {
  if (!candles || candles.length < 10) return []
  const sweeps: LiquiditySweep[] = []
  for (let i = 2; i < candles.length; i++) {
    // High sweep: current high > prev high and closes below prev high
    if (
      candles[i].high > candles[i - 1].high &&
      candles[i].high > candles[i - 2].high &&
      candles[i].close < candles[i - 1].high
    ) {
      sweeps.push({
        timestamp: candles[i].timestamp,
        type: 'HIGH',
        price: candles[i].high,
        description: 'Liquidity sweep above previous highs',
      })
    }
    // Low sweep: current low < prev low and closes above prev low
    if (
      candles[i].low < candles[i - 1].low &&
      candles[i].low < candles[i - 2].low &&
      candles[i].close > candles[i - 1].low
    ) {
      sweeps.push({
        timestamp: candles[i].timestamp,
        type: 'LOW',
        price: candles[i].low,
        description: 'Liquidity sweep below previous lows',
      })
    }
  }
  return sweeps
}
