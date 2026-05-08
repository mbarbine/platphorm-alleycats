import { NextResponse } from 'next/server'
import { contributors, alleycatsZine } from '@/lib/zine-data'

export const runtime = 'edge'

export async function GET() {
  return NextResponse.json({
    issue: {
      number: alleycatsZine.issue,
      date: alleycatsZine.date,
      theme: alleycatsZine.theme,
    },
    contributors: contributors.map(c => ({
      name: c.name,
      pieces: c.pieces,
      pieceCount: c.pieces.length,
    })),
    total: contributors.length,
  }, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
