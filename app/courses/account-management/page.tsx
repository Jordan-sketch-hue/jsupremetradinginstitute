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
  const [selectedStrategy, setSelectedStrategy] = useState<
    'conservative' | 'moderate' | 'aggressive'
  >('moderate')

  const strategies = {
    conservative: {
      risk: '0.5% - 1%',
      maxDrawdown: '10%',
      frequency: '1-2 trades/week',
      description:
        'Perfect for beginners and capital preservation. Slow, steady growth with minimal risk exposure.',
      pros: ['Low stress', 'Capital protection', 'Sustainable long-term', 'Ideal for learning'],
      cons: ['Slower growth', 'Requires patience', 'Lower profit potential'],
      example: '$10,000 account → Risk $50-100 per trade → Monthly target: 5-8%',
    },
    moderate: {
      risk: '1% - 2%',
      maxDrawdown: '20%',
      frequency: '3-5 trades/week',
      description:
        'Balanced approach for experienced traders. Combines growth potential with controlled risk.',
      pros: ['Balanced risk/reward', 'Steady growth', 'Flexible approach', 'Industry standard'],
      cons: ['Requires discipline', 'Moderate drawdown tolerance needed'],
      example: '$10,000 account → Risk $100-200 per trade → Monthly target: 10-15%',
    },
    aggressive: {
      risk: '2% - 5%',
      maxDrawdown: '30%',
      frequency: '5-10+ trades/week',
      description:
        'For expert traders only. High risk, high reward. Requires exceptional emotional control and experience.',
      pros: ['High profit potential', 'Fast account growth', 'Multiple opportunities'],
      cons: [
        'High stress',
        'Large drawdowns',
        'Emotional discipline required',
        'Not for beginners',
      ],
      example: '$10,000 account → Risk $200-500 per trade → Monthly target: 20-40% (or -30%)',
    },
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
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            The #1 reason traders fail: Poor risk management. Master these principles and you'll
            outlast 90% of traders.
          </p>
        </motion.div>

        {/* The Golden Rule */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-accent-gold/20 to-accent-gold/10 border border-accent-gold/50 rounded-2xl p-8 mb-12"
        >
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-12 h-12 text-accent-gold flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">The Golden Rule of Trading</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-4">
                Never risk more than 1-2% of your account on a single trade. This rule has kept
                professional traders in the game for decades. Even with a 50% win rate, you'll
                survive losing streaks and compound profits over time.
              </p>
              <p className="text-accent-gold font-semibold">
                Risk management isn't about maximizing profit — it's about minimizing catastrophic
                loss.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Strategy Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Choose Your Risk Profile
          </h2>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {Object.entries(strategies).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setSelectedStrategy(key as any)}
                className={`
                  p-6 rounded-xl border-2 transition-all
                  ${
                    selectedStrategy === key
                      ? 'bg-royal-emerald/30 border-royal-emerald shadow-lg shadow-royal-emerald/30'
                      : 'bg-royal-green/10 border-royal-green/30 hover:border-royal-green/60'
                  }
                `}
              >
                <h3 className="text-xl font-bold text-white mb-2 capitalize">{key}</h3>
                <div className="text-accent-gold font-bold text-2xl mb-2">{value.risk}</div>
                <div className="text-gray-400 text-sm">per trade</div>
              </button>
            ))}
          </div>

          {/* Selected Strategy Details */}
          <motion.div
            key={selectedStrategy}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-matte-black/50 border border-royal-green/30 rounded-2xl p-8"
          >
            <h3 className="text-2xl font-bold text-white mb-4 capitalize">
              {selectedStrategy} Strategy
            </h3>
            <p className="text-gray-300 mb-6">{strategies[selectedStrategy].description}</p>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-royal-green/10 border border-royal-green/30 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Risk Per Trade</div>
                <div className="text-white font-bold text-xl">
                  {strategies[selectedStrategy].risk}
                </div>
              </div>
              <div className="bg-royal-green/10 border border-royal-green/30 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Max Drawdown</div>
                <div className="text-white font-bold text-xl">
                  {strategies[selectedStrategy].maxDrawdown}
                </div>
              </div>
              <div className="bg-royal-green/10 border border-royal-green/30 rounded-lg p-4">
                <div className="text-gray-400 text-sm mb-1">Trade Frequency</div>
                <div className="text-white font-bold text-xl">
                  {strategies[selectedStrategy].frequency}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-lg font-semibold text-green-400 mb-3">Advantages</h4>
                <ul className="space-y-2">
                  {strategies[selectedStrategy].pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-red-400 mb-3">Disadvantages</h4>
                <ul className="space-y-2">
                  {strategies[selectedStrategy].cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-300">
                      <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-accent-gold/10 border border-accent-gold/30 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Target className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-accent-gold font-semibold mb-1">Example:</div>
                  <div className="text-gray-300">{strategies[selectedStrategy].example}</div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Position Sizing Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-royal-green/20 to-royal-emerald/20 border border-royal-green/50 rounded-2xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Position Sizing Formula</h2>
          <div className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6 mb-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-4">
                Position Size = (Account Balance × Risk %) ÷ Stop Distance
              </div>
              <div className="text-gray-400">
                This is the most important formula in trading. Memorize it.
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-royal-green/10 border border-royal-green/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Example 1: Conservative ($10,000 account)
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Account Balance: $10,000</li>
                <li>• Risk: 1% = $100</li>
                <li>• Stop Distance: 50 pips (0.0050)</li>
                <li>• Position Size: $100 ÷ 0.0050 = $20,000 notional (0.2 lots on EUR/USD)</li>
                <li className="text-accent-gold font-semibold">
                  → If stopped out: You lose $100 (1% of account)
                </li>
              </ul>
            </div>

            <div className="bg-royal-green/10 border border-royal-green/30 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">
                Example 2: Moderate ($10,000 account)
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Account Balance: $10,000</li>
                <li>• Risk: 2% = $200</li>
                <li>• Stop Distance: 30 pips (0.0030)</li>
                <li>• Position Size: $200 ÷ 0.0030 = $66,667 notional (0.66 lots on EUR/USD)</li>
                <li className="text-accent-gold font-semibold">
                  → If stopped out: You lose $200 (2% of account)
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Drawdown Management */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Understanding Drawdown</h2>
          <p className="text-gray-400 mb-8">
            Drawdown is the peak-to-trough decline during a losing streak. Managing drawdown
            separates professionals from amateurs.
          </p>

          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 mb-6">
            <h3 className="text-2xl font-bold text-red-400 mb-4">
              The Math of Drawdown (Why It Matters)
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="text-lg font-semibold text-white mb-2">If you lose 10%...</div>
                <div className="text-gray-300">You need +11.1% to break even</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-white mb-2">If you lose 20%...</div>
                <div className="text-gray-300">You need +25% to break even</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-white mb-2">If you lose 30%...</div>
                <div className="text-gray-300">You need +42.9% to break even</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-white mb-2">If you lose 50%...</div>
                <div className="text-gray-300 font-bold text-red-400">
                  You need +100% to break even!
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
              <p className="text-white font-semibold">
                This is why never risking more than 1-2% per trade is NON-NEGOTIABLE. Large
                drawdowns are mathematically devastating.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Daily/Weekly Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-matte-black/50 border border-royal-green/30 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Daily & Weekly Loss Limits</h2>
          <p className="text-gray-400 mb-6">
            Even with proper per-trade risk, emotional trading can lead to revenge trading and
            account blowup. Set hard limits:
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-royal-green/10 border border-royal-green/30 rounded-lg p-6">
              <Clock className="w-10 h-10 text-royal-emerald mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Daily Loss Limit</h3>
              <div className="text-accent-gold font-bold text-2xl mb-2">-3% to -5%</div>
              <p className="text-gray-300 text-sm">
                If you lose this in one day, STOP trading. Close platform. Go outside. Come back
                tomorrow with a clear head.
              </p>
            </div>

            <div className="bg-royal-green/10 border border-royal-green/30 rounded-lg p-6">
              <Zap className="w-10 h-10 text-accent-gold mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Weekly Loss Limit</h3>
              <div className="text-accent-gold font-bold text-2xl mb-2">-10%</div>
              <p className="text-gray-300 text-sm">
                If you hit -10% in a week, take a 5-7 day break. Review your trades, identify
                mistakes, adjust strategy, and return refreshed.
              </p>
            </div>
          </div>

          <div className="mt-6 bg-accent-gold/10 border border-accent-gold/30 rounded-lg p-6">
            <p className="text-white font-semibold">
              Pro Tip: The best traders know when NOT to trade. Protecting your capital during
              drawdowns is as important as growing it during winning streaks.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
