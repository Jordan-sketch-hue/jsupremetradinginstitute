import { NextResponse } from 'next/server'
import { getLiveFailureReport } from '@/lib/marketDataProvider'

export async function GET() {
  const report = getLiveFailureReport(200)
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA || 'local'
  const commitShort = commitSha === 'local' ? 'local' : commitSha.slice(0, 7)
  const environment = process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown'
  const deploymentUrl = process.env.VERCEL_URL || ''

  return NextResponse.json({
    count: report.length,
    generatedAt: new Date().toISOString(),
    deployment: {
      commitSha,
      commitShort,
      environment,
      url: deploymentUrl,
    },
    entries: report,
  })
}
