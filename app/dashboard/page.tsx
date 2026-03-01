'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, Target, Zap, AlertTriangle } from 'lucide-react'
import VoiceInput from '@/components/VoiceInput'
import { AdvancedChartWidget } from '@/components/TradingViewWidgets'
import { analyzeTechnicals, calculateRoundLevels } from '@/lib/technicalAnalysis'

type MarketBlock = {
  type: 'bullish' | 'bearish'
  price: number
  status: 'unmitigated' | 'mitigated'
  probability: number
}

type MarketLiquidity = {
  level: number
  type: 'recent-high' | 'recent-low'
}

type MarketSnapshot = {
  price: number
  change: number
  orderBlocks: MarketBlock[]
  liquidity: MarketLiquidity[]
  structure: 'uptrend' | 'downtrend' | 'sideways'
  rsi: number
  atr: number
  signal: 'BUY' | 'SELL' | 'WAIT'
  confidence: number
  lastUpdate: string
}

type PairConfig = {
  label: string
  symbol: string
  type: 'forex' | 'commodities'
  tvSymbol: string
}

type Candle = {
  timestamp: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export default function TradingDashboard() {
  const [selectedPair, setSelectedPair] = useState('EUR/USD')
  const [timeframe, setTimeframe] = useState('1H')
  const [currentMarket, setCurrentMarket] = useState<MarketSnapshot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const pairs: PairConfig[] = [
    {
      label: 'EUR/USD',
      symbol: 'EURUSD',
      return (
        <main className="min-h-screen bg-gradient-to-b from-matte-black to-royal-green">
          <div className="section-container">
            <header className="text-center mb-8">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl font-playfair font-bold text-gradient mb-4"
              >
                Trading <span className="text-accent-gold">Dashboard</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-300 mb-6 font-inter"
              >
                Real-time order block analysis and probability scoring
              </motion.p>
              <VoiceInput placeholder="Ask about current market structure or order blocks..." />
              {error && <p className="mt-4 text-sm text-red-300">Live data warning: {error}</p>}
            </header>
            <section>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-effect rounded-2xl p-6 mb-8"
              >
                {/* ...existing code for currency pair and timeframe selection... */}
              </motion.div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* ...existing code for dashboard grid content... */}
                {/* Example: update cards to use glass-effect and card-gradient */}
                {/* ...existing code... */}
                <div className="bg-white rounded-2xl p-8 shadow-lg glass-effect">
                  {/* ...existing code for chart and stats... */}
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg glass-effect">
                  {/* ...existing code for order blocks... */}
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-lg glass-effect">
                  {/* ...existing code for liquidity zones... */}
                </div>
                <div className="bg-gradient-to-br from-royal-green to-royal-emerald rounded-2xl p-6 text-white shadow-lg card-gradient">
                  {/* ...existing code for trading bias... */}
                  <button className="btn-secondary w-full mt-4">View Entry Setup</button>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-lg glass-effect">
                  {/* ...existing code for trading rules... */}
                </div>
              </div>
            </section>
          </div>
        </main>
      )
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
                            <p className="text-sm text-gray-600">
                              Price: {fmt(ob.price, selectedPair)}
                            </p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full ${s.bg}`}>
                          <span className={`text-sm font-semibold ${s.color}`}>{s.text}</span>
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

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-playfair font-bold text-matte-black mb-6 flex items-center">
                <Target className="w-6 h-6 mr-2 text-accent-gold" />
                Liquidity Zones
              </h3>
              <div className="space-y-3">
                {current.liquidity.map((liq: any, i: number) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                  >
                    <div className="flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-accent-gold" />
                      <div>
                        <p className="font-semibold text-matte-black">
                          {fmt(liq.level, selectedPair)}
                        </p>
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

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-playfair font-bold text-matte-black mb-4">
                Market Structure
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Trend</span>
                  <span
                    className={`font-bold capitalize ${current.structure === 'uptrend' ? 'text-green-500' : current.structure === 'downtrend' ? 'text-red-500' : 'text-yellow-500'}`}
                  >
                    {current.structure}
                  </span>
                </div>
                <motion.div
                  key={current.rsi}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-600">RSI</span>
                  <span className="font-bold text-matte-black">{current.rsi.toFixed(1)}</span>
                </motion.div>
                <motion.div
                  key={current.atr}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-600">ATR</span>
                  <span className="font-bold text-matte-black">{current.atr.toFixed(4)}</span>
                </motion.div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-royal-green to-royal-emerald rounded-2xl p-6 text-white shadow-lg">
              <h3 className="text-xl font-playfair font-bold mb-4">Trading Bias</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  {current.structure === 'uptrend' ? (
                    <TrendingUp className="w-5 h-5 text-accent-gold" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-accent-gold" />
                  )}
                  <span>
                    Look for{' '}
                    {current.structure === 'uptrend'
                      ? 'BUYS'
                      : current.structure === 'downtrend'
                        ? 'SELLS'
                        : 'RANGE TRADES'}{' '}
                    only
                  </span>
                </div>
                <p className="text-sm text-gray-200">
                  Market structure shows {current.structure} with {current.orderBlocks[0].status}{' '}
                  {current.orderBlocks[0].type} order block at{' '}
                  {fmt(current.orderBlocks[0].price, selectedPair)}
                </p>
                <button className="w-full bg-accent-gold text-matte-black py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all mt-4">
                  View Entry Setup
                </button>
              </div>
            </div>

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
