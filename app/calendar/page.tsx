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
        {/* myfxbook.com Economic Calendar Widget - Start */}
        <div style={{ width: '100%', height: '500px', marginTop: '24px' }}>
          <iframe
            src="https://widget.myfxbook.com/widget/calendar.html?lang=en&impacts=0,1,2,3&symbols=AUD,CAD,CHF,CNY,EUR,GBP,JPY,NZD,USD"
            style={{ border: 0, width: '100%', height: '100%' }}
            title="Myfxbook Economic Calendar"
            allowFullScreen
          />
          <div style={{ marginTop: '10px' }}>
            <div
              style={{
                width: 'fit-content',
                margin: 'auto',
                fontFamily: 'roboto,sans-serif',
                fontSize: '13px',
                color: '#666666',
              }}
            >
              <a
                href="https://www.myfxbook.com/forex-economic-calendar?utm_source=widget13&utm_medium=link&utm_campaign=copyright"
                title="Economic Calendar"
                className="myfxbookLink"
                target="_blank"
                rel="noopener"
              >
                <b style={{ color: '#666666' }}>Economic Calendar</b>
              </a>
              by Myfxbook.com
            </div>
          </div>
        </div>
        {/* myfxbook.com Economic Calendar Widget - End */}
      </section>
      <LearningCalendar />
    </div>
  )
}
