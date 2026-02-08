'use client'

import Link from 'next/link'
import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Route error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle className="w-16 h-16 text-amber-400" />
        </div>
        <h1 className="text-4xl font-bold text-white mb-2">Something went wrong</h1>
        <p className="text-gray-400 mb-6">
          The page hit an unexpected error. You can try again or return home.
        </p>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mb-6">
          <p className="text-amber-200 text-sm font-mono break-words">
            {error?.message || 'Unknown error'}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-royal-green to-royal-emerald text-white font-bold rounded-lg hover:shadow-lg hover:shadow-royal-green/30 transition-all"
          >
            <RefreshCcw className="w-5 h-5" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-700 transition-all"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>
        {error?.digest && <p className="text-xs text-slate-500 mt-4">Error ID: {error.digest}</p>}
      </div>
    </div>
  )
}
