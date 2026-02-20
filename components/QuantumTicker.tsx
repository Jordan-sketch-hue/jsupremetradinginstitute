import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

// Simulate a real-time quantum ticker with animated price waves
export const QuantumTicker: React.FC<{ symbol: string; price: number; change: number }> = ({
  symbol,
  price,
  change,
}) => {
  const [wave, setWave] = useState(0)
  useEffect(() => {
    const interval = setInterval(() => setWave(w => w + 0.1), 50)
    return () => clearInterval(interval)
  }, [])
  return (
    <motion.div className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-900 via-indigo-900 to-purple-900 shadow-lg border border-cyan-700/40 overflow-hidden">
      <span className="font-mono text-lg text-cyan-300 font-bold drop-shadow">{symbol}</span>
      <span
        className={`font-mono text-xl font-extrabold ${change >= 0 ? 'text-emerald-400' : 'text-pink-400'}`}
      >
        {price.toFixed(4)}
      </span>
      <svg
        width="60"
        height="24"
        className="absolute right-2 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none"
      >
        <polyline
          fill="none"
          stroke="#a5b4fc"
          strokeWidth="2"
          points={Array.from(
            { length: 60 },
            (_, i) => `${i},${12 + 8 * Math.sin(wave + i / 4)}`
          ).join(' ')}
        />
      </svg>
      <span
        className={`ml-4 text-xs font-bold ${change >= 0 ? 'text-emerald-300' : 'text-pink-300'}`}
      >
        {change >= 0 ? '+' : ''}
        {change.toFixed(4)}
      </span>
    </motion.div>
  )
}
