'use client'

import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Activity, CheckCircle, XCircle } from 'lucide-react'

export default function OrderBlockSection() {
  return (
    <section className="section-container bg-matte-black text-white">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-playfair font-bold mb-4"
        >
          Order Block <span className="text-accent-gold">Mastery</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300 max-w-3xl mx-auto"
        >
          The last opposing candle before a strong move — where institutions placed their orders
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Bullish Order Block */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-effect rounded-2xl p-8 border-l-4 border-royal-emerald"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-royal-emerald rounded-xl flex items-center justify-center">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-playfair font-bold">Bullish Order Block</h3>
              <p className="text-gray-400">Last bearish candle before impulsive rally</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-royal-emerald bg-opacity-20 rounded-lg p-4">
              <h4 className="font-bold mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 text-accent-gold mr-2" />
                Requirements
              </h4>
              <ul className="space-y-2 text-gray-300 ml-7">
                <li>✓ Strong displacement upward</li>
                <li>✓ Break of structure (BOS)</li>
                <li>✓ High volume move</li>
                <li>✓ Leaves imbalance/inefficiency</li>
              </ul>
            </div>

            <div className="bg-white bg-opacity-5 rounded-lg p-4">
              <h4 className="font-bold mb-2 text-accent-gold">Trading Logic</h4>
              <p className="text-gray-300">
                Price returns to the zone where institutions bought. This becomes future support and a high-probability re-entry zone.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Bearish Order Block */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-effect rounded-2xl p-8 border-l-4 border-red-500"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center">
              <TrendingDown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-playfair font-bold">Bearish Order Block</h3>
              <p className="text-gray-400">Last bullish candle before impulsive selloff</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-red-500 bg-opacity-20 rounded-lg p-4">
              <h4 className="font-bold mb-2 flex items-center">
                <CheckCircle className="w-5 h-5 text-accent-gold mr-2" />
                Requirements
              </h4>
              <ul className="space-y-2 text-gray-300 ml-7">
                <li>✓ Strong displacement downward</li>
                <li>✓ Break of structure (BOS)</li>
                <li>✓ High volume move</li>
                <li>✓ Leaves imbalance/inefficiency</li>
              </ul>
            </div>

            <div className="bg-white bg-opacity-5 rounded-lg p-4">
              <h4 className="font-bold mb-2 text-accent-gold">Trading Logic</h4>
              <p className="text-gray-300">
                Price returns to the zone where institutions sold. This becomes future resistance and a high-probability re-entry zone.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mitigation Status */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {/* Unmitigated */}
        <div className="bg-gradient-to-br from-royal-green to-royal-emerald rounded-2xl p-8">
          <div className="flex items-center space-x-3 mb-4">
            <Activity className="w-8 h-8 text-accent-gold" />
            <h3 className="text-2xl font-playfair font-bold">Unmitigated Order Block</h3>
          </div>
          <p className="text-gray-200 mb-4">
            Price has NOT returned to this zone yet
          </p>
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <p className="font-bold text-accent-gold text-lg mb-2">🔥 Highest Probability</p>
            <p className="text-sm text-gray-200">
              These are your premium setups. Institutions haven't filled their orders yet, creating maximum opportunity.
            </p>
          </div>
        </div>

        {/* Mitigated */}
        <div className="bg-white bg-opacity-5 rounded-2xl p-8 border-2 border-gray-700">
          <div className="flex items-center space-x-3 mb-4">
            <XCircle className="w-8 h-8 text-gray-400" />
            <h3 className="text-2xl font-playfair font-bold text-gray-300">Mitigated Order Block</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Price already revisited and used the orders
          </p>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <p className="font-bold text-gray-300 text-lg mb-2">⚠ Lower Probability</p>
            <p className="text-sm text-gray-400">
              The institutional positioning has been executed. While still valid, priority goes to unmitigated zones.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Interactive Demo CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <button className="btn-secondary text-lg px-10 py-4">
          See Live Order Block Examples
        </button>
      </motion.div>
    </section>
  )
}
