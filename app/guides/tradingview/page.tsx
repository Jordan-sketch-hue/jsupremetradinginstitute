'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  BookOpen,
  ExternalLink,
  PlayCircle,
  CheckCircle,
  ChevronRight,
  Download,
  Smartphone,
} from 'lucide-react'

export default function TradingViewGuide() {
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const toggleStep = (step: number) => {
    setCompletedSteps(prev =>
      prev.includes(step) ? prev.filter(s => s !== step) : [...prev, step]
    )
  }

  const steps = [
    {
      title: 'Create Your Free TradingView Account',
      description: 'TradingView offers powerful free charting tools that rival paid platforms.',
      content: [
        'Go to TradingView.com',
        "Click 'Get started — it's free' or 'Sign up'",
        'Choose sign-up method (email, Google, Apple, etc.)',
        'Verify your email address',
        'You now have access to FREE professional charts!',
      ],
      tip: 'Free account includes: Real-time data for major pairs, all chart types, 3 indicators per chart, custom alerts, and mobile app access.',
      link: 'https://www.tradingview.com/',
    },
    {
      title: 'Understanding the TradingView Interface',
      description: 'Navigate like a pro trader from day one.',
      content: [
        'Top Bar: Search for any asset (EUR/USD, XAU/USD, BTCUSD, etc.)',
        'Left Sidebar: Drawing tools (trendlines, rectangles, etc.)',
        'Bottom: Timeframe selector (1m, 5m, 15m, 1H, 4H, D, W)',
        'Right Sidebar: Watchlist, news, and ideas',
        'Chart: Your main workspace for technical analysis',
      ],
      tip: "Press '/' to quickly search for any symbol. Use 'Alt + Click' to stay in drawing mode.",
    },
    {
      title: 'Setting Up Your Chart Layout',
      description: 'Configure your workspace for order block trading.',
      content: [
        'Click the timeframe dropdown and select your preferred timeframe (start with 15m or 1H)',
        "Right-click chart → 'Chart settings' to adjust colors/style",
        'Change to Candles if not already selected',
        'Set dark theme: Top-right sun/moon icon',
        'Adjust your preferred color scheme (Settings → Appearance)',
      ],
      tip: 'Our recommendation: Dark theme, green/red candles, clean background. This reduces eye strain during long analysis sessions.',
    },
    {
      title: 'Adding Essential Free Indicators',
      description: 'You get 3 indicators on free plan - choose wisely!',
      content: [
        "Click 'Indicators' button at top (or press /)",
        "Search and add 'RSI' (Relative Strength Index) - set to 14 periods",
        "Search and add 'ATR' (Average True Range) - set to 14 periods",
        "Optional 3rd: 'Volume' or 'Moving Average' (50 or 200 EMA)",
        'These align perfectly with the Royal Flow Doctrine strategy!',
      ],
      tip: 'RSI + ATR are your confirmation tools. RSI shows momentum, ATR shows volatility for proper risk management.',
    },
    {
      title: 'Drawing Order Blocks on TradingView',
      description: 'Mark institutional zones where smart money operates.',
      content: [
        "Select 'Rectangle' tool from left sidebar (or press Ctrl/Cmd + R)",
        'Identify a bearish candle BEFORE a strong bullish move (Bullish OB)',
        'Draw rectangle from candle high to candle low',
        "Right-click rectangle → 'Settings' → Change color to green with transparency",
        "Add label: Right-click → 'Add note' → Type 'Bullish OB - Unmitigated'",
        'Repeat for Bearish OBs (bullish candle before strong drop) in red',
      ],
      tip: 'Use Ctrl/Cmd + D to duplicate rectangles. This speeds up your analysis workflow significantly.',
    },
    {
      title: 'Setting Up Your Watchlist',
      description: "Track the major pairs and assets you'll be trading.",
      content: [
        "Open right sidebar → 'Watchlist' tab",
        "Click '+' to create new list: Name it 'Major Forex'",
        'Add symbols: EURUSD, GBPUSD, USDJPY, AUDUSD, USDCHF',
        "Create another list: 'Commodities' → XAUUSD, XAGUSD, USOIL",
        "Create 'Indices': US500, US30, NAS100",
        'You can click any symbol to instantly load its chart',
      ],
      tip: 'Right-click watchlist symbols for quick timeframe changes and alerts without changing your main chart.',
    },
    {
      title: 'Creating Free Price Alerts',
      description: 'Get notified when price reaches your key levels.',
      content: [
        'Right-click on chart at your desired price level',
        "Select 'Add alert'",
        "Set condition: 'Crossing' or 'Crossing up/down'",
        "Name your alert: e.g., 'EURUSD - Bullish OB Touch'",
        'Choose notification method: App, Email, Popup',
        'Free users get limited alerts - use them for your best setups!',
      ],
      tip: "Set alerts at your Order Block zones. You don't need to watch charts 24/7 - let TradingView notify you!",
    },
    {
      title: 'Using Multi-Timeframe Analysis',
      description: 'See the big picture and the details simultaneously.',
      content: [
        'Open your main timeframe (e.g., 15m chart)',
        "Top bar → Click '+' to add another chart panel",
        'Set second panel to Higher Timeframe (e.g., 1H or 4H)',
        'Now you can see structure on HTF while timing entries on LTF',
        'Use this to confirm your bias matches across timeframes',
      ],
      tip: 'Free users get 2 charts side-by-side. Use your Lower Timeframe (LTF) for entries and Higher Timeframe (HTF) for bias.',
    },
    {
      title: 'Mobile App Setup (iOS & Android)',
      description: 'Take your analysis everywhere - completely free!',
      content: [
        "Download 'TradingView' from App Store or Google Play",
        'Log in with your free account credentials',
        'Access ALL your charts, watchlists, and alerts on mobile',
        'Swipe between timeframes easily',
        'Get push notifications for your alerts',
        'Draw and analyze on-the-go with touch gestures',
      ],
      tip: 'Mobile app is perfect for monitoring trades while away from your desk. All settings sync automatically!',
    },
    {
      title: 'Pro Tips for Free Users',
      description: 'Maximize your TradingView experience without paying.',
      content: [
        'Use different browser tabs for multiple charts (workaround for layout limits)',
        'Screenshot your marked charts and save locally for future reference',
        'Join TradingView Public Chats to discuss ideas (Community → Chat)',
        'Follow top traders and learn from their published ideas',
        "Use the 'Replay' mode (bar replay) to practice historical analysis",
        'Clear cache regularly for smooth performance',
      ],
      tip: "TradingView's free plan is genuinely powerful. Many professional traders use it without upgrading!",
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
            <BookOpen className="w-12 h-12 text-royal-emerald" />
            <h1 className="text-4xl md:text-5xl font-bold text-white">TradingView Setup Guide</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Master the #1 free charting platform used by millions of traders worldwide. Perfect for
            order block analysis and institutional trading.
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

        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-4 mb-12"
        >
          <a
            href="https://www.tradingview.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-4 bg-royal-emerald/20 border border-royal-emerald/50 rounded-lg hover:bg-royal-emerald/30 transition-all group"
          >
            <ExternalLink className="w-5 h-5 text-royal-emerald group-hover:scale-110 transition-transform" />
            <span className="text-white font-semibold">Go to TradingView</span>
          </a>
          <a
            href="https://www.tradingview.com/support/solutions/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-4 bg-accent-gold/20 border border-accent-gold/50 rounded-lg hover:bg-accent-gold/30 transition-all group"
          >
            <BookOpen className="w-5 h-5 text-accent-gold group-hover:scale-110 transition-transform" />
            <span className="text-white font-semibold">Official Help Center</span>
          </a>
          <a
            href="https://www.tradingview.com/gopro/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-4 bg-purple-500/20 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 transition-all group"
          >
            <Smartphone className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            <span className="text-white font-semibold">Download Mobile App</span>
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
                        <ol className="space-y-2">
                          {step.content.map((item, i) => (
                            <li key={i} className="text-gray-300 flex items-start gap-2">
                              <ChevronRight className="w-5 h-5 text-royal-emerald flex-shrink-0 mt-0.5" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {step.tip && (
                        <div className="bg-accent-gold/10 border border-accent-gold/30 rounded-lg p-4 mb-4">
                          <div className="flex items-start gap-2">
                            <PlayCircle className="w-5 h-5 text-accent-gold flex-shrink-0 mt-0.5" />
                            <div>
                              <div className="text-accent-gold font-semibold mb-1">Pro Tip:</div>
                              <div className="text-gray-300">{step.tip}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {step.link && (
                        <a
                          href={step.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-2 bg-royal-emerald/20 border border-royal-emerald/50 rounded-lg text-royal-emerald hover:bg-royal-emerald/30 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                          <span>Open TradingView</span>
                        </a>
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
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Start Trading?</h3>
          <p className="text-gray-300 mb-6">
            Now that you've set up TradingView, it's time to open a demo trading account and
            practice your skills risk-free!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/guides/deriv"
              className="px-6 py-3 bg-gradient-to-r from-royal-emerald to-accent-gold text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-royal-emerald/50 transition-all"
            >
              Next: Setup Deriv Demo Account →
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
