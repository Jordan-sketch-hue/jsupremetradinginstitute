'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { loginUser } from '@/lib/auth/auth'
import { LogIn, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const result = loginUser(email, password)

      if (result.success) {
        setSuccess('Login successful! Redirecting...')
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <LogIn className="w-10 h-10 text-royal-emerald" />
            <h1 className="text-3xl font-bold text-white">J Supreme</h1>
          </div>
          <p className="text-gray-400">Sign in to your trading account</p>
        </div>

        {/* Login Card */}
        <div className="bg-white/5 border border-royal-green/30 rounded-2xl p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-royal-green/30 rounded-lg text-white placeholder-gray-400 focus:border-royal-emerald focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-white mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-royal-green/30 rounded-lg text-white placeholder-gray-400 focus:border-royal-emerald focus:outline-none transition-colors"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-gap-2 bg-red-500/20 border border-red-500/50 rounded-lg p-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Success Message */}
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-gap-2 bg-green-500/20 border border-green-500/50 rounded-lg p-3"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-green-200 text-sm">{success}</p>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-royal-green to-royal-emerald text-white font-bold rounded-lg hover:shadow-lg hover:shadow-royal-green/30 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="w-5 h-5 animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Or Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-royal-green/30"></div>
            <span className="text-gray-400 text-sm">or continue as guest</span>
            <div className="flex-1 h-px bg-royal-green/30"></div>
          </div>

          {/* Guest Access Button */}
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full py-3 bg-white/5 border border-royal-green/30 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
          >
            Continue as Guest
          </button>
        </div>

        {/* Register Link */}
        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="text-royal-emerald hover:text-royal-green font-semibold"
          >
            Create one
          </Link>
        </p>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-accent-gold/10 border border-accent-gold/30 rounded-lg p-4 mt-8 text-sm text-gray-300"
        >
          <p className="font-semibold text-accent-gold mb-2">Demo Account:</p>
          <p>
            Email:{' '}
            <code className="bg-black/30 px-2 py-1 rounded text-platinum">demo@jsupreme.com</code>
          </p>
          <p>
            Password: <code className="bg-black/30 px-2 py-1 rounded text-platinum">Demo123</code>
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}
