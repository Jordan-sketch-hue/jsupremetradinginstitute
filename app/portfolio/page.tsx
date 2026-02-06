'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  AdvancedChartWidget,
  MarketScreenerWidget,
  EconomicCalendarWidget,
  ForexHeatmapWidget,
} from '@/components/TradingViewWidgets'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Target,
  BookOpen,
  ChevronRight,
  ExternalLink,
} from 'lucide-react'

export default function PortfolioPage() {
  const [selectedPair, setSelectedPair] = useState('EURUSD')

  // Portfolio tracking data
  const portfolioAssets = [
    { symbol: 'EURUSD', name: 'EUR/USD', status: 'watching', analysis: 'Bullish OB at 1.0845' },
    { symbol: 'XAUUSD', name: 'Gold', status: 'watching', analysis: 'Accumulation phase active' },
    { symbol: 'GBPUSD', name: 'GBP/USD', status: 'watching', analysis: 'Liquidity sweep complete' },
    { symbol: 'BTCUSD', name: 'Bitcoin', status: 'watching', analysis: 'Higher timeframe uptrend' },
    { symbol: 'ETHUSD', name: 'Ethereum', status: 'watching', analysis: 'Order block mitigation' },
    { symbol: 'US30', name: 'Dow Jones', status: 'watching', analysis: 'Break of structure' },
    { symbol: 'XAGUSD', name: 'Silver', status: 'watching', analysis: 'Consolidation at support' },
    { symbol: 'USTEC', name: 'NASDAQ', status: 'watching', analysis: 'Institutional accumulation' },
  ]

  // Real-world market analysis examples
  const marketAnalysis = [
    {
      title: 'EURUSD: Bullish Order Block Setup',
      pair: 'EUR/USD',
      timeframe: '15M',
      bias: 'BULLISH',
      analysis:
        'Price swept liquidity below the previous low at 1.0840, creating a liquidity grab. A bearish candle at 1.0845 (before the strong bullish move to 1.0875) has formed an unmitigated bullish order block. RSI shows bullish divergence at 67%, and ATR confirms increased volatility favorable for the move.',
      entry: '1.0850 (on pullback into OB zone)',
      sl: '1.0835 (below OB)',
      tp: '1.0880 (1:2 R:R)',
      probability: '87%',
      learningLink: '/learning-path#level3',
    },
    {
      title: 'XAUUSD: Accumulation Phase Breakdown',
      pair: 'Gold / U.S. Dollar',
      timeframe: '1H',
      bias: 'BULLISH',
      analysis:
        'Gold is in a clear accumulation phase on the 4H timeframe. Price has been ranging between $2,640 and $2,660 for 3 days, absorbing sell orders. Multiple equal highs at $2,660 represent buy-side liquidity that institutions will likely target. A 1H bullish order block sits at $2,648 with confluence from the 200 EMA.',
      entry: '$2,648 - $2,650 (OB zone)',
      sl: '$2,642',
      tp: '$2,668 (liquidity sweep target)',
      probability: '78%',
      learningLink: '/learning-path#level4',
    },
    {
      title: 'GBPUSD: Liquidity Sweep & Reversal',
      pair: 'GBP/USD',
      timeframe: '5M',
      bias: 'BEARISH',
      analysis:
        "Classic manipulation setup: Price aggressively swept above the recent high at 1.2875 (stop hunt), triggering retail buy stops. Immediately reversed with strong bearish momentum, leaving a bearish order block at 1.2872. This is institutional distribution - they're selling into retail buy pressure.",
      entry: '1.2870 (retest of bearish OB)',
      sl: '1.2878',
      tp: '1.2850 (liquidity below)',
      probability: '82%',
      learningLink: '/learning-path#level4',
    },
    {
      title: 'BTCUSD: Higher Timeframe Trend Following',
      pair: 'Bitcoin',
      timeframe: '4H',
      bias: 'BULLISH',
      analysis:
        'Weekly and daily charts show clear higher highs and higher lows - strong uptrend. Price pulled back to the 4H bullish OB at $98,500 which aligns with the 50% Fibonacci retracement of the last impulse leg. Volume confirms accumulation at this level. RSI reset to 52% from overbought territory.',
      entry: '$98,600',
      sl: '$97,800',
      tp: '$101,200',
      probability: '74%',
      learningLink: '/learning-path#level2',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">Live Market Analysis</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Real-time charts, institutional order block analysis, and educational trade breakdowns.
            Learn by observing how smart money moves markets.
          </p>
        </motion.div>

        {/* Portfolio Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-royal-green/10 to-royal-emerald/10 border border-royal-green/30 rounded-2xl p-6 md:p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Watchlist Assets</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            {portfolioAssets.map(asset => (
              <button
                key={asset.symbol}
                onClick={() => setSelectedPair(asset.symbol)}
                className={`
                  p-4 rounded-xl border-2 transition-all hover:scale-105
                  ${
                    selectedPair === asset.symbol
                      ? 'bg-royal-emerald/30 border-royal-emerald shadow-lg shadow-royal-emerald/30'
                      : 'bg-royal-green/10 border-royal-green/30 hover:border-royal-green/60'
                  }
                `}
              >
                <div className="text-white font-bold text-sm mb-1">{asset.symbol}</div>
                <div className="text-xs text-gray-400">{asset.name}</div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-matte-black/50 border border-royal-green/30 rounded-2xl overflow-hidden mb-12"
        >
          <div className="p-6 border-b border-royal-green/30">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{selectedPair} - Live Chart</h2>
                <p className="text-gray-400">TradingView Advanced Chart - Free real-time data</p>
              </div>
              <a
                href={`https://www.tradingview.com/chart/?symbol=${selectedPair}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-royal-emerald/20 border border-royal-emerald/50 rounded-lg text-royal-emerald hover:bg-royal-emerald/30 transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Open in TradingView</span>
              </a>
            </div>
          </div>
          <div className="p-4 bg-matte-black">
            <AdvancedChartWidget symbol={selectedPair} height={610} />
          </div>
        </motion.div>

        {/* Market Analysis Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Real-World Trade Analysis</h2>
          <p className="text-gray-400 mb-8">
            These are educational examples demonstrating how to apply the Royal Flow Doctrine to
            live market conditions. Study these setups to understand institutional footprints.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {marketAnalysis.map((analysis, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-matte-black/50 border border-royal-green/30 rounded-xl overflow-hidden hover:border-royal-green/60 transition-all"
              >
                {/* Header */}
                <div
                  className={`
                  p-4 border-b border-royal-green/30
                  ${analysis.bias === 'BULLISH' ? 'bg-green-500/10' : 'bg-red-500/10'}
                `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-white">{analysis.title}</h3>
                    <div
                      className={`
                      px-3 py-1 rounded-full text-sm font-bold
                      ${analysis.bias === 'BULLISH' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}
                    `}
                    >
                      {analysis.bias === 'BULLISH' ? (
                        <TrendingUp className="w-4 h-4 inline mr-1" />
                      ) : (
                        <TrendingDown className="w-4 h-4 inline mr-1" />
                      )}
                      {analysis.bias}
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{analysis.pair}</span>
                    <span>•</span>
                    <span>{analysis.timeframe}</span>
                    <span>•</span>
                    <span className="text-accent-gold">{analysis.probability} Probability</span>
                  </div>
                </div>

                {/* Analysis */}
                <div className="p-4">
                  <div className="mb-4">
                    <div className="flex items-start gap-2 mb-3">
                      <Activity className="w-5 h-5 text-royal-emerald flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-sm text-gray-400 mb-1">Market Analysis:</div>
                        <p className="text-gray-300 text-sm leading-relaxed">{analysis.analysis}</p>
                      </div>
                    </div>
                  </div>

                  {/* Trade Parameters */}
                  <div className="bg-royal-green/10 border border-royal-green/30 rounded-lg p-4 mb-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Entry Zone:</span>
                      <span className="text-white font-semibold">{analysis.entry}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Stop Loss:</span>
                      <span className="text-red-400 font-semibold">{analysis.sl}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400 text-sm">Take Profit:</span>
                      <span className="text-green-400 font-semibold">{analysis.tp}</span>
                    </div>
                  </div>

                  {/* Learning Link */}
                  <a
                    href={analysis.learningLink}
                    className="flex items-center justify-between p-3 bg-accent-gold/10 border border-accent-gold/30 rounded-lg text-accent-gold hover:bg-accent-gold/20 transition-all group"
                  >
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span className="text-sm font-semibold">Learn This Strategy</span>
                    </div>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Market Overview Widgets */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Forex Heatmap */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-matte-black/50 border border-royal-green/30 rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-royal-green/30">
              <h3 className="text-xl font-bold text-white">Forex Strength Heatmap</h3>
              <p className="text-sm text-gray-400">See which currencies are strongest right now</p>
            </div>
            <div className="p-4">
              <ForexHeatmapWidget />
            </div>
          </motion.div>

          {/* Economic Calendar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-matte-black/50 border border-royal-green/30 rounded-xl overflow-hidden"
          >
            <div className="p-4 border-b border-royal-green/30">
              <h3 className="text-xl font-bold text-white">Economic Calendar</h3>
              <p className="text-sm text-gray-400">Upcoming news events that move markets</p>
            </div>
            <div className="p-4">
              <EconomicCalendarWidget />
            </div>
          </motion.div>
        </div>

        {/* Market Screener */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-matte-black/50 border border-royal-green/30 rounded-xl overflow-hidden mb-12"
        >
          <div className="p-4 border-b border-royal-green/30">
            <h3 className="text-xl font-bold text-white">Forex Market Screener</h3>
            <p className="text-sm text-gray-400">
              Real-time technical analysis across all major pairs
            </p>
          </div>
          <div className="p-4">
            <MarketScreenerWidget />
          </div>
        </motion.div>

        {/* Educational Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-accent-gold/10 border border-accent-gold/30 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-accent-gold mb-3">Educational Purpose Only</h3>
          <p className="text-gray-300 leading-relaxed">
            All analysis and trade examples on this page are for educational purposes only. They
            demonstrate how to apply the Royal Flow Doctrine to real market conditions. Always
            practice on a demo account first and never risk more than you can afford to lose. Past
            performance does not guarantee future results.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
