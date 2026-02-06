'use client'

import { motion } from 'framer-motion'
import { ArrowRight, TrendingUp, BarChart3, Brain } from 'lucide-react'
import VoiceInput from './VoiceInput'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-matte-black via-royal-green to-matte-black">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-hero-pattern"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-matte-black"></div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-10 w-20 h-20 bg-royal-emerald rounded-full opacity-20 blur-xl"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-32 h-32 bg-accent-gold rounded-full opacity-20 blur-xl"
        animate={{
          y: [0, 30, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="relative z-10 section-container text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-royal-green bg-opacity-30 backdrop-blur-lg px-6 py-2 rounded-full border border-royal-emerald mb-8"
          >
            <TrendingUp className="w-5 h-5 text-accent-gold" />
            <span className="text-platinum font-semibold">Elite Institutional Trading Education</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6 leading-tight"
          >
            Trade Where{' '}
            <span className="text-gradient">Institutions</span>
            <br />
            Move Money
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-platinum mb-4 font-light max-w-3xl mx-auto"
          >
            Master Order Blocks, Liquidity Theory & Smart Money Concepts
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Trading is not prediction. Trading is waiting where money already sits.
          </motion.p>

          {/* Voice Input */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mb-8"
          >
            <VoiceInput placeholder="Ask about order blocks, market structure, or trading strategy..." />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="btn-primary flex items-center space-x-2 text-lg px-8 py-4">
              <span>Begin Your Journey</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="btn-secondary flex items-center space-x-2 text-lg px-8 py-4">
              <span>Watch Free Lesson</span>
              <BarChart3 className="w-5 h-5" />
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20"
          >
            {[
              { icon: Brain, label: '7 Learning Levels', value: 'Structured Path' },
              { icon: TrendingUp, label: 'Institutional Edge', value: 'Smart Money' },
              { icon: BarChart3, label: 'Live Trading Dashboard', value: 'Real-time Analysis' },
            ].map((stat, index) => (
              <div
                key={index}
                className="glass-effect rounded-xl p-6 transform hover:scale-105 transition-all"
              >
                <stat.icon className="w-12 h-12 text-accent-gold mx-auto mb-4" />
                <h3 className="text-white font-bold text-xl mb-2">{stat.label}</h3>
                <p className="text-gray-300">{stat.value}</p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-platinum to-transparent"></div>
    </section>
  )
}
