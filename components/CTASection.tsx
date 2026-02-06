'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import Link from 'next/link'

export default function CTASection() {
  const benefits = [
    'Access to all 7 learning levels',
    'AI trading assistant',
    'Interactive dashboard',
    'Community access',
    'Live chart examples',
    'Trade replay simulator',
  ]

  return (
    <section className="section-container bg-gradient-to-br from-matte-black via-royal-green to-matte-black text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-hero-pattern"></div>
      </div>

      {/* Floating Orbs */}
      <motion.div
        className="absolute top-20 right-20 w-64 h-64 bg-royal-emerald rounded-full opacity-20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute bottom-20 left-20 w-64 h-64 bg-accent-gold rounded-full opacity-20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white bg-opacity-10 backdrop-blur-lg px-6 py-2 rounded-full border border-white border-opacity-20 mb-8">
            <span className="w-2 h-2 bg-accent-gold rounded-full animate-pulse"></span>
            <span className="text-platinum font-semibold">Limited Time Offer</span>
          </div>

          {/* Heading */}
          <h2 className="text-4xl md:text-6xl font-playfair font-bold mb-6">
            Ready to Trade Like
            <br />
            <span className="text-accent-gold">Institutions?</span>
          </h2>

          {/* Description */}
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Join hundreds of traders who've transformed their approach to the markets. Start your
            journey to institutional-level trading today.
          </p>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12 max-w-2xl mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center space-x-3 bg-white bg-opacity-10 backdrop-blur-lg rounded-lg px-4 py-3 border border-white border-opacity-20"
              >
                <Check className="w-5 h-5 text-accent-gold flex-shrink-0" />
                <span className="text-left">{benefit}</span>
              </motion.div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/levels/level-1"
              className="btn-secondary flex items-center space-x-2 text-lg px-10 py-4"
            >
              <span>Start Free Trial</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="bg-white bg-opacity-10 hover:bg-opacity-20 backdrop-blur-lg text-white border-2 border-white border-opacity-30 px-10 py-4 rounded-lg font-semibold transition-all duration-300"
            >
              View Pricing
            </Link>
          </div>

          {/* Guarantee */}
          <p className="text-sm text-gray-400">
            30-day money-back guarantee • No credit card required for trial
          </p>
        </motion.div>
      </div>
    </section>
  )
}
