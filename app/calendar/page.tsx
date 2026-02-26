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

  export const metadata = {
    title: '30-Day Learning Calendar | Supreme Market Institute',
    description:
      'Track your trading education journey with our structured 30-day curriculum. From market foundations to institutional mastery.',
  }

  export default function CalendarPage() {
    return (
      <div className="space-y-6">
        <section className="bg-matte-black/50 border border-emerald-400/40 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-2">Live Economic Calendar</h2>
          <p className="text-sm text-gray-400 mb-4">
            Real-time macro events that can impact volatility.
          </p>
          {/* myfxbook.com Economic Calendar Widget - Start */}
          <div className="w-full flex flex-col items-center">
            <div className="w-full" style={{ minHeight: 600 }}>
              <iframe
                src="https://widget.myfxbook.com/widget/calendar.html?lang=en&impacts=3&symbols=AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG,AZN,BAM,BBD,BDT,BGN,BHD,BIF,BMD,BND,BOB,BRL,BSD,BTN,BWP,BYN,BZD,CAD,CDF,CHF,CLP,CNY,COP,CRC,CUC,CVE,CZK,DJF,DKK,DOP,DZD,EGP,ERN,ETB,EUR,FJD,FKP,GBP,GEL,GHS,GIP,GMD,GNF,GTQ,GYD,HKD,HNL,HRK,HTG,HUF,IDR,ILS,INR,IQD,IRR,ISK,JMD,JOD,JPY,KES,KGS,KHR,KMF,KPW,KRW,KWD,KYD,KZT,LAK,LBP,LKR,LRD,LSL,LYD,MAD,MDL,MGA,MKD,MMK,MNT,MOP,MRO,MUR,MVR,MWK,MXN,MYR,MZN,NAD,NGN,NIO,NOK,NPR,NZD,OMR,PAB,PEN,PGK,PHP,PKR,PLN,PYG,QAR,RON,RSD,RUB,RWF,SAR,SBD,SCR,SDG,SEK,SGD,SHP,SLL,SOS,SRD,SSP,STD,SYP,SZL,THB,TJS,TMT,TND,TOP,TRY,TTD,TWD,TZS,UAH,UGX,USD,UYU,UZS,VEF,VND,VUV,WST,XAF,XCD,XOF,XPF,YER,ZAR,ZMW"
                style={{ border: 0, width: '100%', height: '100%' }}
                title="Myfxbook Economic Calendar"
                allowFullScreen
              />
            </div>
            <div style={{ marginTop: 10 }}>
              <div style={{ width: 'fit-content', margin: 'auto', fontFamily: 'roboto,sans-serif', fontSize: 13, color: '#666666' }}>
                <a href="https://www.myfxbook.com/forex-economic-calendar?utm_source=widget13&utm_medium=link&utm_campaign=copyright" title="Economic Calendar" className="myfxbookLink" target="_blank" rel="noopener">
                  <b style={{ color: '#666666' }}>Economic Calendar</b>
                </a>
                by Myfxbook.com
              </div>
            </div>
          </div>
          {/* myfxbook.com Economic Calendar Widget - End */}
        </section>
      </div>
    )
  }
    setAppliedImpacts([...impacts])
