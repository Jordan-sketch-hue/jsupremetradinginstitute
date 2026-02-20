'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  BarChart3,
  Bot,
  Briefcase,
  CandlestickChart,
  ChevronDown,
  AlertCircle,
  Globe2,
  LineChart,
  Zap,
} from 'lucide-react'

interface TrendsSection {
  id: string
  label: string
  category: 'forex' | 'crypto' | 'indices' | 'commodities'
  icon: React.ReactNode
}

const TRENDS_SECTIONS: TrendsSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    category: 'forex',
    icon: <Globe2 className="h-4 w-4" />,
  },
  {
    id: 'signals',
    label: 'Live Signals',
    category: 'forex',
    icon: <Activity className="h-4 w-4" />,
  },
  {
    id: 'forex',
    label: 'Forex Pairs',
    category: 'forex',
    icon: <LineChart className="h-4 w-4" />,
  },
  {
    id: 'crypto',
    label: 'Crypto',
    category: 'crypto',
    icon: <CandlestickChart className="h-4 w-4" />,
  },
  {
    id: 'indices',
    label: 'Indices',
    category: 'indices',
    icon: <BarChart3 className="h-4 w-4" />,
  },
  {
    id: 'commodities',
    label: 'Commodities',
    category: 'commodities',
    icon: <Briefcase className="h-4 w-4" />,
  },
  {
    id: 'debrief',
    label: 'Market Debrief',
    category: 'forex',
    icon: <LineChart className="h-4 w-4" />,
  },
  {
    id: 'failures',
    label: 'Analysis Failures',
    category: 'forex',
    icon: <AlertCircle className="h-4 w-4" />,
  },
  {
    id: 'dashboard',
    label: 'Bot Dashboard',
    category: 'forex',
    icon: <Bot className="h-4 w-4" />,
  },
]

interface TrendsNavigationProps {
  onNavigate: (sectionId: string) => void
  activeSection?: string
}

export default function TrendsNavigation({ onNavigate, activeSection }: TrendsNavigationProps) {
  const [isExpanded, setIsExpanded] = useState(true)

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'dashboard') {
      window.open('/bot-dashboard', '_blank')
      return
    }
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      onNavigate(sectionId)
    } else {
      // Always call onNavigate to update state even if section not found
      onNavigate(sectionId)
    }
  }

  return (
    <div className="fixed bottom-0 left-0 w-full z-50 backdrop-blur-xl bg-slate-950/90 border-t border-slate-800 md:sticky md:top-0 md:border-b md:border-t-0">
      <div className="max-w-7xl mx-auto px-2 py-2 md:px-4 md:py-4">
        {/* Mobile Toggle */}
        <div className="flex items-center justify-between md:hidden mb-2">
          <h3 className="text-sm font-bold text-slate-300 flex items-center gap-2">
            <Zap size={16} className="text-emerald-500" />
            Quick Navigation
          </h3>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <ChevronDown
              size={20}
              className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Navigation Items */}
        <motion.div
          initial={false}
          animate={{ height: isExpanded ? 'auto' : 0 }}
          className="overflow-hidden md:overflow-visible md:h-auto"
        >
          <div className="flex flex-nowrap overflow-x-auto gap-2 md:gap-3 justify-center md:justify-start">
            {TRENDS_SECTIONS.map((section, idx) => (
              <motion.button
                key={section.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                onClick={() => scrollToSection(section.id)}
                className={`flex flex-col items-center px-2 md:px-4 py-1.5 md:py-2 rounded-lg font-medium text-xs md:text-sm transition-all whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
                style={{ minWidth: 60 }}
              >
                <span className="mb-0.5 text-slate-300">{section.icon}</span>
                {/* Only show label on md+ screens */}
                <span className="hidden md:inline">{section.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Desktop Horizontal Scroll Indicator */}
        <p className="text-xs text-slate-500 mt-2 md:hidden text-center">
          ← Scroll for more sections →
        </p>
      </div>
    </div>
  )
}
