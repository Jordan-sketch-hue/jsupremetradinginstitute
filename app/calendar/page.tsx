import LearningCalendar from '@/components/LearningCalendar'
import { EconomicCalendarWidget } from '@/components/TradingViewWidgets'

export const metadata = {
  title: '30-Day Learning Calendar | Supreme Market Institute',
  description:
    'Track your trading education journey with our structured 30-day curriculum. From market foundations to institutional mastery.',
}

export default function CalendarPage() {
  return (
    <div className="space-y-6">
      <section className="bg-matte-black/50 border border-royal-green/20 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Live Economic Calendar</h2>
        <p className="text-sm text-gray-400 mb-4">
          Real-time macro events that can impact volatility.
        </p>
        <EconomicCalendarWidget />
      </section>
      <LearningCalendar />
    </div>
  )
}
