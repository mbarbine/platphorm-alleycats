import { NextResponse } from 'next/server'
import { alleycatsZine, tableOfContents, contributors, SITE_CONFIG } from '@/lib/zine-data'

export const runtime = 'edge'

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      site: SITE_CONFIG,
      zine: {
        id: alleycatsZine.id,
        title: alleycatsZine.title,
        subtitle: alleycatsZine.subtitle,
        issue: alleycatsZine.issue,
        date: alleycatsZine.date,
        theme: alleycatsZine.theme,
        coverImage: alleycatsZine.coverImage,
        pageCount: alleycatsZine.pages.length,
        pages: alleycatsZine.pages.map(p => ({
          id: p.id,
          type: p.type,
          title: p.title,
          author: p.author,
          pageNumber: p.pageNumber,
          image: p.image,
          contentPreview: p.content?.substring(0, 200) + (p.content && p.content.length > 200 ? '...' : ''),
        })),
      },
      tableOfContents,
      contributors: contributors.map(c => ({
        name: c.name,
        pieces: c.pieces,
      })),
      meta: {
        exportedAt: new Date().toISOString(),
        source: SITE_CONFIG.domain,
        location: SITE_CONFIG.location,
        version: SITE_CONFIG.version,
      },
    },
  }, {
    headers: {
      'Cache-Control': 'public, max-age=3600',
    },
  })
}
