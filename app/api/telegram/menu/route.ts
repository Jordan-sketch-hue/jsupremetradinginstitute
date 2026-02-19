import { NextRequest, NextResponse } from 'next/server'
import { sendTelegramUpdate } from '@/lib/telegramNotifier'
import { getMainMenuKeyboard } from '@/lib/telegramMenuHandler'

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-menu-secret')
  const expected = process.env.TELEGRAM_MENU_SECRET

  if (expected && secret !== expected) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const sent = await sendTelegramUpdate('🤖 **Bot Menu**\nChoose an option:', {
    replyMarkup: getMainMenuKeyboard(),
  })

  return NextResponse.json({ ok: sent })
}
