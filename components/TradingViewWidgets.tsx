'use client'

import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, BarChart3, Globe } from 'lucide-react'

declare global {
  interface Window {
    TradingView: any
  }
}

export default function TradingViewWidgets() {
  const tickerRef = useRef<HTMLDivElement>(null)
  const miniChartRef = useRef<HTMLDivElement>(null)
  const screenerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load TradingView widget script
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: [
        { description: 'EUR/USD', proName: 'FX_IDC:EURUSD' },
        { description: 'GBP/USD', proName: 'FX_IDC:GBPUSD' },
        { description: 'USD/JPY', proName: 'FX_IDC:USDJPY' },
        { description: 'AUD/USD', proName: 'FX_IDC:AUDUSD' },
        { description: 'XAU/USD', proName: 'TVC:GOLD' },
        { description: 'BTC/USD', proName: 'BITSTAMP:BTCUSD' },
        { description: 'ETH/USD', proName: 'BITSTAMP:ETHUSD' },
        { description: 'SPX500', proName: 'SP:SPX' },
      ],
      showSymbolLogo: true,
      colorTheme: 'dark',
      isTransparent: true,
      displayMode: 'adaptive',
      locale: 'en',
    })

    if (tickerRef.current) {
      tickerRef.current.appendChild(script)
    }

    return () => {
      if (tickerRef.current) {
        tickerRef.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div className="space-y-8">
      {/* Live Ticker Tape */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-matte-black/50 border border-royal-green/30 rounded-xl overflow-hidden"
      >
        <div className="p-4 border-b border-royal-green/30">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-royal-emerald" />
            <h3 className="text-white font-semibold">Live Market Prices</h3>
          </div>
        </div>
        <div ref={tickerRef} className="tradingview-widget-container">
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </motion.div>
    </div>
  )
}

// Mini Chart Widget Component
export function MiniChartWidget({ symbol = 'FX_IDC:EURUSD' }: { symbol?: string }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbol: symbol,
      width: '100%',
      height: '100%',
      locale: 'en',
      dateRange: '1D',
      colorTheme: 'dark',
      trendLineColor: 'rgba(4, 99, 7, 1)',
      underLineColor: 'rgba(1, 68, 33, 0.3)',
      underLineBottomColor: 'rgba(1, 68, 33, 0)',
      isTransparent: true,
      autosize: true,
      largeChartUrl: '',
    })

    if (containerRef.current) {
      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [symbol])

  return (
    <div ref={containerRef} className="tradingview-widget-container h-96">
      <div className="tradingview-widget-container__widget"></div>
    </div>
  )
}

// Advanced Chart Widget
export function AdvancedChartWidget({
  symbol = 'EURUSD',
  height = 610,
}: {
  symbol?: string
  height?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: '15',
      timezone: 'Etc/UTC',
      theme: 'dark',
      style: '1',
      locale: 'en',
      enable_publishing: false,
      backgroundColor: 'rgba(0, 0, 0, 0)',
      gridColor: 'rgba(1, 68, 33, 0.2)',
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      support_host: 'https://www.tradingview.com',
    })

    if (containerRef.current) {
      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [symbol, height])

  return (
    <div className="tradingview-widget-container" style={{ height, width: '100%' }}>
      <div
        ref={containerRef}
        className="tradingview-widget-container__widget"
        style={{ height: 'calc(100% - 32px)', width: '100%' }}
      ></div>
    </div>
  )
}

// Market Overview Screener
export function MarketScreenerWidget() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: 490,
      defaultColumn: 'overview',
      defaultScreen: 'general',
      market: 'forex',
      showToolbar: true,
      colorTheme: 'dark',
      locale: 'en',
      isTransparent: true,
    })

    if (containerRef.current) {
      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div className="tradingview-widget-container">
      <div ref={containerRef} className="tradingview-widget-container__widget"></div>
    </div>
  )
}

// Economic Calendar
export function EconomicCalendarWidget() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: 400,
      colorTheme: 'dark',
      isTransparent: true,
      locale: 'en',
      importanceFilter: '0,1',
      countryFilter: 'us,eu,gb,jp,au,cn',
    })

    if (containerRef.current) {
      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div className="tradingview-widget-container">
      <div ref={containerRef} className="tradingview-widget-container__widget"></div>
    </div>
  )
}

// Forex Heatmap
export function ForexHeatmapWidget() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      width: '100%',
      height: 400,
      currencies: ['EUR', 'USD', 'JPY', 'GBP', 'CHF', 'AUD', 'CAD', 'NZD'],
      isTransparent: true,
      colorTheme: 'dark',
      locale: 'en',
    })

    if (containerRef.current) {
      containerRef.current.innerHTML = ''
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ''
      }
    }
  }, [])

  return (
    <div className="tradingview-widget-container">
      <div ref={containerRef} className="tradingview-widget-container__widget"></div>
    </div>
  )
}
