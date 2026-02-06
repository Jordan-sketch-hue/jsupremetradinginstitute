import { notFound } from 'next/navigation'
import { articles } from '@/lib/articles'

export function generateMetadata({ params }: { params: { slug: string } }) {
  const article = articles.find(item => item.slug === params.slug)
  if (!article) return { title: 'Article Not Found | J Supreme Market Institute' }

  return {
    title: `${article.title} | J Supreme Market Institute`,
    description: article.excerpt,
  }
}

export default function BlogArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find(item => item.slug === params.slug)
  if (!article) notFound()

  return (
    <div className="min-h-screen bg-gradient-to-b from-matte-black via-royal-green/5 to-matte-black py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-royal-emerald/20 text-royal-emerald text-xs font-semibold rounded-full">
              {article.category}
            </span>
            <span className="text-gray-400 text-sm">{article.date}</span>
            <span className="text-gray-400 text-sm">• {article.readTime}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">{article.title}</h1>
          <p className="text-gray-300 text-lg mb-4">{article.excerpt}</p>
          <div className="text-gray-400 text-sm">By {article.author}</div>
          <div className="flex flex-wrap gap-2 mt-4">
            {article.tags.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-matte-black/60 border border-royal-green/30 text-gray-300 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          {article.sections.map(section => (
            <section
              key={section.heading}
              className="bg-matte-black/50 border border-royal-green/30 rounded-2xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-3">{section.heading}</h2>
              <p className="text-gray-300 leading-relaxed mb-4">{section.body}</p>
              {section.bullets && (
                <ul className="space-y-2 text-gray-300 list-disc list-inside">
                  {section.bullets.map(item => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <div className="mt-10 bg-gradient-to-r from-royal-green/30 to-royal-emerald/20 border border-royal-green/40 rounded-2xl p-6">
          <h3 className="text-2xl font-bold text-white mb-2">Ready to apply this?</h3>
          <p className="text-gray-300 mb-4">
            Follow the Trading Curriculum to build repeatable, institutional-grade execution.
          </p>
          <a
            href="/learning-path"
            className="inline-flex items-center gap-2 px-5 py-3 bg-royal-emerald text-white rounded-lg font-semibold hover:bg-royal-emerald/90 transition-colors"
          >
            Start Learning
          </a>
        </div>
      </div>
    </div>
  )
}
