'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Activity, BarChart3, Zap, Gauge, CheckCircle, ArrowRight } from 'lucide-react'

export default function Level5Page() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  const lessons = [
    {
      id: 21,
      title: 'RSI Institutional Usage',
      duration: '20 min read',
      icon: BarChart3,
      content: `
The RSI (Relative Strength Index) is not a buy/sell signal - it's an institutional confirmation tool. Most traders use it wrong.

**What RSI Actually Shows:**

RSI measures the velocity and magnitude of price changes. It oscillates between 0-100:
- Above 70: Momentum strong (sellers should be cautious)
- Below 30: Momentum weak (buyers should be cautious)
- Between 30-70: Neutral zone

**The Problem with Traditional RSI Trading:**

Retail traders: "RSI above 70 = overbought = sell"
Result: They sell at the BEGINNING of major uptrends
Reality: RSI CAN stay above 70 for weeks during strong uptrends

**Institutional RSI Usage:**

Professionals use RSI differently:

1. **Confirmation Tool**
   - They don't trade RSI alone
   - Use it to confirm price action setup
   - RSI validates their chart pattern analysis

2. **Divergence Detection**
   - Price makes higher high
   - RSI makes lower high
   - This divergence signals weakening momentum
   - Often precedes reversal

Example: EUR/USD rallies to new high, but RSI lower than previous rally = bearish divergence = sell signal forming

3. **Extreme Conditions**
   - RSI above 80 = extremely overbought (rare, strong move)
   - RSI below 20 = extremely oversold (rare, weak move)
   - These extremes have MORE probability of reversal

4. **Entry Confirmation**
   - Price breaks support (structure break down)
   - RSI oversold (below 40 or 30)
   - You enter SHORT with higher probability
   - RSI confirms momentum supports the entry

**Real Trading Application:**

Setup: You identified a short structure break at 1.0900

Check RSI:
- RSI is 65 (not oversold): Weak confirmation = skip trade
- RSI is 35 (oversold): Strong confirmation = take trade
- RSI is 15 (extremely oversold): VERY strong confirmation = larger position

**The 50 Level:**

Professionals watch the 50 line:
- Above 50: Momentum bullish
- Below 50: Momentum bearish
- Crossing 50: Potential momentum shift

**RSI Divergence Trading:**

Bullish Divergence:
- Price makes lower low
- RSI makes higher low
- Signals buying pressure weakening in downtrend
- Often precedes reversal UP

Bearish Divergence:
- Price makes higher high
- RSI makes lower high
- Signals selling pressure weakening in uptrend
- Often precedes reversal DOWN

This is the ONLY reliable RSI setup for entry.

**Why Professionals Prefer This:**

- Works across all timeframes
- Not delayed like other indicators
- Confirms what price action already shows
- Improves win rate when combined with structure

Your RSI Rule:
- Never trade RSI alone
- Always use with price action and structure
- Divergences > overbought/oversold
- Think confirmation, not signal
      `,
    },
    {
      id: 22,
      title: 'ATR Volatility Logic',
      duration: '18 min read',
      icon: Activity,
      content: `
ATR (Average True Range) tells you how much a market typically moves. Understanding this is critical for risk management and entry placement.

**What ATR Measures:**

ATR shows the average distance between high and low over a set period (usually 14 candles).

ATR = 50 pips means: On average, this pair moves 50 pips per candle
ATR = 10 pips means: This pair is in quiet consolidation

**Why ATR Matters:**

High ATR:
- Markets are volatile
- Larger stops needed
- Potential for bigger moves
- More risk per trade

Low ATR:
- Markets are quiet
- Tighter stops possible
- Less room for error
- Consolidation phase

**Institutional Use of ATR:**

1. **Stop Placement**
   - Don't place stops at arbitrary distances
   - Use ATR as baseline for stop size
   - Stop = Entry ± (ATR × 1.5)

Example:
- EUR/USD ATR = 60 pips
- Buying at 1.0900
- Stop placement: 1.0900 - (60 × 1.5) = 1.0800
- This accounts for normal volatility

2. **Target Calculation**
   - Target = Entry ± (ATR × 2-3)
   - This gives realistic, achievable targets
   - Aligns with market volatility

Example:
- Entry: 1.0900
- ATR: 60 pips
- Target: 1.0900 + (60 × 2.5) = 1.1050
- This is realistic given volatility

3. **Position Sizing**
   - Adjust position size based on ATR
   - High ATR = smaller positions (more volatility = more risk)
- Low ATR = larger positions (less volatility = more stable)

**Volatility Expansion Signal:**

When ATR suddenly increases:
- Market volatility expanding
- Often precedes big moves
- Tighten stops or reduce size
- Watch for breakout

When ATR decreases:
- Consolidation forming
- Low volatility environment
- Breakout likely approaching
- Position near edges of consolidation

**Entry Timing with ATR:**

Best entries happen when:
- ATR is expanding (volatility increasing)
- Price breaking out of consolidation
- Entry near support/resistance during high ATR
- This gives room for the move before hitting stops

Avoid entries when:
- ATR is contracting (volatile squeeze)
- Approaching support/resistance during low ATR
- Tight stops will get triggered quickly

**Reading ATR on Charts:**

14-period ATR is standard:
- Watch for trends in ATR itself
- Rising ATR = volatility expanding = confirmation of moves
- Falling ATR = volatility compressing = consolidation

Pro Tip:
- Uptrend with rising ATR = strong momentum = confidence signal
- Downtrend with falling ATR = weakening move = reversal possible

**Your ATR Rule:**

Always calculate:
1. Current ATR value
2. Appropriate stop distance (ATR × 1.5)
3. Realistic target (ATR × 2-3)
4. Position size (smaller in high ATR)

This removes emotion from trade sizing and makes your trading scientific.
      `,
    },
    {
      id: 23,
      title: 'Divergence Patterns',
      duration: '18 min read',
      icon: Zap,
      content: `
Divergences are among the most reliable reversal signals in technical analysis. They show when momentum is weakening despite price continuing higher/lower.

**Understanding Divergence:**

A divergence occurs when:
- Price moves in one direction (makes new high/low)
- Indicator fails to confirm (doesn't make new high/low)
- This shows weakening momentum
- Often precedes reversal

**Regular Divergence vs Hidden Divergence:**

**Regular Bearish Divergence:**
- Price makes Higher High
- RSI makes Lower High
- Signal: Selling pressure weakening in uptrend
- Action: Prepare to short

**Regular Bullish Divergence:**
- Price makes Lower Low
- RSI makes Higher Low
- Signal: Buying pressure weakening in downtrend
- Action: Prepare to buy

Visual:
\`\`\`
Price     RSI
  \\         \\
   \\  (HH)  \\  (LH) <- Bearish Divergence
    \\        \\

Price    RSI
  /        /
 /  (LL)  /  (HL) <- Bullish Divergence
/         /
\`\`\`

**Hidden Divergence (Continuation Signal):**

These signal continuation of trend, not reversal:

**Hidden Bullish Divergence:**
- Price makes Lower Low
- RSI makes Lower High (less weak)
- Signal: Buying pressure within downtrend
- Action: Continue shorting (trend continuing)

**Hidden Bearish Divergence:**
- Price makes Higher High
- RSI makes Lower High (less strong)
- Signal: Selling pressure within uptrend
- Action: Continue longing (trend continuing)

**How to Trade Divergences:**

1. **Identify the Divergence**
   - Mark the price highs/lows
   - Compare to RSI highs/lows
   - Note if regular (reversal) or hidden (continuation)

2. **Wait for Confirmation**
   - Divergence alone = not a trade signal
   - Wait for price to break support/resistance
   - Then structure break = trade signal

3. **Enter on Structure Break**
   - Bearish divergence + break below support = short
   - Bullish divergence + break above resistance = long
   - Stop: Outside the divergence zone

4. **Target Earlier Level**
   - Bearish divergence: Target = previous support
   - Bullish divergence: Target = previous resistance

**Example Trade:**

EUR/USD Daily:
- Price rallies from 1.0800 → 1.1000 (higher high)
- RSI only rallies from 60 → 75 (lower high than previous rally which hit 85)
- Bearish divergence formed
- You wait for break below 1.0950 (recent support)
- Price breaks below 1.0950 = structure break
- You SHORT at 1.0945
- Stop: 1.0970 (above recent high)
- Target: 1.0800 (previous support)

**Why Professionals Use Divergences:**

- Early warning of momentum changes
- Improves reversal accuracy
- Works with all indicators
- Confirms what price action shows
- High win rate when combined with structure

**Divergence Timeframe Rules:**

- Daily divergences = strong reversals (high probability)
- 4-hour divergences = medium reversals
- 1-hour divergences = weaker reversals
- Look for divergences on HIGHER timeframes for reliability

**Your Divergence Rule:**

Never trade divergence alone. Always require:
1. Regular or hidden divergence on chart
2. Price action setup confirmation
3. Structure break before entry
4. Higher timeframe divergence preferred

This combination gives you 60%+ win rate on reversals.
      `,
    },
    {
      id: 24,
      title: 'Confirmation Stacking',
      duration: '16 min read',
      icon: Gauge,
      content: `
Confirmation stacking means using multiple confluences to identify high-probability trades. This is how professionals build conviction.

**The Concept:**

One signal = 40% probability
Two signals = 65% probability
Three signals = 80%+ probability
Four signals = 90%+ probability

Each confluence added dramatically improves odds.

**Types of Confluences:**

**1. Price Action Confluence:**
- Price at support (level confluence)
- Structure break formed (pattern confluence)
- Higher timeframe uptrend (trend confluence)

**2. Indicator Confluence:**
- RSI oversold confirmation
- ATR expanding (volatility expanding)
- Divergence present

**3. Time Confluence:**
- Support/resistance at key time levels
- Economic data releases (if aligned)
- Market open/close times

**Example: Low-Probability Trade**

Entry at 1.0900:
- Price is near recent high
- RSI overbought
- No structure break
- Probability: ~35%

Result: Likely loses

**Example: High-Probability Trade**

Entry at 1.0850:
Signal 1: Price at unmitigated support (60% base probability)
Signal 2: Structure break down just confirmed (adds 15%)
Signal 3: RSI below 30 (oversold, adds 10%)
Signal 4: 4-hour below daily (timeframe alignment, adds 5%)

Total Probability: 90%

Result: 9 out of 10 similar trades win

**Stacking Process:**

1. **Identify Primary Setup**
   - Major support or structure break
   - This is your base trade

2. **Add Price Action**
   - Does order block align?
   - Is timeframe stacking positive?
   - Do swing levels converge?

3. **Add Indicators**
   - Is RSI confirming?
   - Is ATR aligned?
   - Any divergence present?

4. **Add Technical Time**
   - Is this at key time level?
   - Is this pre/post important event?
   - Does confluence of times apply?

5. **Only Trade at 3+ Confluences**
   - Skip 1-2 confluence trades
   - Wait for 3+ stack minimum
   - This is discipline

**Real Trading Example:**

Chart Setup: EUR/USD 4-hour
- Daily uptrend (signal 1: macro bias bullish)
- 4-hour pulled back to support (signal 2: support at key level)
- RSI oversold (25) on 4-hour (signal 3: indicator confirmation)
- Order block from earlier identified at 1.0900 (signal 4: institutional level)
- 1-hour bounces off the 4-hour support (signal 5: lower timeframe confirmation)

You take this trade with high conviction. Stop tight below support. Risk 1% of account. You're stacking confluences.

Result: This trade wins 8/10 times historically in this scenario.

**Why This Works:**

- Price doesn't move on single reason
- Multiple forces combine for major moves
- When 3-4 factors align = strong institutional positioning
- Multiple confluences = institutions aligned too

**Your Confirmation Rule:**

Setup Quality Levels:
- 1 confluence = SKIP (too risky)
- 2 confluences = MICRO (1/4 normal size)
- 3 confluences = NORMAL (1x normal size)
- 4 confluences = MAJOR (1.5x normal size if comfortable)
- 5+ confluences = CONVICTION (can size up 2x)

This scaling based on confirmation dramatically improves your consistency.
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
            <span className="text-sm font-semibold text-royal-green">Level 5 of 7</span>
          </div>
          <h1 className="text-5xl font-playfair font-bold text-matte-black mb-4">
            Indicator <span className="text-gradient">Precision</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Use indicators professionally: as confirmation tools, not trading signals.
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
            href="/levels/level-4"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-royal-green text-royal-green font-semibold rounded-lg"
          >
            Back to Level 4
          </a>
          {progress === 100 && (
            <a
              href="/levels/level-6"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-royal-green to-royal-emerald text-white font-bold rounded-lg"
            >
              <span>Continue to Level 6</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          )}
        </motion.div>
      </div>
    </div>
  )
}
