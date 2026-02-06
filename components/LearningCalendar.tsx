'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Calendar,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Target,
} from 'lucide-react'

interface TopicDay {
  day: number
  topic: string
  category: string
  completed: boolean
  courseLink: string
}

export default function LearningCalendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<TopicDay | null>(null)

  // Sample 30-day curriculum structure
  const curriculum: TopicDay[] = [
    // Week 1: Foundations
    {
      day: 1,
      topic: 'What Moves Markets',
      category: 'Foundations',
      completed: true,
      courseLink: '/learning-path#level1',
    },
    {
      day: 2,
      topic: 'Market Participants',
      category: 'Foundations',
      completed: true,
      courseLink: '/learning-path#level1',
    },
    {
      day: 3,
      topic: 'Liquidity Basics',
      category: 'Foundations',
      completed: true,
      courseLink: '/learning-path#level1',
    },
    {
      day: 4,
      topic: 'Market Structure Intro',
      category: 'Foundations',
      completed: true,
      courseLink: '/learning-path#level1',
    },
    {
      day: 5,
      topic: 'Trading View Setup',
      category: 'Tools',
      completed: false,
      courseLink: '/guides/tradingview',
    },
    {
      day: 6,
      topic: 'Deriv Demo Account',
      category: 'Tools',
      completed: false,
      courseLink: '/guides/deriv',
    },
    {
      day: 7,
      topic: 'Review & Practice',
      category: 'Practice',
      completed: false,
      courseLink: '/dashboard',
    },

    // Week 2: Market Structure
    {
      day: 8,
      topic: 'Higher Highs & Lows',
      category: 'Structure',
      completed: false,
      courseLink: '/learning-path#level2',
    },
    {
      day: 9,
      topic: 'Break of Structure',
      category: 'Structure',
      completed: false,
      courseLink: '/learning-path#level2',
    },
    {
      day: 10,
      topic: 'Change of Character',
      category: 'Structure',
      completed: false,
      courseLink: '/learning-path#level2',
    },
    {
      day: 11,
      topic: 'Trend Confirmation',
      category: 'Structure',
      completed: false,
      courseLink: '/learning-path#level2',
    },
    {
      day: 12,
      topic: 'Multi-Timeframe Analysis',
      category: 'Structure',
      completed: false,
      courseLink: '/learning-path#level2',
    },
    {
      day: 13,
      topic: 'Structure Practice',
      category: 'Practice',
      completed: false,
      courseLink: '/dashboard',
    },
    {
      day: 14,
      topic: 'Weekly Assessment',
      category: 'Assessment',
      completed: false,
      courseLink: '/dashboard',
    },

    // Week 3: Order Blocks
    {
      day: 15,
      topic: 'Order Block Theory',
      category: 'Order Blocks',
      completed: false,
      courseLink: '/learning-path#level3',
    },
    {
      day: 16,
      topic: 'Valid OB Requirements',
      category: 'Order Blocks',
      completed: false,
      courseLink: '/learning-path#level3',
    },
    {
      day: 17,
      topic: 'Mitigation Zones',
      category: 'Order Blocks',
      completed: false,
      courseLink: '/learning-path#level3',
    },
    {
      day: 18,
      topic: 'OB Probability Scoring',
      category: 'Order Blocks',
      completed: false,
      courseLink: '/learning-path#level3',
    },
    {
      day: 19,
      topic: 'Real Chart Analysis',
      category: 'Practice',
      completed: false,
      courseLink: '/portfolio',
    },
    {
      day: 20,
      topic: 'OB Identification Drill',
      category: 'Practice',
      completed: false,
      courseLink: '/dashboard',
    },
    {
      day: 21,
      topic: 'Midpoint Review',
      category: 'Assessment',
      completed: false,
      courseLink: '/dashboard',
    },

    // Week 4: Smart Money Concepts
    {
      day: 22,
      topic: 'Liquidity Sweeps',
      category: 'Smart Money',
      completed: false,
      courseLink: '/learning-path#level4',
    },
    {
      day: 23,
      topic: 'Stop Hunts',
      category: 'Smart Money',
      completed: false,
      courseLink: '/learning-path#level4',
    },
    {
      day: 24,
      topic: 'Market Manipulation',
      category: 'Smart Money',
      completed: false,
      courseLink: '/learning-path#level4',
    },
    {
      day: 25,
      topic: 'Accumulation Phase',
      category: 'Smart Money',
      completed: false,
      courseLink: '/learning-path#level4',
    },
    {
      day: 26,
      topic: 'RSI Confirmation',
      category: 'Indicators',
      completed: false,
      courseLink: '/learning-path#level5',
    },
    {
      day: 27,
      topic: 'ATR Risk Management',
      category: 'Risk',
      completed: false,
      courseLink: '/learning-path#level7',
    },
    {
      day: 28,
      topic: 'Entry Timing',
      category: 'Execution',
      completed: false,
      courseLink: '/learning-path#level6',
    },
    {
      day: 29,
      topic: 'Trading Psychology',
      category: 'Psychology',
      completed: false,
      courseLink: '/learning-path#level7',
    },
    {
      day: 30,
      topic: 'Final Assessment',
      category: 'Assessment',
      completed: false,
      courseLink: '/dashboard',
    },
  ]

  const monthName = currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })
  const daysInMonth = 30 // Simplified for 30-day curriculum

  const completedCount = curriculum.filter(t => t.completed).length
  const progressPercent = Math.round((completedCount / curriculum.length) * 100)

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Foundations: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      Tools: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      Structure: 'bg-green-500/20 text-green-400 border-green-500/50',
      'Order Blocks': 'bg-royal-green/20 text-royal-emerald border-royal-green',
      'Smart Money': 'bg-accent-gold/20 text-accent-gold border-accent-gold',
      Indicators: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50',
      Risk: 'bg-red-500/20 text-red-400 border-red-500/50',
      Execution: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      Psychology: 'bg-pink-500/20 text-pink-400 border-pink-500/50',
      Practice: 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50',
      Assessment: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    }
    return colors[category] || 'bg-gray-500/20 text-gray-400 border-gray-500/50'
  }

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
            <Calendar className="w-12 h-12 text-royal-emerald" />
            <h1 className="text-5xl font-bold text-white">Your Learning Journey</h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            A structured 30-day path from beginner to institutional trader. Track your progress and
            master each concept before moving forward.
          </p>
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-royal-green/10 to-royal-emerald/10 border border-royal-green/30 rounded-2xl p-8 mb-12"
        >
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Trophy className="w-6 h-6 text-accent-gold" />
                <div className="text-4xl font-bold text-white">{completedCount}</div>
              </div>
              <div className="text-gray-400">Topics Completed</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Target className="w-6 h-6 text-royal-emerald" />
                <div className="text-4xl font-bold text-white">
                  {curriculum.length - completedCount}
                </div>
              </div>
              <div className="text-gray-400">Topics Remaining</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{progressPercent}%</div>
              <div className="text-gray-400">Overall Progress</div>
              <div className="w-full bg-royal-green/20 h-2 rounded-full mt-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-royal-emerald to-accent-gold h-full rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-matte-black/50 border border-royal-green/30 rounded-2xl p-6 md:p-8"
        >
          {/* Month Header */}
          <div className="flex items-center justify-between mb-8">
            <button className="p-2 hover:bg-royal-green/20 rounded-lg transition-colors">
              <ChevronLeft className="w-6 h-6 text-gray-400" />
            </button>
            <h2 className="text-2xl font-bold text-white">{monthName} - 30 Day Curriculum</h2>
            <button className="p-2 hover:bg-royal-green/20 rounded-lg transition-colors">
              <ChevronRight className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-3">
            {curriculum.map(dayData => (
              <motion.button
                key={dayData.day}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedDay(selectedDay?.day === dayData.day ? null : dayData)}
                className={`
                  relative p-4 rounded-xl border-2 transition-all
                  ${
                    dayData.completed
                      ? 'bg-royal-emerald/20 border-royal-emerald shadow-lg shadow-royal-emerald/20'
                      : 'bg-royal-green/10 border-royal-green/30 hover:border-royal-green/60'
                  }
                  ${selectedDay?.day === dayData.day ? 'ring-2 ring-accent-gold' : ''}
                `}
              >
                {/* Day Number */}
                <div className="text-sm text-gray-400 mb-2">Day {dayData.day}</div>

                {/* Status Icon */}
                <div className="absolute top-2 right-2">
                  {dayData.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-royal-emerald" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-600" />
                  )}
                </div>

                {/* Topic */}
                <div className="text-white font-semibold text-sm line-clamp-2 mb-2">
                  {dayData.topic}
                </div>

                {/* Category Badge */}
                <div
                  className={`
                  text-xs px-2 py-1 rounded-full border
                  ${getCategoryColor(dayData.category)}
                `}
                >
                  {dayData.category}
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Selected Day Detail */}
        {selectedDay && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-gradient-to-br from-royal-green/20 to-royal-emerald/20 border border-royal-green/50 rounded-2xl p-8"
          >
            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-sm text-gray-400">Day {selectedDay.day}</div>
                  <div
                    className={`px-3 py-1 rounded-full border ${getCategoryColor(selectedDay.category)}`}
                  >
                    {selectedDay.category}
                  </div>
                  {selectedDay.completed && (
                    <div className="flex items-center gap-1 text-royal-emerald">
                      <CheckCircle2 className="w-4 h-4" />
                      <span className="text-sm">Completed</span>
                    </div>
                  )}
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">{selectedDay.topic}</h3>
                <p className="text-gray-300 mb-6">
                  {selectedDay.category === 'Foundations' &&
                    'Build your fundamental understanding of how financial markets operate and who controls price movement.'}
                  {selectedDay.category === 'Tools' &&
                    'Learn to set up and use essential trading platforms for analysis and execution.'}
                  {selectedDay.category === 'Structure' &&
                    'Master the art of reading market structure and identifying trend direction.'}
                  {selectedDay.category === 'Order Blocks' &&
                    'Discover institutional order blocks and how smart money leaves footprints.'}
                  {selectedDay.category === 'Smart Money' &&
                    'Understand manipulation tactics and how institutions trap retail traders.'}
                  {selectedDay.category === 'Indicators' &&
                    'Use technical indicators to confirm your trading bias and entries.'}
                  {selectedDay.category === 'Risk' &&
                    'Learn proper position sizing and risk management for long-term success.'}
                  {selectedDay.category === 'Execution' &&
                    'Refine your entry timing and execution strategies for optimal results.'}
                  {selectedDay.category === 'Psychology' &&
                    'Develop the mental discipline required for consistent trading performance.'}
                  {selectedDay.category === 'Practice' &&
                    'Apply your knowledge through hands-on practice and real chart analysis.'}
                  {selectedDay.category === 'Assessment' &&
                    'Test your understanding and identify areas for improvement.'}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href={selectedDay.courseLink}
                  className="px-6 py-3 bg-gradient-to-r from-royal-emerald to-accent-gold text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-royal-emerald/50 transition-all"
                >
                  Go to Course
                </a>
                {!selectedDay.completed && (
                  <button className="px-6 py-3 border-2 border-royal-green text-royal-emerald font-semibold rounded-lg hover:bg-royal-green/20 transition-all">
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Category Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 bg-matte-black/30 border border-royal-green/20 rounded-xl p-6"
        >
          <h3 className="text-xl font-bold text-white mb-4">Learning Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {[
              'Foundations',
              'Tools',
              'Structure',
              'Order Blocks',
              'Smart Money',
              'Indicators',
              'Risk',
              'Execution',
              'Psychology',
              'Practice',
              'Assessment',
            ].map(cat => (
              <div
                key={cat}
                className={`px-3 py-2 rounded-lg border text-sm text-center ${getCategoryColor(cat)}`}
              >
                {cat}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
