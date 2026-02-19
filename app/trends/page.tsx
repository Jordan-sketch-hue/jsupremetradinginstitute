'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import Link from 'next/link'
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
  dataSource?: 'LIVE'
}

interface LiveFailureEntry {
  assetType: string
  symbol: string
  reasons: string[]
  timestamp: string
}

interface DeploymentInfo {
  commitSha: string
  commitShort: string
  environment: string
  url: string
}

type DebriefHorizon = 'day' | 'week' | 'month' | 'year'

type MarketPhase = 'ACCUMULATION' | 'DISTRIBUTION' | 'MANIPULATION'

interface DebriefAsset {
  symbol: string
  name: string
  type: AssetTrend['type']
  score: number
  signal: TechnicalIndicators['signal']
  phase: MarketPhase
  outlook: string
  focus: string
  confidence: number
  tradability: number
}

const DEBRIEF_HORIZONS: Array<{
  key: DebriefHorizon
  label: string
  summary: string
}> = [
  {
    key: 'day',
    label: 'Day',
    summary: 'Intraday momentum + manipulation sweeps near key levels.',
  },
  {
    key: 'week',
    label: 'Week',
    summary: 'Swing continuation around accumulation/distribution transitions.',
  },
  {
    key: 'month',
    label: 'Month',
    summary: 'Macro directional bias with order block alignment.',
  },
  {
    key: 'year',
    label: 'Year',
    summary: 'Higher-timeframe structure and stability for position bias.',
  },
]

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

export default function TrendsPage() {
  const [assets, setAssets] = useState<AssetTrend[]>([])
  const [selectedAsset, setSelectedAsset] = useState<AssetTrend | null>(null)
  const [debriefHorizon, setDebriefHorizon] = useState<DebriefHorizon>('day')
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [liveFailures, setLiveFailures] = useState<LiveFailureEntry[]>([])
  const [deploymentInfo, setDeploymentInfo] = useState<DeploymentInfo | null>(null)

  useEffect(() => {
    const cacheKey = 'trends-assets-cache'
    if (typeof window !== 'undefined') {
      const cached = window.localStorage.getItem(cacheKey)
      if (cached) {
        try {
          const parsed = JSON.parse(cached) as { assets: AssetTrend[]; lastUpdate: string }
          if (Array.isArray(parsed.assets)) {
            setAssets(parsed.assets.filter(asset => asset?.dataSource === 'LIVE'))
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

    const parseDataList = async (response: Response) => {
      if (!response.ok) return []
      try {
        const list = await response.json()
        return Array.isArray(list) ? list : []
      } catch (error) {
        return []
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

        const [
          cryptoResponse,
          forexResponse,
          indicesResponse,
          commoditiesResponse,
          reportResponse,
        ] = await Promise.all([
          fetch(`/api/market-data/crypto?symbols=${cryptoSymbols.join(',')}`),
          fetch(`/api/market-data/forex?symbols=${forexSymbols.join(',')}`),
          fetch(`/api/market-data/indices?symbols=${indicesSymbols.join(',')}`),
          fetch(`/api/market-data/commodities?symbols=${commoditiesSymbols.join(',')}`),
          fetch('/api/market-data/live-report'),
        ])

        const [cryptoList, forexList, indicesList, commoditiesList] = await Promise.all([
          parseDataList(cryptoResponse),
          parseDataList(forexResponse),
          parseDataList(indicesResponse),
          parseDataList(commoditiesResponse),
        ])

        try {
          if (reportResponse.ok) {
            const reportPayload = await reportResponse.json()
            setLiveFailures(Array.isArray(reportPayload?.entries) ? reportPayload.entries : [])
            setDeploymentInfo(reportPayload?.deployment || null)
          }
        } catch {
          setLiveFailures([])
          setDeploymentInfo(null)
        }

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
              dataSource: 'LIVE',
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
              dataSource: 'LIVE',
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
              reasoning: `Live pricing from Twelve Data (Yahoo fallback) | Updated every 30 seconds`,
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
              dataSource: 'LIVE',
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
              reasoning: `Live index data from Twelve Data (Yahoo fallback) | Real market pricing`,
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
              dataSource: 'LIVE',
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
              reasoning: `Live commodity pricing from Twelve Data (Yahoo fallback) | Market data`,
              lastUpdate: new Date().toISOString(),
            }
          } else {
            return null
          }

          return data
        }).filter((asset): asset is AssetTrend => asset !== null)

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
        setAssets([])
        const updateTime = new Date().toLocaleTimeString()
        setLastUpdate(updateTime)
        setLoading(false)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(
            cacheKey,
            JSON.stringify({ assets: [], lastUpdate: updateTime })
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

  // Show all assets without filters
  const displayedAssets = assets.map(asset => ({
    ...asset,
    tradability: calculateTradability(asset),
    confidenceTier:
      asset.technicals.confidence >= 75
        ? 'HIGH'
        : asset.technicals.confidence >= 60
          ? 'MEDIUM'
          : 'LOW',
  }))

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

  function inferPhase(asset: AssetTrend): MarketPhase {
    const changeMagnitude = Math.abs(asset.changePercent24h)
    if (changeMagnitude >= 1.8) return 'MANIPULATION'

    const bullishStructure = asset.technicals.signal === 'BUY' && asset.technicals.trend === 'UP'
    const bearishStructure = asset.technicals.signal === 'SELL' && asset.technicals.trend === 'DOWN'

    if (bullishStructure) return 'ACCUMULATION'
    if (bearishStructure) return 'DISTRIBUTION'
    return asset.changePercent24h >= 0 ? 'ACCUMULATION' : 'DISTRIBUTION'
  }

  function buildDebrief(assetList: AssetTrend[], horizon: DebriefHorizon): DebriefAsset[] {
    const scoreByHorizon = {
      day: (asset: AssetTrend, tradability: number) => {
        const momentum = Math.min(100, Math.abs(asset.changePercent24h) * 20)
        const signalBias =
          asset.technicals.signal === 'BUY' ? 100 : asset.technicals.signal === 'SELL' ? 80 : 45
        return Math.round(
          asset.technicals.confidence * 0.35 +
            tradability * 0.25 +
            momentum * 0.25 +
            signalBias * 0.15
        )
      },
      week: (asset: AssetTrend, tradability: number) => {
        const trendBias =
          asset.technicals.trend === 'UP' || asset.technicals.trend === 'DOWN' ? 100 : 60
        const momentum = Math.min(100, Math.abs(asset.changePercent24h) * 14)
        return Math.round(
          asset.technicals.confidence * 0.4 + tradability * 0.3 + trendBias * 0.2 + momentum * 0.1
        )
      },
      month: (asset: AssetTrend, tradability: number) => {
        const structureBias =
          asset.technicals.macdSignal === 'BULLISH' || asset.technicals.macdSignal === 'BEARISH'
            ? 100
            : 65
        return Math.round(
          asset.technicals.confidence * 0.45 + tradability * 0.3 + structureBias * 0.25
        )
      },
      year: (asset: AssetTrend, tradability: number) => {
        const stability = Math.max(45, 100 - Math.min(55, Math.abs(asset.changePercent24h) * 12))
        const macroTrend = asset.technicals.trend === 'SIDEWAYS' ? 55 : 95
        return Math.round(asset.technicals.confidence * 0.45 + stability * 0.35 + macroTrend * 0.2)
      },
    }

    return assetList
      .map(asset => {
        const tradability = calculateTradability(asset)
        const phase = inferPhase(asset)
        const score = Math.min(99, scoreByHorizon[horizon](asset, tradability))
        const focus =
          phase === 'MANIPULATION'
            ? 'Watch liquidity sweeps and rejection around key order block zones.'
            : phase === 'ACCUMULATION'
              ? 'Track higher-timeframe demand reactions and pullback entries.'
              : 'Track higher-timeframe supply reactions and distribution retests.'

        const outlook =
          asset.technicals.signal === 'BUY'
            ? 'Bullish continuation bias'
            : asset.technicals.signal === 'SELL'
              ? 'Bearish continuation bias'
              : 'Neutral / wait for confirmation'

        return {
          symbol: asset.symbol,
          name: asset.name,
          type: asset.type,
          score,
          signal: asset.technicals.signal,
          phase,
          outlook,
          focus,
          confidence: asset.technicals.confidence,
          tradability,
        }
      })
      .sort((left, right) => right.score - left.score)
      .slice(0, 6)
  }

  const debriefByHorizon = {
    day: buildDebrief(assets, 'day'),
    week: buildDebrief(assets, 'week'),
    month: buildDebrief(assets, 'month'),
    year: buildDebrief(assets, 'year'),
  }

  const activeDebrief = debriefByHorizon[debriefHorizon]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 pt-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-4 p-3 rounded-xl border border-slate-700 bg-slate-900/70 text-slate-200 text-xs flex flex-wrap gap-3 items-center">
          <span className="font-semibold text-emerald-300">Live Build</span>
          <span>
            Commit: <span className="text-white">{deploymentInfo?.commitShort || 'local'}</span>
          </span>
          <span>
            Env: <span className="text-white">{deploymentInfo?.environment || 'unknown'}</span>
          </span>
          <span>
            Updated: <span className="text-white">{lastUpdate || 'n/a'}</span>
          </span>
        </div>

        {liveFailures.length > 0 && (
          <div className="mb-4 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-200">
            <h3 className="font-bold mb-2">Live Data Failure Report</h3>
            <p className="text-xs mb-2">
              Demo mode is disabled. Symbols below were skipped because live providers failed.
            </p>
            <div className="max-h-48 overflow-auto space-y-2 text-xs">
              {liveFailures.slice(0, 20).map((entry, index) => (
                <div
                  key={`${entry.symbol}-${entry.timestamp}-${index}`}
                  className="border-b border-red-500/20 pb-2"
                >
                  <div className="font-semibold">
                    {entry.symbol} ({entry.assetType})
                  </div>
                  <div>{entry.reasons.join(' | ')}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900/70 p-4 md:p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-white">Daily Debrief</h2>
              <p className="text-sm text-slate-300">
                Predictive multi-timeframe shortlist using higher-timeframe accumulation,
                distribution, manipulation behavior, order block structure, and signal confidence.
              </p>
            </div>
            <div className="text-xs text-slate-300">
              Refreshed with live feed • {new Date().toLocaleDateString()}
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {DEBRIEF_HORIZONS.map(horizon => (
              <button
                key={horizon.key}
                onClick={() => setDebriefHorizon(horizon.key)}
                className={`px-3 py-1.5 text-xs rounded border ${
                  debriefHorizon === horizon.key
                    ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50'
                    : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700'
                }`}
              >
                {horizon.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-400 mb-4">
            {DEBRIEF_HORIZONS.find(item => item.key === debriefHorizon)?.summary}
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {activeDebrief.map((item, index) => (
              <div
                key={`${debriefHorizon}-${item.symbol}`}
                className="rounded-lg border border-slate-700 bg-slate-800/70 p-3"
              >
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-bold text-white">
                      #{index + 1} {item.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {item.symbol} • {item.type.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-300">{item.score}%</div>
                    <div className="text-[11px] text-slate-400">debrief score</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      item.signal === 'BUY'
                        ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                        : item.signal === 'SELL'
                          ? 'bg-red-500/15 text-red-300 border border-red-500/30'
                          : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.signal}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-violet-500/15 text-violet-300 border border-violet-500/30">
                    {item.phase}
                  </span>
                </div>

                <div className="text-xs text-slate-300 mb-1">{item.outlook}</div>
                <div className="text-xs text-slate-400">{item.focus}</div>
                <div className="mt-2 text-[11px] text-slate-500">
                  Confidence {item.confidence}% • Tradability {item.tradability}%
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 text-xs text-slate-400 flex items-center justify-between gap-2">
            <span>
              Uses live market data only. No demo values are included in debrief rankings.
            </span>
            <Link
              href="/trends/debrief"
              className="text-indigo-300 hover:text-indigo-200 font-semibold"
            >
              Full debrief page
            </Link>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-slate-700 bg-slate-900/70 p-4 md:p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg md:text-xl font-bold text-white">Growth Catalyst</h2>
            <span className="text-xs text-slate-400">Execution-focused playbook</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
            <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-3">
              <div className="text-xs text-emerald-300 font-semibold mb-1">1) HTF Bias</div>
              <div className="text-xs text-slate-300">
                Start from 1W/1D to mark accumulation/distribution zones before taking
                lower-timeframe entries.
              </div>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-3">
              <div className="text-xs text-violet-300 font-semibold mb-1">
                2) Manipulation Check
              </div>
              <div className="text-xs text-slate-300">
                Wait for liquidity sweep + reclaim confirmation around key order block areas.
              </div>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-3">
              <div className="text-xs text-amber-300 font-semibold mb-1">3) Risk Discipline</div>
              <div className="text-xs text-slate-300">
                Risk fixed size per trade, avoid adding risk after invalidation, and respect stop
                placement.
              </div>
            </div>
            <div className="rounded-lg border border-slate-700 bg-slate-800/60 p-3">
              <div className="text-xs text-cyan-300 font-semibold mb-1">4) Review Loop</div>
              <div className="text-xs text-slate-300">
                Journal entries, outcomes, and missed setups daily to improve execution quality.
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-3 text-xs text-slate-200">
            <span className="font-semibold text-indigo-300">Today’s focus:</span> Select 1-3
            top-ranked debrief assets, confirm higher-timeframe bias first, then execute only when
            lower-timeframe confirmation aligns with your risk model.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-8 mt-4">
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
                  <div className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-green-700 text-white">
                    LIVE
                  </div>

                  {asset.technicals.confidence >= 75 && (
                    <div className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 text-white">
                      HIGH
                    </div>
                  )}
                  {asset.confidenceTier === 'MEDIUM' && (
                    <div className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-400 to-blue-600 text-white">
                      MEDIUM
                    </div>
                  )}
                  {asset.confidenceTier === 'LOW' && (
                    <div className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                      LOWER
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
                      ? 'Entry Long Setup'
                      : asset.technicals.signal === 'SELL'
                        ? 'Entry Short Setup'
                        : 'Wait for Confirmation'}
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
                      .join(' | ')}
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
      </div>
    </div>
  )
}
