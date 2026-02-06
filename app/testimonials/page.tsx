export const metadata = {
  title: 'Success Stories | J Supreme Market Institute',
  description: 'Community wins, progress highlights, and learning milestones.',
}

export default function TestimonialsPage() {
  const stories = [
    {
      name: 'Alicia M.',
      title: 'Consistency after 90 days',
      quote:
        'The learning path forced me to slow down, focus on process, and stop overtrading. My results improved immediately.',
    },
    {
      name: 'Derrick S.',
      title: 'Risk control breakthrough',
      quote:
        'The risk and psychology modules changed how I approach every trade. I now respect my daily loss limit.',
    },
    {
      name: 'Kara T.',
      title: 'Structure and order blocks',
      quote:
        'Seeing order blocks in context with market structure made everything click. The charts finally make sense.',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-4">Success Stories</h1>
        <p className="text-gray-400 mb-10">
          Real learning milestones from traders progressing through the program. Results vary by
          effort, discipline, and adherence to risk management.
        </p>

        <div className="space-y-6">
          {stories.map(story => (
            <div
              key={story.name}
              className="bg-matte-black/50 border border-royal-green/30 rounded-xl p-6"
            >
              <div className="text-white font-semibold text-lg mb-1">{story.title}</div>
              <div className="text-gray-400 text-sm mb-3">{story.name}</div>
              <p className="text-gray-300">{story.quote}</p>
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
