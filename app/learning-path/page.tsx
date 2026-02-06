'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Check, Lock, BookOpen, Video, FileText, Trophy } from 'lucide-react'
import VoiceInput from '@/components/VoiceInput'

export default function LearningPathPage() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([])

  const levels = [
    {
      id: 1,
      title: 'Market Foundations',
      description: 'Build your understanding of what truly moves markets',
      weeks: '2 weeks',
      topics: [
        'What Moves Markets',
        'Market Participants',
        'Liquidity Basics',
        'Trading Psychology Foundation',
      ],
      resources: [
        {
          title: 'What Moves the Forex Market',
          source: 'Investopedia',
          url: 'https://www.investopedia.com/articles/forex/08/forex-trading-factors.asp',
        },
        {
          title: 'Market Participants Overview',
          source: 'BIS',
          url: 'https://www.bis.org/publ/rpfx19.htm',
        },
        {
          title: 'Introduction to Liquidity',
          source: 'CME Group',
          url: 'https://www.cmegroup.com/education/courses/introduction-to-futures/liquidity.html',
        },
      ],
      lessons: [
        {
          id: 1,
          title: 'What Moves Markets',
          type: 'reading',
          duration: '15 min',
          link: 'https://www.investopedia.com/articles/forex/08/forex-trading-factors.asp',
        },
        {
          id: 2,
          title: 'Market Participants',
          type: 'reading',
          duration: '20 min',
          link: 'https://www.bis.org/publ/rpfx19.htm',
        },
        {
          id: 3,
          title: 'Liquidity Basics',
          type: 'reading',
          duration: '15 min',
          link: 'https://www.cmegroup.com/education/courses/introduction-to-futures/liquidity.html',
        },
        {
          id: 4,
          title: 'Trading Psychology Foundation',
          type: 'interactive',
          duration: '25 min',
          link: '/courses/trading-psychology',
        },
        {
          id: 5,
          title: 'Level 1 Assessment',
          type: 'quiz',
          duration: '15 min',
          link: '/dashboard',
        },
      ],
    },
    {
      id: 2,
      title: 'Market Structure',
      description: 'Master trend identification and structure analysis',
      weeks: '3 weeks',
      topics: [
        'Trend Identification',
        'Structure Breaks',
        'Timeframe Stacking',
        'Higher High/Lower Low Patterns',
      ],
      resources: [
        {
          title: 'Market Structure Basics',
          source: 'TradingView',
          url: 'https://www.tradingview.com/ideas/marketstructure/',
        },
        {
          title: 'Trend Analysis Guide',
          source: 'CFTC',
          url: 'https://www.cftc.gov/LearnAndProtect/EducationCenter/index.htm',
        },
        {
          title: 'Multi-Timeframe Analysis',
          source: 'BabyPips',
          url: 'https://www.babypips.com/learn/forex/multiple-time-frame-analysis',
        },
      ],
      lessons: [
        {
          id: 6,
          title: 'Trend Identification',
          type: 'video',
          duration: '18 min',
          link: 'https://www.cftc.gov/LearnAndProtect/EducationCenter/index.htm',
        },
        {
          id: 7,
          title: 'Structure Breaks',
          type: 'video',
          duration: '22 min',
          link: 'https://www.tradingview.com/ideas/marketstructure/',
        },
        {
          id: 8,
          title: 'Timeframe Stacking',
          type: 'interactive',
          duration: '30 min',
          link: 'https://www.babypips.com/learn/forex/multiple-time-frame-analysis',
        },
        {
          id: 9,
          title: 'Higher High/Lower Low Patterns',
          type: 'reading',
          duration: '20 min',
          link: 'https://www.tradingview.com/ideas/marketstructure/',
        },
        {
          id: 10,
          title: 'Level 2 Assessment',
          type: 'quiz',
          duration: '20 min',
          link: '/dashboard',
        },
      ],
    },
    {
      id: 3,
      title: 'Order Block Mastery',
      description: 'Identify and trade institutional footprints',
      weeks: '4 weeks',
      topics: [
        'Order Block Identification',
        'Mitigation Theory',
        'Institutional Footprints',
        'Unmitigated vs Mitigated',
      ],
      resources: [
        {
          title: 'Order Blocks Overview',
          source: 'TradingView',
          url: 'https://www.tradingview.com/ideas/orderblock/',
        },
        {
          title: 'Liquidity Concepts',
          source: 'NYSE',
          url: 'https://www.nyse.com/markets/liquidity',
        },
        {
          title: 'Institutional Order Flow',
          source: 'CME Group',
          url: 'https://www.cmegroup.com/education/courses/understanding-order-flow.html',
        },
      ],
      lessons: [
        {
          id: 11,
          title: 'Order Block Identification',
          type: 'video',
          duration: '20 min',
          link: 'https://www.tradingview.com/ideas/orderblock/',
        },
        {
          id: 12,
          title: 'Mitigation Theory',
          type: 'reading',
          duration: '20 min',
          link: 'https://www.tradingview.com/ideas/orderblock/',
        },
        {
          id: 13,
          title: 'Institutional Footprints',
          type: 'video',
          duration: '20 min',
          link: 'https://www.cmegroup.com/education/courses/understanding-order-flow.html',
        },
        {
          id: 14,
          title: 'Unmitigated vs Mitigated',
          type: 'interactive',
          duration: '25 min',
          link: 'https://www.tradingview.com/ideas/orderblock/',
        },
        {
          id: 15,
          title: 'Level 3 Assessment',
          type: 'quiz',
          duration: '25 min',
          link: '/dashboard',
        },
      ],
    },
    {
      id: 4,
      title: 'Liquidity & Manipulation',
      description: 'Understand stop hunts, traps, and liquidity sweeps',
      weeks: '3 weeks',
      topics: ['Stop Hunts', 'Fake Breakouts', 'Smart Money Traps', 'Liquidity Sweeps'],
      resources: [
        {
          title: 'Liquidity Sweeps Explained',
          source: 'TradingView',
          url: 'https://www.tradingview.com/ideas/liquidity/',
        },
        {
          title: 'Market Manipulation Overview',
          source: 'SEC',
          url: 'https://www.sec.gov/market-structure',
        },
        {
          title: 'Understanding Stop Orders',
          source: 'CME Group',
          url: 'https://www.cmegroup.com/education/courses/trade-types/stop-orders.html',
        },
      ],
      lessons: [
        {
          id: 16,
          title: 'Stop Hunts',
          type: 'video',
          duration: '18 min',
          link: 'https://www.cmegroup.com/education/courses/trade-types/stop-orders.html',
        },
        {
          id: 17,
          title: 'Fake Breakouts',
          type: 'video',
          duration: '18 min',
          link: 'https://www.sec.gov/market-structure',
        },
        {
          id: 18,
          title: 'Smart Money Traps',
          type: 'reading',
          duration: '20 min',
          link: 'https://www.tradingview.com/ideas/liquidity/',
        },
        {
          id: 19,
          title: 'Liquidity Sweeps',
          type: 'interactive',
          duration: '25 min',
          link: 'https://www.tradingview.com/ideas/liquidity/',
        },
        {
          id: 20,
          title: 'Level 4 Assessment',
          type: 'quiz',
          duration: '20 min',
          link: '/dashboard',
        },
      ],
    },
    {
      id: 5,
      title: 'Indicator Precision',
      description: 'Use RSI and ATR for confirmation and risk calibration',
      weeks: '2 weeks',
      topics: [
        'RSI Institutional Usage',
        'ATR Volatility Logic',
        'Divergence Patterns',
        'Confirmation Stacking',
      ],
      resources: [
        {
          title: 'RSI Explained',
          source: 'Investopedia',
          url: 'https://www.investopedia.com/terms/r/rsi.asp',
        },
        {
          title: 'ATR Explained',
          source: 'Investopedia',
          url: 'https://www.investopedia.com/terms/a/atr.asp',
        },
        {
          title: 'Divergence Basics',
          source: 'TradingView',
          url: 'https://www.tradingview.com/ideas/divergence/',
        },
      ],
      lessons: [
        {
          id: 21,
          title: 'RSI Institutional Usage',
          type: 'video',
          duration: '20 min',
          link: 'https://www.investopedia.com/terms/r/rsi.asp',
        },
        {
          id: 22,
          title: 'ATR Volatility Logic',
          type: 'reading',
          duration: '15 min',
          link: 'https://www.investopedia.com/terms/a/atr.asp',
        },
        {
          id: 23,
          title: 'Divergence Patterns',
          type: 'video',
          duration: '20 min',
          link: 'https://www.tradingview.com/ideas/divergence/',
        },
        {
          id: 24,
          title: 'Confirmation Stacking',
          type: 'interactive',
          duration: '25 min',
          link: '/dashboard',
        },
        {
          id: 25,
          title: 'Level 5 Assessment',
          type: 'quiz',
          duration: '20 min',
          link: '/dashboard',
        },
      ],
    },
    {
      id: 6,
      title: 'Entry Engineering',
      description: 'Master timing and high-probability execution models',
      weeks: '4 weeks',
      topics: [
        'Micro Structure',
        'Timing Models',
        'Multi-Timeframe Entries',
        'High Probability Setups',
      ],
      resources: [
        {
          title: 'Entry Timing Principles',
          source: 'CME Group',
          url: 'https://www.cmegroup.com/education/courses/introduction-to-futures/price-action.html',
        },
        {
          title: 'Order Execution Basics',
          source: 'FINRA',
          url: 'https://www.finra.org/investors/learn-to-invest/basics/order-types',
        },
        {
          title: 'Multi-Timeframe Entry Examples',
          source: 'TradingView',
          url: 'https://www.tradingview.com/ideas/entries/',
        },
      ],
      lessons: [
        {
          id: 26,
          title: 'Micro Structure',
          type: 'video',
          duration: '20 min',
          link: 'https://www.cmegroup.com/education/courses/introduction-to-futures/price-action.html',
        },
        {
          id: 27,
          title: 'Timing Models',
          type: 'reading',
          duration: '20 min',
          link: 'https://www.finra.org/investors/learn-to-invest/basics/order-types',
        },
        {
          id: 28,
          title: 'Multi-Timeframe Entries',
          type: 'interactive',
          duration: '30 min',
          link: 'https://www.tradingview.com/ideas/entries/',
        },
        {
          id: 29,
          title: 'High Probability Setups',
          type: 'video',
          duration: '25 min',
          link: '/dashboard',
        },
        {
          id: 30,
          title: 'Level 6 Assessment',
          type: 'quiz',
          duration: '20 min',
          link: '/dashboard',
        },
      ],
    },
    {
      id: 7,
      title: 'Risk & Psychology',
      description: 'Position sizing, trade management, and emotional discipline',
      weeks: '3 weeks',
      topics: [
        'Position Sizing',
        'Emotional Discipline',
        'Probability Thinking',
        'Trade Management',
      ],
      resources: [
        {
          title: 'Risk Management Basics',
          source: 'CFTC',
          url: 'https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/RiskManagement.html',
        },
        {
          title: 'Trading Psychology',
          source: 'Investopedia',
          url: 'https://www.investopedia.com/terms/t/tradingpsychology.asp',
        },
        {
          title: 'Position Sizing Guide',
          source: 'CME Group',
          url: 'https://www.cmegroup.com/education/courses/introduction-to-futures/risk-management.html',
        },
      ],
      lessons: [
        {
          id: 31,
          title: 'Position Sizing',
          type: 'reading',
          duration: '20 min',
          link: '/courses/account-management',
        },
        {
          id: 32,
          title: 'Emotional Discipline',
          type: 'interactive',
          duration: '25 min',
          link: '/courses/trading-psychology',
        },
        {
          id: 33,
          title: 'Probability Thinking',
          type: 'video',
          duration: '20 min',
          link: '/courses/trading-psychology',
        },
        {
          id: 34,
          title: 'Trade Management',
          type: 'reading',
          duration: '20 min',
          link: '/courses/account-management',
        },
        {
          id: 35,
          title: 'Level 7 Assessment',
          type: 'quiz',
          duration: '20 min',
          link: '/dashboard',
        },
      ],
    },
  ]

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video
      case 'reading':
        return BookOpen
      case 'interactive':
        return Play
      case 'quiz':
        return Trophy
      default:
        return FileText
    }
  }

  const isLessonLocked = (lessonId: number) => {
    if (lessonId === 1) return false
    return !completedLessons.includes(lessonId - 1)
  }

  const toggleLesson = (lessonId: number) => {
    if (completedLessons.includes(lessonId)) {
      setCompletedLessons(completedLessons.filter(id => id !== lessonId))
    } else {
      setCompletedLessons([...completedLessons, lessonId])
    }
  }

  const calculateProgress = (level: any) => {
    const levelLessonIds = level.lessons.map((l: any) => l.id)
    const completed = levelLessonIds.filter((id: number) => completedLessons.includes(id))
    return (completed.length / levelLessonIds.length) * 100
  }

  const totalLessons = levels.reduce((acc: number, level: any) => acc + level.lessons.length, 0)
  const currentLevel = (() => {
    const index = levels.findIndex((level: any) => calculateProgress(level) < 100)
    return index === -1 ? levels.length : index + 1
  })()

  return (
    <div className="min-h-screen bg-gradient-to-b from-platinum to-white pt-24">
      <div className="section-container">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-playfair font-bold text-matte-black mb-4"
          >
            Your <span className="text-gradient">Learning Path</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
          >
            Structured curriculum to transform you into an institutional-level trader
          </motion.p>

          <VoiceInput placeholder="Ask about any lesson or trading concept..." />
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-royal-green to-royal-emerald rounded-2xl p-8 text-white mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{completedLessons.length}</div>
              <div className="text-gray-200">Lessons Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{currentLevel}</div>
              <div className="text-gray-200">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">
                {Math.round((completedLessons.length / totalLessons) * 100)}%
              </div>
              <div className="text-gray-200">Overall Progress</div>
            </div>
          </div>
        </motion.div>

        {/* Levels */}
        <div className="space-y-8">
          {levels.map((level, levelIndex) => {
            const progress = calculateProgress(level)
            const isLocked = levelIndex > 0 && calculateProgress(levels[levelIndex - 1]) < 100

            return (
              <motion.div
                key={level.id}
                id={`level-${level.id}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: levelIndex * 0.1 }}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden ${isLocked ? 'opacity-60' : ''}`}
              >
                {/* Level Header */}
                <div className="bg-gradient-to-r from-royal-green to-royal-emerald p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center font-bold text-2xl">
                        {level.id}
                      </div>
                      <div>
                        <h2 className="text-2xl font-playfair font-bold">{level.title}</h2>
                        <p className="text-gray-200">{level.description}</p>
                        <p className="text-gray-200 text-sm mt-1">Duration: {level.weeks}</p>
                      </div>
                    </div>
                    {isLocked && <Lock className="w-6 h-6" />}
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                    <div
                      className="bg-accent-gold h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-200 mt-2">{Math.round(progress)}% Complete</p>
                </div>

                {/* Level Details */}
                <div className="p-6 border-b border-gray-200">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                        Core Topics
                      </h3>
                      <ul className="space-y-2">
                        {level.topics.map((topic: string) => (
                          <li key={topic} className="text-sm text-matte-black">
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                        Recommended Sources
                      </h3>
                      <ul className="space-y-2">
                        {level.resources.map((resource: any) => (
                          <li key={resource.title} className="text-sm">
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-royal-green hover:text-royal-emerald transition-colors"
                            >
                              {resource.title}
                            </a>
                            <div className="text-xs text-gray-500">{resource.source}</div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">
                        Start This Level
                      </h3>
                      <a
                        href={level.resources[0]?.url || `/learning-path#level-${level.id}`}
                        target={level.resources[0]?.url ? '_blank' : undefined}
                        rel={level.resources[0]?.url ? 'noopener noreferrer' : undefined}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-royal-green text-white text-sm font-semibold hover:bg-royal-emerald transition-colors"
                      >
                        Start Level {level.id}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Lessons */}
                <div className="p-6">
                  <div className="space-y-3">
                    {level.lessons.map((lesson, lessonIndex) => {
                      const LessonIcon = getLessonIcon(lesson.type)
                      const locked = isLocked || isLessonLocked(lesson.id)
                      const completed = completedLessons.includes(lesson.id)

                      return (
                        <button
                          key={lesson.id}
                          onClick={() => {
                            if (locked) return
                            toggleLesson(lesson.id)
                            if (lesson.link) {
                              window.open(
                                lesson.link,
                                lesson.link.startsWith('http') ? '_blank' : '_self'
                              )
                            }
                          }}
                          disabled={locked}
                          className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                            completed
                              ? 'bg-royal-green bg-opacity-10 border-2 border-royal-green'
                              : locked
                                ? 'bg-gray-100 cursor-not-allowed'
                                : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent hover:border-royal-green'
                          }`}
                        >
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                completed
                                  ? 'bg-royal-green'
                                  : locked
                                    ? 'bg-gray-300'
                                    : 'bg-royal-green bg-opacity-20'
                              }`}
                            >
                              {completed ? (
                                <Check className="w-5 h-5 text-white" />
                              ) : locked ? (
                                <Lock className="w-5 h-5 text-gray-500" />
                              ) : (
                                <LessonIcon className="w-5 h-5 text-royal-green" />
                              )}
                            </div>
                            <div className="text-left">
                              <h3 className="font-semibold text-matte-black">{lesson.title}</h3>
                              <p className="text-sm text-gray-500 capitalize">
                                {lesson.type} • {lesson.duration}
                              </p>
                            </div>
                          </div>
                          {!locked && !completed && (
                            <span className="text-royal-green font-semibold text-sm">Start →</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Continue CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-4">Ready to dive deeper?</p>
          <button className="btn-primary text-lg px-10 py-4">Continue Learning</button>
        </motion.div>
      </div>
    </div>
  )
}
