'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Activity, Zap, Target, CheckCircle, ArrowRight } from 'lucide-react'

export default function Level2Page() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  const lessons = [
    {
      id: 6,
      title: 'Trend Identification',
      duration: '20 min read',
      icon: TrendingUp,
      content: `
A trend is the direction price is moving over time. Identifying trends is the foundation of profitable trading.

**Three Types of Trends:**

**1. Uptrend**
- Characterized by higher highs and higher lows
- Each dip (support) is higher than the previous dip
- Each rally (resistance) exceeds the previous rally
- Buyers in control, pushing price higher

Visual Pattern:
\`\`\`
    /\\
   /  \\
  /    \\
 /      \\
/        \\
----------
\`\`\`

**2. Downtrend**
- Characterized by lower highs and lower lows
- Each rally (resistance) is lower than previous
- Each dip (support) is lower than previous
- Sellers in control, pushing price lower

Visual Pattern:
\`\`\`
----------
\\        /
 \\      /
  \\    /
   \\  /
    \\/
\`\`\`

**3. Range/Consolidation**
- Price bounces between support and resistance
- Neither buyers nor sellers in control
- Often precedes a breakout in one direction
- Can last days or weeks

**Why Trend Identification Matters:**

Most profitable trades align WITH the trend, not against it.

- Uptrend: Buy dips, sell rallies (long bias)
- Downtrend: Sell rallies, cover dips (short bias)
- Range: Buy support, sell resistance

**How Institutions Identify Trends:**

1. **Higher Timeframe Context** - Check daily/weekly for direction
2. **Support/Resistance** - Identify key levels that defined trend
3. **Moving Averages** - 50/200 period MAs show trend structure
4. **Volume Confirmation** - Uptrend has buying pressure on rallies

**Common Mistake:**

Retail traders identify a "trend" and hold forever. Professional traders:
- Identify trend on higher timeframe
- Trade within that trend on lower timeframes
- Exit when trend shows signs of reversal
- Don't assume trends last forever

Trends typically last:
- Intraday trends: hours to days
- Swing trends: days to weeks
- Position trends: weeks to months

**Your Edge:**

Wait for a trend to establish (multiple higher highs/lows). Then trade ONLY in that direction. This single discipline eliminates half your losing trades.
      `,
    },
    {
      id: 7,
      title: 'Structure Breaks',
      duration: '18 min read',
      icon: Zap,
      content: `
Structure breaks are turning points where one trend ends and another begins. Professional traders hunt these moments.

**What is a Structure Break?**

When price breaks above the highest high or below the lowest low of a recent range/trend, it's breaking structure.

**Break of Structure Up (BOS Up):**
- Previous swing high is broken
- Signals shift from bear to bull control
- Often preceded by a lower high (showing weakness)
- Example: Price was making lower highs, then breaks above the highest high

Timeline:
\`\`\`
Lower High → Lowest Low → BREAK ABOVE HIGHEST HIGH = Structure Break Up
\`\`\`

**Break of Structure Down (BOS Down):**
- Previous swing low is broken
- Signals shift from bull to bear control
- Often preceded by a higher low (showing weakness)
- Example: Price was making higher lows, then breaks below the lowest low

Timeline:
\`\`\`
Higher Low → Highest High → BREAK BELOW LOWEST LOW = Structure Break Down
\`\`\`

**Why Institutions Use Structure Breaks:**

1. **Confirmation of Trend Change**
   - When structure breaks, weak traders get stopped out
   - Institutions collect their stops
   - New trend begins with trapped traders forced to reverse

2. **Entry Opportunities**
   - Structure breaks attract momentum traders
   - Volume typically spikes
   - Risk/reward becomes favorable for swing traders

3. **Stop Level Placement**
   - After a structure break up, you place stops below the break level
   - After a structure break down, stops go above the break

**How to Trade Structure Breaks:**

1. Identify the previous swing high/low (structure)
2. Wait for price to approach that level
3. Confirm break with volume/momentum
4. Enter on the retest of the broken level
5. Place stop on the other side

**Critical: Retest**

Most profitable structure break trades happen on the RETEST:
- Price breaks structure (attracts buyers/sellers)
- Price pulls back and retests the broken level
- You enter as price bounces away from retest
- This is where you get 3:1+ risk reward

**Common Mistakes:**

- Chasing the initial break (too much risk, entry prices bad)
- Trading structure breaks in choppy/ranging markets (wait for confirmation)
- Ignoring the retest (entering too early)

**Your Edge:**

While retail traders chase the initial break, professionals wait for the retest. This patience gives you better prices and better risk/reward.
      `,
    },
    {
      id: 8,
      title: 'Timeframe Stacking',
      duration: '22 min read',
      icon: Activity,
      content: `
Professional traders don't look at one timeframe. They analyze multiple timeframes to confirm bias and find high-probability setups.

**The Concept:**

Timeframe stacking means using multiple timeframes to align your analysis:
- Higher timeframe = trend direction (macro view)
- Mid timeframe = structure breaks (entry level)
- Lower timeframe = entry timing (precision)

**Example: 4-Hour Trade on EUR/USD**

Step 1: Check Daily Chart
- Is there a clear uptrend? (higher highs/higher lows)
- Status: YES - strong uptrend confirmed
- Action: Bias is BUY

Step 2: Check 4-Hour Chart (your trading timeframe)
- Is price in a pullback within the uptrend?
- Status: YES - price retested support, forming higher low
- Action: Wait for entry signal

Step 3: Check 1-Hour Chart (entry precision)
- Is there a smaller structure break or reversal candle?
- Status: YES - price bounced off support with bullish momentum
- Action: ENTER LONG

This alignment = high-probability trade.

**Why This Works:**

When all timeframes align:
- Retail traders on 1-hour are buying
- Swing traders on 4-hour are buyers
- Institutional traders on daily are accumulating
- Convergence creates strong momentum

**The Hierarchy:**

Always check timeframes in this order:

1. **Weekly** (macro context - where are we in the big picture?)
2. **Daily** (trend identification)
3. **4-Hour** (swing structure and breakouts)
4. **1-Hour** (entry timing)
5. **15-Min** (ultra-precise entries ONLY if confirmed above)

**Avoid This:**

Don't trade a 1-hour entry if the 4-hour is choppy and the daily is ranging. That's fighting the macro context.

**Conflicting Signals:**

Daily uptrend but 4-hour downtrend = stay OUT or trade very small
Daily downtrend but 4-hour uptrend = pullback trade setup, good risk/reward

**Professional Setup:**

Institutions use timeframe stacking because:
- It eliminates low-probability trades
- It identifies where most traders will be wrong
- It shows where they can scale into positions

**Your Trading Rule:**

Never take a trade unless:
- Higher timeframe confirms your bias
- Mid timeframe shows structure break or support
- Lower timeframe shows momentum reversal
- All three timeframes AGREE

This single rule will improve your win rate dramatically.
      `,
    },
    {
      id: 9,
      title: 'Higher Highs & Lower Lows',
      duration: '16 min read',
      icon: Target,
      content: `
This is the simplest and most powerful concept in technical analysis. If you master this, you can trade with professionals.

**Higher Highs and Higher Lows = UPTREND**

In an uptrend:
- Each swing high is above the previous swing high
- Each swing low is above the previous swing low
- Price is making progress higher

Visualization:
\`\`\`
       /\\            <- Higher High
      /  \\
     /    \\  /\\       <- Lower Low (but still above previous)
    /      \\/  \\
---/_______/____\\---
\`\`\`

Key: Even the lows are progressing higher. This is strength.

**Lower Highs and Lower Lows = DOWNTREND**

In a downtrend:
- Each swing high is below the previous swing high
- Each swing low is below the previous swing low
- Price is making progress lower

Visualization:
\`\`\`
---\\________/----
    \\      /  \\
     \\    /    \\  /
      \\  /      \\/  \\
       \\/             \\
\`\`\`

Key: Even the highs are progressing lower. This is weakness.

**Why This Matters:**

This tells you everything:
- WHO is in control (buyers or sellers)
- WHERE to place stops (outside the swing)
- WHEN to take profits (at next level)
- HOW to manage risk (in direction of trend)

**Real-World Example: EUR/USD Daily**

Day 1: Price makes high at 1.0800, low at 1.0780
Day 3: Price makes high at 1.0820 (HIGHER), low at 1.0795 (HIGHER)
Day 5: Price makes high at 1.0835 (HIGHER), low at 1.0810 (HIGHER)

Analysis: Clear uptrend. Every high exceeds the last. Every low is higher than previous lows.

**Trend Reversal Signal:**

When the pattern breaks:
- In an uptrend, a lower high signals weakness
- In a downtrend, a higher low signals strength
- This often precedes structure breaks

Example:
- Uptrend with consecutive HH/HL intact
- Then price makes a LOWER HIGH (breaks pattern)
- Next: Look for structure break down
- This is where reversals happen

**How to Trade This:**

1. **Confirm Trend**: Multiple HH/HL or LL/LH?
2. **Identify Swings**: Mark each high and low
3. **Project Direction**: Where's the next level?
4. **Risk Management**: Stop loss outside the recent swing

Uptrend Example:
- Last swing high: 1.0835
- Last swing low: 1.0810
- Next entry: On pullback to support (1.0810 area)
- Stop loss: Below 1.0810
- Target: Above 1.0835

**The Power:**

This concept is so simple that professionals use it daily. It's:
- Objective (not subjective like indicators)
- Universal (works on any chart, any timeframe)
- Timeless (worked 20 years ago, works today)

Master HH/HL and LL/LH, and you've mastered trend trading.
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
            <span className="text-sm font-semibold text-royal-green">Level 2 of 7</span>
          </div>
          <h1 className="text-5xl font-playfair font-bold text-matte-black mb-4">
            Market <span className="text-gradient">Structure</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master the fundamentals of price action. Identify trends, breaks, and high-probability
            setups using pure price action.
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
                    <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed font-mono text-sm">
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

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 flex gap-4 justify-between"
        >
          <a
            href="/levels/level-1"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-royal-green text-royal-green font-semibold rounded-lg hover:bg-royal-green/5 transition-colors"
          >
            Back to Level 1
          </a>
          {progress === 100 && (
            <a
              href="/levels/level-3"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-royal-green to-royal-emerald text-white font-bold rounded-lg hover:shadow-lg hover:shadow-royal-green/50 transition-all"
            >
              <span>Continue to Level 3: Order Blocks</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          )}
        </motion.div>

        {progress < 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center p-6 bg-royal-green/10 border border-royal-green/30 rounded-xl"
          >
            <p className="text-gray-700">
              Complete all lessons to unlock Level 3: Order Block Mastery
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
