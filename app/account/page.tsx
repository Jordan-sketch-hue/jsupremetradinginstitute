'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { getCurrentSession, logoutUser, getCurrentUserProgress, getUserById } from '@/lib/auth/auth'
import {
  User,
  LogOut,
  TrendingUp,
  CheckCircle,
  Award,
  Calendar,
  BarChart3,
  Download,
} from 'lucide-react'

export default function AccountPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentSession = getCurrentSession()
    if (!currentSession) {
      router.push('/login')
      return
    }

    setSession(currentSession)
    const userProgress = getCurrentUserProgress()
    setProgress(userProgress)
    const userData = getUserById(currentSession.userId)
    setUser(userData)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    logoutUser()
    router.push('/')
  }

  const downloadProgressReport = () => {
    const report = {
      user: user?.name || 'Guest',
      email: user?.email || 'guest@example.com',
      createdAt: user?.createdAt || 'N/A',
      progress: {
        completedLevels: progress?.completedLevels?.length || 0,
        completedCourses: progress?.completedCourses?.length || 0,
        assessmentAverageScore:
          Object.values(progress?.assessmentScores || {}).length > 0
            ? Math.round(
                (Object.values(progress?.assessmentScores || {}) as number[]).reduce(
                  (a: number, b: number) => a + b,
                  0
                ) / Object.values(progress?.assessmentScores || {}).length
              )
            : 0,
      },
      assessmentScores: progress?.assessmentScores || {},
      exportedAt: new Date().toISOString(),
    }

    const dataStr = JSON.stringify(report, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `j-supreme-progress-${new Date().toISOString().split('T')[0]}.json`
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-royal-green border-t-royal-emerald rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your account...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  const totalAssessments = Object.keys(progress?.assessmentScores || {}).length
  const averageScore =
    totalAssessments > 0
      ? Math.round(
          (Object.values(progress?.assessmentScores || {}) as number[]).reduce(
            (a: number, b: number) => a + b,
            0
          ) / totalAssessments
        )
      : 0

  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <User className="w-12 h-12 text-royal-emerald" />
            <h1 className="text-4xl font-bold text-white">Your Account</h1>
          </div>
          <p className="text-gray-400">
            Manage your profile and track your trading education progress
          </p>
        </motion.div>

        {/* User Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-royal-green/10 to-royal-emerald/5 border border-royal-green/30 rounded-2xl p-8 mb-8"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <p className="text-gray-400 text-sm mb-2">Full Name</p>
              <h2 className="text-2xl font-bold text-white mb-6">{session.name}</h2>

              <p className="text-gray-400 text-sm mb-2">Email Address</p>
              <p className="text-white font-semibold mb-6">{session.email}</p>

              <p className="text-gray-400 text-sm mb-2">Member Since</p>
              <p className="text-white font-semibold">
                {new Date(user?.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>

              <button
                onClick={downloadProgressReport}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-accent-gold/20 border border-accent-gold/50 text-accent-gold rounded-lg hover:bg-accent-gold/30 transition-colors"
              >
                <Download className="w-5 h-5" />
                Download Progress Report
              </button>
            </div>
          </div>
        </motion.div>

        {/* Progress Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-royal-green/30 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-6 h-6 text-royal-emerald" />
              <p className="text-gray-400 text-sm">Levels Completed</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {progress?.completedLevels?.length || 0}
            </p>
            <p className="text-xs text-gray-400 mt-2">of 7 total</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 border border-royal-green/30 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-royal-emerald" />
              <p className="text-gray-400 text-sm">Courses Done</p>
            </div>
            <p className="text-3xl font-bold text-white">
              {progress?.completedCourses?.length || 0}
            </p>
            <p className="text-xs text-gray-400 mt-2">of 3 main courses</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/5 border border-royal-green/30 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <Award className="w-6 h-6 text-royal-emerald" />
              <p className="text-gray-400 text-sm">Assessments Taken</p>
            </div>
            <p className="text-3xl font-bold text-white">{totalAssessments}</p>
            <p className="text-xs text-gray-400 mt-2">total quizzes</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/5 border border-royal-green/30 rounded-xl p-6"
          >
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-6 h-6 text-royal-emerald" />
              <p className="text-gray-400 text-sm">Average Score</p>
            </div>
            <p className="text-3xl font-bold text-white">{averageScore}%</p>
            <p className="text-xs text-gray-400 mt-2">on assessments</p>
          </motion.div>
        </div>

        {/* Assessment Scores */}
        {totalAssessments > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-royal-green/30 rounded-2xl p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-8 h-8 text-royal-emerald" />
              <h2 className="text-2xl font-bold text-white">Assessment Scores</h2>
            </div>

            <div className="space-y-4">
              {Object.entries(progress?.assessmentScores || {}).map(
                ([assessmentId, score]: [string, any]) => (
                  <div key={assessmentId} className="flex items-center gap-4">
                    <div className="flex-1">
                      <p className="text-white font-semibold capitalize">
                        {assessmentId.replace(/-/g, ' ')}
                      </p>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-royal-green to-royal-emerald transition-all duration-500"
                          style={{ width: `${score}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{score}%</p>
                    </div>
                  </div>
                )
              )}
            </div>
          </motion.div>
        )}

        {/* Learning Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-accent-gold/10 border border-accent-gold/30 rounded-2xl p-8 mt-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <Calendar className="w-8 h-8 text-accent-gold" />
            <h2 className="text-2xl font-bold text-white">Quick Links</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <a
              href="/learning-path"
              className="p-4 bg-white/5 border border-royal-green/30 rounded-lg hover:border-royal-green text-white hover:bg-white/10 transition-all"
            >
              <p className="font-semibold mb-1">Learning Path</p>
              <p className="text-sm text-gray-400">Continue your 7-level curriculum</p>
            </a>

            <a
              href="/dashboard"
              className="p-4 bg-white/5 border border-royal-green/30 rounded-lg hover:border-royal-green text-white hover:bg-white/10 transition-all"
            >
              <p className="font-semibold mb-1">Dashboard</p>
              <p className="text-sm text-gray-400">View your trading metrics</p>
            </a>

            <a
              href="/"
              className="p-4 bg-white/5 border border-royal-green/30 rounded-lg hover:border-royal-green text-white hover:bg-white/10 transition-all"
            >
              <p className="font-semibold mb-1">Home</p>
              <p className="text-sm text-gray-400">Back to main page</p>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
