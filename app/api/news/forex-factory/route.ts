import { NextRequest, NextResponse } from 'next/server'

// Fetch high-impact news from ForexFactory (or MyFXBook in future)
// Only returns high-impact (red flag) events: CPI, NFP, Unemployment, etc.

const FOREX_FACTORY_RSS = 'https://nfs.faireconomy.media/ff_calendar_thisweek.xml'

function parseImpact(impact: string) {
  // ForexFactory: High = red, Medium = orange, Low = yellow
  return impact.toLowerCase().includes('high') || impact.toLowerCase().includes('red')
}

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(FOREX_FACTORY_RSS)
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch ForexFactory news' }, { status: 500 })
    }
    const xml = await response.text()
    // Parse XML (simple regex for demo; use xml2js or fast-xml-parser for production)
    const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g)).map(match => match[1])
    const news = items.map(item => {
      const title = (item.match(/<title>(.*?)<\/title>/) || [])[1] || ''
      const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || ''
      const impact = (item.match(/<ff:impact>(.*?)<\/ff:impact>/) || [])[1] || ''
      const country = (item.match(/<ff:country>(.*?)<\/ff:country>/) || [])[1] || ''
      const event = (item.match(/<ff:event>(.*?)<\/ff:event>/) || [])[1] || ''
      return { title, pubDate, impact, country, event }
    })
    // Filter for high-impact only
    const highImpact = news.filter(n => parseImpact(n.impact))
    return NextResponse.json({ news: highImpact })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch or parse news' }, { status: 500 })
  }
}
