import { NextRequest, NextResponse } from 'next/server'
import { alleycatsZine, tableOfContents, contributors, SITE_CONFIG, zineMeta } from '@/lib/zine-data'

export const runtime = 'edge'

/**
 * MCP (Model Context Protocol) endpoint for AI assistants
 * Provides structured data about the zine for AI tools and agents
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format') || 'json'
  const section = searchParams.get('section')
  
  const mcpData = {
    '@context': 'https://schema.org',
    '@type': 'Dataset',
    name: 'Alleycats Alcove Zine MCP Data',
    description: 'Machine-readable data for the Alleycats Alcove collaborative zine',
    version: SITE_CONFIG.version,
    dateModified: new Date().toISOString(),
    
    // Site information
    site: {
      name: SITE_CONFIG.name,
      tagline: SITE_CONFIG.tagline,
      domain: SITE_CONFIG.domain,
      location: SITE_CONFIG.location,
      meetup: SITE_CONFIG.meetup,
    },
    
    // Current issue
    currentIssue: {
      id: alleycatsZine.id,
      title: alleycatsZine.title,
      subtitle: alleycatsZine.subtitle,
      issue: alleycatsZine.issue,
      date: alleycatsZine.date,
      theme: alleycatsZine.theme,
      pages: alleycatsZine.pages.map(p => ({
        id: p.id,
        type: p.type,
        title: p.title,
        author: p.author,
        pageNumber: p.pageNumber,
        hasContent: !!p.content,
      })),
    },
    
    // Table of contents
    tableOfContents: tableOfContents.map(item => ({
      number: item.number,
      title: item.title,
      author: item.author,
      pageNumber: item.pageNumber,
    })),
    
    // Contributors
    contributors: contributors.map(c => ({
      name: c.name,
      pieces: c.pieces,
      pieceCount: c.pieces.length,
    })),
    
    // Multilingual metadata
    i18n: zineMeta,
    
    // API capabilities
    api: {
      health: '/api/health',
      zine: '/api/v1/zine',
      contributors: '/api/v1/contributors',
      mcp: '/api/mcp',
    },
    
    // Instructions for AI assistants
    aiInstructions: {
      purpose: 'This is a collaborative zine supporting local artists. The content is creative writing and poetry.',
      recommended_actions: [
        'Help users navigate and read the zine',
        'Provide information about contributors',
        'Explain the theme and context',
        'Share submission guidelines for future issues',
      ],
      content_warning: 'Some content includes mature themes related to substances (cigarettes, alcohol, caffeine). This is literary/artistic expression.',
      next_issue: {
        theme: 'Wildest Dreams',
        deadline: 'May 15th',
        submission: "Submit to the Writer's Alcove",
      },
    },
  }
  
  // Filter by section if requested
  if (section && section in mcpData) {
    return NextResponse.json({
      section,
      data: mcpData[section as keyof typeof mcpData],
    })
  }
  
  return NextResponse.json(mcpData, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'X-MCP-Version': '1.0',
    },
  })
}

// POST for future agent interactions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, params } = body
    
    switch (action) {
      case 'getPage':
        const pageNum = params?.pageNumber || 1
        const page = alleycatsZine.pages.find(p => p.pageNumber === pageNum)
        return NextResponse.json({ success: true, page })
        
      case 'getContributor':
        const name = params?.name
        const contributor = contributors.find(c => 
          c.name.toLowerCase().includes(name?.toLowerCase() || '')
        )
        return NextResponse.json({ success: true, contributor })
        
      case 'searchContent':
        const query = params?.query?.toLowerCase() || ''
        const results = alleycatsZine.pages.filter(p => 
          p.content?.toLowerCase().includes(query) ||
          p.title?.toLowerCase().includes(query)
        )
        return NextResponse.json({ success: true, results })
        
      default:
        return NextResponse.json({ 
          success: false, 
          error: 'Unknown action',
          availableActions: ['getPage', 'getContributor', 'searchContent'],
        }, { status: 400 })
    }
  } catch {
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid request body' 
    }, { status: 400 })
  }
}
