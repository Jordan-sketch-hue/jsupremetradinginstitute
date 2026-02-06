'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Check, Lock, BookOpen, Video, FileText, Trophy } from 'lucide-react'
import VoiceInput from '@/components/VoiceInput'

export default function LearningPathPage() {
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [currentLevel, setCurrentLevel] = useState(1)

  const levels = [
    {
      id: 1,
      title: 'Market Foundations',
      description: 'Build your understanding of what truly moves markets',
      lessons: [
        { id: 1, title: 'Introduction to Institutional Trading', type: 'video', duration: '15 min' },
        { id: 2, title: 'Market Participants & Their Roles', type: 'video', duration: '20 min' },
        { id: 3, title: 'Understanding Liquidity Basics', type: 'reading', duration: '10 min' },
        { id: 4, title: 'Trading Psychology Foundation', type: 'interactive', duration: '25 min' },
        { id: 5, title: 'Level 1 Assessment', type: 'quiz', duration: '15 min' },
      ],
    },
    {
      id: 2,
      title: 'Market Structure',
      description: 'Master trend identification and structure analysis',
      lessons: [
        { id: 6, title: 'Higher Highs & Higher Lows', type: 'video', duration: '18 min' },
        { id: 7, title: 'Structure Breaks & Confirmations', type: 'video', duration: '22 min' },
        { id: 8, title: 'Multi-Timeframe Structure', type: 'interactive', duration: '30 min' },
        { id: 9, title: 'Real Chart Examples', type: 'video', duration: '25 min' },
        { id: 10, title: 'Level 2 Assessment', type: 'quiz', duration: '20 min' },
      ],
    },
    {
      id: 3,
      title: 'Order Block Mastery',
      description: 'Identify and trade institutional footprints',
      lessons: [
        { id: 11, title: 'What Are Order Blocks?', type: 'video', duration: '20 min' },
        { id: 12, title: 'Bullish vs Bearish Order Blocks', type: 'video', duration: '25 min' },
        { id: 13, title: 'Mitigation Theory Deep Dive', type: 'reading', duration: '15 min' },
        { id: 14, title: 'Order Block Scanner Tool', type: 'interactive', duration: '30 min' },
        { id: 15, title: 'Level 3 Assessment', type: 'quiz', duration: '25 min' },
      ],
    },
  ]

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return Video
      case 'reading': return BookOpen
      case 'interactive': return Play
      case 'quiz': return Trophy
      default: return FileText
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
                {Math.round((completedLessons.length / 15) * 100)}%
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
                          onClick={() => !locked && toggleLesson(lesson.id)}
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
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              completed ? 'bg-royal-green' : locked ? 'bg-gray-300' : 'bg-royal-green bg-opacity-20'
                            }`}>
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
                              <p className="text-sm text-gray-500 capitalize">{lesson.type} • {lesson.duration}</p>
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
          <button className="btn-primary text-lg px-10 py-4">
            Continue Learning
          </button>
        </motion.div>
      </div>
    </div>
  )
}
