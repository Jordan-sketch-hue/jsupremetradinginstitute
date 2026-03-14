// FIXED OrderBlockChart.tsx
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
    } catch {}
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ chartMode, obRangeMode }))
    } catch {}
  }, [chartMode, obRangeMode])

  if (candles.length === 0)
    return <div className="text-center p-4 text-slate-400">No data available</div>

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
  const xStep = chartWidth / displayCandles.length

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
          width={xStep - 4}
          height={Math.abs(yClose - yOpen) || 1}
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
      {/* ...existing code for chart controls, SVG, overlays, legend, and details... */}
      {/* Tooltip */}
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
