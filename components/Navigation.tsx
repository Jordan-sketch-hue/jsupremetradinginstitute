'use client'

import { useState, useEffect } from 'react'
import { Menu, X, TrendingUp, Calendar, Newspaper, BookOpen, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'The Doctrine', href: '/doctrine' },
    { name: 'Learning Path', href: '/learning-path' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Calendar', href: '/calendar' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'News', href: '/news' },
    { name: 'Community', href: '/community' },
  ]

  const quickLinks = [
    { name: 'TradingView Setup', href: '/guides/tradingview', icon: BookOpen },
    { name: 'Deriv Guide', href: '/guides/deriv', icon: BarChart3 },
  ]

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-matte-black bg-opacity-95 backdrop-blur-lg shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-to-br from-royal-green to-royal-emerald rounded-lg flex items-center justify-center transform group-hover:rotate-6 transition-transform">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-white font-cinzel text-xl font-bold">J SUPREME</h1>
              <p className="text-accent-gold text-xs tracking-wider">MARKET INSTITUTE</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {navItems.map(item => (
              <Link
                key={item.name}
                href={item.href}
                className="text-platinum hover:text-accent-gold transition-colors font-medium text-sm"
              >
                {item.name}
              </Link>
            ))}
            <button className="btn-primary">Start Learning</button>
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
            <div className="px-4 mt-4">
              <button className="btn-primary w-full">Start Learning</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
