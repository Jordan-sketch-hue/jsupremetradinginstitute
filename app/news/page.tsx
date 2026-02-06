'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Newspaper,
  Mail,
  TrendingUp,
  Clock,
  Tag,
  ChevronRight,
  Bell,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Globe,
} from 'lucide-react'

type CalendarEvent = {
  title: string
  country: string
  date: string
  time: string
  impact: 'high' | 'medium' | 'low'
  forecast?: string
  previous?: string
  actual?: string
}

export default function NewsPage() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([])

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    // In production, this would connect to an email service like Mailchimp, SendGrid, or ConvertKit
    setSubscribed(true)
    setTimeout(() => {
      setEmail('')
      setSubscribed(false)
    }, 3000)
  }

  useEffect(() => {
    const loadCalendar = async () => {
      try {
        const res = await fetch('/api/forex-factory')
        const data = await res.json()
        setCalendarEvents(data.events || [])
      } catch (error) {
        setCalendarEvents([])
      }
    }

    loadCalendar()
  }, [])

  const latestNews = [
    {
      title: 'How to Identify Valid Order Blocks in Ranging Markets',
      category: 'Strategy',
      date: '2 hours ago',
      excerpt:
        'Learn the specific criteria that separate high-probability order blocks from false signals when price is consolidating...',
      link: '/learning-path#level3',
    },
    {
      title: 'EUR/USD: Institutional Accumulation at 1.0840',
      category: 'Market Analysis',
      date: '5 hours ago',
      excerpt:
        "Major banks have been quietly accumulating long positions in the 1.0840-1.0850 zone. Here's what this means for retail traders...",
      link: '/portfolio',
    },
    {
      title: 'The Psychology of Waiting for Order Block Mitigation',
      category: 'Psychology',
      date: '1 day ago',
      excerpt:
        "Why most traders fail: They can't wait for price to reach their predetermined entry zone. Master this skill and you'll outperform 80% of traders...",
      link: '/learning-path#level7',
    },
    {
      title: 'Gold Testing Key Liquidity Zone at $2,650',
      category: 'Market Analysis',
      date: '1 day ago',
      excerpt:
        'XAUUSD has formed equal highs at $2,650 - a textbook liquidity grab setup. Watch for a stop hunt before the real move...',
      link: '/portfolio',
    },
    {
      title: 'Understanding ATR for Optimal Stop Loss Placement',
      category: 'Risk Management',
      date: '2 days ago',
      excerpt:
        'Stop getting stopped out by normal market noise. ATR-based stops adapt to current volatility and drastically improve your win rate...',
      link: '/learning-path#level5',
    },
    {
      title: 'Weekly Bias: Major Pairs & Commodities (Feb 3-7)',
      category: 'Weekly Outlook',
      date: '3 days ago',
      excerpt:
        'Our institutional bias for the week ahead: EUR/USD bullish, Gold accumulation, GBP/USD bearish distribution phase...',
      link: '/portfolio',
    },
  ]

  const upcomingEvents = [
    {
      title: 'US Non-Farm Payrolls (NFP)',
      date: 'Friday, Feb 7 @ 8:30 AM EST',
      impact: 'HIGH',
      description:
        'Expect massive volatility in USD pairs. Wait for liquidity sweeps before entering.',
    },
    {
      title: 'ECB Interest Rate Decision',
      date: 'Thursday, Feb 13 @ 7:45 AM EST',
      impact: 'HIGH',
      description:
        'Major EUR pairs will see increased movement. Watch for manipulation around the news release.',
    },
    {
      title: 'UK GDP Report',
      date: 'Friday, Feb 14 @ 2:00 AM EST',
      impact: 'MEDIUM',
      description: 'GBP volatility expected. Good opportunity for order block setups post-news.',
    },
    {
      title: 'US Retail Sales',
      date: 'Wednesday, Feb 19 @ 8:30 AM EST',
      impact: 'MEDIUM',
      description: 'Consumer spending data affects USD strength. Prime time for liquidity sweeps.',
    },
  ]

  const highImpactEvents = calendarEvents.filter(event => event.impact === 'high').slice(0, 8)
  const mediumImpactEvents = calendarEvents.filter(event => event.impact === 'medium').slice(0, 6)

  const marketResources = [
    {
      name: 'Forex Factory Calendar',
      description: 'High impact economic events and market schedule',
      link: 'https://www.forexfactory.com/calendar',
      category: 'Economic Calendar',
    },
    {
      name: 'MarketWatch',
      description: 'Breaking market news and macro headlines',
      link: 'https://www.marketwatch.com/',
      category: 'News',
    },
    {
      name: 'TradingView News',
      description: 'Market news and ideas from analysts',
      link: 'https://www.tradingview.com/news/',
      category: 'Analysis',
    },
    {
      name: 'FRED Economic Data',
      description: 'Official US economic data releases',
      link: 'https://fred.stlouisfed.org/',
      category: 'Macro Data',
    },
    {
      name: 'ECB Press Room',
      description: 'European Central Bank policy updates',
      link: 'https://www.ecb.europa.eu/press/html/index.en.html',
      category: 'Central Banks',
    },
    {
      name: 'Federal Reserve',
      description: 'FOMC statements and rate decisions',
      link: 'https://www.federalreserve.gov/monetarypolicy.htm',
      category: 'Central Banks',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Newspaper className="w-12 h-12 text-royal-emerald" />
            <h1 className="text-5xl font-bold text-white">Market News & Updates</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Stay ahead with daily market analysis, trading education articles, and institutional
            insights. Never miss a setup.
          </p>
        </motion.div>

        {/* Market Watch High Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-matte-black/50 border border-red-500/30 rounded-2xl p-8 mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-8 h-8 text-red-400" />
            <div>
              <h2 className="text-2xl font-bold text-white">Market Watch High Alerts</h2>
              <p className="text-gray-400">
                High-impact events pulled from the Forex Factory calendar feed
              </p>
            </div>
          </div>

          {highImpactEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {highImpactEvents.map((event, index) => (
                <div
                  key={`${event.title}-${event.time}-${index}`}
                  className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-white font-semibold">{event.title}</div>
                      <div className="text-gray-400 text-sm">
                        {event.country} | {event.date} {event.time}
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold bg-red-500/20 text-red-400 rounded-full">
                      HIGH
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-gray-400">
                    <div>Actual: {event.actual || 'TBD'}</div>
                    <div>Forecast: {event.forecast || 'TBD'}</div>
                    <div>Previous: {event.previous || 'TBD'}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400">Loading high-impact events from Forex Factory...</div>
          )}
        </motion.div>

        {/* Forex Factory Calendar (Medium Impact) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="bg-matte-black/50 border border-royal-green/30 rounded-2xl p-8 mb-12"
        >
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <Globe className="w-7 h-7 text-royal-emerald" />
              <div>
                <h2 className="text-2xl font-bold text-white">Forex Factory Calendar</h2>
                <p className="text-gray-400">Medium-impact events for planning and bias</p>
              </div>
            </div>
            <a
              href="https://www.forexfactory.com/calendar"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-royal-emerald hover:text-royal-emerald/80 transition-colors"
            >
              <span className="text-sm font-semibold">Open Source</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {mediumImpactEvents.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {mediumImpactEvents.map((event, index) => (
                <div
                  key={`${event.title}-${event.time}-${index}`}
                  className="bg-royal-green/10 border border-royal-green/30 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-white font-semibold">{event.title}</div>
                      <div className="text-gray-400 text-sm">
                        {event.country} | {event.date} {event.time}
                      </div>
                    </div>
                    <span className="px-2 py-1 text-xs font-semibold bg-yellow-500/20 text-yellow-400 rounded-full">
                      MEDIUM
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 text-xs text-gray-400">
                    <div>Actual: {event.actual || 'TBD'}</div>
                    <div>Forecast: {event.forecast || 'TBD'}</div>
                    <div>Previous: {event.previous || 'TBD'}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-400">Loading medium-impact events from Forex Factory...</div>
          )}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-royal-green/20 to-royal-emerald/20 border border-royal-green/50 rounded-2xl p-8 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Mail className="w-6 h-6 text-accent-gold" />
                <h2 className="text-2xl font-bold text-white">Daily Trading Insights</h2>
              </div>
              <p className="text-gray-300 mb-4">
                Get our daily market bias, institutional analysis, and order block setups delivered
                to your inbox every morning before markets open.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-royal-emerald" />
                  <span>Daily market bias for major pairs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-royal-emerald" />
                  <span>Key order block zones to watch</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-royal-emerald" />
                  <span>Trading psychology tips</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-royal-emerald" />
                  <span>Economic event alerts</span>
                </li>
              </ul>
            </div>

            <div>
              {!subscribed ? (
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-300 mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="trader@example.com"
                      required
                      className="w-full px-4 py-3 bg-matte-black border border-royal-green/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-royal-emerald focus:border-transparent"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-royal-emerald to-accent-gold text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-royal-emerald/50 transition-all flex items-center justify-center gap-2"
                  >
                    <Bell className="w-5 h-5" />
                    <span>Subscribe Free - No Spam Ever</span>
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    100% free. Unsubscribe anytime. We respect your privacy.
                  </p>
                </form>
              ) : (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-royal-emerald/20 border border-royal-emerald/50 rounded-xl p-6 text-center"
                >
                  <CheckCircle2 className="w-16 h-16 text-royal-emerald mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">You're Subscribed!</h3>
                  <p className="text-gray-300">
                    Check your inbox for a confirmation email. You'll start receiving daily insights
                    tomorrow morning.
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Latest News Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Latest Articles & Analysis</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((article, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
                className="bg-matte-black/50 border border-royal-green/30 rounded-xl overflow-hidden hover:border-royal-green/60 transition-all group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-royal-emerald/20 text-royal-emerald text-xs font-semibold rounded-full">
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{article.date}</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-royal-emerald transition-colors">
                    {article.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">{article.excerpt}</p>

                  <a
                    href={article.link}
                    className="flex items-center gap-2 text-accent-gold hover:text-accent-gold/80 transition-colors font-semibold text-sm"
                  >
                    <span>Read More</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>

        {/* Market Watch Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Market Watch Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketResources.map(resource => (
              <a
                key={resource.name}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6 hover:border-royal-green/60 transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <div className="text-white font-semibold text-lg mb-1">{resource.name}</div>
                    <div className="text-xs text-gray-400">{resource.category}</div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-royal-emerald group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-gray-400 text-sm">{resource.description}</p>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Economic Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Upcoming High-Impact Events</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-white">{event.title}</h3>
                  <span
                    className={`
                    px-3 py-1 rounded-full text-xs font-bold
                    ${event.impact === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}
                  `}
                  >
                    {event.impact} IMPACT
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                  <Clock className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>

                <p className="text-gray-300 text-sm">{event.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Educational Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid md:grid-cols-3 gap-6"
        >
          <a
            href="/learning-path"
            className="bg-gradient-to-br from-royal-green/20 to-royal-emerald/20 border border-royal-green/50 rounded-xl p-6 hover:border-royal-emerald transition-all group"
          >
            <TrendingUp className="w-12 h-12 text-royal-emerald mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">Trading Curriculum</h3>
            <p className="text-gray-300 text-sm mb-4">
              Master order blocks, liquidity, and institutional trading through our structured
              7-level program.
            </p>
            <div className="flex items-center gap-2 text-accent-gold font-semibold">
              <span>Start Learning</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          <a
            href="/portfolio"
            className="bg-gradient-to-br from-accent-gold/20 to-accent-gold/10 border border-accent-gold/50 rounded-xl p-6 hover:border-accent-gold transition-all group"
          >
            <Newspaper className="w-12 h-12 text-accent-gold mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">Live Market Analysis</h3>
            <p className="text-gray-300 text-sm mb-4">
              See real-time order block setups and learn from live market examples with TradingView
              charts.
            </p>
            <div className="flex items-center gap-2 text-accent-gold font-semibold">
              <span>View Analysis</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>

          <a
            href="/calendar"
            className="bg-gradient-to-br from-purple-500/20 to-purple-500/10 border border-purple-500/50 rounded-xl p-6 hover:border-purple-500 transition-all group"
          >
            <Tag className="w-12 h-12 text-purple-400 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-bold text-white mb-2">30-Day Calendar</h3>
            <p className="text-gray-300 text-sm mb-4">
              Track your learning journey with our structured curriculum calendar and progress
              tracker.
            </p>
            <div className="flex items-center gap-2 text-purple-400 font-semibold">
              <span>View Calendar</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </a>
        </motion.div>
      </div>
    </div>
  )
}
