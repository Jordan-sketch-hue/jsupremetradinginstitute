export const metadata = {
  title: 'Refund Policy | J Supreme Market Institute',
  description: 'Refund policy for platform services and programs.',
}

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Refund Policy</h1>
        <p className="text-gray-400 mb-8">
          This platform is currently free to use. If paid services are introduced later, the policy
          will be updated here.
        </p>

        <div className="space-y-6">
          <section className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Current Status</h2>
            <p className="text-gray-400">
              All education resources are provided at no cost. No refunds are required at this time.
            </p>
          </section>
          <section className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6">
            <h2 className="text-xl font-bold text-white mb-2">Future Services</h2>
            <p className="text-gray-400">
              If paid offerings are added, refund terms will be published with clear eligibility
              rules.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
