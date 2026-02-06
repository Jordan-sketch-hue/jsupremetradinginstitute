'use client'

// Chat History Persistence - Save and restore conversations
// Stores conversations in localStorage for persistence across sessions

export interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  sentiment?: string
}

export interface ChatSession {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
  marketContext?: string // What market was being discussed
}

const STORAGE_KEY = 'jsupreme_chat_history'
const MAX_SESSIONS = 10 // Keep last 10 sessions
const MAX_MESSAGES_PER_SESSION = 50
const isBrowser = typeof window !== 'undefined' && typeof localStorage !== 'undefined'

/**
 * Get all chat sessions from localStorage
 */
export function getAllChatSessions(): ChatSession[] {
  try {
    if (!isBrowser) return []
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return []
    const sessions = JSON.parse(stored) as ChatSession[]
    return sessions.sort((a, b) => b.updatedAt - a.updatedAt)
  } catch (error) {
    console.error('Error reading chat sessions:', error)
    return []
  }
}

/**
 * Save a chat session to localStorage
 */
export function saveChatSession(session: ChatSession): void {
  try {
    if (!isBrowser) return
    let sessions = getAllChatSessions()

    // Update or add session
    const existingIndex = sessions.findIndex(s => s.id === session.id)
    if (existingIndex >= 0) {
      sessions[existingIndex] = { ...session, updatedAt: Date.now() }
    } else {
      sessions.push({ ...session, createdAt: Date.now(), updatedAt: Date.now() })
    }

    // Keep only last MAX_SESSIONS
    sessions = sessions.slice(0, MAX_SESSIONS)

    // Limit messages per session
    sessions = sessions.map(s => ({
      ...s,
      messages: s.messages.slice(-MAX_MESSAGES_PER_SESSION),
    }))

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  } catch (error) {
    console.error('Error saving chat session:', error)
  }
}

/**
 * Get a specific chat session by ID
 */
export function getChatSession(sessionId: string): ChatSession | null {
  const sessions = getAllChatSessions()
  return sessions.find(s => s.id === sessionId) || null
}

/**
 * Create a new chat session
 */
export function createChatSession(title: string = 'New Conversation'): ChatSession {
  return {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title,
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

/**
 * Add a message to a session
 */
export function addMessageToSession(sessionId: string, message: Message): ChatSession | null {
  const session = getChatSession(sessionId)
  if (!session) return null

  session.messages.push({
    ...message,
    timestamp: Date.now(),
  })
  session.updatedAt = Date.now()

  // Limit to MAX_MESSAGES_PER_SESSION
  if (session.messages.length > MAX_MESSAGES_PER_SESSION) {
    session.messages = session.messages.slice(-MAX_MESSAGES_PER_SESSION)
  }

  saveChatSession(session)
  return session
}

/**
 * Delete a chat session
 */
export function deleteChatSession(sessionId: string): void {
  try {
    if (!isBrowser) return
    let sessions = getAllChatSessions()
    sessions = sessions.filter(s => s.id !== sessionId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
  } catch (error) {
    console.error('Error deleting chat session:', error)
  }
}

/**
 * Clear all chat sessions
 */
export function clearAllChatSessions(): void {
  try {
    if (!isBrowser) return
    localStorage.removeItem(STORAGE_KEY)
  } catch (error) {
    console.error('Error clearing chat sessions:', error)
  }
}

/**
 * Export chat session as text
 */
export function exportChatAsText(sessionId: string): string {
  const session = getChatSession(sessionId)
  if (!session) return ''

  let text = `Chat Session: ${session.title}\n`
  text += `Created: ${new Date(session.createdAt).toLocaleString()}\n`
  text += `=`.repeat(50) + '\n\n'

  session.messages.forEach((msg, i) => {
    const time = new Date(msg.timestamp).toLocaleTimeString()
    const role = msg.role === 'user' ? '👤 You' : '🤖 Assistant'
    text += `[${time}] ${role}:\n${msg.content}\n\n`
  })

  return text
}

/**
 * Export chat session as JSON
 */
export function exportChatAsJSON(sessionId: string): string {
  const session = getChatSession(sessionId)
  if (!session) return ''
  return JSON.stringify(session, null, 2)
}

/**
 * Get chat summary (first and last few messages)
 */
export function getChatSummary(sessionId: string, count: number = 3): Message[] {
  const session = getChatSession(sessionId)
  if (!session) return []

  const messages = session.messages
  if (messages.length <= count * 2) return messages

  return [...messages.slice(0, count), ...messages.slice(-count)]
}

/**
 * Search chat messages by keyword
 */
export function searchChatMessages(sessionId: string, keyword: string): Message[] {
  const session = getChatSession(sessionId)
  if (!session) return []

  const lowerKeyword = keyword.toLowerCase()
  return session.messages.filter(msg => msg.content.toLowerCase().includes(lowerKeyword))
}

/**
 * Get conversation stats
 */
export function getConversationStats(sessionId: string) {
  const session = getChatSession(sessionId)
  if (!session) return null

  const userMessages = session.messages.filter(m => m.role === 'user').length
  const assistantMessages = session.messages.filter(m => m.role === 'assistant').length
  const totalMessages = session.messages.length
  const duration = session.updatedAt - session.createdAt

  return {
    userMessages,
    assistantMessages,
    totalMessages,
    durationMinutes: Math.round(duration / 60000),
    createdAt: session.createdAt,
    updatedAt: session.updatedAt,
  }
}

/**
 * Get all stats for all sessions
 */
export function getAllStats() {
  const sessions = getAllChatSessions()
  const stats = sessions.map(s => ({
    id: s.id,
    title: s.title,
    messageCount: s.messages.length,
    createdAt: s.createdAt,
    lastUpdated: s.updatedAt,
  }))

  return {
    totalSessions: sessions.length,
    totalMessages: sessions.reduce((sum, s) => sum + s.messages.length, 0),
    sessions: stats,
  }
}
