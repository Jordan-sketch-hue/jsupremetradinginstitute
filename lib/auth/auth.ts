// Simple authentication utilities (client-side)
// For production, replace with a proper backend auth service (Firebase, Auth0, etc.)

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  lastLogin: string
}

export interface UserProgress {
  userId: string
  completedLevels: number[]
  completedCourses: string[]
  assessmentScores: Record<string, number>
  lastAccessed: string
}

const USERS_STORAGE_KEY = 'j_supreme_users'
const SESSION_STORAGE_KEY = 'j_supreme_session'
const GUEST_PROGRESS_KEY = 'j_supreme_guest_progress'

// Hash password (basic - for production use bcrypt on backend)
function hashPassword(password: string): string {
  let hash = 0
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36)
}

// Register user
export function registerUser(
  email: string,
  password: string,
  name: string
): { success: boolean; error?: string; user?: User } {
  if (!email || !password || !name) {
    return { success: false, error: 'All fields are required' }
  }

  if (password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters' }
  }

  if (!email.includes('@')) {
    return { success: false, error: 'Please enter a valid email' }
  }

  const users = getAllUsers()

  if (users.some((u: any) => u.email === email)) {
    return { success: false, error: 'Email already registered' }
  }

  const user: User = {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString(),
  }

  const userWithPassword = {
    ...user,
    passwordHash: hashPassword(password),
  }

  const users_list = [...users, userWithPassword]
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users_list))

  return { success: true, user }
}

// Login user
export function loginUser(
  email: string,
  password: string
): { success: boolean; error?: string; user?: User } {
  if (!email || !password) {
    return { success: false, error: 'Email and password are required' }
  }

  const users = getAllUsers()
  const user = users.find((u: any) => u.email === email)

  if (!user) {
    return { success: false, error: 'Email or password incorrect' }
  }

  // @ts-ignore
  if (user.passwordHash !== hashPassword(password)) {
    return { success: false, error: 'Email or password incorrect' }
  }

  // Update last login
  const userIndex = users.findIndex((u: any) => u.email === email)
  users[userIndex] = {
    ...user,
    lastLogin: new Date().toISOString(),
  }
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))

  // Create session
  const session = {
    userId: user.id,
    email: user.email,
    name: user.name,
    loginTime: new Date().toISOString(),
  }
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session))

  return { success: true, user: { ...user, lastLogin: new Date().toISOString() } }
}

// Get current session
export function getCurrentSession() {
  if (typeof window === 'undefined') return null

  const session = localStorage.getItem(SESSION_STORAGE_KEY)
  return session ? JSON.parse(session) : null
}

// Logout user
export function logoutUser() {
  localStorage.removeItem(SESSION_STORAGE_KEY)
}

// Get all users (for development only - don't do this in production)
export function getAllUsers() {
  if (typeof window === 'undefined') return []

  const users = localStorage.getItem(USERS_STORAGE_KEY)
  return users ? JSON.parse(users) : []
}

// Get user by ID
export function getUserById(userId: string) {
  const users = getAllUsers()
  return users.find((u: any) => u.id === userId)
}

// Save guest progress
export function saveGuestProgress(progress: UserProgress) {
  localStorage.setItem(GUEST_PROGRESS_KEY, JSON.stringify(progress))
}

// Get guest progress
export function getGuestProgress(): UserProgress | null {
  if (typeof window === 'undefined') return null

  const progress = localStorage.getItem(GUEST_PROGRESS_KEY)
  return progress ? JSON.parse(progress) : null
}

// Save user progress
export function saveUserProgress(userId: string, progress: Partial<UserProgress>) {
  const key = `j_supreme_progress_${userId}`
  const existing = getUserProgress(userId)
  const updated = { ...existing, ...progress, userId }
  localStorage.setItem(key, JSON.stringify(updated))
}

// Get user progress
export function getUserProgress(userId: string): UserProgress {
  const key = `j_supreme_progress_${userId}`
  if (typeof window === 'undefined')
    return {
      userId,
      completedLevels: [],
      completedCourses: [],
      assessmentScores: {},
      lastAccessed: '',
    }

  const progress = localStorage.getItem(key)
  return progress
    ? JSON.parse(progress)
    : {
        userId,
        completedLevels: [],
        completedCourses: [],
        assessmentScores: {},
        lastAccessed: new Date().toISOString(),
      }
}

// Mark level as completed
export function markLevelCompleted(levelId: number) {
  const session = getCurrentSession()

  if (session) {
    // Logged in user
    const progress = getUserProgress(session.userId)
    if (!progress.completedLevels.includes(levelId)) {
      progress.completedLevels.push(levelId)
      progress.lastAccessed = new Date().toISOString()
      saveUserProgress(session.userId, progress)
    }
  } else {
    // Guest user
    const progress = getGuestProgress() || {
      userId: 'guest',
      completedLevels: [],
      completedCourses: [],
      assessmentScores: {},
      lastAccessed: '',
    }
    if (!progress.completedLevels.includes(levelId)) {
      progress.completedLevels.push(levelId)
      progress.lastAccessed = new Date().toISOString()
      saveGuestProgress(progress)
    }
  }
}

// Mark course as completed
export function markCourseCompleted(courseId: string) {
  const session = getCurrentSession()

  if (session) {
    // Logged in user
    const progress = getUserProgress(session.userId)
    if (!progress.completedCourses.includes(courseId)) {
      progress.completedCourses.push(courseId)
      progress.lastAccessed = new Date().toISOString()
      saveUserProgress(session.userId, progress)
    }
  } else {
    // Guest user
    const progress = getGuestProgress() || {
      userId: 'guest',
      completedLevels: [],
      completedCourses: [],
      assessmentScores: {},
      lastAccessed: '',
    }
    if (!progress.completedCourses.includes(courseId)) {
      progress.completedCourses.push(courseId)
      progress.lastAccessed = new Date().toISOString()
      saveGuestProgress(progress)
    }
  }
}

// Save assessment score
export function saveAssessmentScore(assessmentId: string, score: number, maxScore: number) {
  const session = getCurrentSession()
  const percentage = Math.round((score / maxScore) * 100)

  if (session) {
    // Logged in user
    const progress = getUserProgress(session.userId)
    progress.assessmentScores[assessmentId] = percentage
    progress.lastAccessed = new Date().toISOString()
    saveUserProgress(session.userId, progress)
  } else {
    // Guest user
    const progress = getGuestProgress() || {
      userId: 'guest',
      completedLevels: [],
      completedCourses: [],
      assessmentScores: {},
      lastAccessed: '',
    }
    progress.assessmentScores[assessmentId] = percentage
    progress.lastAccessed = new Date().toISOString()
    saveGuestProgress(progress)
  }
}

// Get current user's progress
export function getCurrentUserProgress(): UserProgress | null {
  const session = getCurrentSession()

  if (!session) {
    return getGuestProgress()
  }

  return getUserProgress(session.userId)
}
