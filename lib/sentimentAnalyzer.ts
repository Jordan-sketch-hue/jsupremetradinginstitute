'use client'

// Sentiment Analysis for Market Bias Detection
// Analyzes user queries to detect trading bias and emotional state

export interface SentimentAnalysis {
  bias: 'bullish' | 'bearish' | 'neutral'
  confidence: number // 0-1
  emotions: string[]
  urgency: 'low' | 'medium' | 'high'
  keywords: string[]
  analysis: string
}

// Positive/Bullish indicators
const BULLISH_KEYWORDS = [
  'buy',
  'long',
  'up',
  'rally',
  'surge',
  'moon',
  'pump',
  'bullish',
  'strong',
  'breakout',
  'resistance',
  'above',
  'higher',
  'up move',
  'going up',
  'rise',
  'gain',
  'positive',
  'bull',
  'bull run',
]

// Negative/Bearish indicators
const BEARISH_KEYWORDS = [
  'sell',
  'short',
  'down',
  'crash',
  'dump',
  'bearish',
  'weak',
  'breakdown',
  'support',
  'below',
  'lower',
  'down move',
  'going down',
  'drop',
  'fall',
  'loss',
  'negative',
  'bear',
  'bear market',
  'declining',
]

// Emotional/Urgent indicators
const URGENT_KEYWORDS = [
  'quick',
  'now',
  'immediately',
  'urgent',
  'asap',
  'hurry',
  'fast',
  'time sensitive',
  'fomo',
]

const EMOTIONAL_KEYWORDS = {
  fear: ['scared', 'worried', 'afraid', 'panic', 'stress', 'anxiety', 'terrified', 'concerned'],
  greed: ['greedy', 'fomo', 'moon', 'lamborghini', 'rich', 'fortune', 'jackpot', 'get rich'],
  confidence: ['sure', 'confident', 'certain', 'know', 'strong', 'powerful', 'obvious'],
  frustration: ['angry', 'mad', 'frustrated', 'annoyed', 'tired', 'sick of'],
  doubt: ['unsure', 'confused', 'uncertain', 'not sure', 'maybe', 'think', 'probably'],
}

export function analyzeSentiment(query: string): SentimentAnalysis {
  const lowerQuery = query.toLowerCase()
  let bullishScore = 0
  let bearishScore = 0
  const emotions: string[] = []
  let urgency: 'low' | 'medium' | 'high' = 'low'
  const keywords: string[] = []

  // Analyze bullish keywords
  BULLISH_KEYWORDS.forEach(keyword => {
    if (lowerQuery.includes(keyword)) {
      bullishScore++
      keywords.push(keyword)
    }
  })

  // Analyze bearish keywords
  BEARISH_KEYWORDS.forEach(keyword => {
    if (lowerQuery.includes(keyword)) {
      bearishScore++
      keywords.push(keyword)
    }
  })

  // Analyze emotional state
  Object.entries(EMOTIONAL_KEYWORDS).forEach(([emotion, words]) => {
    words.forEach(word => {
      if (lowerQuery.includes(word)) {
        emotions.push(emotion)
      }
    })
  })

  // Check urgency
  if (URGENT_KEYWORDS.some(keyword => lowerQuery.includes(keyword))) {
    urgency = 'high'
  }

  // Determine bias
  let bias: 'bullish' | 'bearish' | 'neutral' = 'neutral'
  let confidence = 0

  const total = bullishScore + bearishScore
  if (total > 0) {
    if (bullishScore > bearishScore) {
      bias = 'bullish'
      confidence = bullishScore / total
    } else if (bearishScore > bullishScore) {
      bias = 'bearish'
      confidence = bearishScore / total
    } else {
      bias = 'neutral'
      confidence = 0.5
    }
  }

  // Generate analysis text
  let analysis = ''
  if (emotions.length > 0) {
    analysis += `I detect emotions: ${emotions.join(', ')}. `
  }

  if (urgency === 'high') {
    analysis += `⚠️ I notice urgency in your question. Remember: Best trades take patience, not speed. `
  }

  if (bias === 'bullish' && emotions.includes('greed')) {
    analysis += `🔴 Caution: Greed bias detected. Ensure your setup has 3+ confluence factors before entering. `
  }

  if (bias === 'bearish' && emotions.includes('fear')) {
    analysis += `🔴 Caution: Fear bias detected. Don't panic-sell. Stick to your risk management rules. `
  }

  if (emotions.includes('frustration')) {
    analysis += `Take a break if frustrated. Clear mind = Better decisions. `
  }

  return {
    bias,
    confidence: Math.min(confidence, 1),
    emotions: [...new Set(emotions)],
    urgency,
    keywords: [...new Set(keywords)],
    analysis: analysis || 'Neutral market sentiment detected.',
  }
}

// Function to generate bias recommendation
export function getBiasRecommendation(sentiment: SentimentAnalysis): string {
  if (sentiment.bias === 'bullish' && sentiment.confidence > 0.7) {
    return '📈 Your bias is strongly bullish. Look for BUY setups at order blocks on support zones with confluence.'
  } else if (sentiment.bias === 'bearish' && sentiment.confidence > 0.7) {
    return '📉 Your bias is strongly bearish. Look for SELL setups at order blocks on resistance zones with confluence.'
  } else if (sentiment.bias === 'neutral') {
    return '⚖️ Your bias is neutral. This is good - trade what you see, not what you feel. Wait for clear structure signals.'
  }
  return ''
}

// Function to check if trader should proceed or wait
export function shouldTradeBasedOnSentiment(sentiment: SentimentAnalysis): boolean {
  const hasNegativeEmotions = sentiment.emotions.some(e =>
    ['fear', 'frustration', 'greed'].includes(e)
  )
  const isHighUrgency = sentiment.urgency === 'high'
  const hasHighConfidence = sentiment.confidence > 0.8

  // Don't trade if emotional or rushed
  if (hasNegativeEmotions && isHighUrgency) {
    return false
  }

  // Better to trade with clear structure than unclear emotions
  return !hasNegativeEmotions || hasHighConfidence
}

// Function to get psychology tip based on sentiment
export function getPsychologyTip(sentiment: SentimentAnalysis): string {
  if (sentiment.emotions.includes('greed')) {
    return '🧠 Psychology Tip: Greed causes over-trading and larger positions. Stick to your 2% risk rule and position size.'
  }
  if (sentiment.emotions.includes('fear')) {
    return '🧠 Psychology Tip: Fear causes you to miss trades or exit early. Remember: Your stop loss protects you. Stick to your plan.'
  }
  if (sentiment.emotions.includes('frustration')) {
    return '🧠 Psychology Tip: Frustration leads to revenge trading. Close charts, take a break, come back clear-minded.'
  }
  if (sentiment.urgency === 'high') {
    return '🧠 Psychology Tip: FOMO (fear of missing out) causes you to chase trades. The best setup appears multiple times. Wait for YOUR setup.'
  }
  if (sentiment.emotions.includes('doubt')) {
    return '🧠 Psychology Tip: Doubt causes hesitation on good setups. If you have 3+ confluence factors, take the trade. Trust your system.'
  }
  return '🧠 Psychology Tip: Trade with discipline, not emotion. Follow your plan regardless of how you feel.'
}
