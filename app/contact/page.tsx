export const metadata = {
  title: 'Contact | J Supreme Market Institute',
  description: 'Get in touch for support, partnerships, or community access.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Contact</h1>
        <p className="text-gray-400 mb-8">
          For support, partnerships, or questions about the curriculum, reach out below.
        </p>

        <div className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Email</h2>
          <p className="text-gray-400 mb-4">We respond within 24-48 hours.</p>
          <a href="mailto:info@jsupreme.com" className="text-royal-emerald font-semibold">
            info@jsupreme.com
          </a>
        </div>

        <div className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-2">Community</h2>
          <p className="text-gray-400 mb-4">
            Join the community for updates, trade reviews, and live sessions.
          </p>
          <a href="/community" className="text-royal-emerald font-semibold">
            Go to Community
          </a>
        </div>
      </div>
    </div>
  )
}
