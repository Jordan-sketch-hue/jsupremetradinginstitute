export const metadata = {
  title: 'About | J Supreme Market Institute',
  description: 'Learn about the mission and approach behind J Supreme Market Institute.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">About J Supreme Market Institute</h1>
        <p className="text-gray-400 mb-8">
          We teach institutional trading concepts in a clear, structured way so anyone can build a
          real, repeatable process. Our curriculum is built around liquidity, order blocks, market
          structure, and risk discipline.
        </p>

        <div className="space-y-6">
          <div className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-2">Mission</h2>
            <p className="text-gray-400">
              Provide a premium-quality, free education platform that transforms retail traders into
              disciplined, process-driven professionals.
            </p>
          </div>

          <div className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-2">Method</h2>
            <p className="text-gray-400">
              We focus on institutional footprints and probability stacking, not prediction.
              Students learn to wait for high-quality locations and execute with consistent risk
              management.
            </p>
          </div>

          <div className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-2">Community</h2>
            <p className="text-gray-400">
              Traders learn faster together. Join the community to share analysis, review setups,
              and build accountability.
            </p>
            <a href="/community" className="inline-flex mt-4 text-royal-emerald font-semibold">
              Visit Community
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
