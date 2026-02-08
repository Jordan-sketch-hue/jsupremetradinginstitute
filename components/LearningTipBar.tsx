'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

const TIPS = [
  'Track liquidity sweeps around session opens for clearer direction.',
  'Protect entries with defined stops and scale at planned take-profit targets.',
  'Higher timeframes set bias; lower timeframes refine execution.',
  'London–New York overlap often brings the cleanest moves.',
  'Don’t overtrade ranges — wait for expansion confirmation.',
]

export default function LearningTipBar() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % TIPS.length)
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-slate-900/80 border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-sm">
        <div className="flex items-center gap-2 text-slate-300">
          <Sparkles className="w-4 h-4 text-royal-emerald" />
          <span className="font-semibold text-white">Learning Tip:</span>
          <span>{TIPS[index]}</span>
        </div>
        <Link
          href="/learning-path"
          className="text-royal-emerald hover:text-emerald-300 font-semibold"
        >
          Explore Learning Path →
        </Link>
      </div>
    </div>
  )
}
