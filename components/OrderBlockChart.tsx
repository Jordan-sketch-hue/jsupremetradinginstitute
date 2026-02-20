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
  const STORAGE_KEY = 'order-block-chart-prefs-v2'
  const [chartWidth, setChartWidth] = useState(800)
  const [chartHeight] = useState(400)
  const [chartMode, setChartMode] = useState<'candles' | 'line'>('candles')
  const [obRangeMode, setObRangeMode] = useState<'recent' | 'older' | 'all'>('recent')
  const [showBullishOB, setShowBullishOB] = useState(false)
  const [showBearishOB, setShowBearishOB] = useState(false)
  const [showSupport, setShowSupport] = useState(false)
  const [showResistance, setShowResistance] = useState(false)
  const [showEntryTargets, setShowEntryTargets] = useState(true)
  const [showStopLoss, setShowStopLoss] = useState(false)
  const [showCurrentPrice, setShowCurrentPrice] = useState(false)
  const [showLiquiditySweeps, setShowLiquiditySweeps] = useState(false)

  useEffect(() => {
    const handleResize = () => setChartWidth(window.innerWidth - 40)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (!raw) return

      const prefs = JSON.parse(raw) as Partial<{
        chartMode: 'candles' | 'line'
        obRangeMode: 'recent' | 'older' | 'all'
      }>

      if (prefs.chartMode) setChartMode(prefs.chartMode)
      if (prefs.obRangeMode) setObRangeMode(prefs.obRangeMode)
    } catch {
      // ignore bad local storage payload
    }
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          chartMode,
          obRangeMode,
        })
      )
    } catch {
      // ignore storage exceptions
    }
  }, [chartMode, obRangeMode])

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

  const linePoints = candles
    .map((candle, index) => `${index * xStep + xStep / 2},${priceToY(candle.close)}`)
    .join(' ')

  const sortedOrderBlocks = [...orderBlocks].sort((left, right) => left.timestamp - right.timestamp)
  const recentCut = Math.max(0, sortedOrderBlocks.length - 8)
  const orderBlocksByRange =
    obRangeMode === 'recent'
      ? sortedOrderBlocks.slice(recentCut)
      : obRangeMode === 'older'
        ? sortedOrderBlocks.slice(0, recentCut)
        : sortedOrderBlocks

  const bullishOrderBlocks = orderBlocksByRange.filter(ob => ob.type === 'BULLISH')
  const bearishOrderBlocks = orderBlocksByRange.filter(ob => ob.type === 'BEARISH')

  const sweepMarkers = candles
    .map((candle, index) => {
      if (index < 6) return null

      const lookback = candles.slice(index - 6, index)
      const swingHigh = Math.max(...lookback.map(item => item.high))
      const swingLow = Math.min(...lookback.map(item => item.low))

      const isBuySideSweep = candle.high > swingHigh && candle.close < swingHigh
      const isSellSideSweep = candle.low < swingLow && candle.close > swingLow

      if (!isBuySideSweep && !isSellSideSweep) return null

      return {
        x: index * xStep + xStep / 2,
        y: isBuySideSweep ? priceToY(candle.high) - 8 : priceToY(candle.low) + 8,
        type: isBuySideSweep ? 'BUY_SIDE' : 'SELL_SIDE',
      }
    })
    .filter(
      (value): value is { x: number; y: number; type: 'BUY_SIDE' | 'SELL_SIDE' } => value !== null
    )

  // Render bullish order blocks
  const bullishObElements = bullishOrderBlocks.map((ob, i) => {
    const y1 = priceToY(ob.range.high)
    const y2 = priceToY(ob.range.low)
    const height = Math.abs(y2 - y1)

    return (
      <g key={`bullish-ob-${i}`}>
        <rect
          x="0"
          y={Math.min(y1, y2)}
          width={chartWidth}
          height={height}
          fill="rgba(16, 185, 129, 0.15)"
        />
        <line
          x1="0"
          y1={Math.min(y1, y2)}
          x2={chartWidth}
          y2={Math.min(y1, y2)}
          stroke="#10b981"
          strokeWidth="2"
          strokeDasharray="4"
        />
        <line
          x1="0"
          y1={Math.max(y1, y2)}
          x2={chartWidth}
          y2={Math.max(y1, y2)}
          stroke="#10b981"
          strokeWidth="2"
          strokeDasharray="4"
        />
        <text x="8" y={Math.min(y1, y2) - 4} fill="#10b981" fontSize="11" fontWeight="700">
          Bullish OB
        </text>
      </g>
    )
  })

  // Render bearish order blocks
  const bearishObElements = bearishOrderBlocks.map((ob, i) => {
    const y1 = priceToY(ob.range.high)
    const y2 = priceToY(ob.range.low)
    const height = Math.abs(y2 - y1)

    return (
      <g key={`bearish-ob-${i}`}>
        <rect
          x="0"
          y={Math.min(y1, y2)}
          width={chartWidth}
          height={height}
          fill="rgba(239, 68, 68, 0.15)"
        />
        <line
          x1="0"
          y1={Math.min(y1, y2)}
          x2={chartWidth}
          y2={Math.min(y1, y2)}
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="4"
        />
        <line
          x1="0"
          y1={Math.max(y1, y2)}
          x2={chartWidth}
          y2={Math.max(y1, y2)}
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="4"
        />
        <text x="8" y={Math.min(y1, y2) - 4} fill="#ef4444" fontSize="11" fontWeight="700">
          Bearish OB
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

  // Y-axis price labels (5 intervals)
  const yAxisTicks = 5
  const yAxisLabels = Array.from({ length: yAxisTicks + 1 }, (_, i) => {
    const price = yMax - (i * (yMax - yMin)) / yAxisTicks
    const y = priceToY(price)
    return { price, y }
  })

  // X-axis time labels (6 intervals)
  const xAxisTicks = 6
  const xAxisLabels = Array.from({ length: xAxisTicks + 1 }, (_, i) => {
    const idx = Math.round((i * (candles.length - 1)) / xAxisTicks)
    const candle = candles[idx]
    // Show only hour/minute if available, else index
    let label = ''
    if (candle && candle.timestamp) {
      const d = new Date(candle.timestamp)
      label = d.toLocaleString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
        month: 'short',
        day: 'numeric',
      })
    } else {
      label = idx.toString()
    }
    return { label, x: idx * xStep + xStep / 2 }
  })

  return (
    <div className="w-full bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-slate-100">
          {symbol} Price Action ({timeframe.toUpperCase()})
        </h3>
        <div className="text-sm text-slate-400">Current: ${currentPrice.toFixed(4)}</div>
      </div>

      <div className="mb-3 flex flex-wrap gap-2">
        <button
          onClick={() => setChartMode(mode => (mode === 'candles' ? 'line' : 'candles'))}
          className={`px-2 py-1 text-xs rounded border ${
            chartMode === 'candles'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-600'
          }`}
        >
          Candlestick
        </button>
        <button
          onClick={() => setChartMode(mode => (mode === 'line' ? 'candles' : 'line'))}
          className={`px-2 py-1 text-xs rounded border ${
            chartMode === 'line'
              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-600'
          }`}
        >
          Line
        </button>
        <button
          onClick={() => setObRangeMode('recent')}
          className={`px-2 py-1 text-xs rounded border ${
            obRangeMode === 'recent'
              ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-600'
          }`}
        >
          Recent OBs
        </button>
        <button
          onClick={() => setObRangeMode('older')}
          className={`px-2 py-1 text-xs rounded border ${
            obRangeMode === 'older'
              ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-600'
          }`}
        >
          Older OBs
        </button>
        <button
          onClick={() => setObRangeMode('all')}
          className={`px-2 py-1 text-xs rounded border ${
            obRangeMode === 'all'
              ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-600'
          }`}
        >
          All OBs
        </button>
        <button
          onClick={() => setShowBullishOB(value => !value)}
          className={`px-2 py-1 text-xs rounded border ${
            showBullishOB
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-600'
          }`}
        >
          Bullish OB
        </button>
        <button
          onClick={() => setShowBearishOB(value => !value)}
          className={`px-2 py-1 text-xs rounded border ${
            showBearishOB
              ? 'bg-red-500/20 text-red-300 border-red-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-600'
          }`}
        >
          Bearish OB
        </button>
        <button
          onClick={() => setShowSupport(value => !value)}
          className={`px-2 py-1 text-xs rounded border ${
            showSupport
              ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-600'
          }`}
        >
          Support
        </button>
        <button
          onClick={() => setShowResistance(value => !value)}
          className={`px-2 py-1 text-xs rounded border ${
            showResistance
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-600'
          }`}
        >
          Resistance
        </button>
        <button
          onClick={() => setShowEntryTargets(value => !value)}
          className={`px-2 py-1 text-xs rounded border ${
            showEntryTargets
              ? 'bg-green-500/20 text-green-300 border-green-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-600'
          }`}
        >
          Entry / TP
        </button>
        <button
          onClick={() => setShowStopLoss(value => !value)}
          className={`px-2 py-1 text-xs rounded border ${
            showStopLoss
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-600'
          }`}
        >
          Stop Loss
        </button>
        <button
          onClick={() => setShowCurrentPrice(value => !value)}
          className={`px-2 py-1 text-xs rounded border ${
            showCurrentPrice
              ? 'bg-violet-500/20 text-violet-300 border-violet-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-600'
          }`}
        >
          Current Price
        </button>
        <button
          onClick={() => setShowLiquiditySweeps(value => !value)}
          className={`px-2 py-1 text-xs rounded border ${
            showLiquiditySweeps
              ? 'bg-orange-500/20 text-orange-300 border-orange-500/40'
              : 'bg-slate-900 text-slate-400 border-slate-600'
          }`}
        >
          Liquidity Sweeps
        </button>
      </div>

      {/* Chart */}
      <div className="overflow-x-auto mb-4">
        <div
          style={{
            position: 'relative',
            width: Math.max(chartWidth, 600),
            height: chartHeight + 32,
          }}
        >
          <svg
            width={Math.max(chartWidth, 600)}
            height={chartHeight}
            className="bg-slate-900 rounded border border-slate-700"
            style={{ position: 'absolute', left: 0, top: 0 }}
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
            {/* Y-axis price labels */}
            {yAxisLabels.map((tick, i) => (
              <g key={`yaxis-label-${i}`}>
                <text
                  x={4}
                  y={tick.y + 4}
                  fill="#cbd5e1"
                  fontSize="11"
                  fontWeight="500"
                  textAnchor="start"
                  style={{ userSelect: 'none' }}
                >
                  {tick.price.toFixed(2)}
                </text>
                <line
                  x1={0}
                  y1={tick.y}
                  x2={8}
                  y2={tick.y}
                  stroke="#64748b"
                  strokeWidth="1"
                  opacity="0.4"
                />
              </g>
            ))}

            {/* Order Blocks (background) */}
            {showBullishOB && bullishObElements}
            {showBearishOB && bearishObElements}

            {/* Support/Resistance (behind candles) */}
            {showSupport && supportElements}
            {showResistance && resistanceElements}

            {/* Price representation */}
            {chartMode === 'candles' ? (
              candleElements
            ) : (
              <polyline points={linePoints} fill="none" stroke="#38bdf8" strokeWidth="2" />
            )}

            {showLiquiditySweeps &&
              sweepMarkers.map((marker, index) => (
                <g key={`sweep-${index}`}>
                  <circle
                    cx={marker.x}
                    cy={marker.y}
                    r="4"
                    fill={marker.type === 'BUY_SIDE' ? '#f97316' : '#22c55e'}
                  />
                  <text
                    x={marker.x + 6}
                    y={marker.y - 6}
                    fill={marker.type === 'BUY_SIDE' ? '#fb923c' : '#4ade80'}
                    fontSize="10"
                    fontWeight="700"
                  >
                    {marker.type === 'BUY_SIDE' ? 'BSL Sweep' : 'SSL Sweep'}
                  </text>
                </g>
              ))}

            {/* Current Price Line */}
            {showCurrentPrice && (
              <>
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
              </>
            )}

            {showEntryTargets && (
              <>
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
                      <text
                        x={chartWidth - 70}
                        y={y - 6}
                        fill="#10b981"
                        fontSize="10"
                        fontWeight="700"
                      >
                        {tp.label}
                      </text>
                    </g>
                  )
                })}
              </>
            )}

            {showStopLoss && (
              <>
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
              </>
            )}
          </svg>
          {/* X-axis time labels (below chart) */}
          <svg
            width={Math.max(chartWidth, 600)}
            height={32}
            style={{ position: 'absolute', left: 0, top: chartHeight }}
          >
            {xAxisLabels.map((tick, i) => (
              <text
                key={`xaxis-label-${i}`}
                x={tick.x}
                y={20}
                fill="#cbd5e1"
                fontSize="11"
                fontWeight="500"
                textAnchor="middle"
                style={{ userSelect: 'none' }}
              >
                {tick.label}
              </text>
            ))}
          </svg>
        </div>
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
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-orange-500 rounded-full" />
          <span>Buy/Sell-side Liquidity Sweep</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 border-2 border-cyan-500" />
          <span>Chart Mode (Candles/Line)</span>
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
