'use client'

import { motion } from 'framer-motion'
import { Target, Layers, Zap, Shield } from 'lucide-react'

export default function Philosophy() {
  const principles = [
    {
      icon: Target,
      title: 'Liquidity First',
      description: 'Trade where institutions place and defend their positions. Not chasing price, but positioning where money flows.',
      color: 'from-royal-green to-royal-emerald'
    },
    {
      icon: Layers,
      title: 'Market Structure',
      description: 'Understanding accumulation, manipulation, and distribution phases. Read the market like institutions do.',
      color: 'from-royal-emerald to-accent-gold'
    },
    {
      icon: Zap,
      title: 'Order Flow Footprints',
      description: 'Identify unmitigated order blocks and institutional entry zones. Track smart money movements.',
      color: 'from-accent-gold to-royal-green'
    },
    {
      icon: Shield,
      title: 'Probability + Precision',
      description: 'Combine technical mastery with fundamental bias. Stack confirmations for high-probability setups.',
      color: 'from-royal-green to-matte-black'
    },
  ]

  return (
    <section className="section-container bg-platinum">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-playfair font-bold text-matte-black mb-4"
        >
          The Royal Flow <span className="text-gradient">Philosophy</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Your strategy is not based on prediction — it's based on institutional positioning
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {principles.map((principle, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${principle.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
            
            {/* Content */}
            <div className="relative z-10">
              <div className={`w-16 h-16 bg-gradient-to-br ${principle.color} rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
                <principle.icon className="w-8 h-8 text-white" />
              </div>
              
              <h3 className="text-2xl font-playfair font-bold text-matte-black mb-4">
                {principle.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {principle.description}
              </p>
            </div>

            {/* Decorative Element */}
            <div className="absolute -bottom-2 -right-2 w-24 h-24 bg-royal-green opacity-5 rounded-full transform group-hover:scale-150 transition-transform duration-500"></div>
          </motion.div>
        ))}
      </div>

      {/* Core Beliefs */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-16 bg-gradient-to-br from-royal-green to-royal-emerald rounded-3xl p-12 text-white"
      >
        <h3 className="text-3xl font-playfair font-bold mb-8 text-center">
          What We Don't Do
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'NO Price Chasing', desc: 'We position before the move' },
            { title: 'NO Indicator Dependency', desc: 'Indicators confirm, not decide' },
            { title: 'NO Direction Guessing', desc: 'Structure tells us the path' },
          ].map((belief, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-1 bg-accent-gold mx-auto mb-4"></div>
              <h4 className="text-xl font-bold mb-2">{belief.title}</h4>
              <p className="text-gray-200">{belief.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
