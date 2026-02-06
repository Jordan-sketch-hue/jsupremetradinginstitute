'use client'

import { motion } from 'framer-motion'
import { BookOpen, Target, LineChart, Users, Shield, Zap, Brain, TrendingUp } from 'lucide-react'

export default function DoctrinePage() {
  const coreBeliefs = [
    {
      icon: Target,
      title: 'Trading Is NOT Prediction',
      description: 'Trading is waiting where money already sits. We position where institutions have placed orders, not where we think price will go.',
      color: 'from-royal-green to-royal-emerald',
    },
    {
      icon: LineChart,
      title: 'Price Follows Liquidity',
      description: 'Markets don\'t move randomly. They hunt liquidity at equal highs/lows, then react at institutional order zones.',
      color: 'from-royal-emerald to-accent-gold',
    },
    {
      icon: Brain,
      title: 'Psychology Over Indicators',
      description: 'Indicators confirm; they don\'t decide. We trade institutional psychology: accumulation, manipulation, distribution.',
      color: 'from-accent-gold to-royal-green',
    },
    {
      icon: Shield,
      title: 'Probability & Patience',
      description: 'High-probability setups require multiple confirmations. We stack evidence: structure, order blocks, liquidity, and indicators.',
      color: 'from-royal-green to-matte-black',
    },
  ]

  const principles = [
    { number: '01', title: 'Trend Decides Bias', description: 'Uptrend = buys only. Downtrend = sells only. Never fight structure.' },
    { number: '02', title: 'Order Blocks Decide Location', description: 'Last opposing candle before impulse = where institutions entered.' },
    { number: '03', title: 'Liquidity Decides Timing', description: 'Wait for liquidity sweep before entry. Stop hunts signal real moves.' },
    { number: '04', title: 'Indicators Confirm Probability', description: 'RSI divergence + ATR context = higher confidence entries.' },
    { number: '05', title: 'Risk Management Ensures Survival', description: 'Position size, stop loss, and emotional discipline protect capital.' },
  ]

  return (
    <div className="min-h-screen bg-platinum pt-24 pb-12">
      <div className="section-container">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-playfair font-bold text-matte-black mb-6"
          >
            The Royal Flow <span className="text-gradient">Doctrine</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl text-gray-600 max-w-4xl mx-auto"
          >
            Our trading philosophy: Think like liquidity providers, trade where institutions position, and profit from market cycles.
          </motion.p>
        </div>

        {/* Core Beliefs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {coreBeliefs.map((belief, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all group"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${belief.color} rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 group-hover:scale-110 transition-all`}>
                <belief.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-playfair font-bold text-matte-black mb-4">{belief.title}</h3>
              <p className="text-gray-600 leading-relaxed">{belief.description}</p>
            </motion.div>
          ))}
        </div>

        {/* 5 Signature Rules */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-matte-black to-royal-green rounded-3xl p-12 text-white mb-20"
        >
          <h2 className="text-4xl font-playfair font-bold text-center mb-12">
            The 5 <span className="text-accent-gold">Signature Rules</span>
          </h2>
          <div className="space-y-6">
            {principles.map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start space-x-6 p-6 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl hover:bg-opacity-20 transition-all"
              >
                <div className="text-6xl font-playfair font-bold text-accent-gold opacity-50">
                  {principle.number}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold mb-2">{principle.title}</h3>
                  <p className="text-gray-300">{principle.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What We Don't Do */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-3xl p-12 shadow-lg mb-20"
        >
          <h2 className="text-4xl font-playfair font-bold text-center text-matte-black mb-12">
            What We <span className="text-red-500">Don't</span> Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'NO Price Chasing', desc: 'We position before the move, not during it. Chasing leads to poor entries and emotional decisions.' },
              { title: 'NO Indicator Dependency', desc: 'Indicators are confirmations, never primary signals. Market structure comes first, always.' },
              { title: 'NO Direction Guessing', desc: 'We don\'t predict. We react to what institutions show us through order blocks and liquidity.' },
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-1 bg-red-500 mx-auto mb-6"></div>
                <h3 className="text-xl font-bold text-matte-black mb-4">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Edge Statement */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-royal-green via-royal-emerald to-royal-green rounded-3xl p-12 text-white"
        >
          <TrendingUp className="w-16 h-16 mx-auto mb-6 text-accent-gold" />
          <h2 className="text-4xl font-playfair font-bold mb-6">Your Unique Edge</h2>
          <p className="text-2xl mb-4 max-w-3xl mx-auto">
            "Learning to think like liquidity providers"
          </p>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Most traders lose because they trade against institutions. We profit by understanding institutional positioning, 
            recognizing market cycles, and executing with discipline.
          </p>
          <button className="btn-secondary mt-8 text-lg px-10 py-4">
            Start Learning The Doctrine
          </button>
        </motion.div>
      </div>
    </div>
  )
}
