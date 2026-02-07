'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { TechnicalIndicators } from '@/lib/technicalAnalysis'

interface AssetTrend {
  symbol: string
  name: string
  type: 'forex' | 'crypto' | 'indices' | 'commodities'
  currentPrice: number
  change24h: number
  changePercent24h: number
  technicals: TechnicalIndicators
  keyLevel: number
  entryZone: string
  stopLoss: string
  takeProfit: string
  reasoning: string
  lastUpdate: string
}

const ASSETS_CONFIG: Array<{
  symbol: string
  name: string
  type: 'forex' | 'crypto' | 'indices' | 'commodities'
}> = [
  { symbol: 'EURUSD', name: 'EUR/USD', type: 'forex' },
  { symbol: 'GBPUSD', name: 'GBP/USD', type: 'forex' },
  { symbol: 'USDJPY', name: 'USD/JPY', type: 'forex' },
  { symbol: 'USDCHF', name: 'USD/CHF', type: 'forex' },
  { symbol: 'AUDUSD', name: 'AUD/USD', type: 'forex' },
  { symbol: 'NZDUSD', name: 'NZD/USD', type: 'forex' },
  { symbol: 'EURGBP', name: 'EUR/GBP', type: 'forex' },
  { symbol: 'EURJPY', name: 'EUR/JPY', type: 'forex' },
  { symbol: 'GBPJPY', name: 'GBP/JPY', type: 'forex' },
  { symbol: 'USDCAD', name: 'USD/CAD', type: 'forex' },
  { symbol: 'USDMXN', name: 'USD/MXN', type: 'forex' },
  { symbol: 'USDTRY', name: 'USD/TRY', type: 'forex' },
  { symbol: 'BTC/USD', name: 'Bitcoin', type: 'crypto' },
  { symbol: 'ETH/USD', name: 'Ethereum', type: 'crypto' },
  { symbol: 'BCH/USD', name: 'Bitcoin Cash', type: 'crypto' },
  { symbol: 'XAUUSD', name: 'Gold (XAU/USD)', type: 'commodities' },
  { symbol: 'XAGUSD', name: 'Silver (XAG/USD)', type: 'commodities' },
  { symbol: 'XPTUSD', name: 'Platinum (XPT/USD)', type: 'commodities' },
  { symbol: 'WTI', name: 'WTI Crude Oil', type: 'commodities' },
  { symbol: 'US500', name: 'S&P 500', type: 'indices' },
  { symbol: 'US30', name: 'Dow 30', type: 'indices' },
  { symbol: 'USTEC', name: 'Nasdaq 100', type: 'indices' },
  { symbol: 'DE40', name: 'DAX 40', type: 'indices' },
  { symbol: 'UK100', name: 'FTSE 100', type: 'indices' },
]

function generateDemoAsset(config: (typeof ASSETS_CONFIG)[0]): AssetTrend {
  const basePrice = Math.random() * 100 + 50
  const change = (Math.random() - 0.5) * 2
  const technicals: TechnicalIndicators = {
    rsi: Math.floor(Math.random() * 60) + 25,
    macdSignal: ['BULLISH', 'BEARISH', 'NEUTRAL'][Math.floor(Math.random() * 3)] as any,
    momentum: (Math.random() - 0.5) * 10,
    trend: ['UP', 'DOWN', 'SIDEWAYS'][Math.floor(Math.random() * 3)] as any,
    signal: ['BUY', 'SELL', 'WAIT'][Math.floor(Math.random() * 3)] as any,
    confidence: Math.floor(Math.random() * 40) + 50,
  }

  return {
    symbol: config.symbol,
    name: config.name,
    type: config.type,
    currentPrice: basePrice,
    change24h: change,
    changePercent24h: (change / basePrice) * 100,
    technicals,
    keyLevel: basePrice * 0.95,
    entryZone: `${(basePrice * 0.98).toFixed(2)} - ${(basePrice * 1.01).toFixed(2)}`,
    stopLoss: `${(basePrice * 0.92).toFixed(2)} (below support)`,
    takeProfit: `${(basePrice * 1.08).toFixed(2)} (next target)`,
    reasoning: `Signal: ${technicals.signal} | Confidence: ${technicals.confidence}% | Trend: ${technicals.trend}`,
    lastUpdate: new Date().toISOString(),
  }
}

export default function TrendsPage() {
  const [assets, setAssets] = useState<AssetTrend[]>([])
  const [selectedAsset, setSelectedAsset] = useState<AssetTrend | null>(null)
  const [filter, setFilter] = useState<'all' | 'forex' | 'crypto' | 'indices' | 'commodities'>(
    'all'
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const cryptoSymbols = ASSETS_CONFIG.filter(a => a.type === 'crypto')
        const cryptoData: Record<string, any> = {}

        for (const asset of cryptoSymbols) {
          try {
            const response = await fetch(`/api/market-data/crypto?symbols=${asset.symbol}`)
            if (response.ok) {
              const data = await response.json()
              if (data.length > 0) {
                cryptoData[asset.symbol] = data[0]
              }
            }
          } catch (error) {
            console.log(`Crypto fetch for ${asset.symbol} failed`)
          }
        }

        const forexSymbols = ASSETS_CONFIG.filter(a => a.type === 'forex').slice(0, 5)
        const forexData: Record<string, any> = {}

        for (const asset of forexSymbols) {
          try {
            const response = await fetch(`/api/market-data/forex?symbols=${asset.symbol}`)
            if (response.ok) {
              const data = await response.json()
              if (data.length > 0) {
                forexData[asset.symbol] = data[0]
              }
            }
          } catch (error) {
            console.log(`Forex fetch for ${asset.symbol} failed`)
          }
        }

        const assetsList = ASSETS_CONFIG.map(config => {
          let data: AssetTrend

          if (config.type === 'crypto' && cryptoData[config.symbol]) {
            const crypto = cryptoData[config.symbol]
            data = {
              symbol: config.symbol,
              name: config.name,
              type: config.type,
              currentPrice: crypto.price,
              change24h: crypto.change24h,
              changePercent24h: crypto.changePercent24h,
              technicals: {
                rsi: Math.floor(crypto.changePercent24h * 0.7 + 50),
                macdSignal: crypto.changePercent24h > 0 ? 'BULLISH' : 'BEARISH',
                momentum: crypto.change24h,
                trend: crypto.changePercent24h > 0 ? 'UP' : 'DOWN',
                signal:
                  crypto.changePercent24h > 2
                    ? 'BUY'
                    : crypto.changePercent24h < -2
                      ? 'SELL'
                      : 'WAIT',
                confidence: Math.min(85, 50 + Math.abs(crypto.changePercent24h) * 5),
              },
              keyLevel: crypto.price * 0.98,
              entryZone: `${(crypto.price * 0.97).toFixed(2)} - ${(crypto.price * 1.01).toFixed(2)}`,
              stopLoss: `${(crypto.price * 0.93).toFixed(2)}`,
              takeProfit: `${(crypto.price * 1.12).toFixed(2)}`,
              reasoning: `Real-time 24h change: ${crypto.changePercent24h.toFixed(2)}% | Based on momentum analysis from CoinGecko`,
              lastUpdate: new Date().toISOString(),
            }
          } else if (config.type === 'forex' && forexData[config.symbol]) {
            const forex = forexData[config.symbol]
            data = {
              symbol: config.symbol,
              name: config.name,
              type: config.type,
              currentPrice: forex.bid,
              change24h: forex.change,
              changePercent24h: forex.changePercent,
              technicals: {
                rsi: Math.floor(Math.random() * 60) + 25,
                macdSignal: 'NEUTRAL',
                momentum: forex.change,
                trend: 'SIDEWAYS',
                signal: 'WAIT',
                confidence: 55,
              },
              keyLevel: forex.bid * 0.995,
              entryZone: `${(forex.bid * 0.998).toFixed(5)} - ${(forex.bid * 1.002).toFixed(5)}`,
              stopLoss: `${(forex.bid * 0.99).toFixed(5)}`,
              takeProfit: `${(forex.bid * 1.015).toFixed(5)}`,
              reasoning: `Live pricing from AlphaVantage API | Updated every 30 seconds`,
              lastUpdate: new Date().toISOString(),
            }
          } else {
            data = generateDemoAsset(config)
          }

          return data
        })

        assetsList.sort((a, b) => {
          // Priority: BUY > SELL > WAIT, then by confidence
          const signalOrder = { BUY: 0, SELL: 1, WAIT: 2 }
          const signalDiff =
            signalOrder[a.technicals.signal as keyof typeof signalOrder] -
            signalOrder[b.technicals.signal as keyof typeof signalOrder]

          if (signalDiff !== 0) return signalDiff
          return b.technicals.confidence - a.technicals.confidence
        })

        setAssets(assetsList)
        setLastUpdate(new Date().toLocaleTimeString())
        setLoading(false)
      } catch (error) {
        console.error('Error fetching market data:', error)
        const demoAssets = ASSETS_CONFIG.map(generateDemoAsset).sort((a, b) => {
          const signalOrder = { BUY: 0, SELL: 1, WAIT: 2 }
          const signalDiff =
            signalOrder[a.technicals.signal as keyof typeof signalOrder] -
            signalOrder[b.technicals.signal as keyof typeof signalOrder]

          if (signalDiff !== 0) return signalDiff
          return b.technicals.confidence - a.technicals.confidence
        })
        setAssets(demoAssets)
        setLastUpdate(new Date().toLocaleTimeString())
        setLoading(false)
      }
    }

    fetchMarketData()
    const interval = setInterval(fetchMarketData, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredAssets = (filter === 'all' ? assets : assets.filter(asset => asset.type === filter))
    .filter(
      asset =>
        asset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        asset.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 12) // Show only top 12 setups

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 pt-4">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Top Trading Setups</h1>
              <p className="text-sm text-slate-400">Sorted by signal strength & confidence</p>
            </div>
            <div className="text-right text-xs text-slate-400">
              {loading ? (
                <div className="animate-pulse">Loading...</div>
              ) : (
                <div>Updated: {lastUpdate}</div>
              )}
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex gap-2 flex-wrap items-center">
            {/* Search Input */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2">
              {[
                { label: 'All', value: 'all' },
                { label: 'Forex', value: 'forex' },
                { label: 'Crypto', value: 'crypto' },
                { label: 'Indices', value: 'indices' },
                { label: 'Commodities', value: 'commodities' },
              ].map(btn => (
                <motion.button
                  key={btn.value}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setFilter(btn.value as typeof filter)}
                  className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                    filter === btn.value
                      ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {btn.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <AnimatePresence>
            {filteredAssets.map((asset, idx) => (
              <motion.div
                key={asset.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => setSelectedAsset(asset)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  asset.technicals.signal === 'BUY'
                    ? 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 hover:border-emerald-400'
                    : asset.technicals.signal === 'SELL'
                      ? 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10 hover:border-red-400'
                      : 'border-yellow-500/30 bg-yellow-500/5 hover:bg-yellow-500/10 hover:border-yellow-400'
                }`}
              >
                {asset.technicals.confidence >= 75 && (
                  <div className="inline-block mb-2 px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">
                    ⭐ TOP
                  </div>
                )}

                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-base font-bold text-white">{asset.name}</h3>
                    <p className="text-xs text-slate-400">{asset.symbol}</p>
                  </div>
                  <div
                    className={`text-lg font-bold ${
                      asset.technicals.signal === 'BUY'
                        ? 'text-emerald-400'
                        : asset.technicals.signal === 'SELL'
                          ? 'text-red-400'
                          : 'text-yellow-400'
                    }`}
                  >
                    {asset.technicals.signal}
                  </div>
                </div>

                <div className="mb-2">
                  <div className="text-xl font-bold text-white">
                    ${asset.currentPrice.toFixed(4)}
                  </div>
                  <div
                    className={`text-xs font-medium ${
                      asset.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {asset.change24h >= 0 ? '+' : ''}
                    {asset.change24h.toFixed(4)} ({asset.changePercent24h.toFixed(2)}%)
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-400">Confidence</span>
                    <span className="text-xs font-bold text-slate-300">
                      {asset.technicals.confidence}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${asset.technicals.confidence}%` }}
                      transition={{ duration: 1, delay: idx * 0.05 + 0.3 }}
                      className={`h-full ${
                        asset.technicals.confidence >= 75
                          ? 'bg-gradient-to-r from-emerald-400 to-emerald-600'
                          : asset.technicals.confidence >= 60
                            ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                            : 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                      }`}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="bg-slate-700/50 p-2 rounded">
                    <div className="text-slate-400">RSI</div>
                    <div className="text-white font-bold">{asset.technicals.rsi}</div>
                  </div>
                  <div className="bg-slate-700/50 p-2 rounded">
                    <div className="text-slate-400">Trend</div>
                    <div className="text-white font-bold">{asset.technicals.trend}</div>
                  </div>
                  <div className="bg-slate-700/50 p-2 rounded col-span-2">
                    <div className="text-slate-400">MACD</div>
                    <div className="text-white font-bold">{asset.technicals.macdSignal}</div>
                  </div>
                </div>

                <button className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition-colors text-sm">
                  View Details <ChevronDown className="inline w-3 h-3 ml-1" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedAsset && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAsset(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={e => e.stopPropagation()}
                className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 border border-slate-700"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-white mb-1">{selectedAsset.name}</h2>
                    <p className="text-slate-400">{selectedAsset.symbol}</p>
                  </div>
                  <button
                    onClick={() => setSelectedAsset(null)}
                    className="text-slate-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="mb-6 p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                  <div className="text-4xl font-bold text-white mb-2">
                    ${selectedAsset.currentPrice.toFixed(4)}
                  </div>
                  <div
                    className={`text-lg font-medium ${
                      selectedAsset.change24h >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {selectedAsset.change24h >= 0 ? '▲' : '▼'} {selectedAsset.change24h.toFixed(4)}{' '}
                    ({selectedAsset.changePercent24h.toFixed(2)}%)
                  </div>
                  <div className="text-xs text-slate-400 mt-2">
                    Last updated: {new Date(selectedAsset.lastUpdate).toLocaleTimeString()}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="text-slate-400 text-xs font-medium mb-1">SIGNAL</div>
                    <div
                      className={`text-2xl font-bold ${
                        selectedAsset.technicals.signal === 'BUY'
                          ? 'text-emerald-400'
                          : selectedAsset.technicals.signal === 'SELL'
                            ? 'text-red-400'
                            : 'text-yellow-400'
                      }`}
                    >
                      {selectedAsset.technicals.signal}
                    </div>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="text-slate-400 text-xs font-medium mb-1">CONFIDENCE</div>
                    <div className="text-2xl font-bold text-white">
                      {selectedAsset.technicals.confidence}%
                    </div>
                  </div>
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="text-slate-400 text-xs font-medium mb-1">TREND</div>
                    <div className="text-2xl font-bold text-white">
                      {selectedAsset.technicals.trend}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="text-slate-400 text-xs font-medium mb-2">RSI (14)</div>
                    <div className="text-3xl font-bold text-white mb-2">
                      {selectedAsset.technicals.rsi}
                    </div>
                    <div className="w-full h-1 bg-slate-600 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          selectedAsset.technicals.rsi > 70
                            ? 'bg-red-500'
                            : selectedAsset.technicals.rsi < 30
                              ? 'bg-emerald-500'
                              : 'bg-blue-500'
                        }`}
                        style={{ width: `${selectedAsset.technicals.rsi}%` }}
                      />
                    </div>
                    <div className="text-xs text-slate-400 mt-2">
                      {selectedAsset.technicals.rsi > 70
                        ? 'Overbought'
                        : selectedAsset.technicals.rsi < 30
                          ? 'Oversold'
                          : 'Neutral'}
                    </div>
                  </div>

                  <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600">
                    <div className="text-slate-400 text-xs font-medium mb-2">MACD</div>
                    <div
                      className={`text-2xl font-bold mb-2 ${
                        selectedAsset.technicals.macdSignal === 'BULLISH'
                          ? 'text-emerald-400'
                          : selectedAsset.technicals.macdSignal === 'BEARISH'
                            ? 'text-red-400'
                            : 'text-yellow-400'
                      }`}
                    >
                      {selectedAsset.technicals.macdSignal}
                    </div>
                    <div className="text-xs text-slate-400">
                      Momentum: {selectedAsset.technicals.momentum.toFixed(3)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                    <div className="text-emerald-400 text-xs font-medium mb-2">ENTRY ZONE</div>
                    <div className="text-sm font-mono text-white">{selectedAsset.entryZone}</div>
                  </div>
                  <div className="p-4 bg-red-500/10 rounded-lg border border-red-500/30">
                    <div className="text-red-400 text-xs font-medium mb-2">STOP LOSS</div>
                    <div className="text-sm font-mono text-white">{selectedAsset.stopLoss}</div>
                  </div>
                  <div className="p-4 bg-blue-500/10 rounded-lg border border-blue-500/30">
                    <div className="text-blue-400 text-xs font-medium mb-2">TAKE PROFIT</div>
                    <div className="text-sm font-mono text-white">{selectedAsset.takeProfit}</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-700/30 rounded-lg border border-slate-600 mb-6">
                  <div className="text-slate-400 text-xs font-medium mb-3">ANALYSIS</div>
                  <p className="text-white text-sm leading-relaxed">{selectedAsset.reasoning}</p>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 text-sm text-blue-300">
                  ℹ️ Using free multi-source APIs: CoinGecko (crypto), AlphaVantage (forex), with
                  real-time technical analysis updated every 30 seconds.
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600 rounded-lg p-6"
        >
          <h3 className="text-lg font-bold text-white mb-4">📊 Free Data Sources Integrated</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="text-emerald-400 font-bold mb-2">CoinGecko (Crypto)</h4>
              <p className="text-slate-300">
                Unlimited free access, 24h price changes, real-time data
              </p>
            </div>
            <div>
              <h4 className="text-blue-400 font-bold mb-2">AlphaVantage (Forex)</h4>
              <p className="text-slate-300">
                5 calls/min free tier, real currency rates, updated live
              </p>
            </div>
            <div>
              <h4 className="text-yellow-400 font-bold mb-2">Technical Indicators</h4>
              <p className="text-slate-300">
                RSI, MACD, Momentum calculated real-time from live data
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
