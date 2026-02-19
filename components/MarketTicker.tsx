'use client'

// Live market ticker widget for sitewide display

import { TrendingUp, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MarketData {
  symbol: string
  label: string
  price: number
  change: number
  changePercent: number
  decimals: number
}

const TICKER_SYMBOLS = [
  { symbol: 'EURUSD', label: 'EUR/USD', type: 'forex', decimals: 5 },
  { symbol: 'GBPUSD', label: 'GBP/USD', type: 'forex', decimals: 5 },
  { symbol: 'USDJPY', label: 'USD/JPY', type: 'forex', decimals: 3 },
  { symbol: 'XAUUSD', label: 'XAU/USD', type: 'commodities', decimals: 2 },
  { symbol: 'US500', label: 'SPX500', type: 'indices', decimals: 2 },
  { symbol: 'BTCUSD', label: 'BTC/USD', type: 'crypto', decimals: 2 },
  { symbol: 'ETHUSD', label: 'ETH/USD', type: 'crypto', decimals: 2 },
]

export default function MarketTicker() {
  const [markets, setMarkets] = useState<MarketData[]>([])

  useEffect(() => {
    let isMounted = true

    const fetchData = async () => {
      try {
        const forexSymbols = TICKER_SYMBOLS.filter(s => s.type === 'forex').map(s => s.symbol)
        const cryptoSymbols = TICKER_SYMBOLS.filter(s => s.type === 'crypto').map(s => s.symbol)
        const indexSymbols = TICKER_SYMBOLS.filter(s => s.type === 'indices').map(s => s.symbol)
        const commoditySymbols = TICKER_SYMBOLS.filter(s => s.type === 'commodities').map(
          s => s.symbol
        )

        const [forexRes, cryptoRes, indicesRes, commoditiesRes] = await Promise.all([
          forexSymbols.length
            ? fetch(`/api/market-data/forex?symbols=${forexSymbols.join(',')}`)
            : null,
          cryptoSymbols.length
            ? fetch(`/api/market-data/crypto?symbols=${cryptoSymbols.join(',')}`)
            : null,
          indexSymbols.length
            ? fetch(`/api/market-data/indices?symbols=${indexSymbols.join(',')}`)
            : null,
          commoditySymbols.length
            ? fetch(`/api/market-data/commodities?symbols=${commoditySymbols.join(',')}`)
            : null,
        ])

        const [forexData, cryptoData, indexData, commodityData] = await Promise.all([
          forexRes?.ok ? forexRes.json() : [],
          cryptoRes?.ok ? cryptoRes.json() : [],
          indicesRes?.ok ? indicesRes.json() : [],
          commoditiesRes?.ok ? commoditiesRes.json() : [],
        ])

        const merged: MarketData[] = TICKER_SYMBOLS.map(config => {
          if (config.type === 'forex') {
            const item = (forexData as any[]).find(d => d.symbol === config.symbol)
            const price = item ? (item.bid + item.ask) / 2 : 0
            return {
              symbol: config.symbol,
              label: config.label,
              price,
              change: item?.change || 0,
              changePercent: item?.changePercent || 0,
              decimals: config.decimals,
            }
          }

          if (config.type === 'crypto') {
            const item = (cryptoData as any[]).find(d => d.symbol === config.symbol)
            return {
              symbol: config.symbol,
              label: config.label,
              price: item?.price || 0,
              change: item?.change24h || 0,
              changePercent: item?.changePercent24h || 0,
              decimals: config.decimals,
            }
          }

          if (config.type === 'indices') {
            const item = (indexData as any[]).find(d => d.symbol === config.symbol)
            return {
              symbol: config.symbol,
              label: config.label,
              price: item?.price || 0,
              change: item?.change || 0,
              changePercent: item?.changePercent || 0,
              decimals: config.decimals,
            }
          }

          const item = (commodityData as any[]).find(d => d.symbol === config.symbol)
          return {
            symbol: config.symbol,
            label: config.label,
            price: item?.price || 0,
            change: item?.change || 0,
            changePercent: item?.changePercent || 0,
            decimals: config.decimals,
          }
        }).filter(entry => entry.price > 0)

        if (isMounted) {
          setMarkets(merged)
        }
      } catch (error) {
        console.warn('[MarketTicker] Failed to fetch live prices', error)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 30000)

    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-matte-black via-royal-green to-matte-black text-white h-12 overflow-hidden border-b border-royal-green/20">
      <div className="h-full flex items-center gap-6 px-4 whitespace-nowrap">
        <div className="hidden md:flex items-center space-x-2 font-bold text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>LIVE PRICES</span>
        </div>

        <div className="flex-1 overflow-hidden">
          <div className="flex space-x-6 animate-scroll">
            {[...markets, ...markets].map((market, idx) => (
              <motion.div
                key={idx}
                className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm min-w-max"
                whileHover={{ scale: 1.05 }}
              >
                <span className="font-semibold text-sm">{market.label}</span>
                <span className="text-right min-w-[80px]">
                  ${market.price.toFixed(market.decimals)}
                </span>
                <div
                  className={`flex items-center space-x-1 ${
                    market.changePercent >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {market.changePercent >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  <span className="text-xs font-mono">
                    {market.changePercent >= 0 ? '+' : ''}
                    {market.changePercent.toFixed(2)}%
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
      `}</style>
    </div>
  )
}
