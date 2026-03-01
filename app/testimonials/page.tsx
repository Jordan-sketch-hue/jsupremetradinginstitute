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
    <main className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black">
      <div className="section-container max-w-4xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-playfair font-bold text-gradient mb-4">Success Stories</h1>
          <p className="text-lg text-gray-400 mb-10 font-inter">
            Real learning milestones from traders progressing through the program. Results vary by
            effort, discipline, and adherence to risk management.
          </p>
        </header>
        <section className="space-y-6">
          {stories.map(story => (
            <article key={story.name} className="glass-effect rounded-xl p-6">
              <h2 className="text-white font-semibold text-lg mb-1 font-playfair">{story.title}</h2>
              <div className="text-gray-400 text-sm mb-3 font-inter">{story.name}</div>
              <p className="text-gray-300 font-inter">{story.quote}</p>
            </article>
          ))}
        </section>
        <footer className="mt-10 text-center">
          <a href="/learning-path" className="btn-primary">
            Start the Learning Path
          </a>
        </footer>
      </div>
    </main>
  )
}
