export const metadata = {
  title: 'Free Resources | J Supreme Market Institute',
  description: 'Curated free resources for trading education, market analysis, and platform setup.',
}

export default function ResourcesPage() {
  const internalResources = [
    {
      title: 'TradingView Setup Guide',
      href: '/guides/tradingview',
      description: 'Free charting setup and platform walkthrough.',
    },
    {
      title: 'Deriv Demo Account Guide',
      href: '/guides/deriv',
      description: 'Open a free demo account and practice safely.',
    },
    { title: 'Learning Path', href: '/learning-path', description: 'Complete 7-level curriculum.' },
    {
      title: 'Market News & Updates',
      href: '/news',
      description: 'Market calendar and high-impact alerts.',
    },
    {
      title: 'Live Portfolio Analysis',
      href: '/portfolio',
      description: 'Live charts and trade breakdowns.',
    },
  ]

  const externalResources = [
    {
      title: 'Forex Factory Calendar',
      href: 'https://www.forexfactory.com/calendar',
      source: 'Forex Factory',
    },
    {
      title: 'TradingView Ideas',
      href: 'https://www.tradingview.com/ideas/',
      source: 'TradingView',
    },
    {
      title: 'Investopedia Trading Basics',
      href: 'https://www.investopedia.com/trading-4427765',
      source: 'Investopedia',
    },
    {
      title: 'CFTC Education Center',
      href: 'https://www.cftc.gov/LearnAndProtect/EducationCenter/index.htm',
      source: 'CFTC',
    },
    {
      title: 'CME Education',
      href: 'https://www.cmegroup.com/education.html',
      source: 'CME Group',
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black">
      <div className="section-container max-w-5xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-playfair font-bold text-gradient mb-4">Free Resources</h1>
          <p className="text-lg text-gray-400 mb-10 font-inter">
            Everything you need to learn, practice, and track your progress. All resources are free
            and aligned with the Royal Flow doctrine.
          </p>
        </header>
        <section className="mb-12">
          <h2 className="text-2xl font-playfair font-bold text-white mb-4">Platform Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {internalResources.map(resource => (
              <article key={resource.title} className="glass-effect rounded-xl p-6">
                <a
                  href={resource.href}
                  className="block hover:border-royal-green/60 transition-all"
                >
                  <div className="text-white font-semibold text-lg mb-2 font-playfair">
                    {resource.title}
                  </div>
                  <div className="text-gray-400 text-sm font-inter">{resource.description}</div>
                </a>
              </article>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-playfair font-bold text-white mb-4">External Sources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {externalResources.map(resource => (
              <article key={resource.title} className="glass-effect rounded-xl p-6">
                <a
                  href={resource.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:border-royal-green/60 transition-all"
                >
                  <div className="text-white font-semibold text-lg mb-2 font-playfair">
                    {resource.title}
                  </div>
                  <div className="text-gray-400 text-sm font-inter">Source: {resource.source}</div>
                </a>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
