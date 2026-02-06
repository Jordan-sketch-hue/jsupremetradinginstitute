'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Shield, Target, Zap, CheckCircle, Trophy } from 'lucide-react'

export default function Level7Page() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  const lessons = [
    {
      id: 31,
      title: 'Position Sizing Mastery',
      duration: '22 min read',
      icon: Target,
      content: `
Position sizing determines your survival as a trader. Too big and one loss wipes you out. Too small and profits won't compound.

**The Fundamental Rule:**

Risk Management Formula:
Position Size = (Account Balance × Risk %) ÷ Stop Distance

Example:
- Account: $10,000
- Risk: 1% = $100
- Stop distance: 50 pips = 0.0050
- Position size: $100 ÷ 0.0050 = 20,000 (notional) = 0.2 lots EUR/USD

**Why 1-2% is Non-Negotiable:**

If you risk 1% per trade and lose 10 in a row:
- Account down to: 90% of original
- Recovery needed: 11% gain
- Achievable: Yes (1-2 trades)

If you risk 5% per trade and lose 10 in a row:
- Account down to: 59% of original
- Recovery needed: 67% gain
- Time needed: 10-20 trades
- Drawdown stress: Unbearable

If you risk 10% per trade and lose 10 in a row:
- Account down to: 35% of original
- Recovery needed: 154% gain
- Time needed: 30+ trades
- Account blown: Likely

The math is clear: 1-2% is what professionals use.

**Position Sizing Based on Setup Quality:**

Instead of static sizing, scale based on confluence:

2-confluence setup = 0.5x position size
3-confluence setup = 1.0x position size
4-confluence setup = 1.5x position size
5+-confluence setup = 2.0x position size

Example:
- Base risk: 1% ($100)
- 3-confluence setup: 1.0x normal = 0.2 lots
- 5-confluence setup: 2.0x normal = 0.4 lots

This rewards high-probability trades and reduces exposure on weak setups.

**Position Sizing Based on Volatility:**

High ATR environment (100+ pips):
- Stop distances wider
- Position size must be smaller
- Take 0.75x normal size
- Or move stops closer (but less reliable)

Low ATR environment (20 pips):
- Stop distances tighter
- Position size can be larger
- Take 1.25x normal size
- More room to work with smaller stops

**Scaling Into Winners:**

Never all-in at one price. Professionals scale:

Entry 1: 50% of position at initial setup
Entry 2: 25% more on confirmation (1 hour later)
Entry 3: 25% more on first target hit (scaling in)

This reduces risk of being early and improves average entry price.

**The Kelly Criterion (Advanced):**

Optimal position size = (Win % × Avg Win) - (Loss % × Avg Loss)

Example:
- Win rate: 55%
- Average winner: 2% account gain
- Average loser: -1% account loss
- Kelly: (0.55 × 2) - (0.45 × 1) = 0.65%

Your optimal risk = 0.65% per trade (not 1%)

Most professionals use 25-50% of Kelly (0.35-0.45%) for safety.

**Your Sizing Rules:**

1. Never risk more than 2% per trade
2. Base position on 1% risk (adjust with confluence)
3. Higher confluence = Can size up to 2x
4. Low ATR = Can size up 1.25x
5. High ATR = Must size down 0.75x
6. Scale in on strong setups, not all-in
7. Track your actual win rate and adjust

This scientific approach to sizing is what separates amateurs (random sizes) from professionals (calculated risk).
      `,
    },
    {
      id: 32,
      title: 'Emotional Discipline',
      duration: '20 min read',
      icon: Shield,
      content: `
The most important skill isn't analysis. It's the ability to follow your plan when every emotion says otherwise.

**The Enemy: Your Brain**

Your brain evolved for survival, not trading. It:
- Fears losses more than it values wins (loss aversion)
- Sees patterns that don't exist (pattern recognition)
- Overweights recent events (recency bias)
- Gets attached to positions (sunk cost fallacy)

To profit, you must override your natural instincts.

**The Emotional Cycle Trap:**

Hope → Fear → Regret → Revenge → Denial

This cycle repeats until account is blown.

How to Break It:

**During Entry Hope Phase:**
- Don't think about "what if it goes to the moon"
- Focus on: "What's my stop? What's my risk?"
- Make decision based on setup, not emotion
- Write down your plan BEFORE entering

**During Holding Fear Phase:**
- Don't stare at the chart
- Don't move stops closer
- Don't exit early
- Check position only 1-2 times daily

**After Loss Regret Phase:**
- Don't revenge trade immediately
- Take 30-minute break, minimum
- Ask: "Did I follow my plan?"
- Not: "Why did I take this trade?"

**During Revenge Temptation Phase:**
- Walk away from computer
- Go outside, exercise, meditate
- Never make trades in emotion
- The market will still be there tomorrow

**During Denial Phase:**
- Journal the trade (what happened, what you felt)
- Review objectively
- Learn the lesson
- Move forward (don't get stuck)

**Building Emotional Control:**

**1. Mechanical Trading System**

Remove decisions = Remove emotions

Pre-defined:
- Entry rules (3+ confluences)
- Stop placement (ATR × 1.5)
- Target levels (ATR × 2-3)
- Exit rules (target or stop only)

When rules are clear, emotions have nowhere to hide.

**2. Trade Journal**

Write BEFORE and AFTER every trade:

Before:
- Why am I entering?
- What confluences present?
- Where's my stop?
- What's my target?

After:
- Did I follow the plan?
- What was I feeling?
- What could be better?

This forces accountability and shows patterns in your behavior.

**3. The 24-Hour Rule**

After any significant loss:
- Don't trade for 24 hours
- Emotions need to settle
- Review what happened
- Return with clear head

This single rule prevents 50% of accounts from blowing up.

**4. Smaller Position Sizes**

Emotional pressure = Position size × Account risk

If position is too big:
- Every tick stresses you
- You make bad decisions
- You exit early or hold losers

If position is small:
- You're calm
- You follow your plan
- You make rational decisions

Professional traders use position size to manage emotion.

**5. Predetermined Exit Rules**

The hardest decision is WHEN to exit.

Pre-decide:
- I exit AT my target (not before)
- I exit AT my stop (not before)
- These are the ONLY two exits

No "moving stops for more room" = Remove temptation

**Real-World Scenario:**

You're in a trade:
- Entry: 1.0900
- Stop: 1.0880
- Target: 1.0950
- Now price is at 1.0925 (halfway)

Your Brain Says:
- "Take profits now before it reverses!"
- "Move stop to breakeven, it's safer"
- "I feel like it's about to reverse down"

Professional Says:
- Target was 1.0950 (stick to plan)
- Stop is 1.0880 (don't move it)
- Close the chart (don't watch)
- Return at 1.0950 or 1.0880

Result: Target hits at 1.0950. +50 pip win. If you'd exited at 1.0925, you'd have +25. Plan won.

**The Discipline Score:**

Rate your emotional discipline 1-10 today:
- Score: 1-3 = Your account is in danger. Fix this before risking more.
- Score: 4-6 = Working on it. Start journaling and use mechanical rules.
- Score: 7-8 = Good. Continue the routine that works.
- Score: 9-10 = Elite level. Rare even among professionals.

**Your Emotional Rule:**

"I will follow my predetermined plan even if my feelings say otherwise. My profit comes from discipline, not predictions."

Print this. Say it daily. Your account balance depends on it.
      `,
    },
    {
      id: 33,
      title: 'Probability Thinking',
      duration: '18 min read',
      icon: TrendingUp,
      content: `
Stop thinking about individual trades. Think about probabilities across 100 trades. This shift changes everything.

**The Individual Trade Trap:**

Retail Thinking:
- "Will THIS trade win?"
- "I feel good about THIS one"
- Focus on outcome of single trade
- Emotional attachment to result

Result: Account blown (chasing winners, cutting losers)

Professional Thinking:
- "What's the probability THIS trade wins?"
- "Across 100 trades like this, how many win?"
- Focus on process and probability
- Detached from individual results

Result: Consistent profits (law of large numbers)

**Understanding Probability:**

60% win rate setup means:
- 6 out of 10 trades win
- 4 out of 10 trades lose
- But which 6? You don't know.

Sequence might be:
W-W-W-W-L-W-L-W-W-L (6W, 4L over 10)
or
L-L-L-L-L-W-W-W-W-W (5W after losses first)
or
W-L-W-L-W-L-W-L-W-L (alternating)

Over 100 trades: ~60 win, ~40 lose (consistent)
Over 10 trades: Could be 8W-2L or 4W-6L (variance)

**Small Sample Size Trap:**

After 5 trades going 3-2:
- Retail trader thinks: "My system works! (60%)"
- Reality: This could be random chance

After 100 trades going 60-40:
- Professional trader knows: "My system works (60% confirmed)"
- Trustworthy: Law of large numbers applies

Your First 10 Trades:
- Could go 10-0 (lucky)
- Could go 0-10 (unlucky)
- Both are within variance
- Don't judge your system yet

Your First 50 Trades:
- Variance still affects results
- But a 50% system should show 20-30 wins
- A 60% system should show 25-35 wins
- Still tracking

Your First 100 Trades:
- A 60% system reliably shows 55-65 wins
- This is when you know your system works
- Now you can scale positions

**Risk/Reward Probability:**

2:1 Risk/Reward setup:
- Even at 50% win rate, you profit
- 50 trades: 25 win (2 RR) = +50R profit
- 50 trades: 25 lose (1R loss) = -25R loss
- Net: +25R (break even + 50%)

3:1 Risk/Reward setup:
- At 50% win rate, huge profit
- 50 trades: 25 win (3 RR) = +75R profit
- 50 trades: 25 lose (1R loss) = -25R loss
- Net: +50R (double your money)

This is why professionals focus on risk/reward more than win rate.

**The Math Advantage:**

You don't need 60% win rate to profit.

2:1 Setup + 40% win rate = Profitable
- 10 trades: 4 win = +8R, 6 lose = -6R, net +2R

1.5:1 Setup + 50% win rate = Profitable
- 10 trades: 5 win = +7.5R, 5 lose = -5R, net +2.5R

1.2:1 Setup + 55% win rate = Profitable
- 10 trades: 5-6 win = +6-7.2R, 4-5 lose = -4.8-5R, net +0.2-2R

**Professional Strategy:**

Don't chase 70% win rate. Instead:
- Settle for 50-55% win rate
- Focus on 2:1 or 3:1 risk/reward
- Let probability work
- Take all valid setups
- Consistency beats perfection

**Handling Losing Streaks:**

You're a 60% system. Streak shows: L-L-L-L-W-L

Your thought: "My system is broken!"
Reality: Statistically normal variance

In a 100-trade sample of 60% system:
- Some 3-4 loss streaks WILL happen
- Don't overreact
- Keep trading the system
- Variance always corrects over time

**Your Probability Rules:**

1. Judge your system after 50+ trades (not 5)
2. Focus on win rate + risk/reward (not win rate alone)
3. 50% win rate + 2:1 RR = Profitable
4. Losing streaks happen = Normal variance
5. Trust the math, not your feelings
6. Trade the setup, ignore the outcome

When you think in probabilities, individual losses become irrelevant and profits become inevitable.
      `,
    },
    {
      id: 34,
      title: 'Trade Management',
      duration: '19 min read',
      icon: Zap,
      content: `
How you manage a trade after entry determines if it becomes a 2:1 winner or a 1:1 breakeven or even a loss.

**Three Types of Trade Management:**

**1. Passive Management (Set and Forget)**

You set:
- Entry price
- Stop loss
- Take profit

Then walk away. Position closes at one of these levels.

Pros:
- No emotion during trade
- Simple and mechanical
- Works for swing trades

Cons:
- Miss opportunities to scale out
- Can't lock in early profits
- Miss scaling opportunities

Best for: Daily timeframe swing trades

**2. Active Management (Trailing and Adjusting)**

You actively move:
- Stops: Follow price up/down
- Targets: Adjust based on technical levels
- Position size: Scale in/out

Pros:
- Maximize winning trades
- Limit damage on reversals
- Adapt to market conditions

Cons:
- Requires attention
- Can second-guess yourself
- Emotional decisions possible

Best for: 4-hour and intraday trades

**3. Hybrid Management (Structured Adjustment)**

You use rules (not feelings):
- Move stop to breakeven after 50 pips of profit
- Scale out 50% at 1st target
- Scale out 25% at 2nd target
- Trail final 25% to next order block

Pros:
- Mechanical (emotions removed)
- Captures big moves
- Locks in profits early
- Best risk/reward

Cons:
- Requires planning
- More complex
- Needs discipline

Best for: Professional traders, all timeframes

**Practical Management Techniques:**

**Technique 1: Breakeven Stop**

After +50 pips profit:
- Move stop to entry price
- Now risk is zero
- Let winner run

Psychology: Frees your mind (can't lose now)

**Technique 2: Trailing Stop**

Stop stays 1 ATR below price at all times:
- Price up 100 pips → Stop moves up 100 pips
- Price down 20 pips → Stop stays where it was
- Creates "one-way" exit (follows winners)

Best with: Trending markets

**Technique 3: Scale Out**

50% position at 1st target
25% position at 2nd target
25% position at 3rd target (or trail)

Example: 1 lot EUR/USD entry at 1.0900

At 1.0950 (first target):
- Close 0.5 lots (lock in 50 pip profit)
- Keep 0.5 lots in trade
- Move stop to 1.0925 (breakeven on remaining)

At 1.1000 (2nd target):
- Close 0.25 lots (lock in additional profit)
- Keep 0.25 lots

Continue trailing or close final portion.

Benefit: Guaranteed profit + exposure to bigger move

**Technique 4: Breakout Management**

After entry, market always does one of three things:
1. Move toward target (winning scenario)
2. Move toward stop (losing scenario)
3. Consolidate (sideways)

For #1: Let it run (don't exit early)
For #2: Exit (accept loss, move to next trade)
For #3: Wait (give time, or exit for small loss)

**Managing Against You (Stop Hit Imminent):**

When price approaching your stop:

Option 1: Take the loss (stick to plan)
- Better for discipline
- Protects capital
- Move to next setup

Option 2: Move stop wider (desperate)
- Turns 1R loss into 2R loss
- Rarely saves trade
- Breaks your rules
- Don't do this

Option 3: Close early, cut size (compromise)
- Take 0.75R loss now instead of full 1R loss
- Free up capital for new setup
- Sometimes appropriate

Most professionals: Option 1 (stick to original stop)

**Managing Extended Winners:**

When trade goes 3R+ in profit:

- Don't cut it short for small gain
- Let it run to target
- You earned this risk/reward
- Exiting early is leaving money on table

Psychology: GREED hits hard here. "Take it before it reverses!"
Reality: Your target was calculated for reason. Trust it.

**Your Management Rules:**

1. Start with breakeven stop (after 50+ pips profit)
2. Scale out at pre-determined levels (lock profits)
3. Trail final position to next order block
4. Accept stops when reached (don't move them)
5. Let winners run to target (don't exit early)
6. No emotional adjustments mid-trade

Combine proper entry with proper management = consistent profits.
      `,
    },
    {
      id: 35,
      title: 'Final Assessment & Next Steps',
      duration: '30 min read',
      icon: Trophy,
      content: `
You've completed Level 7. This is the final certification level. Now comes the most important part: applying everything in real markets.

**What You've Learned:**

Level 1: Market Foundations
- What truly moves markets
- Institutional vs retail differences
- Liquidity and psychology

Level 2: Market Structure
- Identifying trends and breaks
- Timeframe stacking
- Higher highs and lower lows

Level 3: Order Block Mastery
- Identifying institutional accumulation
- Mitigation theory
- Institutional footprints
- Unmitigated vs mitigated levels

Level 4: Liquidity & Manipulation
- Stop hunts and fake breakouts
- Smart money traps
- Liquidity sweeps
- Following institutional behavior

Level 5: Indicator Precision
- RSI institutional usage
- ATR volatility logic
- Divergence patterns
- Confirmation stacking

Level 6: Entry Engineering
- Micro structure patterns
- Timing models
- Multi-timeframe entries
- High probability setups

Level 7: Risk & Psychology
- Position sizing mastery
- Emotional discipline
- Probability thinking
- Trade management

**The One Skill That Matters Most:**

Of everything, this matters most: CONSISTENCY

Not exotic strategies. Not perfect timing. Not amazing win rates.

Consistency means:
- Trading the same high-probability setup 100 times
- Following your plan every single time
- Not deviating when "you have a feeling"
- Treating every trade identically
- Letting probability work over 100 trades

Professionals aren't smarter. They're more consistent.

**Your First 100 Real Trades:**

These are critical. Your actual win rate will show.

Track:
- Did you follow your setup rules?
- Did you follow your sizing?
- Did you follow your management?
- What was your actual win rate?
- What was your average risk/reward?

Formula for Profit:
(Win Rate × Avg Win) - (Loss Rate × Avg Loss)

Example:
- (55% × 2R) - (45% × 1R) = 1.1R - 0.45R = 0.65R per trade
- Over 100 trades: 0.65 × 100 = 65R profit

Is 65R possible? It depends on:
- Your actual entries (were they high quality?)
- Your actual targets (did you hit them?)
- Your actual stops (did you hold them?)

**Common Mistakes to Avoid:**

1. **Revenge Trading**
- Most dangerous habit
- Causes 50% of account blowups
- After loss, STOP trading
- Wait 24 hours minimum

2. **Adding to Losers**
- "Average down" is a graveyard
- Never add to losing positions
- Add to WINNERS only, and sparingly

3. **Ignoring Your System**
- You spent weeks learning this
- First loss and you abandon it
- One bad trade ≠ bad system
- Give it 50-100 trades before judging

4. **Overtrading**
- You see 10 setups per day
- Your system says take 1-2
- Discipline = Skip 8
- Overtrading = Account blows up

5. **Moving Stops**
- Worst habit of all traders
- Sets you up for maximum loss
- Turns 1R loss into 2R loss
- Break this habit NOW

6. **Not Journaling**
- You'll forget what happened
- You'll make same mistakes
- Journaling is the fastest way to improve
- Do it religiously

**Your Path Forward:**

**Month 1:**
- Demo trading only (no real money)
- Execute 50 trades on your system
- Track everything
- Journal every trade
- Refine based on what you learn

**Month 2:**
- Start small ($100-500 account) if system works
- Trade 50 real trades
- Same tracking, same journaling
- Build confidence and discipline

**Month 3-6:**
- Scale position size based on equity
- Track monthly statistics
- Identify your strengths/weaknesses
- Adjust only what's not working

**6-12 Months:**
- Consistent monthly profits
- Positive expectancy confirmed
- Ready to scale to full-time
- Consider larger account

**Red Flags That Something's Wrong:**

If after 50 trades:
- You're losing more than winning = System or execution issue
- Trades are not following setup rules = Discipline issue
- You're oversizing = Risk management issue
- You're revenge trading = Emotional issue

Don't hide from these. Face them. Fix them. This is what separates winners from losers.

**Your Certification:**

You've completed Level 7. You've learned:

✓ What institutional traders are doing
✓ How to identify their positions
✓ How to enter trades they're trading
✓ How to manage positions properly
✓ How to think about risk and probability
✓ How to maintain discipline and emotion

You have the knowledge of a professional trader. Now comes the hard part:

**Execution**

Knowledge is not profit. Execution is profit.

Take everything from Levels 1-7.
Test it with discipline.
Track it with honesty.
Improve it relentlessly.

The traders who do this become consistently profitable.

The traders who don't = The same 95% that blows up.

Which will you be?

**Your Final Challenge:**

Commit to this:

□ Complete 50 demo trades following every rule
□ Journal every single trade
□ Calculate your actual win rate
□ Calculate your actual risk/reward
□ If win rate × avg win > loss rate × avg loss, you're ready to scale

If your math is profitable, start small with real money.
If it's not profitable, refine your system. Don't give up.

The best traders failed repeatedly before succeeding. The difference: They learned and adjusted, not abandoned.

You have the complete blueprint now. Execution is up to you.

**Your Next Step:**

Go to the dashboard. Start tracking trades. Begin your journey to consistent profitability.

The market rewards those who are disciplined.
The market punishes those who aren't.

Choose discipline.

Welcome to Level 7. Welcome to professional trading.

Now go earn it.
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
            <span className="text-sm font-semibold text-royal-green">Level 7 of 7 - FINAL</span>
          </div>
          <h1 className="text-5xl font-playfair font-bold text-matte-black mb-4">
            Risk &amp; <span className="text-gradient">Psychology</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Master position sizing, emotional discipline, and probability thinking. This is where
            amateurs become professionals.
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
                      <Trophy
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

        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 p-8 bg-gradient-to-r from-accent-gold/20 to-royal-green/20 border border-accent-gold/50 rounded-2xl text-center"
          >
            <Trophy className="w-16 h-16 mx-auto mb-4 text-accent-gold" />
            <h2 className="text-3xl font-bold text-matte-black mb-3">Congratulations!</h2>
            <p className="text-xl text-gray-700 mb-6">
              You've completed all 7 levels of J Supreme Trading Institute. You now have
              professional-level trading education.
            </p>
            <div className="bg-white border-2 border-royal-green rounded-xl p-6 mb-6">
              <p className="text-gray-700 mb-4">
                <strong>Next Steps:</strong>
              </p>
              <ul className="text-left space-y-2 text-gray-600">
                <li>✓ Start with 50 demo trades to verify your system</li>
                <li>✓ Journal every single trade</li>
                <li>✓ Calculate your actual win rate and risk/reward</li>
                <li>✓ Start small with real money if your math is profitable</li>
                <li>✓ Scale position size as your account grows</li>
              </ul>
            </div>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-royal-green to-royal-emerald text-white font-bold rounded-lg hover:shadow-lg hover:shadow-royal-green/50 transition-all"
            >
              Go to Dashboard to Track Your Trades
            </a>
          </motion.div>
        )}

        {progress < 100 && (
          <motion.div className="mt-12 flex gap-4 justify-between">
            <a
              href="/levels/level-6"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-royal-green text-royal-green font-semibold rounded-lg"
            >
              Back to Level 6
            </a>
          </motion.div>
        )}
      </div>
    </div>
  )
}
