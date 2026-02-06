export const metadata = {
  title: 'Pricing | J Supreme Market Institute',
  description: 'Transparent access model and platform tiers.',
}

export default function PricingPage() {
  const tiers = [
    {
      name: 'Free Access',
      price: '$0',
      description: 'Full learning path, guides, calendar, and news access.',
      features: [
        '7-level learning path',
        'TradingView setup guide',
        'Deriv demo guide',
        'Market news and alerts',
        'Portfolio analysis',
        'Community access',
      ],
    },
    {
      name: 'Pro Mentorship',
      price: 'Coming soon',
      description: 'Optional mentorship and live reviews (future offering).',
      features: ['Weekly live Q&A', 'Advanced trade reviews', 'Private community sessions'],
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Pricing</h1>
        <p className="text-gray-400 mb-10">
          The full platform is free today. Future premium options will be announced here.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {tiers.map(tier => (
            <div
              key={tier.name}
              className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6"
            >
              <div className="text-white font-semibold text-xl mb-1">{tier.name}</div>
              <div className="text-accent-gold text-2xl font-bold mb-3">{tier.price}</div>
              <div className="text-gray-400 mb-4">{tier.description}</div>
              <ul className="space-y-2 text-gray-300">
                {tier.features.map(feature => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <a href="/learning-path" className="text-royal-emerald font-semibold">
            Start the Learning Path
          </a>
        </div>
      </div>
    </div>
  )
}
