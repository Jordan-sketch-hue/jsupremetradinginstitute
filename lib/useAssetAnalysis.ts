import { useState, useEffect } from 'react'
import { analyzeTechnicals, calculateATR } from '@/lib/technicalAnalysis'
import { detectOrderBlocks } from '@/lib/orderBlockDetection'

export interface Asset {
  symbol: string
  name: string
  category: string
}

export interface TakeProfitTarget {
  label: string
  value: number
}

export interface AnalyzedAsset extends Asset {
  price: number
  change: number
  changePercent: number
  rsi: number
  trend: string
  macdSignal: string
  confidence: number
  chartData: { time: string; value: number }[]
  entryZone: string
  stopLoss: string
  takeProfitTargets: TakeProfitTarget[]
}

export function useAssetAnalysis(assetList: Asset[], strategy: string) {
  const [assets, setAssets] = useState<AnalyzedAsset[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAllAssets() {
      setLoading(true)
      const results: AnalyzedAsset[] = []
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
            // Order block and ATR-based TP logic
            const orderBlocks = detectOrderBlocks(candles)
            const atr = calculateATR(candles)
            let takeProfitTargets: TakeProfitTarget[] = []
            if (orderBlocks.length > 0 && price) {
              if (ta.trend === 'UP' || ta.trend === 'BULLISH') {
                // Find nearest bullish OB above price
                const bullishAbove = orderBlocks.filter(
                  ob => ob.type === 'BULLISH' && ob.priceLevel > price
                )
                if (bullishAbove.length > 0) {
                  const nearest = bullishAbove.reduce((a, b) =>
                    a.priceLevel < b.priceLevel ? a : b
                  )
                  takeProfitTargets.push({
                    label: 'TP1 (OB)',
                    value: Number(nearest.priceLevel.toFixed(4)),
                  })
                }
                takeProfitTargets.push({
                  label: 'TP2 (+1 ATR)',
                  value: Number((price + atr).toFixed(4)),
                })
                takeProfitTargets.push({
                  label: 'TP3 (+2 ATR)',
                  value: Number((price + 2 * atr).toFixed(4)),
                })
              } else if (ta.trend === 'DOWN' || ta.trend === 'BEARISH') {
                // Find nearest bearish OB below price
                const bearishBelow = orderBlocks.filter(
                  ob => ob.type === 'BEARISH' && ob.priceLevel < price
                )
                if (bearishBelow.length > 0) {
                  const nearest = bearishBelow.reduce((a, b) =>
                    a.priceLevel > b.priceLevel ? a : b
                  )
                  takeProfitTargets.push({
                    label: 'TP1 (OB)',
                    value: Number(nearest.priceLevel.toFixed(4)),
                  })
                }
                takeProfitTargets.push({
                  label: 'TP2 (-1 ATR)',
                  value: Number((price - atr).toFixed(4)),
                })
                takeProfitTargets.push({
                  label: 'TP3 (-2 ATR)',
                  value: Number((price - 2 * atr).toFixed(4)),
                })
              }
            }
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
              entryZone: data.entryZone || '',
              stopLoss: data.stopLoss || '',
              takeProfitTargets,
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
              entryZone: '',
              stopLoss: '',
              takeProfitTargets: [],
            })
          }
        })
      )
      setAssets(results)
      setLoading(false)
    }
    fetchAllAssets()
  }, [assetList, strategy])

  return { assets, loading }
}
