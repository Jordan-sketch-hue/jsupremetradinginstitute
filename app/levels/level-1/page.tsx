'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, TrendingUp, Users, Brain, CheckCircle, Play, ArrowRight } from 'lucide-react'

export default function Level1Page() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  const lessons = [
    {
      id: 1,
      title: 'What Moves Markets',
      duration: '20 min read',
      icon: TrendingUp,
      content: `
Markets move based on supply and demand dynamics driven by multiple factors:

**Major Market Drivers:**

1. **Central Bank Policies**
   - Interest rate decisions directly impact currency valuations and asset prices
   - Forward guidance signals future monetary direction
   - Quantitative easing/tightening affects liquidity

2. **Economic Data**
   - Employment reports (unemployment rate, job creation)
   - GDP growth and inflation statistics
   - Manufacturing and services PMI indices
   - Consumer spending and retail sales

3. **Geopolitical Events**
   - Trade tensions and tariffs
   - Political elections and policy changes
   - Military conflicts affecting commodity prices
   - Natural disasters and supply chain disruptions

4. **Corporate Earnings**
   - Quarterly profit reports exceed or miss expectations
   - Management guidance on future performance
   - Sector rotation based on earnings trends

5. **Market Sentiment**
   - Investor risk appetite (risk-on vs risk-off)
   - Fear/greed cycles measured by volatility indices
   - Technical breakouts attracting momentum traders

**The Institutional Perspective:**

Large institutions don't trade on individual news events. They analyze:
- Macro trends spanning weeks/months
- Probability-weighted outcomes
- Risk/reward ratios before entering positions
- Exit strategies before entry

This is the foundation: Markets reward those who understand WHY prices move, not just WHEN they move.
      `,
    },
    {
      id: 2,
      title: 'Market Participants',
      duration: '18 min read',
      icon: Users,
      content: `
Understanding who trades and why is critical. Different players have different timeframes and motivations.

**Central Banks**
- Objective: Price stability and economic growth
- Timeframe: Years/decades
- Volume: Massive (can move entire markets)
- Tools: Interest rates, forward guidance, balance sheet adjustments

**Commercial Banks & Financial Institutions**
- Objective: Profit on spreads and market movements
- Timeframe: Various (seconds to months)
- Volume: Very high (40-50% of forex volume)
- Strategy: Prop trading, client execution, market making

**Hedge Funds & Asset Managers**
- Objective: Maximize returns for their investors
- Timeframe: Days to months (sometimes years)
- Volume: High
- Strategy: Long/short positions, macroeconomic bets, algorithmic trading

**Corporations**
- Objective: Hedge currency and commodity exposure
- Timeframe: Operational needs (weeks/months)
- Volume: Moderate but predictable
- Strategy: Natural hedging of foreign revenue/expenses

**Retail Traders (Us)**
- Objective: Profit from price movements
- Timeframe: Minutes to weeks
- Volume: Low individually, but collectively significant
- Advantage: Flexibility and ability to learn from professionals

**Why This Matters:**

Institutional traders control 90%+ of volume. When you understand institutional behavior patterns:
- You identify support/resistance where institutions manage risk
- You recognize when they're accumulating or distributing positions
- You time entries when institutional momentum forms
- You exit before institutions take their profits

The best retail traders don't fight institutions. They follow them.
      `,
    },
    {
      id: 3,
      title: 'Liquidity Basics',
      duration: '15 min read',
      icon: BookOpen,
      content: `
Liquidity is the ability to buy or sell an asset quickly without significantly affecting its price.

**Why Liquidity Matters:**

High liquidity means:
- Tight bid-ask spreads (lower trading costs)
- Quick order execution at predictable prices
- Ability to enter/exit large positions
- Less slippage on your trades

Low liquidity means:
- Wide spreads (you pay more to trade)
- Delays in execution
- Price impact when you trade
- Higher risk of getting stuck in positions

**Liquidity Sources:**

1. **Market Makers** - continuously buy and sell to provide liquidity
2. **Large Institutions** - their massive volumes create liquidity
3. **News/Events** - drive participation from various traders
4. **Trading Hours** - more participants = more liquidity

**Liquidity Sweeps (Institutional Strategy):**

Professionals deliberately move prices through liquidity zones to:
- Trigger stop losses below support (sweeping lows)
- Trigger take profits above resistance (sweeping highs)
- Accumulate at better prices during these moves
- Then reverse the market in their favor

As a retail trader, you can profit by:
- Recognizing liquidity zones (where stops cluster)
- Waiting for the sweep to occur
- Entering after the reversal when institutions reveal their position

**Key Takeaway:**

High-liquidity markets (EUR/USD, GBP/USD, gold, ES500) are easier to trade. Low-liquidity markets (exotic pairs, penny stocks) are harder. Always trade where institutions trade.
      `,
    },
    {
      id: 4,
      title: 'Trading Psychology Foundation',
      duration: '22 min read',
      icon: Brain,
      content: `
Technical analysis will never be your biggest limitation. Your psychology will be.

**The Core Challenge:**

Markets force you to make decisions under uncertainty and emotional stress:
- Real money at risk
- Conflicting signals
- FOMO when you're not in a trade
- Fear when you are in a trade
- Pressure to make quick decisions

**The Emotional Cycle:**

Most traders experience this destructive cycle:

1. **Hope** - You see a trade setup and hope it works
2. **Fear** - After entry, you fear it was wrong
3. **Regret** - You exit early and miss the move
4. **Revenge** - You overtrade to recover losses
5. **Denial** - You ignore signals because you're emotionally attached

This cycle ends with blown accounts.

**Building a Psychological Edge:**

**1. Pre-Decision Rules**
- Create a checklist BEFORE looking at charts
- Your rules must be written and specific
- Remove decisions from emotional moments
- Follow rules even when "you have a feeling"

**2. Risk Management**
- Small position sizes reduce emotional intensity
- If a loss doesn't bother you, it was sized right
- Risk that stresses you = too much risk
- Comfortable risk → clear thinking

**3. Process Over Outcome**
- You control your process (entry, stop, exit)
- You don't control whether it wins
- Judge yourself on perfect process execution
- Celebrate discipline, not profits

**4. The 24-Hour Rule**
- After any significant loss, take 24 hours off
- Never revenge trade
- Emotions need time to settle
- Clear head = better decisions

**Foundation for Level 1:**

Before advancing, you must accept:
- You will lose money on some trades
- Losses don't mean you're bad at trading
- Consistency comes from following rules, not winning
- Your mind is your biggest asset AND your biggest enemy

Master your psychology and you're ahead of 95% of traders.
      `,
    },
  ]

  const toggleLesson = (id: number) => {
    setCompletedLessons(prev => (prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]))
  }

  const progress = Math.round((completedLessons.length / lessons.length) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-platinum to-white pt-24 pb-12">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-royal-green/10 border border-royal-green/30 rounded-full mb-4">
            <span className="text-sm font-semibold text-royal-green">Level 1 of 7</span>
          </div>
          <h1 className="text-5xl font-playfair font-bold text-matte-black mb-4">
            Market <span className="text-gradient">Foundations</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understanding what truly moves markets is the foundation of institutional-grade trading.
            Master these concepts and you'll think like a pro.
          </p>
        </motion.div>

        {/* Progress */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-royal-green to-royal-emerald rounded-xl p-6 text-white mb-12"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-semibold">Lessons Completed</span>
            <span className="text-2xl font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-3">
            <div
              className="bg-white h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </motion.div>

        {/* Lessons */}
        <div className="space-y-6">
          {lessons.map((lesson, idx) => {
            const Icon = lesson.icon
            const isCompleted = completedLessons.includes(lesson.id)

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-royal-green transition-colors"
              >
                <button
                  onClick={() => toggleLesson(lesson.id)}
                  className="w-full text-left p-8 hover:bg-royal-green/5 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`flex-shrink-0 p-3 rounded-lg ${
                        isCompleted ? 'bg-green-100' : 'bg-royal-green/10'
                      }`}
                    >
                      <Icon
                        className={`w-6 h-6 ${isCompleted ? 'text-green-600' : 'text-royal-green'}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-matte-black mb-2">{lesson.title}</h3>
                      <p className="text-gray-600">{lesson.duration}</p>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-3">
                      {isCompleted && <CheckCircle className="w-6 h-6 text-green-600" />}
                      <ArrowRight
                        className={`w-5 h-5 transition-transform ${
                          isCompleted ? 'text-green-600' : 'text-gray-400'
                        }`}
                      />
                    </div>
                  </div>
                </button>

                {isCompleted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-gray-200 px-8 py-6 bg-royal-green/5"
                  >
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {lesson.content}
                    </div>
                    <button
                      onClick={() => toggleLesson(lesson.id)}
                      className="mt-4 px-4 py-2 text-sm font-semibold text-royal-green hover:text-royal-emerald transition-colors"
                    >
                      Collapse
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Next Level CTA */}
        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <a
              href="/levels/level-2"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-royal-green to-royal-emerald text-white font-bold rounded-lg hover:shadow-lg hover:shadow-royal-green/50 transition-all"
            >
              <span>Continue to Level 2: Market Structure</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        )}

        {progress < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center p-6 bg-royal-green/10 border border-royal-green/30 rounded-xl"
          >
            <p className="text-gray-700">
              Complete all lessons to unlock Level 2: Market Structure
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
