'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Volume2, Download, Trash2, Save } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { tradingKnowledge } from '@/lib/tradingKnowledge'
import { analyzeSentiment, getBiasRecommendation, getPsychologyTip } from '@/lib/sentimentAnalyzer'
import {
  saveChatSession,
  createChatSession,
  addMessageToSession,
  getAllChatSessions,
  getChatSession,
  deleteChatSession,
  ChatSession,
} from '@/lib/chatPersistence'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp?: number
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Welcome to J Supreme Market Institute! 🚀 I'm your AI trading assistant powered by institutional trading knowledge. Ask me about:\n\n📍 Order Blocks • Market Structure • Liquidity Theory\n💡 Risk Management • Psychology • Technical Analysis\n📊 Real-time Market Data • Trading Strategies\n\nWhat would you like to learn today?",
      timestamp: Date.now(),
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [showSessionList, setShowSessionList] = useState(false)
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Initialize chat session on mount
  useEffect(() => {
    const newSession = createChatSession('Trading Session ' + new Date().toLocaleTimeString())
    setCurrentSession(newSession)
    saveChatSession(newSession)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Text-to-Speech function
  const speakMessage = (text: string) => {
    if (!textToSpeechEnabled || !('speechSynthesis' in window)) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.95
    utterance.pitch = 1
    utterance.volume = 0.8
    speechSynthesis.speak(utterance)
  }

  // Enhanced keyword search with sentiment and market data
  const findAnswer = (query: string): string => {
    const lowerQuery = query.toLowerCase()
    const sentiment = analyzeSentiment(query)

    // Check for specific knowledge base queries
    const knowledge = tradingKnowledge as any
    for (const category of Object.values(knowledge)) {
      if (typeof category === 'object' && category !== null) {
        for (const [key, value] of Object.entries(category)) {
          if (lowerQuery.includes(key.toLowerCase())) {
            if (typeof value === 'string') return value
          }
        }
      }
    }

    // Check for market data queries
    if (
      lowerQuery.includes('market') ||
      lowerQuery.includes('price') ||
      lowerQuery.includes('pair')
    ) {
      const pairs = ['eur/usd', 'gbp/usd', 'usd/jpy', 'aud/usd', 'xau/usd']
      for (const pair of pairs) {
        if (lowerQuery.includes(pair)) {
          return `📊 ${pair.toUpperCase()} Market Analysis:\n\nI can provide real-time market data through integrated APIs. Currently showing mock data:\n- EUR/USD: 1.0952 (↑0.42%)\n- Check the dashboard for live pricing and charts.\n\nWould you like trading ideas for this pair?`
        }
      }
    }

    // Provide psychology tips based on sentiment
    if (sentiment.emotions.length > 0) {
      const psychologyTip = getPsychologyTip(sentiment)
      const biasRec = getBiasRecommendation(sentiment)
      return `${psychologyTip}\n\n${biasRec}\n\nRemember: Follow your system, not your feelings.`
    }

    return "That's an excellent question! 🎯\n\nIn institutional trading, we focus on:\n\n1️⃣ **Market Structure** - Trend identification (HH/HL or LH/LL)\n2️⃣ **Order Blocks** - Where institutions accumulate\n3️⃣ **Liquidity** - Where price returns to execute\n4️⃣ **Confluence** - Multiple factors aligned\n5️⃣ **Risk Management** - 2% per trade maximum\n\nWhich topic would you like me to dive deeper into?"
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input, timestamp: Date.now() }
    setMessages(prev => [...prev, userMessage])

    // Save to session
    if (currentSession) {
      addMessageToSession(currentSession.id, {
        role: 'user',
        content: input,
        timestamp: Date.now(),
      })
    }

    setInput('')
    setIsLoading(true)

    // Simulate AI response with sentiment analysis
    setTimeout(() => {
      const response = findAnswer(input)

      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      }
      setMessages(prev => [...prev, assistantMessage])

      // Save to session
      if (currentSession) {
        addMessageToSession(currentSession.id, {
          role: 'assistant',
          content: response,
          timestamp: Date.now(),
        })
      }

      // Speak the response
      speakMessage(response)

      setIsLoading(false)
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleDeleteSession = (sessionId: string) => {
    deleteChatSession(sessionId)
    if (currentSession?.id === sessionId) {
      const newSession = createChatSession()
      setCurrentSession(newSession)
      saveChatSession(newSession)
      setMessages([messages[0]]) // Keep welcome message
    }
  }

  const handleLoadSession = (session: ChatSession) => {
    setCurrentSession(session)
    setMessages(session.messages.length > 0 ? session.messages : [messages[0]])
    setShowSessionList(false)
  }

  const sessions = getAllChatSessions()

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        title="Chat with AI (Ctrl+J)"
        className="fixed bottom-6 right-6 z-[9998] w-16 h-16 bg-gradient-to-br from-royal-green to-royal-emerald rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
      >
        {isOpen ? (
          <X className="w-7 h-7 text-white" />
        ) : (
          <MessageCircle className="w-7 h-7 text-white" />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header with Controls */}
            <div className="bg-gradient-to-r from-royal-green to-royal-emerald p-4 text-white">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-playfair font-bold text-xl">AI Trading Assistant</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setTextToSpeechEnabled(!textToSpeechEnabled)}
                    title={textToSpeechEnabled ? 'Disable audio' : 'Enable audio'}
                    className={`p-1 rounded-lg ${
                      textToSpeechEnabled ? 'bg-white/20' : 'bg-white/10'
                    } hover:bg-white/30 transition-colors`}
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setShowSessionList(!showSessionList)}
                    title="View chat history"
                    className="p-1 rounded-lg bg-white/10 hover:bg-white/30 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-200">Expert trading knowledge + Real-time analysis</p>
            </div>

            {/* Session List */}
            {showSessionList && sessions.length > 0 && (
              <div className="border-b border-gray-200 max-h-32 overflow-y-auto bg-gray-50 p-2">
                {sessions.slice(0, 5).map(session => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-100 rounded text-xs mb-1"
                  >
                    <span className="truncate flex-1">{session.title}</span>
                    <button
                      onClick={() => handleLoadSession(session)}
                      className="text-royal-green hover:font-bold"
                    >
                      Load
                    </button>
                    <button
                      onClick={() => handleDeleteSession(session.id)}
                      className="text-red-500 hover:text-red-700 ml-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-white to-gray-50">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-royal-green to-royal-emerald text-white'
                        : 'bg-gradient-to-br from-gray-100 to-gray-50 text-matte-black border border-gray-200'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap font-normal">
                      {message.content}
                    </p>
                    {message.role === 'assistant' && (
                      <button
                        onClick={() => speakMessage(message.content)}
                        className="mt-2 text-xs opacity-70 hover:opacity-100 flex items-center space-x-1"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>Read aloud</span>
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 rounded-2xl p-4 border border-gray-200">
                    <Loader2 className="w-5 h-5 animate-spin text-royal-green" />
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about trading..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-green focus:ring-1 focus:ring-royal-green/20"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="bg-royal-green text-white p-2 rounded-lg hover:bg-royal-emerald transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Tip: Ask about order blocks, market structure, risk management, or your feelings
                about a trade
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
