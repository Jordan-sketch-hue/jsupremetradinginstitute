import LearningCalendar from '@/components/LearningCalendar'

export const metadata = {
  title: '30-Day Learning Calendar | Supreme Market Institute',
  description:
    'Track your trading education journey with our structured 30-day curriculum. From market foundations to institutional mastery.',
}

import React, { useState } from 'react'

import LearningCalendar from '@/components/LearningCalendar'
import React, { useState } from 'react'

export const metadata = {
  title: '30-Day Learning Calendar | Supreme Market Institute',
  description:
    'Track your trading education journey with our structured 30-day curriculum. From market foundations to institutional mastery.',
}

export default function CalendarPage() {
  const [impacts, setImpacts] = useState<string[]>(['0', '1', '2', '3'])
  const [symbols, setSymbols] = useState<string[]>([
    'AUD',
    'CAD',
    'CHF',
    'CNY',
    'EUR',
    'GBP',
    'JPY',
    'NZD',
    'USD',
  ])
  const [appliedImpacts, setAppliedImpacts] = useState<string[]>(['0', '1', '2', '3'])
  const [appliedSymbols, setAppliedSymbols] = useState<string[]>([
    'AUD',
    'CAD',
    'CHF',
    'CNY',
    'EUR',
    'GBP',
    'JPY',
    'NZD',
    'USD',
  ])

  const impactOptions = [
    { value: '0', label: 'None' },
    { value: '1', label: 'Low' },
    { value: '2', label: 'Medium' },
    { value: '3', label: 'High' },
  ]
  const symbolOptions = ['AUD', 'CAD', 'CHF', 'CNY', 'EUR', 'GBP', 'JPY', 'NZD', 'USD']

  const handleImpactChange = (value: string) => {
    setImpacts(prev => (prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]))
  }
  const handleSymbolChange = (value: string) => {
    setSymbols(prev => (prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]))
  }
  const handleApply = () => {
    setAppliedImpacts([...impacts])
    setAppliedSymbols([...symbols])
  }
  const iframeSrc = `https://widget.myfxbook.com/widget/calendar.html?lang=en&impacts=${appliedImpacts.join(',')}&symbols=${appliedSymbols.join(',')}`

  return (
    <div className="space-y-6">
      <section className="bg-matte-black/50 border border-emerald-400/40 rounded-2xl p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Live Economic Calendar</h2>
        <p className="text-sm text-gray-400 mb-4">
          Real-time macro events that can impact volatility. Use the filters below to customize the
          calendar.
        </p>
        {/* Filter Controls - visually distinct and always visible */}
        <div className="w-full flex flex-col md:flex-row md:items-end gap-4 mb-6 p-4 bg-slate-900/80 border border-emerald-700/30 rounded-xl shadow-lg">
          <div className="flex-1 min-w-[180px]">
            <div className="text-xs text-slate-400 mb-1 font-semibold">Impact</div>
            <div className="flex gap-2 flex-wrap">
              {impactOptions.map(opt => (
                <label
                  key={opt.value}
                  className="inline-flex items-center gap-1 text-xs font-medium"
                >
                  <input
                    type="checkbox"
                    checked={impacts.includes(opt.value)}
                    onChange={() => handleImpactChange(opt.value)}
                    className="accent-emerald-500"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>
          <div className="flex-1 min-w-[180px]">
            <div className="text-xs text-slate-400 mb-1 font-semibold">Currency</div>
            <div className="flex gap-2 flex-wrap">
              {symbolOptions.map(sym => (
                <label key={sym} className="inline-flex items-center gap-1 text-xs font-medium">
                  <input
                    type="checkbox"
                    checked={symbols.includes(sym)}
                    onChange={() => handleSymbolChange(sym)}
                    className="accent-emerald-500"
                  />
                  {sym}
                </label>
              ))}
            </div>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleApply}
              className="px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold shadow-lg border-2 border-emerald-400 transition-colors"
              style={{ minWidth: 120 }}
            >
              Apply Filters
            </button>
          </div>
        </div>
        {/* Myfxbook.com Economic Calendar Widget ONLY */}
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-6xl aspect-[16/7] md:aspect-[3/1] rounded-2xl overflow-hidden border-2 border-emerald-400 bg-black shadow-2xl">
            <iframe
              src={iframeSrc}
              className="w-full h-full min-h-[500px] md:min-h-[600px]"
              style={{ border: 0 }}
              title="Myfxbook Economic Calendar"
              allowFullScreen
            />
          </div>
          <div
            className="mt-2 text-center"
            style={{ fontFamily: 'roboto,sans-serif', fontSize: 15, color: '#66ff99' }}
          >
            <a
              href="https://www.myfxbook.com/forex-economic-calendar?utm_source=widget13&utm_medium=link&utm_campaign=copyright"
              title="Economic Calendar"
              className="myfxbookLink"
              target="_blank"
              rel="noopener"
            >
              <b style={{ color: '#66ff99' }}>Economic Calendar</b>
            </a>
            &nbsp;by Myfxbook.com
          </div>
        </div>
      </section>
      <LearningCalendar />
    </div>
  )
}
