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
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Free Resources</h1>
        <p className="text-gray-400 mb-10">
          Everything you need to learn, practice, and track your progress. All resources are free
          and aligned with the Royal Flow doctrine.
        </p>

        <section className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4">Platform Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {internalResources.map(resource => (
              <a
                key={resource.title}
                href={resource.href}
                className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6 hover:border-royal-green/60 transition-all"
              >
                <div className="text-white font-semibold text-lg mb-2">{resource.title}</div>
                <div className="text-gray-400 text-sm">{resource.description}</div>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">External Sources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {externalResources.map(resource => (
              <a
                key={resource.title}
                href={resource.href}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6 hover:border-royal-green/60 transition-all"
              >
                <div className="text-white font-semibold text-lg mb-2">{resource.title}</div>
                <div className="text-gray-400 text-sm">Source: {resource.source}</div>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
