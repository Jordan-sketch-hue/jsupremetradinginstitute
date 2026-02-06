'use client'

import React, { ReactNode } from 'react'
import { AlertTriangle, Home } from 'lucide-react'
import Link from 'next/link'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black flex items-center justify-center px-4">
          <div className="max-w-md text-center">
            <div className="flex justify-center mb-6">
              <AlertTriangle className="w-16 h-16 text-red-400" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Oops!</h1>
            <p className="text-gray-400 mb-6">
              Something went wrong. This is unexpected, but we're working on it.
            </p>
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-8">
              <p className="text-red-400 text-sm font-mono break-words">
                {this.state.error?.message || 'Unknown error'}
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-royal-green to-royal-emerald text-white font-bold rounded-lg hover:shadow-lg hover:shadow-royal-green/30 transition-all"
            >
              <Home className="w-5 h-5" />
              Go to Home
            </Link>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
