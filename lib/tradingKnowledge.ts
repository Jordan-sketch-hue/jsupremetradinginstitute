// Trading Knowledge Base for AI Chatbot

export const tradingKnowledge = {
  // ORDER BLOCKS
  orderBlocks: {
    definition:
      "An order block is the last opposing candle before a strong impulsive move. It represents the zone where institutions placed their orders. For bullish order blocks, it's the last bearish candle before a rally. For bearish order blocks, it's the last bullish candle before a selloff.",

    bullish:
      'Bullish order blocks form when price makes an impulsive move upward. The last bearish candle before this move is where banks placed buy orders. This zone becomes future support and a high-probability re-entry area.',

    bearish:
      'Bearish order blocks form when price makes an impulsive move downward. The last bullish candle before this move is where banks placed sell orders. This zone becomes future resistance.',

    requirements: [
      'Strong displacement (impulsive move)',
      'Break of structure (BOS)',
      'High volume on the move',
      'Leaves imbalance or inefficiency (gap)',
      'Clear opposing candle before impulse',
    ],

    mitigation: {
      unmitigated:
        "Price has NOT returned to the order block zone yet. These are highest probability setups because institutional orders haven't been filled. Priority target zones.",
      mitigated:
        'Price already revisited and used the orders. While still valid as support/resistance, priority goes to unmitigated zones. Lower probability.',
    },
  },

  // MARKET STRUCTURE
  marketStructure: {
    definition:
      'Market structure is the framework of higher highs (HH), higher lows (HL), lower highs (LH), and lower lows (LL) that determines trend direction.',

    uptrend:
      'Series of higher highs and higher lows. In uptrends, ONLY look for buy opportunities. Never fight the structure. Wait for price to return to demand zones (bullish order blocks).',

    downtrend:
      'Series of lower highs and lower lows. In downtrends, ONLY look for sell opportunities. Wait for price to return to supply zones (bearish order blocks).',

    breakOfStructure:
      'BOS (Break of Structure) occurs when price breaks a significant high in an uptrend or significant low in a downtrend. This confirms the trend continuation and validates order blocks.',

    changeOfCharacter:
      'CHoCH (Change of Character) signals potential trend reversal. When price breaks against the current trend structure, it indicates institutional positioning may be changing.',
  },

  // LIQUIDITY THEORY
  liquidity: {
    definition:
      'Liquidity refers to areas where many stop-loss orders are placed. Institutions need liquidity to fill large orders, so they hunt these areas before making real moves.',

    locations: [
      'Equal highs - Multiple swing highs at same level',
      'Equal lows - Multiple swing lows at same level',
      'Previous day high/low',
      'Weekly/monthly highs and lows',
      'Round numbers (psychological levels)',
      'Trendline breaks',
      'Chart pattern stop zones',
    ],

    liquiditySweep:
      'When price quickly spikes into a liquidity zone to trigger stops, then reverses. This is manipulation. We enter AFTER the sweep when price returns to our order block.',

    stopHunt:
      'Institutions push price just beyond obvious levels to trigger retail stop losses, then reverse direction. This creates liquidity for their real position.',
  },

  // MARKET CYCLES
  marketCycles: {
    accumulation: {
      description: 'Phase 1 - Banks quietly build positions',
      signs: [
        'Sideways consolidation',
        'Tight price ranges',
        'Low volatility',
        'Multiple equal highs/lows forming',
        'Compression patterns',
      ],
      action: "Wait and observe. Don't trade ranges.",
    },

    manipulation: {
      description: 'Phase 2 - Fake breakouts to grab liquidity',
      signs: [
        'False breakouts',
        'Stop hunts',
        'Quick spikes and reversals',
        'Retail traders getting trapped',
        'Liquidity sweeps',
      ],
      action: 'This is where most traders lose. We prepare to enter AFTER manipulation.',
    },

    distribution: {
      description: 'Phase 3 - Real directional move begins',
      signs: [
        'Strong momentum',
        'High volume',
        'Break of structure',
        'Impulsive moves',
        'Order blocks being respected',
      ],
      action: 'Enter on pullbacks to order blocks with confirmations.',
    },
  },

  // INDICATORS
  indicators: {
    rsi: {
      purpose: 'Measures momentum and exhaustion. We use it as CONFIRMATION, not decision maker.',
      institutionalUse: [
        'Oversold (<30) at bullish order block = buy confirmation',
        'Overbought (>70) at bearish order block = sell confirmation',
        'Bullish divergence: Price makes lower low, RSI makes higher low',
        'Bearish divergence: Price makes higher high, RSI makes lower high',
      ],
      note: 'Never enter based on RSI alone. It must align with structure + order block.',
    },

    atr: {
      purpose: 'Measures volatility to set realistic stops and targets.',
      usage: [
        'Stop loss placement: OB zone + (ATR * 0.5)',
        'Profit targets: Multiple of ATR',
        'Avoid trading when ATR is too low (no movement)',
        'Expect larger moves when ATR expands',
      ],
      example: 'If ATR = 30 pips, stop should be 15-20 pips beyond order block.',
    },
  },

  // ENTRY CRITERIA
  entry: {
    highProbabilitySetup: [
      '1. Higher timeframe trend alignment (Daily/4H)',
      '2. Price at unmitigated order block',
      '3. Liquidity sweep occurred',
      '4. RSI showing divergence or extreme reading',
      '5. ATR supports realistic movement',
      '6. Structure break on entry timeframe (1H/15M)',
    ],

    timeframeAlignment: {
      daily: 'Identify major trend and key institutional zones',
      fourHour: 'Refine order blocks and structure',
      oneHour: 'Confirm structure shifts and liquidity sweeps',
      fifteenMin: 'Precise entry timing with confirmation candle',
      fiveMin: 'Micro structure and exact entry point',
    },

    confirmationCandle:
      'Wait for price to touch order block and show rejection (bullish candle in demand zone, bearish candle in supply zone) before entering.',
  },

  // RISK MANAGEMENT
  riskManagement: {
    positionSizing: 'Never risk more than 1-2% of account per trade. Even best setups can fail.',

    stopLoss:
      'Place stops slightly beyond order block + ATR buffer. Never move stop closer to entry. Honor your stop.',

    profitTargets: [
      'First target: Recent swing high/low',
      'Second target: Next liquidity level',
      'Final target: Major structure level',
    ],

    emotionalDiscipline: [
      "Don't force trades",
      'Accept losses as part of the game',
      'Journal every trade',
      'Review weekly performance',
      'Focus on process, not outcomes',
    ],
  },

  // PSYCHOLOGY
  psychology: {
    patience:
      "Best traders wait for perfect setups. If setup doesn't meet all criteria, skip it. Market always provides new opportunities.",

    disciplineRules: [
      'Never trade during news unless planned',
      "Don't revenge trade after loss",
      'Stick to your plan',
      "Accept that you'll miss moves",
      'Losses are tuition for learning',
    ],

    institutionalMindset: [
      'Think in probabilities, not certainties',
      'Trade what you see, not what you think',
      'Institutions have infinite patience',
      'They create the move, we follow',
      'Let price come to you',
    ],
  },

  // FUNDAMENTALS
  fundamentals: {
    purpose: 'Fundamentals provide directional bias. Technicals provide entry timing.',

    keyDrivers: [
      'Interest rate decisions (most important)',
      'CPI (inflation data)',
      'GDP reports',
      'Employment data (NFP)',
      'Central bank speeches',
      'Geopolitical events',
    ],

    integration:
      "If fundamentals favor USD strength, look for USD buy setups at bullish order blocks. Don't fight fundamental bias with counter-trend trades.",
  },

  // COMMON MISTAKES
  commonMistakes: [
    'Trading against trend structure',
    'Entering without liquidity sweep',
    'Using indicators as primary signal',
    'Taking profits too early',
    'Moving stops to avoid losses',
    'Forcing trades when no setup exists',
    'Ignoring higher timeframes',
    'Overtrading',
  ],

  // SUCCESS PRINCIPLES
  successPrinciples: [
    'Trade less, earn more',
    'Quality over quantity',
    'Master one strategy before adding more',
    'Backtest before live trading',
    'Paper trade new concepts',
    'Build confidence through repetition',
    'Focus on process, not money',
    'Protect capital above all else',
  ],
}

// Helper function to search knowledge base
export function searchKnowledge(query: string): string {
  const lowerQuery = query.toLowerCase()

  // Search through knowledge base
  if (lowerQuery.includes('order block')) {
    if (lowerQuery.includes('bullish')) return tradingKnowledge.orderBlocks.bullish
    if (lowerQuery.includes('bearish')) return tradingKnowledge.orderBlocks.bearish
    if (lowerQuery.includes('mitigat'))
      return JSON.stringify(tradingKnowledge.orderBlocks.mitigation)
    return tradingKnowledge.orderBlocks.definition
  }

  if (lowerQuery.includes('liquidity')) {
    if (lowerQuery.includes('sweep')) return tradingKnowledge.liquidity.liquiditySweep
    return tradingKnowledge.liquidity.definition
  }

  if (lowerQuery.includes('structure') || lowerQuery.includes('trend')) {
    if (lowerQuery.includes('uptrend')) return tradingKnowledge.marketStructure.uptrend
    if (lowerQuery.includes('downtrend')) return tradingKnowledge.marketStructure.downtrend
    return tradingKnowledge.marketStructure.definition
  }

  if (lowerQuery.includes('rsi')) {
    return (
      tradingKnowledge.indicators.rsi.purpose +
      ' ' +
      tradingKnowledge.indicators.rsi.institutionalUse.join('. ')
    )
  }

  if (lowerQuery.includes('atr')) {
    return (
      tradingKnowledge.indicators.atr.purpose +
      ' ' +
      tradingKnowledge.indicators.atr.usage.join('. ')
    )
  }

  if (lowerQuery.includes('entry') || lowerQuery.includes('setup')) {
    return (
      'High probability entry requires: ' + tradingKnowledge.entry.highProbabilitySetup.join(', ')
    )
  }

  if (lowerQuery.includes('risk') || lowerQuery.includes('stop')) {
    return (
      tradingKnowledge.riskManagement.positionSizing +
      ' ' +
      tradingKnowledge.riskManagement.stopLoss
    )
  }

  if (
    lowerQuery.includes('manipulation') ||
    lowerQuery.includes('accumulation') ||
    lowerQuery.includes('distribution')
  ) {
    return 'Market cycles: ' + JSON.stringify(tradingKnowledge.marketCycles)
  }

  // Default response
  return 'I can help you understand trading concepts. Ask me about: order blocks, liquidity, market structure, RSI, ATR, entry setups, risk management, or market cycles.'
}

export default tradingKnowledge
