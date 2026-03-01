export const metadata = {
  title: '30-Day Learning Calendar | Supreme Market Institute',
  description:
    'Track your trading education journey with our structured 30-day curriculum. From market foundations to institutional mastery.',
}

export default function CalendarPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black">
      <div className="section-container">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-playfair font-bold text-white mb-2">
            Live Economic Calendar
          </h1>
          <p className="text-lg text-gray-400 mb-4">
            Real-time macro events that can impact volatility.
          </p>
        </header>
        <section className="glass-effect rounded-2xl p-6 shadow-2xl">
          <div className="w-full flex flex-col items-center">
            <div className="w-full" style={{ minHeight: 900 }}>
              <iframe
                src="https://widget.myfxbook.com/widget/calendar.html?lang=en&impacts=3&symbols=AED,AFN,ALL,AMD,ANG,AOA,ARS,AUD,AWG,AZN,BAM,BBD,BDT,BGN,BHD,BIF,BMD,BND,BOB,BRL,BSD,BTN,BWP,BYN,BZD,CAD,CDF,CHF,CLP,CNY,COP,CRC,CUC,CVE,CZK,DJF,DKK,DOP,DZD,EGP,ERN,ETB,EUR,FJD,FKP,GBP,GEL,GHS,GIP,GMD,GNF,GTQ,GYD,HKD,HNL,HRK,HTG,HUF,IDR,ILS,INR,IQD,IRR,ISK,JMD,JOD,JPY,KES,KGS,KHR,KMF,KPW,KRW,KWD,KYD,KZT,LAK,LBP,LKR,LRD,LSL,LYD,MAD,MDL,MGA,MKD,MMK,MNT,MOP,MRO,MUR,MVR,MWK,MXN,MYR,MZN,NAD,NGN,NIO,NOK,NPR,NZD,OMR,PAB,PEN,PGK,PHP,PKR,PLN,PYG,QAR,RON,RSD,RUB,RWF,SAR,SBD,SCR,SDG,SEK,SGD,SHP,SLL,SOS,SRD,SSP,STD,SYP,SZL,THB,TJS,TMT,TND,TOP,TRY,TTD,TWD,TZS,UAH,UGX,USD,UYU,UZS,VEF,VND,VUV,WST,XAF,XCD,XOF,XPF,YER,ZAR,ZMW"
                style={{ border: 0, width: '100%', height: '900px' }}
                title="Myfxbook Economic Calendar"
                allowFullScreen
              />
            </div>
            <div className="mt-4 text-center text-xs text-gray-500 font-inter">
              <a
                href="https://www.myfxbook.com/forex-economic-calendar?utm_source=widget13&utm_medium=link&utm_campaign=copyright"
                title="Economic Calendar"
                className="myfxbookLink text-royal-green font-semibold"
                target="_blank"
                rel="noopener"
              >
                <span className="text-gradient">Economic Calendar</span>
              </a>
              <span className="ml-1">by Myfxbook.com</span>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
