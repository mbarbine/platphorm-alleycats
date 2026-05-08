/**
 * ZineReader Component Tests
 * Tests accessibility, interactions, and rendering
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Mock the zine-data module
jest.mock('@/lib/zine-data', () => ({
  alleycatsZine: {
    title: 'Alleycats Alcove',
    issue: 1,
    date: 'May 2026',
    theme: 'A Letter to A Substance',
    pages: [
      { id: '1', pageNumber: 1, type: 'cover', title: 'Cover', image: '/zine/cover.jpg' },
      { id: '2', pageNumber: 2, type: 'content', title: 'Introduction', content: 'Test content', image: '/zine/intro.jpg' },
    ],
    contributors: ['Test Author'],
  },
  tableOfContents: [
    { id: '1', title: 'Cover', page: 1 },
    { id: '2', title: 'Introduction', page: 2 },
  ],
  SITE_CONFIG: {
    domain: 'alleycats.platphormnews.com',
    name: 'Alleycats Alcove',
  },
}))

// Mock use-preferences hook
jest.mock('@/lib/use-preferences', () => ({
  usePreferences: () => ({
    preferences: {
      readingMode: 'dark',
      lastPage: 0,
      zoom: 1,
      viewMode: 'both',
      isAsciiMode: false,
      imageRotation: 0,
      preferredLanguage: 'en',
      autoTranslate: false,
      hasSeenIntro: true,
      visitCount: 1,
      lastVisit: new Date().toISOString(),
    },
    updatePreference: jest.fn(),
    isLoaded: true,
  }),
}))

// Mock ascii-utils
jest.mock('@/lib/ascii-utils', () => ({
  getDaysUntilNextIssue: () => ({ days: 30, issueNumber: 2, date: '2026-06-06' }),
}))

describe('ZineReader Component', () => {
  const mockOnBack = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Accessibility', () => {
    it('should have main content landmark', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={mockOnBack} />)
      
      const main = screen.getByRole('main')
      expect(main).toBeInTheDocument()
      expect(main).toHaveAttribute('id', 'main-content')
    })

    it('should have accessible navigation buttons', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={mockOnBack} />)
      
      // Check for aria-labels on buttons
      const rotateButton = screen.getByRole('button', { name: /rotate/i })
      expect(rotateButton).toBeInTheDocument()
    })

    it('should have page indicators with aria-labels', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={mockOnBack} />)
      
      const pageButtons = screen.getAllByRole('button', { name: /go to page/i })
      expect(pageButtons.length).toBeGreaterThan(0)
    })
  })

  describe('Tooltips', () => {
    it('should show tooltip on hover for zoom buttons', async () => {
      const user = userEvent.setup()
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={mockOnBack} />)
      
      const zoomInButton = screen.getByRole('button', { name: /zoom in/i })
      await user.hover(zoomInButton)
      
      await waitFor(() => {
        expect(screen.getByRole('tooltip')).toBeInTheDocument()
      })
    })
  })

  describe('View Mode Toggle', () => {
    it('should render view mode buttons', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={mockOnBack} />)
      
      expect(screen.getByRole('button', { name: /show image and text/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /show image only/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /show text only/i })).toBeInTheDocument()
    })

    it('should indicate active view mode', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={mockOnBack} />)
      
      const bothButton = screen.getByRole('button', { name: /show image and text/i })
      expect(bothButton).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('Navigation', () => {
    it('should display current page number', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={mockOnBack} />)
      
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument() // total pages
    })

    it('should navigate with arrow keys', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={mockOnBack} />)
      
      fireEvent.keyDown(document, { key: 'ArrowRight' })
      // Page should advance
    })
  })

  describe('Theme Toggle', () => {
    it('should open theme menu on click', async () => {
      const user = userEvent.setup()
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={mockOnBack} />)
      
      const themeButton = screen.getByRole('button', { name: /change reading theme/i })
      await user.click(themeButton)
      
      await waitFor(() => {
        expect(screen.getByText('Theme')).toBeInTheDocument()
        expect(screen.getByText('dark')).toBeInTheDocument()
        expect(screen.getByText('sepia')).toBeInTheDocument()
        expect(screen.getByText('light')).toBeInTheDocument()
      })
    })
  })

  describe('Share Menu', () => {
    it('should show countdown to next issue', async () => {
      const user = userEvent.setup()
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={mockOnBack} />)
      
      const shareButton = screen.getByRole('button', { name: /share/i })
      await user.click(shareButton)
      
      await waitFor(() => {
        expect(screen.getByText(/days until issue/i)).toBeInTheDocument()
      })
    })
  })
})
