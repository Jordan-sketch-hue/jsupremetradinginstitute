import { NextResponse } from 'next/server'
import { getLiveFailureReport } from '@/lib/marketDataProvider'

export async function GET() {
  const report = getLiveFailureReport(200)

  return NextResponse.json({
    count: report.length,
    generatedAt: new Date().toISOString(),
    entries: report,
  })
}
