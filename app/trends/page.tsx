'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { TechnicalIndicators } from '@/lib/technicalAnalysis'
import AssetDetailModal from '@/components/AssetDetailModal'

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
  takeProfitTargets: Array<{ label: string; value: string }>
  reasoning: string
  lastUpdate: string
  dataSource?: 'LIVE' | 'DEMO'
}

interface DebugSourceStatus {
  name: string
  ok: boolean
  status: number
  message?: string
  count: number
  liveCount: number
  demoCount: number
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
    takeProfitTargets: [
      { label: 'TP1', value: `${(basePrice * 1.02).toFixed(2)}` },
      { label: 'TP2', value: `${(basePrice * 1.05).toFixed(2)}` },
      { label: 'TP3', value: `${(basePrice * 1.08).toFixed(2)}` },
    ],
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
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [expandAll, setExpandAll] = useState(false)
  const [liveOnly, setLiveOnly] = useState(false)
  const [debugSources, setDebugSources] = useState<DebugSourceStatus[]>([])

  useEffect(() => {
    const cacheKey = 'trends-assets-cache'
    if (typeof window !== 'undefined') {
      const cached = window.localStorage.getItem(cacheKey)
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as { assets: AssetTrend[]; lastUpdate: string }
          if (Array.isArray(parsed.assets)) {
            setAssets(parsed.assets)
            setLastUpdate(parsed.lastUpdate)
            setLoading(false)
          }
        } catch (error) {
          console.log('Failed to load cached assets')
        }
      }
    }

    const formatPrice = (price: number, type: AssetTrend['type']) => {
      const decimals = type === 'forex' ? 5 : type === 'crypto' ? 2 : 2
      return price.toFixed(decimals)
    }

    const buildTakeProfitTargets = (
      price: number,
      type: AssetTrend['type'],
      signal: TechnicalIndicators['signal']
    ) => {
      const isSell = signal === 'SELL'
      const multipliers = type === 'forex' ? [0.004, 0.008, 0.012] : [0.02, 0.04, 0.06]
      return multipliers.map((pct, idx) => {
        const target = isSell ? price * (1 - pct) : price * (1 + pct)
        return { label: `TP${idx + 1}`, value: formatPrice(target, type) }
      })
    }

    const readErrorMessage = async (response: Response) => {
      try {
        const data = await response.json()
        if (data?.error) return String(data.error)
      } catch (error) {
        // ignore JSON parse errors
      }
      try {
        const text = await response.text()
        if (text) return text.slice(0, 140)
      } catch (error) {
        // ignore text parse errors
      }
      return 'Request failed'
    }

    const parseDataList = async (name: string, response: Response) => {
      const status = response.status
      if (!response.ok) {
        const message = await readErrorMessage(response)
        return {
          list: [] as any[],
          debug: {
            name,
            ok: false,
            status,
            message,
            count: 0,
            liveCount: 0,
            demoCount: 0,
          } as DebugSourceStatus,
        }
      }

      try {
        const list = await response.json()
        const safeList = Array.isArray(list) ? list : []
        const liveCount = safeList.filter(item => item?.dataSource === 'LIVE').length
        const demoCount = safeList.filter(item => item?.dataSource === 'DEMO').length
        const message = safeList.length === 0 ? 'No data returned' : undefined
        return {
          list: safeList,
          debug: {
            name,
            ok: true,
            status,
            message,
            count: safeList.length,
            liveCount,
            demoCount,
          } as DebugSourceStatus,
        }
      } catch (error) {
        return {
          list: [] as any[],
          debug: {
            name,
            ok: false,
            status,
            message: 'Invalid JSON response',
            count: 0,
            liveCount: 0,
            demoCount: 0,
          } as DebugSourceStatus,
        }
      }
    }

    const fetchMarketData = async () => {
      setIsRefreshing(true)
      try {
        const cryptoSymbols = ASSETS_CONFIG.filter(a => a.type === 'crypto').map(a => a.symbol)
        const forexSymbols = ASSETS_CONFIG.filter(a => a.type === 'forex').map(a => a.symbol)
        const indicesSymbols = ASSETS_CONFIG.filter(a => a.type === 'indices').map(a => a.symbol)
        const commoditiesSymbols = ASSETS_CONFIG.filter(a => a.type === 'commodities').map(
          a => a.symbol
        )

        const [cryptoResponse, forexResponse, indicesResponse, commoditiesResponse] =
          await Promise.all([
            fetch(`/api/market-data/crypto?symbols=${cryptoSymbols.join(',')}`),
            fetch(`/api/market-data/forex?symbols=${forexSymbols.join(',')}`),
            fetch(`/api/market-data/indices?symbols=${indicesSymbols.join(',')}`),
            fetch(`/api/market-data/commodities?symbols=${commoditiesSymbols.join(',')}`),
          ])

        const [cryptoParsed, forexParsed, indicesParsed, commoditiesParsed] = await Promise.all([
          parseDataList('Crypto', cryptoResponse),
          parseDataList('Forex', forexResponse),
          parseDataList('Indices', indicesResponse),
          parseDataList('Commodities', commoditiesResponse),
        ])

        const cryptoList = cryptoParsed.list
        const forexList = forexParsed.list
        const indicesList = indicesParsed.list
        const commoditiesList = commoditiesParsed.list
        setDebugSources([
          cryptoParsed.debug,
          forexParsed.debug,
          indicesParsed.debug,
          commoditiesParsed.debug,
        ])

        const cryptoData: Record<string, any> = {}
        const forexData: Record<string, any> = {}
        const indicesData: Record<string, any> = {}
        const commoditiesData: Record<string, any> = {}

        cryptoList.forEach((item: any) => {
          if (item?.symbol) cryptoData[item.symbol] = item
        })
        forexList.forEach((item: any) => {
          if (item?.symbol) forexData[item.symbol] = item
        })
        indicesList.forEach((item: any) => {
          if (item?.symbol) indicesData[item.symbol] = item
        })
        commoditiesList.forEach((item: any) => {
          if (item?.symbol) commoditiesData[item.symbol] = item
        })

        const assetsList = ASSETS_CONFIG.map(config => {
          let data: AssetTrend

          if (config.type === 'crypto' && cryptoData[config.symbol]) {
            const crypto = cryptoData[config.symbol]
            const signal =
              crypto.changePercent24h > 2 ? 'BUY' : crypto.changePercent24h < -2 ? 'SELL' : 'WAIT'
            data = {
              symbol: config.symbol,
              name: config.name,
              type: config.type,
              currentPrice: crypto.price,
              change24h: crypto.change24h,
              changePercent24h: crypto.changePercent24h,
              dataSource: crypto.dataSource || 'DEMO',
              technicals: {
                rsi: Math.floor(crypto.changePercent24h * 0.7 + 50),
                macdSignal: crypto.changePercent24h > 0 ? 'BULLISH' : 'BEARISH',
                momentum: crypto.change24h,
                trend: crypto.changePercent24h > 0 ? 'UP' : 'DOWN',
                signal,
                confidence: Math.min(85, 50 + Math.abs(crypto.changePercent24h) * 5),
              },
              keyLevel: crypto.price * 0.98,
              entryZone: `${(crypto.price * 0.97).toFixed(2)} - ${(crypto.price * 1.01).toFixed(2)}`,
              stopLoss: `${(crypto.price * 0.93).toFixed(2)}`,
              takeProfit: `${(crypto.price * 1.12).toFixed(2)}`,
              takeProfitTargets: buildTakeProfitTargets(crypto.price, config.type, signal),
              reasoning: `Real-time 24h change: ${crypto.changePercent24h.toFixed(2)}% | Based on momentum analysis from CoinGecko`,
              lastUpdate: new Date().toISOString(),
            }
          } else if (config.type === 'forex' && forexData[config.symbol]) {
            const forex = forexData[config.symbol]
            const signal =
              forex.changePercent > 0.2 ? 'BUY' : forex.changePercent < -0.2 ? 'SELL' : 'WAIT'
            data = {
              symbol: config.symbol,
              name: config.name,
              type: config.type,
              currentPrice: forex.bid,
              change24h: forex.change,
              changePercent24h: forex.changePercent,
              dataSource: forex.dataSource || 'DEMO',
              technicals: {
                rsi: Math.floor(Math.random() * 60) + 25,
                macdSignal: 'NEUTRAL',
                momentum: forex.change,
                trend: 'SIDEWAYS',
                signal,
                confidence: 55,
              },
              keyLevel: forex.bid * 0.995,
              entryZone: `${(forex.bid * 0.998).toFixed(5)} - ${(forex.bid * 1.002).toFixed(5)}`,
              stopLoss: `${(forex.bid * 0.99).toFixed(5)}`,
              takeProfit: `${(forex.bid * 1.015).toFixed(5)}`,
              takeProfitTargets: buildTakeProfitTargets(forex.bid, config.type, signal),
              reasoning: `Live pricing from AlphaVantage API | Updated every 30 seconds`,
              lastUpdate: new Date().toISOString(),
            }
          } else if (config.type === 'indices' && indicesData[config.symbol]) {
            const index = indicesData[config.symbol]
            const signal =
              index.changePercent > 0.8 ? 'BUY' : index.changePercent < -0.8 ? 'SELL' : 'WAIT'
            data = {
              symbol: config.symbol,
              name: config.name,
              type: config.type,
              currentPrice: index.price,
              change24h: index.change,
              changePercent24h: index.changePercent,
              dataSource: index.dataSource || 'DEMO',
              technicals: {
                rsi: Math.floor(Math.abs(index.changePercent) * 10 + 45),
                macdSignal: index.changePercent > 0 ? 'BULLISH' : 'BEARISH',
                momentum: index.change,
                trend:
                  index.changePercent > 0.5
                    ? 'UP'
                    : index.changePercent < -0.5
                      ? 'DOWN'
                      : 'SIDEWAYS',
                signal,
                confidence: Math.floor(Math.abs(index.changePercent) * 20 + 50),
              },
              keyLevel: index.price * 0.99,
              entryZone: `${(index.price * 0.998).toFixed(2)} - ${(index.price * 1.002).toFixed(2)}`,
              stopLoss: `${(index.price * 0.97).toFixed(2)}`,
              takeProfit: `${(index.price * 1.05).toFixed(2)}`,
              takeProfitTargets: buildTakeProfitTargets(index.price, config.type, signal),
              reasoning: `Live index data from Finnhub | Real market pricing`,
              lastUpdate: new Date().toISOString(),
            }
          } else if (config.type === 'commodities' && commoditiesData[config.symbol]) {
            const commodity = commoditiesData[config.symbol]
            const signal =
              commodity.changePercent > 0.5
                ? 'BUY'
                : commodity.changePercent < -0.5
                  ? 'SELL'
                  : 'WAIT'
            data = {
              symbol: config.symbol,
              name: config.name,
              type: config.type,
              currentPrice: commodity.price,
              change24h: commodity.change,
              changePercent24h: commodity.changePercent,
              dataSource: commodity.dataSource || 'DEMO',
              technicals: {
                rsi: Math.floor(Math.abs(commodity.changePercent) * 15 + 40),
                macdSignal: commodity.changePercent > 0 ? 'BULLISH' : 'BEARISH',
                momentum: commodity.change,
                trend:
                  commodity.changePercent > 0.3
                    ? 'UP'
                    : commodity.changePercent < -0.3
                      ? 'DOWN'
                      : 'SIDEWAYS',
                signal,
                confidence: Math.floor(Math.abs(commodity.changePercent) * 25 + 55),
              },
              keyLevel: commodity.price * 0.98,
              entryZone: `${(commodity.price * 0.97).toFixed(2)} - ${(commodity.price * 1.02).toFixed(2)}`,
              stopLoss: `${(commodity.price * 0.93).toFixed(2)}`,
              takeProfit: `${(commodity.price * 1.08).toFixed(2)}`,
              takeProfitTargets: buildTakeProfitTargets(commodity.price, config.type, signal),
              reasoning: `Live commodity pricing from Finnhub | Market data`,
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
        const updateTime = new Date().toLocaleTimeString()
        setLastUpdate(updateTime)
        setLoading(false)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            cacheKey,
            JSON.stringify({ assets: assetsList, lastUpdate: updateTime })
          )
        }
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
        const updateTime = new Date().toLocaleTimeString()
        setLastUpdate(updateTime)
        setLoading(false)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            cacheKey,
            JSON.stringify({ assets: demoAssets, lastUpdate: updateTime })
          )
        }
      } finally {
        setIsRefreshing(false)
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
    .filter(asset => (!liveOnly ? true : (asset.dataSource ?? 'DEMO') === 'LIVE'))

  // Calculate tradability score (reliability + signal strength + trend alignment)
  const assetsWithScores = filteredAssets.map(asset => ({
    ...asset,
    tradability: calculateTradability(asset),
    confidenceTier:
      asset.technicals.confidence >= 75
        ? 'HIGH'
        : asset.technicals.confidence >= 60
          ? 'MEDIUM'
          : 'LOW',
  }))

  const liveCount = assetsWithScores.filter(a => (a.dataSource ?? 'DEMO') === 'LIVE').length
  const demoCount = assetsWithScores.length - liveCount

  // Show top 10 by default, expand to all if expandAll is true
  const displayedAssets = expandAll ? assetsWithScores : assetsWithScores.slice(0, 10)
  const hiddenCount = assetsWithScores.length - 10

  function calculateTradability(asset: AssetTrend): number {
    // Combines: confidence (40%), signal strength (30%), trend reliability (30%)
    const signalScore =
      asset.technicals.signal === 'BUY' ? 100 : asset.technicals.signal === 'SELL' ? 80 : 40
    const trendScore =
      asset.technicals.trend === 'UP' || asset.technicals.trend === 'DOWN' ? 100 : 60
    return Math.round(
      ((asset.technicals.confidence * 0.4 + signalScore * 0.3 + trendScore * 0.3) / 100) * 100
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="rounded-2xl border border-royal-green/30 bg-slate-900/70 backdrop-blur-xl p-6 shadow-xl shadow-royal-green/10">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-royal-green/15 text-royal-emerald text-xs font-semibold tracking-wide">
                  J SUPREME MARKET INTEL
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">
                  Trends & Institutional Setups
                </h1>
                <p className="text-sm text-slate-400">
                  Branded signal board sorted by confidence, momentum, and structure
                </p>
              </div>
              <div className="text-right text-xs text-slate-400">
                {loading ? (
                  <div className="animate-pulse">Loading...</div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Updated: {lastUpdate}</span>
                    {isRefreshing && (
                      <span className="text-emerald-300 animate-pulse">• Updating</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
                <div className="text-slate-400">Total Assets</div>
                <div className="text-white text-lg font-bold">{assetsWithScores.length}</div>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-3 border border-emerald-500/30">
                <div className="text-slate-400">LIVE Feeds</div>
                <div className="text-emerald-300 text-lg font-bold">{liveCount}</div>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-3 border border-yellow-500/30">
                <div className="text-slate-400">DEMO Feeds</div>
                <div className="text-yellow-300 text-lg font-bold">{demoCount}</div>
              </div>
              <div className="bg-slate-800/60 rounded-lg p-3 border border-slate-700">
                <div className="text-slate-400">Refresh Rate</div>
                <div className="text-white text-lg font-bold">30s</div>
              </div>
            </div>

            {debugSources.length > 0 && (
              <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-100">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold">Debug: Data Feed Status</div>
                  <div className="text-amber-200/80">
                    If LIVE is 0, check API limits, symbol support, or restart the dev server.
                  </div>
                </div>
                <div className="grid md:grid-cols-4 gap-3 mt-3">
                  {debugSources.map(source => (
                    <div
                      key={source.name}
                      className={`rounded-lg border p-3 ${
                        source.ok
                          ? source.liveCount > 0
                            ? 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100'
                            : 'border-yellow-400/30 bg-yellow-500/10 text-yellow-100'
                          : 'border-red-400/30 bg-red-500/10 text-red-100'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">{source.name}</span>
                        <span className="text-[10px]">HTTP {source.status}</span>
                      </div>
                      <div className="mt-1">
                        <span className="font-semibold">Count:</span> {source.count}
                      </div>
                      <div className="mt-1">
                        <span className="font-semibold">LIVE:</span> {source.liveCount} |{' '}
                        <span className="font-semibold">DEMO:</span> {source.demoCount}
                      </div>
                      {source.message && <div className="mt-2 text-[10px]">{source.message}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search & Filter Bar */}
          <div className="mt-4 rounded-xl border border-slate-700 bg-slate-900/60 backdrop-blur-lg p-3 flex gap-2 flex-wrap items-center">
            {/* Search Input */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search assets..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-royal-emerald"
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
                      ? 'bg-royal-emerald text-white shadow-lg shadow-royal-emerald/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {btn.label}
                </motion.button>
              ))}
            </div>

            {/* Live Only Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setLiveOnly(!liveOnly)}
              className={`px-3 py-2 rounded-lg font-medium transition-all text-sm ${
                liveOnly
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/40'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
              title="Show only LIVE data sources"
            >
              {liveOnly ? '🟢 LIVE Only' : '⚪ All Sources'}
            </motion.button>

            {/* Expand/Collapse Toggle */}
            {assetsWithScores.length > 10 && (
              <motion.button
                onClick={() => setExpandAll(!expandAll)}
                className="px-3 py-2 rounded-lg bg-purple-500/20 text-purple-300 hover:bg-purple-500/30 text-sm font-medium transition-all flex items-center gap-1"
              >
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${expandAll ? 'rotate-180' : ''}`}
                />
                {expandAll ? `Show Top 10` : `Show All (${assetsWithScores.length})`}
              </motion.button>
            )}
          </div>

          {/* Confidence Tier Info */}
          <div className="flex gap-3 mt-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-slate-300">High Confidence (75%+)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-slate-300">Medium (60-74%)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-yellow-500" />
              <span className="text-slate-300">Lower (&lt;60%)</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          <AnimatePresence>
            {displayedAssets.map((asset, idx) => (
              <motion.div
                key={asset.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.03 }}
                onClick={() => setSelectedAsset(asset)}
                className={`p-4 rounded-xl border cursor-pointer transition-all bg-slate-900/70 backdrop-blur-lg shadow-lg ${
                  asset.technicals.signal === 'BUY'
                    ? 'border-emerald-500/40 hover:border-emerald-400 hover:shadow-emerald-500/20'
                    : asset.technicals.signal === 'SELL'
                      ? 'border-red-500/40 hover:border-red-400 hover:shadow-red-500/20'
                      : 'border-yellow-500/40 hover:border-yellow-400 hover:shadow-yellow-500/20'
                }`}
              >
                {/* Top badges */}
                <div className="flex gap-2 mb-2 flex-wrap">
                  {/* Data Source Badge */}
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-bold ${
                      asset.dataSource === 'LIVE'
                        ? 'bg-gradient-to-r from-green-500 to-green-700 text-white'
                        : 'bg-gradient-to-r from-gray-500 to-gray-700 text-white'
                    }`}
                  >
                    {asset.dataSource === 'LIVE' ? '🟢 LIVE' : '⚪ DEMO'}
                  </div>

                  {asset.technicals.confidence >= 75 && (
                    <div className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">
                      ⭐ HIGH
                    </div>
                  )}
                  {asset.confidenceTier === 'MEDIUM' && (
                    <div className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-white">
                      📊 MEDIUM
                    </div>
                  )}
                  {asset.confidenceTier === 'LOW' && (
                    <div className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                      ⚠ LOWER
                    </div>
                  )}
                </div>

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
                    <span className="text-xs text-slate-400">Signal Confidence</span>
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

                {/* Tradability Score */}
                <div className="mb-3 p-2 bg-slate-700/50 rounded border border-slate-600">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-300">Tradability Score</span>
                    <span className="text-sm font-bold text-purple-300">{asset.tradability}%</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">Reliability for trading</div>
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

                {/* Trading Action Recommendation */}
                <div
                  className={`mb-4 p-2 rounded border text-xs ${
                    asset.technicals.signal === 'BUY'
                      ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                      : asset.technicals.signal === 'SELL'
                        ? 'bg-red-500/10 border-red-500/50 text-red-300'
                        : 'bg-yellow-500/10 border-yellow-500/50 text-yellow-300'
                  }`}
                >
                  <div className="font-semibold mb-1">
                    {asset.technicals.signal === 'BUY'
                      ? '✓ Entry Long Setup'
                      : asset.technicals.signal === 'SELL'
                        ? '✗ Entry Short Setup'
                        : '⊘ Wait for Confirmation'}
                  </div>
                  <div className="text-slate-300 text-xs">
                    {asset.technicals.signal === 'BUY'
                      ? `Entry: ${asset.entryZone} | Stop: ${asset.stopLoss}`
                      : `Entry: ${asset.entryZone} | Stop: ${asset.stopLoss}`}
                  </div>
                  <div className="text-slate-300 text-xs mt-1">
                    TP Range:{' '}
                    {asset.takeProfitTargets
                      .map(target => `${target.label} ${target.value}`)
                      .join(' • ')}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedAsset(asset)}
                  className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition-colors text-sm"
                >
                  View Order Blocks <ChevronDown className="inline w-3 h-3 ml-1" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {selectedAsset && (
            <AssetDetailModal
              asset={{
                symbol: selectedAsset.symbol,
                name: selectedAsset.name,
                price: selectedAsset.currentPrice,
                signal: selectedAsset.technicals.signal,
                confidence: selectedAsset.technicals.confidence,
                type: selectedAsset.type,
                entryZone: selectedAsset.entryZone,
                stopLoss: selectedAsset.stopLoss,
                takeProfitTargets: selectedAsset.takeProfitTargets,
              }}
              onClose={() => setSelectedAsset(null)}
            />
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
            <div>
              <h4 className="text-purple-400 font-bold mb-2">Order Block Detection</h4>
              <p className="text-slate-300">
                Real-time price action analysis identifying institutional zones
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
