import { NextRequest, NextResponse } from 'next/server'
import { alleycatsZine } from '@/lib/zine-data'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageNumber: string }> }
) {
  const { pageNumber } = await params
  const pageNum = parseInt(pageNumber, 10)
  
  if (isNaN(pageNum) || pageNum < 1 || pageNum > alleycatsZine.pages.length) {
    return NextResponse.json(
      { 
        error: 'Page not found',
        message: `Valid pages are 1-${alleycatsZine.pages.length}`,
      },
      { status: 404 }
    )
  }
  
  const page = alleycatsZine.pages.find(p => p.pageNumber === pageNum)
  
  if (!page) {
    return NextResponse.json(
      { error: 'Page not found' },
      { status: 404 }
    )
  }
  
  return NextResponse.json({
    page,
    zine: {
      title: alleycatsZine.title,
      issue: alleycatsZine.issue,
      totalPages: alleycatsZine.pages.length,
    },
    navigation: {
      previous: pageNum > 1 ? `/api/v1/zine/pages/${pageNum - 1}` : null,
      next: pageNum < alleycatsZine.pages.length ? `/api/v1/zine/pages/${pageNum + 1}` : null,
      first: '/api/v1/zine/pages/1',
      last: `/api/v1/zine/pages/${alleycatsZine.pages.length}`,
    },
  }, {
    headers: {
      'Cache-Control': 'public, max-age=86400',
      'X-Page-Number': String(pageNum),
      'X-Total-Pages': String(alleycatsZine.pages.length),
    },
  })
}
