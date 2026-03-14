'use client'

import { useState, useEffect, useRef } from 'react'
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
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState(0)
  const [isPanning, setIsPanning] = useState(false)
  const [panStartX, setPanStartX] = useState(0)
  const chartRef = useRef<HTMLDivElement>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; candle: Candle | null } | null>(
    null
  )
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

  // Always render a minimal chart frame, even if no data
  if (!candles || candles.length === 0) {
    return (
      <div className="w-full bg-slate-800 rounded-lg p-4 border border-slate-700 min-h-[300px] flex flex-col items-center justify-center">
        <svg width={800} height={400} className="bg-slate-900 rounded border border-slate-700">
          <text x="50%" y="50%" textAnchor="middle" fill="#64748b" fontSize="18">
            No data available
          </text>
        </svg>
      </div>
    )
  }

  // Chart logic
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
  const visibleCandles = Math.max(24, Math.floor(candles.length / zoom))
  const maxPan = Math.max(0, candles.length - visibleCandles)
  const panIndex = Math.min(maxPan, Math.max(0, Math.round(pan)))
  const displayCandles = candles.slice(panIndex, panIndex + visibleCandles)
  const safeDisplayCount = Math.max(1, displayCandles.length)
  const xStep = chartWidth / safeDisplayCount

  // Candles
  const candleElements = displayCandles.map((candle, i) => {
    const x = i * xStep
    const yOpen = priceToY(candle.open)
    const yClose = priceToY(candle.close)
    const yHigh = priceToY(candle.high)
    const yLow = priceToY(candle.low)
    const isGreen = candle.close > candle.open
    const color = isGreen ? '#10b981' : '#ef4444'
    const wickY = Math.min(yHigh, yOpen, yClose)
    const wickHeight = Math.max(yLow, yOpen, yClose) - wickY
    // Prevent negative/zero width/height
    const rectWidth = Math.max(1, xStep - 4)
    const rectHeight = Math.max(1, Math.abs(yClose - yOpen))
    return (
      <g
        key={i}
        onMouseMove={e => {
          setTooltip({ x: x + xStep / 2, y: yClose, candle })
        }}
        onMouseLeave={() => setTooltip(null)}
        onTouchStart={e => {
          setTooltip({ x: x + xStep / 2, y: yClose, candle })
        }}
        onTouchEnd={() => setTooltip(null)}
      >
        <line
          x1={x + xStep / 2}
          y1={wickY}
          x2={x + xStep / 2}
          y2={wickY + wickHeight}
          stroke={color}
          strokeWidth="1"
        />
        <rect
          x={x + 2}
          y={Math.min(yOpen, yClose)}
          width={rectWidth}
          height={rectHeight}
          fill={color}
          opacity="0.8"
        />
      </g>
    )
  })

  const linePoints = displayCandles
    .map((candle, index) => `${index * xStep + xStep / 2},${priceToY(candle.close)}`)
    .join(' ')

  // Order blocks
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

  // Liquidity sweeps
  const sweepMarkers = displayCandles
    .map((candle, index) => {
      if (index < 6) return null
      const lookback = displayCandles.slice(index - 6, index)
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
    const idx = Math.round((i * displayCandles.length - 1) / xAxisTicks)
    const candle = displayCandles[idx]
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

  // Pinch-to-zoom and drag-to-pan handlers
  useEffect(() => {
    const chartDiv = chartRef.current
    if (!chartDiv) return
    let lastTouchDist: number | null = null
    let lastPanX: number | null = null
    function getTouchDist(e: TouchEvent) {
      if (e.touches.length < 2) return null
      const dx = e.touches[0].clientX - e.touches[1].clientX
      const dy = e.touches[0].clientY - e.touches[1].clientY
      return Math.sqrt(dx * dx + dy * dy)
    }
    function handleTouchStart(e: TouchEvent) {
      if (e.touches.length === 2) {
        lastTouchDist = getTouchDist(e)
      } else if (e.touches.length === 1) {
        lastPanX = e.touches[0].clientX
      }
    }
    function handleTouchMove(e: TouchEvent) {
      if (e.touches.length === 2 && lastTouchDist) {
        const dist = getTouchDist(e)
        if (dist) {
          let newZoom = zoom * (dist / lastTouchDist)
          newZoom = Math.max(1, Math.min(6, newZoom))
          setZoom(newZoom)
          lastTouchDist = dist
        }
      } else if (e.touches.length === 1 && lastPanX !== null) {
        const dx = e.touches[0].clientX - lastPanX
        setPan(p => Math.max(0, Math.min(maxPan, p - dx / 20)))
        lastPanX = e.touches[0].clientX
      }
    }
    function handleTouchEnd(e: TouchEvent) {
      lastTouchDist = null
      lastPanX = null
    }
    chartDiv.addEventListener('touchstart', handleTouchStart, { passive: false })
    chartDiv.addEventListener('touchmove', handleTouchMove, { passive: false })
    chartDiv.addEventListener('touchend', handleTouchEnd, { passive: false })
    return () => {
      chartDiv.removeEventListener('touchstart', handleTouchStart)
      chartDiv.removeEventListener('touchmove', handleTouchMove)
      chartDiv.removeEventListener('touchend', handleTouchEnd)
    }
  }, [maxPan, zoom])

  // Mouse drag-to-pan
  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    setIsPanning(true)
    setPanStartX(e.clientX)
  }
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (isPanning) {
      const dx = e.clientX - panStartX
      setPan(p => Math.max(0, Math.min(maxPan, p - dx / 20)))
      setPanStartX(e.clientX)
    }
  }
  function handleMouseUp() {
    setIsPanning(false)
  }

  return (
    <div
      ref={chartRef}
      className="w-full bg-slate-800 rounded-lg p-4 border border-slate-700"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isPanning ? 'grabbing' : 'grab', userSelect: 'none', position: 'relative' }}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-semibold text-slate-100">
          {symbol} Price Action ({timeframe.toUpperCase()})
        </h3>
        <div className="text-sm text-slate-400">Current: ${currentPrice.toFixed(4)}</div>
      </div>
      {/* Improved Nav Bar & Zoom Controls */}
      <div className="mb-3 flex flex-wrap gap-2 items-center bg-slate-900 rounded-lg px-3 py-2 border border-slate-700">
        {/* Chart Mode */}
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors ${chartMode === 'candles' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          onClick={() => setChartMode('candles')}
        >
          🕯️ Candlestick
        </button>
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors ${chartMode === 'line' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          onClick={() => setChartMode('line')}
        >
          📈 Line
        </button>
        {/* OB Range */}
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors ${obRangeMode === 'recent' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          onClick={() => setObRangeMode('recent')}
        >
          Recent OBs
        </button>
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors ${obRangeMode === 'older' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          onClick={() => setObRangeMode('older')}
        >
          Older OBs
        </button>
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors ${obRangeMode === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          onClick={() => setObRangeMode('all')}
        >
          All OBs
        </button>
        {/* Overlays */}
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors ${showBullishOB ? 'bg-green-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          onClick={() => setShowBullishOB(v => !v)}
        >
          Bullish OB
        </button>
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors ${showBearishOB ? 'bg-red-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          onClick={() => setShowBearishOB(v => !v)}
        >
          Bearish OB
        </button>
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors ${showSupport ? 'bg-blue-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          onClick={() => setShowSupport(v => !v)}
        >
          Support
        </button>
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors ${showResistance ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          onClick={() => setShowResistance(v => !v)}
        >
          Resistance
        </button>
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors ${showEntryTargets ? 'bg-lime-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          onClick={() => setShowEntryTargets(v => !v)}
        >
          Entry / TP
        </button>
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors ${showStopLoss ? 'bg-red-900 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          onClick={() => setShowStopLoss(v => !v)}
        >
          Stop Loss
        </button>
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors ${showCurrentPrice ? 'bg-purple-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          onClick={() => setShowCurrentPrice(v => !v)}
        >
          Current Price
        </button>
        <button
          className={`px-3 py-1 rounded font-semibold transition-colors ${showLiquiditySweeps ? 'bg-orange-700 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
          onClick={() => setShowLiquiditySweeps(v => !v)}
        >
          Liquidity Sweeps
        </button>
        {/* Zoom Controls */}
        <div className="flex items-center gap-1 ml-4">
          <button
            className="px-2 py-1 rounded bg-slate-700 text-white font-bold"
            onClick={() => setZoom(z => Math.max(1, z - 0.5))}
            title="Zoom Out"
          >
            -
          </button>
          <span className="px-2 text-slate-300">Zoom: {zoom.toFixed(1)}x</span>
          <button
            className="px-2 py-1 rounded bg-slate-700 text-white font-bold"
            onClick={() => setZoom(z => Math.min(6, z + 0.5))}
            title="Zoom In"
          >
            +
          </button>
          <button
            className="px-2 py-1 rounded bg-slate-700 text-white font-bold"
            onClick={() => {
              setZoom(1)
              setPan(0)
            }}
            title="Reset View"
          >
            ⟳
          </button>
        </div>
      </div>
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
            {/* Grid lines */}
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
            {/* Order Blocks */}
            {showBullishOB && bullishObElements}
            {showBearishOB && bearishObElements}
            {/* Support/Resistance */}
            {showSupport && supportElements}
            {showResistance && resistanceElements}
            {/* Price representation */}
            {chartMode === 'candles' ? (
              candleElements
            ) : (
              <polyline points={linePoints} fill="none" stroke="#38bdf8" strokeWidth="2" />
            )}
            {/* Liquidity Sweeps */}
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
            {/* Entry/TP Lines */}
            {showEntryTargets && (
              <>
                <line
                  x1="0"
                  y1={yEntry}
                  x2={chartWidth}
                  y2={yEntry}
                  stroke="#22c55e"
                  strokeWidth="2.5"
                  strokeDasharray="4"
                  opacity="0.95"
                />
                <text x={8} y={yEntry - 6} fill="#22c55e" fontSize="13" fontWeight="900">
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
                        stroke="#facc15"
                        strokeWidth="3"
                        strokeDasharray="6"
                        opacity="0.95"
                      />
                      <text
                        x={chartWidth - 70}
                        y={y - 6}
                        fill="#facc15"
                        fontSize="13"
                        fontWeight="900"
                        style={{ textShadow: '0 1px 4px #000' }}
                      >
                        TP: {tp.label}
                      </text>
                    </g>
                  )
                })}
              </>
            )}
          </svg>
        </div>
      </div>
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
      {tooltip && tooltip.candle && (
        <div
          style={{
            position: 'absolute',
            left: tooltip.x + 40,
            top: tooltip.y + 60,
            background: 'rgba(30,41,59,0.95)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '13px',
            pointerEvents: 'none',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          <div>
            <b>Time:</b> {new Date(tooltip.candle.timestamp).toLocaleString()}
          </div>
          <div>
            <b>Open:</b> {tooltip.candle.open}
          </div>
          <div>
            <b>High:</b> {tooltip.candle.high}
          </div>
          <div>
            <b>Low:</b> {tooltip.candle.low}
          </div>
          <div>
            <b>Close:</b> {tooltip.candle.close}
          </div>
          <div>
            <b>Volume:</b> {tooltip.candle.volume}
          </div>
        </div>
      )}
    </div>
  )
}
