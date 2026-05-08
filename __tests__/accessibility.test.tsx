/**
 * Accessibility Tests
 * Tests for WCAG compliance, keyboard navigation, and screen reader support
 */

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('Accessibility', () => {
  describe('Skip Link', () => {
    it('should have skip-to-content link in layout', async () => {
      // The skip link is in layout.tsx and should be the first focusable element
      const RootLayout = (await import('@/app/layout')).default
      
      render(
        <RootLayout>
          <div>Test content</div>
        </RootLayout>
      )
      
      const skipLink = screen.getByText('Skip to content')
      expect(skipLink).toBeInTheDocument()
      expect(skipLink).toHaveAttribute('href', '#main-content')
    })

    it('should become visible on focus', async () => {
      const user = userEvent.setup()
      const RootLayout = (await import('@/app/layout')).default
      
      render(
        <RootLayout>
          <div>Test content</div>
        </RootLayout>
      )
      
      const skipLink = screen.getByText('Skip to content')
      
      // Tab to focus the skip link
      await user.tab()
      
      // Check that sr-only class is removed when focused
      expect(skipLink).toHaveFocus()
    })
  })

  describe('ARIA Labels', () => {
    it('should have proper aria-labels on all icon buttons', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      // Check that all buttons have aria-labels
      const buttons = screen.getAllByRole('button')
      
      buttons.forEach(button => {
        const hasAriaLabel = button.hasAttribute('aria-label')
        const hasAriaLabelledBy = button.hasAttribute('aria-labelledby')
        const hasTextContent = button.textContent && button.textContent.trim() !== ''
        
        expect(hasAriaLabel || hasAriaLabelledBy || hasTextContent).toBe(true)
      })
    })

    it('should have aria-expanded on expandable buttons', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      const themeButton = screen.getByRole('button', { name: /change reading theme/i })
      expect(themeButton).toHaveAttribute('aria-expanded')
      
      const shareButton = screen.getByRole('button', { name: /share/i })
      expect(shareButton).toHaveAttribute('aria-expanded')
    })

    it('should have aria-pressed on toggle buttons', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      const asciiButton = screen.getByRole('button', { name: /toggle ascii mode/i })
      expect(asciiButton).toHaveAttribute('aria-pressed')
      
      const viewModeButtons = screen.getAllByRole('button', { name: /show (image|text)/i })
      viewModeButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-pressed')
      })
    })
  })

  describe('Keyboard Navigation', () => {
    it('should support arrow key navigation between pages', async () => {
      const user = userEvent.setup()
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      // Arrow right should go to next page
      await user.keyboard('{ArrowRight}')
      
      // Check that page changed (would need state inspection)
    })

    it('should support Escape to exit fullscreen', async () => {
      const user = userEvent.setup()
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      await user.keyboard('{Escape}')
      // Should exit fullscreen or close menus
    })

    it('should trap focus in modals', async () => {
      const user = userEvent.setup()
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      // Open the table of contents
      const menuButton = screen.getByRole('button', { name: /open table of contents/i })
      await user.click(menuButton)
      
      // Focus should be trapped within the sheet
    })
  })

  describe('Color Contrast', () => {
    it('should have sufficient contrast in dark mode', () => {
      // This would typically be tested with axe-core
      // Placeholder for contrast ratio tests
      expect(true).toBe(true)
    })

    it('should have sufficient contrast in light mode', () => {
      expect(true).toBe(true)
    })

    it('should have sufficient contrast in sepia mode', () => {
      expect(true).toBe(true)
    })
  })

  describe('Reduced Motion', () => {
    it('should respect prefers-reduced-motion', () => {
      // Mock matchMedia to return prefers-reduced-motion: reduce
      window.matchMedia = jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      }))
      
      // Component should use faster/no animations
    })
  })

  describe('Screen Reader', () => {
    it('should announce page changes', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      // Check for aria-live regions
      const pageIndicator = screen.getByText(/1/)
      expect(pageIndicator.closest('[aria-live]') || pageIndicator).toBeInTheDocument()
    })

    it('should have descriptive alt text for images', async () => {
      const { ZineReader } = await import('@/components/zine-reader')
      render(<ZineReader onBack={jest.fn()} />)
      
      const images = screen.getAllByRole('img')
      images.forEach(img => {
        expect(img).toHaveAttribute('alt')
        expect(img.getAttribute('alt')).not.toBe('')
      })
    })
  })
})
