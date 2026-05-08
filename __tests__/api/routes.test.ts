/**
 * API Route Tests
 * Tests all API endpoints for correct responses
 */

describe('API Routes', () => {
  const baseUrl = 'http://localhost:3000'

  describe('GET /api/health', () => {
    it('should return 200 with health status', async () => {
      const response = await fetch(`${baseUrl}/api/health`)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('status', 'ok')
      expect(data).toHaveProperty('version')
      expect(data).toHaveProperty('timestamp')
    })
  })

  describe('GET /api/docs', () => {
    it('should return OpenAPI 3.1 specification', async () => {
      const response = await fetch(`${baseUrl}/api/docs`)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('openapi', '3.1.0')
      expect(data).toHaveProperty('info')
      expect(data.info).toHaveProperty('title', 'Alleycats Alcove Zine API')
      expect(data).toHaveProperty('paths')
    })
  })

  describe('GET /api/v1/zine', () => {
    it('should return zine metadata', async () => {
      const response = await fetch(`${baseUrl}/api/v1/zine`)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('title')
      expect(data).toHaveProperty('issue')
      expect(data).toHaveProperty('pages')
      expect(Array.isArray(data.pages)).toBe(true)
    })
  })

  describe('GET /api/v1/contributors', () => {
    it('should return contributors array', async () => {
      const response = await fetch(`${baseUrl}/api/v1/contributors`)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(Array.isArray(data.contributors)).toBe(true)
      expect(data.contributors.length).toBeGreaterThan(0)
    })
  })

  describe('GET /api/mcp', () => {
    it('should return MCP server info', async () => {
      const response = await fetch(`${baseUrl}/api/mcp`)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('name')
      expect(data).toHaveProperty('version')
      expect(data).toHaveProperty('tools')
    })
  })

  describe('GET /api/og', () => {
    it('should return PNG image', async () => {
      const response = await fetch(`${baseUrl}/api/og`)
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('image/png')
    })

    it('should support countdown variant', async () => {
      const response = await fetch(`${baseUrl}/api/og?variant=countdown`)
      expect(response.status).toBe(200)
    })

    it('should support ascii variant', async () => {
      const response = await fetch(`${baseUrl}/api/og?variant=ascii`)
      expect(response.status).toBe(200)
    })
  })
})

describe('Discovery Routes', () => {
  const baseUrl = 'http://localhost:3000'

  describe('GET /llms.txt', () => {
    it('should return plain text', async () => {
      const response = await fetch(`${baseUrl}/llms.txt`)
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('text/plain')
    })
  })

  describe('GET /llms-full.txt', () => {
    it('should return detailed LLM context', async () => {
      const response = await fetch(`${baseUrl}/llms-full.txt`)
      expect(response.status).toBe(200)
    })
  })

  describe('GET /llms-index.json', () => {
    it('should return JSON index', async () => {
      const response = await fetch(`${baseUrl}/llms-index.json`)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('endpoints')
      expect(data).toHaveProperty('capabilities')
    })
  })

  describe('GET /feed.xml', () => {
    it('should return valid RSS', async () => {
      const response = await fetch(`${baseUrl}/feed.xml`)
      expect(response.status).toBe(200)
      expect(response.headers.get('content-type')).toContain('application/rss+xml')
    })
  })

  describe('GET /sitemap.xml', () => {
    it('should return XML sitemap', async () => {
      const response = await fetch(`${baseUrl}/sitemap.xml`)
      expect(response.status).toBe(200)
    })
  })

  describe('GET /robots.txt', () => {
    it('should return robots.txt', async () => {
      const response = await fetch(`${baseUrl}/robots.txt`)
      expect(response.status).toBe(200)
    })
  })

  describe('GET /.well-known/security.txt', () => {
    it('should return security contact info', async () => {
      const response = await fetch(`${baseUrl}/.well-known/security.txt`)
      expect(response.status).toBe(200)
      
      const text = await response.text()
      expect(text).toContain('Contact:')
      expect(text).toContain('Expires:')
    })
  })

  describe('GET /.well-known/ai-plugin.json', () => {
    it('should return AI plugin manifest', async () => {
      const response = await fetch(`${baseUrl}/.well-known/ai-plugin.json`)
      expect(response.status).toBe(200)
      
      const data = await response.json()
      expect(data).toHaveProperty('schema_version')
      expect(data).toHaveProperty('name_for_human')
      expect(data).toHaveProperty('api')
    })
  })
})
