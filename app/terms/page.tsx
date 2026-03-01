export const metadata = {
  title: 'Terms of Service | J Supreme Market Institute',
  description: 'Terms of service for using the J Supreme Market Institute platform.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black">
      <div className="section-container max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-playfair font-bold text-gradient mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-400 mb-8 font-inter">
            By using this platform, you agree to these terms. This content is educational and does
            not constitute financial advice.
          </p>
        </header>
        <section className="space-y-6">
          <article className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2 font-playfair">Educational Use</h2>
            <p className="text-gray-400 font-inter">
              All materials are provided for education only. You are responsible for your trading
              decisions.
            </p>
          </article>
          <article className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2 font-playfair">No Guarantees</h2>
            <p className="text-gray-400 font-inter">
              Trading involves risk. Past performance is not indicative of future results.
            </p>
          </article>
          <article className="glass-effect rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2 font-playfair">Platform Access</h2>
            <p className="text-gray-400 font-inter">
              We may update or change platform features at any time to improve user experience.
            </p>
          </article>
        </section>
      </div>
    </main>
  )
}
