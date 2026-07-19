import { NextResponse } from 'next/server'
import { GET as getLegacyHealth } from '../../health/route'

export async function GET() {
  const legacyResponse = await getLegacyHealth()
  const data = await legacyResponse.json()

  return NextResponse.json({ ok: true, data }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': 'noindex',
    },
  })
}
