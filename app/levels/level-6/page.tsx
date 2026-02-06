'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, Crosshair, Clock, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react'

export default function Level6Page() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  const lessons = [
    {
      id: 26,
      title: 'Micro Structure',
      duration: '18 min read',
      icon: Crosshair,
      content: `
Micro structure is the small candle patterns that form at key price levels. These are the final gatekeepers before major moves.

**What is Micro Structure?**

Micro structure refers to:
- The exact shape of candles at key levels
- How quickly price approaches/leaves levels
- The internal candle patterns at turning points
- The final rejection or acceptance patterns

These show the exact moment when institutional buyers/sellers step in.

**Key Micro Structure Patterns:**

**1. Pin Bar (Long Wick)**
- Strong spike in one direction
- Closes opposite to wick
- Shows rejection of extreme price
- Indicates reversal likely

Pin Bar at Support:
- Price spikes down, long lower wick
- Closes in upper half of candle
- Institutional buying at support
- Likely reversal up

Pin Bar at Resistance:
- Price spikes up, long upper wick
- Closes in lower half of candle
- Institutional selling at resistance
- Likely reversal down

**2. Engulfing Pattern**
- First candle: Small range
- Second candle: Larger range, engulfs first
- Shows momentum shift
- Entry happens on second candle close

Bullish Engulfing:
- Red candle followed by large green candle
- Green engulfs red completely
- Buyers in control, reversal likely

Bearish Engulfing:
- Green candle followed by large red candle
- Red engulfs green completely
- Sellers in control, reversal likely

**3. Inside Bar (Consolidation)**
- Previous candle: Wide range
- Next candle: Smaller range, inside previous
- Shows pause and accumulation
- Breakout of inside bar = entry

Inside Bar Setup:
- Daily candle has 200 pip range
- Next candle has 80 pip range (inside)
- This shows accumulation
- When it breaks, momentum likely strong

**4. Rejection Candles**
- Open and close at extremes
- Body is small, wicks are large
- Shows price testing and rejection
- Reversal often follows

**Trading Micro Structure:**

Entry Points:
1. Identify key support/resistance
2. Wait for micro pattern (pin bar, engulfing, inside bar)
3. On pattern completion = ENTER
4. Stop: Outside the pattern
5. Target: Next level

Example:
- EUR/USD at support 1.0900
- Forms pin bar (lower wick, close near top)
- You enter long when pattern completes (close confirmed)
- Stop: Below 1.0890 (below the wick)
- Target: Previous resistance 1.0950

**Why Micro Patterns Work:**

- They show the EXACT moment institutions react
- Wicks show where stops got triggered
- Close shows institutional sentiment
- Entry timing becomes much more precise

**Your Micro Entry Rule:**

Never enter at "just above support". Wait for:
1. Support level reached
2. Micro pattern formed
3. Pattern completes (candle closes)
4. THEN enter

This 1-2 candle wait improves win rate 15-20%.
      `,
    },
    {
      id: 27,
      title: 'Timing Models',
      duration: '20 min read',
      icon: Clock,
      content: `
Timing models help you find the exact moment when institutional traders are most likely to make their move. This dramatically improves entry precision.

**The Trading Day Timeline:**

Different institutions trade at different times. Understanding these windows improves your timing.

**Asian Session (8PM-7AM EST):**
- Low volume, quiet period
- Few entries good here
- Watch for setups, don't trade them
- Best for scalping tight ranges

**London Session Open (2AM-7AM EST):**
- Volume increase
- EUR pairs most liquid
- Good breakouts on key news

**New York Session Open (8AM EST):**
- Maximum volume
- All major pairs liquid
- Highest volatility
- Best breakouts and reversals

**End of Day (3-4 PM EST):**
- Profit taking
- Short covering
- Good reversal opportunities
- Lower volume than NY open

**End of Week (Friday Afternoon):**
- Lowest volume
- Traders squaring positions
- Often choppy
- Skip or use tight stops

**Economic Data Timing:**

Data releases move markets:
- 8:30 AM EST: Major US data (NFP, CPI, etc.)
- 10 AM EST: Secondary data
- 1 PM EST: Fed announcements
- 2 PM EST: FOMC decisions

Pre-data: Price often consolidates
During-data: Massive volume spike
Post-data: Consolidation then reversal

Smart Trade: Enter AFTER data response, not before.

**Intra-Day Timing:**

Price rarely reverses in middle of day. Most reversals occur:
- At market opens (institutional positioning)
- Before market closes (profit taking)
- After key economic data (market digestion)

Best entries: 15-30 min after data release when volatility settles.

**Support/Resistance Time Levels:**

Track when price tests same level:
- First test: Often fails (weak)
- Second test: More likely to hold (medium)
- Third+ test: Strong hold or strong break (decision point)

Pattern: Price tests level 3 times, then breaks = major move likely

**Timeframe Timing Confluence:**

Entry timing improves when:
- Multiple timeframes showing reversal simultaneously
- 4-hour reversal candle + 1-hour reversal candle
- Both complete within same 1-hour window
- Probability increases dramatically

**Your Timing Rules:**

1. **Trade Timing:**
   - Highest probability: NY open (8-10 AM EST)
   - Good: Post data release (30+ min after)
   - Avoid: Asian session, Friday afternoon

2. **Data Timing:**
   - Avoid entering during data release
   - Enter 15-30 min AFTER data released
   - Check economic calendar before trading

3. **Level Timing:**
   - First touch of level = wait
   - Second/third touch = higher probability
   - Multiple touches + reversal pattern = trade

4. **Multitimeframe Timing:**
   - Both timeframes must align in same window
   - Wait for confirmation on lower timeframe
   - Don't chase if already moved away from entry level

These timing tools turn random entries into mechanical, high-probability executions.
      `,
    },
    {
      id: 28,
      title: 'Multi-Timeframe Entries',
      duration: '19 min read',
      icon: TrendingUp,
      content: `
The most precise entries happen when multiple timeframes confirm the exact same setup simultaneously. This is how professionals enter with 70%+ win rates.

**The Multi-Timeframe Hierarchy:**

**Step 1: Macro Timeframe (Daily/Weekly)**
- Identify overall trend direction
- Is it uptrend, downtrend, or range?
- This is your BIAS (which direction to bias entries)

Example: Daily shows clear uptrend (HH/HL intact)
- Bias: LONG only
- Skip shorts or short only in corrections

**Step 2: Swing Timeframe (4-Hour)**
- Identify structure breaks and key levels
- Where would a reversal happen?
- What are unmitigated order blocks?

Example: 4-hour pullback to support (1.0900)
- Setup: Reversal likely at 1.0900
- Pattern: Higher Low formed

**Step 3: Entry Timeframe (1-Hour)**
- Identify exact entry micro pattern
- Micro structure (pin bar, engulfing)
- Small confluence of signals

Example: 1-hour forms pin bar at 1.0900
- This is the exact entry trigger
- Pin bar confirms reversal happening

**Step 4: Confirmation (15-Min)**
- Ultra-precise timing confirmation
- Not always necessary
- Can improve timing accuracy

The Multi-Timeframe Trade Process:

Daily: Uptrend (HH/HL ongoing)
→ 4-Hour: Price pulled back to support, higher low formed
→ 1-Hour: Price approaches support (1.0900)
→ 1-Hour: Pin bar forms at 1.0900
→ YOU ENTER LONG at pin bar close (1.0905)

Why This Works:
- Macro bias confirms direction (bullish)
- Swing structure confirms level (support 1.0900)
- Micro pattern confirms entry (pin bar)
- Three timeframes = high probability

**Conflicting Timeframe Scenarios:**

**Scenario 1: All Aligned (TRADE)**
Daily: Uptrend
4-Hour: Support reversal setup
1-Hour: Pin bar at support
Decision: TRADE (confidence high)

**Scenario 2: Mixed Signals (SKIP or SMALL)**
Daily: Uptrend
4-Hour: Resistance inside daily trend
1-Hour: Engulfing at resistance
Decision: SKIP or MICRO trade only (resistance in uptrend = lower probability)

**Scenario 3: Conflicting (AVOID)**
Daily: Downtrend
4-Hour: Uptrend (conflicting!)
1-Hour: Pin bar at support
Decision: AVOID (timeframes conflicting = skip)

**Position Size Based on Alignment:**

Normal rule + timeframe quality = size

3 Timeframes Aligned = 1.0x size (normal)
4 Timeframes Aligned = 1.5x size (if skilled)
2 Timeframes Aligned = 0.5x size (small only)
1 Timeframe = Skip (don't trade single timeframe)

**Real Trade Example:**

Setup: USD/JPY 1-hour chart

Check Daily (Macro Bias):
- Downtrend ongoing (LL/LH pattern)
- Bias: SHORT only
- Macro confirms short setups only

Check 4-Hour (Swing Setup):
- Recent swing high at 155.50
- Price pulled back to 155.00
- Forms higher low in downtrend
- Setup ready: Sell at resistance 155.50

Check 1-Hour (Entry Timing):
- Price approaches 155.50
- Bearish engulfing forms at 155.50
- Red candle engulfs previous green candle
- Momentum shifting lower

Check 15-Min (Precision):
- Price breaks below 155.40
- 15-min candle closes below 155.40
- Final confirmation

YOU ENTER SHORT:
- Entry: 155.38 (after 15-min confirmation)
- Stop: 155.60 (above swing high + buffer)
- Target: 154.50 (previous support)
- Risk/Reward: 1:2.2

Result: This setup wins 7/10 times because 4 timeframes aligned.

**Your Multi-Timeframe Rule:**

Always check 3 timeframes minimum:
1. Daily/Weekly (macro bias)
2. 4-Hour (swing setup)
3. 1-Hour (entry micro pattern)

Wait for all 3 to align. Skip if they don't. This discipline cuts your losses by 60% and improves accuracy dramatically.

When you master this, you stop losing money and start consistent profits.
      `,
    },
    {
      id: 29,
      title: 'High Probability Setups',
      duration: '17 min read',
      icon: Zap,
      content: `
High probability setups are when multiple institutional signals converge. These are the trades professionals size up and trade with conviction.

**The High Probability Formula:**

Macro Trend (Timeframe Stacking) +
Structure Setup (Order Block/Break) +
Micro Pattern (Pin Bar/Engulfing) +
Indicator Confirmation (RSI/Divergence) +
Economic Context (News/Data) +
Volume Confirmation

= High Probability Setup

Each element adds confidence. When most are present, the trade becomes automatic.

**Scoring Your Setup:**

Give each element 1 point:

1. Macro trend aligned with entry direction = 1 point
2. Structure break confirmed = 1 point
3. Micro pattern present = 1 point
4. Indicator confirmation present = 1 point
5. ATR expanding = 1 point
6. Volume on entry candle = 1 point

Scoring:
- 6 points = 90%+ probability, full size
- 5 points = 80%+ probability, 1.5x size
- 4 points = 70%+ probability, 1x size
- 3 points = 60%+ probability, 0.5x size
- 2 points = Skip or micro size
- 1 point = Avoid completely

**High Probability Example 1: Textbook Setup**

EUR/USD Daily Chart

Point 1: Macro Trend
- Clear uptrend (HH/HL ongoing for 2 weeks) = 1 point

Point 2: Structure Setup
- Price pulls back to unmitigated support (1.0900) = 1 point
- Structure break down tested but rejected = 1 point

Point 3: Micro Pattern
- Pin bar forms at support (1.0900) = 1 point

Point 4: Indicator Confirmation
- RSI oversold (28) on daily = 1 point
- Divergence: Price lower than 2 days ago, RSI higher = 1 point

Point 5: ATR Expanding
- ATR increased 20% from last week = 1 point

Point 6: Volume
- Volume spike on pin bar formation = 1 point

Total: 8 points (perfect setup)

You enter LONG with full position size, high conviction.

Win Rate: 9/10 similar trades

**High Probability Example 2: Moderate Setup**

GBP/USD 4-Hour Chart

Point 1: Macro Trend
- Uptrend but not clean (ranging higher highs) = 0.5 points

Point 2: Structure Setup
- Recent swing high at 1.2800
- Price pulled back to 1.2750
- Marginal new high likely = 0.5 points

Point 3: Micro Pattern
- No pin bar, just close near high
- Weak pattern = 0.5 points

Point 4: Indicator Confirmation
- RSI not oversold (48)
- No divergence present = 0 points

Point 5: ATR Expanding
- ATR flat/declining = 0 points

Point 6: Volume
- Volume average = 0.5 points

Total: 2.5 points

You SKIP this trade entirely. Too risky.

**High Probability Example 3: Superior Setup**

JPY Pairs (Daily)

Point 1: Macro Trend
- Downtrend confirmed (5 week LL/LH) = 1 point

Point 2: Structure Setup
- Multiple Order blocks from accumulation
- Price at major unmitigated resistance (155.50)
- Structure break down forming = 1 point

Point 3: Micro Pattern
- Bearish engulfing on weekly = 1 point
- Confirmed on daily = 1 point

Point 4: Indicator Confirmation
- RSI at 72 (overbought)
- Bearish divergence (HH/LH) = 1 point

Point 5: ATR Expanding
- 30% ATR expansion = 1 point

Point 6: Volume
- 2x normal volume on down candles = 1 point

Total: 7 points (superior setup)

You size up to 1.5x normal position (if skilled with risk management).
This trade wins 8/10+ times.

**Your Setup Scoring System:**

Print this checklist and use it every trade:

□ Macro trend aligned (1 pt)
□ Structure break formed (1 pt)
□ Micro pattern present (1 pt)
□ Indicator confirmed (1 pt)
□ ATR expanding (1 pt)
□ Volume present (1 pt)

6 points = Full size + high conviction
5 points = Normal size + good confidence
4 points = Normal size + caution
3 points = 0.5x size only
2 or less = SKIP

This simple system turns subjective trading into objective, mechanical decisions.

When you only trade 6-point setups, your win rate becomes professional level.
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-royal-green/10 border border-royal-green/30 rounded-full mb-4">
            <span className="text-sm font-semibold text-royal-green">Level 6 of 7</span>
          </div>
          <h1 className="text-5xl font-playfair font-bold text-matte-black mb-4">
            Entry <span className="text-gradient">Engineering</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master timing and precision. Trade only the highest probability setups.
          </p>
        </motion.div>

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
                        className={`w-5 h-5 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}
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
                      className="mt-4 px-4 py-2 text-sm font-semibold text-royal-green"
                    >
                      Collapse
                    </button>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        <motion.div className="mt-12 flex gap-4 justify-between">
          <a
            href="/levels/level-5"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-royal-green text-royal-green font-semibold rounded-lg"
          >
            Back to Level 5
          </a>
          {progress === 100 && (
            <a
              href="/levels/level-7"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-royal-green to-royal-emerald text-white font-bold rounded-lg"
            >
              <span>Continue to Level 7 (Final)</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          )}
        </motion.div>
      </div>
    </div>
  )
}
