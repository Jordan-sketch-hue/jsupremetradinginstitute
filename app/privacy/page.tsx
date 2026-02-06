export const metadata = {
  title: 'Privacy Policy | J Supreme Market Institute',
  description: 'Privacy policy and data handling practices.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">
          We respect your privacy and collect only the information needed to operate the platform.
        </p>

        <div className="space-y-6">
          <section className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Information We Collect</h2>
            <p className="text-gray-400">
              Newsletter email addresses (if you choose to subscribe). No payment data is collected.
            </p>
          </section>
          <section className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">How We Use Data</h2>
            <p className="text-gray-400">
              To deliver updates and educational content. We do not sell your data to third parties.
            </p>
          </section>
          <section className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Contact</h2>
            <p className="text-gray-400">Questions about privacy? Email us at info@jsupreme.com.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
