'use client'

// Floating notification/alert system for sitewide use

import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'

export interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  title: string
  message: string
  duration?: number
}

let notificationId = 0
let listeners: ((notifications: Notification[]) => void)[] = []
let notifications: Notification[] = []

export function addNotification(
  type: 'success' | 'error' | 'info' | 'warning',
  title: string,
  message: string,
  duration: number = 4000
) {
  const id = `notification-${notificationId++}`
  const notification: Notification = { id, type, title, message, duration }

  notifications.unshift(notification)
  listeners.forEach(listener => listener([...notifications]))

  if (duration) {
    setTimeout(() => {
      removeNotification(id)
    }, duration)
  }

  return id
}

export function removeNotification(id: string) {
  notifications = notifications.filter(n => n.id !== id)
  listeners.forEach(listener => listener([...notifications]))
}

export function subscribe(listener: (notifications: Notification[]) => void) {
  listeners.push(listener)
  return () => {
    listeners = listeners.filter(l => l !== listener)
  }
}

export default function NotificationContainer() {
  const [notificationsState, setNotificationsState] = useState<Notification[]>([])

  useState(() => {
    const unsubscribe = subscribe(setNotificationsState)
    return unsubscribe
  })

  const getIcon = (type: string) => {
    const iconClass = 'w-5 h-5'
    switch (type) {
      case 'success':
        return <CheckCircle className={`${iconClass} text-green-500`} />
      case 'error':
        return <AlertCircle className={`${iconClass} text-red-500`} />
      case 'warning':
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />
      default:
        return <Info className={`${iconClass} text-blue-500`} />
    }
  }

  const getBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-l-4 border-green-500'
      case 'error':
        return 'bg-red-50 border-l-4 border-red-500'
      case 'warning':
        return 'bg-yellow-50 border-l-4 border-yellow-500'
      default:
        return 'bg-blue-50 border-l-4 border-blue-500'
    }
  }

  return (
    <div className="fixed top-4 right-4 z-[9999] space-y-2 max-w-sm pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notificationsState.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, x: 400 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 400 }}
            className={`${getBgColor(notification.type)} rounded-lg shadow-lg p-4 pointer-events-auto flex items-start space-x-3`}
          >
            {getIcon(notification.type)}
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-matte-black">{notification.title}</h3>
              <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
