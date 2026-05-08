/**
 * Zine Data Tests
 * Tests for data integrity and structure
 */

describe('Zine Data', () => {
  describe('alleycatsZine', () => {
    it('should have required fields', async () => {
      const { alleycatsZine } = await import('@/lib/zine-data')
      
      expect(alleycatsZine.title).toBeDefined()
      expect(alleycatsZine.subtitle).toBeDefined()
      expect(alleycatsZine.issue).toBeDefined()
      expect(alleycatsZine.date).toBeDefined()
      expect(alleycatsZine.theme).toBeDefined()
      expect(alleycatsZine.pages).toBeDefined()
      expect(alleycatsZine.contributors).toBeDefined()
    })

    it('should have valid issue number', async () => {
      const { alleycatsZine } = await import('@/lib/zine-data')
      
      expect(alleycatsZine.issue).toBe(1)
      expect(typeof alleycatsZine.issue).toBe('number')
    })

    it('should have pages array', async () => {
      const { alleycatsZine } = await import('@/lib/zine-data')
      
      expect(Array.isArray(alleycatsZine.pages)).toBe(true)
      expect(alleycatsZine.pages.length).toBeGreaterThan(0)
    })

    it('should have valid page structure', async () => {
      const { alleycatsZine } = await import('@/lib/zine-data')
      
      alleycatsZine.pages.forEach((page, index) => {
        expect(page.id).toBeDefined()
        expect(page.pageNumber).toBe(index + 1)
        expect(page.type).toBeDefined()
        expect(['cover', 'content', 'back', 'toc', 'intro']).toContain(page.type)
      })
    })

    it('should have cover page first', async () => {
      const { alleycatsZine } = await import('@/lib/zine-data')
      
      expect(alleycatsZine.pages[0].type).toBe('cover')
    })

    it('should have back cover last', async () => {
      const { alleycatsZine } = await import('@/lib/zine-data')
      
      const lastPage = alleycatsZine.pages[alleycatsZine.pages.length - 1]
      expect(lastPage.type).toBe('back')
    })

    it('should have contributors array', async () => {
      const { alleycatsZine } = await import('@/lib/zine-data')
      
      expect(Array.isArray(alleycatsZine.contributors)).toBe(true)
      expect(alleycatsZine.contributors.length).toBeGreaterThan(0)
    })
  })

  describe('tableOfContents', () => {
    it('should have valid structure', async () => {
      const { tableOfContents } = await import('@/lib/zine-data')
      
      expect(Array.isArray(tableOfContents)).toBe(true)
      
      tableOfContents.forEach(item => {
        expect(item.id).toBeDefined()
        expect(item.number).toBeDefined()
        expect(item.title).toBeDefined()
        expect(item.author).toBeDefined()
        expect(item.page).toBeDefined()
      })
    })

    it('should have sequential numbers', async () => {
      const { tableOfContents } = await import('@/lib/zine-data')
      
      tableOfContents.forEach((item, index) => {
        expect(item.number).toBe(index + 1)
      })
    })
  })

  describe('SITE_CONFIG', () => {
    it('should have required fields', async () => {
      const { SITE_CONFIG } = await import('@/lib/zine-data')
      
      expect(SITE_CONFIG.domain).toBeDefined()
      expect(SITE_CONFIG.name).toBeDefined()
      expect(SITE_CONFIG.location).toBeDefined()
      expect(SITE_CONFIG.areaCode).toBeDefined()
      expect(SITE_CONFIG.region).toBeDefined()
      expect(SITE_CONFIG.geo).toBeDefined()
      expect(SITE_CONFIG.version).toBeDefined()
    })

    it('should have correct domain', async () => {
      const { SITE_CONFIG } = await import('@/lib/zine-data')
      
      expect(SITE_CONFIG.domain).toBe('alleycats.platphormnews.com')
    })

    it('should have valid geo coordinates', async () => {
      const { SITE_CONFIG } = await import('@/lib/zine-data')
      
      expect(SITE_CONFIG.geo.coordinates.lat).toBeCloseTo(38.918, 1)
      expect(SITE_CONFIG.geo.coordinates.lng).toBeCloseTo(-78.194, 1)
    })

    it('should be Front Royal, VA', async () => {
      const { SITE_CONFIG } = await import('@/lib/zine-data')
      
      expect(SITE_CONFIG.geo.city).toBe('Front Royal')
      expect(SITE_CONFIG.geo.state).toBe('VA')
      expect(SITE_CONFIG.areaCode).toBe('540')
    })
  })

  describe('NEWS_CONTEXT', () => {
    it('should have next issue info', async () => {
      const { NEWS_CONTEXT } = await import('@/lib/zine-data')
      
      expect(NEWS_CONTEXT.nextIssue).toBeDefined()
      expect(NEWS_CONTEXT.nextIssue.number).toBe(2)
      expect(NEWS_CONTEXT.nextIssue.theme).toBeDefined()
      expect(NEWS_CONTEXT.nextIssue.deadline).toBeDefined()
      expect(NEWS_CONTEXT.nextIssue.releaseDate).toBeDefined()
    })

    it('should have tags for discoverability', async () => {
      const { NEWS_CONTEXT } = await import('@/lib/zine-data')
      
      expect(Array.isArray(NEWS_CONTEXT.tags)).toBe(true)
      expect(NEWS_CONTEXT.tags.length).toBeGreaterThan(0)
      
      // Should include key local tags
      expect(NEWS_CONTEXT.tags).toContain('front-royal-va')
      expect(NEWS_CONTEXT.tags).toContain('shenandoah-valley')
      expect(NEWS_CONTEXT.tags).toContain('zine')
    })

    it('should have meeting info', async () => {
      const { NEWS_CONTEXT } = await import('@/lib/zine-data')
      
      expect(NEWS_CONTEXT.meetingInfo).toBeDefined()
      expect(NEWS_CONTEXT.meetingInfo.day).toBe('Friday')
    })
  })
})

describe('Data Consistency', () => {
  it('should have matching page count in TOC', async () => {
    const { alleycatsZine, tableOfContents } = await import('@/lib/zine-data')
    
    // TOC items should reference valid pages
    tableOfContents.forEach(item => {
      expect(item.page).toBeLessThanOrEqual(alleycatsZine.pages.length)
    })
  })

  it('should have unique page IDs', async () => {
    const { alleycatsZine } = await import('@/lib/zine-data')
    
    const ids = alleycatsZine.pages.map(p => p.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('should have unique TOC IDs', async () => {
    const { tableOfContents } = await import('@/lib/zine-data')
    
    const ids = tableOfContents.map(t => t.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })
})
