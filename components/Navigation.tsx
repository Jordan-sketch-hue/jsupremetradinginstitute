'use client'

import { useState, useEffect } from 'react'
import {
  Menu,
  X,
  TrendingUp,
  Calendar,
  Newspaper,
  BookOpen,
  BarChart3,
  LogIn,
  User,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getCurrentSession, logoutUser } from '@/lib/auth/auth'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [session, setSession] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)

    // Check for session
    const currentSession = getCurrentSession()
    setSession(currentSession)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Doctrine', href: '/doctrine' },
    { name: 'Learn', href: '/learning-path' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Trends', href: '/trends' },
    { name: 'Calendar', href: '/calendar' },
    { name: 'Portfolio', href: '/portfolio' },
  ]

  const quickLinks = [
    { name: 'TradingView Setup', href: '/guides/tradingview', icon: BookOpen },
    { name: 'Deriv Guide', href: '/guides/deriv', icon: BarChart3 },
  ]

  const handleLogout = () => {
    logoutUser()
    setSession(null)
    router.push('/')
  }

  return (
    <nav
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-matte-black/95 backdrop-blur-lg shadow-lg border-b border-royal-green/20'
          : 'bg-matte-black/70 backdrop-blur border-b border-royal-green/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
            <div className="w-9 h-9 bg-gradient-to-br from-royal-green to-royal-emerald rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform shadow-lg shadow-royal-green/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-white font-cinzel text-base font-bold tracking-wide">
                J SUPREME
              </h1>
              <p className="text-accent-gold text-[11px] tracking-[0.2em]">MARKET</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="text-platinum hover:text-accent-gold transition-colors font-medium text-sm whitespace-nowrap"
              >
                {item.name}
              </Link>
            ))}

            {/* Auth Links */}
            {session ? (
              <>
                <Link
                  href="/account"
                  className="flex items-center gap-2 text-platinum hover:text-accent-gold transition-colors font-medium text-sm"
                >
                  <User className="w-4 h-4" />
                  {session.name}
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors font-medium text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-platinum hover:text-accent-gold transition-colors font-medium text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
              </>
            )}

            <Link href="/levels/level-1" className="btn-primary">
              Start Learning
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-matte-black bg-opacity-95 backdrop-blur-lg rounded-lg mt-2 py-4 animate-fade-in">
            <div className="px-4 pb-2 mb-2 border-b border-royal-green/30">
              <p className="text-xs text-gray-400 uppercase tracking-wider">Main Pages</p>
            </div>
            {navItems.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-2 text-platinum hover:text-accent-gold hover:bg-royal-green hover:bg-opacity-20 transition-all"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-4 pt-4 pb-2 mt-2 border-t border-royal-green/30">
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Setup Guides</p>
            </div>
            {quickLinks.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-4 py-2 text-platinum hover:text-accent-gold hover:bg-royal-green hover:bg-opacity-20 transition-all"
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            ))}

            {/* Mobile Auth Section */}
            {session ? (
              <>
                <div className="px-4 pt-4 pb-2 border-t border-royal-green/30">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Account</p>
                </div>
                <Link
                  href="/account"
                  className="flex items-center gap-2 px-4 py-2 text-platinum hover:text-accent-gold hover:bg-royal-green hover:bg-opacity-20 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4" />
                  My Account
                </Link>
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="w-full mx-4 mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <div className="px-4 pt-4 pb-2 border-t border-royal-green/30">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Account</p>
                </div>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 text-platinum hover:text-accent-gold hover:bg-royal-green hover:bg-opacity-20 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-4 py-2 text-platinum hover:text-accent-gold hover:bg-royal-green hover:bg-opacity-20 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Create Account
                </Link>
              </>
            )}

            <div className="px-4 mt-4">
              <Link
                href="/levels/level-1"
                className="btn-primary w-full"
                onClick={() => setIsOpen(false)}
              >
                Start Learning
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
