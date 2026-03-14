
"use client";
import { useState } from 'react'
import TrendsNavigation from '@/components/TrendsNavigation'
import { TrendsDashboard } from '@/components/TrendsDashboard'
import EconomicNewsSection from '@/components/EconomicNewsSection'
import MarketTicker from '@/components/MarketTicker'
import OrderBlockSection from '@/components/OrderBlockSection'
import NotificationSystem from '@/components/NotificationSystem'
import TopPicks from '@/components/TopPicks'
import TradeConfirmationDialog from '@/components/TradeConfirmationDialog'
import AssetDetailModal from '@/components/AssetDetailModal'

// Asset definitions (symbols, names, categories) - updated to match screenshots
const assetList = [
  { symbol: 'ETHUSD', name: 'Ethereum', category: 'crypto' },
  { symbol: 'EURUSD', name: 'Euro / US Dollar', category: 'forex' },
  { symbol: 'GBPUSD', name: 'British Pound / US Dollar', category: 'forex' },
  { symbol: 'USDJPY', name: 'US Dollar / Japanese Yen', category: 'forex' },
  { symbol: 'USDCHF', name: 'US Dollar / Swiss Franc', category: 'forex' },
  { symbol: 'AUDUSD', name: 'Australian Dollar / US Dollar', category: 'forex' },
  { symbol: 'USDCAD', name: 'US Dollar / Canadian Dollar', category: 'forex' },
  { symbol: 'NZDUSD', name: 'New Zealand Dollar / US Dollar', category: 'forex' },
  { symbol: 'EURGBP', name: 'Euro / British Pound', category: 'forex' },
  { symbol: 'EURJPY', name: 'Euro / Japanese Yen', category: 'forex' },
  { symbol: 'GBPJPY', name: 'British Pound / Japanese Yen', category: 'forex' },
  { symbol: 'AUDJPY', name: 'Australian Dollar / Japanese Yen', category: 'forex' },
  { symbol: 'EURAUD', name: 'Euro / Australian Dollar', category: 'forex' },
  { symbol: 'XAUUSD', name: 'Gold', category: 'commodities' },
  { symbol: 'XAGUSD', name: 'Silver', category: 'commodities' },
  { symbol: 'XPTUSD', name: 'Platinum', category: 'commodities' },
  { symbol: 'USDMXN', name: 'US Dollar / Mexican Peso', category: 'forex' },
  { symbol: 'USDZAR', name: 'US Dollar / South African Rand', category: 'forex' },
  { symbol: 'USDTRY', name: 'US Dollar / Turkish Lira', category: 'forex' },
  { symbol: 'WTI_H6', name: 'Crude Oil (WTI)', category: 'commodities' },
  { symbol: 'XNGUSD', name: 'Natural Gas', category: 'commodities' },
  { symbol: 'US500', name: 'S&P 500', category: 'indices' },
  { symbol: 'USTEC', name: 'Nasdaq 100', category: 'indices' },
  { symbol: 'US30', name: 'Dow Jones 30', category: 'indices' },
  { symbol: 'DE40', name: 'DAX 40', category: 'indices' },
  { symbol: 'UK100', name: 'FTSE 100', category: 'indices' },
  { symbol: 'BTCUSD', name: 'Bitcoin', category: 'crypto' },
  { symbol: 'BCHUSD', name: 'Bitcoin Cash', category: 'crypto' },
];
import { useEffect } from 'react'
import { analyzeTechnicals } from '@/lib/technicalAnalysis'

const categories = ['forex', 'crypto', 'indices', 'commodities']

export default function TrendsPage() {
  const [activeSection, setActiveSection] = useState('overview')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showTradeDialog, setShowTradeDialog] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<any | null>(null)
  const [assets, setAssets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [strategy, setStrategy] = useState('order-blocks-accumulation') // default: both

  // Fetch live data for all assets
  useEffect(() => {
    async function fetchAllAssets() {
      setLoading(true)
      const results: any[] = []
      await Promise.all(
        assetList.map(async asset => {
          try {
            const res = await fetch(
              `/api/market-data/historical?symbol=${asset.symbol}&type=${asset.category}&timeframe=1h&strategy=${strategy}`
            )
            const data = await res.json()
            const candles = data.candles || []
            const latest = candles[candles.length - 1]
            const prev = candles[candles.length - 2]
            const price = latest?.close ?? 0
            const change = latest && prev ? latest.close - prev.close : 0
            const changePercent =
              latest && prev && prev.close ? ((latest.close - prev.close) / prev.close) * 100 : 0
            const prices = candles.map((c: any) => c.close)
            const ta = analyzeTechnicals(prices)
            results.push({
              ...asset,
              price,
              change,
              changePercent,
              rsi: ta.rsi,
              trend: ta.trend,
              macdSignal: ta.macdSignal,
              confidence: ta.confidence,
              chartData: candles.slice(-24).map((c: any) => ({
                time: new Date(c.timestamp).toLocaleTimeString(),
                value: c.close,
              })),
            })
          } catch (err) {
            results.push({
              ...asset,
              price: 0,
              change: 0,
              changePercent: 0,
              rsi: 0,
              trend: 'N/A',
              macdSignal: 'N/A',
              confidence: 0,
              chartData: [],
            })
          }
        })
      )
      setAssets(results)
      setLoading(false)
    }
    fetchAllAssets()
  }, [strategy])

  // Filter assets by selected category and search
  const filteredAssets =
    selectedCategory === 'all'
      ? assets
      : assets.filter(asset => asset.category === selectedCategory)

  const searchedAssets = search.trim()
    ? filteredAssets.filter(
        asset =>
          asset.symbol.toLowerCase().includes(search.toLowerCase()) ||
          asset.name.toLowerCase().includes(search.toLowerCase())
      )
    : filteredAssets

  // Top trades: sort by confidence
  const topTrades = [...assets].sort((a, b) => b.confidence - a.confidence).slice(0, 5)
  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <TrendsNavigation onNavigate={setActiveSection} activeSection={activeSection} />

      {/* Strategy Switcher, Search, Category Filter */}
      <div className="max-w-7xl mx-auto px-8 pt-6 flex flex-col md:flex-row gap-3 flex-wrap items-center">
        {/* Strategy Switcher */}
        <div className="flex gap-2 items-center">
          <span className="font-semibold text-slate-300">Strategy:</span>
          <select
            className="px-3 py-2 rounded bg-slate-800 text-slate-200 border border-slate-700"
            value={strategy}
            onChange={e => setStrategy(e.target.value)}
          >
            <option value="order-blocks-accumulation">Order Blocks + Accumulation</option>
            <option value="order-blocks">Order Blocks Only</option>
            <option value="accumulation">Accumulation Only</option>
          </select>
        </div>
        {/* Search Bar */}
        <input
          type="text"
          className="px-3 py-2 rounded bg-slate-800 text-slate-200 border border-slate-700 min-w-[220px]"
          placeholder="Search asset symbol or name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {/* Category Filter */}
        <div className="flex gap-2 flex-wrap">
          <button
            className={`px-4 py-2 rounded font-semibold border transition-colors ${selectedCategory === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}`}
            onClick={() => setSelectedCategory('all')}
          >
            All Assets
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              className={`px-4 py-2 rounded font-semibold border transition-colors ${selectedCategory === cat ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        {/* Top Trades Link */}
        <button
          className="px-4 py-2 rounded font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
          onClick={() => setSelectedCategory('top')}
        >
          View Top Trades
        </button>
      </div>

      {/* Overview Section (All Assets) */}
      <section id="overview" className="max-w-7xl mx-auto p-8 mb-12 border-b border-slate-800">
        <h2 className="text-2xl font-bold mb-6">All Assets</h2>
        <div className="flex flex-wrap gap-6">
          {searchedAssets.map(asset => (
            <div key={asset.symbol} className="w-[340px]">
              <div className="bg-slate-900 rounded-xl shadow-lg p-4 flex flex-col gap-3 border border-slate-700 hover:shadow-2xl transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold text-lg text-slate-100">{asset.name}</span>
                  <span className="ml-2 px-2 py-0.5 rounded bg-gradient-to-r from-emerald-600 to-indigo-600 text-xs font-bold text-white flex items-center gap-1">
                    True Chart Analysis
                    <span style={{ fontSize: '0.8em', marginLeft: '2px' }}>™</span>
                  </span>
                  <span className="ml-auto text-xs text-slate-400">{asset.symbol}</span>
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-extrabold text-emerald-400">
                    ${asset.price.toFixed(4)}
                  </span>
                  <span
                    className={`text-sm font-bold ${asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                  >
                    {asset.change >= 0 ? '+' : ''}
                    {asset.change.toFixed(4)} ({asset.changePercent.toFixed(2)}%)
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-300">
                    RSI: <span className="font-bold text-yellow-400">{asset.rsi}</span>
                  </span>
                  <span className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-300">
                    Trend: <span className="font-bold text-blue-400">{asset.trend}</span>
                  </span>
                  <span className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-300">
                    MACD: <span className="font-bold text-purple-400">{asset.macdSignal}</span>
                  </span>
                  <span className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-300">
                    Signal:{' '}
                    <span className="font-bold text-indigo-400">
                      {asset.trend === 'BULLISH' && asset.confidence >= 55
                        ? 'Buy'
                        : asset.trend === 'BEARISH' && asset.confidence >= 55
                          ? 'Sell'
                          : 'Neutral'}
                    </span>
                  </span>
                  <span className="bg-slate-800 px-2 py-1 rounded text-xs text-slate-300">
                    Confidence:{' '}
                    <span className="font-bold text-emerald-400">
                      {typeof asset.confidence === 'number' ? `${asset.confidence}%` : '—'}
                    </span>
                  </span>
                  {/* Entry/TP Ranges (if available) */}
                  {asset.entryZone && (
                    <span className="bg-slate-800 px-2 py-1 rounded text-xs text-lime-400">
                      Entry: <span className="font-bold">{asset.entryZone}</span>
                    </span>
                  )}
                  {asset.stopLoss && (
                    <span className="bg-slate-800 px-2 py-1 rounded text-xs text-red-400">
                      SL: <span className="font-bold">{asset.stopLoss}</span>
                    </span>
                  )}
                  {asset.takeProfitTargets && asset.takeProfitTargets.length > 0 && (
                    <>
                      {asset.takeProfitTargets.map((tp, idx) => (
                        <span
                          key={tp.label || idx}
                          className="bg-slate-800 px-2 py-1 rounded text-xs text-yellow-400"
                        >
                          TP{idx + 1}: <span className="font-bold">{tp.value}</span>
                        </span>
                      ))}
                    </>
                  )}
                </div>
                {/* Price Predict-o-Meter™ */}
                <div className="mt-2 bg-slate-800 px-2 py-1 rounded text-xs flex items-center gap-2">
                  <span className="font-bold text-pink-400">Price Predict-o-Meter™:</span>
                  <span>
                    {asset.trend === 'BULLISH' && asset.confidence >= 55
                      ? 'Likely Up'
                      : asset.trend === 'BEARISH' && asset.confidence >= 55
                        ? 'Likely Down'
                        : 'Sideways/Uncertain'}
                  </span>
                  <span className="text-slate-400">
                    | Confidence:{' '}
                    <span className="font-bold text-emerald-400">
                      {typeof asset.confidence === 'number' ? `${asset.confidence}%` : '—'}
                    </span>
                  </span>
                  <span className="text-slate-400">
                    | Est. Time:{' '}
                    <span className="font-bold text-blue-300">
                      {asset.trend === 'BULLISH' || asset.trend === 'BEARISH' ? '1-2 days' : '—'}
                    </span>
                  </span>
                </div>
                <button
                  className="mt-4 px-3 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
                  onClick={() => {
                    setSelectedAsset(asset)
                  }}
                >
                  View Full Analysis
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Signals */}
      <section id="signals" className="max-w-7xl mx-auto p-8 mb-12 border-b border-slate-800">
        <h2 className="text-2xl font-bold mb-2 flex items-center">Live Signals</h2>
        <NotificationSystem />
      </section>

      {/* Forex Pairs */}
      <section id="forex" className="max-w-7xl mx-auto p-8 mb-12 border-b border-slate-800">
        <h2 className="text-2xl font-bold mb-2 flex items-center">Forex Pairs</h2>
        {/* Filtered forex assets */}
        <div className="flex flex-wrap gap-6">
          {assets
            .filter(a => a.category === 'forex')
            .map(asset => (
              <div key={asset.symbol} className="w-[340px]">
                <div className="bg-slate-900 rounded-xl shadow-lg p-4 flex flex-col gap-3 border border-slate-700 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg text-slate-100">{asset.name}</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-gradient-to-r from-emerald-600 to-indigo-600 text-xs font-bold text-white flex items-center gap-1">
                      True Chart Analysis
                      <span style={{ fontSize: '0.8em', marginLeft: '2px' }}>™</span>
                    </span>
                    <span className="ml-auto text-xs text-slate-400">{asset.symbol}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-extrabold text-emerald-400">
                      ${asset.price.toFixed(4)}
                    </span>
                    <span
                      className={`text-sm font-bold ${asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {asset.change >= 0 ? '+' : ''}
                      {asset.change.toFixed(4)} ({asset.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                  <button
                    className="mt-4 px-3 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
                    onClick={() => {
                      setSelectedAsset(asset)
                    }}
                  >
                    View Full Analysis
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Crypto */}
      <section id="crypto" className="max-w-7xl mx-auto p-8 mb-12 border-b border-slate-800">
        <h2 className="text-2xl font-bold mb-2 flex items-center">Crypto</h2>
        <div className="flex flex-wrap gap-6">
          {assets
            .filter(a => a.category === 'crypto')
            .map(asset => (
              <div key={asset.symbol} className="w-[340px]">
                <div className="bg-slate-900 rounded-xl shadow-lg p-4 flex flex-col gap-3 border border-slate-700 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg text-slate-100">{asset.name}</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-gradient-to-r from-emerald-600 to-indigo-600 text-xs font-bold text-white flex items-center gap-1">
                      True Chart Analysis
                      <span style={{ fontSize: '0.8em', marginLeft: '2px' }}>™</span>
                    </span>
                    <span className="ml-auto text-xs text-slate-400">{asset.symbol}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-extrabold text-emerald-400">
                      ${asset.price.toFixed(4)}
                    </span>
                    <span
                      className={`text-sm font-bold ${asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {asset.change >= 0 ? '+' : ''}
                      {asset.change.toFixed(4)} ({asset.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                  <button
                    className="mt-4 px-3 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
                    onClick={() => {
                      setSelectedAsset(asset)
                    }}
                  >
                    View Full Analysis
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Indices */}
      <section id="indices" className="max-w-7xl mx-auto p-8 mb-12 border-b border-slate-800">
        <h2 className="text-2xl font-bold mb-2 flex items-center">Indices</h2>
        <div className="flex flex-wrap gap-6">
          {assets
            .filter(a => a.category === 'indices')
            .map(asset => (
              <div key={asset.symbol} className="w-[340px]">
                <div className="bg-slate-900 rounded-xl shadow-lg p-4 flex flex-col gap-3 border border-slate-700 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg text-slate-100">{asset.name}</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-gradient-to-r from-emerald-600 to-indigo-600 text-xs font-bold text-white flex items-center gap-1">
                      True Chart Analysis
                      <span style={{ fontSize: '0.8em', marginLeft: '2px' }}>™</span>
                    </span>
                    <span className="ml-auto text-xs text-slate-400">{asset.symbol}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-extrabold text-emerald-400">
                      ${asset.price.toFixed(4)}
                    </span>
                    <span
                      className={`text-sm font-bold ${asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {asset.change >= 0 ? '+' : ''}
                      {asset.change.toFixed(4)} ({asset.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                  <button
                    className="mt-4 px-3 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
                    onClick={() => {
                      setSelectedAsset(asset)
                    }}
                  >
                    View Full Analysis
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Commodities */}
      <section id="commodities" className="max-w-7xl mx-auto p-8 mb-12 border-b border-slate-800">
        <h2 className="text-2xl font-bold mb-2 flex items-center">Commodities</h2>
        <div className="flex flex-wrap gap-6">
          {assets
            .filter(a => a.category === 'commodities')
            .map(asset => (
              <div key={asset.symbol} className="w-[340px]">
                <div className="bg-slate-900 rounded-xl shadow-lg p-4 flex flex-col gap-3 border border-slate-700 hover:shadow-2xl transition-shadow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-lg text-slate-100">{asset.name}</span>
                    <span className="ml-2 px-2 py-0.5 rounded bg-gradient-to-r from-emerald-600 to-indigo-600 text-xs font-bold text-white flex items-center gap-1">
                      True Chart Analysis
                      <span style={{ fontSize: '0.8em', marginLeft: '2px' }}>™</span>
                    </span>
                    <span className="ml-auto text-xs text-slate-400">{asset.symbol}</span>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-extrabold text-emerald-400">
                      ${asset.price.toFixed(4)}
                    </span>
                    <span
                      className={`text-sm font-bold ${asset.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}
                    >
                      {asset.change >= 0 ? '+' : ''}
                      {asset.change.toFixed(4)} ({asset.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                  <button
                    className="mt-4 px-3 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-500"
                    onClick={() => {
                      setSelectedAsset(asset)
                    }}
                  >
                    View Full Analysis
                  </button>
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* Market Debrief */}
      <section id="debrief" className="max-w-7xl mx-auto p-8 mb-12 border-b border-slate-800">
        <h2 className="text-2xl font-bold mb-2 flex items-center">Market Debrief</h2>
        <OrderBlockSection />
      </section>

      {/* Analysis Failures */}
      <section id="failures" className="max-w-7xl mx-auto p-8 mb-12 border-b border-slate-800">
        <h2 className="text-2xl font-bold mb-2 flex items-center">Analysis Failures</h2>
        {/* Add failure reporting component here if available */}
      </section>

      {/* Bot Dashboard */}
      <section id="dashboard" className="max-w-7xl mx-auto p-8 mb-12">
        <h2 className="text-2xl font-bold mb-2 flex items-center">Bot Dashboard</h2>
        {/* Add bot dashboard component or link here */}
      </section>

      {/* Full Analysis Modal */}
      {selectedAsset && (
        <AssetDetailModal
          asset={{
            symbol: selectedAsset.symbol,
            name: selectedAsset.name,
            price: selectedAsset.price,
            signal: selectedAsset.trend || '',
            confidence: selectedAsset.confidence,
            type: selectedAsset.category || '',
            entryZone: '',
            stopLoss: '',
            takeProfitTargets: [],
          }}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </main>
  )
}
