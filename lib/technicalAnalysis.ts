/**
 * Calculate ATR (Average True Range)
 * ATR = Moving average of True Range over period
 * True Range = max(high-low, abs(high-prevClose), abs(low-prevClose))
 * Expects candles as array of {high, low, close}
 */
export function calculateATR(
  candles: { high: number; low: number; close: number }[],
  period: number = 14
): number {
  if (!candles || candles.length < period + 1) return 0
  let trs: number[] = []
  for (let i = 1; i < candles.length; i++) {
    const prevClose = candles[i - 1].close
    const high = candles[i].high
    const low = candles[i].low
    const tr = Math.max(high - low, Math.abs(high - prevClose), Math.abs(low - prevClose))
    trs.push(tr)
  }
  // Simple moving average of TRs
  const recentTRs = trs.slice(-period)
  const atr = recentTRs.reduce((a, b) => a + b, 0) / period
  return Math.round(atr * 10000) / 10000
}
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

/**
 * Calculate RSI using Wilder's smoothing method (authentic formula)
 * RSI = 100 - (100 / (1 + RS))
 * RS = Average Gain / Average Loss
 * Uses Wilder's smoothing for averaging
 */
export function calculateRSI(prices: number[], period: number = 14): number {
  if (prices.length < period + 1) return 50

  const changes: number[] = []
  for (let i = 1; i < prices.length; i++) {
    changes.push(prices[i] - prices[i - 1])
  }

  // Initial averages (simple moving average for first period)
  let avgGain = 0
  let avgLoss = 0

  for (let i = 0; i < period; i++) {
    if (changes[i] > 0) avgGain += changes[i]
    else avgLoss += Math.abs(changes[i])
  }

  avgGain /= period
  avgLoss /= period

  // Wilder's smoothing for subsequent values
  for (let i = period; i < changes.length; i++) {
    const change = changes[i]
    if (change > 0) {
      avgGain = (avgGain * (period - 1) + change) / period
      avgLoss = (avgLoss * (period - 1)) / period
    } else {
      avgGain = (avgGain * (period - 1)) / period
      avgLoss = (avgLoss * (period - 1) + Math.abs(change)) / period
    }
  }

  // Calculate RS and RSI
  if (avgLoss === 0) return 100
  const rs = avgGain / avgLoss
  const rsi = 100 - 100 / (1 + rs)

  return Math.min(100, Math.max(0, rsi))
}

/**
 * Calculate MACD with proper EMA methodology
 * MACD Line = 12-period EMA - 26-period EMA
 * Signal Line = 9-period EMA of MACD Line
 * Histogram = MACD Line - Signal Line
 */
export function calculateMACD(prices: number[]): {
  macd: number
  signal: number
  histogram: number
} {
  if (prices.length < 26) {
    return { macd: 0, signal: 0, histogram: 0 }
  }

  const ema12Values = calculateEMAArray(prices, 12)
  const ema26Values = calculateEMAArray(prices, 26)

  // MACD line = EMA12 - EMA26
  const macdLine: number[] = []
  for (let i = 0; i < ema12Values.length; i++) {
    macdLine.push(ema12Values[i] - ema26Values[i])
  }

  // Signal line = 9-period EMA of MACD line
  const signalLineValues = calculateEMAArray(macdLine, 9)

  // Get most recent values
  const macd = macdLine[macdLine.length - 1]
  const signal = signalLineValues[signalLineValues.length - 1]
  const histogram = macd - signal

  return { macd, signal, histogram }
}

/**
 * Calculate EMA array for all prices (proper exponential moving average)
 * Returns array of EMA values matching input length
 */
function calculateEMAArray(prices: number[], period: number): number[] {
  if (prices.length < period) return prices

  const multiplier = 2 / (period + 1)
  const emaArray: number[] = []

  // First EMA is simple moving average of first 'period' prices
  let sum = 0
  for (let i = 0; i < period; i++) {
    sum += prices[i]
  }
  let ema = sum / period
  emaArray.push(ema)

  // Subsequent EMAs use the formula: EMA = (Price - EMA_prev) * multiplier + EMA_prev
  for (let i = period; i < prices.length; i++) {
    ema = (prices[i] - ema) * multiplier + ema
    emaArray.push(ema)
  }

  return emaArray
}

/**
 * Legacy EMA function (kept for backwards compatibility)
 */
function calculateEMA(prices: number[], period: number): number {
  const emaArray = calculateEMAArray(prices, period)
  return emaArray[emaArray.length - 1]
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
