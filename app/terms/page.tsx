export const metadata = {
  title: 'Terms of Service | J Supreme Market Institute',
  description: 'Terms of service for using the J Supreme Market Institute platform.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Terms of Service</h1>
        <p className="text-gray-400 mb-8">
          By using this platform, you agree to these terms. This content is educational and does not
          constitute financial advice.
        </p>

        <div className="space-y-6">
          <section className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Educational Use</h2>
            <p className="text-gray-400">
              All materials are provided for education only. You are responsible for your trading
              decisions.
            </p>
          </section>
          <section className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">No Guarantees</h2>
            <p className="text-gray-400">
              Trading involves risk. Past performance is not indicative of future results.
            </p>
          </section>
          <section className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Platform Access</h2>
            <p className="text-gray-400">
              We may update or change platform features at any time to improve user experience.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
