'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, CheckCircle } from 'lucide-react'

interface TradeConfirmationDialogProps {
  isOpen: boolean
  trade: {
    symbol: string
    signal: 'BUY' | 'SELL'
    entry: number
    sl: number
    tp: number
    confidence: number
  }
  onConfirm: (trade: any) => void
  onCancel: () => void
  loading?: boolean
}

export default function TradeConfirmationDialog({
  isOpen,
  trade,
  onConfirm,
  onCancel,
  loading = false,
}: TradeConfirmationDialogProps) {
  const [buyLimit, setBuyLimit] = useState<number>(trade.entry)
  const [stopLimit, setStopLimit] = useState<number>(trade.sl)
  const [errors, setErrors] = useState<string[]>([])

  const handleConfirm = () => {
    const newErrors: string[] = []

    // Validate prices
    if (trade.signal === 'BUY') {
      if (stopLimit >= buyLimit) {
        newErrors.push('For BUY: Stop Loss must be less than Entry')
      }
      if (trade.tp <= buyLimit) {
        newErrors.push('For BUY: Take Profit must be greater than Entry')
      }
    } else {
      if (stopLimit <= buyLimit) {
        newErrors.push('For SELL: Stop Loss must be greater than Entry')
      }
      if (trade.tp >= buyLimit) {
        newErrors.push('For SELL: Take Profit must be less than Entry')
      }
    }

    // Calculate R/R
    const risk = Math.abs(buyLimit - stopLimit)
    const reward = Math.abs(trade.tp - buyLimit)
    const rr = reward / risk

    if (rr < 0.5) {
      newErrors.push(`Risk/Reward ${rr.toFixed(2)}:1 is too low (minimum 0.5:1)`)
    }

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors([])
    onConfirm({
      ...trade,
      buyLimit,
      stopLimit,
    })
  }

  const rr = Math.abs(trade.tp - buyLimit) / Math.abs(buyLimit - stopLimit) || 0
  const emoji = trade.signal === 'BUY' ? '🟢' : '🔴'
  const riskAmount = Math.abs(buyLimit - stopLimit) * 10 // For 0.1 lot

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-md w-full p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{emoji}</span>
                <div>
                  <h2 className="text-xl font-bold text-white">{trade.symbol}</h2>
                  <p className="text-sm text-slate-400">{trade.signal} Signal</p>
                </div>
              </div>
              <button
                onClick={onCancel}
                disabled={loading}
                className="text-slate-400 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Confidence Badge */}
            <div className="bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/30 rounded-lg p-3 mb-4">
              <p className="text-sm font-semibold text-emerald-400">
                Confidence: {trade.confidence}%
              </p>
            </div>

            {/* Price Inputs */}
            <div className="space-y-4 mb-6">
              {/* Entry Price */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  📍 Buy Limit Price
                </label>
                <input
                  type="number"
                  value={buyLimit}
                  onChange={e => {
                    setBuyLimit(parseFloat(e.target.value))
                    setErrors([])
                  }}
                  disabled={loading}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  step="0.0001"
                />
                <p className="text-xs text-slate-400 mt-1">Current: {trade.entry.toFixed(4)}</p>
              </div>

              {/* Stop Loss */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  🛑 Stop Loss Price
                </label>
                <input
                  type="number"
                  value={stopLimit}
                  onChange={e => {
                    setStopLimit(parseFloat(e.target.value))
                    setErrors([])
                  }}
                  disabled={loading}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  step="0.0001"
                />
                <p className="text-xs text-slate-400 mt-1">Default: {trade.sl.toFixed(4)}</p>
              </div>

              {/* Take Profit (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  🎯 Take Profit
                </label>
                <input
                  type="number"
                  value={trade.tp}
                  disabled
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-slate-400 cursor-not-allowed"
                  step="0.0001"
                />
              </div>
            </div>

            {/* Risk/Reward Info */}
            <div className="grid grid-cols-3 gap-2 mb-6 bg-slate-800/50 rounded-lg p-3">
              <div className="text-center">
                <p className="text-xs text-slate-400">Risk Amount</p>
                <p className="text-sm font-bold text-red-400">${riskAmount.toFixed(2)}</p>
              </div>
              <div className="text-center border-l border-r border-slate-700">
                <p className="text-xs text-slate-400">R:R Ratio</p>
                <p className="text-sm font-bold text-emerald-400">{rr.toFixed(2)}:1</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-slate-400">Profit Target</p>
                <p className="text-sm font-bold text-cyan-400">${(riskAmount * rr).toFixed(2)}</p>
              </div>
            </div>

            {/* Errors */}
            <AnimatePresence>
              {errors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-4"
                >
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex gap-2">
                    <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-red-300">
                      {errors.map((error, idx) => (
                        <p key={idx}>{error}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} />
                {loading ? 'Confirming...' : 'Confirm Trade'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onCancel}
                disabled={loading}
                className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-200 font-bold py-2 px-4 rounded-lg transition-all"
              >
                Cancel
              </motion.button>
            </div>

            {/* Info */}
            <p className="text-xs text-slate-500 text-center mt-4">
              💡 Adjust buy limit and stop loss as needed. Take profit is fixed.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
