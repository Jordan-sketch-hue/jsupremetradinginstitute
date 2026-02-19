'use client'

import { useState, useEffect } from 'react'
import { X, TrendingUp } from 'lucide-react'
import OrderBlockChart from './OrderBlockChart'
import { Candle, OrderBlock } from '@/lib/orderBlockDetection'

const TIMEFRAME_OPTIONS = ['15m', '1h', '4h', '1d'] as const

interface AnalysisData {
  orderBlocks: OrderBlock[]
  support: number[]
  resistance: number[]
  nearestOB: OrderBlock | null
  obConfidence: number
  timeframe?: string
}

interface AssetDetailModalProps {
  asset: {
    symbol: string
    name: string
    price: number
    signal: string
    confidence: number
    type: string
    entryZone: string
    stopLoss: string
    takeProfitTargets: Array<{ label: string; value: string }>
  }
  onClose: () => void
}

export default function AssetDetailModal({ asset, onClose }: AssetDetailModalProps) {
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null)
  const [candles, setCandles] = useState<Candle[]>([])
  const [timeframe, setTimeframe] = useState<(typeof TIMEFRAME_OPTIONS)[number]>('1h')
  const [positionSize, setPositionSize] = useState<number>(1)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKey)

    const fetchAnalysis = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch historical data
        const histRes = await fetch(
          `/api/market-data/historical?symbol=${asset.symbol}&type=${asset.type}&timeframe=${timeframe}`
        )

        if (!histRes.ok) {
          const payload = await histRes.json().catch(() => null)
          throw new Error(payload?.error || 'Failed to load historical candles')
        }

        const histData = await histRes.json()

        if (histData.candles) {
          setCandles(histData.candles)
        }

        // Fetch order block analysis
        const analysisRes = await fetch(
          `/api/analysis/order-blocks?symbol=${asset.symbol}&signal=${asset.signal}&price=${asset.price}&type=${asset.type}&timeframe=${timeframe}`
        )

        if (!analysisRes.ok) {
          const payload = await analysisRes.json().catch(() => null)
          throw new Error(payload?.error || 'Failed to load order block analysis')
        }

        const analysisData = await analysisRes.json()
        setAnalysis(analysisData)
      } catch (err) {
        console.error('Error fetching analysis:', err)
        setError(err instanceof Error ? err.message : 'Failed to load analysis')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()

    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = previousOverflow
    }
  }, [asset, timeframe, onClose])

  const parsePrice = (value: string | number) => {
    if (typeof value === 'number') return value
    const numeric = parseFloat(String(value).replace(/[^\d.-]/g, ''))
    return Number.isFinite(numeric) ? numeric : 0
  }

  const entryParts = asset.entryZone
    .split('-')
    .map(part => parsePrice(part))
    .filter(value => value > 0)
  const entryPrice =
    entryParts.length > 1
      ? (entryParts[0] + entryParts[entryParts.length - 1]) / 2
      : entryParts[0] || asset.price
  const stopLoss = parsePrice(asset.stopLoss)

  const takeProfitTargets = asset.takeProfitTargets
    .map(target => ({
      label: target.label,
      price: parsePrice(target.value),
    }))
    .filter(target => target.price > 0)

  const isBuySignal = asset.signal === 'BUY'
  const riskPerUnit = isBuySignal
    ? Math.max(0, entryPrice - stopLoss)
    : Math.max(0, stopLoss - entryPrice)
  const riskAmount = riskPerUnit * positionSize

  const calculatorRows = takeProfitTargets.map(target => {
    const rewardPerUnit = isBuySignal
      ? Math.max(0, target.price - entryPrice)
      : Math.max(0, entryPrice - target.price)
    const rewardAmount = rewardPerUnit * positionSize
    const rr = riskPerUnit > 0 ? rewardPerUnit / riskPerUnit : 0

    return {
      label: target.label,
      price: target.price,
      rewardAmount,
      rr,
    }
  })

  const pooledConfidence = Math.round(
    ((asset.confidence * 0.4 + (analysis?.obConfidence || 0) * 0.6) / 100) * 100
  )

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-2 md:p-4 overflow-y-auto"
      onMouseDown={onClose}
    >
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[10000] p-3 rounded-full bg-slate-900 border border-slate-700 hover:bg-slate-800"
        aria-label="Close order block view"
      >
        <X className="w-5 h-5 text-slate-200" />
      </button>

      <div
        className="bg-slate-900 rounded-lg shadow-2xl max-w-5xl w-full my-8 border border-slate-700 max-h-[92vh] overflow-y-auto"
        onMouseDown={event => event.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur border-b border-slate-700">
          <div className="flex items-center justify-between p-4 md:p-6">
            <div className="flex items-center gap-3">
              <TrendingUp
                className={`w-6 h-6 ${asset.signal === 'BUY' ? 'text-green-500' : 'text-red-500'}`}
              />
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-100">{asset.name}</h2>
                <p className="text-sm text-slate-400">
                  {asset.symbol} • {timeframe.toUpperCase()}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>

          <div className="px-4 md:px-6 pb-4 flex items-center gap-2 flex-wrap">
            <span className="text-xs text-slate-400 uppercase tracking-wide">Timeframe</span>
            {TIMEFRAME_OPTIONS.map(option => (
              <button
                key={option}
                onClick={() => setTimeframe(option)}
                className={`px-3 py-1 text-sm rounded border ${
                  timeframe === option
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                    : 'bg-slate-800 text-slate-300 border-slate-600 hover:bg-slate-700'
                }`}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-slate-400" />
              <p className="mt-3 text-slate-400">Analyzing price action and order blocks...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-400">{error}</div>
          ) : (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    Current Price
                  </div>
                  <div className="text-2xl font-bold text-slate-100 mt-1">
                    ${asset.price.toFixed(4)}
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">Signal</div>
                  <div
                    className={`text-2xl font-bold mt-1 ${asset.signal === 'BUY' ? 'text-green-400' : 'text-red-400'}`}
                  >
                    {asset.signal}
                  </div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    TA Confidence
                  </div>
                  <div className="text-2xl font-bold text-slate-100 mt-1">{asset.confidence}%</div>
                </div>
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <div className="text-xs text-slate-400 uppercase tracking-wide">
                    OB Confidence
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mt-1">
                    {analysis?.obConfidence || 0}%
                  </div>
                </div>
              </div>

              {/* Pooled Decision */}
              <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-4 border border-slate-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-100">Pooled Analysis Score</h3>
                    <p className="text-sm text-slate-400 mt-1">
                      Combines technical analysis (40%) + order block structure (60%)
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-bold text-amber-400">{pooledConfidence}%</div>
                    <p className="text-xs text-slate-400 mt-1">Combined Confidence</p>
                  </div>
                </div>
              </div>

              {/* Strategy Targets */}
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-100 mb-3">Strategy Targets</h3>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div className="bg-slate-900/60 rounded p-3 border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Entry Zone</div>
                    <div className="text-slate-100 font-semibold mt-1">{asset.entryZone}</div>
                  </div>
                  <div className="bg-slate-900/60 rounded p-3 border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase tracking-wide">Stop Loss</div>
                    <div className="text-slate-100 font-semibold mt-1">{asset.stopLoss}</div>
                  </div>
                  <div className="bg-slate-900/60 rounded p-3 border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase tracking-wide">
                      Take Profit Range
                    </div>
                    <div className="text-slate-100 font-semibold mt-1">
                      {asset.takeProfitTargets
                        .map(target => `${target.label} ${target.value}`)
                        .join(' • ')}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  Targets are derived from current price, signal direction, and asset volatility.
                </p>
              </div>

              {/* Chart */}
              {candles.length > 0 && (
                <OrderBlockChart
                  symbol={asset.symbol}
                  timeframe={timeframe}
                  candles={candles}
                  orderBlocks={analysis?.orderBlocks || []}
                  support={analysis?.support || []}
                  resistance={analysis?.resistance || []}
                  nearestOB={analysis?.nearestOB || null}
                  currentPrice={asset.price}
                  entryPrice={entryPrice}
                  stopLoss={stopLoss}
                  takeProfitTargets={takeProfitTargets}
                />
              )}

              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-100 mb-3">
                  Risk & Profit Calculator
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                  <div className="bg-slate-900/60 rounded p-3 border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase">Entry</div>
                    <div className="text-slate-100 font-semibold mt-1">{entryPrice.toFixed(5)}</div>
                  </div>
                  <div className="bg-slate-900/60 rounded p-3 border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase">Stop Loss</div>
                    <div className="text-red-300 font-semibold mt-1">{stopLoss.toFixed(5)}</div>
                  </div>
                  <div className="bg-slate-900/60 rounded p-3 border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase">Position Size</div>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={positionSize}
                      onChange={event =>
                        setPositionSize(Math.max(0.01, parseFloat(event.target.value) || 0.01))
                      }
                      className="mt-1 w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-slate-100"
                    />
                  </div>
                  <div className="bg-slate-900/60 rounded p-3 border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase">Max Risk</div>
                    <div className="text-amber-300 font-semibold mt-1">{riskAmount.toFixed(2)}</div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  {calculatorRows.map(row => (
                    <div
                      key={row.label}
                      className="grid grid-cols-3 gap-2 bg-slate-900/50 rounded p-2 border border-slate-700"
                    >
                      <div className="text-slate-200">
                        {row.label}:{' '}
                        <span className="text-emerald-300">{row.price.toFixed(5)}</span>
                      </div>
                      <div className="text-slate-300">
                        Projected Profit: {row.rewardAmount.toFixed(2)}
                      </div>
                      <div className="text-slate-300">R:R {row.rr.toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Blocks List */}
              {analysis?.orderBlocks && analysis.orderBlocks.length > 0 && (
                <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                  <h3 className="text-lg font-semibold text-slate-100 mb-3">Active Order Blocks</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {analysis.orderBlocks.map((ob: OrderBlock, i: number) => (
                      <div
                        key={i}
                        className="p-2 bg-slate-700 rounded border border-slate-600 text-sm"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                ob.type === 'BULLISH'
                                  ? 'bg-green-500/20 text-green-400'
                                  : 'bg-red-500/20 text-red-400'
                              }`}
                            >
                              {ob.type}
                            </span>
                            <span className="text-slate-300 ml-2">${ob.priceLevel.toFixed(4)}</span>
                            <span className="text-slate-500 ml-2">Strength: {ob.strength}%</span>
                          </div>
                          <span className="text-slate-400 text-xs">
                            {Math.abs(asset.price - ob.priceLevel).toFixed(4)} away
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">{ob.description}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Support & Resistance */}
              <div className="grid grid-cols-2 gap-4">
                {analysis?.support && analysis.support.length > 0 && (
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-sm font-semibold text-blue-400 mb-2">Support Levels</h3>
                    <div className="space-y-1 text-sm">
                      {analysis.support.map((level: number, i: number) => (
                        <div key={i} className="text-slate-300">
                          ${level.toFixed(4)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {analysis?.resistance && analysis.resistance.length > 0 && (
                  <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                    <h3 className="text-sm font-semibold text-amber-400 mb-2">Resistance Levels</h3>
                    <div className="space-y-1 text-sm">
                      {analysis.resistance.map((level: number, i: number) => (
                        <div key={i} className="text-slate-300">
                          ${level.toFixed(4)}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
