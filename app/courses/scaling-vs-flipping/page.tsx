'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  DollarSign,
  Zap,
  Clock,
  AlertTriangle,
  Target,
  ArrowUp,
  RefreshCw,
} from 'lucide-react'

export default function ScalingVsFlippingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <ArrowUp className="w-12 h-12 text-royal-emerald" />
            <h1 className="text-5xl font-bold text-white">Scaling vs Flipping</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Two paths to account growth. One is slow and sustainable. The other is fast and
            dangerous. Choose wisely.
          </p>
        </motion.div>

        {/* The Core Question */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-accent-gold/20 to-accent-gold/10 border border-accent-gold/50 rounded-2xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4">
            The Big Question Every Trader Faces
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed">
            You have $1,000. Do you grow it slowly and safely to $10,000 over 12 months? Or do you
            try to "flip" it to $10,000 in 1 month by taking massive risks?
          </p>
          <p className="text-accent-gold font-semibold mt-4">
            Your answer determines whether you'll still be trading in 6 months — or joining the 95%
            who blow up their accounts.
          </p>
        </motion.div>

        {/* Scaling Explained */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="bg-green-500/10 border border-green-500/30 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <TrendingUp className="w-12 h-12 text-green-400 flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-bold text-white mb-3">
                  Scaling: The Professional's Path
                </h2>
                <p className="text-gray-300 text-lg">
                  Scaling means growing your account systematically through compound growth while
                  maintaining strict risk management.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-matte-black/50 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-400 mb-4">How Scaling Works</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• Risk 1-2% per trade (fixed percentage)</li>
                  <li>• Target 5-15% monthly returns</li>
                  <li>• Let compound interest work over time</li>
                  <li>• Withdraw profits regularly</li>
                  <li>• Preserve capital at all costs</li>
                  <li>• Focus on consistency, not home runs</li>
                </ul>
              </div>

              <div className="bg-matte-black/50 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-green-400 mb-4">The Math of Scaling</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-white font-semibold mb-1">Starting Capital: $1,000</div>
                    <div className="text-gray-400 text-sm">
                      Risk: 2% per trade | Target: 10% monthly
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Month 1:</span>
                      <span className="text-white font-semibold">$1,100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Month 3:</span>
                      <span className="text-white font-semibold">$1,331</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Month 6:</span>
                      <span className="text-white font-semibold">$1,772</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Month 12:</span>
                      <span className="text-green-400 font-bold text-lg">$3,138</span>
                    </div>
                    <div className="flex justify-between border-t border-green-500/30 pt-2">
                      <span className="text-gray-400">Month 24:</span>
                      <span className="text-green-400 font-bold text-xl">$9,850</span>
                    </div>
                  </div>
                  <p className="text-green-400 text-sm font-semibold">
                    You 10x'd your account in 2 years with sustainable risk.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-3">Why Scaling Wins</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-green-400 font-bold mb-1">Low Stress</div>
                  <div className="text-gray-300 text-sm">
                    Small losses don't hurt. You sleep well.
                  </div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-1">Sustainable</div>
                  <div className="text-gray-300 text-sm">You can do this for decades.</div>
                </div>
                <div>
                  <div className="text-green-400 font-bold mb-1">Professional</div>
                  <div className="text-gray-300 text-sm">
                    This is how prop firms and banks trade.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Flipping Explained */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8">
            <div className="flex items-start gap-4 mb-6">
              <RefreshCw className="w-12 h-12 text-red-400 flex-shrink-0" />
              <div>
                <h2 className="text-3xl font-bold text-white mb-3">Flipping: The Gambler's Trap</h2>
                <p className="text-gray-300 text-lg">
                  Flipping means trying to rapidly multiply a small account by taking huge risks.
                  It's essentially gambling, not trading.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-matte-black/50 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-4">How Flipping Works</h3>
                <ul className="space-y-3 text-gray-300">
                  <li>• Risk 10-50% per trade (insane exposure)</li>
                  <li>• Target 100-500% gains quickly</li>
                  <li>• Use maximum leverage (1:500+)</li>
                  <li>• No stop losses or very wide ones</li>
                  <li>• Pray price goes your way</li>
                  <li>• "All or nothing" mentality</li>
                </ul>
              </div>

              <div className="bg-matte-black/50 border border-red-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-red-400 mb-4">The Reality of Flipping</h3>
                <div className="space-y-4">
                  <div>
                    <div className="text-white font-semibold mb-1">Starting Capital: $1,000</div>
                    <div className="text-gray-400 text-sm">
                      Risk: 25% per trade | Target: "Get rich quick"
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Trade 1 (Win):</span>
                      <span className="text-white font-semibold">$1,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Trade 2 (Win):</span>
                      <span className="text-white font-semibold">$1,563</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Trade 3 (Win):</span>
                      <span className="text-green-400 font-semibold">$1,953</span>
                    </div>
                    <div className="flex justify-between border-t border-red-500/30 pt-2">
                      <span className="text-gray-400">Trade 4 (Loss):</span>
                      <span className="text-red-400 font-bold">$1,465</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Trade 5 (Loss):</span>
                      <span className="text-red-400 font-bold">$1,099</span>
                    </div>
                    <div className="flex justify-between border-t border-red-500/50 pt-2">
                      <span className="text-gray-400">Trade 6 (Loss):</span>
                      <span className="text-red-400 font-bold text-xl">$824</span>
                    </div>
                  </div>
                  <p className="text-red-400 text-sm font-semibold">
                    3 wins, 3 losses = You're down 18% and emotionally drained
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6">
              <h3 className="text-lg font-bold text-white mb-3">Why Flipping Fails</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <div className="text-red-400 font-bold mb-1">Extreme Stress</div>
                  <div className="text-gray-300 text-sm">Every trade feels like life or death.</div>
                </div>
                <div>
                  <div className="text-red-400 font-bold mb-1">Unsustainable</div>
                  <div className="text-gray-300 text-sm">One bad streak = account blown.</div>
                </div>
                <div>
                  <div className="text-red-400 font-bold mb-1">Gambling</div>
                  <div className="text-gray-300 text-sm">This isn't trading, it's a casino.</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Side by Side Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            The Brutal Truth: Side-by-Side
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-green-400 mb-4 text-center">Scaling</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-2 bg-matte-black/50 rounded">
                  <span className="text-gray-400">Survival Rate:</span>
                  <span className="text-green-400 font-bold">70-80%</span>
                </div>
                <div className="flex justify-between p-2 bg-matte-black/50 rounded">
                  <span className="text-gray-400">Emotional State:</span>
                  <span className="text-green-400 font-bold">Calm, Confident</span>
                </div>
                <div className="flex justify-between p-2 bg-matte-black/50 rounded">
                  <span className="text-gray-400">Time to Profit:</span>
                  <span className="text-green-400 font-bold">12-24 months</span>
                </div>
                <div className="flex justify-between p-2 bg-matte-black/50 rounded">
                  <span className="text-gray-400">Lifestyle:</span>
                  <span className="text-green-400 font-bold">Normal, Sustainable</span>
                </div>
                <div className="flex justify-between p-2 bg-matte-black/50 rounded">
                  <span className="text-gray-400">Final Result:</span>
                  <span className="text-green-400 font-bold">Consistent Income</span>
                </div>
              </div>
            </div>

            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
              <h3 className="text-2xl font-bold text-red-400 mb-4 text-center">Flipping</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between p-2 bg-matte-black/50 rounded">
                  <span className="text-gray-400">Survival Rate:</span>
                  <span className="text-red-400 font-bold">5-10%</span>
                </div>
                <div className="flex justify-between p-2 bg-matte-black/50 rounded">
                  <span className="text-gray-400">Emotional State:</span>
                  <span className="text-red-400 font-bold">Anxious, Desperate</span>
                </div>
                <div className="flex justify-between p-2 bg-matte-black/50 rounded">
                  <span className="text-gray-400">Time to Profit:</span>
                  <span className="text-red-400 font-bold">Never (usually)</span>
                </div>
                <div className="flex justify-between p-2 bg-matte-black/50 rounded">
                  <span className="text-gray-400">Lifestyle:</span>
                  <span className="text-red-400 font-bold">Stressful, Chaotic</span>
                </div>
                <div className="flex justify-between p-2 bg-matte-black/50 rounded">
                  <span className="text-gray-400">Final Result:</span>
                  <span className="text-red-400 font-bold">Account Blown</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Verdict */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-royal-green/20 to-royal-emerald/20 border border-royal-green/50 rounded-2xl p-8 mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            The Verdict: What The Pros Choose
          </h2>
          <p className="text-gray-300 text-lg text-center mb-6">
            Every successful trader, fund manager, and institutional desk uses scaling. Why? Because
            it works. Flipping is what broke, desperate gamblers do.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-royal-emerald/20 border border-royal-emerald/50 rounded-lg p-4 text-center">
              <div className="text-royal-emerald font-bold text-lg mb-2">Warren Buffett</div>
              <div className="text-gray-300 text-sm">
                "Rule #1: Never lose money. Rule #2: Never forget rule #1."
              </div>
            </div>
            <div className="bg-royal-emerald/20 border border-royal-emerald/50 rounded-lg p-4 text-center">
              <div className="text-royal-emerald font-bold text-lg mb-2">Paul Tudor Jones</div>
              <div className="text-gray-300 text-sm">
                "The most important rule of trading is to play great defense."
              </div>
            </div>
            <div className="bg-royal-emerald/20 border border-royal-emerald/50 rounded-lg p-4 text-center">
              <div className="text-royal-emerald font-bold text-lg mb-2">Ed Seykota</div>
              <div className="text-gray-300 text-sm">
                "The elements of good trading are: cutting losses, cutting losses, and cutting
                losses."
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-accent-gold/10 border border-accent-gold/30 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Your Action Plan</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-royal-emerald rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white">
                1
              </div>
              <div>
                <div className="text-white font-semibold mb-1">Choose Scaling, Not Flipping</div>
                <div className="text-gray-300 text-sm">
                  Commit to 1-2% risk per trade. This is non-negotiable.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-royal-emerald rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white">
                2
              </div>
              <div>
                <div className="text-white font-semibold mb-1">Set Realistic Monthly Targets</div>
                <div className="text-gray-300 text-sm">
                  Aim for 5-15% per month. Anything higher is gambling territory.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-royal-emerald rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white">
                3
              </div>
              <div>
                <div className="text-white font-semibold mb-1">Track Your Performance</div>
                <div className="text-gray-300 text-sm">
                  Journal every trade. Calculate your actual monthly returns. Be honest with
                  yourself.
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-royal-emerald rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white">
                4
              </div>
              <div>
                <div className="text-white font-semibold mb-1">Think Long-Term</div>
                <div className="text-gray-300 text-sm">
                  Trading is a marathon, not a sprint. The goal is to still be profitable in 5
                  years.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
