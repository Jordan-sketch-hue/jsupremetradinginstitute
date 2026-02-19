import { NextRequest, NextResponse } from 'next/server'
import { getHourlyBestTrades, formatHourlyUpdateForTelegram } from '@/lib/hourlyBestTrades'
import { sendTelegramUpdate } from '@/lib/telegramNotifier'

export async function GET(request: NextRequest) {
  const secret = request.headers.get('x-cron-secret')
  const expected = process.env.CRON_SECRET

  if (expected && secret !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const hourly = await getHourlyBestTrades()
    const message = formatHourlyUpdateForTelegram(hourly)
    const sent = await sendTelegramUpdate(message)

    return NextResponse.json({
      ok: true,
      sent,
      timestamp: hourly.timestamp,
      topTrades: hourly.topTrades.length,
    })
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
