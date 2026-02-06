'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  DollarSign,
  Zap,
  Clock,
  AlertTriangle,
  Target,
  ArrowUp,
  RefreshCw,
} from 'lucide-react'

export default function ScalingVsFlippingPage() {
  const [selectedApproach, setSelectedApproach] = useState<'scaling' | 'flipping'>('scaling')
  const [assessmentAnswers, setAssessmentAnswers] = useState<Record<number, string>>({})

  const approaches = {
    scaling: {
      icon: TrendingUp,
      title: 'Scaling (The Professional Approach)',
      color: 'from-green-500 to-emerald-600',
      philosophy:
        'Make consistent 5-15% monthly gains. Let compound interest work. Reach financial freedom in 3-5 years.',
      core: [
        'Risk 1-2% per trade',
        'Build consistent winning streak',
        'Reinvest profits into larger positions',
        'Maintain emotional discipline',
        'Account grows exponentially over time',
      ],
      timeline: {
        month1: '$10,000 → $11,000 (+10%)',
        month3: '$10,000 → $13,300 (+33%)',
        month6: '$10,000 → $17,700 (+77%)',
        year1: '$10,000 → $31,400 (+214%)',
        year2: '$31,400 → $98,800 (+214%)',
        year3: '$98,800 → $310,000+ (+214%)',
      },
      tradeExample: `
Entry: EUR/USD at 1.0900
Risk per trade: 1% of $10,000 = $100
Stop: 1.0880 (20 pips)
Target: 1.0950 (50 pips)
Risk/Reward: 1:2.5

If win: +$250 profit
If lose: -$100 loss

Take 10 similar trades over month: 6 wins, 4 losses
Result: (6 × $250) - (4 × $100) = $1,500 - $400 = +$1,100 = +11% month

Next month, position size scales up because account is now $11,100.
      `,
      mindset:
        'The long game. I am building generational wealth. I care more about consistency than getting rich quick. I follow my system even when boring. I let compounding work.',
      pros: [
        '✓ Sustainable indefinitely',
        '✓ Low stress and emotional pressure',
        '✓ Statistically proven to work',
        '✓ Can be done part-time while working',
        '✓ Scales to professional management',
      ],
      cons: [
        '✗ Takes 2-3 years to see serious results',
        '✗ Requires patience (boring for many)',
        '✗ Needs strong discipline',
        '✗ One major mistake can set you back months',
      ],
      realisticMonthly: '5-15% (Conservative: 5-8%, Moderate: 10-12%, Aggressive: 12-15%)',
      riskOfBlowout: 'Very Low - Only happens if you completely abandon system',
      idealFor: 'Anyone serious about trading. People with jobs. Long-term thinkers.',
    },
    flipping: {
      icon: Zap,
      title: "Flipping (The Gambler's Approach)",
      color: 'from-red-500 to-orange-600',
      philosophy:
        'Make 50%+ monthly gains quickly. "Get rich fast." Risk big, reward big. Blow out within 6-12 months.',
      core: [
        'Risk 5-10% per trade (or more)',
        'Hope for big wins to compensate',
        'Use high leverage',
        'Take any trade that "feels right"',
        'Account either explodes up or implodes down',
      ],
      timeline: {
        month1: '$10,000 → $15,000 (+50%)',
        month2: '$15,000 → $20,000 (+33%)',
        month3: '$20,000 → Loss streak → $8,000 (-60%)',
        month4: 'Revenge trade → $2,000 (-75%)',
        month5: 'Account blown (-80%)',
      },
      tradeExample: `
Entry: EUR/USD at 1.0900
Risk per trade: 5% of $10,000 = $500
Stop: 1.0880 (20 pips)
Target: 1.0950 (50 pips)
Risk/Reward: 1:2.5

If win: +$1,250 profit
If lose: -$500 loss

Take 10 similar trades over month: 6 wins, 4 losses
Result: (6 × $1,250) - (4 × $500) = $7,500 - $2,000 = +$5,500 = +55% month

Sounds great! But...

Month 2: Same system, but 4 wins, 6 losses (variance happens)
Result: (4 × $1,250) - (6 × $500) = $5,000 - $3,000 = +$2,000 = +12% month
Account: $17,500

Month 3: Losing streak, 3 wins, 7 losses
Result: (3 × $1,250) - (7 × $500) = $3,750 - $3,500 = +$250 = +1% month
Account: $17,750

Month 4: Really bad luck, 2 wins, 8 losses
Result: (2 × $1,250) - (8 × $500) = $2,500 - $4,000 = -$1,500 = -8% month
Account: $16,250

Month 5: Frustrated, revenge trades, takes worse setups
3 wins, 7 losses, but risking 10% now
Result: (3 × $2,500) - (7 × $1,000) = $7,500 - $7,000 = +$500 month
Account: $16,750

Month 6: Desperate now, blows account

Final: Started $10,000 → Ended $3,000. Account lost -70%.
      `,
      mindset:
        "I need money NOW. I can't wait years. I'm special—my system works different. I just need one big win. If I lose, I'll make it back next month.",
      pros: [
        '✓ Fast early gains (month 1-2)',
        '✓ Exciting and ego-boosting',
        '✓ Feels like you\'re "winning"',
      ],
      cons: [
        '✗ Mathematically unsustainable',
        '✗ One losing streak destroys you',
        '✗ High stress = poor decisions',
        '✗ Turns into revenge trading quickly',
        '✗ 95% of flippers blow out within 12 months',
        '✗ Account rarely survives beyond month 6',
      ],
      realisticMonthly:
        '+30-50% for 1-2 months, then -50% to -80% as variance hits. Account blowout inevitable.',
      riskOfBlowout: 'Very High - Guaranteed within 12 months for most',
      idealFor: 'No one. This approach is a scam you sell to yourself.',
    },
  }

  const assessment = [
    {
      id: 1,
      question: 'Scaling primarily focuses on which outcome?',
      options: [
        'Fast growth with high risk',
        'Sustainable growth with controlled risk',
        'Random returns',
        'Maximum leverage',
      ],
      answer: 'Sustainable growth with controlled risk',
    },
    {
      id: 2,
      question: 'Typical risk per trade for scaling is:',
      options: ['1% - 2%', '5% - 10%', '20%+', 'Depends on emotions'],
      answer: '1% - 2%',
    },
    {
      id: 3,
      question: 'Why does flipping often fail?',
      options: [
        'Too much patience',
        'Extreme drawdowns from oversized risk',
        'Too many rules',
        'Low leverage',
      ],
      answer: 'Extreme drawdowns from oversized risk',
    },
    {
      id: 4,
      question: 'Scaling relies on which core principle?',
      options: ['All-in trades', 'Compounding over time', 'Random entries', 'No stop losses'],
      answer: 'Compounding over time',
    },
    {
      id: 5,
      question: 'At 10% monthly return, $10,000 grows to approximately how much in 1 year?',
      options: ['$15,000', '$25,900', '$31,400', '$50,000'],
      answer: '$31,400',
    },
  ]

  const current = approaches[selectedApproach]
  const Icon = current.icon

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
            <ArrowUp className="w-12 h-12 text-royal-emerald" />
            <h1 className="text-5xl font-bold text-white">Scaling vs Flipping</h1>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Two approaches to account growth. One works. One destroys accounts.
          </p>
          <p className="text-gray-400 mt-3">
            <strong>By J Supreme Trading Institute</strong> — Research-backed comparison of
            professional trader approaches vs. amateur gambler psychology
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center gap-4 mb-12"
        >
          <button
            onClick={() => setSelectedApproach('scaling')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              selectedApproach === 'scaling'
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'bg-white/5 border border-gray-600 text-gray-300 hover:border-white'
            }`}
          >
            Scaling (Professional)
          </button>
          <button
            onClick={() => setSelectedApproach('flipping')}
            className={`px-8 py-3 rounded-lg font-semibold transition-all ${
              selectedApproach === 'flipping'
                ? 'bg-gradient-to-r from-red-500 to-orange-600 text-white shadow-lg'
                : 'bg-white/5 border border-gray-600 text-gray-300 hover:border-white'
            }`}
          >
            Flipping (Gambler)
          </button>
        </motion.div>

        {/* Main Content */}
        <motion.div
          key={selectedApproach}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`bg-gradient-to-br ${current.color} bg-opacity-10 border border-current rounded-2xl p-8 mb-12`}
        >
          <div className="flex items-center gap-4 mb-6">
            <Icon className="w-12 h-12 text-current" />
            <h2 className="text-4xl font-bold text-white">{current.title}</h2>
          </div>

          <p className="text-xl text-gray-200 mb-6">{current.philosophy}</p>

          {/* Core Principles */}
          <div className="bg-black/30 rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4">Core Principles:</h3>
            <ul className="space-y-2">
              {current.core.map((principle, idx) => (
                <li key={idx} className="flex gap-3 text-gray-300">
                  <span className="text-current font-bold">•</span>
                  {principle}
                </li>
              ))}
            </ul>
          </div>

          {/* Timeline */}
          <div className="bg-black/30 rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4">
              Growth Timeline (Starting $10,000):
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(current.timeline).map(([period, value]) => (
                <div key={period} className="border border-current/30 rounded-lg p-3">
                  <div className="text-sm font-semibold text-gray-400">{period}</div>
                  <div className="text-lg text-white font-bold">{value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Example */}
          <div className="bg-black/30 rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold text-white mb-4">Example Trade Breakdown:</h3>
            <div className="text-gray-300 whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {current.tradeExample}
            </div>
          </div>

          {/* Mindset */}
          <div className="bg-current/20 border border-current/30 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-white mb-2">The Mindset:</h3>
            <p className="text-gray-200 italic">"{current.mindset}"</p>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Realistic Monthly Return</div>
              <div className="text-2xl font-bold text-white">{current.realisticMonthly}</div>
            </div>
            <div className="bg-black/30 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Risk of Account Blowout</div>
              <div className="text-2xl font-bold text-white">{current.riskOfBlowout}</div>
            </div>
            <div className="md:col-span-2 bg-black/30 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Ideal For</div>
              <div className="text-xl font-bold text-white">{current.idealFor}</div>
            </div>
          </div>

          {/* Pros & Cons */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-bold text-green-400 mb-3">Advantages:</h4>
              <ul className="space-y-2">
                {current.pros.map((pro, idx) => (
                  <li key={idx} className="text-gray-300 text-sm">
                    {pro}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold text-red-400 mb-3">Disadvantages:</h4>
              <ul className="space-y-2">
                {current.cons.map((con, idx) => (
                  <li key={idx} className="text-gray-300 text-sm">
                    {con}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-royal-green/30 rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Side-by-Side Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-royal-green/30">
                  <th className="text-left py-3 px-4 text-gray-300 font-semibold">Factor</th>
                  <th className="text-left py-3 px-4 text-green-400 font-semibold">Scaling</th>
                  <th className="text-left py-3 px-4 text-red-400 font-semibold">Flipping</th>
                </tr>
              </thead>
              <tbody className="space-y-2">
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4 text-gray-300">Risk per Trade</td>
                  <td className="py-3 px-4 text-green-300">1-2%</td>
                  <td className="py-3 px-4 text-red-300">5-10%+</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4 text-gray-300">Monthly Target</td>
                  <td className="py-3 px-4 text-green-300">5-15%</td>
                  <td className="py-3 px-4 text-red-300">50%+</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4 text-gray-300">Time to $100k</td>
                  <td className="py-3 px-4 text-green-300">2-3 years</td>
                  <td className="py-3 px-4 text-red-300">Account blown in 3-12 months</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4 text-gray-300">Stress Level</td>
                  <td className="py-3 px-4 text-green-300">Low</td>
                  <td className="py-3 px-4 text-red-300">Extremely High</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4 text-gray-300">Emotional Control Needed</td>
                  <td className="py-3 px-4 text-green-300">Moderate</td>
                  <td className="py-3 px-4 text-red-300">Superhuman</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4 text-gray-300">Success Rate</td>
                  <td className="py-3 px-4 text-green-300">80%+ (with discipline)</td>
                  <td className="py-3 px-4 text-red-300">5% (blowout rate: 95%)</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-3 px-4 text-gray-300">Can Work Part-Time</td>
                  <td className="py-3 px-4 text-green-300">Yes</td>
                  <td className="py-3 px-4 text-red-300">No (requires constant trading)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-gray-300">Used by Professionals</td>
                  <td className="py-3 px-4 text-green-300">Yes (100%)</td>
                  <td className="py-3 px-4 text-red-300">No</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* The Verdict */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-accent-gold/20 to-royal-green/20 border border-accent-gold/50 rounded-2xl p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">The Verdict</h2>
          <p className="text-gray-200 mb-4 text-lg leading-relaxed">
            Scaling is not sexy. It doesn't make for good YouTube videos. "I grew my account 10%
            this month" doesn't go viral. But it works. Scaling is how professionals build wealth.
            Flipping is how amateurs blow accounts.
          </p>
          <p className="text-gray-200 mb-4 text-lg leading-relaxed">
            The math is simple: If you risk 1-2% per trade with a 55% win rate, you will be
            profitable. Not maybe. Will be. Compounding does the rest. In 3 years, your account will
            be 30-50x larger (assuming 10-15% monthly average).
          </p>
          <p className="text-gray-200 text-lg leading-relaxed">
            If you flip and risk 5-10%, you'll have two choices within 12 months: Quit trading (if
            you still have money), or blow it all (if you don't). The only people who make money
            flipping are the ones selling the flipping course.
          </p>
          <p className="text-accent-gold font-semibold mt-6 text-lg">
            Your choice: Be millionaire in 3 years (scaling), or be broke in 1 year (flipping).
          </p>
        </motion.div>

        {/* Assessment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-royal-green/10 to-royal-emerald/5 border border-royal-green/30 rounded-2xl p-8 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-royal-emerald" />
            <h2 className="text-3xl font-bold text-white">Assessment Quiz</h2>
          </div>

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

        {/* Action Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-royal-green/30 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Your Action Plan</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-royal-green text-white rounded-full flex items-center justify-center font-bold">
                1
              </div>
              <div>
                <p className="text-white font-semibold">Commit to Scaling Mindset</p>
                <p className="text-gray-300 text-sm">
                  Accept that 10-15% monthly (120-180% annually) is the target, not 50%+.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-royal-green text-white rounded-full flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <p className="text-white font-semibold">Risk Only 1-2% Per Trade</p>
                <p className="text-gray-300 text-sm">
                  Calculate position size based on account size and stop distance. Never exceed 2%.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-royal-green text-white rounded-full flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <p className="text-white font-semibold">Journal Every Trade</p>
                <p className="text-gray-300 text-sm">
                  Track wins/losses. After 50 trades, calculate actual win rate and adjust system if
                  needed.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-royal-green text-white rounded-full flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <p className="text-white font-semibold">Reinvest Profits</p>
                <p className="text-gray-300 text-sm">
                  Don't withdraw gains. Let them compound. This is how $10k becomes $310k.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 bg-royal-green text-white rounded-full flex items-center justify-center font-bold">
                5
              </div>
              <div>
                <p className="text-white font-semibold">Never Flip</p>
                <p className="text-gray-300 text-sm">
                  Even when you're bored, even when friends tell you to "be aggressive"—stick to
                  scaling.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
