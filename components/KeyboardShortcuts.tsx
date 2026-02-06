'use client'

// Keyboard shortcuts for enhanced user experience

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, X } from 'lucide-react'

interface Shortcut {
  keys: string[]
  description: string
  action: () => void
}

const KeyboardShortcuts = () => {
  const [showHelp, setShowHelp] = useState(false)
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ctrl/Cmd + / to toggle help
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault()
        setShowHelp(prev => !prev)
      }

      // Ctrl/Cmd + K to focus search (future feature)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        // Focus search input if available
      }

      // Ctrl/Cmd + J to open chat
      if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault()
        const chatButton = document.querySelector('button[title="Chat with AI"]')
        ;(chatButton as HTMLButtonElement)?.click()
      }

      // Escape to close help
      if (e.key === 'Escape') {
        setShowHelp(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    setShortcuts([
      {
        keys: ['Ctrl', '/'],
        description: 'Toggle keyboard help',
        action: () => setShowHelp(prev => !prev),
      },
      {
        keys: ['Ctrl', 'K'],
        description: 'Focus search',
        action: () => {},
      },
      {
        keys: ['Ctrl', 'J'],
        description: 'Open AI chat',
        action: () => {},
      },
      {
        keys: ['Escape'],
        description: 'Close dialogs',
        action: () => {},
      },
    ])

    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <>
      {/* Help button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-royal-green text-white rounded-full shadow-lg flex items-center justify-center hover:bg-royal-emerald transition-colors group"
        title="Keyboard shortcuts (Ctrl + /)"
      >
        <HelpCircle className="w-6 h-6" />
        <span className="absolute bottom-full mb-2 bg-matte-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Shortcuts (Ctrl + /)
        </span>
      </motion.button>

      {/* Help modal */}
      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowHelp(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-playfair font-bold text-matte-black">
                  Keyboard Shortcuts
                </h2>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                {shortcuts.map((shortcut, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">{shortcut.description}</span>
                    <div className="flex space-x-1">
                      {shortcut.keys.map((key, keyIdx) => (
                        <div key={keyIdx}>
                          {keyIdx > 0 && <span className="text-gray-400 mx-1">+</span>}
                          <kbd className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs font-mono font-semibold">
                            {key}
                          </kbd>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-500 mt-4">Press ESC to close</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default KeyboardShortcuts
