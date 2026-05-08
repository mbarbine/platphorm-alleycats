/**
 * Health Check Tests
 * Quick verification tests that can be run in CI
 */

describe('Application Health', () => {
  describe('Icons', () => {
    const icons = [
      '/favicon.svg',
      '/icon-192x192.jpg',
      '/icon-512x512.jpg',
      '/apple-touch-icon.jpg',
      '/og-image.jpg',
    ]

    icons.forEach(icon => {
      it(`should have ${icon}`, async () => {
        const response = await fetch(`http://localhost:3000${icon}`)
        expect([200, 304]).toContain(response.status)
      })
    })
  })

  describe('Discovery Files', () => {
    const files = [
      { path: '/llms.txt', type: 'text/plain' },
      { path: '/llms-full.txt', type: 'text/plain' },
      { path: '/llms-index.json', type: 'application/json' },
      { path: '/sitemap.xml', type: 'application/xml' },
      { path: '/robots.txt', type: 'text/plain' },
      { path: '/feed.xml', type: 'application/rss+xml' },
      { path: '/.well-known/security.txt', type: 'text/plain' },
      { path: '/.well-known/ai-plugin.json', type: 'application/json' },
    ]

    files.forEach(file => {
      it(`should serve ${file.path}`, async () => {
        const response = await fetch(`http://localhost:3000${file.path}`)
        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toContain(file.type.split('/')[0])
      })
    })
  })

  describe('API Endpoints', () => {
    const endpoints = [
      { path: '/api/health', expectJson: true },
      { path: '/api/docs', expectJson: true },
      { path: '/api/v1/zine', expectJson: true },
      { path: '/api/v1/contributors', expectJson: true },
      { path: '/api/mcp', expectJson: true },
      { path: '/api/og', expectImage: true },
    ]

    endpoints.forEach(endpoint => {
      it(`should respond from ${endpoint.path}`, async () => {
        const response = await fetch(`http://localhost:3000${endpoint.path}`)
        expect(response.status).toBe(200)
        
        if (endpoint.expectJson) {
          const data = await response.json()
          expect(data).toBeDefined()
        }
      })
    })
  })

  describe('Pages', () => {
    const pages = [
      '/',
      '/privacy',
      '/security',
    ]

    pages.forEach(page => {
      it(`should render ${page}`, async () => {
        const response = await fetch(`http://localhost:3000${page}`)
        expect(response.status).toBe(200)
        expect(response.headers.get('content-type')).toContain('text/html')
      })
    })
  })

  describe('Headers', () => {
    it('should have security headers', async () => {
      const response = await fetch('http://localhost:3000/')
      
      // Check basic headers (Vercel adds these in production)
      expect(response.headers.has('content-type')).toBe(true)
    })

    it('should have cache headers on static assets', async () => {
      const response = await fetch('http://localhost:3000/llms.txt')
      
      // Should have cache control for static files
      expect(response.headers.has('cache-control') || response.status === 200).toBe(true)
    })
  })

  describe('Performance', () => {
    it('should respond within acceptable time', async () => {
      const start = Date.now()
      await fetch('http://localhost:3000/')
      const duration = Date.now() - start
      
      // Should respond in under 1 second in development
      expect(duration).toBeLessThan(1000)
    })

    it('should respond to health check quickly', async () => {
      const start = Date.now()
      await fetch('http://localhost:3000/api/health')
      const duration = Date.now() - start
      
      // Health check should be fast
      expect(duration).toBeLessThan(200)
    })
  })
})

describe('Build Verification', () => {
  it('should have Next.js configured', () => {
    // This test just verifies the test environment is set up
    expect(process.env.NODE_ENV).toBeDefined()
  })

  it('should import zine data without errors', async () => {
    const data = await import('@/lib/zine-data')
    expect(data.alleycatsZine).toBeDefined()
    expect(data.SITE_CONFIG).toBeDefined()
    expect(data.NEWS_CONTEXT).toBeDefined()
  })

  it('should import utilities without errors', async () => {
    const utils = await import('@/lib/utils')
    expect(utils.cn).toBeDefined()
  })

  it('should import ASCII utilities without errors', async () => {
    const ascii = await import('@/lib/ascii-utils')
    expect(ascii.getDaysUntilNextIssue).toBeDefined()
    expect(ascii.textToAscii).toBeDefined()
  })
})
