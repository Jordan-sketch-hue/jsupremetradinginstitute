import React, { useEffect, useState } from 'react'

interface NewsItem {
  title: string
  pubDate: string
  impact: string
  country: string
  event: string
}

export default function EconomicNewsSection() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/news/forex-factory')
      .then(res => res.json())
      .then(data => {
        setNews(data.news || [])
        setLoading(false)
      })
      .catch(err => {
        setError('Failed to load news')
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-4">Loading economic news...</div>
  if (error) return <div className="p-4 text-red-500">{error}</div>

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 mt-6">
      <h2 className="text-lg font-bold mb-2">High-Impact Economic News</h2>
      <ul className="divide-y divide-gray-200 dark:divide-zinc-700">
        {news.map((item, idx) => (
          <li
            key={idx}
            className="py-2 flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <span className="font-semibold text-blue-600 dark:text-blue-400 mr-2">
                {item.country}
              </span>
              <span className="font-semibold">{item.event}</span>
              <span className="ml-2 text-xs text-gray-500">({item.impact})</span>
            </div>
            <div className="text-xs text-gray-400 mt-1 md:mt-0">
              {new Date(item.pubDate).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
