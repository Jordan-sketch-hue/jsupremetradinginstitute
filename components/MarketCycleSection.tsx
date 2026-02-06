'use client'

import { motion } from 'framer-motion'
import { Layers, AlertTriangle, Rocket } from 'lucide-react'

export default function MarketCycleSection() {
  const phases = [
    {
      number: '01',
      title: 'Accumulation Phase',
      icon: Layers,
      description: 'Banks build positions quietly',
      signs: [
        'Sideways movement',
        'Liquidity buildup',
        'Tight ranges',
        'Low volatility',
      ],
      color: 'from-royal-green to-royal-emerald',
      bgColor: 'bg-royal-green',
    },
    {
      number: '02',
      title: 'Manipulation Phase',
      icon: AlertTriangle,
      description: 'Banks create fake breakouts',
      signs: [
        'Trigger retail traders',
        'Grab liquidity',
        'Stop hunts',
        'False breakouts',
      ],
      color: 'from-accent-gold to-red-500',
      bgColor: 'bg-accent-gold',
    },
    {
      number: '03',
      title: 'Distribution Phase',
      icon: Rocket,
      description: 'Real directional move begins',
      signs: [
        'Strong momentum',
        'High volume',
        'Structure breaks',
        'Impulsive moves',
      ],
      color: 'from-royal-emerald to-accent-gold',
      bgColor: 'bg-royal-emerald',
    },
  ]

  return (
    <section className="section-container bg-gradient-to-b from-white to-platinum">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-playfair font-bold text-matte-black mb-4"
        >
          Market Cycle <span className="text-gradient">Theory</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Your institutional psychology edge: Accumulation → Manipulation → Distribution
        </motion.p>
      </div>

      {/* Phases */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {phases.map((phase, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative group"
          >
            {/* Phase Number */}
            <div className="absolute -top-6 -left-6 text-8xl font-playfair font-bold text-royal-green opacity-10 group-hover:opacity-20 transition-opacity">
              {phase.number}
            </div>

            {/* Card */}
            <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden">
              {/* Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${phase.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>

              {/* Icon */}
              <div className={`relative w-16 h-16 ${phase.bgColor} rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
                <phase.icon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h3 className="relative text-2xl font-playfair font-bold text-matte-black mb-3">
                {phase.title}
              </h3>

              {/* Description */}
              <p className="relative text-royal-green font-semibold mb-4">
                {phase.description}
              </p>

              {/* Signs */}
              <div className="relative">
                <h4 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wide">
                  Signs:
                </h4>
                <ul className="space-y-2">
                  {phase.signs.map((sign, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-2 h-2 bg-accent-gold rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <span className="text-gray-600">{sign}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Arrow Connector */}
            {index < phases.length - 1 && (
              <div className="hidden md:block absolute top-1/2 -right-4 z-10">
                <svg className="w-8 h-8 text-royal-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Key Insight */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-royal-green via-royal-emerald to-royal-green rounded-2xl p-8 md:p-12 text-white text-center"
      >
        <div className="max-w-3xl mx-auto">
          <h3 className="text-3xl font-playfair font-bold mb-4">
            The Institutional Advantage
          </h3>
          <p className="text-xl text-gray-100 mb-6">
            "Most traders lose money in the manipulation phase. We profit in the distribution phase by recognizing the cycle."
          </p>
          <div className="inline-flex items-center space-x-2 bg-white bg-opacity-20 backdrop-blur-lg px-6 py-3 rounded-full">
            <span className="w-3 h-3 bg-accent-gold rounded-full animate-pulse"></span>
            <span className="font-semibold">Master the cycle, master the market</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
