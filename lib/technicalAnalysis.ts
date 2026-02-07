/**
 * Technical Analysis Indicators
 * Calculate RSI, MACD, Momentum, ATR for real trading signals
 */

export interface TechnicalIndicators {
  rsi: number // 0-100, >70 overbought, <30 oversold
  macdSignal: 'BULLISH' | 'BEARISH' | 'NEUTRAL'
  momentum: number // Rate of change
  trend: 'UP' | 'DOWN' | 'SIDEWAYS'
  signal: 'BUY' | 'SELL' | 'WAIT'
  confidence: number // 45-95%
}

export function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period) return 50

  let gains = 0
  let losses = 0

  for (let i = prices.length - period; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1]
    if (change > 0) gains += change
    else losses += Math.abs(change)
  }

  const avgGain = gains / period
  const avgLoss = losses / period
  const rs = avgLoss === 0 ? 100 : avgGain / avgLoss
  const rsi = 100 - 100 / (1 + rs)

  return Math.min(100, Math.max(0, rsi))
}

export function calculateMACD(prices: number[]): {
  macd: number
  signal: number
  histogram: number
} {
  const ema12 = calculateEMA(prices, 12)
  const ema26 = calculateEMA(prices, 26)
  const macd = ema12 - ema26
  const signalLine = calculateEMA([macd], 9)
  const histogram = macd - signalLine

  return { macd, signal: signalLine, histogram }
}

function calculateEMA(prices: number[], period: number): number {
  const multiplier = 2 / (period + 1)
  let ema = prices[0]

  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * multiplier + ema * (1 - multiplier)
  }

  return ema
}

export function calculateMomentum(prices: number[], period: number = 10): number {
  if (prices.length < period) return 0
  return prices[prices.length - 1] - prices[prices.length - period - 1]
}

export function analyzeTechnicals(prices: number[]): TechnicalIndicators {
  if (prices.length < 26) {
    return {
      rsi: 50,
      macdSignal: 'NEUTRAL',
      momentum: 0,
      trend: 'SIDEWAYS',
      signal: 'WAIT',
      confidence: 45,
    }
  }

  const rsi = calculateRSI(prices)
  const { histogram } = calculateMACD(prices)
  const momentum = calculateMomentum(prices)

  // Determine trend
  let trend: 'UP' | 'DOWN' | 'SIDEWAYS' = 'SIDEWAYS'
  if (prices[prices.length - 1] > prices[Math.floor(prices.length * 0.75)]) trend = 'UP'
  if (prices[prices.length - 1] < prices[Math.floor(prices.length * 0.75)]) trend = 'DOWN'

  // MACD signal
  const macdSignal: 'BULLISH' | 'BEARISH' | 'NEUTRAL' =
    histogram > 0 ? 'BULLISH' : histogram < 0 ? 'BEARISH' : 'NEUTRAL'

  // Generate signal
  let signal: 'BUY' | 'SELL' | 'WAIT' = 'WAIT'
  let confidence = 50

  // BUY Conditions
  if (rsi < 40 && macdSignal === 'BULLISH' && momentum > 0) {
    signal = 'BUY'
    confidence = Math.min(85, 55 + Math.abs(momentum) * 10)
  } else if (rsi < 30 && macdSignal === 'BULLISH') {
    signal = 'BUY'
    confidence = Math.min(90, 60 + (30 - rsi))
  }

  // SELL Conditions
  if (rsi > 60 && macdSignal === 'BEARISH' && momentum < 0) {
    signal = 'SELL'
    confidence = Math.min(85, 55 + Math.abs(momentum) * 10)
  } else if (rsi > 70 && macdSignal === 'BEARISH') {
    signal = 'SELL'
    confidence = Math.min(90, 60 + (rsi - 70))
  }

  // Trend continuation
  if (signal === 'WAIT') {
    if (trend === 'UP' && rsi > 40 && rsi < 70 && macdSignal === 'BULLISH') {
      signal = 'BUY'
      confidence = 65
    } else if (trend === 'DOWN' && rsi < 60 && rsi > 30 && macdSignal === 'BEARISH') {
      signal = 'SELL'
      confidence = 65
    }
  }

  return {
    rsi: Math.round(rsi),
    macdSignal,
    momentum: Math.round(momentum * 100) / 100,
    trend,
    signal,
    confidence: Math.max(45, Math.min(95, Math.round(confidence))),
  }
}

export function calculateRoundLevels(price: number): {
  support: number
  resistance: number
} {
  // Find key round numbers for support/resistance
  const magnitude = Math.pow(10, Math.floor(Math.log10(price)))
  const roundLevel = Math.round(price / (magnitude * 0.1)) * (magnitude * 0.1)

  return {
    support: roundLevel - magnitude * 0.5,
    resistance: roundLevel + magnitude * 0.5,
  }
}
