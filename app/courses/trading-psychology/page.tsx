'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  Heart,
  Target,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Shield,
  Flame,
  Clock,
} from 'lucide-react'

export default function TradingPsychologyPage() {
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
            <Brain className="w-12 h-12 text-royal-emerald" />
            <h1 className="text-5xl font-bold text-white">Trading Psychology</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            90% of trading is mental. Master your mind and you'll master the markets. This is the
            most important page on this entire platform.
          </p>
        </motion.div>

        {/* The Core Truth */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-accent-gold/20 to-accent-gold/10 border border-accent-gold/50 rounded-2xl p-8 mb-12"
        >
          <Heart className="w-12 h-12 text-accent-gold mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">
            Why Most Traders Fail (It's Not What You Think)
          </h2>
          <p className="text-gray-300 text-lg leading-relaxed mb-4">
            95% of retail traders lose money. Not because they don't understand technical analysis.
            Not because they lack indicators. They lose because they can't control their emotions.
          </p>
          <p className="text-accent-gold font-semibold text-lg">
            You can have the best strategy in the world, but if you can't handle a losing streak,
            revenge trade after a loss, or get greedy during a win — you will fail.
          </p>
        </motion.div>

        {/* The Big 4 Psychological Enemies */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            The 4 Enemies of Every Trader
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Fear */}
            <div className="bg-matte-black/50 border border-red-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-10 h-10 text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">1. Fear</h3>
                  <p className="text-gray-400 text-sm">The silent killer of profits</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                  <div className="text-red-400 font-semibold mb-1">What It Looks Like:</div>
                  <ul className="text-gray-300 space-y-1">
                    <li>• You see your setup but don't take it</li>
                    <li>• You exit winning trades too early</li>
                    <li>• You move stop loss closer "just to be safe"</li>
                    <li>• You skip trading after one loss</li>
                  </ul>
                </div>
                <div className="bg-royal-green/10 border border-royal-green/30 rounded-lg p-3">
                  <div className="text-royal-emerald font-semibold mb-1">How to Overcome It:</div>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Trade smaller position sizes</li>
                    <li>• Remind yourself: Risk is already calculated</li>
                    <li>• Trust your system — you backtested it</li>
                    <li>• Accept that losses are part of the process</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Greed */}
            <div className="bg-matte-black/50 border border-yellow-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <Flame className="w-10 h-10 text-yellow-400 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">2. Greed</h3>
                  <p className="text-gray-400 text-sm">When enough is never enough</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                  <div className="text-yellow-400 font-semibold mb-1">What It Looks Like:</div>
                  <ul className="text-gray-300 space-y-1">
                    <li>• You don't take profit at your target</li>
                    <li>• You add to winning positions recklessly</li>
                    <li>• You increase risk after a win</li>
                    <li>• "Just one more trade" syndrome</li>
                  </ul>
                </div>
                <div className="bg-royal-green/10 border border-royal-green/30 rounded-lg p-3">
                  <div className="text-royal-emerald font-semibold mb-1">How to Overcome It:</div>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Set take profit BEFORE entering</li>
                    <li>• Follow your trading plan religiously</li>
                    <li>• Celebrate small wins</li>
                    <li>• Remember: Pigs get slaughtered</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Revenge Trading */}
            <div className="bg-matte-black/50 border border-orange-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <Flame className="w-10 h-10 text-orange-400 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">3. Revenge Trading</h3>
                  <p className="text-gray-400 text-sm">The fastest way to blow your account</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
                  <div className="text-orange-400 font-semibold mb-1">What It Looks Like:</div>
                  <ul className="text-gray-300 space-y-1">
                    <li>• You take a loss and immediately re-enter</li>
                    <li>• You double your position size to "get back"</li>
                    <li>• You abandon your strategy out of anger</li>
                    <li>• You force trades that aren't there</li>
                  </ul>
                </div>
                <div className="bg-royal-green/10 border border-royal-green/30 rounded-lg p-3">
                  <div className="text-royal-emerald font-semibold mb-1">How to Overcome It:</div>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Walk away after 2 consecutive losses</li>
                    <li>• Take a 15-minute break after any loss</li>
                    <li>• Write down your emotions in a journal</li>
                    <li>• Remember: The market will be there tomorrow</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Overconfidence */}
            <div className="bg-matte-black/50 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <TrendingUp className="w-10 h-10 text-purple-400 flex-shrink-0" />
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">4. Overconfidence</h3>
                  <p className="text-gray-400 text-sm">Success is the mother of failure</p>
                </div>
              </div>
              <div className="space-y-3 text-sm">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
                  <div className="text-purple-400 font-semibold mb-1">What It Looks Like:</div>
                  <ul className="text-gray-300 space-y-1">
                    <li>• You skip analysis after a winning streak</li>
                    <li>• You ignore your rules "just this once"</li>
                    <li>• You increase risk because "you're on fire"</li>
                    <li>• You stop using stop losses</li>
                  </ul>
                </div>
                <div className="bg-royal-green/10 border border-royal-green/30 rounded-lg p-3">
                  <div className="text-royal-emerald font-semibold mb-1">How to Overcome It:</div>
                  <ul className="text-gray-300 space-y-1">
                    <li>• Treat every trade the same</li>
                    <li>• Review losses AND wins equally</li>
                    <li>• Stay humble — the market humbles everyone</li>
                    <li>• Keep risk consistent no matter your streak</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* The Pro Trader Mindset */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-royal-green/20 to-royal-emerald/20 border border-royal-green/50 rounded-2xl p-8 mb-12"
        >
          <Shield className="w-12 h-12 text-royal-emerald mb-4" />
          <h2 className="text-2xl font-bold text-white mb-6">The Professional Trader Mindset</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-royal-emerald/10 border border-royal-emerald/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-royal-emerald" />
                  <div className="text-white font-semibold">Process Over Outcome</div>
                </div>
                <p className="text-gray-300 text-sm">
                  You can't control if a trade wins or loses. You CAN control if you followed your
                  plan. Focus on perfect execution, not perfect results.
                </p>
              </div>
              <div className="bg-royal-emerald/10 border border-royal-emerald/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-royal-emerald" />
                  <div className="text-white font-semibold">Long-Term Thinking</div>
                </div>
                <p className="text-gray-300 text-sm">
                  Today's P&L means nothing. What matters is your performance over 100 trades. Think
                  in months and years, not minutes and days.
                </p>
              </div>
              <div className="bg-royal-emerald/10 border border-royal-emerald/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-royal-emerald" />
                  <div className="text-white font-semibold">Detached Observation</div>
                </div>
                <p className="text-gray-300 text-sm">
                  View your trades like a scientist studying data. Remove ego. Remove emotion. Just
                  observe, learn, and adjust.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-royal-emerald/10 border border-royal-emerald/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-royal-emerald" />
                  <div className="text-white font-semibold">Accept Uncertainty</div>
                </div>
                <p className="text-gray-300 text-sm">
                  No one knows what will happen next. Not you, not institutions, not anyone. Accept
                  that you're working with probabilities, not certainties.
                </p>
              </div>
              <div className="bg-royal-emerald/10 border border-royal-emerald/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-royal-emerald" />
                  <div className="text-white font-semibold">Patience is Power</div>
                </div>
                <p className="text-gray-300 text-sm">
                  The best trade of the week might be the one you didn't take. Waiting for A+ setups
                  is a competitive advantage most traders lack.
                </p>
              </div>
              <div className="bg-royal-emerald/10 border border-royal-emerald/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-royal-emerald" />
                  <div className="text-white font-semibold">Ego is the Enemy</div>
                </div>
                <p className="text-gray-300 text-sm">
                  The market doesn't care about your opinions, your analysis, or your confidence.
                  Stay humble. Adapt. Survive.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Daily Mental Routine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Your Daily Mental Routine
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Professional traders don't just analyze charts — they prepare their minds. Follow this
            routine every trading day.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6">
              <Clock className="w-10 h-10 text-royal-emerald mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">Before Trading</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-royal-emerald flex-shrink-0 mt-0.5" />
                  <span>Review your trading plan</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-royal-emerald flex-shrink-0 mt-0.5" />
                  <span>Set your max risk for the day</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-royal-emerald flex-shrink-0 mt-0.5" />
                  <span>Check your emotional state (tired? angry? distracted? = don't trade)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-royal-emerald flex-shrink-0 mt-0.5" />
                  <span>Visualize perfect execution</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-royal-emerald flex-shrink-0 mt-0.5" />
                  <span>Read: "I trade probabilities, not certainties"</span>
                </li>
              </ul>
            </div>

            <div className="bg-matte-black/50 border border-accent-gold/30 rounded-xl p-6">
              <Target className="w-10 h-10 text-accent-gold mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">During Trading</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
                  <span>Follow your checklist for every trade</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
                  <span>After a loss: Take 15-min break before next trade</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
                  <span>After a win: Don't get cocky — next trade is independent</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
                  <span>If you feel emotional: Close platform, go outside</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-accent-gold flex-shrink-0 mt-0.5" />
                  <span>Trust the process, not your feelings</span>
                </li>
              </ul>
            </div>

            <div className="bg-matte-black/50 border border-purple-500/30 rounded-xl p-6">
              <Brain className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-4">After Trading</h3>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Journal every trade (entry reason, emotions, result)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Review: Did I follow my plan?</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Celebrate discipline, even if you lost money</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Identify one lesson learned</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  <span>Disconnect completely — no chart watching outside hours</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Final Wisdom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-accent-gold/10 border border-accent-gold/30 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            The Final Truth About Trading Psychology
          </h2>
          <p className="text-gray-300 text-lg text-center leading-relaxed mb-6">
            Technical analysis will get you into profitable trades. But psychology will keep you in
            the game long enough to compound those profits into generational wealth.
          </p>
          <p className="text-accent-gold text-xl font-semibold text-center">
            The trader who controls their mind controls their destiny.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
