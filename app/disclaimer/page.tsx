export const metadata = {
  title: 'Risk Disclaimer | J Supreme Market Institute',
  description: 'Risk disclosure and educational disclaimer.',
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Risk Disclaimer</h1>
        <p className="text-gray-400 mb-8">
          Trading involves substantial risk and is not suitable for all investors. This platform is
          for educational purposes only.
        </p>

        <div className="space-y-6">
          <section className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">No Financial Advice</h2>
            <p className="text-gray-400">
              We do not provide investment, legal, or tax advice. You are responsible for your
              decisions.
            </p>
          </section>
          <section className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Performance Risk</h2>
            <p className="text-gray-400">
              Past performance is not indicative of future results. Losses can exceed deposits.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
