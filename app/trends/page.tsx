'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, GraduationCap, Tv } from 'lucide-react'
import Link from 'next/link'
import { TechnicalIndicators, calculateRSI } from '@/lib/technicalAnalysis'
import { getHistoricalCloses } from '@/lib/marketDataProvider'

// TEMP: Manually input TradingView RSI for EURUSD 1h for comparison (in real use, fetch via admin or API)
const TRADINGVIEW_RSI: Record<string, number> = {
  EURUSD: 45,
  // Add more symbols as needed
}
import AssetDetailModal from '@/components/AssetDetailModal'
import TrendsNavigation from '@/components/TrendsNavigation'
import TradeConfirmationDialog from '@/components/TradeConfirmationDialog'

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

type DisplayedAsset = AssetTrend & {
  tradability: number
  confidenceTier: 'HIGH' | 'MEDIUM' | 'LOW'
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
  { symbol: 'BTCUSD', name: 'Bitcoin', type: 'crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum', type: 'crypto' },
  { symbol: 'BCHUSD', name: 'Bitcoin Cash', type: 'crypto' },
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
  const [signalFilter, setSignalFilter] = useState<'ALL' | 'BUY' | 'SELL' | 'WAIT'>('ALL')
  const [liveFailures, setLiveFailures] = useState<LiveFailureEntry[]>([])
  const [deploymentInfo, setDeploymentInfo] = useState<DeploymentInfo | null>(null)
  const [activeSection, setActiveSection] = useState<string>('forex')
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [selectedTradeForConfirm, setSelectedTradeForConfirm] = useState<any>(null)
  const [loadingTrade, setLoadingTrade] = useState(false)
  const [sectionFilter, setSectionFilter] = useState<'overview' | 'debrief' | 'signals'>('overview')

  const handleSectionNavigate = (sectionId: string) => {
    setActiveSection(sectionId)
    // Map sectionId to sectionFilter for main content switching
    switch (sectionId) {
      case 'overview':
        setSectionFilter('overview')
        break
      case 'debrief':
        setSectionFilter('debrief')
        break
      case 'signals':
      case 'forex':
      case 'crypto':
      case 'indices':
      case 'commodities':
        setSectionFilter('signals')
        break
      case 'failures':
        // Show the failures section by scrolling, but keep current filter
        break
      default:
        setSectionFilter('overview')
    }
  }

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

        let assetsList: (AssetTrend | null)[] = await Promise.all(
          ASSETS_CONFIG.map(async config => {
            let data: AssetTrend | null = null;
            let closes: number[] | null = null;
            let rsiValue: number = 50;
            // Always calculate RSI from closes if available, fallback to 50 only if calculation fails
            try {
              closes = await getHistoricalCloses(config.symbol, config.type, '1h');
              if (closes && closes.length > 0) {
                rsiValue = Math.round(calculateRSI(closes));
                // eslint-disable-next-line no-console
                console.log(
                  `RSI DIAG: ${config.symbol} closes:`,
                  closes.slice(-20),
                  'RSI:',
                  rsiValue
                );
              } else {
                if (rsiValue === 50) {
                  // eslint-disable-next-line no-console
                  console.warn(`RSI DIAG: ${config.symbol} has insufficient closes for RSI!`);
                }
              }
            } catch (err) {
              if (rsiValue === 50) {
                // eslint-disable-next-line no-console
                console.error(`RSI DIAG: Error fetching closes for ${config.symbol}:`, err);
              }
            }

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
                  rsi: closes ? Math.round(calculateRSI(closes)) : 50,
                  macdSignal: crypto.changePercent24h > 0 ? 'BULLISH' : 'BEARISH',
                  momentum: crypto.change24h,
                  trend: crypto.changePercent24h > 0 ? 'UP' : 'DOWN',
                  data = {
                    symbol: config.symbol,
                    name: config.name,
                    type: config.type,
                    currentPrice: crypto.price,
                    change24h: crypto.change24h,
                    changePercent24h: crypto.changePercent24h,
                    dataSource: 'LIVE',
                    technicals: {
                      rsi: rsiValue,
                      macdSignal: crypto.changePercent24h > 0 ? 'BULLISH' : 'BEARISH',
                      momentum: crypto.change24h,
                      trend: crypto.changePercent24h > 0 ? 'UP' : 'DOWN',
                      signal,
                      confidence: Math.floor(Math.abs(crypto.changePercent24h) * 20 + 50),
                    },
                    keyLevel: crypto.price * 0.99,
                    entryZone: `${(crypto.price * 0.98).toFixed(2)} - ${(crypto.price * 1.02).toFixed(2)}`,
                    stopLoss: `${(crypto.price * 0.95).toFixed(2)}`,
                    takeProfit: `${(crypto.price * 1.08).toFixed(2)}`,
                    takeProfitTargets: buildTakeProfitTargets(crypto.price, config.type, signal),
                    reasoning: `Live pricing from Twelve Data (Yahoo fallback) | Updated every 30 seconds`,
                    lastUpdate: new Date().toISOString(),
                  }
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
                  rsi: closes ? Math.round(calculateRSI(closes)) : 50,
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
            }
              data = {
                symbol: config.symbol,
                name: config.name,
                type: config.type,
                currentPrice: index.price,
                change24h: index.change,
                changePercent24h: index.changePercent,
                dataSource: 'LIVE',
                technicals: {
                  rsi: rsiValue,
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
        try {
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
    }

    fetchMarketData()
    const interval = setInterval(fetchMarketData, 30000)
    return () => clearInterval(interval)
  }, [])

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
              data = {
                symbol: config.symbol,
                name: config.name,
                type: config.type,
                currentPrice: commodity.price,
                change24h: commodity.change,
                changePercent24h: commodity.changePercent,
                dataSource: 'LIVE',
                technicals: {
                  rsi: rsiValue,
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

  // Compute market stats for overview
  const buyAssets = assets.filter(a => a.technicals.signal === 'BUY')
  const sellAssets = assets.filter(a => a.technicals.signal === 'SELL')
  const waitAssets = assets.filter(a => a.technicals.signal === 'WAIT')
  const topMovers = [...assets]
    .sort((a, b) => Math.abs(b.changePercent24h) - Math.abs(a.changePercent24h))
    .slice(0, 4)
  const topConfidence = [...assets]
    .sort((a, b) => b.technicals.confidence - a.technicals.confidence)
    .slice(0, 3)

  // Show all assets without filters
  const displayedAssets: DisplayedAsset[] = assets.map(asset => ({
    ...asset,
    tradability: calculateTradability(asset),
    confidenceTier:
      asset.technicals.confidence >= 75
        ? 'HIGH'
        : asset.technicals.confidence >= 60
          ? 'MEDIUM'
          : 'LOW',
  }))

  const filteredAssets: DisplayedAsset[] =
    signalFilter === 'ALL'
      ? displayedAssets
      : displayedAssets.filter(a => a.technicals.signal === signalFilter)

  // Instead of splitting by category, show all assets sorted by confidence
  const allSortedAssets = [...filteredAssets].sort(
    (a, b) => b.technicals.confidence - a.technicals.confidence
  )

  const parseNumber = (value: string): number => parseFloat(value.replace(/[^\d.]/g, '')) || 0

  const parseEntryRange = (value: string): { low: number; high: number } | null => {
    const match = value.match(/([\d.]+)\s*-\s*([\d.]+)/)
    if (!match) return null
    const low = parseFloat(match[1])
    const high = parseFloat(match[2])
    if (!Number.isFinite(low) || !Number.isFinite(high)) return null
    return { low, high }
  }

  const openTradeConfirm = (asset: AssetTrend) => {
    const entryRange = parseEntryRange(asset.entryZone)
    const entry = entryRange
      ? asset.technicals.signal === 'BUY'
        ? entryRange.low
        : entryRange.high
      : asset.currentPrice

    const sl = parseNumber(asset.stopLoss)
    const tpValue = asset.takeProfitTargets?.[0]?.value
    const tp = tpValue ? parseNumber(tpValue) : parseNumber(asset.takeProfit)

    setSelectedTradeForConfirm({
      symbol: asset.symbol,
      signal: asset.technicals.signal,
      entry,
      sl,
      tp,
      confidence: asset.technicals.confidence,
      entryZone: asset.entryZone,
      takeProfitTargets: asset.takeProfitTargets,
    })
    setConfirmDialogOpen(true)
  }

  const handleConfirmTrade = async (trade: any) => {
    setLoadingTrade(true)
    try {
      const response = await fetch('/api/trade/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: trade.symbol,
          signal: trade.signal,
          entry: trade.entry,
          sl: trade.sl,
          tp: trade.tp,
          buyLimit: trade.buyLimit,
          stopLimit: trade.stopLimit,
          source: 'page',
          confidence: trade.confidence,
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert(`✅ Trade confirmed!\nID: ${result.trade.tradeId}`)
        setConfirmDialogOpen(false)
        setSelectedTradeForConfirm(null)
      } else {
        alert(`❌ Error: ${result.error}`)
      }
    } catch (error) {
      alert(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoadingTrade(false)
    }
  }

  const renderAssetSection = (
    sectionId: string,
    title: string,
    sectionAssets: DisplayedAsset[]
  ) => (
    <section id={sectionId} className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <span className="text-xs text-slate-400">{sectionAssets.length} assets</span>
      </div>

      {sectionAssets.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-400">
          No assets available in this section right now.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <AnimatePresence>
            {sectionAssets.map((asset, idx) => (
              <motion.div
                key={`${sectionId}-${asset.symbol}`}
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
                <div className="flex gap-2 mb-2 flex-wrap">
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
                    <div className="text-white font-bold">
                      {asset.technicals.rsi}
                      {TRADINGVIEW_RSI[asset.symbol] !== undefined && (
                        <span className="ml-2 text-xs text-amber-400 font-mono">
                          (TV: {TRADINGVIEW_RSI[asset.symbol]})
                        </span>
                      )}
                    </div>
                    {asset.technicals.rsi === 50 && (
                      <div className="text-xs text-yellow-400 font-semibold mt-1">
                        Warning: RSI is 50 (no historical data available)
                      </div>
                    )}
                    {TRADINGVIEW_RSI[asset.symbol] !== undefined &&
                      Math.abs(asset.technicals.rsi - TRADINGVIEW_RSI[asset.symbol]) > 2 && (
                        <div className="text-xs text-red-500 font-semibold mt-1">
                          Warning: RSI differs from TradingView by more than ±2
                        </div>
                      )}
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

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={event => {
                      event.stopPropagation()
                      setSelectedAsset(asset)
                    }}
                    className="w-full py-2 bg-slate-700 hover:bg-slate-600 text-white rounded font-medium transition-colors text-sm"
                  >
                    View Order Blocks <ChevronDown className="inline w-3 h-3 ml-1" />
                  </button>
                  <button
                    onClick={event => {
                      event.stopPropagation()
                      openTradeConfirm(asset)
                    }}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-medium transition-colors text-sm"
                  >
                    Confirm Trade
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </section>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <TrendsNavigation onNavigate={handleSectionNavigate} activeSection={activeSection} />

      <div className="pt-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-4 rounded-xl border border-slate-700 bg-slate-900/70 p-3 sticky top-14 z-30">
            <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-2">
              Jump To Section
            </div>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { key: 'overview', label: 'Live Market Overview' },
                  { key: 'debrief', label: 'Daily Debrief' },
                  { key: 'signals', label: 'Live Signals' },
                ] as const
              ).map(option => (
                <button
                  key={option.key}
                  onClick={() => {
                    setSectionFilter(option.key)
                    const el = document.getElementById(option.key)
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }}
                  className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                    sectionFilter === option.key
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                      : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          {/* Market Overview Section */}
          <div
            id="overview"
            className="mb-6 rounded-xl border border-slate-700 bg-gradient-to-r from-slate-900/80 to-slate-850/60 p-5"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                  Live Market Overview
                </h1>
                <p className="text-sm text-slate-300">
                  Real-time analysis across {assets.length} assets | Updated {lastUpdate}
                </p>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/guides/tradingview"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700/50 border border-slate-600 text-xs text-slate-300 hover:bg-slate-600 transition-colors"
                >
                  <Tv className="h-3.5 w-3.5 text-slate-300" />
                  TV Guide
                </Link>
                <Link
                  href="/learning-path"
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-xs text-indigo-300 hover:bg-indigo-500/30 transition-colors"
                >
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-300" />
                  Learning Path
                </Link>
              </div>
            </div>

            {/* Market Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
                <div className="text-emerald-300 text-xs font-semibold mb-1">BUY Signals</div>
                <div className="text-2xl font-bold text-emerald-400">{buyAssets.length}</div>
                <div className="text-[11px] text-slate-400">
                  {buyAssets.length > 0
                    ? `${((buyAssets.length / assets.length) * 100).toFixed(0)}% of market`
                    : 'None active'}
                </div>
              </div>
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                <div className="text-red-300 text-xs font-semibold mb-1">SELL Signals</div>
                <div className="text-2xl font-bold text-red-400">{sellAssets.length}</div>
                <div className="text-[11px] text-slate-400">
                  {sellAssets.length > 0
                    ? `${((sellAssets.length / assets.length) * 100).toFixed(0)}% of market`
                    : 'None active'}
                </div>
              </div>
              <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
                <div className="text-amber-300 text-xs font-semibold mb-1">WAIT (Neutral)</div>
                <div className="text-2xl font-bold text-amber-400">{waitAssets.length}</div>
                <div className="text-[11px] text-slate-400">
                  {waitAssets.length > 0
                    ? `${((waitAssets.length / assets.length) * 100).toFixed(0)}% of market`
                    : 'None active'}
                </div>
              </div>
              <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-3">
                <div className="text-cyan-300 text-xs font-semibold mb-1">Market Status</div>
                <div className="text-lg font-bold text-cyan-400">
                  {buyAssets.length > sellAssets.length
                    ? 'Bullish'
                    : sellAssets.length > buyAssets.length
                      ? 'Bearish'
                      : 'Sideways'}
                </div>
                <div className="text-[11px] text-slate-400">Sentiment bias</div>
              </div>
            </div>

            {/* Signal Filter Controls */}
            <div className="mb-4">
              <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-2">
                Filter by Signal
              </div>
              <div className="flex gap-2 flex-wrap">
                {(['ALL', 'BUY', 'SELL', 'WAIT'] as const).map(signal => (
                  <button
                    key={signal}
                    onClick={() => setSignalFilter(signal)}
                    className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                      signalFilter === signal
                        ? signal === 'BUY'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : signal === 'SELL'
                            ? 'bg-red-500/20 text-red-300 border-red-500/50'
                            : signal === 'WAIT'
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                              : 'bg-slate-600 text-slate-100 border-slate-500'
                        : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700'
                    }`}
                  >
                    {signal}
                  </button>
                ))}
              </div>
            </div>

            {/* Top Movers & Confidence */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-2">
                  Top Movers (24h Volatility)
                </div>
                <div className="space-y-2">
                  {topMovers.map((asset, idx) => (
                    <div
                      key={asset.symbol}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-700"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-200">{asset.symbol}</div>
                          <div className="text-[11px] text-slate-500">{asset.name}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-sm font-bold ${
                            asset.changePercent24h >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {asset.changePercent24h >= 0 ? '+' : ''}
                          {asset.changePercent24h.toFixed(2)}%
                        </div>
                        <div className="text-[11px] text-slate-400">
                          ${asset.currentPrice.toFixed(4)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wide font-semibold mb-2">
                  Highest Confidence
                </div>
                <div className="space-y-2">
                  {topConfidence.map((asset, idx) => (
                    <div
                      key={asset.symbol}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-800/50 border border-slate-700"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-slate-200">{asset.symbol}</div>
                          <div className="text-[11px] text-slate-500">
                            {asset.technicals.signal}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-bold text-purple-400">
                          {asset.technicals.confidence}%
                        </div>
                        <div className="text-[11px] text-slate-400">confidence</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700 text-[11px] text-slate-400 flex gap-2 flex-wrap">
              <Link
                href="/doctrine"
                className="text-indigo-300 hover:text-indigo-200 font-semibold"
              >
                Trading Doctrine
              </Link>
              <span>•</span>
              <Link
                href="/guides/deriv"
                className="text-indigo-300 hover:text-indigo-200 font-semibold"
              >
                Deriv Guide
              </Link>
              <span>•</span>
              <Link
                href="/courses/trading-psychology"
                className="text-indigo-300 hover:text-indigo-200 font-semibold"
              >
                Psychology Course
              </Link>
            </div>
          </div>

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

          {sectionFilter !== 'signals' && liveFailures.length > 0 && (
            <div
              id="failures"
              className="mb-4 p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-200"
            >
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

          {sectionFilter !== 'signals' && (
            <div
              id="debrief"
              className="mb-6 rounded-xl border border-slate-700 bg-slate-900/70 p-4 md:p-5"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
                <div>
                  <h2 className="text-lg md:text-xl font-bold text-white">Daily Debrief</h2>
                  <p className="text-sm text-slate-300">
                    Predictive multi-timeframe shortlist using higher-timeframe accumulation,
                    distribution, manipulation behavior, order block structure, and signal
                    confidence.
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
          )}

          {sectionFilter !== 'debrief' && (
            <div id="signals" className="mt-6">
              {renderAssetSection('all', 'Top Trade Opportunities', allSortedAssets)}
            </div>
          )}

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

          {selectedTradeForConfirm && (
            <TradeConfirmationDialog
              isOpen={confirmDialogOpen}
              trade={selectedTradeForConfirm}
              onConfirm={handleConfirmTrade}
              onCancel={() => {
                setConfirmDialogOpen(false)
                setSelectedTradeForConfirm(null)
              }}
              loading={loadingTrade}
            />
          )}
        </div>
      </div>
    </div>
  )
}
