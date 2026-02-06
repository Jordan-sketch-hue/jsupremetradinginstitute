'use client'

import { motion } from 'framer-motion'
import { BookOpen, TrendingUp, LineChart, Brain, Target, Zap, Shield } from 'lucide-react'
import Link from 'next/link'

export default function LearningPath() {
  const levels = [
    {
      level: 1,
      title: 'Market Foundations',
      icon: BookOpen,
      topics: [
        'What Moves Markets',
        'Market Participants',
        'Liquidity Basics',
        'Trading Psychology Foundation',
      ],
      duration: '2 weeks',
      color: 'from-royal-green to-royal-emerald',
    },
    {
      level: 2,
      title: 'Market Structure',
      icon: TrendingUp,
      topics: [
        'Trend Identification',
        'Structure Breaks',
        'Timeframe Stacking',
        'Higher High/Lower Low Patterns',
      ],
      duration: '3 weeks',
      color: 'from-royal-emerald to-accent-gold',
    },
    {
      level: 3,
      title: 'Order Block Mastery',
      icon: LineChart,
      topics: [
        'Order Block Identification',
        'Mitigation Theory',
        'Institutional Footprints',
        'Unmitigated vs Mitigated',
      ],
      duration: '4 weeks',
      color: 'from-accent-gold to-royal-green',
    },
    {
      level: 4,
      title: 'Liquidity & Manipulation',
      icon: Brain,
      topics: ['Stop Hunts', 'Fake Breakouts', 'Smart Money Traps', 'Liquidity Sweeps'],
      duration: '3 weeks',
      color: 'from-royal-green to-matte-black',
    },
    {
      level: 5,
      title: 'Indicator Precision',
      icon: Target,
      topics: [
        'RSI Institutional Usage',
        'ATR Volatility Logic',
        'Divergence Patterns',
        'Confirmation Stacking',
      ],
      duration: '2 weeks',
      color: 'from-royal-emerald to-royal-green',
    },
    {
      level: 6,
      title: 'Entry Engineering',
      icon: Zap,
      topics: [
        'Micro Structure',
        'Timing Models',
        'Multi-Timeframe Entries',
        'High Probability Setups',
      ],
      duration: '4 weeks',
      color: 'from-accent-gold to-royal-emerald',
    },
    {
      level: 7,
      title: 'Risk & Psychology',
      icon: Shield,
      topics: [
        'Position Sizing',
        'Emotional Discipline',
        'Probability Thinking',
        'Trade Management',
      ],
      duration: '3 weeks',
      color: 'from-royal-green to-royal-emerald',
    },
  ]

  return (
    <section className="section-container bg-gradient-to-b from-platinum to-white">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-playfair font-bold text-matte-black mb-4"
        >
          Your <span className="text-gradient">Learning Journey</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          A structured 7-level system designed to transform you from beginner to institutional-level
          trader
        </motion.p>
      </div>

      {/* Learning Path Timeline */}
      <div className="max-w-4xl mx-auto">
        {levels.map((level, index) => (
          <motion.div
            key={level.level}
            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="relative mb-12 last:mb-0"
          >
            <div className="flex items-start gap-6">
              {/* Level Number & Icon */}
              <div className="flex-shrink-0">
                <div
                  className={`w-20 h-20 bg-gradient-to-br ${level.color} rounded-2xl flex items-center justify-center shadow-lg transform hover:rotate-6 hover:scale-110 transition-all duration-300`}
                >
                  <level.icon className="w-10 h-10 text-white" />
                </div>
                <div className="text-center mt-2">
                  <span className="text-sm font-bold text-royal-green">LEVEL {level.level}</span>
                </div>
              </div>

              {/* Content Card */}
              <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-royal-green">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-playfair font-bold text-matte-black">
                    {level.title}
                  </h3>
                  <span className="text-sm bg-royal-green bg-opacity-10 text-royal-green px-4 py-1 rounded-full font-semibold">
                    {level.duration}
                  </span>
                </div>

                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {level.topics.map((topic, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-2 h-2 bg-accent-gold rounded-full mt-2 mr-2 flex-shrink-0"></span>
                      <span className="text-gray-600">{topic}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={`/learning-path#level-${level.level}`}
                  className="inline-flex items-center text-royal-green font-semibold hover:text-royal-emerald transition-colors group"
                >
                  Start Level {level.level}
                  <svg
                    className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Connecting Line */}
            {index < levels.length - 1 && (
              <div className="absolute left-10 top-24 w-0.5 h-12 bg-gradient-to-b from-royal-green to-royal-emerald opacity-30"></div>
            )}
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-16"
      >
        <Link href="/levels/level-1" className="btn-primary text-lg px-10 py-4">
          Start Your Journey Now
        </Link>
        <p className="text-gray-600 mt-4">No credit card required • Free trial available</p>
      </motion.div>
    </section>
  )
}
