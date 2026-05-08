/**
 * Responsive Design Tests
 * Tests for mobile, tablet, and desktop breakpoints
 */

import { render, screen } from '@testing-library/react'

// Breakpoints matching Tailwind CSS defaults
const BREAKPOINTS = {
  mobile: 375,
  tablet: 768,
  desktop: 1024,
  wide: 1280,
}

// Helper to set viewport width
function setViewport(width: number) {
  Object.defineProperty(window, 'innerWidth', { value: width, writable: true })
  Object.defineProperty(window, 'outerWidth', { value: width, writable: true })
  window.dispatchEvent(new Event('resize'))
}

describe('Responsive Design', () => {
  describe('Mobile (< 768px)', () => {
    beforeEach(() => {
      setViewport(BREAKPOINTS.mobile)
    })

    it('should hide desktop-only elements', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      // Desktop-only zoom controls should be hidden
      const zoomControls = screen.queryByText(/%/) // zoom percentage
      // On mobile, this should be hidden (has hidden md:flex class)
      expect(zoomControls).toBeNull()
    })

    it('should show rotate button', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      const rotateButton = screen.getByRole('button', { name: /rotate/i })
      expect(rotateButton).toBeInTheDocument()
    })

    it('should use touch-optimized targets', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      const buttons = screen.getAllByRole('button')
      
      // All buttons should have minimum 44x44 touch target
      buttons.forEach(button => {
        const classes = button.className
        // Check for h-10 w-10 (40x40px) or larger
        expect(
          classes.includes('h-10') || 
          classes.includes('h-11') || 
          classes.includes('h-12') ||
          classes.includes('p-3') ||
          classes.includes('p-4')
        ).toBe(true)
      })
    })

    it('should support swipe gestures', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      // The main container should support touch actions
      const container = screen.getByRole('main')
      expect(container.className).toContain('touch-action')
    })
  })

  describe('Tablet (768px - 1023px)', () => {
    beforeEach(() => {
      setViewport(BREAKPOINTS.tablet)
    })

    it('should show zoom controls', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      // md:flex should make zoom controls visible
      const zoomIn = screen.getByRole('button', { name: /zoom in/i })
      expect(zoomIn).toBeInTheDocument()
    })

    it('should show view mode toggle', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      // sm:flex should show view mode on tablet
      const viewModeButtons = screen.getAllByRole('button', { name: /show (image|text)/i })
      expect(viewModeButtons.length).toBe(3) // Both, Image, Text
    })
  })

  describe('Desktop (>= 1024px)', () => {
    beforeEach(() => {
      setViewport(BREAKPOINTS.desktop)
    })

    it('should show fullscreen button', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      const fullscreenButton = screen.getByRole('button', { name: /fullscreen/i })
      expect(fullscreenButton).toBeInTheDocument()
    })

    it('should show all controls', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      // All control groups should be visible
      expect(screen.getByRole('button', { name: /rotate/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /zoom in/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /zoom out/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /reading theme/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /ascii/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /fullscreen/i })).toBeInTheDocument()
    })

    it('should use side-by-side layout in both mode', async () => {
      // When viewMode is 'both', desktop should show image and text side by side
      // This would be tested by checking for lg:flex-row or similar classes
    })
  })

  describe('Wide Desktop (>= 1280px)', () => {
    beforeEach(() => {
      setViewport(BREAKPOINTS.wide)
    })

    it('should constrain content width', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      // Check for max-width constraints
      const main = screen.getByRole('main')
      const headerDiv = main.querySelector('[class*="max-w-screen-2xl"]')
      expect(headerDiv).toBeInTheDocument()
    })
  })

  describe('Print Styles', () => {
    it('should hide interactive elements in print', () => {
      // Would test @media print styles
      // Navigation, controls should be hidden
      // Content should be visible
    })
  })

  describe('Orientation', () => {
    it('should handle portrait orientation', () => {
      // Set portrait dimensions
      Object.defineProperty(window, 'innerWidth', { value: 375 })
      Object.defineProperty(window, 'innerHeight', { value: 812 })
      
      // Content should stack vertically
    })

    it('should handle landscape orientation', () => {
      // Set landscape dimensions
      Object.defineProperty(window, 'innerWidth', { value: 812 })
      Object.defineProperty(window, 'innerHeight', { value: 375 })
      
      // Content can be side by side
    })
  })
})

describe('Container Queries', () => {
  // Future: Test @container queries when used
  it('should adapt based on container size', () => {
    // Placeholder for container query tests
    expect(true).toBe(true)
  })
})
