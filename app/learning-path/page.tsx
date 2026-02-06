'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Lock, ArrowRight, Trophy } from 'lucide-react'
import Link from 'next/link'
import VoiceInput from '@/components/VoiceInput'

export default function LearningPathPage() {
  const [completedLevels, setCompletedLevels] = useState<number[]>([])

  const levels = [
    {
      id: 1,
      title: 'Market Foundations',
      description: 'Understand what truly moves markets and foundational concepts',
      duration: '2 weeks',
      lessons: 4,
      topics: [
        'What Moves Markets',
        'Market Participants',
        'Liquidity Basics',
        'Trading Psychology Foundation',
      ],
    },
    {
      id: 2,
      title: 'Market Structure',
      description: 'Master trend identification and price action analysis',
      duration: '3 weeks',
      lessons: 4,
      topics: [
        'Trend Identification',
        'Structure Breaks',
        'Timeframe Stacking',
        'Higher Highs & Lower Lows',
      ],
    },
    {
      id: 3,
      title: 'Order Block Mastery',
      description: 'Identify institutional footprints and order flow patterns',
      duration: '4 weeks',
      lessons: 4,
      topics: [
        'Order Block Identification',
        'Mitigation Theory',
        'Institutional Footprints',
        'Unmitigated vs Mitigated',
      ],
    },
    {
      id: 4,
      title: 'Liquidity & Manipulation',
      description: 'Understand stop hunts, traps, and liquidity sweeps',
      duration: '3 weeks',
      lessons: 4,
      topics: ['Stop Hunts', 'Fake Breakouts', 'Smart Money Traps', 'Liquidity Sweeps'],
    },
    {
      id: 5,
      title: 'Indicator Precision',
      description: 'Use RSI and ATR for confirmation and risk calibration',
      duration: '2 weeks',
      lessons: 4,
      topics: [
        'RSI Institutional Usage',
        'ATR Volatility Logic',
        'Divergence Patterns',
        'Confirmation Stacking',
      ],
    },
    {
      id: 6,
      title: 'Entry Engineering',
      description: 'Master timing and high-probability execution models',
      duration: '4 weeks',
      lessons: 4,
      topics: [
        'Micro Structure',
        'Timing Models',
        'Multi-Timeframe Entries',
        'High Probability Setups',
      ],
    },
    {
      id: 7,
      title: 'Risk & Psychology',
      description: 'Position sizing, trade management, and emotional discipline',
      duration: '3 weeks',
      lessons: 5,
      topics: [
        'Position Sizing Mastery',
        'Emotional Discipline',
        'Probability Thinking',
        'Trade Management',
        'Final Assessment',
      ],
    },
  ]

  const isLevelLocked = (levelId: number) => {
    if (levelId === 1) return false
    return !completedLevels.includes(levelId - 1)
  }

  const toggleLevel = (levelId: number) => {
    if (completedLevels.includes(levelId)) {
      setCompletedLevels(completedLevels.filter(id => id !== levelId))
    } else {
      setCompletedLevels([...completedLevels, levelId])
    }
  }

  const completedCount = completedLevels.length
  const totalCount = levels.length
  const overallProgress = Math.round((completedCount / totalCount) * 100)
  const currentLevel =
    completedLevels.length === totalCount
      ? totalCount
      : Math.min(completedLevels.length + 1, totalCount)

  return (
    <div className="min-h-screen bg-gradient-to-b from-platinum to-white pt-24 pb-12">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-playfair font-bold text-matte-black mb-4">
            Your <span className="text-gradient">Learning Path</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Structured 7-level curriculum to transform you into an institutional-level trader. All
            content compiled from credible sources and organized for systematic mastery.
          </p>
          <VoiceInput placeholder="Ask about any lesson or trading concept..." />
        </motion.div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-royal-green to-royal-emerald rounded-2xl p-8 text-white mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{completedCount}</div>
              <div className="text-gray-200">Levels Completed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{currentLevel}</div>
              <div className="text-gray-200">Current Level</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{totalCount}</div>
              <div className="text-gray-200">Total Levels</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">{overallProgress}%</div>
              <div className="text-gray-200">Overall Progress</div>
            </div>
          </div>
          <div className="w-full bg-white bg-opacity-20 rounded-full h-3 mt-6">
            <div
              className="bg-accent-gold h-3 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>
        </motion.div>

        {/* Levels Grid */}
        <div className="space-y-6">
          {levels.map((level, levelIndex) => {
            const isLocked = isLevelLocked(level.id)
            const isCompleted = completedLevels.includes(level.id)

            return (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: levelIndex * 0.08 }}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-300 ${
                  isLocked
                    ? 'opacity-60 pointer-events-none'
                    : 'hover:shadow-xl hover:shadow-royal-green/20'
                }`}
              >
                {/* Level Card */}
                <div
                  className={`relative p-6 rounded-2xl border-2 transition-all ${
                    isCompleted
                      ? 'bg-green-50 border-green-300'
                      : isLocked
                        ? 'bg-gray-50 border-gray-200'
                        : 'bg-white border-royal-green/30 hover:border-royal-green'
                  }`}
                >
                  {/* Background Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-royal-green/5 rounded-full -mr-16 -mt-16" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        {/* Level Number */}
                        <div
                          className={`flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center font-bold text-2xl ${
                            isCompleted
                              ? 'bg-green-500 text-white'
                              : isLocked
                                ? 'bg-gray-300 text-gray-500'
                                : 'bg-gradient-to-br from-royal-green to-royal-emerald text-white'
                          }`}
                        >
                          {isCompleted && <Check className="w-8 h-8" />}
                          {!isCompleted && !isLocked && level.id}
                          {isLocked && <Lock className="w-6 h-6" />}
                        </div>

                        {/* Level Info */}
                        <div>
                          <h2 className="text-2xl font-playfair font-bold text-matte-black">
                            Level {level.id}: {level.title}
                          </h2>
                          <p className="text-gray-600 mt-1">{level.description}</p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <span>{level.duration}</span>
                            <span>•</span>
                            <span>{level.lessons} lessons</span>
                          </div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      {isCompleted && (
                        <div className="flex-shrink-0 px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded-full">
                          ✓ Complete
                        </div>
                      )}
                      {isLocked && (
                        <div className="flex-shrink-0 px-3 py-1 bg-gray-300 text-gray-700 text-sm font-semibold rounded-full">
                          🔒 Locked
                        </div>
                      )}
                    </div>

                    {/* Topics */}
                    <div className="mb-4 pl-20">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Topics Covered:
                      </p>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {level.topics.map(topic => (
                          <li key={topic} className="text-sm text-gray-700 flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-royal-green rounded-full" />
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex gap-3 pl-20">
                      {!isLocked ? (
                        <>
                          <Link
                            href={`/levels/level-${level.id}`}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-royal-green to-royal-emerald text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-royal-green/50 transition-all"
                          >
                            Start Level <ArrowRight className="w-4 h-4" />
                          </Link>
                          {!isCompleted && (
                            <button
                              onClick={() => toggleLevel(level.id)}
                              className="px-4 py-2 border-2 border-royal-green text-royal-green font-semibold rounded-lg hover:bg-royal-green/5 transition-all"
                            >
                              Mark Complete
                            </button>
                          )}
                          {isCompleted && (
                            <button
                              onClick={() => toggleLevel(level.id)}
                              className="px-4 py-2 border-2 border-green-500 text-green-600 font-semibold rounded-lg hover:bg-green-50 transition-all"
                            >
                              Clear Completion
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="text-gray-600 font-semibold">
                          Complete Level {level.id - 1} to unlock
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Completion Message */}
        {completedLevels.length === totalCount && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 p-8 bg-gradient-to-r from-accent-gold/20 to-royal-green/20 border border-accent-gold/50 rounded-2xl text-center"
          >
            <Trophy className="w-16 h-16 mx-auto mb-4 text-accent-gold" />
            <h2 className="text-3xl font-bold text-matte-black mb-3">Congratulations! 🎓</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              You've completed all 7 levels of the J Supreme Trading Institute curriculum. You now
              possess professional-level trading knowledge. The next step is execution—start demo
              trading and apply what you've learned.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-royal-green to-royal-emerald text-white font-bold rounded-lg hover:shadow-lg transition-all"
            >
              Go to Dashboard to Track Trades <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        )}

        {/* CTA for Next Steps */}
        {completedLevels.length < totalCount && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 text-center"
          >
            <Link href={`/levels/level-${currentLevel}`} className="btn-primary text-lg px-10 py-4">
              Start Level {currentLevel} Now
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
