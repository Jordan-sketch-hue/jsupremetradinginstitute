'use client'

import { useState, useEffect } from 'react'
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
  const [marketData, setMarketData] = useState<any>({})

  const pairs = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/USD', 'XAU/USD']
  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D']

  useEffect(() => {
    const initialData: any = {
      'EUR/USD': {
        basePrice: 1.0875,
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
      'GBP/USD': {
        basePrice: 1.2745,
        price: 1.2745,
        change: 0.27,
        orderBlocks: [
          { type: 'bullish', price: 1.272, status: 'unmitigated', probability: 92 },
          { type: 'bearish', price: 1.278, status: 'unmitigated', probability: 71 },
        ],
        liquidity: [
          { level: 1.28, type: 'equal-highs' },
          { level: 1.268, type: 'equal-lows' },
        ],
        structure: 'downtrend',
        rsi: 42,
        atr: 0.0041,
      },
      'USD/JPY': {
        basePrice: 149.35,
        price: 149.35,
        change: -0.55,
        orderBlocks: [
          { type: 'bullish', price: 149.1, status: 'mitigated', probability: 78 },
          { type: 'bearish', price: 149.8, status: 'unmitigated', probability: 85 },
        ],
        liquidity: [
          { level: 150.2, type: 'equal-highs' },
          { level: 148.5, type: 'equal-lows' },
        ],
        structure: 'sideways',
        rsi: 55,
        atr: 0.95,
      },
      'AUD/USD': {
        basePrice: 0.6542,
        price: 0.6542,
        change: 0.18,
        orderBlocks: [
          { type: 'bullish', price: 0.652, status: 'unmitigated', probability: 81 },
          { type: 'bearish', price: 0.658, status: 'mitigated', probability: 58 },
        ],
        liquidity: [
          { level: 0.66, type: 'equal-highs' },
          { level: 0.648, type: 'equal-lows' },
        ],
        structure: 'uptrend',
        rsi: 64,
        atr: 0.0028,
      },
      'XAU/USD': {
        basePrice: 2145.75,
        price: 2145.75,
        change: 0.71,
        orderBlocks: [
          { type: 'bearish', price: 2155.0, status: 'unmitigated', probability: 89 },
          { type: 'bullish', price: 2120.0, status: 'mitigated', probability: 74 },
        ],
        liquidity: [
          { level: 2180.0, type: 'equal-highs' },
          { level: 2100.0, type: 'equal-lows' },
        ],
        structure: 'downtrend',
        rsi: 72,
        atr: 8.5,
      },
    }
    setMarketData(initialData)
  }, [])

  useEffect(() => {
    if (Object.keys(marketData).length === 0) return
    const interval = setInterval(() => {
      setMarketData((prev: any) => {
        const updated = { ...prev }
        pairs.forEach(pair => {
          if (updated[pair]) {
            const change = (Math.random() - 0.5) * 0.0005
            const price = Number((updated[pair].basePrice + change).toFixed(4))
            const changePct = ((price - updated[pair].basePrice) / updated[pair].basePrice) * 100
            updated[pair] = {
              ...updated[pair],
              price,
              change: Number(changePct.toFixed(2)),
              rsi: Math.max(20, Math.min(80, updated[pair].rsi + (Math.random() - 0.5) * 3)),
              atr: Math.max(0.0005, updated[pair].atr + (Math.random() - 0.5) * 0.0002),
            }
          }
        })
        return updated
      })
    }, 2000)
    return () => clearInterval(interval)
  }, [marketData, pairs])

  const current = marketData[selectedPair]
  if (!current)
    return (
      <div className="min-h-screen bg-gradient-to-b from-matte-black to-royal-green flex items-center justify-center pt-24">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    )

  const fmt = (p: number, pair: string) =>
    pair.includes('JPY') || pair.includes('XAU') ? p.toFixed(2) : p.toFixed(4)
  const strength = (prob: number) =>
    prob >= 80
      ? { text: 'Very High', color: 'text-green-500', bg: 'bg-green-100' }
      : prob >= 70
        ? { text: 'High', color: 'text-royal-green', bg: 'bg-royal-green bg-opacity-10' }
        : prob >= 60
          ? { text: 'Medium', color: 'text-accent-gold', bg: 'bg-accent-gold bg-opacity-10' }
          : { text: 'Low', color: 'text-gray-500', bg: 'bg-gray-100' }

  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black to-royal-green pt-24 pb-12">
      <div className="section-container">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white font-semibold mb-3">Currency Pair</label>
              <div className="grid grid-cols-5 gap-2">
                {pairs.map(pair => (
                  <button
                    key={pair}
                    onClick={() => setSelectedPair(pair)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedPair === pair ? 'bg-royal-green text-white' : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'}`}
                  >
                    {pair.replace('/', '')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-white font-semibold mb-3">Timeframe</label>
              <div className="grid grid-cols-6 gap-2">
                {timeframes.map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${timeframe === tf ? 'bg-accent-gold text-matte-black' : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'}`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2 space-y-6"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-playfair font-bold text-matte-black">
                    {selectedPair}
                  </h2>
                  <p className="text-gray-500">{timeframe} Chart</p>
                </div>
                <div className="text-right">
                  <motion.div
                    key={current.price}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className="text-4xl font-bold text-matte-black"
                  >
                    {fmt(current.price, selectedPair)}
                  </motion.div>
                  <motion.div
                    key={current.change}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    className={`flex items-center justify-end space-x-1 ${current.change >= 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {current.change >= 0 ? (
                      <TrendingUp className="w-5 h-5" />
                    ) : (
                      <TrendingDown className="w-5 h-5" />
                    )}
                    <span className="font-semibold">{Math.abs(current.change).toFixed(2)}%</span>
                  </motion.div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-royal-green to-royal-emerald rounded-xl h-64 flex items-center justify-center text-white">
                <div className="text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="text-sm opacity-75">Interactive chart coming soon</p>
                  <p className="text-xs opacity-50 mt-2">TradingView integration</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-playfair font-bold text-matte-black mb-6 flex items-center">
                <Activity className="w-6 h-6 mr-2 text-royal-green" />
                Active Order Blocks
              </h3>
              <div className="space-y-4">
                {current.orderBlocks.map((ob: any, i: number) => {
                  const s = strength(ob.probability)
                  return (
                    <div
                      key={i}
                      className={`p-4 rounded-xl border-2 ${ob.type === 'bullish' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}`}
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
