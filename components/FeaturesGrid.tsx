'use client'

import { motion } from 'framer-motion'
import { MessageSquare, Mic, BarChart2, Brain, Users, Zap } from 'lucide-react'

export default function FeaturesGrid() {
  const features = [
    {
      icon: MessageSquare,
      title: 'AI Trading Assistant',
      description: 'Chat with our AI loaded with order block theory, market structure, and institutional concepts. Get instant answers 24/7.',
      gradient: 'from-royal-green to-royal-emerald',
    },
    {
      icon: Mic,
      title: 'Voice-Activated Learning',
      description: 'Ask questions using speech-to-text. Perfect for reviewing charts while hands-free or on mobile.',
      gradient: 'from-royal-emerald to-accent-gold',
    },
    {
      icon: BarChart2,
      title: 'Interactive Dashboard',
      description: 'Live chart analysis tools with order block markers, liquidity zones, and probability scoring.',
      gradient: 'from-accent-gold to-royal-green',
    },
    {
      icon: Brain,
      title: 'Psychology Training',
      description: 'Emotional discipline modules, probability thinking frameworks, and institutional mindset development.',
      gradient: 'from-royal-green to-matte-black',
    },
    {
      icon: Users,
      title: 'Elite Community',
      description: 'Connect with like-minded traders. Share setups, discuss strategies, and learn from experienced members.',
      gradient: 'from-royal-emerald to-royal-green',
    },
    {
      icon: Zap,
      title: 'Trade Replay System',
      description: 'Gamified simulator to practice order block identification and entry timing with historical data.',
      gradient: 'from-accent-gold to-royal-emerald',
    },
  ]

  return (
    <section className="section-container bg-white">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-playfair font-bold text-matte-black mb-4"
        >
          Platform <span className="text-gradient">Features</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Modern tools designed for the serious trader
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="group relative bg-gradient-to-br from-platinum to-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
          >
            {/* Gradient Orb */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${feature.gradient} rounded-full opacity-10 group-hover:opacity-20 group-hover:scale-150 transition-all duration-500`}></div>

            {/* Icon */}
            <div className={`relative w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-6 transform group-hover:rotate-6 group-hover:scale-110 transition-all duration-300`}>
              <feature.icon className="w-8 h-8 text-white" />
            </div>

            {/* Content */}
            <div className="relative">
              <h3 className="text-xl font-playfair font-bold text-matte-black mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>

            {/* Hover Border */}
            <div className={`absolute inset-0 border-2 border-transparent group-hover:border-royal-green rounded-2xl transition-all duration-300`}></div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
