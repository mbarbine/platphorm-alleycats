import { NextResponse } from 'next/server'
import { SITE_CONFIG, NEWS_CONTEXT, alleycatsZine } from '@/lib/zine-data'

export async function GET() {
  const baseUrl = `https://${SITE_CONFIG.domain}`
  
  const llmsIndex = {
    '@context': 'https://schema.org',
    '@type': 'WebAPI',
    name: SITE_CONFIG.name,
    version: SITE_CONFIG.version,
    description: 'Programmatic index for LLM discovery of Alleycats Alcove Zine',
    
    // Location metadata
    location: {
      city: SITE_CONFIG.geo.city,
      state: SITE_CONFIG.geo.state,
      country: SITE_CONFIG.geo.country,
      areaCode: SITE_CONFIG.areaCode,
      region: SITE_CONFIG.region,
      coordinates: SITE_CONFIG.geo.coordinates,
    },
    
    // Discovery endpoints
    endpoints: {
      llms_txt: `${baseUrl}/llms.txt`,
      llms_full: `${baseUrl}/llms-full.txt`,
      openapi: `${baseUrl}/api/docs`,
      mcp: `${baseUrl}/api/mcp`,
      rss: `${baseUrl}/feed.xml`,
      sitemap: `${baseUrl}/sitemap.xml`,
      robots: `${baseUrl}/robots.txt`,
      health: `${baseUrl}/api/health`,
      security: `${baseUrl}/.well-known/security.txt`,
      ai_plugin: `${baseUrl}/.well-known/ai-plugin.json`,
    },
    
    // API capabilities
    capabilities: {
      read: true,
      search: true,
      translate: false, // Coming soon via reader.platphormnews.com
      export: ['txt', 'html', 'json'],
      ascii: true, // Via ascii.platphormnews.com
    },
    
    // Current issue
    currentIssue: {
      number: alleycatsZine.issue,
      theme: alleycatsZine.theme,
      date: alleycatsZine.date,
      pageCount: alleycatsZine.pages.length,
      contributorCount: alleycatsZine.contributors.length,
    },
    
    // Next issue
    nextIssue: {
      number: NEWS_CONTEXT.nextIssue.number,
      theme: NEWS_CONTEXT.nextIssue.theme,
      deadline: NEWS_CONTEXT.nextIssue.deadline,
      releaseDate: NEWS_CONTEXT.nextIssue.releaseDate,
    },
    
    // Tags for discovery
    tags: NEWS_CONTEXT.tags,
    
    // Network integration
    network: {
      name: 'Platphorm News Network',
      ascii: 'https://ascii.platphormnews.com',
      reader: 'https://reader.platphormnews.com',
      mcp: 'https://mcp.platphormnews.com',
    },
    
    // Timestamps
    generated: new Date().toISOString(),
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  }
  
  return NextResponse.json(llmsIndex, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'X-Robots-Tag': 'index',
    },
  })
}
