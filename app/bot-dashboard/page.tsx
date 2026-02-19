'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Zap } from 'lucide-react'

interface BotStatus {
  status: string
  armed: boolean
  trading: boolean
  summary: {
    totalTrades: number
    openTrades: number
    closedTrades: number
    winRate: number
    profitFactor: number
    totalPnL: number
  }
  openPositions: any[]
}

export default function BotDashboard() {
  const [status, setStatus] = useState<BotStatus | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/bot/status')
        const data = await res.json()
        setStatus(data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!status) return <div className="p-8 text-center">Loading...</div>

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white flex items-center gap-3 mb-4">
          <Zap className="w-8 h-8 text-royal-green" />
          Trading Bot Dashboard
        </h1>
        <div
          className={`px-4 py-2 rounded-lg font-semibold inline-block ${
            status.armed && status.trading
              ? 'bg-green-500/20 text-green-300'
              : 'bg-red-500/20 text-red-300'
          }`}
        >
          {status.armed ? '🟢 ARMED' : '🔴 DISARMED'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-slate-800/50 border border-emerald-500/30 rounded-xl p-6"
        >
          <div className="text-slate-400 text-sm mb-2">Total P&L</div>
          <div className="text-3xl font-bold text-emerald-400">
            ${status.summary.totalPnL.toFixed(2)}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="bg-slate-800/50 border border-blue-500/30 rounded-xl p-6"
        >
          <div className="text-slate-400 text-sm mb-2">Win Rate</div>
          <div className="text-3xl font-bold text-blue-400">
            {status.summary.winRate.toFixed(1)}%
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 border border-violet-500/30 rounded-xl p-6"
        >
          <div className="text-slate-400 text-sm mb-2">Open Positions</div>
          <div className="text-3xl font-bold text-violet-400">{status.openPositions.length}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="bg-slate-800/50 border border-gold/30 rounded-xl p-6"
        >
          <div className="text-slate-400 text-sm mb-2">Total Trades</div>
          <div className="text-3xl font-bold text-gold">{status.summary.totalTrades}</div>
        </motion.div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Status Summary</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-slate-400">Closed Trades:</span>{' '}
            <span className="text-white">{status.summary.closedTrades}</span>
          </div>
          <div>
            <span className="text-slate-400">Profit Factor:</span>{' '}
            <span className="text-white">{status.summary.profitFactor.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
