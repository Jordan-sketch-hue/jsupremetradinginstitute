'use client'

import { useState, useEffect } from 'react'
import { X, TrendingUp } from 'lucide-react'
import OrderBlockChart from './OrderBlockChart'
import { Candle, OrderBlock } from '@/lib/orderBlockDetection'

interface AssetDetailModalProps {
  asset: {
    symbol: string
    name: string
    price: number
    signal: string
    confidence: number
    type: string
  }
  onClose: () => void
}

export default function AssetDetailModal({ asset, onClose }: AssetDetailModalProps) {
  const [loading, setLoading] = useState(true)
  const [analysis, setAnalysis] = useState<any>(null)
  const [candles, setCandles] = useState<Candle[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        setLoading(true)
        // Fetch historical data
        const histRes = await fetch(
          `/api/market-data/historical?symbol=${asset.symbol}&type=${asset.type}`
        )
        const histData = await histRes.json()

        if (histData.candles) {
          setCandles(histData.candles)
        }

        // Fetch order block analysis
        const analysisRes = await fetch(
          `/api/analysis/order-blocks?symbol=${asset.symbol}&signal=${asset.signal}&price=${asset.price}&type=${asset.type}`
        )
        const analysisData = await analysisRes.json()
        setAnalysis(analysisData)
      } catch (err) {
        console.error('Error fetching analysis:', err)
        setError('Failed to load analysis')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [asset])

  const pooledConfidence = Math.round(
    ((asset.confidence * 0.4 + (analysis?.obConfidence || 0) * 0.6) / 100) * 100
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-slate-900 rounded-lg shadow-2xl max-w-4xl w-full my-8 border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <TrendingUp
              className={`w-6 h-6 ${asset.signal === 'BUY' ? 'text-green-500' : 'text-red-500'}`}
            />
            <div>
              <h2 className="text-2xl font-bold text-slate-100">{asset.name}</h2>
              <p className="text-sm text-slate-400">{asset.symbol}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
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

              {/* Chart */}
              {candles.length > 0 && (
                <OrderBlockChart
                  symbol={asset.symbol}
                  candles={candles}
                  orderBlocks={analysis?.orderBlocks || []}
                  support={analysis?.support || []}
                  resistance={analysis?.resistance || []}
                  nearestOB={analysis?.nearestOB || null}
                  currentPrice={asset.price}
                />
              )}

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
