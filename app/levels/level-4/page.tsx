'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, AlertTriangle, TrendingDown, Brain, CheckCircle, ArrowRight } from 'lucide-react'

export default function Level4Page() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  const lessons = [
    {
      id: 16,
      title: 'Stop Hunts',
      duration: '18 min read',
      icon: AlertTriangle,
      content: `
Stop hunts are deliberate price moves designed to trigger retail traders' stops so institutions can acquire/distribute positions at better prices.

**How Stop Hunts Work:**

1. **Setup Phase**
   - Institution wants to buy but current price is high
   - Retail traders have buy stops above resistance
   - Institution needs price to come down to better levels
   - They see opportunity at the retail stops below support

2. **The Hunt**
   - Institutions push price DOWN through support
   - This triggers all the retail buy stops
   - Forced sellers create liquidity
   - Then institutions reverse and buy at these lower prices

3. **The Reversal**
   - After stops are triggered, price reverses UP
   - Now going to new highs
   - Institutions long from lower levels
   - Retail traders stopped out and frustrated

**Visual Pattern:**
\`\`\`
High (retail buy stops)
    |\\
    | \\ <- Stop hunt down
    |  \\
    |   \\___
    |       \\
    |        \\___
Low (stops triggered) \\___
            \\
             \\_ (reversal begins)
                \\_____/\\ <- Reversal complete
                        \\\\ <- New highs
\`\`\`

**Why Institutions Do This:**

- Better entry prices
- Accumulation during panic selling
- Stops provide free liquidity
- Retail traders are predictable

**How to Recognize Stop Hunts:**

1. **Support Level Broken Hard**
   - Not a slow break, but violent
   - Spike down with volume
   - Long wick showing rejection

2. **Stops Below Support**
   - Retail traders cluster stops just below key levels
   - Institutions know where these are
   - They hunt them intentionally

3. **Quick Reversal**
   - After the spike down, quick reversal
   - Price bounces off the lows
   - Momentum shifts immediately

4. **Pattern Recognition**
   - Same level gets "hunted" multiple times
   - Each time, slightly lower before reversing
   - This is institutional accumulation

**How to Trade Stop Hunts:**

Instead of using stops below support, place them BELOW the hunt level:
- If support is at 1.2000
- Retail stops at 1.1990
- Place YOUR stop at 1.1975 (below the hunt)
- This way you don't get stopped during the hunt

Or trade the reversal:
- Wait for the hunt (price spikes below support)
- Enter when reversal begins (candle closes above support)
- Stop below the hunt level
- Target higher (where institutions go)

**Why This Matters:**

Stop hunts show WHERE institutions are accumulating. Every stop hunt is a buying opportunity if you understand what's happening.

Most retail traders lose here. Professionals profit here. Which will you be?
      `,
    },
    {
      id: 17,
      title: 'Fake Breakouts',
      duration: '16 min read',
      icon: TrendingDown,
      content: `
Fake breakouts (false breakouts) occur when price appears to break a key level but then reverses. These are designed to shake out weak traders.

**Fake Breakout Up:**

Setup:
- Price consolidates below resistance
- Retail traders anticipate breakout
- Resistance appears "about to break"

Fake Breakout:
- Price spikes above resistance
- Stops stop loss (trader gets "shaken out")
- Then price collapses back below resistance

Result:
- Retail long traders are stopped out above resistance
- Institutions collect these stops
- Then sell into the buyers who bought on breakout

**Fake Breakout Down:**

Setup:
- Price consolidates above support
- Retail traders anticipate breakdown
- Support appears "about to break"

Fake Breakout:
- Price spikes below support
- Stops trigger (trader gets "shaken out")
- Then price bounces back above support

Result:
- Retail short traders are stopped out below support
- Institutions collect these stops
- Then buy into the sellers who sold on breakdown

**Why This Happens:**

1. **Stop Collection**
   - Institutions know where stops cluster
   - They engineer false breakouts to collect stops
   - They accumulate at better prices through stops

2. **Weak Trader Elimination**
   - False breakouts remove traders without conviction
   - Only strong hands remain
   - Easier to push price after weak holders exit

3. **Order Placement**
   - Institutions accumulate just inside the consolidation
   - Fake breakout pushes price through stops
   - Institutions positioned for real move after

**Recognizing Fake Breakouts:**

1. **The Wicks**
   - Very long wick extending beyond key level
   - But body of candle stays inside level
   - Shows rejection of breakout

2. **Volume Analysis**
   - Breakout has LOW volume (weak conviction)
   - Reversal has HIGH volume (strong conviction)
   - True breakouts have volume ON the breakout

3. **Time Duration**
   - Fake breakout lasts minutes to hours
   - Real breakout lasts hours to days
   - Watch for quick reversals

4. **Pattern Repetition**
   - Same level "breaks" multiple times with wicks
   - Each time, fails and reverses
   - Final push finally breaks it cleanly

**How to Trade Fake Breakouts:**

**Method 1: Wait for Confirmation**
- Don't trade the initial breakout
- Wait for full candle close above/below level
- With volume confirmation
- Then enter the confirmed breakout

**Method 2: Trade the Retest**
- Price breaks out (fake)
- Price reverses back to level
- Level now acts as support (if break was down) or resistance (if break was up)
- Enter the retest bounce

**Example:**
- EUR/USD consolidates at 1.0900
- Breaks above 1.0910 on low volume
- 30 minutes later, closes back below 1.0900
- You enter SHORT with stop at 1.0915
- Target: 1.0880 (lower support)

**Why Professionals Know This:**

They track where retail stops are placed. When you understand stop placement, you can predict fake breakouts. When you predict them, you can profit from them while others are stopped out.
      `,
    },
    {
      id: 18,
      title: 'Smart Money Traps',
      duration: '19 min read',
      icon: Brain,
      content: `
Smart money traps are engineered price moves designed to catch traders on both sides. Understanding them separates professionals from amateurs.

**The Setup:**

Institutions need liquidity. They get it by:
- Pushing price to collect retail stops
- Creating false breakouts
- Building trap situations
- Then reversing with force

**Types of Traps:**

**Trap 1: Bull Trap**
- Price rallies strongly, breaks resistance
- Retail traders go long (FOMO)
- Institutions sell into the buyers
- Price reverses hard downward
- Retail traders caught long at highs

Example:
- EUR/USD rallies from 1.0800 to 1.0950 (breakout!)
- Retail traders jump in (buy the breakout)
- Next day, reverses down to 1.0850
- Retail traders stopped out or deep in loss

How It Happened:
- Institutions got long around 1.0800
- They pushed price up to trap retail traders
- Then they sold their positions on the rally
- Profit: They bought at 1.0800, sold at 1.0950

**Trap 2: Bear Trap**
- Price sells off sharply, breaks support
- Retail traders go short (capitulation)
- Institutions buy into sellers
- Price reverses hard upward
- Retail traders caught short at lows

Example:
- Gold drops from $2000 to $1900 (breakdown!)
- Retail traders short it
- Next day, reverses up to $1950
- Retail shorts stopped out or deep in loss

How It Happened:
- Institutions wanted to buy gold
- They drove price down to trigger stops
- They bought all the panic selling
- Then price reverses to $1950

**Why Institutions Use Traps:**

1. **Liquidity Generation**
   - Traps panic sell/buy at extreme prices
   - Creates volume they can trade into
   - Better average price for their big positions

2. **Position Accumulation**
   - They buy during bear traps (lows)
   - They sell during bull traps (highs)
   - Average entry/exit prices improve

3. **Retail Elimination**
   - Traps shake out weak traders
   - Remove conflicting order flow
   - Market becomes easier to push

**How to Avoid Traps:**

1. **Don't Chase Breakouts**
   - Wait for confirmation
   - Don't FOMO buy breakouts
   - Let price settle after breakouts

2. **Use Wider Stops**
   - Don't place stops at obvious levels
   - Place stops beyond the trap zone
   - This gives trades room for traps to occur

3. **Trade Pullbacks, Not Breakouts**
   - Breakouts get trapped
   - Pullbacks within trends are safer
   - Wait for consolidation pullback entries

4. **Recognize Trap Patterns**
   - Strong move + quick reversal = trap likely
   - High volatility at breakout level = trap likely
   - Retail greed at highs = bear trap brewing

**How to Profit from Traps:**

Once you recognize a trap forming:

1. **Identify the Setup**
   - Bull trap: Overbought rally approaching resistance
   - Bear trap: Oversold drop approaching support

2. **Wait for the Trap**
   - Let retail traders get caught
   - Let stops get triggered
   - Let panic peak

3. **Enter the Reversal**
   - After trap triggers, momentum reverses
   - This is your entry (short for bull trap, long for bear trap)
   - Stop above/below the trap level
   - Target: Previous support/resistance

**The Professional Perspective:**

Retail traders fear traps. Professionals EXPECT traps. They plan for them, trade them, and profit from them consistently.

When you stop fighting traps and start trading them, your profitability skyrockets.
      `,
    },
    {
      id: 19,
      title: 'Liquidity Sweeps',
      duration: '17 min read',
      icon: Zap,
      content: `
Liquidity sweeps are when institutions deliberately push price through key levels to collect stops and gather liquidity before the real move begins.

**Understanding Liquidity Sweeps:**

Definition: A liquidity sweep occurs when price briefly moves beyond a key level (collecting stops), then reverses sharply in the opposite direction.

**Upper Liquidity Sweep:**
- Price breaks above resistance
- Takes out stops above resistance
- Reverses back down through resistance
- The "sweep" collected the liquidity

Result: Institutions accumulate at lower prices while retail traders are stopped out at the worst possible time.

**Lower Liquidity Sweep:**
- Price breaks below support
- Takes out stops below support
- Reverses back up through support
- The "sweep" collected the liquidity

Result: Institutions buy at lower prices while retail traders are stopped out.

**Why Sweeps Happen:**

1. **Stop Collection**
   - Retail traders place stops at obvious levels
   - Institutions know where these are
   - Deliberate push triggers these stops
   - They collect liquidity at these prices

2. **Accumulation**
   - Institutions want to buy but need liquidity
   - They push price to collect stops
   - They buy the panic selling
   - Then reverse for the real move

3. **Trap Removal**
   - Weak traders get stopped out
   - Strong hands remain
   - Easier to push price after cleanup

**Visual Pattern:**

Uptrend with Lower Liquidity Sweep:
\`\`\`
Previous High
    |
    /\\
   /  \\____
  /        \\__  (Sweep down)
 /            \\ (Reverses back up)
/              \\\\_____
                     \\___/ (Continues up)
\`\`\`

**How to Recognize Sweeps:**

1. **Quick Spike Beyond Level**
   - Price violently breaks key level
   - Wick extends beyond level
   - Often with high volume

2. **Quick Reversal**
   - Within same candle or next candle
   - Sharp reversal back through level
   - Momentum shifts suddenly

3. **Pattern Repeat**
   - Same level swept multiple times
   - Each sweep slightly different
   - Shows accumulation/distribution

**How to Trade Liquidity Sweeps:**

**Method 1: Avoid the Sweep**
- Place stops BEYOND the sweep zone
- Don't get caught in sweep liquidity collection
- Be aware sweep is likely before it happens

**Method 2: Trade After the Sweep**
- Let sweep occur first
- Once sweep reverses, enter with confirmation
- Your entry is AFTER sweep completes
- This is when real move begins

Example:
- Uptrend with support at 1.0800
- Price sweeps down to 1.0795 (takes stops)
- Price reverses back above 1.0800
- YOU enter long here (after sweep)
- Stop: Below 1.0790 (below sweep low)
- Target: Next resistance level

**Why Sweep Timing Works:**

- Sweeps happen when institutions are accumulating
- Reversal after sweep shows they're satisfied with position
- Real move begins after accumulation completes
- You enter RIGHT when institutional momentum begins

**Professional Perspective:**

Amateurs fight sweeps and get stopped out. Professionals:
- Expect sweeps at consolidation levels
- Know they provide entry opportunities
- Wait for sweep reversal for cleanest entries
- Trade with institutional momentum, not against it

Master liquidity sweeps and you'll never get trapped again.
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
            <span className="text-sm font-semibold text-royal-green">Level 4 of 7</span>
          </div>
          <h1 className="text-5xl font-playfair font-bold text-matte-black mb-4">
            Liquidity &amp; <span className="text-gradient">Manipulation</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understand how institutions manipulate price to collect stops and accumulate positions.
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
            href="/levels/level-3"
            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-royal-green text-royal-green font-semibold rounded-lg"
          >
            Back to Level 3
          </a>
          {progress === 100 && (
            <a
              href="/levels/level-5"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-royal-green to-royal-emerald text-white font-bold rounded-lg"
            >
              <span>Continue to Level 5</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          )}
        </motion.div>
      </div>
    </div>
  )
}
