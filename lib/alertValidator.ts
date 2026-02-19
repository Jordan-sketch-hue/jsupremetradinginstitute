/**
 * Alert Validator - Multi-criteria scoring system for trade alerts
 * Evaluates risk/reward, price logic, confidence levels
 */

interface TelegramAlert {
  asset: string
  signal: 'BUY' | 'SELL' | 'CLOSE' | 'WAIT'
  entryPrice?: number
  stopLoss?: number
  takeProfit?: number
  category?: string
  source?: 'PROVIDER' | 'WEBSITE' | 'EMAIL'
}

interface ValidationScore {
  score: number
  maxScore: number
  confidence: number
  grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F'
  checks: {
    riskReward: number
    priceLogic: number
    stopDistance: number
    targetDistance: number
    sourceCredibility: number
    categoryRisk: number
    volatility: number
  }
}

/**
 * Validate alert on 7 criteria and return confidence score
 */
export function validateAlertScore(alert: TelegramAlert): ValidationScore {
  const checks = {
    riskReward: 0,
    priceLogic: 0,
    stopDistance: 0,
    targetDistance: 0,
    sourceCredibility: 0,
    categoryRisk: 0,
    volatility: 0,
  }

  const maxPointsPerCheck = 100 / 7 // ~14.3 points each

  // 1. Risk/Reward Ratio (15 points max)
  if (alert.entryPrice && alert.stopLoss && alert.takeProfit) {
    const riskPoints = Math.abs(alert.entryPrice - alert.stopLoss)
    const rewardPoints = Math.abs(alert.takeProfit - alert.entryPrice)
    const rr = rewardPoints / riskPoints

    if (rr >= 2.0)
      checks.riskReward = 15 // Excellent
    else if (rr >= 1.5)
      checks.riskReward = 13 // Good
    else if (rr >= 1.0)
      checks.riskReward = 11 // Fair
    else if (rr >= 0.5)
      checks.riskReward = 7 // Poor
    else checks.riskReward = 3 // Very poor
  }

  // 2. Price Logic (15 points max)
  if (alert.signal === 'BUY' && alert.entryPrice && alert.stopLoss && alert.takeProfit) {
    if (alert.stopLoss < alert.entryPrice && alert.takeProfit > alert.entryPrice) {
      checks.priceLogic = 15 // Correct
    } else {
      checks.priceLogic = 0 // Wrong
    }
  } else if (alert.signal === 'SELL' && alert.entryPrice && alert.stopLoss && alert.takeProfit) {
    if (alert.takeProfit < alert.entryPrice && alert.stopLoss > alert.entryPrice) {
      checks.priceLogic = 15 // Correct
    } else {
      checks.priceLogic = 0 // Wrong
    }
  } else {
    checks.priceLogic = 10 // Partial credit
  }

  // 3. Stop Loss Distance (12 points max)
  if (alert.entryPrice && alert.stopLoss) {
    const slDistance = Math.abs(alert.entryPrice - alert.stopLoss) / alert.entryPrice
    if (slDistance >= 0.001 && slDistance <= 0.05) {
      checks.stopDistance = 12 // 0.1% - 5%
    } else if (slDistance < 0.001) {
      checks.stopDistance = 6 // Too tight
    } else if (slDistance > 0.05) {
      checks.stopDistance = 8 // Too wide but acceptable
    }
  }

  // 4. Take Profit Distance (12 points max)
  if (alert.entryPrice && alert.takeProfit) {
    const tpDistance = Math.abs(alert.takeProfit - alert.entryPrice) / alert.entryPrice
    if (tpDistance >= 0.002 && tpDistance <= 0.2) {
      checks.targetDistance = 12 // 0.2% - 20%
    } else if (tpDistance < 0.002) {
      checks.targetDistance = 5 // Too tight
    } else if (tpDistance > 0.2) {
      checks.targetDistance = 8 // Too wide but acceptable
    }
  }

  // 5. Source Credibility (15 points max)
  const sourceScore = getSourceCredibilityScore(alert.source)
  checks.sourceCredibility = sourceScore

  // 6. Category Risk (12 points max)
  const categoryScore = getCategoryRiskScore(alert.category)
  checks.categoryRisk = categoryScore

  // 7. Volatility Check (Optional, 9 points max)
  checks.volatility = 9 // Default high score if ATR check disabled

  // Calculate total score
  const totalScore = Object.values(checks).reduce((a, b) => a + b, 0)
  const maxScore = 15 + 15 + 12 + 12 + 15 + 12 + 9 // 90

  const confidence = totalScore / maxScore
  const grade = getGrade(confidence)

  return {
    score: totalScore,
    maxScore,
    confidence: Math.min(Math.max(confidence, 0), 1), // Clamp 0-1
    grade,
    checks,
  }
}

/**
 * Get confidence score for alert source
 */
function getSourceCredibilityScore(source?: string): number {
  // Maximum 15 points
  const scoreMap: { [key: string]: number } = {
    PROVIDER: 15, // VIP provider group - fully trusted
    WEBSITE: 12, // Your own website signals
    EMAIL: 10, // Email alerts
    MANUAL: 8, // Manual entry
  }

  return scoreMap[source || 'MANUAL'] || 8
}

/**
 * Get risk score for asset category
 */
function getCategoryRiskScore(category?: string): number {
  // Maximum 12 points
  const scoreMap: { [key: string]: number } = {
    FOREX: 12, // Forex - most stable
    COMMODITIES: 11, // Commodities - moderate
    INDICES: 10, // Indices - moderate-high
    CRYPTO: 8, // Crypto - high volatility, lower score
  }

  return scoreMap[category || 'FOREX'] || 10
}

/**
 * Calculate grade (S-F) from confidence
 */
function getGrade(confidence: number): 'S' | 'A' | 'B' | 'C' | 'D' | 'F' {
  if (confidence >= 0.95) return 'S'
  if (confidence >= 0.85) return 'A'
  if (confidence >= 0.75) return 'B'
  if (confidence >= 0.65) return 'C'
  if (confidence >= 0.5) return 'D'
  return 'F'
}

/**
 * Quick validation - 3 key checks only (fast)
 */
export function quickValidateAlert(alert: TelegramAlert): {
  valid: boolean
  checks: { rr: boolean; priceLogic: boolean; confidence: boolean }
} {
  const checks = {
    rr: false,
    priceLogic: false,
    confidence: false,
  }

  // Check 1: Risk/Reward acceptable
  if (alert.entryPrice && alert.stopLoss && alert.takeProfit) {
    const riskPoints = Math.abs(alert.entryPrice - alert.stopLoss)
    const rewardPoints = Math.abs(alert.takeProfit - alert.entryPrice)
    const rr = rewardPoints / riskPoints
    checks.rr = rr >= 0.5 && rr <= 5.0
  }

  // Check 2: Price logic correct
  if (alert.signal === 'BUY' && alert.entryPrice && alert.stopLoss && alert.takeProfit) {
    checks.priceLogic = alert.stopLoss < alert.entryPrice && alert.takeProfit > alert.entryPrice
  } else if (alert.signal === 'SELL' && alert.entryPrice && alert.stopLoss && alert.takeProfit) {
    checks.priceLogic = alert.takeProfit < alert.entryPrice && alert.stopLoss > alert.entryPrice
  } else {
    checks.priceLogic = true // Neutral signal
  }

  // Check 3: Source credible
  checks.confidence = ['PROVIDER', 'WEBSITE'].includes(alert.source || 'MANUAL')

  return {
    valid: checks.rr && checks.priceLogic && checks.confidence,
    checks,
  }
}

/**
 * Format validation result for display
 */
export function formatValidationResult(score: ValidationScore): string {
  const { grade, confidence, checks } = score
  const lines = [
    `Grade: ${grade}`,
    `Confidence: ${(confidence * 100).toFixed(1)}%`,
    `R/R: ${checks.riskReward}/15 pts`,
    `Price Logic: ${checks.priceLogic}/15 pts`,
    `SL Distance: ${checks.stopDistance}/12 pts`,
    `TP Distance: ${checks.targetDistance}/12 pts`,
    `Source: ${checks.sourceCredibility}/15 pts`,
    `Category: ${checks.categoryRisk}/12 pts`,
    `Volatility: ${checks.volatility}/9 pts`,
  ]

  return lines.join('\n')
}
