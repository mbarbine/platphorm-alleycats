import { alleycatsZine, tableOfContents, contributors, SITE_CONFIG, zineMeta } from '@/lib/zine-data'

export async function GET() {
  const baseUrl = 'https://alleycats.platphormnews.com'
  
  const pagesContent = alleycatsZine.pages.map(page => `
### Page ${page.pageNumber}: ${page.title || 'Untitled'}
${page.author ? `**Author**: ${page.author}` : ''}
**Type**: ${page.type}

${page.content || '[Visual content - see zine reader]'}
`).join('\n---\n')

  const content = `# Alleycats Alcove Zine - Full Content
> A collaborative zine with substance
> Version: ${SITE_CONFIG.version}
> Location: ${SITE_CONFIG.location}

## Site Configuration
- Domain: ${SITE_CONFIG.domain}
- Name: ${SITE_CONFIG.name}
- Tagline: ${SITE_CONFIG.tagline}
- Meetup: ${SITE_CONFIG.meetup.day} ${SITE_CONFIG.meetup.time} at ${SITE_CONFIG.meetup.venue}

## Current Issue Details
- ID: ${alleycatsZine.id}
- Title: ${alleycatsZine.title}
- Subtitle: ${alleycatsZine.subtitle}
- Issue Number: ${alleycatsZine.issue}
- Date: ${alleycatsZine.date}
- Theme: ${alleycatsZine.theme}
- Total Pages: ${alleycatsZine.pages.length}

## Table of Contents
${tableOfContents.map(item => `${item.number}. "${item.title}" by ${item.author} (Page ${item.pageNumber})`).join('\n')}

## Contributors
${contributors.map(c => `### ${c.name}
- Pieces: ${c.pieces.join(', ')}
- Total contributions: ${c.pieces.length}`).join('\n\n')}

## Full Page Content
${pagesContent}

## Multilingual Support

### English (en-US)
- Title: ${zineMeta.en.title}
- Subtitle: ${zineMeta.en.subtitle}
- Tagline: ${zineMeta.en.tagline}
- Read Now: ${zineMeta.en.readNow}
- Download: ${zineMeta.en.download}

### Spanish (es-US)
- Title: ${zineMeta.es.title}
- Subtitle: ${zineMeta.es.subtitle}
- Tagline: ${zineMeta.es.tagline}
- Read Now: ${zineMeta.es.readNow}
- Download: ${zineMeta.es.download}

### French (fr-CA)
- Title: ${zineMeta.fr.title}
- Subtitle: ${zineMeta.fr.subtitle}
- Tagline: ${zineMeta.fr.tagline}
- Read Now: ${zineMeta.fr.readNow}
- Download: ${zineMeta.fr.download}

## API Reference

### Health Check
\`\`\`
GET ${baseUrl}/api/health
\`\`\`
Returns service health status and current issue info.

### Zine Data
\`\`\`
GET ${baseUrl}/api/v1/zine
\`\`\`
Returns full zine data including all pages and content.

### Contributors
\`\`\`
GET ${baseUrl}/api/v1/contributors
\`\`\`
Returns list of all contributors and their works.

### MCP Endpoint (AI Agents)
\`\`\`
GET ${baseUrl}/api/mcp
GET ${baseUrl}/api/mcp?section=currentIssue
POST ${baseUrl}/api/mcp
  Body: { "action": "getPage", "params": { "pageNumber": 1 } }
  Body: { "action": "getContributor", "params": { "name": "Sam" } }
  Body: { "action": "searchContent", "params": { "query": "cigarettes" } }
\`\`\`

## Reader Features
- Cinematic intro with parallax scrolling
- Premium e-reader interface
- Swipe/drag page navigation
- Reading modes: Dark, Sepia, Light
- Zoom controls
- Fullscreen mode
- Keyboard shortcuts:
  - Arrow Left/Right: Navigate pages
  - Space: Next page
  - F: Toggle fullscreen
  - Escape: Exit fullscreen/close dialogs
- Export formats: PDF, HTML, TXT, JSON

## Future Roadmap
- Multi-zine support for community onboarding
- Submission portal
- Print-on-demand integration
- More language support

## Community Zine Onboarding
This platform is designed to support multiple community zines.
Contact us for onboarding your community's zine.

Template configuration available at /lib/zine-data.ts

---
Generated: ${new Date().toISOString()}
${SITE_CONFIG.location}
Support local art. Support local artists.
`

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
