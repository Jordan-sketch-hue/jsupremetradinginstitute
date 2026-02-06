'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Welcome to J Supreme Market Institute! I'm your AI trading assistant. Ask me about order blocks, market structure, liquidity theory, or any trading concept.",
    },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Import trading knowledge (would be imported in real implementation)
  // import { searchKnowledge } from '@/lib/tradingKnowledge'

  const quickAnswers: { [key: string]: string } = {
    'order block':
      "An order block is the last opposing candle before a strong impulsive move. It represents where institutions placed their orders. For bullish order blocks, it's the last bearish candle before a rally. Price often returns to these zones for re-entry opportunities.",
    liquidity:
      'Liquidity refers to areas where many orders are placed - typically at equal highs/lows, previous day extremes, and retail stop-loss zones. Institutions hunt these areas before making real moves. We wait for liquidity sweeps before entering.',
    mitigation:
      "Mitigation means price has returned to an order block zone. Unmitigated blocks (price hasn't returned yet) offer highest probability setups. Mitigated blocks have lower priority since institutions already executed their orders there.",
    'market structure':
      'Market structure determines our bias. In uptrends (higher highs, higher lows), we only look for buys. In downtrends (lower highs, lower lows), we only look for sells. This filters out 70% of bad trades.',
    manipulation:
      'Manipulation is when institutions create fake breakouts to trigger retail traders and grab liquidity. This is phase 2 of the market cycle. After manipulation comes distribution - the real move.',
    accumulation:
      'Accumulation is when institutions quietly build positions. Signs include sideways movement, tight ranges, and liquidity buildup. This is phase 1 before the manipulation and distribution phases.',
    rsi: 'We use RSI as a confirmation tool, not a decision maker. When price hits an order block, RSI should show divergence or oversold/overbought conditions to confirm institutional positioning.',
    atr: 'ATR (Average True Range) measures volatility. We use it for stop loss placement and to ensure realistic profit targets. If ATR is 30 pips, stops should be placed slightly outside the order block plus ATR consideration.',
    entry:
      'High probability entries require: 1) Higher timeframe trend alignment, 2) Unmitigated order block, 3) Liquidity sweep, 4) RSI divergence, 5) ATR supports movement, 6) Structure break on entry timeframe.',
    'stop hunt':
      'Stop hunts occur when price spikes beyond obvious levels to trigger retail stop losses, then reverses. This creates liquidity for institutional entries. We wait for the hunt to complete before entering.',
    'break of structure':
      "BOS (Break of Structure) confirms trend continuation. In uptrend, it's breaking above a significant high. In downtrend, breaking below a significant low. This validates order blocks in that direction.",
    timeframe:
      'Use Daily/4H for trend and major zones, 1H for refinement, 15M/5M for precise entries. Higher timeframes decide bias, lower timeframes decide timing.',
    risk: 'Never risk more than 1-2% per trade. Place stops beyond order block + ATR buffer. Use proper position sizing based on stop distance.',
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let response = "I understand you're asking about trading concepts. "

      // Simple keyword matching for demo
      const lowerInput = input.toLowerCase()
      let foundMatch = false

      for (const [keyword, explanation] of Object.entries(quickAnswers)) {
        if (lowerInput.includes(keyword)) {
          response = explanation
          foundMatch = true
          break
        }
      }

      if (!foundMatch) {
        response =
          "That's an excellent question! Let me help you understand this concept. In institutional trading, we focus on three core principles: 1) Trading where liquidity sits, 2) Following market structure, and 3) Identifying order block zones. Would you like me to explain any of these in more detail?"
      }

      const assistantMessage: Message = { role: 'assistant', content: response }
      setMessages(prev => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-royal-green to-royal-emerald rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
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
            {/* Header */}
            <div className="bg-gradient-to-r from-royal-green to-royal-emerald p-4 text-white">
              <h3 className="font-playfair font-bold text-xl">AI Trading Assistant</h3>
              <p className="text-sm text-gray-200">Powered by institutional knowledge</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-royal-green text-white'
                        : 'bg-gray-100 text-matte-black'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl p-4">
                    <Loader2 className="w-5 h-5 animate-spin text-royal-green" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about trading..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-royal-green"
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
                Press Enter to send, Shift+Enter for new line
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
