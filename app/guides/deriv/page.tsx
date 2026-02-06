'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  Shield,
  TrendingUp,
  ExternalLink,
  CheckCircle,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react'

export default function DerivGuide() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const toggleStep = (step: number) => {
    setCompletedSteps(prev =>
      prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]
    )
  }

  const steps = [
    {
      title: 'Why Deriv for Demo Trading?',
      description: 'Understanding why Deriv is perfect for beginners and practice.',
      content: [
        '100% FREE demo account with $10,000 virtual money',
        'No credit card or deposit required - ever',
        'Real market prices and conditions (not simulated)',
        'Trade Forex, Commodities, Indices, and Crypto',
        'Same platform used by real traders worldwide',
        'Reset your demo balance anytime unlimited times',
        'Practice as long as you want - no time limit',
      ],
      tip: 'Demo trading lets you master your strategy without risking real money. Most successful traders spent months on demo before going live.',
      link: null,
    },
    {
      title: 'Create Your Free Deriv Account',
      description: 'Quick 2-minute signup process.',
      content: [
        'Go to Deriv.com',
        "Click 'Create free demo account'",
        'Enter your email address',
        'Choose a secure password',
        'Verify your email (check inbox/spam)',
        "You're in! No ID verification needed for demo",
        'You now have $10,000 virtual funds to practice',
      ],
      tip: "Use a real email you have access to. You'll need it to log in and receive platform updates.",
      link: 'https://deriv.com/',
    },
    {
      title: 'Choosing Your Trading Platform',
      description: "Deriv offers multiple platforms - here's which to use.",
      content: [
        'DTrader: Simple, beginner-friendly interface (Recommended for new traders)',
        'MT5 (MetaTrader 5): Advanced charting and analysis (Best for Order Block trading)',
        'DBot: Automated trading with bots (Advanced users only)',
        'SmartTrader: Classic trading interface',
        'For this course, we recommend: MT5 for analysis + DTrader for quick execution',
      ],
      tip: 'Start with DTrader to understand basics, then move to MT5 for serious technical analysis and our Order Block strategy.',
      link: null,
    },
    {
      title: 'Setting Up MT5 on Deriv',
      description: 'The professional platform for chart analysis.',
      content: [
        "From your Deriv dashboard, click 'MetaTrader 5'",
        "Click 'Add real account' (don't worry - it's still demo!)",
        "Select 'Financial' account type (for Forex pairs)",
        'Choose leverage: 1:100 or 1:500 (demo settings)',
        "Click 'Add account'",
        'Download MT5 platform for Windows/Mac or use Web Trader',
        'Login with the credentials shown on your screen',
      ],
      tip: 'MT5 gives you professional-grade charting similar to TradingView, plus the ability to execute trades directly!',
      link: 'https://deriv.com/dmt5',
    },
    {
      title: 'Navigating the DTrader Interface',
      description: 'Quick trades and simple execution.',
      content: [
        'Top: Asset selector (search EUR/USD, Gold, etc.)',
        'Center: Live price chart with current price',
        'Right sidebar: Trade parameters (stake, duration, trade type)',
        'Bottom: Your open positions and trade history',
        'Trade types: Rise/Fall, Higher/Lower, Touch/No Touch, etc.',
        "For our strategy: Use 'Rise/Fall' or 'Higher/Lower'",
      ],
      tip: "DTrader is perfect for quick trades when you've already done your analysis on TradingView or MT5.",
      link: null,
    },
    {
      title: 'Connecting Deriv with TradingView Analysis',
      description: 'The winning workflow for order block trading.',
      content: [
        'Step 1: Do your analysis on TradingView (find order blocks, structure, bias)',
        'Step 2: Mark your entry zones and confirm with RSI + ATR',
        'Step 3: Open Deriv MT5 or DTrader',
        'Step 4: Search for the same pair (e.g., EUR/USD)',
        'Step 5: Wait for price to reach your marked order block zone',
        'Step 6: Execute your trade with proper risk management',
        'Step 7: Set your stop loss and take profit levels',
      ],
      tip: 'TradingView for analysis, Deriv for execution. This is how professionals separate chart work from trading emotions!',
      link: null,
    },
    {
      title: 'Placing Your First Demo Trade',
      description: 'Step-by-step execution on DTrader.',
      content: [
        'Select your asset (e.g., EUR/USD from the top dropdown)',
        "Choose trade type: 'Rise' if bullish, 'Fall' if bearish",
        'Set your stake amount: Start small - $10-50 demo (1-5% of demo balance)',
        "Select duration: For swing trades use 'Multipliers' or MT5",
        'Review your trade details in the right panel',
        "Click 'Purchase' to execute",
        "Watch your trade in 'Open Positions' section below chart",
      ],
      tip: "Even on demo, treat every trade like real money. Build good habits early - they'll carry over to live trading!",
      link: null,
    },
    {
      title: 'Risk Management on Demo Account',
      description: 'Practice proper position sizing now!',
      content: [
        'Never risk more than 1-2% per trade (even on demo!)',
        'Example: $10,000 demo balance → Max $100-200 per trade',
        'Use ATR to set stop loss distance (as learned in course)',
        'Risk-Reward ratio: Aim for minimum 1:1.5 (better 1:2 or 1:3)',
        'Track every trade in a journal (Excel or notebook)',
        'Calculate position size before entering: Stake = Account × Risk% / Stop distance',
        "If you lose 20% of demo, reset and start fresh - don't revenge trade",
      ],
      tip: "Risk management is MORE important than your strategy. Perfect this on demo and you'll outperform 90% of traders!",
      link: null,
    },
    {
      title: 'Using MT5 for Order Block Analysis',
      description: "Professional charting on Deriv's MT5 platform.",
      content: [
        'Open MT5 (web or desktop client)',
        "Add symbols: Right-click 'Market Watch' → 'Symbols' → Select your pairs",
        'Open chart: Double-click symbol in Market Watch',
        'Change timeframe: Right-click chart or use toolbar (M15, H1, H4, D1)',
        'Add indicators: Insert → Indicators → Select RSI (14) and ATR (14)',
        'Draw order blocks: Use Rectangle tool from toolbar',
        'Save template: Right-click chart → Template → Save for reuse',
        'Place trades directly: Right-click chart → Trading → New Order',
      ],
      tip: "MT5 on Deriv combines analysis + execution in one platform. Master this and you won't need to switch between apps!",
      link: null,
    },
    {
      title: 'Tracking Your Demo Performance',
      description: 'Measure progress like a professional trader.',
      content: [
        "Deriv Reports: Access 'Reports' tab to see all trade history",
        'Export trades: Download CSV for detailed analysis',
        'Track these metrics: Win rate %, Average R:R, Max drawdown, Profit factor',
        'Keep a trading journal: Date, pair, setup, entry reason, outcome, lesson learned',
        "Review weekly: What worked? What didn't? What pattern do you see?",
        'Goal on demo: 60%+ win rate with 1:2 R:R over 50+ trades',
        'Once consistent for 3 months → Consider going live with small capital',
      ],
      tip: "Your demo stats predict your real trading results. If you can't profit on demo, you won't profit on live. Be honest with yourself!",
      link: null,
    },
    {
      title: 'Mobile Trading with Deriv',
      description: 'Trade and monitor on-the-go.',
      content: [
        "Download 'Deriv' app from App Store or Google Play",
        'Login with your account credentials',
        'Access DTrader mobile interface (simplified)',
        "MT5 mobile: Download separate 'MetaTrader 5' app",
        'Login to MT5 app using your Deriv MT5 account details',
        'Check positions and close trades remotely',
        'Receive notifications for margin calls or closed positions',
      ],
      tip: 'Mobile is great for monitoring, but avoid analyzing and entering trades on small screens. Do your homework on desktop!',
      link: null,
    },
    {
      title: 'When to Transition to Live Trading',
      description: "Signs you're ready for real money (and signs you're not).",
      content: [
        "Ready: You're profitable on demo for 3+ consecutive months",
        'Ready: You follow your trading plan without emotional decisions',
        'Ready: Your win rate is 55%+ with positive expectancy',
        'Ready: You can handle losses without revenge trading',
        'Ready: You understand risk management deeply',
        "Not ready: You're still learning order block identification",
        'Not ready: You trade impulsively or without a plan',
        "Not ready: You haven't tracked at least 50 demo trades",
        'Start live with SMALL capital: $100-500 max initially',
      ],
      tip: "Most traders go live too early and lose money. Stay on demo until you're consistently profitable. There's no rush - the market will still be there!",
      link: null,
    },
  ]

  const completionPercent = Math.round((completedSteps.length / steps.length) * 100)

  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-12 h-12 text-royal-emerald" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">Deriv Demo Account Guide</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Practice trading with $10,000 virtual money. Master your strategy risk-free before
            trading real capital.
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-royal-green/10 border border-royal-green/30 rounded-xl p-6 mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-white font-semibold">Your Progress</span>
            <span className="text-accent-gold font-bold">
              {completedSteps.length} / {steps.length}
            </span>
          </div>
          <div className="w-full bg-royal-green/20 h-3 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-r from-royal-emerald to-accent-gold h-full"
            />
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-accent-gold/10 border border-accent-gold/50 rounded-xl p-6 mb-8"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-accent-gold flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-accent-gold font-bold text-lg mb-2">
                Important: Demo Trading First!
              </h3>
              <p className="text-gray-300">
                This guide focuses on DEMO trading only. Never trade with real money until you've
                proven consistent profitability on demo for at least 3 months. Trading involves
                substantial risk of loss.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          <a
            href="https://deriv.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-4 bg-royal-emerald/20 border border-royal-emerald/50 rounded-lg hover:bg-royal-emerald/30 transition-all group"
          >
            <ExternalLink className="w-5 h-5 text-royal-emerald group-hover:scale-110 transition-transform" />
            <span className="text-white font-semibold">Create Demo Account</span>
          </a>
          <a
            href="https://deriv.com/dmt5"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-4 bg-accent-gold/20 border border-accent-gold/50 rounded-lg hover:bg-accent-gold/30 transition-all group"
          >
            <DollarSign className="w-5 h-5 text-accent-gold group-hover:scale-110 transition-transform" />
            <span className="text-white font-semibold">Get MT5 Platform</span>
          </a>
          <a
            href="https://deriv.com/help-centre"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-4 bg-purple-500/20 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 transition-all group"
          >
            <Shield className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-white font-semibold">Deriv Help Center</span>
          </a>
        </motion.div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index)
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`
                  bg-matte-black/50 border rounded-xl overflow-hidden transition-all
                  ${isCompleted ? 'border-royal-emerald/50 shadow-lg shadow-royal-emerald/20' : 'border-royal-green/30'}
                `}
              >
                <button
                  onClick={() => toggleStep(index)}
                  className="w-full p-6 text-left flex items-start justify-between gap-4 hover:bg-royal-green/5 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`
                      flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all
                      ${isCompleted ? 'bg-royal-emerald text-white' : 'bg-royal-green/20 text-royal-emerald'}
                    `}
                    >
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> : index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-400">{step.description}</p>
                    </div>
                  </div>
                  <ChevronRight
                    className={`w-6 h-6 text-gray-400 flex-shrink-0 transition-transform ${isCompleted ? 'rotate-90' : ''}`}
                  />
                </button>

                {isCompleted && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-6"
                  >
                    <div className="pl-14">
                      <div className="bg-royal-green/10 border border-royal-green/30 rounded-lg p-4 mb-4">
                        <ul className="space-y-2">
                          {step.content.map((item, i) => (
                            <li key={i} className="text-gray-300 flex items-start gap-2">
                              <ChevronRight className="w-5 h-5 text-royal-emerald flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {step.tip && (
                        <div className="bg-accent-gold/10 border border-accent-gold/30 rounded-lg p-4">
                          <div className="flex items-start gap-2">
                            <Shield className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-accent-gold font-semibold mb-1">Pro Tip:</div>
                              <div className="text-gray-300">{step.tip}</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-br from-royal-green/20 to-royal-emerald/20 border border-royal-green/50 rounded-xl p-8 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Apply Your Knowledge?</h3>
          <p className="text-gray-300 mb-6">
            You've set up TradingView for analysis and Deriv for execution. Now it's time to
            practice the Order Block Doctrine on real charts!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/learning-path"
              className="px-6 py-3 bg-gradient-to-r from-royal-emerald to-accent-gold text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-royal-emerald/50 transition-all"
            >
              Start Learning Curriculum →
            </a>
            <a
              href="/dashboard"
              className="px-6 py-3 border-2 border-royal-green text-royal-emerald font-semibold rounded-lg hover:bg-royal-green/20 transition-all"
            >
              Practice on Dashboard
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
