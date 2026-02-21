import { NextRequest, NextResponse } from 'next/server'

const FOREX_FACTORY_RSS = 'https://nfs.faireconomy.media/ff_calendar_thisweek.xml'
const MYFXBOOK_CALENDAR = 'https://www.myfxbook.com/feeds/economiccalendar.xml'

function parseImpact(impact: string) {
  return impact.toLowerCase().includes('high') || impact.toLowerCase().includes('red')
}

function parseForexFactory(xml: string) {
  const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g)).map(match => match[1])
  return items.map(item => {
    const title = (item.match(/<title>(.*?)<\/title>/) || [])[1] || ''
    const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || ''
    const impact = (item.match(/<ff:impact>(.*?)<\/ff:impact>/) || [])[1] || ''
    const country = (item.match(/<ff:country>(.*?)<\/ff:country>/) || [])[1] || ''
    const event = (item.match(/<ff:event>(.*?)<\/ff:event>/) || [])[1] || ''
    return { title, pubDate, impact, country, event, source: 'ForexFactory' }
  })
}

function parseMyFXBook(xml: string) {
  const items = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g)).map(match => match[1])
  return items.map(item => {
    const title = (item.match(/<title>(.*?)<\/title>/) || [])[1] || ''
    const pubDate = (item.match(/<pubDate>(.*?)<\/pubDate>/) || [])[1] || ''
    // MyFXBook doesn't always have impact/country tags, so parse from title
    const impact = title.match(/\b(High|Medium|Low)\b/i)?.[1] || ''
    const country = title.match(/\b[A-Z]{2,}\b/)?.[0] || ''
    const event = title
      .replace(/\b(High|Medium|Low)\b/i, '')
      .replace(/\b[A-Z]{2,}\b/, '')
      .trim()
    return { title, pubDate, impact, country, event, source: 'MyFXBook' }
  })
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const source = searchParams.get('source') || 'forexfactory'
  try {
    let news = []
    if (source === 'myfxbook') {
      const response = await fetch(MYFXBOOK_CALENDAR)
      if (!response.ok) throw new Error('Failed to fetch MyFXBook news')
      const xml = await response.text()
      news = parseMyFXBook(xml)
    } else {
      const response = await fetch(FOREX_FACTORY_RSS)
      if (!response.ok) throw new Error('Failed to fetch ForexFactory news')
      const xml = await response.text()
      news = parseForexFactory(xml)
    }
    const highImpact = news.filter(n => parseImpact(n.impact))
    return NextResponse.json({ news: highImpact })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch or parse news' }, { status: 500 })
  }
}
