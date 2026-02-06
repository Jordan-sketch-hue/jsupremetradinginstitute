'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { registerUser } from '@/lib/auth/auth'
import { UserPlus, AlertCircle, CheckCircle, Loader } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      // Validation
      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setLoading(false)
        return
      }

      const result = registerUser(email, password, name)

      if (result.success) {
        setSuccess('Account created successfully! Redirecting to login...')
        setTimeout(() => {
          router.push('/login')
        }, 1500)
      } else {
        setError(result.error || 'Registration failed')
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
            <UserPlus className="w-10 h-10 text-royal-emerald" />
            <h1 className="text-3xl font-bold text-white">J Supreme</h1>
          </div>
          <p className="text-gray-400">Create your trading account</p>
        </div>

        {/* Register Card */}
        <div className="bg-white/5 border border-royal-green/30 rounded-2xl p-8">
          <form onSubmit={handleRegister} className="space-y-5">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-white mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="John Trader"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-royal-green/30 rounded-lg text-white placeholder-gray-400 focus:border-royal-emerald focus:outline-none transition-colors"
                required
              />
            </div>

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
              <p className="text-xs text-gray-400 mt-1">Minimum 6 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-white mb-2"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
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
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center text-gray-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-royal-emerald hover:text-royal-green font-semibold">
            Sign in
          </Link>
        </p>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-royal-green/30 rounded-lg p-4 mt-8"
        >
          <p className="text-sm font-semibold text-white mb-3">Benefits of creating an account:</p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <span className="text-royal-emerald">✓</span> Save your progress across all courses
            </li>
            <li className="flex items-center gap-2">
              <span className="text-royal-emerald">✓</span> Track assessment scores and improvements
            </li>
            <li className="flex items-center gap-2">
              <span className="text-royal-emerald">✓</span> Access your learning history anytime
            </li>
            <li className="flex items-center gap-2">
              <span className="text-royal-emerald">✓</span> Download your trading certificate
            </li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  )
}
