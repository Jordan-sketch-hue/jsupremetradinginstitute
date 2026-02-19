'use client'

import { useState, useEffect } from 'react'
import { OrderBlock, Candle } from '@/lib/orderBlockDetection'

interface OrderBlockChartProps {
  symbol: string
  timeframe: string
  candles: Candle[]
  orderBlocks: OrderBlock[]
  support: number[]
  resistance: number[]
  nearestOB: OrderBlock | null
  currentPrice: number
  entryPrice: number
  stopLoss: number
  takeProfitTargets: Array<{ label: string; price: number }>
}

export default function OrderBlockChart({
  symbol,
  timeframe,
  candles,
  orderBlocks,
  support,
  resistance,
  nearestOB,
  currentPrice,
  entryPrice,
  stopLoss,
  takeProfitTargets,
}: OrderBlockChartProps) {
  const [chartWidth, setChartWidth] = useState(800)
  const [chartHeight] = useState(400)

  useEffect(() => {
    const handleResize = () => setChartWidth(window.innerWidth - 40)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (candles.length === 0)
    return <div className="text-center p-4 text-slate-400">No data available</div>

  // Calculate price range and pixel mapping
  const prices = candles.map(c => [c.high, c.low, c.close]).flat()
  const overlayPrices = [
    currentPrice,
    entryPrice,
    stopLoss,
    ...takeProfitTargets.map(tp => tp.price),
  ]
  const allPrices = [...prices, ...overlayPrices]
  const minPrice = Math.min(...allPrices)
  const maxPrice = Math.max(...allPrices)
  const priceRange = maxPrice - minPrice
  const padding = priceRange * 0.1

  const yMin = minPrice - padding
  const yMax = maxPrice + padding
  const yRange = yMax - yMin

  const priceToY = (price: number) => chartHeight - ((price - yMin) / yRange) * chartHeight
  const xStep = chartWidth / candles.length

  // Render candles
  const candleElements = candles.map((candle, i) => {
    const x = i * xStep
    const yOpen = priceToY(candle.open)
    const yClose = priceToY(candle.close)
    const yHigh = priceToY(candle.high)
    const yLow = priceToY(candle.low)

    const isGreen = candle.close > candle.open
    const color = isGreen ? '#10b981' : '#ef4444'
    const wickY = Math.min(yHigh, yOpen, yClose)
    const wickHeight = Math.max(yLow, yOpen, yClose) - wickY

    return (
      <g key={i}>
        {/* Wick */}
        <line
          x1={x + xStep / 2}
          y1={wickY}
          x2={x + xStep / 2}
          y2={wickY + wickHeight}
          stroke={color}
          strokeWidth="1"
        />
        {/* Body */}
        <rect
          x={x + 2}
          y={Math.min(yOpen, yClose)}
          width={xStep - 4}
          height={Math.abs(yClose - yOpen) || 1}
          fill={color}
          opacity="0.8"
        />
      </g>
    )
  })

  // Render order blocks
  const obElements = orderBlocks.slice(-8).map((ob, i) => {
    const y1 = priceToY(ob.range.high)
    const y2 = priceToY(ob.range.low)
    const height = Math.abs(y2 - y1)
    const bgColor = ob.type === 'BULLISH' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'
    const borderColor = ob.type === 'BULLISH' ? '#10b981' : '#ef4444'

    return (
      <g key={`ob-${i}`}>
        {/* OB Zone */}
        <rect x="0" y={Math.min(y1, y2)} width={chartWidth} height={height} fill={bgColor} />
        {/* OB Border */}
        <line
          x1="0"
          y1={Math.min(y1, y2)}
          x2={chartWidth}
          y2={Math.min(y1, y2)}
          stroke={borderColor}
          strokeWidth="2"
          strokeDasharray="4"
        />
        <line
          x1="0"
          y1={Math.max(y1, y2)}
          x2={chartWidth}
          y2={Math.max(y1, y2)}
          stroke={borderColor}
          strokeWidth="2"
          strokeDasharray="4"
        />
        <text x="8" y={Math.min(y1, y2) - 4} fill={borderColor} fontSize="11" fontWeight="700">
          {ob.type === 'BULLISH' ? 'Bullish OB' : 'Bearish OB'}
        </text>
      </g>
    )
  })

  // Render support levels
  const supportElements = support.map((level, i) => {
    const y = priceToY(level)
    return (
      <g key={`support-${i}`}>
        <line
          x1="0"
          y1={y}
          x2={chartWidth}
          y2={y}
          stroke="#3b82f6"
          strokeWidth="1"
          strokeDasharray="2"
          opacity="0.6"
        />
      </g>
    )
  })

  // Render resistance levels
  const resistanceElements = resistance.map((level, i) => {
    const y = priceToY(level)
    return (
      <g key={`resistance-${i}`}>
        <line
          x1="0"
          y1={y}
          x2={chartWidth}
          y2={y}
          stroke="#f59e0b"
          strokeWidth="1"
          strokeDasharray="2"
          opacity="0.6"
        />
      </g>
    )
  })

  // Current price line
  const yCurrentPrice = priceToY(currentPrice)
  const yEntry = priceToY(entryPrice)
  const yStop = priceToY(stopLoss)

  return (
    <div className="w-full bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-slate-100">
          {symbol} Price Action ({timeframe.toUpperCase()})
        </h3>
        <div className="text-sm text-slate-400">Current: ${currentPrice.toFixed(4)}</div>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto mb-4">
        <svg
          width={Math.max(chartWidth, 600)}
          height={chartHeight}
          className="bg-slate-900 rounded border border-slate-700"
        >
          {/* Grid */}
          {[0.25, 0.5, 0.75].map(ratio => (
            <line
              key={`hgrid-${ratio}`}
              x1="0"
              y1={chartHeight * ratio}
              x2={chartWidth}
              y2={chartHeight * ratio}
              stroke="#334155"
              strokeWidth="0.5"
              opacity="0.3"
            />
          ))}

          {/* Order Blocks (background) */}
          {obElements}

          {/* Support/Resistance (behind candles) */}
          {supportElements}
          {resistanceElements}

          {/* Candles */}
          {candleElements}

          {/* Current Price Line */}
          <line
            x1="0"
            y1={yCurrentPrice}
            x2={chartWidth}
            y2={yCurrentPrice}
            stroke="#a78bfa"
            strokeWidth="2"
            strokeDasharray="6"
          />
          <text x={8} y={yCurrentPrice - 6} fill="#a78bfa" fontSize="11" fontWeight="700">
            Current
          </text>

          <line
            x1="0"
            y1={yEntry}
            x2={chartWidth}
            y2={yEntry}
            stroke="#22c55e"
            strokeWidth="1.5"
            strokeDasharray="4"
          />
          <text x={8} y={yEntry - 6} fill="#22c55e" fontSize="11" fontWeight="700">
            Entry
          </text>

          <line
            x1="0"
            y1={yStop}
            x2={chartWidth}
            y2={yStop}
            stroke="#ef4444"
            strokeWidth="1.5"
            strokeDasharray="4"
          />
          <text x={8} y={yStop - 6} fill="#ef4444" fontSize="11" fontWeight="700">
            Stop Loss
          </text>

          {takeProfitTargets.map(tp => {
            const y = priceToY(tp.price)
            return (
              <g key={`tp-${tp.label}`}>
                <line
                  x1="0"
                  y1={y}
                  x2={chartWidth}
                  y2={y}
                  stroke="#10b981"
                  strokeWidth="1.25"
                  strokeDasharray="3"
                  opacity="0.8"
                />
                <text x={chartWidth - 70} y={y - 6} fill="#10b981" fontSize="10" fontWeight="700">
                  {tp.label}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500 rounded-sm" />
          <span>Bullish Order Blocks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-red-500 rounded-sm" />
          <span>Bearish Order Blocks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-blue-500" />
          <span>Support Level</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-amber-500" />
          <span>Resistance Level</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-green-500" />
          <span>Entry / TP Lines</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-red-500" />
          <span>Stop Loss Line</span>
        </div>
      </div>

      {/* Order Block Details */}
      {nearestOB && (
        <div className="mt-4 p-3 bg-slate-700 rounded border border-slate-600">
          <div className="text-sm font-semibold text-slate-100 mb-2">Nearest Order Block</div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
            <div>
              <span className="text-slate-400">Type:</span> {nearestOB.type}
            </div>
            <div>
              <span className="text-slate-400">Level:</span> ${nearestOB.priceLevel.toFixed(4)}
            </div>
            <div>
              <span className="text-slate-400">Strength:</span> {nearestOB.strength}%
            </div>
            <div>
              <span className="text-slate-400">Distance:</span>{' '}
              {((Math.abs(currentPrice - nearestOB.priceLevel) / currentPrice) * 100).toFixed(2)}%
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
