'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Target,
  CheckCircle,
  Shield,
  Zap,
  Clock,
} from 'lucide-react'

export default function AccountManagementPage() {
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null)
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, string>>({})

  const lessons = [
    {
      id: 1,
      title: 'Position Sizing: The Most Important Formula in Trading',
      icon: DollarSign,
      content: `
Position sizing is not optional. It's the difference between sustainable trading and account blowup.

**The Formula (Memorize This):**

Position Size = (Account Balance × Risk %) ÷ Stop Distance (in pips)

Example:
- Account: $10,000
- Risk: 1% = $100
- Stop Distance: 50 pips on EUR/USD = 0.0050
- Position Size: $100 ÷ 0.0050 = $20,000 notional
- Actual position: 0.2 lots (on most brokers)

If the trade hits your stop, you lose exactly 1% = $100.

**Why This Matters:**

Most traders ignore position sizing. They think: "I'll just enter 1 lot and hope for the best."

Result: They risk $500 on a $10,000 account. That's 5% risk per trade.

After 3 losing trades in a row (normal variance): -5% × 3 = -15% = down to $8,500.

Emotional pressure is now EXTREME. They panic. They revenge trade. Account spirals to zero.

If the same trader used proper sizing (1% risk):
After 3 losing trades: -1% × 3 = -3% = down to $9,700.

Manageable. They stay calm. They follow their system. They eventually win.

**Correct Risk Levels by Account Stage:**

Beginners ($0-$5,000): Risk 0.5% per trade
- You're learning. Low pressure. Focus on consistency, not profits.
- $5,000 account × 0.5% = $25 per trade risk

Early Stage ($5,000-$25,000): Risk 0.75%-1% per trade
- You've proven your system works. Still building confidence.
- $10,000 account × 1% = $100 per trade risk

Intermediate ($25,000+): Risk 1-2% per trade
- You have experience. You understand your system. You can handle variance.
- $25,000 account × 1.5% = $375 per trade risk

Professional ($100,000+): Risk 1-2% per trade (or less)
- Even professionals don't risk more than 2%. Why? Because 2% is mathematically optimal.

**The Math Behind 1-2% Risk:**

At 1% risk per trade:
- 10 losing trades in a row: Account down to 90.4% (recoverable)
- 20 losing trades in a row: Account down to 81.8% (still recoverable)
- 50 losing trades in a row: Account down to 60.5% (painful but survivable)

At 5% risk per trade:
- 10 losing trades in a row: Account down to 59.9% (serious damage)
- 15 losing trades in a row: Account down to 20.6% (nearly blown)
- 16 losing trades in a row: Account down to 4.4% (functionally blown)

With 1% risk, you can survive anything. With 5% risk, you're one bad streak from zero.

**How to Calculate Your Stop Distance:**

Professional method: Use ATR (Average True Range)

Stop = Entry Price ± (ATR × 1.5)

Example:
- Entry: EUR/USD 1.0900
- ATR: 0.0033 (33 pips)
- Stop: 1.0900 - (0.0033 × 1.5) = 1.0851
- Stop Distance: 49 pips

Now you know:
- If you risk 1% = $100
- Position Size = $100 ÷ 0.0049 = $20,408 notional

This is professional-level position sizing. It's based on volatility, not guessing.

**Common Sizing Mistakes to Avoid:**

Mistake 1: "I'll risk more because this setup looks really good."
→ Bad. Your position size is independent of setup quality. You size based on account, not confidence.

Mistake 2: "I lost last trade, so I'll size up on this one to make it back."
→ Worst mistake. This is revenge trading. It always backfires.

Mistake 3: "The volatility is really high, so I can risk more."
→ Wrong. High volatility = bigger stops = smaller positions. Never deviate from formula.

Mistake 4: "I'm up 20% this month, I should scale up to 3-5% risk."
→ No. Consistency means same sizing every trade. Don't let winning streaks make you reckless.

**The Professional's Approach:**

Week 1: Verify my stop distance calculation is correct.
Week 2-4: Take 50 trades at 1% risk. Track win rate.
Week 5: If win rate > 50%, I might scale to 1.5% risk.
Week 6-12: Trade at 1.5% for 100 trades. Refine system.
Month 4+: If consistent profits, scale to 2% risk (maximum).

This is boring. This is also why professionals are still trading in 5 years while 95% of retail traders are broke.
      `,
    },
    {
      id: 2,
      title: 'Understanding Drawdown: Why It Matters',
      icon: TrendingUp,
      content: `
Drawdown is the single biggest reason traders blow accounts. Understanding it changes everything.

**Definition:**

Drawdown = Peak balance → Lowest point during losing streak

Example:
- You have $10,000
- You trade well, reach $12,000
- Then you lose trades, drop to $9,500
- Your drawdown = $12,000 → $9,500 = -$2,500 = -20.8% from peak

**Why Drawdown Is Dangerous:**

It's not just the loss. It's the recovery math.

If you lose 10%, you need +11.1% to break even.
If you lose 20%, you need +25% to break even.
If you lose 30%, you need +42.9% to break even.
If you lose 50%, you need +100% to break even.

This is exponential. The deeper the hole, the harder to climb out.

Example: You have $10,000
- After losing trades: $5,000 (50% drawdown)
- To get back to $10,000, you need to turn $5,000 into $10,000
- That's a +100% gain
- At 10% monthly gains, that takes 7+ months

One bad losing streak can wipe out a YEAR of profits.

**Realistic Drawdown Expectations:**

If you trade a high-probability system (55% win rate):

With 1% risk per trade:
- Expected max drawdown: 10-15%
- Recovery time: 1-3 months

With 2% risk per trade:
- Expected max drawdown: 20-30%
- Recovery time: 3-6 months

With 5% risk per trade:
- Expected max drawdown: 50-70%
- Recovery time: 6-12+ months (or never)

This is why professionals risk 1-2%. It's the sweet spot between growth and drawdown management.

**How to Manage Drawdown:**

**Strategy 1: Daily Stop-Loss**

If you lose 3-5% in a single day, STOP trading.
- Close your platform
- Go outside
- Come back tomorrow

Why? Because emotional trading after losses is statistically bad. You make revenge trades. You break your system. You dig deeper.

Professional traders know: "The best trade isn't the next one. It's NO trade when I'm upset."

**Strategy 2: Weekly Stop-Loss**

If you lose 10% in a week, take a 5-7 day trading break.
- Analyze what went wrong
- Adjust your system if needed
- Return with a clear head
- Start fresh

**Strategy 3: Adjust Position Size During Drawdown**

Some professionals scale down during drawdowns:
- Normal: 1% risk per trade
- In a drawdown (-5% to -10%): 0.5% risk
- Deep drawdown (-15%+): 0.25% risk

This protects capital while you wait for the market to cooperate again.

**Strategy 4: The Profit Protection Rule**

Once you reach +20% profit:
- Lock in half the profit (take out 10% of gains)
- Keep trading with the remaining 10% profit + original capital
- Now a severe drawdown only hurts recent gains, not capital

Example: $10,000 → $12,000 gain (+$2,000)
- Lock in $1,000 profit (take it out to safe account)
- Keep trading with $11,000 (original $10,000 + $1,000 remaining gains)
- Even if you lose $2,000, you still have your original capital

**The Psychological Impact of Drawdown:**

Drawdown is where psychology fails most traders.

- -5% drawdown: Annoyed. But manageable.
- -10% drawdown: Frustrated. Starting to doubt system.
- -15% drawdown: Scared. "What if my system is broken?"
- -20% drawdown: Desperate. "I need to make this back NOW!"

At -20%, most traders break their rules. They increase size hoping to recover faster. This usually makes drawdown worse, not better.

Professionals expect drawdowns. They plan for them. They don't panic.

**Your Drawdown Rule:**

"I will accept 10-15% drawdown as the cost of trading. I will not panic. I will not revenge trade. I will not increase position size. I will stick to my system and trust the math."

This simple rule separates professionals from amateurs.
      `,
    },
    {
      id: 3,
      title: 'Risk Management: Daily and Weekly Limits',
      icon: Shield,
      content: `
Position sizing per trade is good. But you also need DAILY and WEEKLY maximum loss limits.

Why? Because even with 1% risk per trade, you can take 10 bad trades in a row and lose 10%.

Professional traders set hard limits before this happens.

**Daily Loss Limit (The Hard Stop):**

Most professionals set: -3% to -5% daily loss limit

What this means:
- If you lose this much in a single day, you STOP trading
- You don't take "just one more" trade
- You close your platform
- You're done for the day

Example (1% risk per trade):
- Account: $10,000
- Daily limit: -5% = $500
- This means: 5 losing trades in a row = stop
- Mentally prepared: "If I lose 5 in a row today, it's a sign. I stop."

Why does this work?

When you hit your daily limit, you're usually emotionally compromised. You've made mistakes. Your discipline is wavering. The BEST trade you can make is NO trade.

By stopping at -5%, you:
- Preserve capital
- Protect yourself from revenge trading
- Force yourself to reset emotionally
- Come back tomorrow clear-headed

**Weekly Loss Limit (The Bigger Stop):**

Most professionals set: -10% weekly loss limit

What this means:
- If you lose this much in a week, you take 5-7 days OFF
- No trading
- Full break
- Analyze what went wrong
- Return when refreshed

Example:
- Monday: -2%
- Tuesday: -3%
- Wednesday: -3%
- Thursday: -2% (you hit your -10% weekly limit)
- Friday-Sunday: Don't trade. Review trades.
- Monday: Return fresh

Why does this work?

A -10% drawdown usually indicates something is wrong with either:
1. Your system (it broke, market changed)
2. Your execution (you're not following rules)
3. Your psychology (you're playing scared or desperate)

Taking a break gives you space to identify which it is. You can't see clearly when you're down -10%.

**The Math of Daily/Weekly Limits:**

Professional trader with 1% risk per trade + 5% daily limit:
- Worst day: Lose 5 trades in a row = -5%
- But this happens ~1% of the time
- Over 250 trading days: ~2-3 really bad days per year
- Still highly profitable overall

Trader without limits, risks 5% per trade:
- Can lose 10% in one day
- Panics
- Revenge trades (increases to 10% risk now)
- Loses another 10%
- Spirals to -50%+ within days

The limits aren't about being passive. They're about preventing emotional disaster.

**The 3-Loss Rule (Alternative):**

Some traders use: "If I lose 3 trades in a row, I review my system before taking another trade"

This is less strict than daily/weekly limits, but prevents revenge trading:
- Trade 1: Lose
- Trade 2: Lose
- Trade 3: Lose
- PAUSE. Don't trade #4 immediately. Review the 3 losses.
  - Did I follow my system? (If no, fix before trading again)
  - What do the losses have in common? (Bad setups? Bad timing? Market changed?)
  - Should I adjust anything?
- Only then: Take trade #4

This keeps you from spiraling emotionally.

**Real Example of How Limits Save Accounts:**

Trader A (With limits):
- Monday: Loses $200 (-2%)
- Tuesday: Loses $350 (-3.5%) [Total: -5.5%]
- Wednesday: Hits daily limit $500, STOPS
- Daily: Takes break, reviews
- Thursday: Returns, takes 2 wins, breaks even on the day

Final week: -$200 loss. Survives. Learns.

Trader B (No limits):
- Monday: Loses $200 (-2%)
- Tuesday: Loses $350 (-3.5%)
- Wednesday: Loses $300 (-3%), revenge trades anyway
- Loses another $600 (-6%) [Total -15%]
- Gets desperate, risks 5% on trade #5
- Loses another $1000 (-10%)
- Total loss: -$2,650 (-26.5%)

Final week: Massive drawdown. Account in critical condition. Panic trading next week spirals to zero.

Same system. Same market. Different discipline.

The difference? Daily and weekly limits.

**Your Risk Management Rule:**

"1-2% per trade. 5% daily max loss. 10% weekly max loss. When I hit these limits, I STOP. No exceptions. No "just one more". The limits exist to save me from myself."

Write this down. Put it on your desk. Tattoo it on your forehead if necessary.

This is what separates survivors from blown accounts.
      `,
    },
    {
      id: 4,
      title: 'Scaling Your Position Size as Your Account Grows',
      icon: Zap,
      content: `
One of the biggest psychological challenges: When your account grows, should you increase position size?

Short answer: Yes, but carefully and mechanically.

**The Philosophy:**

If your account doubles, your absolute risk doesn't need to double.

Example:
- $10,000 account, 1% risk = $100 per trade
- $20,000 account, 1% risk = $200 per trade

Same 1% risk, but your profit per winning trade has doubled.

Over 100 trades at 60% win rate:
- $10,000 account: 60 wins × $250 avg win = $15,000 profit
- $20,000 account: 60 wins × $500 avg win = $30,000 profit

You're making twice as much with the same risk percentage.

This is how trading compounds. This is how $10,000 becomes $1,000,000.

**The Correct Scaling Formula:**

Don't scale based on emotion ("I feel confident now")
Don't scale based on recent wins ("I had 5 good trades!")
Scale based on statistical proof.

Professional scaling:

$10,000 account:
- Risk: 1% per trade = $100
- Trade 50 times. Calculate actual win rate.
- If win rate ≥ 50%, move to next level.

$10,000 → $15,000 account:
- Risk: 1% per trade = $150
- Trade 50 more times. Verify system still works.
- If consistent, move to next level.

$15,000 → $25,000 account:
- Risk: 1.25% per trade = $312
- Trade 50 more times. System holding up?
- If yes, move to next level.

$25,000 → $50,000 account:
- Risk: 1.5% per trade = $750
- Trade 100 times at this size to confirm stability.

$50,000+ account:
- Risk: 1.5-2% per trade
- Never increase beyond 2%. Math breaks down at higher risk levels.

This is mechanical. Not emotional. Not exciting. But it works.

**What NOT to Do:**

Mistake 1: Jump from 1% to 5% risk because your account grew
→ You'll blow up within weeks. The math doesn't hold at 5%.

Mistake 2: Increase size after 3 good trades
→ Overconfidence. A bad streak is coming. Stick to your formula.

Mistake 3: Size up and down based on confidence level
→ Inconsistency creates psychological issues. Stick to mechanical rules.

Mistake 4: Scale up during a drawdown
→ This is revenge trading in disguise. Only scale up during profit phases.

**The Compounding Effect (Why This Matters):**

Let's compare two traders, both with same win rate (55%) and same entry rules:

Trader A (Proper scaling):
- Year 1: $10,000 → $15,000 (1% risk, 10% monthly avg)
- Year 2: $15,000 → $33,750 (1.25% risk)
- Year 3: $33,750 → $101,250 (1.5% risk)
- Year 4: $101,250 → $304,000+ (1.5-2% risk)

Trader B (Never scales):
- Year 1: $10,000 → $15,000 (1% risk, 10% monthly avg)
- Year 2: $15,000 → $22,500 (still 1% risk)
- Year 3: $22,500 → $33,750 (still 1% risk)
- Year 4: $33,750 → $50,625 (still 1% risk)

Same system. Trader A: $300k+. Trader B: $50k.

Why? Because Trader A scaled proportionally, letting profits compound.

**The Emotional Side:**

Scaling can feel like you're "gambling more" when you're actually just maintaining the same risk percentage.

$100 risk on $10k feels like $100.
$500 risk on $50k feels like you're RISKING MORE even though it's still 1%.

Remember: It's 1% of your account either way. The math is identical.

Professional traders scale with discipline and logic, not emotion.

**Your Scaling Rule:**

"I will scale position size proportionally as my account grows. Every 50% account growth, I will recalculate my position size. I will ONLY scale up when my system has proven profitable. I will never go beyond 2% risk per trade."

Scale consistently, and your account will grow exponentially.

Forget to scale, and you're leaving money on the table.

Over-scale, and you'll blow up.

Get it right, and you build generational wealth.
      `,
    },
  ]

  const assessment = [
    {
      id: 1,
      question: 'What is the recommended risk per trade for beginners?',
      options: ['0.25%', '0.5% - 1%', '2% - 5%', 'As much as possible'],
      answer: '0.5% - 1%',
    },
    {
      id: 2,
      question: 'Position Size formula is: (Account × Risk %) ÷ ?',
      options: ['Win rate', 'Stop Distance', 'Target distance', 'Leverage'],
      answer: 'Stop Distance',
    },
    {
      id: 3,
      question: 'If you lose 20%, how much do you need to gain to break even?',
      options: ['20%', '22%', '25%', '30%'],
      answer: '25%',
    },
    {
      id: 4,
      question: 'What should you do if you hit your daily loss limit?',
      options: [
        'Take one more trade to make it back',
        'Stop trading for the day',
        'Double your risk on next trade',
        'Increase leverage',
      ],
      answer: 'Stop trading for the day',
    },
    {
      id: 5,
      question: 'When should you scale your position size?',
      options: [
        'After your first winning trade',
        'After 3 good trades in a row',
        'After 50 trades proving your system works',
        'Whenever you feel confident',
      ],
      answer: 'After 50 trades proving your system works',
    },
  ]

  const toggleLesson = (id: number) => {
    setExpandedLesson(expandedLesson === id ? null : id)
  }

  const handleAssessmentChange = (id: number, answer: string) => {
    setAssessmentAnswers(prev => ({
      ...prev,
      [id]: answer,
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-royal-emerald" />
            <h1 className="text-5xl font-bold text-white">Account Management</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Position sizing, drawdown management, and risk control are what separate professional
            traders from account blowups. Master this and you'll outlast 95% of traders.
          </p>
          <p className="text-gray-400 mt-3">
            <strong>By J Supreme Trading Institute</strong> — Compiled from professional risk
            management practices and trading psychology research
          </p>
        </motion.div>

        {/* Golden Rule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-accent-gold/20 to-accent-gold/10 border border-accent-gold/50 rounded-2xl p-8 mb-12"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-12 h-12 text-accent-gold flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">The Golden Rule</h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                <strong>Never risk more than 1-2% of your account on a single trade.</strong> This
                single rule has kept professional traders profitable for decades. Even with a 50%
                win rate and no edge, you'll survive any losing streak and eventually compound to
                wealth.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Lessons */}
        <div className="space-y-6 mb-12">
          {lessons.map((lesson, idx) => {
            const Icon = lesson.icon
            const isExpanded = expandedLesson === lesson.id

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white/5 border border-royal-green/30 rounded-xl overflow-hidden hover:border-royal-green transition-colors"
              >
                <button
                  onClick={() => toggleLesson(lesson.id)}
                  className="w-full text-left p-6 hover:bg-royal-green/5 transition-colors flex items-center gap-4"
                >
                  <div className="flex-shrink-0 p-3 bg-royal-green/20 rounded-lg">
                    <Icon className="w-6 h-6 text-royal-emerald" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white">{lesson.title}</h3>
                  </div>
                  <span className="text-royal-green text-2xl">{isExpanded ? '−' : '+'}</span>
                </button>

                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="border-t border-royal-green/30 px-6 py-6 bg-matte-black/40"
                  >
                    <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
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

        {/* Assessment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-royal-green/10 to-royal-emerald/5 border border-royal-green/30 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle className="w-8 h-8 text-royal-emerald" />
            <h2 className="text-3xl font-bold text-white">Assessment Quiz</h2>
          </div>
          <p className="text-gray-300 mb-8">
            Test your understanding of account management and risk control.
          </p>

          <div className="space-y-6">
            {assessment.map(item => (
              <div key={item.id} className="bg-white/5 border border-royal-green/20 rounded-xl p-5">
                <div className="text-white font-semibold mb-4">
                  {item.id}. {item.question}
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {item.options.map(option => {
                    const selected = assessmentAnswers[item.id] === option
                    const isCorrect = selected && option === item.answer
                    const isWrong = selected && option !== item.answer

                    return (
                      <button
                        key={option}
                        onClick={() => handleAssessmentChange(item.id, option)}
                        className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                          isCorrect
                            ? 'bg-green-500/20 border-green-500/60 text-green-200'
                            : isWrong
                              ? 'bg-red-500/20 border-red-500/60 text-red-200'
                              : 'bg-white/5 border-royal-green/30 text-gray-300 hover:border-royal-green'
                        }`}
                      >
                        {option}
                      </button>
                    )
                  })}
                </div>
                {assessmentAnswers[item.id] && (
                  <div className="text-sm text-gray-300 mt-3">
                    {assessmentAnswers[item.id] === item.answer ? (
                      <span className="text-green-400">✓ Correct!</span>
                    ) : (
                      <>
                        <span className="text-red-400">✗ Incorrect.</span>{' '}
                        <span className="text-royal-emerald">Correct answer: {item.answer}</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-accent-gold/10 border border-accent-gold/30 rounded-lg">
            <p className="text-gray-300">
              <strong className="text-accent-gold">Score:</strong>{' '}
              {
                Object.values(assessmentAnswers).filter(
                  (ans, idx) => ans === assessment[idx].answer
                ).length
              }{' '}
              / {assessment.length} correct
            </p>
          </div>
        </motion.div>

        {/* Key Takeaways */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-royal-green/30 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Key Takeaways</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">✓</span>
              Position size is calculated using: (Account × Risk %) ÷ Stop Distance. Use this
              formula every single trade.
            </li>
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">✓</span>
              1-2% risk per trade is optimal. It's not conservative—it's mathematically proven to
              work long-term.
            </li>
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">✓</span>
              Drawdown is the biggest psychological challenge. Deeper drawdowns require
              exponentially larger gains to recover. Manage it with daily/weekly loss limits.
            </li>
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">✓</span>
              Scale position size proportionally as your account grows. After 50 profitable trades
              at current size, increase to next level.
            </li>
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">✓</span>
              Daily loss limit (-3% to -5%) and weekly loss limit (-10%) prevent revenge trading and
              emotional decisions.
            </li>
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">✓</span>
              Position sizing isn't about maximum profits. It's about surviving and letting
              compounding work over years.
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
