'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Building2, Layers, Zap, CheckCircle, ArrowRight } from 'lucide-react'

export default function Level3Page() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  const lessons = [
    {
      id: 11,
      title: 'Order Block Identification',
      duration: '22 min read',
      icon: Building2,
      content: `
Order blocks are areas where institutional traders accumulate or distribute large positions. These create the strongest support and resistance.

**What is an Order Block?**

An order block is a price level where:
1. Strong buying or selling pressure occurred
2. Large volume traded at that level
3. Price moved decisively away from it
4. Institutions likely filled their positions there

**How to Identify:**

**Bullish Order Block:**
- Price is in uptrend (higher highs/lows)
- Price pulls back into a consolidation zone
- A strong down candle forms during the pullback
- Then price reverses and breaks above, moving higher
- The consolidation zone = Bullish Order Block

This shows: Institutions bought during the pullback, absorbed selling pressure, then pushed price higher.

**Bearish Order Block:**
- Price is in downtrend (lower lows/highs)
- Price rallies into a consolidation zone
- A strong up candle forms during the rally
- Then price reverses and breaks below, moving lower
- The consolidation zone = Bearish Order Block

This shows: Institutions sold during the rally, absorbed buying pressure, then pushed price lower.

**Why Institutional Traders Use Order Blocks:**

1. **Accumulation Zones**
   - Buy large positions without moving market too much
   - Use pullbacks to fill positions at better prices
   - Create order blocks as they accumulate

2. **Distribution Zones**
   - Sell large positions during rallies
   - Use bounces to exit without slipping
   - Create order blocks as they distribute

3. **Support/Resistance**
   - After establishing position, price returns to order block
   - Institutions defend the level
   - Creates predictable support/resistance

**Trading Order Blocks:**

1. Identify the order block (consolidation zone)
2. Wait for price to return to that level
3. Enter as price bounces away (pullback entry)
4. Place stop below/above the order block
5. Target the next level of resistance/support

**Why This Matters:**

Order blocks are where:
- Most retail traders place their stops (gets hunted)
- Institutions provide liquidity (creates bounces)
- Risk/reward setup becomes favorable

Professional traders buy AT order blocks, not above them. They sell AT order blocks, not below them.

**Your Edge:**

While retail traders avoid "old resistance," professionals hunt order blocks there because they know liquidity exists.
      `,
    },
    {
      id: 12,
      title: 'Mitigation Theory',
      duration: '18 min read',
      icon: Layers,
      content: `
Mitigation theory explains what happens when price returns to an order block after breaking away. This is where profits happen.

**The Concept:**

After creating an order block and breaking away, price eventually returns to that level. When it does, the order block is "mitigated" (fulfilled its purpose).

**What Happens at Mitigation:**

1. **Price Returns to Order Block**
   - Previous support becomes new resistance (or vice versa)
   - Price approaches the level
   - Volume often decreases (range/consolidation)

2. **Test of Level**
   - Price touches or slightly breaks the order block
   - This is the "mitigation" - the level is tested
   - Institutions may have partially exited
   - New buying/selling begins

3. **Reversal or Breakthrough**
   - If order block holds: Reversal begins (bounce)
   - If order block breaks: Trend may continue or reverse
   - Next order block level becomes relevant

**Unmitigated Order Block:**

An order block that hasn't returned to its level yet is "unmitigated." These are:
- Strong support/resistance levels
- Likely to hold when price eventually reaches them
- Reliable for stop placement
- Dangerous to trade above/below

**Mitigated Order Block:**

Once price has returned and bounced from an order block:
- It's already served its purpose
- Less reliable as future support/resistance
- May become a momentum level instead
- Need to identify new order blocks

**Trading Mitigated Order Blocks:**

The best trade opportunity is at mitigation:

1. Identify an unmitigated order block
2. Wait for price to approach it
3. Watch for signs of reversal (candle patterns, momentum divergence)
4. Enter the reversal trade
5. Target the next unmitigated level

**Example Trade:**
- Day 1: Price breaks above consolidation (forms bullish OB)
- Days 2-4: Price rallies 300 pips
- Day 5: Price pulls back to the order block
- Day 6: Price bounces off order block (mitigation confirmed)
- You enter long on the bounce
- Stop below the order block
- Target: Previous resistance level

**Why This Works:**

Retail traders see price return to "old support" and think it's weak. Professionals know:
- Old support tests supply/demand
- Bounces happen at mitigated levels
- This is where they take profits or add

Master mitigation and you can trade with institutional precision.
      `,
    },
    {
      id: 13,
      title: 'Institutional Footprints',
      duration: '20 min read',
      icon: Zap,
      content: `
Institutional footprints are the signs that large traders have passed through a price level. Learn to recognize them.

**Types of Footprints:**

**1. Volume Spike**
- Abnormally high volume at a price level
- Indicates large orders executed
- Institutions either accumulating or distributing
- Creates support/resistance at that level

**2. Gap Creation**
- Price opens and closes far from previous level
- Shows strong directional conviction
- Institutions likely involved
- Gap often acts as support/resistance

**3. Spike High/Low with Long Wick**
- Price spikes in one direction then reverses
- Long wick shows orders absorbed at extreme
- Institutions trapped shorter/longer timeframe traders
- Reversal likely follows

Example: EUR/USD spikes 100 pips down (stops triggered), then reverses violently (buy setup for institutions).

**4. Consolidation After Move**
- Price moves decisively (e.g., up 200 pips)
- Then consolidates in narrow range
- Shows accumulation/distribution
- Breakout of consolidation signals next move

**5. Multiple Tests of Level**
- Price tests same level 2-3 times
- Resistance becomes support or vice versa
- Institutions likely accumulated at that level
- When broken, often creates strong move

**How to Use Footprints:**

1. **Identify the Footprint**
   - Look for the signs listed above
   - Mark it on your chart
   - Note the price level exactly

2. **Wait for Context**
   - Confirm trend direction
   - Check if footprint aligns with trend
   - Avoid trading against obvious institutional flow

3. **Trade the Reversal**
   - Price will likely bounce from footprints
   - Enter on the bounce with tight stop
   - Target next institutional level

4. **Exit When Next Footprint Found**
   - Trail stops to next footprint level
   - Take profits at next level
   - Repeat

**Common Institutional Footprint:**

- Strong move up (e.g., 5% rally)
- Volume spike at top
- Price consolidates
- Then reverses down 2-3%
- This is institutional distribution completing

You can trade the reversal down with high probability.

**Why This Works:**

- Institutions leave "footprints" you can see
- Volume, gaps, and wicks show where they entered
- When they're done, price reverses
- By following the footprints, you follow the institutions

**Your Edge:**

Most traders don't think about institutional activity. You do. You see the footprints they leave and profit from their position unwinding.
      `,
    },
    {
      id: 14,
      title: 'Unmitigated vs Mitigated',
      duration: '18 min read',
      icon: Building2,
      content: `
The most important distinction in institutional trading: which order blocks have been tested and which haven't.

**Unmitigated Order Blocks:**

Definition: An order block that price has NOT returned to test since it was created.

Characteristics:
- Still "fresh" and powerful
- Likely to hold as strong support/resistance
- Hasn't "released" its volume yet
- Most reliable for stop placement
- Dangerous to trade through

Visual Pattern:
\`\`\`
Price breaks above order block
|
| (Price only moves AWAY from OB, never returns)
|
V
Current level
\`\`\`

**Mitigated Order Blocks:**

Definition: An order block that price HAS returned to and tested since creation.

Characteristics:
- Already "done its job"
- Volume has been released
- Less reliable as support/resistance
- Can become momentum level
- Trades through it more easily

Visual Pattern:
\`\`\`
Price breaks above order block
|
| (Price moves away, then returns to OB)
|
V
Price tests OB then bounces away
|
| (Mitigation complete)
V
\`\`\`

**Trading Rules Based on Mitigation:**

**Rule 1: Buy Unmitigated Support**
- Don't buy at mitigated levels
- Instead, buy at unmitigated support
- Risk is lower, reliability is higher

**Rule 2: Sell Unmitigated Resistance**
- Don't sell at mitigated levels
- Instead, sell at unmitigated resistance
- Risk is lower, reliability is higher

**Rule 3: Trail Stops to Unmitigated Levels**
- When in a trade, move stops to next unmitigated level
- Don't move stops to mitigated levels (too close)
- This gives trades room to work

**Rule 4: Breakout Through Mitigated Levels**
- Price trades through mitigated OBs easily
- When breakout happens, it signals strength
- Next unmitigated level becomes important

**Real Example: GBP/USD Daily**

Weekly OB (unmitigated) at 1.2700
- Price has been as high as 1.2750, never tested 1.2700
- You wait for pullback to 1.2700
- Price reaches 1.2700 (unmitigated level)
- Bounces strongly
- You enter long with stop at 1.2680
- Target: 1.2800 (next resistance)

Vs.

Old OB (mitigated) at 1.2600
- Price already tested and bounced from 1.2600 multiple times
- Less reliable for trading
- More of a reference point
- Don't use as entry, use as exit

**Why This Matters:**

Most retail traders don't distinguish between mitigated/unmitigated. They trade every OB the same way. This is why they lose.

Professionals focus on unmitigated levels because:
- Highest probability bounces
- Best risk/reward
- Most likely to hold stops
- Cleanest order flow

Master this distinction and your win rate jumps.
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
            <span className="text-sm font-semibold text-royal-green">Level 3 of 7</span>
          </div>
          <h1 className="text-5xl font-playfair font-bold text-matte-black mb-4">
            Order Block <span className="text-gradient">Mastery</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Identify and trade institutional accumulation and distribution zones.
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
                      className="mt-4 px-4 py-2 text-sm font-semibold text-royal-green hover:text-royal-emerald"
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
            href="/levels/level-2"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-royal-green text-royal-green font-semibold rounded-lg"
          >
            Back to Level 2
          </a>
          {progress === 100 && (
            <a
              href="/levels/level-4"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-royal-green to-royal-emerald text-white font-bold rounded-lg"
            >
              <span>Continue to Level 4</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          )}
        </motion.div>
      </div>
    </div>
  )
}
