'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  Heart,
  AlertTriangle,
  Target,
  CheckCircle,
  Zap,
  TrendingDown,
  BarChart3,
} from 'lucide-react'

export default function TradingPsychologyPage() {
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null)
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, string>>({})

  const lessons = [
    {
      id: 1,
      title: 'The Four Psychological Enemies of Trading',
      icon: Brain,
      content: `
Trading psychology is the difference between professional traders and account blowups. Your brain evolved for survival—detecting threats, seeking rewards, avoiding losses. But these instincts destroy traders.

**The Four Enemies:**

**1. FEAR - The Paralyzer**

Fear keeps you alive in the wild. Fear makes you hesitate when entering high-probability setups. Fear makes you exit winners too early.

What happens: You enter a trade. Price moves 10 pips in your favor. Fear kicks in: "What if it reverses?" You exit. Price goes to your target. You regret it. Fear made you leave money on the table.

Professional Response: Fear is data, not direction. When you feel fear entering a trade, ask: "Is this trade valid per my rules?" If yes, take it. Your rules exist to override your fear.

Exercise: Next 5 high-probability setups, take them ALL even if fear says no. Track the results. Usually fear is wrong—the setups win.

**2. GREED - The Blinder**

Greed makes you take trades that don't fit your system. Greed makes you risk 10% instead of 1%. Greed makes you hold winners too long hoping for more.

What happens: You make 3 good trades in a row. +2R, +2R, +1.5R. Greed kicks in: "I can make +5R on this next one!" You overleverge. You risk 5% instead of 1%. The market reverses. -5R. All previous gains erased in one trade.

Professional Response: Greed is quantified and controlled. You decide your targets BEFORE entering. You decide your size BEFORE entering. You DON'T change these mid-trade. Your system is your greed antidote.

Exercise: Write your entry and exit rules on paper. Keep it visible. Before EVERY trade, check the paper. Your written rules beat your feelings.

**3. REVENGE TRADING - The Spiral**

Revenge trading is trading to recover a loss instead of trading your system. It's the fastest way to blow an account.

What happens: You take a loss. -1R. You're upset. You NEED to make it back. You take the next setup even though it's lower probability. You risk 2% this time. You lose again. -2R. Now you're down -3R total. You're frustrated. You take a third trade with even worse odds. You lose. Spiral accelerates.

Result: 3 losses in a row trying to revenge trade, and you've lost -5R in 20 minutes. Your daily plan is ruined.

Professional Response: After a loss, STOP. Take a 30-minute break minimum. Go outside. Drink water. Let emotion settle. Your next trade should be your BEST trade, not your angry trade.

The hardest rule to follow: "After a loss, I don't trade for 30 minutes minimum."

Exercise: Set a timer after each loss. Don't trade until timer goes off. You'll notice most of your anger trades would have lost money.

**4. OVERCONFIDENCE - The Killer**

Overconfidence happens after 3-4 wins in a row. Your brain says: "I've got this figured out!" You start breaking your rules. You take lower-probability setups. You risk 3% instead of 1%. You skip your checklist. You think you're smarter than the market.

What happens: You have 4 wins in a row. +1.5R, +2R, +1R, +1.5R. You're up +6R total. You feel invincible. The next setup isn't quite valid—wrong timeframe, weak confluence—but you take it anyway. The market crushes you. -2R. Then another overconfident trade. -3R. Suddenly your +6R becomes -1R.

Professional Response: Overconfidence is the MOST dangerous because it feels like competence. You think you're winning because you're good. You're winning because you followed your system. The moment you stop following it, results reverse.

The antidote: "I am not smarter than the market. I am disciplined enough to follow my system. That's why I win."

Exercise: After every 3-win streak, review your checklist. Make sure you actually followed all rules. You'll probably find you were cutting corners.
      `,
    },
    {
      id: 2,
      title: 'Building Unshakeable Discipline',
      icon: Target,
      content: `
Discipline is not motivation. Discipline is a SYSTEM. Motivation fades. Systems persist.

**How Professional Traders Build Discipline:**

**1. The Pre-Trade Checklist**

Before entering ANY trade, you check:

□ Is price at a valid support/resistance level?
□ Do I see 2+ technical confluences?
□ Is this my planned entry price?
□ Is my stop distance appropriate (ATR-based)?
□ Am I risking the correct amount (1-2%)?
□ Is the timeframe aligned with my system?
□ Do I have a documented exit plan?
□ Am I in a calm emotional state?

If ANY box is unchecked, you SKIP the trade. Not "maybe take it." SKIP it.

This checklist is your discipline system. Your feelings don't get a vote. The checklist does.

**2. The Trade Journal**

Write down BEFORE you enter:
- Why am I taking this trade?
- What's my exact entry?
- Where's my stop?
- Where's my target?
- What am I feeling?

Write down AFTER you exit:
- Did I follow my plan?
- What was the actual result?
- What did I feel during the trade?
- What could I have done better?
- Did I move my stop or exit early?

This journal is data. After 50 trades, you'll see patterns. You'll notice you always exit winners early when you're "feeling lucky." You'll notice you hold losers too long when you're upset. The journal shows you your weaknesses.

**3. The Commitment Device**

Tell someone (spouse, friend, trading buddy):
"I will follow my system on 100% of trades for the next 30 days. I will not skip trades I'm afraid of. I will not take trades that aren't in my system. I will not change my stops or targets mid-trade."

Accountability is powerful. Knowing someone will ask you "Did you follow your system?" makes it real.

**4. The Mechanical Approach**

Remove decisions = Remove emotions.

Don't ask: "Should I take this trade?"
Instead use: "Does this trade meet criteria X, Y, Z?"

If yes → Take it.
If no → Skip it.

No feelings involved. Just mechanics.

Example checklist for Order Block setups:
- Confluence 1: Price at valid OB? (Y/N)
- Confluence 2: ATR shows volatility setup? (Y/N)
- Confluence 3: Higher timeframe confirms direction? (Y/N)
- Entry: At mitigation? (Y/N)
- Stop: 1.5x ATR below entry? (Y/N)
- Risk: 1% of account? (Y/N)

If all = YES → Take trade. Don't think about it. Just enter.

This removes the emotional battle. Your brain can't argue with clear rules.

**5. The Discipline Scorecard**

Every day, rate yourself 1-10:
- Did I follow my checklist on every trade?
- Did I skip trades that didn't fit?
- Did I avoid revenge trading?
- Did I journal every trade?
- Did I stay within my risk limit?

7-10: Excellent. You earned profits.
4-6: Mediocre. You're fighting yourself.
1-3: Crisis. Your account is in danger.

After 30 days, average your scores. This is your discipline level.

Professional traders: Average 8-10.
Struggling traders: Average 3-5.

The good news: Discipline is a skill. You can improve it by 1-2 points per month with focused effort.

**Building the Discipline Habit:**

Week 1: Just follow checklist. Don't worry about results.
Week 2: Follow checklist + journal every trade.
Week 3: Follow checklist + journal + share results with accountability partner.
Week 4: All three + review journal for patterns.

By week 4, discipline feels normal. You're not fighting yourself anymore.
      `,
    },
    {
      id: 3,
      title: 'Mastering the Emotional Cycle',
      icon: Heart,
      content: `
Every trader goes through an emotional cycle. Understanding it means you can predict your behavior and adjust.

**The Cycle (happens with every trade):**

**Phase 1: HOPE (Before Entry)**
Emotion: Optimistic, excited
Brain says: "This is going to be a winner! I can feel it!"
Danger: You're not thinking clearly. You might skip checklist steps.
Solution: Use mechanical entry checklist. Hope is irrelevant.

**Phase 2: CONVICTION (After Entry)**
Emotion: Confident, committed
Brain says: "I nailed the entry. This is going exactly as planned!"
Danger: Price might not move in your direction immediately. You might panic.
Solution: Remember: 20% of my trades will move against me first. Stick to your stop.

**Phase 3: DOUBT (If Price Moves Against You)**
Emotion: Worried, second-guessing
Brain says: "Maybe I was wrong. Maybe I should exit early. Maybe I should move my stop."
Danger: This is where most traders lose money. They exit at the worst point.
Solution: Your stop exists for exactly this reason. Stick to it.

**Phase 4a: REGRET (If You Exit and Price Reverses)**
Emotion: Frustrated, angry at yourself
Brain says: "I should have held. I'm so stupid."
Danger: This leads to revenge trading.
Solution: Evaluate: Did you follow your plan? Yes? Then the trade was correct. Price reversing is luck, not your failure.

**Phase 4b: EUPHORIA (If Price Moves In Your Favor)**
Emotion: Excited, overconfident
Brain says: "I'm a genius. I should risk more next time. Maybe I can hold for bigger profits."
Danger: This is overconfidence. Next trade you'll break rules.
Solution: Acknowledge the win. Stick to your system. Don't change sizing.

**Phase 5: GREED (When In Profit)**
Emotion: Wanting more, temptation
Brain says: "My target is $500. But what if I hold for $750?"
Danger: You often give back profits this way.
Solution: Your target was calculated for reason. Hit target = exit. Greed feeds regret.

**The Professional's Response to Each Phase:**

1. Hope → "Let my checklist decide, not my feelings."
2. Conviction → "Stick to the plan."
3. Doubt → "My stop protects me. Trust it."
4. Regret → "Did I follow my system? Yes? Then I did right. Move to next."
5. Euphoria → "Acknowledge win. Don't change anything."
6. Greed → "Target = Exit. No exceptions."

**Exercise: The Emotional Log**

For your next 10 trades, after each one, note:
- What emotions did I feel? (Hope, doubt, euphoria, regret, greed)
- Did I follow my system?
- What was the outcome?

After 10 trades, you'll see: "I always get greedy when up +1.5R. And I always give back 0.5R." This awareness is how you fix it.

**The Pattern Most Traders Follow:**

Trade 1: Hope → Follow plan → Win. Euphoria.
Trade 2: Overconfidence → Skip checklist → Lose. Regret.
Trade 3: Revenge → Risk too much → Lose more. Spiral.
Trade 4: Desperation → Take bad setup → Lose. Acceptance.
Trade 5: Redemption → Follow plan carefully → Win. Relief.

Cycle repeats. Professional breaks the cycle by not doing trades 2-4. They're disciplined enough to only take trade 1 and 5.

**Your Emotional Stability Determines Your Account Balance.**

The traders making consistent money aren't smarter. They're emotionally stable. They follow rules when it's hard. That's the difference.
      `,
    },
    {
      id: 4,
      title: 'The Psychology of Position Sizing',
      icon: BarChart3,
      content: `
Position size is NOT just math. It's psychology. Your position size determines how much emotional pressure you feel.

**The Relationship Between Size and Emotion:**

Emotional Pressure = Position Size × Account Risk Percentage

If you're risking 1% per trade on a $10,000 account:
- Position emotion: Relaxed. You can think clearly. You follow your system.

If you're risking 5% per trade on the same $10,000 account:
- Position emotion: Terrified. You're watching every tick. You make emotional decisions.

The SAME trader, same system, different position size = completely different results.

**Why Smaller Sizing Makes You Better:**

Professional Trader A: $50,000 account, risks 0.5% per trade = $250 risk
Result: Profitable. Calm. Clear decisions.

Struggling Trader B: $5,000 account, risks 5% per trade = $250 risk
Result: Losing. Emotional. Bad decisions.

Same absolute risk ($250). Same account size pressure (relative to their account). But A is profitable, B is losing. Why?

A risked their capital once. B risked it TEN TIMES in their mind before taking the trade. B is emotionally exhausted before the trade even moves.

**The Psychology of Accountability:**

$1 at risk feels like: "This is fun"
$10 at risk feels like: "This is a trade"
$100 at risk feels like: "This is important"
$1,000 at risk feels like: "Oh god, what if I lose this?"

Your brain starts catastrophizing at $1,000. You can't think clearly. You make mistakes.

Professionals size positions so they can THINK. They size small enough that one loss doesn't hurt psychologically. Then they can follow their system.

**The Correct Sizing Framework:**

Week 1-2: $50-100 per trade (if your capital allows)
Week 3-4: $100-200 per trade
Week 5-8: $200-300 per trade
Week 9+: Scale based on account growth

This gives you a chance to build emotional resilience and prove your system works BEFORE you add pressure.

**The Mistake Most Traders Make:**

They start at their "right" size too soon. They think: "I should risk 2% = $200 on my $10,000 account." They take 2-3 losses in a row. They're down $600. They panic. They revenge trade. Spiral begins.

If they'd started at $100 per trade:
- Same 3 losses = $300 down
- Psychological pressure: Manageable
- They stay calm
- They follow system
- They get 3 wins
- Back to breakeven
- Confidence builds

**The Professional's Sizing Strategy:**

"I will start small, prove my system for 50 trades, THEN scale size based on win rate and psychology comfort level."

Not: "I'll risk the 'correct' amount immediately."

Your psychology is part of your trading system. Ignore it and your system fails.

**After You Understand Your Psychology:**

Most traders discover: "I become emotional at size X. I make mistakes at size Y. I'm in flow state at size Z."

Once you know your numbers, stay at size Z until you've built MORE psychological resilience. Then scale.

The traders who last 5+ years are the ones who sized small enough to survive 2-3 losing streaks without blowing up. That patience compounds.
      `,
    },
  ]

  const assessment = [
    {
      id: 1,
      question: 'Which of the four psychological enemies is most dangerous?',
      options: [
        'Fear - keeps you out of trades',
        'Greed - makes you overlever',
        'Revenge trading - causes spirals',
        'Overconfidence - feels like competence but breaks rules',
      ],
      answer: 'Overconfidence - feels like competence but breaks rules',
    },
    {
      id: 2,
      question: 'What is the primary purpose of a pre-trade checklist?',
      options: [
        'To slow down decision-making',
        'To remove emotion from entry decisions',
        'To make trading more complicated',
        'To increase trading frequency',
      ],
      answer: 'To remove emotion from entry decisions',
    },
    {
      id: 3,
      question: 'After a trading loss, what is the recommended next action?',
      options: [
        'Immediately take another trade to recover',
        'Wait 30 minutes minimum before trading again',
        'Review your system to find what was wrong',
        'Stop trading for the day',
      ],
      answer: 'Wait 30 minutes minimum before trading again',
    },
    {
      id: 4,
      question: 'How does position size affect your trading psychology?',
      options: [
        'Larger size = clearer thinking',
        'Size has no effect on psychology',
        'Smaller size = less emotional pressure = clearer thinking',
        'Position size only affects profit',
      ],
      answer: 'Smaller size = less emotional pressure = clearer thinking',
    },
    {
      id: 5,
      question: 'What is the relationship between discipline and motivation?',
      options: [
        'They are the same thing',
        'Motivation creates discipline',
        'Discipline is a system that works when motivation fades',
        'Neither is important in trading',
      ],
      answer: 'Discipline is a system that works when motivation fades',
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
            <Brain className="w-12 h-12 text-royal-emerald" />
            <h1 className="text-5xl font-bold text-white">Trading Psychology</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Master your mind. Master the markets. Understand the psychological patterns that
            separate professional traders from account blowups.
          </p>
          <p className="text-gray-400 mt-3">
            <strong>By J Supreme Trading Institute</strong> — Compiled from trading psychology
            research, professional trader observations, and behavioral economics
          </p>
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
                    <div className="prose prose-invert max-w-none">
                      <div className="text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                        {lesson.content}
                      </div>
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
            Test your understanding of trading psychology. Answer all questions honestly—this is for
            your learning, not grading.
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
              Your psychology determines your trading results more than your strategy.
            </li>
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">✓</span>
              The four enemies are Fear, Greed, Revenge Trading, and Overconfidence. Know them.
            </li>
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">✓</span>
              Discipline is a system (checklists, journaling, rules) not motivation (feelings).
            </li>
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">✓</span>
              Position size affects your thinking. Smaller size = clearer decisions.
            </li>
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">✓</span>
              After a loss, wait 30 minutes. After a win, don't change anything. Follow your system.
            </li>
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">✓</span>
              Your trade journal reveals your psychological patterns after 50 trades.
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
