import { NextResponse } from 'next/server'
import { alleycatsZine, SITE_CONFIG, contributors, tableOfContents } from '@/lib/zine-data'

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

export async function GET() {
  const now = new Date()
  
  return NextResponse.json({
    status: 'healthy',
    timestamp: now.toISOString(),
    service: 'alleycats-alcove-zine',
    version: SITE_CONFIG.version,
    environment: process.env.NODE_ENV || 'development',
    region: process.env.VERCEL_REGION || 'unknown',
    
    // Current issue info
    currentIssue: {
      id: alleycatsZine.id,
      number: alleycatsZine.issue,
      title: alleycatsZine.title,
      subtitle: alleycatsZine.subtitle,
      date: alleycatsZine.date,
      theme: alleycatsZine.theme,
      pageCount: alleycatsZine.pages.length,
      contributorCount: contributors.length,
      pieceCount: tableOfContents.length,
    },
    
    // Site config
    site: {
      domain: SITE_CONFIG.domain,
      name: SITE_CONFIG.name,
      location: SITE_CONFIG.location,
      meetup: SITE_CONFIG.meetup,
    },
    
    // API capabilities
    capabilities: {
      reader: true,
      download: ['pdf', 'html', 'txt', 'json'],
      multilingual: ['en', 'es', 'fr'],
      readingModes: ['dark', 'sepia', 'light'],
    },
    
    // Endpoints
    endpoints: {
      health: '/api/health',
      zine: '/api/v1/zine',
      contributors: '/api/v1/contributors',
      mcp: '/api/mcp',
      llms: '/llms.txt',
      feed: '/feed.xml',
      sitemap: '/sitemap.xml',
    },
    
    // Future features placeholder
    roadmap: {
      multiZineSupport: 'planned',
      communityOnboarding: 'planned',
      submissionPortal: 'planned',
      printOnDemand: 'planned',
    },
  }, {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': 'noindex',
    },
  })
}
