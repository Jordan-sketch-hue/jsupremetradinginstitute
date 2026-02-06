'use client'

// Live market ticker widget for sitewide display

import { TrendingUp, TrendingDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface MarketData {
  symbol: string
  price: number
  change: number
  changePercent: number
}

const MARKET_DATA: MarketData[] = [
  { symbol: 'EUR/USD', price: 1.0952, change: 0.0045, changePercent: 0.42 },
  { symbol: 'GBP/USD', price: 1.2745, change: 0.0035, changePercent: 0.27 },
  { symbol: 'USD/JPY', price: 149.35, change: -0.82, changePercent: -0.55 },
  { symbol: 'XAU/USD', price: 2145.75, change: 15.25, changePercent: 0.71 },
  { symbol: 'SPX500', price: 5234.8, change: 45.32, changePercent: 0.87 },
]

export default function MarketTicker() {
  const [markets, setMarkets] = useState<MarketData[]>(MARKET_DATA)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate slight price movements
      setMarkets(prevMarkets =>
        prevMarkets.map(market => ({
          ...market,
          price: market.price + (Math.random() - 0.5) * 0.001,
          changePercent: market.changePercent + (Math.random() - 0.5) * 0.1,
          change: market.changePercent * market.price * 0.01,
        }))
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  // Horizontal scroll animation
  useEffect(() => {
    const scrollInterval = setInterval(() => {
      setScrollPosition(prev => (prev + 1) % 100)
    }, 50)
    return () => clearInterval(scrollInterval)
  }, [])

  return (
    <div className="fixed top-20 left-0 right-0 z-40 bg-gradient-to-r from-matte-black via-royal-green to-matte-black text-white py-3 overflow-hidden border-b border-royal-green/20">
      <div className="flex items-center space-x-8 px-4 whitespace-nowrap">
        <div className="flex items-center space-x-2 font-bold text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>LIVE MARKETS</span>
        </div>

        <div className="flex space-x-8 animate-scroll">
          {[...markets, ...markets].map((market, idx) => (
            <motion.div
              key={idx}
              className="flex items-center space-x-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm min-w-max"
              whileHover={{ scale: 1.05 }}
            >
              <span className="font-semibold text-sm">{market.symbol}</span>
              <span className="text-right min-w-[80px]">
                ${market.price.toFixed(market.symbol.includes('/') ? 4 : 2)}
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
