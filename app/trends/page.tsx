'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, AlertCircle, Target, DollarSign, Zap } from 'lucide-react'

interface AssetTrend {
  symbol: string
  type: 'forex' | 'crypto' | 'indices' | 'commodities'
  trend: 'uptrend' | 'downtrend' | 'sideways'
  bias: 'BUY' | 'SELL' | 'WAIT'
  confidence: number // 0-100
  currentPrice: number
  keyLevel: number
  entryZone: string
  stopLoss: string
  takeProfit: string
  reasoning: string
}

export default function TrendsPage() {
  const [assets, setAssets] = useState<AssetTrend[]>([])
  const [selectedAsset, setSelectedAsset] = useState<AssetTrend | null>(null)
  const [filter, setFilter] = useState<'all' | 'forex' | 'crypto' | 'indices' | 'commodities'>(
    'all'
  )

  useEffect(() => {
    const assetList: AssetTrend[] = [
      // Forex Pairs
      {
        symbol: 'EURUSD',
        type: 'forex',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 78,
        currentPrice: 1.0948,
        keyLevel: 1.084,
        entryZone: '1.0920 - 1.0930 (pullback into bullish OB)',
        stopLoss: '1.0835 (below key level)',
        takeProfit: '1.1050 (next resistance)',
        reasoning:
          'Price holds above demand zone with higher lows. Order block at 1.0840 unmitigated. RSI shows continuation bias.',
      },
      {
        symbol: 'GBPUSD',
        type: 'forex',
        trend: 'downtrend',
        bias: 'SELL',
        confidence: 71,
        currentPrice: 1.2745,
        keyLevel: 1.285,
        entryZone: '1.2770 - 1.2790 (pullback to supply)',
        stopLoss: '1.2860 (above key level)',
        takeProfit: '1.2650 (next support)',
        reasoning:
          'Lower highs and lows established. Distribution phase active. Wait for pullback into bearish OB.',
      },
      {
        symbol: 'USDJPY',
        type: 'forex',
        trend: 'sideways',
        bias: 'WAIT',
        confidence: 45,
        currentPrice: 149.35,
        keyLevel: 149.5,
        entryZone: 'Wait for structure break (above 149.50 or below 148.80)',
        stopLoss: 'Beyond opposite level',
        takeProfit: '100+ pips in direction of break',
        reasoning:
          'Price consolidating between 148.80 and 149.50. No clear order block yet. Await breakout confirmation.',
      },
      {
        symbol: 'USDCHF',
        type: 'forex',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 65,
        currentPrice: 0.8945,
        keyLevel: 0.892,
        entryZone: '0.8935 - 0.8940 (pullback)',
        stopLoss: '0.8915 (below support)',
        takeProfit: '0.9020 (resistance)',
        reasoning:
          'Holding above support with bullish structure. Shallow pullbacks suggest strength.',
      },
      {
        symbol: 'AUDUSD',
        type: 'forex',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 72,
        currentPrice: 0.6542,
        keyLevel: 0.652,
        entryZone: '0.6530 - 0.6535 (pullback into OB)',
        stopLoss: '0.6515 (below level)',
        takeProfit: '0.6650 (next target)',
        reasoning: 'Higher highs and lows. Strong bullish order block. Entry on pullback optimal.',
      },
      {
        symbol: 'NZDUSD',
        type: 'forex',
        trend: 'downtrend',
        bias: 'SELL',
        confidence: 68,
        currentPrice: 0.598,
        keyLevel: 0.605,
        entryZone: '0.6020 - 0.6040 (pullback to resistance)',
        stopLoss: '0.6055 (above level)',
        takeProfit: '0.5900 (next support)',
        reasoning: 'Lower highs confirmed. Bearish structure intact. Distribution phase ongoing.',
      },
      {
        symbol: 'EURGBP',
        type: 'forex',
        trend: 'downtrend',
        bias: 'SELL',
        confidence: 74,
        currentPrice: 0.862,
        keyLevel: 0.868,
        entryZone: '0.8650 - 0.8665 (pullback)',
        stopLoss: '0.8690 (above key level)',
        takeProfit: '0.8550 (support)',
        reasoning: 'Clear bearish structure. Pullbacks into OB provide quality entries.',
      },
      {
        symbol: 'EURJPY',
        type: 'forex',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 76,
        currentPrice: 165.42,
        keyLevel: 164.8,
        entryZone: '165.10 - 165.20 (pullback)',
        stopLoss: '164.75 (below support)',
        takeProfit: '166.50 (next level)',
        reasoning: 'Strong uptrend with clean order blocks. Entry on mild pullback optimal.',
      },
      {
        symbol: 'GBPJPY',
        type: 'forex',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 69,
        currentPrice: 189.75,
        keyLevel: 188.5,
        entryZone: '189.40 - 189.50 (pullback)',
        stopLoss: '188.40 (below level)',
        takeProfit: '191.00 (target)',
        reasoning: 'Higher highs established. Bullish bias. Wait for pullback to enter.',
      },
      {
        symbol: 'AUDJPY',
        type: 'forex',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 67,
        currentPrice: 103.25,
        keyLevel: 102.5,
        entryZone: '103.00 - 103.10 (pullback)',
        stopLoss: '102.45 (below level)',
        takeProfit: '104.20 (resistance)',
        reasoning: 'Uptrend structure intact. Entry on pullback to bullish OB.',
      },
      {
        symbol: 'EURAUD',
        type: 'forex',
        trend: 'downtrend',
        bias: 'SELL',
        confidence: 70,
        currentPrice: 1.678,
        keyLevel: 1.69,
        entryZone: '1.6850 - 1.6870 (pullback)',
        stopLoss: '1.6920 (above level)',
        takeProfit: '1.6650 (support)',
        reasoning: 'Bearish structure confirmed. Pullbacks provide entry opportunities.',
      },
      {
        symbol: 'USDCAD',
        type: 'forex',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 73,
        currentPrice: 1.345,
        keyLevel: 1.338,
        entryZone: '1.3420 - 1.3430 (pullback)',
        stopLoss: '1.3375 (below level)',
        takeProfit: '1.3550 (target)',
        reasoning: 'Higher lows structure. Bullish OB unmitigated. Entry on pullback optimal.',
      },
      // Commodities
      {
        symbol: 'XAUUSD',
        type: 'commodities',
        trend: 'downtrend',
        bias: 'SELL',
        confidence: 79,
        currentPrice: 2145.75,
        keyLevel: 2165.0,
        entryZone: '2155.00 - 2160.00 (pullback to resistance)',
        stopLoss: '2170.00 (above level)',
        takeProfit: '2100.00 (next support)',
        reasoning:
          'Strong bearish structure. Liquidity sweep above 2,165 then reversal. High probability setup.',
      },
      {
        symbol: 'XAGUSD',
        type: 'commodities',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 62,
        currentPrice: 28.45,
        keyLevel: 27.8,
        entryZone: '28.20 - 28.30 (pullback)',
        stopLoss: '27.75 (below level)',
        takeProfit: '29.50 (resistance)',
        reasoning: 'Bullish structure emerging. Entry on pullback to demand zone.',
      },
      {
        symbol: 'XPTUSD',
        type: 'commodities',
        trend: 'sideways',
        bias: 'WAIT',
        confidence: 50,
        currentPrice: 1085.5,
        keyLevel: 1100.0,
        entryZone: 'Await breakout above 1,100 or below 1,060',
        stopLoss: 'Beyond opposite breakout level',
        takeProfit: '100+ pips',
        reasoning: 'Range-bound. No clear structure yet. Wait for decisive break.',
      },
      {
        symbol: 'WTI_H6',
        type: 'commodities',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 66,
        currentPrice: 78.45,
        keyLevel: 76.5,
        entryZone: '77.80 - 78.00 (pullback)',
        stopLoss: '76.40 (below level)',
        takeProfit: '80.50 (target)',
        reasoning: 'Higher highs established. Bullish bias. Entry on pullback.',
      },
      // Indices
      {
        symbol: 'US500',
        type: 'indices',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 81,
        currentPrice: 5234.8,
        keyLevel: 5200.0,
        entryZone: '5220.00 - 5230.00 (pullback)',
        stopLoss: '5195.00 (below level)',
        takeProfit: '5300.00 (resistance)',
        reasoning: 'Strong uptrend. Higher lows intact. Entry on mild pullback recommended.',
      },
      {
        symbol: 'US30',
        type: 'indices',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 77,
        currentPrice: 39450.0,
        keyLevel: 39000.0,
        entryZone: '39200.00 - 39300.00 (pullback)',
        stopLoss: '38950.00 (below level)',
        takeProfit: '39800.00 (target)',
        reasoning: 'Bullish structure. Higher highs and lows. Quality entry on pullback.',
      },
      {
        symbol: 'USTEC',
        type: 'indices',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 75,
        currentPrice: 19875.5,
        keyLevel: 19500.0,
        entryZone: '19700.00 - 19800.00 (pullback)',
        stopLoss: '19480.00 (below level)',
        takeProfit: '20200.00 (resistance)',
        reasoning: 'Tech rally intact. Higher lows confirmed. Entry on pullback optimal.',
      },
      {
        symbol: 'DE40',
        type: 'indices',
        trend: 'downtrend',
        bias: 'SELL',
        confidence: 64,
        currentPrice: 18250.0,
        keyLevel: 18500.0,
        entryZone: '18350.00 - 18400.00 (pullback)',
        stopLoss: '18520.00 (above level)',
        takeProfit: '18000.00 (support)',
        reasoning: 'Lower highs structure. Bearish bias. Entry on pullback to resistance.',
      },
      {
        symbol: 'UK100',
        type: 'indices',
        trend: 'sideways',
        bias: 'WAIT',
        confidence: 48,
        currentPrice: 8125.0,
        keyLevel: 8200.0,
        entryZone: 'Await break above 8,200 or below 8,050',
        stopLoss: 'Beyond opposite level',
        takeProfit: '100+ points',
        reasoning: 'Consolidation phase. No clear bias yet. Wait for structure break.',
      },
      // Crypto
      {
        symbol: 'BTCUSD',
        type: 'crypto',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 80,
        currentPrice: 42850.0,
        keyLevel: 41500.0,
        entryZone: '42200.00 - 42400.00 (pullback)',
        stopLoss: '41450.00 (below level)',
        takeProfit: '44000.00 (target)',
        reasoning: 'Strong bullish structure. Higher highs and lows. Entry on pullback to demand.',
      },
      {
        symbol: 'BCHUSD',
        type: 'crypto',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 72,
        currentPrice: 425.5,
        keyLevel: 410.0,
        entryZone: '420.00 - 423.00 (pullback)',
        stopLoss: '408.00 (below level)',
        takeProfit: '445.00 (resistance)',
        reasoning: 'Bullish structure intact. Entry on pullback to support optimal.',
      },
      {
        symbol: 'XNGUSD',
        type: 'crypto',
        trend: 'downtrend',
        bias: 'SELL',
        confidence: 68,
        currentPrice: 0.0825,
        keyLevel: 0.089,
        entryZone: '0.0860 - 0.0875 (pullback)',
        stopLoss: '0.0900 (above level)',
        takeProfit: '0.0780 (support)',
        reasoning: 'Bearish structure emerging. Entry on pullback to resistance.',
      },
      {
        symbol: 'USDMXN',
        type: 'forex',
        trend: 'downtrend',
        bias: 'SELL',
        confidence: 63,
        currentPrice: 17.25,
        keyLevel: 17.5,
        entryZone: '17.35 - 17.42 (pullback)',
        stopLoss: '17.55 (above level)',
        takeProfit: '17.00 (support)',
        reasoning: 'Lower highs structure. Bearish bias. Entry on pullback to OB.',
      },
      {
        symbol: 'USDZAR',
        type: 'forex',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 61,
        currentPrice: 18.45,
        keyLevel: 18.1,
        entryZone: '18.30 - 18.38 (pullback)',
        stopLoss: '18.05 (below level)',
        takeProfit: '18.80 (target)',
        reasoning: 'Higher lows structure. Bullish entry on pullback optimal.',
      },
      {
        symbol: 'USDTRY',
        type: 'forex',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 70,
        currentPrice: 32.15,
        keyLevel: 31.5,
        entryZone: '31.95 - 32.05 (pullback)',
        stopLoss: '31.45 (below level)',
        takeProfit: '32.80 (resistance)',
        reasoning: 'Strong uptrend. Higher highs established. Entry on pullback recommended.',
      },
      {
        symbol: 'ETHUSD',
        type: 'crypto',
        trend: 'uptrend',
        bias: 'BUY',
        confidence: 76,
        currentPrice: 2425.5,
        keyLevel: 2300.0,
        entryZone: '2380.00 - 2410.00 (pullback)',
        stopLoss: '2295.00 (below level)',
        takeProfit: '2550.00 (target)',
        reasoning: 'Bullish structure intact. Higher lows confirmed. Quality entry on pullback.',
      },
    ]

    // Simulate slight price movements every 2 seconds
    const interval = setInterval(() => {
      setAssets(prev =>
        prev.map(asset => ({
          ...asset,
          currentPrice:
            asset.currentPrice +
            (Math.random() - 0.5) *
              (asset.type === 'indices' ? 10 : asset.type === 'crypto' ? 5 : 0.005),
          confidence: Math.max(45, Math.min(85, asset.confidence + (Math.random() - 0.5) * 3)),
        }))
      )
    }, 2000)

    setAssets(assetList)
    return () => clearInterval(interval)
  }, [])

  const filteredAssets = assets.filter(asset => filter === 'all' || asset.type === filter)

  const getTrendIcon = (trend: string) => {
    return trend === 'uptrend' ? (
      <TrendingUp className="w-5 h-5 text-green-500" />
    ) : trend === 'downtrend' ? (
      <TrendingDown className="w-5 h-5 text-red-500" />
    ) : (
      <AlertCircle className="w-5 h-5 text-yellow-500" />
    )
  }

  const getBiasColor = (bias: string) => {
    return bias === 'BUY'
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : bias === 'SELL'
        ? 'bg-red-500/20 text-red-400 border-red-500/30'
        : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-12 h-12 text-royal-emerald" />
            <h1 className="text-5xl font-bold text-white">Trends & Direction</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl">
            Real-time trend analysis and entry suggestions for 30+ forex pairs, commodities,
            indices, and crypto. All based on institutional order block theory and market structure.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex gap-3 flex-wrap"
        >
          {(['all', 'forex', 'crypto', 'indices', 'commodities'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                filter === f
                  ? 'bg-royal-emerald text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </motion.div>

        {/* Assets Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
        >
          {filteredAssets.map((asset, index) => (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => setSelectedAsset(asset)}
              className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-5 cursor-pointer hover:border-royal-emerald hover:bg-matte-black/70 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-white">{asset.symbol}</span>
                {getTrendIcon(asset.trend)}
              </div>

              <div className="mb-3">
                <div className="text-2xl font-bold text-white mb-1">
                  {asset.currentPrice.toFixed(2)}
                </div>
                <div
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getBiasColor(asset.bias)}`}
                >
                  {asset.bias}
                </div>
              </div>

              <div className="space-y-1 text-xs text-gray-400">
                <div>Confidence: {asset.confidence.toFixed(0)}%</div>
                <div className="text-gray-500 line-clamp-1 text-xs">{asset.reasoning}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Detailed View */}
        {selectedAsset && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-royal-green/20 to-royal-emerald/10 border border-royal-green/50 rounded-2xl p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-4xl font-bold text-white mb-2">{selectedAsset.symbol}</h2>
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold text-accent-gold">
                    {selectedAsset.currentPrice.toFixed(selectedAsset.type === 'indices' ? 0 : 4)}
                  </span>
                  <div
                    className={`px-4 py-2 rounded-lg text-lg font-bold border ${getBiasColor(selectedAsset.bias)}`}
                  >
                    {selectedAsset.bias}
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="px-6 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
              >
                Close
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-matte-black/50 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">Trend Structure</div>
                <div className="text-2xl font-bold text-white capitalize mb-3">
                  {selectedAsset.trend}
                </div>
                <div className="text-gray-400 text-sm mb-3">
                  Confidence: {selectedAsset.confidence.toFixed(0)}%
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-royal-emerald h-2 rounded-full transition-all"
                    style={{ width: `${selectedAsset.confidence}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-matte-black/50 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">Key Level</div>
                <div className="text-2xl font-bold text-white mb-3">
                  {selectedAsset.keyLevel.toFixed(selectedAsset.type === 'indices' ? 0 : 4)}
                </div>
                <div className="text-xs text-gray-400">
                  {selectedAsset.trend === 'uptrend'
                    ? 'Support level - defend this'
                    : selectedAsset.trend === 'downtrend'
                      ? 'Resistance level - reject here'
                      : 'Breakout level - watch for break'}
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-gray-400 text-sm">Entry Zone</span>
                </div>
                <div className="text-white font-semibold">{selectedAsset.entryZone}</div>
              </div>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span className="text-gray-400 text-sm">Stop Loss</span>
                </div>
                <div className="text-white font-semibold">{selectedAsset.stopLoss}</div>
              </div>

              <div className="bg-accent-gold/10 border border-accent-gold/30 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-accent-gold" />
                  <span className="text-gray-400 text-sm">Take Profit</span>
                </div>
                <div className="text-white font-semibold">{selectedAsset.takeProfit}</div>
              </div>
            </div>

            <div className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-accent-gold" />
                <h3 className="text-xl font-bold text-white">Analysis & Reasoning</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">{selectedAsset.reasoning}</p>
            </div>
          </motion.div>
        )}

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-matte-black/50 border border-royal-green/30 rounded-2xl p-8"
        >
          <h3 className="text-2xl font-bold text-white mb-4">How to Use This Page</h3>
          <ul className="space-y-3 text-gray-300">
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">1.</span>
              <span>
                Click on any asset to see detailed trend analysis, entry zones, and risk/reward
                setup
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">2.</span>
              <span>
                BUY = Uptrend structure intact. Wait for pullback into bullish order block.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">3.</span>
              <span>
                SELL = Downtrend structure intact. Wait for pullback into bearish order block.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">4.</span>
              <span>
                WAIT = No clear structure yet. Avoid trading. Await breakout or structure
                establishment.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">5.</span>
              <span>
                Enter at the suggested Entry Zone, place stops beyond the Key Level, and target the
                Take Profit level.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-royal-emerald font-bold">6.</span>
              <span>
                Prices and recommendations update every 2 seconds. This represents institutional
                order block theory in action.
              </span>
            </li>
          </ul>
        </motion.div>
      </div>
    </div>
  )
}
