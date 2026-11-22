import { MetadataRoute } from 'next'

const baseUrl = 'https://alleycats.platphormnews.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const LASTMOD: Record<string, string> = {
    "/": "2026-05-08T16:23:22Z",
    "/feed.xml": "2026-05-08T16:23:22Z",
    "/humans.txt": "2026-05-08T16:23:22Z",
    "/llms-index.json": "2026-05-08T16:23:22Z",
    "/llms.txt": "2026-05-08T16:23:22Z",
    "/privacy": "2026-05-08T16:23:22Z",
    "/security": "2026-05-08T16:23:22Z",
  }
  const FALLBACK = '2026-05-08T16:23:22Z'
  const lm = (path: string) => LASTMOD[path] ?? FALLBACK
  return [
    {
      url: baseUrl,
      lastModified: lm('/'),
      changeFrequency: 'monthly',
      priority: 1.0,
      alternates: {
        languages: {
          'en-US': baseUrl,
          'es-US': `${baseUrl}?lang=es`,
          'fr-CA': `${baseUrl}?lang=fr`,
        },
      },
    },
    {
      url: `${baseUrl}/feed.xml`,
      lastModified: lm('/feed.xml'),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/llms.txt`,
      lastModified: lm('/llms.txt'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: lm('/privacy'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/security`,
      lastModified: lm('/security'),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/llms-index.json`,
      lastModified: lm('/llms-index.json'),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
    {
      url: `${baseUrl}/humans.txt`,
      lastModified: lm('/humans.txt'),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ]
}
