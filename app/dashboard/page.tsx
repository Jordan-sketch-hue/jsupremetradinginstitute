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
      type: 'forex',
      tvSymbol: 'FX_IDC:EURUSD',
    },
    {
      label: 'GBP/USD',
      symbol: 'GBPUSD',
      type: 'forex',
      tvSymbol: 'FX_IDC:GBPUSD',
    },
    {
      label: 'USD/JPY',
      symbol: 'USDJPY',
      type: 'forex',
      tvSymbol: 'FX_IDC:USDJPY',
    },
    {
      label: 'AUD/USD',
      symbol: 'AUDUSD',
      type: 'forex',
      tvSymbol: 'FX_IDC:AUDUSD',
    },
    {
      label: 'XAU/USD',
      symbol: 'XAUUSD',
      type: 'commodities',
      tvSymbol: 'TVC:GOLD',
    },
  ]
  const timeframes = ['1M', '5M', '15M', '1H', '4H', '1D']

  const resolvePair = (label: string) => pairs.find(pair => pair.label === label) || pairs[0]

  const mapTimeframe = (value: string) => value.toLowerCase()

  const calculateATR = (candles: Candle[], period: number = 14) => {
    if (candles.length < 2) return 0
    const ranges: number[] = []
    for (let i = 1; i < candles.length; i += 1) {
      const current = candles[i]
      const previous = candles[i - 1]
      const highLow = current.high - current.low
      const highClose = Math.abs(current.high - previous.close)
      const lowClose = Math.abs(current.low - previous.close)
      ranges.push(Math.max(highLow, highClose, lowClose))
    }
    const sliced = ranges.slice(-period)
    const sum = sliced.reduce((acc, value) => acc + value, 0)
    return sliced.length > 0 ? sum / sliced.length : 0
  }

  const buildSnapshot = (candles: Candle[]): MarketSnapshot => {
    const closes = candles.map(candle => candle.close)
    const highs = candles.map(candle => candle.high)
    const lows = candles.map(candle => candle.low)
    const last = candles[candles.length - 1]
    const previous = candles[candles.length - 2]
    const change = previous ? ((last.close - previous.close) / previous.close) * 100 : 0
    const technicals = analyzeTechnicals(closes)
    const roundLevels = calculateRoundLevels(last.close)
    const atr = calculateATR(candles)
    const recentHigh = Math.max(...highs.slice(-20))
    const recentLow = Math.min(...lows.slice(-20))
    const primaryBlock = technicals.signal === 'SELL' ? 'bearish' : 'bullish'

    return {
      price: last.close,
      change: Number(change.toFixed(2)),
      orderBlocks: [
        {
          type: primaryBlock,
          price: roundLevels.support,
          status: 'unmitigated',
          probability: technicals.confidence,
        },
        {
          type: primaryBlock === 'bullish' ? 'bearish' : 'bullish',
          price: roundLevels.resistance,
          status: 'mitigated',
          probability: Math.max(45, technicals.confidence - 12),
        },
      ],
      liquidity: [
        { level: recentHigh, type: 'recent-high' },
        { level: recentLow, type: 'recent-low' },
      ],
      structure:
        technicals.trend === 'UP'
          ? 'uptrend'
          : technicals.trend === 'DOWN'
            ? 'downtrend'
            : 'sideways',
      rsi: technicals.rsi,
      atr: Number(atr.toFixed(4)),
      signal: technicals.signal,
      confidence: technicals.confidence,
      lastUpdate: new Date().toLocaleTimeString(),
    }
  }

  useEffect(() => {
    let isActive = true
    const fetchMarketSnapshot = async () => {
      const pair = resolvePair(selectedPair)
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(
          `/api/market-data/historical?symbol=${pair.symbol}&type=${pair.type}&timeframe=${mapTimeframe(timeframe)}`
        )

        if (!response.ok) {
          throw new Error('Failed to load live market data')
        }

        const payload = await response.json()
        const candles = Array.isArray(payload?.candles) ? payload.candles : []

        if (candles.length < 2) {
          throw new Error('Not enough live candles available')
        }

        if (!isActive) return
        setCurrentMarket(buildSnapshot(candles))
      } catch (fetchError) {
        if (!isActive) return
        setCurrentMarket(null)
        setError(fetchError instanceof Error ? fetchError.message : 'Live data unavailable')
      } finally {
        if (isActive) setIsLoading(false)
      }
    }

    fetchMarketSnapshot()
    const interval = setInterval(fetchMarketSnapshot, 30000)
    return () => {
      isActive = false
      clearInterval(interval)
    }
  }, [selectedPair, timeframe])

  const current = currentMarket
  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-b from-matte-black to-royal-green flex items-center justify-center pt-24">
        <div className="text-white text-2xl">Loading live market data...</div>
      </div>
    )

  if (error || !current)
    return (
      <div className="min-h-screen bg-gradient-to-b from-matte-black to-royal-green flex items-center justify-center pt-24">
        <div className="text-white text-lg text-center max-w-xl">
          {error || 'Live market data is temporarily unavailable.'}
        </div>
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
          {error && <p className="mt-4 text-sm text-red-300">Live data warning: {error}</p>}
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
                    key={pair.label}
                    onClick={() => setSelectedPair(pair.label)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${selectedPair === pair.label ? 'bg-royal-green text-white' : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'}`}
                  >
                    {pair.label.replace('/', '')}
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
                  <p className="text-gray-500">
                    {timeframe} Chart • Updated {current.lastUpdate}
                  </p>
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
              <div className="rounded-xl overflow-hidden border border-royal-green/30">
                <AdvancedChartWidget symbol={resolvePair(selectedPair).tvSymbol} height={380} />
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
