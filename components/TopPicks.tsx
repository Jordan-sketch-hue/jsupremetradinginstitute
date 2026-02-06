'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Target, AlertCircle } from 'lucide-react'

interface TradingSetup {
  id: number
  symbol: string
  direction: 'LONG' | 'SHORT'
  entry: number
  target: number
  stopLoss: number
  timeframe: string
  confidence: number
  setup: string
  orderBlockLevel: number
  liquidityZone: string
  smartMoneySignal: string
}

const TOP_PICKS: TradingSetup[] = [
  {
    id: 1,
    symbol: 'EUR/USD',
    direction: 'LONG',
    entry: 1.0945,
    target: 1.105,
    stopLoss: 1.089,
    timeframe: '4H',
    confidence: 92,
    setup: 'Bullish Engulfing at Order Block',
    orderBlockLevel: 1.092,
    liquidityZone: '1.1020-1.1040',
    smartMoneySignal: 'Liquidity Sweep + Institutional Accumulation',
  },
  {
    id: 2,
    symbol: 'GBP/USD',
    direction: 'SHORT',
    entry: 1.278,
    target: 1.265,
    stopLoss: 1.285,
    timeframe: '1H',
    confidence: 88,
    setup: 'Bearish Rejection at Supply',
    orderBlockLevel: 1.281,
    liquidityZone: '1.2720-1.2740',
    smartMoneySignal: 'Break & Retest Pattern',
  },
  {
    id: 3,
    symbol: 'USD/JPY',
    direction: 'LONG',
    entry: 149.5,
    target: 151.2,
    stopLoss: 148.9,
    timeframe: 'Daily',
    confidence: 85,
    setup: 'Higher Low at Demand Zone',
    orderBlockLevel: 149.1,
    liquidityZone: '150.50-150.80',
    smartMoneySignal: 'Accumulation Phase',
  },
  {
    id: 4,
    symbol: 'XAU/USD',
    direction: 'SHORT',
    entry: 2140.0,
    target: 2090.0,
    stopLoss: 2165.0,
    timeframe: '4H',
    confidence: 81,
    setup: 'Lower High at Resistance',
    orderBlockLevel: 2155.0,
    liquidityZone: '2120.00-2135.00',
    smartMoneySignal: 'Distribution Pattern',
  },
  {
    id: 5,
    symbol: 'SPX500',
    direction: 'LONG',
    entry: 5215.0,
    target: 5350.0,
    stopLoss: 5100.0,
    timeframe: 'Daily',
    confidence: 87,
    setup: 'Breakout on Volume',
    orderBlockLevel: 5180.0,
    liquidityZone: '5280.00-5310.00',
    smartMoneySignal: 'Continuation Breakout',
  },
]

export default function TopPicks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400'
    if (confidence >= 80) return 'text-emerald-400'
    if (confidence >= 70) return 'text-yellow-400'
    return 'text-orange-400'
  }

  const getDirectionColor = (direction: 'LONG' | 'SHORT') => {
    return direction === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="py-12 px-4 bg-gradient-to-b from-matte-black via-matte-black to-royal-green/5"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={cardVariants} className="mb-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <TrendingUp className="w-8 h-8 text-accent-gold" />
            <h2 className="text-4xl font-bold text-white">Top Picks</h2>
            <Target className="w-8 h-8 text-royal-green" />
          </div>
          <p className="text-platinum/70 text-lg">
            AI-Analyzed Trading Setups Based on Smart Money Activity & Order Block Analysis
          </p>
        </motion.div>

        {/* Top Picks Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {TOP_PICKS.map(pick => (
            <motion.div
              key={pick.id}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className="group relative bg-gradient-to-br from-platinum/5 to-royal-green/5 border border-platinum/20 rounded-xl p-6 hover:border-royal-green/50 transition-all duration-300"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-royal-green/0 to-royal-green/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{pick.symbol}</h3>
                    <div className="flex gap-2 mb-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getDirectionColor(pick.direction)}`}
                      >
                        {pick.direction}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-semibold bg-platinum/10 text-platinum">
                        {pick.timeframe}
                      </span>
                    </div>
                  </div>
                  <div className={`text-right ${getConfidenceColor(pick.confidence)}`}>
                    <div className="text-2xl font-bold">{pick.confidence}%</div>
                    <div className="text-xs text-platinum/50">Confidence</div>
                  </div>
                </div>

                {/* Setup Description */}
                <p className="text-platinum/60 text-sm mb-4 pb-4 border-b border-platinum/20">
                  {pick.setup}
                </p>

                {/* Price Levels */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-platinum/60">Entry:</span>
                    <span className="text-accent-gold font-semibold">{pick.entry.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-platinum/60">Target:</span>
                    <span className="text-green-400 font-semibold">{pick.target.toFixed(4)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-platinum/60">Stop Loss:</span>
                    <span className="text-red-400 font-semibold">{pick.stopLoss.toFixed(4)}</span>
                  </div>
                </div>

                {/* Risk/Reward */}
                <div className="mb-4 pb-4 border-b border-platinum/20">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-platinum/60">R:R Ratio:</span>
                    <span className="text-royal-green font-semibold">
                      {`1:${(Math.abs(pick.target - pick.entry) / Math.abs(pick.entry - pick.stopLoss)).toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Smart Money Info */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-royal-green mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-platinum/50">Order Block:</p>
                      <p className="text-platinum/80 font-semibold">
                        {pick.orderBlockLevel.toFixed(4)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-accent-gold mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-platinum/50">Liquidity Zone:</p>
                      <p className="text-platinum/80 font-semibold">{pick.liquidityZone}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-platinum/20">
                    <p className="text-platinum/50 mb-1">Smart Money Signal:</p>
                    <p className="text-royal-green font-semibold">{pick.smartMoneySignal}</p>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-royal-green to-royal-emerald hover:from-royal-green/80 hover:to-royal-emerald/80 text-white text-sm font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                  View Full Analysis
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          variants={cardVariants}
          className="bg-royal-green/10 border border-royal-green/30 rounded-lg p-4 text-center"
        >
          <p className="text-platinum/60 text-sm">
            ⚠️ <span className="font-semibold">Disclaimer:</span> These picks are for educational
            purposes only. Past performance doesn't guarantee future results. Always manage risk and
            consult with a financial advisor.
          </p>
        </motion.div>
      </div>
    </motion.section>
  )
}
