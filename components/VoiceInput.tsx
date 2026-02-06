'use client'

import { useState, useEffect } from 'react'
import { Mic, MicOff, Search } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface VoiceInputProps {
  placeholder?: string
  onSearch?: (query: string) => void
}

export default function VoiceInput({ placeholder = "Ask a question...", onSearch }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [browserSupport, setBrowserSupport] = useState(true)

  useEffect(() => {
    // Check browser support for Web Speech API
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setBrowserSupport(false)
    }
  }, [])

  const startListening = () => {
    if (!browserSupport) {
      alert('Your browser does not support speech recognition. Please try Chrome, Edge, or Safari.')
      return
    }

    // @ts-ignore - Web Speech API types
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript
      setTranscript(speechResult)
      if (onSearch) {
        onSearch(speechResult)
      }
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
  }

  const stopListening = () => {
    setIsListening(false)
  }

  const handleSearch = () => {
    if (transcript && onSearch) {
      onSearch(transcript)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && transcript && onSearch) {
      onSearch(transcript)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        {/* Input Field */}
        <div className="relative flex items-center bg-white bg-opacity-10 backdrop-blur-lg border-2 border-white border-opacity-20 rounded-2xl overflow-hidden">
          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            className="flex-1 px-6 py-4 bg-transparent text-white placeholder-gray-300 focus:outline-none"
          />
          
          {/* Voice Button */}
          <button
            onClick={isListening ? stopListening : startListening}
            className={`p-4 transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-accent-gold hover:bg-opacity-90'
            }`}
            title={isListening ? 'Stop listening' : 'Start voice input'}
          >
            {isListening ? (
              <MicOff className="w-6 h-6 text-white" />
            ) : (
              <Mic className="w-6 h-6 text-matte-black" />
            )}
          </button>

          {/* Search Button */}
          {transcript && (
            <button
              onClick={handleSearch}
              className="p-4 bg-royal-green hover:bg-royal-emerald transition-colors"
              title="Search"
            >
              <Search className="w-6 h-6 text-white" />
            </button>
          )}
        </div>

        {/* Listening Animation */}
        <AnimatePresence>
          {isListening && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute -bottom-12 left-0 right-0 text-center"
            >
              <div className="inline-flex items-center space-x-2 bg-red-500 bg-opacity-20 backdrop-blur-lg px-4 py-2 rounded-full border border-red-500 border-opacity-30">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-red-300 text-sm font-semibold">Listening...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Browser Support Warning */}
      {!browserSupport && (
        <p className="text-sm text-yellow-400 mt-2 text-center">
          Voice input not supported in this browser. Please use Chrome, Edge, or Safari.
        </p>
      )}
    </div>
  )
}
