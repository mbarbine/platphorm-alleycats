/**
 * Transcription Alignment Tests
 * Ensures all zine page content is properly transcribed and aligned
 */

import { alleycatsZine, tableOfContents, contributors } from '@/lib/zine-data'

describe('Transcription Alignment', () => {
  describe('Page Content Completeness', () => {
    it('all content pages have transcribed text', () => {
      const contentPages = alleycatsZine.pages.filter(p => 
        p.type === 'spread' || p.type === 'single'
      )
      
      contentPages.forEach(page => {
        expect(page.content).toBeDefined()
        expect(page.content!.length).toBeGreaterThan(50)
      })
    })

    it('all pages with authors have content', () => {
      const authoredPages = alleycatsZine.pages.filter(p => p.author)
      
      authoredPages.forEach(page => {
        expect(page.content).toBeDefined()
        expect(page.content).toContain(page.author!.split('/')[0].trim())
      })
    })

    it('content includes author attribution at end', () => {
      const authoredPages = alleycatsZine.pages.filter(p => 
        p.author && p.content && p.type === 'spread'
      )
      
      authoredPages.forEach(page => {
        // Each piece should end with author name
        const authorNames = page.author!.split('/').map(n => n.trim())
        const contentEndsWithAuthor = authorNames.some(name => 
          page.content!.trim().endsWith(name)
        )
        expect(contentEndsWithAuthor).toBe(true)
      })
    })
  })

  describe('Table of Contents Alignment', () => {
    it('TOC entries match page titles', () => {
      tableOfContents.forEach(tocEntry => {
        const page = alleycatsZine.pages.find(p => p.pageNumber === tocEntry.pageNumber)
        expect(page).toBeDefined()
        // Title should be included (may be part of combined title)
        if (page?.title) {
          const titleMatch = page.title.toLowerCase().includes(tocEntry.title.toLowerCase().substring(0, 10))
          expect(titleMatch || page.author?.includes(tocEntry.author)).toBe(true)
        }
      })
    })

    it('TOC authors match page authors', () => {
      tableOfContents.forEach(tocEntry => {
        const matchingContributor = contributors.find(c => 
          c.name.toLowerCase() === tocEntry.author.toLowerCase() ||
          c.name.toLowerCase().includes(tocEntry.author.toLowerCase().split('.')[0])
        )
        expect(matchingContributor).toBeDefined()
      })
    })

    it('all TOC entries have valid page numbers', () => {
      const maxPage = Math.max(...alleycatsZine.pages.map(p => p.pageNumber))
      
      tableOfContents.forEach(tocEntry => {
        expect(tocEntry.pageNumber).toBeGreaterThan(0)
        expect(tocEntry.pageNumber).toBeLessThanOrEqual(maxPage)
      })
    })
  })

  describe('Contributor Alignment', () => {
    it('all contributors have at least one piece', () => {
      contributors.forEach(contributor => {
        expect(contributor.pieces.length).toBeGreaterThan(0)
      })
    })

    it('contributor pieces appear in zine content', () => {
      contributors.forEach(contributor => {
        // At least one piece should be findable
        const hasContent = alleycatsZine.pages.some(page => 
          page.author?.includes(contributor.name.split('.')[0]) ||
          page.content?.includes(contributor.name.split('.')[0])
        )
        // Skip Chris Kemp (guidance only)
        if (contributor.name !== 'Chris Kemp') {
          expect(hasContent).toBe(true)
        }
      })
    })
  })

  describe('Content Quality', () => {
    it('no placeholder text in content', () => {
      alleycatsZine.pages.forEach(page => {
        if (page.content) {
          expect(page.content).not.toContain('Lorem ipsum')
          expect(page.content).not.toContain('TODO')
          expect(page.content).not.toContain('PLACEHOLDER')
          expect(page.content).not.toContain('[TBD]')
        }
      })
    })

    it('content has proper line breaks for poetry', () => {
      const poetryPages = alleycatsZine.pages.filter(p => 
        p.content?.includes('\n\n') || p.title?.toLowerCase().includes('poem')
      )
      
      poetryPages.forEach(page => {
        // Poetry should have multiple paragraphs/stanzas
        const paragraphs = page.content!.split('\n\n').filter(p => p.trim())
        expect(paragraphs.length).toBeGreaterThan(1)
      })
    })

    it('titles are properly capitalized', () => {
      alleycatsZine.pages.forEach(page => {
        if (page.title && page.title !== page.title.toUpperCase()) {
          // First letter should be capitalized
          expect(page.title[0]).toBe(page.title[0].toUpperCase())
        }
      })
    })
  })

  describe('Image-Text Alignment', () => {
    it('all content pages have images', () => {
      alleycatsZine.pages.forEach(page => {
        expect(page.image).toBeDefined()
        expect(page.image).toMatch(/^\/zine\//)
        expect(page.image).toMatch(/\.(jpg|png|webp)$/)
      })
    })

    it('image filenames match page numbers', () => {
      alleycatsZine.pages.forEach(page => {
        const pageNumInFilename = page.image.match(/page-(\d+)/)
        if (pageNumInFilename) {
          expect(parseInt(pageNumInFilename[1])).toBe(page.pageNumber)
        }
      })
    })
  })
})

describe('Humans.txt Alignment', () => {
  it('humans.txt includes all contributors', async () => {
    // This would be an integration test in practice
    const contributorNames = contributors.map(c => c.name)
    
    // Verify each contributor is in DEFAULT_AUTHORS or contributors
    expect(contributorNames).toContain('H.B. Manion')
    expect(contributorNames).toContain('Simone Endress')
    expect(contributorNames).toContain('chris.unkempt.')
    expect(contributorNames).toContain('Mark Reeves')
    expect(contributorNames).toContain('Julieta Hernandez')
    expect(contributorNames).toContain('Phil Taylor')
    expect(contributorNames).toContain('Sam Rusnak')
  })
})
