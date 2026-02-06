import { useEffect, useState } from 'react'
import {
  getCurrentSession,
  getCurrentUserProgress,
  saveAssessmentScore,
  markLevelCompleted,
  markCourseCompleted,
} from './auth'

export function useUserProgress() {
  const [session, setSession] = useState<any>(null)
  const [progress, setProgress] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const currentSession = getCurrentSession()
    setSession(currentSession)

    const userProgress = getCurrentUserProgress()
    setProgress(userProgress)

    setIsLoading(false)
  }, [])

  const trackAssessment = (assessmentId: string, score: number, maxScore: number) => {
    saveAssessmentScore(assessmentId, score, maxScore)
    const userProgress = getCurrentUserProgress()
    setProgress(userProgress)
  }

  const completedLevel = (levelId: number) => {
    markLevelCompleted(levelId)
    const userProgress = getCurrentUserProgress()
    setProgress(userProgress)
  }

  const completedCourse = (courseId: string) => {
    markCourseCompleted(courseId)
    const userProgress = getCurrentUserProgress()
    setProgress(userProgress)
  }

  return {
    session,
    progress,
    isLoading,
    trackAssessment,
    completedLevel,
    completedCourse,
  }
}
