import { MetadataRoute } from 'next'

const baseUrl = 'https://alleycats.platphormnews.com'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/internal/', '/_next/', '/admin/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
      },
      {
        userAgent: 'Bingbot',
        allow: '/',
      },
      // AI crawlers - allow for AEO (Answer Engine Optimization)
      {
        userAgent: 'GPTBot',
        allow: ['/llms.txt', '/llms-full.txt', '/api/v1/', '/'],
      },
      {
        userAgent: 'ChatGPT-User',
        allow: ['/llms.txt', '/llms-full.txt', '/api/v1/', '/'],
      },
      {
        userAgent: 'Claude-Web',
        allow: ['/llms.txt', '/llms-full.txt', '/api/v1/', '/'],
      },
      {
        userAgent: 'Anthropic-AI',
        allow: ['/llms.txt', '/llms-full.txt', '/api/v1/', '/'],
      },
      {
        userAgent: 'PerplexityBot',
        allow: ['/llms.txt', '/llms-full.txt', '/api/v1/', '/'],
      },
      {
        userAgent: 'Cohere-AI',
        allow: ['/llms.txt', '/llms-full.txt', '/api/v1/', '/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
