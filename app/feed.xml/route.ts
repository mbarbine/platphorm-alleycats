import { alleycatsZine, tableOfContents, contributors, SITE_CONFIG, NEWS_CONTEXT } from '@/lib/zine-data'

// Calculate days until next issue (first Friday of each month)
function getDaysUntilNextIssue(): { days: number; date: string } {
  const now = new Date()
  const nextRelease = new Date(NEWS_CONTEXT.nextIssue.releaseDate)
  const diffTime = nextRelease.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return { days: Math.max(0, diffDays), date: nextRelease.toISOString() }
}

export async function GET() {
  const baseUrl = `https://${SITE_CONFIG.domain}`
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${alleycatsZine.title}</title>
    <link>${baseUrl}</link>
    <description>${alleycatsZine.subtitle} - ${SITE_CONFIG.location}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>Alleycats Alcove Zine v${SITE_CONFIG.version}</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
    <ttl>1440</ttl>
    
    <image>
      <url>${baseUrl}/og-image.jpg</url>
      <title>${alleycatsZine.title}</title>
      <link>${baseUrl}</link>
    </image>
    
    <item>
      <title>${alleycatsZine.title} - Issue #${alleycatsZine.issue}: ${alleycatsZine.theme}</title>
      <link>${baseUrl}</link>
      <description><![CDATA[
        <p><strong>Theme:</strong> "${alleycatsZine.theme}"</p>
        <p><strong>Date:</strong> ${alleycatsZine.date}</p>
        <p><strong>Contributors:</strong> ${contributors.map(c => c.name).join(', ')}</p>
        
        <h3>Table of Contents:</h3>
        <ol>
          ${tableOfContents.map(item => `<li><strong>${item.title}</strong> by ${item.author}</li>`).join('\n          ')}
        </ol>
        
        <p><a href="${baseUrl}?read=true">Read the full zine in our interactive reader</a></p>
        
        <h3>Next Issue</h3>
        <p><strong>Theme:</strong> "Wildest Dreams"</p>
        <p><strong>Deadline:</strong> May 15th</p>
        <p><strong>Submit to:</strong> Writer's Alcove (${SITE_CONFIG.meetup.day} ${SITE_CONFIG.meetup.time})</p>
      ]]></description>
      <pubDate>${new Date('2026-05-01').toUTCString()}</pubDate>
      <guid isPermaLink="true">${baseUrl}#issue-${alleycatsZine.issue}</guid>
      <dc:creator>Alleycats Alcove</dc:creator>
      ${NEWS_CONTEXT.tags.map(tag => `<category>${tag}</category>`).join('\n      ')}
    </item>
    
    <item>
      <title>Coming Soon: Issue #${NEWS_CONTEXT.nextIssue.number} - "${NEWS_CONTEXT.nextIssue.theme}"</title>
      <link>${baseUrl}#next-issue</link>
      <description><![CDATA[
        <p><strong>${getDaysUntilNextIssue().days} days until Issue #${NEWS_CONTEXT.nextIssue.number}!</strong></p>
        <p><strong>Theme:</strong> "${NEWS_CONTEXT.nextIssue.theme}"</p>
        <p><strong>Submission Deadline:</strong> ${NEWS_CONTEXT.nextIssue.deadline}</p>
        <p><strong>Release Date:</strong> First Friday, June 2026</p>
        <p>Submit your work to the Writer's Alcove (${SITE_CONFIG.meetup.day} ${SITE_CONFIG.meetup.time})</p>
        
        <h3>Recent News</h3>
        ${NEWS_CONTEXT.recentEvents.map(event => `
        <p><em>${event.date}:</em> ${event.headline}</p>
        <p>${event.relevance}</p>
        `).join('')}
        
        <h3>Related Links</h3>
        <ul>
          <li><a href="${SITE_CONFIG.ascii.endpoint}">ASCII Art Generator</a> - Convert text and images to ASCII art</li>
          <li><a href="${SITE_CONFIG.reader.endpoint}">Reader Platform</a> - Full reading experience</li>
          <li><a href="https://frontroyal.platphormnews.com">Front Royal Edition</a></li>
          <li><a href="https://zine540.platphormnews.com">Zine 540</a></li>
        </ul>
        
        <h3>Find Us</h3>
        <p><strong>Venue:</strong> ${SITE_CONFIG.meetup.venue}, ${SITE_CONFIG.meetup.location}</p>
        <p><strong>When:</strong> ${SITE_CONFIG.meetup.day} ${SITE_CONFIG.meetup.time}</p>
      ]]></description>
      <pubDate>${new Date().toUTCString()}</pubDate>
      <guid isPermaLink="false">alleycats-next-issue-${NEWS_CONTEXT.nextIssue.number}</guid>
      <category>upcoming</category>
      <category>submissions-open</category>
      <category>${NEWS_CONTEXT.nextIssue.theme.toLowerCase().replace(/\s+/g, '-')}</category>
    </item>
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
