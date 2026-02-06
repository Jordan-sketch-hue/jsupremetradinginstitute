'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  BarChart3,
  Target,
  Zap,
  AlertTriangle,
} from 'lucide-react'
import VoiceInput from '@/components/VoiceInput'

export default function TradingDashboard() {
  const [selectedPair, setSelectedPair] = useState('EUR/USD')
  const [timeframe, setTimeframe] = useState('1H')

  const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'XAU/USD']
  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D']

  const marketData = {
    'EUR/USD': {
      price: 1.0875,
      change: 0.42,
      orderBlocks: [
        { type: 'bullish', price: 1.0845, status: 'unmitigated', probability: 87 },
        { type: 'bearish', price: 1.092, status: 'mitigated', probability: 62 },
      ],
      liquidity: [
        { level: 1.095, type: 'equal-highs' },
        { level: 1.082, type: 'equal-lows' },
      ],
      structure: 'uptrend',
      rsi: 68,
      atr: 0.0032,
    },
  }

  const currentData = marketData['EUR/USD']

  const signalStrength = (probability: number) => {
    if (probability >= 80) return { text: 'Very High', color: 'text-green-500', bg: 'bg-green-100' }
    if (probability >= 70)
      return { text: 'High', color: 'text-royal-green', bg: 'bg-royal-green bg-opacity-10' }
    if (probability >= 60)
      return { text: 'Medium', color: 'text-accent-gold', bg: 'bg-accent-gold bg-opacity-10' }
    return { text: 'Low', color: 'text-gray-500', bg: 'bg-gray-100' }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black to-royal-green pt-24 pb-12">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-playfair font-bold text-white mb-4"
          >
            Trading <span className="text-accent-gold">Dashboard</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300 mb-6"
          >
            Real-time order block analysis and probability scoring
          </motion.p>
          <VoiceInput placeholder="Ask about current market structure or order blocks..." />
        </div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pair Selector */}
            <div>
              <label className="block text-white font-semibold mb-3">Currency Pair</label>
              <div className="grid grid-cols-5 gap-2">
                {pairs.map(pair => (
                  <button
                    key={pair}
                    onClick={() => setSelectedPair(pair)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedPair === pair
                        ? 'bg-royal-green text-white'
                        : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
                    }`}
                  >
                    {pair.replace('/', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* Timeframe Selector */}
            <div>
              <label className="block text-white font-semibold mb-3">Timeframe</label>
              <div className="grid grid-cols-6 gap-2">
                {timeframes.map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      timeframe === tf
                        ? 'bg-accent-gold text-matte-black'
                        : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Market Overview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-playfair font-bold text-matte-black">
                    {selectedPair}
                  </h2>
                  <p className="text-gray-500">{timeframe} Chart</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-matte-black">{currentData.price}</div>
                  <div
                    className={`flex items-center justify-end space-x-1 ${currentData.change >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {currentData.change >= 0 ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                    <span className="font-semibold">{Math.abs(currentData.change)}%</span>
                  </div>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="bg-gradient-to-br from-royal-green to-royal-emerald rounded-xl h-64 flex items-center justify-center text-white">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-sm opacity-75">Interactive chart coming soon</p>
                  <p className="text-xs opacity-50 mt-2">TradingView integration</p>
                </div>
              </div>
            </div>

            {/* Order Blocks */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-playfair font-bold text-matte-black mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-royal-green" />
                Active Order Blocks
              </h3>
              <div className="space-y-4">
                {currentData.orderBlocks.map((ob, index) => {
                  const strength = signalStrength(ob.probability)
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-xl border-2 ${
                        ob.type === 'bullish'
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {ob.type === 'bullish' ? (
                            <TrendingUp className="w-6 h-6 text-green-500" />
                          ) : (
                            <TrendingDown className="w-6 h-6 text-red-500" />
                          )}
                          <div>
                            <h4 className="font-bold text-matte-black capitalize">
                              {ob.type} Order Block
                            </h4>
                            <p className="text-sm text-gray-600">Price: {ob.price}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full ${strength.bg}`}>
                          <span className={`text-sm font-semibold ${strength.color}`}>
                            {strength.text}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-semibold ${ob.status === 'unmitigated' ? 'text-green-600' : 'text-gray-500'}`}
                        >
                          {ob.status.toUpperCase()}
                        </span>
                        <div className="flex items-center space-x-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${ob.type === 'bullish' ? 'bg-green-500' : 'bg-red-500'}`}
                              style={{ width: `${ob.probability}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-bold text-matte-black">
                            {ob.probability}%
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Liquidity Zones */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-playfair font-bold text-matte-black mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2 text-accent-gold" />
                Liquidity Zones
              </h3>
              <div className="space-y-3">
                {currentData.liquidity.map((liq, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-accent-gold" />
                      <div>
                        <p className="font-semibold text-matte-black">{liq.level}</p>
                        <p className="text-sm text-gray-600 capitalize">
                          {liq.type.replace('-', ' ')}
                        </p>
                      </div>
                    </div>
                    <AlertTriangle className="w-5 h-5 text-yellow-500" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Side Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Market Structure */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-playfair font-bold text-matte-black mb-4">
                Market Structure
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Trend</span>
                  <span
                    className={`font-bold capitalize ${currentData.structure === 'uptrend' ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {currentData.structure}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">RSI</span>
                  <span className="font-bold text-matte-black">{currentData.rsi}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">ATR</span>
                  <span className="font-bold text-matte-black">{currentData.atr}</span>
                </div>
              </div>
            </div>

            {/* Trading Bias */}
            <div className="bg-gradient-to-br from-royal-green to-royal-emerald rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-playfair font-bold mb-4">Trading Bias</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-accent-gold" />
                  <span>Look for BUYS only</span>
                </div>
                <p className="text-sm text-gray-200">
                  Market structure shows uptrend with unmitigated bullish order block at 1.0845
                </p>
                <button className="w-full bg-accent-gold text-matte-black py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all mt-4">
                  View Entry Setup
                </button>
              </div>
            </div>

            {/* Rules Reminder */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-playfair font-bold text-matte-black mb-4">
                Trading Rules
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-royal-green rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  Trend decides bias
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-royal-green rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  Order blocks decide location
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-royal-green rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  Liquidity decides timing
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-royal-green rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  Indicators confirm probability
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-royal-green rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  Risk management ensures survival
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
