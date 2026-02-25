import LearningCalendar from '@/components/LearningCalendar'

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
        {/* Myfxbook.com Economic Calendar Widget ONLY */}
        <div className="w-full mt-6 flex flex-col items-center">
          <div className="w-full max-w-3xl aspect-[16/9] md:aspect-[3/1] rounded-lg overflow-hidden border border-royal-green/30 bg-black">
            <iframe
              src="https://widget.myfxbook.com/widget/calendar.html?lang=en&impacts=0,1,2,3&symbols=AUD,CAD,CHF,CNY,EUR,GBP,JPY,NZD,USD"
              className="w-full h-full min-h-[400px] md:min-h-[500px]"
              style={{ border: 0 }}
              title="Myfxbook Economic Calendar"
              allowFullScreen
            />
          </div>
          <div
            className="mt-2 text-center"
            style={{ fontFamily: 'roboto,sans-serif', fontSize: 13, color: '#666666' }}
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
            &nbsp;by Myfxbook.com
          </div>
        </div>
      </section>
      <LearningCalendar />
    </div>
  )
}
