export type ArticleSection = {
  heading: string
  body: string
  bullets?: string[]
}

export type Article = {
  slug: string
  title: string
  category: string
  date: string
  excerpt: string
  readTime: string
  author: string
  tags: string[]
  sections: ArticleSection[]
}

export const articles: Article[] = [
  {
    slug: 'valid-order-blocks-ranging-markets',
    title: 'How to Identify Valid Order Blocks in Ranging Markets',
    category: 'Strategy',
    date: '2 hours ago',
    readTime: '7 min read',
    author: 'J Supreme Research',
    tags: ['Order Blocks', 'Ranges', 'Structure', 'Entry Criteria'],
    excerpt:
      'Learn the specific criteria that separate high-probability order blocks from false signals when price is consolidating...',
    sections: [
      {
        heading: 'Why ranges create false order blocks',
        body: 'In a range, both buy-side and sell-side liquidity are close. That means price can tap multiple zones without commitment. A valid order block in a range must still show institutional displacement and clean imbalance, otherwise it is just noise.',
      },
      {
        heading: 'The 4-point validation checklist',
        body: 'Use this filter before calling a range zone an order block.',
        bullets: [
          'Clear displacement away from the zone (impulsive move with momentum).',
          'Visible imbalance/inefficiency (gap or swift move leaving thin candles).',
          'Sweep of liquidity on one side of the range before the move.',
          'Return to the zone happens with lower volatility (sign of absorption).',
        ],
      },
      {
        heading: 'Optimal entry plan',
        body: 'Let price return to the order block after the liquidity sweep. Entry should be near the 50% level of the block with a tight stop beyond the block, targeting the opposing range liquidity.',
      },
      {
        heading: 'Common mistakes',
        body: 'Most losses come from trading the first touch without confirmation.',
        bullets: [
          'No displacement: price floats away instead of leaving with force.',
          'No sweep: the move begins without taking range liquidity.',
          'Chasing the midpoint after price already left the block.',
        ],
      },
    ],
  },
  {
    slug: 'eurusd-institutional-accumulation-10840',
    title: 'EUR/USD: Institutional Accumulation at 1.0840',
    category: 'Market Analysis',
    date: '5 hours ago',
    readTime: '6 min read',
    author: 'J Supreme Research',
    tags: ['EUR/USD', 'Accumulation', 'Liquidity'],
    excerpt:
      "Major banks have been quietly accumulating long positions in the 1.0840-1.0850 zone. Here's what this means for retail traders...",
    sections: [
      {
        heading: 'What the accumulation tells us',
        body: 'Repeated defenses of 1.0840 combined with shallow pullbacks suggest passive buyers. When institutions accumulate, they typically hide size by letting price rotate within a narrow band before a breakout.',
      },
      {
        heading: 'Execution plan',
        body: 'Wait for a sweep below 1.0840, then watch for a bullish displacement to confirm the order block. Entries are best on a return into the bullish block, not on the initial breakout.',
        bullets: [
          'Liquidity sweep below 1.0840',
          'Displacement above 1.0870',
          'Retest into the block for entry',
        ],
      },
      {
        heading: 'Risk and targets',
        body: 'Stops belong below the order block. The first target is the nearest range high; the second target is the next higher-timeframe liquidity pool.',
      },
    ],
  },
  {
    slug: 'psychology-waiting-for-mitigation',
    title: 'The Psychology of Waiting for Order Block Mitigation',
    category: 'Psychology',
    date: '1 day ago',
    readTime: '5 min read',
    author: 'J Supreme Research',
    tags: ['Discipline', 'Patience', 'Mitigation'],
    excerpt:
      "Why most traders fail: They can't wait for price to reach their predetermined entry zone. Master this skill and you'll outperform 80% of traders...",
    sections: [
      {
        heading: 'Patience is an edge',
        body: 'Institutions wait for price to return to their zone. Retail traders chase momentum. The difference is patience and predefined execution rules.',
      },
      {
        heading: 'How to train the wait',
        body: 'Build a pre-entry checklist and only allow yourself to execute once every box is checked. This removes emotion from the trigger.',
        bullets: [
          'Price must revisit the unmitigated order block.',
          'There must be a liquidity sweep or inducement.',
          'Market structure must still align with your bias.',
        ],
      },
      {
        heading: 'Reframe missing trades',
        body: 'If price never returns, you didn’t miss a trade—you avoided a low-quality entry. Your job is to execute high-probability setups, not every move.',
      },
    ],
  },
  {
    slug: 'gold-testing-2650-liquidity',
    title: 'Gold Testing Key Liquidity Zone at $2,650',
    category: 'Market Analysis',
    date: '1 day ago',
    readTime: '6 min read',
    author: 'J Supreme Research',
    tags: ['XAU/USD', 'Liquidity', 'Stop Hunt'],
    excerpt:
      'XAUUSD has formed equal highs at $2,650 - a textbook liquidity grab setup. Watch for a stop hunt before the real move...',
    sections: [
      {
        heading: 'Liquidity structure',
        body: 'Equal highs at 2,650 indicate clustered stops. Institutions often drive price above these highs to trigger buy stops and sell into that liquidity.',
      },
      {
        heading: 'What to wait for',
        body: 'A quick spike above 2,650 followed by a sharp displacement down is the confirmation. That displacement forms the bearish order block.',
      },
      {
        heading: 'Execution notes',
        body: 'Look for a return to the bearish block to enter short, with targets at the last unmitigated demand and the lower liquidity pool.',
      },
    ],
  },
  {
    slug: 'atr-stops-optimal-placement',
    title: 'Understanding ATR for Optimal Stop Loss Placement',
    category: 'Risk Management',
    date: '2 days ago',
    readTime: '6 min read',
    author: 'J Supreme Research',
    tags: ['ATR', 'Stops', 'Volatility'],
    excerpt:
      'Stop getting stopped out by normal market noise. ATR-based stops adapt to current volatility and drastically improve your win rate...',
    sections: [
      {
        heading: 'Why ATR works',
        body: 'ATR measures recent volatility. When markets are volatile, stops need more room; when volatility contracts, stops can be tighter. Using a fixed pip stop ignores changing conditions.',
      },
      {
        heading: 'Simple ATR method',
        body: 'Set your stop to 1.5x or 2x ATR away from your entry, then align it with structure or the order block edge.',
        bullets: [
          'Aggressive: 1.0x–1.5x ATR',
          'Balanced: 1.5x–2.0x ATR',
          'Conservative: 2.0x–2.5x ATR',
        ],
      },
      {
        heading: 'Combine with order blocks',
        body: 'Stops should sit beyond the order block and beyond recent liquidity. This protects against stop hunts while keeping risk controlled.',
      },
    ],
  },
  {
    slug: 'weekly-bias-feb-3-7',
    title: 'Weekly Bias: Major Pairs & Commodities (Feb 3-7)',
    category: 'Weekly Outlook',
    date: '3 days ago',
    readTime: '8 min read',
    author: 'J Supreme Research',
    tags: ['Weekly Bias', 'Macro', 'Commodities'],
    excerpt:
      'Our institutional bias for the week ahead: EUR/USD bullish, Gold accumulation, GBP/USD bearish distribution phase...',
    sections: [
      {
        heading: 'EUR/USD',
        body: 'Bias remains bullish while price holds above 1.0840 demand. Wait for pullbacks into bullish order blocks before looking for continuation.',
      },
      {
        heading: 'GBP/USD',
        body: 'Structure favors distribution. Look for rallies into bearish order blocks near prior highs with stops above liquidity.',
      },
      {
        heading: 'Gold (XAU/USD)',
        body: 'Accumulation under 2,650. A liquidity sweep above 2,650 followed by bearish displacement would signal a short-term reversal.',
      },
      {
        heading: 'Risk plan for the week',
        body: 'Focus on one or two A+ setups. Reduce size around major news events. Protect capital above all.',
      },
    ],
  },
]
