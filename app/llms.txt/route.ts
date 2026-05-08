import { alleycatsZine, tableOfContents, contributors, SITE_CONFIG } from '@/lib/zine-data'

export async function GET() {
  const baseUrl = 'https://alleycats.platphormnews.com'
  
  const content = `# Alleycats Alcove Zine
> A collaborative zine with substance - Supporting local artists
> Location: ${SITE_CONFIG.location}

## Overview
Alleycats Alcove is an independent literary zine created by the Writer's Alcove, 
a local writing group that meets Friday evenings before Karaoke. The zine features 
creative writing, poetry, and art from local artists.

## Current Issue
- **Issue**: #${alleycatsZine.issue}
- **Date**: ${alleycatsZine.date}
- **Theme**: "${alleycatsZine.theme}"
- **Pages**: ${alleycatsZine.pages.length}
- **Contributors**: ${contributors.length}

## Table of Contents
${tableOfContents.map(item => `${item.number}. "${item.title}" by ${item.author} (p.${item.pageNumber})`).join('\n')}

## Contributors
${contributors.map(c => `- ${c.name}: ${c.pieces.join(', ')}`).join('\n')}

## Features
- Premium interactive digital zine reader
- Cinematic intro experience
- Swipe/drag navigation between pages
- Multiple reading modes (Dark, Sepia, Light)
- Multiple export formats (PDF, Text, HTML, JSON)
- Fullscreen immersive mode
- Mobile-first responsive design
- Keyboard navigation (arrows, space, F for fullscreen)
- Progress tracking

## Languages
- English (en-US) - Primary
- Spanish (es-US)
- French (fr-CA)

## Submission Info
- Next Theme: "Wildest Dreams"
- Deadline: May 15th
- Submit to: Writer's Alcove (${SITE_CONFIG.meetup.day} ${SITE_CONFIG.meetup.time})

## Credits
- Cover Art: Sam Rusnak
- Zine Production Guidance: Chris Kemp

## API Endpoints
- Health Check: ${baseUrl}/api/health
- Zine Data: ${baseUrl}/api/v1/zine
- Contributors: ${baseUrl}/api/v1/contributors
- MCP (AI): ${baseUrl}/api/mcp

## Quick Links
- Website: ${baseUrl}
- Direct Reader: ${baseUrl}?read=true
- RSS Feed: ${baseUrl}/feed.xml
- Full LLM Data: ${baseUrl}/llms-full.txt

## Open Source
This project is designed to onboard community zines.
See /api/mcp for machine-readable data.

## Location
${SITE_CONFIG.location}

---
Support local art. Support local artists.
v${SITE_CONFIG.version}
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
