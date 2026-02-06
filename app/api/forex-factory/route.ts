import { NextResponse } from 'next/server'
import { XMLParser } from 'fast-xml-parser'

const FEED_URL = 'https://nfs.faireconomy.media/ff_calendar_thisweek.xml'

const impactMap: Record<string, 'high' | 'medium' | 'low'> = {
  High: 'high',
  Medium: 'medium',
  Low: 'low',
}

function normalizeEvent(event: any) {
  const impact = impactMap[event.impact] || 'low'
  return {
    title: event.title || 'Market Event',
    country: event.country || 'Global',
    date: event.date || '',
    time: event.time || '',
    impact,
    forecast: event.forecast || '',
    previous: event.previous || '',
    actual: event.actual || '',
  }
}

export async function GET() {
  try {
    const res = await fetch(FEED_URL, { next: { revalidate: 300 } })
    if (!res.ok) {
      return NextResponse.json({ events: [] }, { status: 200 })
    }

    const xml = await res.text()
    const parser = new XMLParser({ ignoreAttributes: false })
    const json = parser.parse(xml)
    const rawEvents = json?.calendar?.event

    const eventsArray = Array.isArray(rawEvents) ? rawEvents : rawEvents ? [rawEvents] : []
    const events = eventsArray.map(normalizeEvent)

    return NextResponse.json({ events }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ events: [] }, { status: 200 })
  }
}
