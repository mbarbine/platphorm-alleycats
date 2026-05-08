/**
 * usePreferences Hook Tests
 * Tests localStorage persistence and preference management
 */

import { renderHook, act } from '@testing-library/react'

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

describe('usePreferences Hook', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
    jest.clearAllMocks()
  })

  it('should return default preferences on first load', async () => {
    const { usePreferences } = await import('@/lib/use-preferences')
    const { result } = renderHook(() => usePreferences())
    
    expect(result.current.preferences.readingMode).toBe('dark')
    expect(result.current.preferences.zoom).toBe(1)
    expect(result.current.preferences.viewMode).toBe('both')
    expect(result.current.preferences.isAsciiMode).toBe(false)
  })

  it('should persist preferences to localStorage', async () => {
    const { usePreferences } = await import('@/lib/use-preferences')
    const { result } = renderHook(() => usePreferences())
    
    act(() => {
      result.current.updatePreference('readingMode', 'sepia')
    })
    
    // Check localStorage was updated
    const stored = mockLocalStorage.getItem('alleycats-preferences')
    expect(stored).toContain('sepia')
  })

  it('should restore preferences from localStorage', async () => {
    // Pre-populate localStorage
    mockLocalStorage.setItem('alleycats-preferences', JSON.stringify({
      readingMode: 'light',
      zoom: 1.5,
      viewMode: 'image',
      isAsciiMode: true,
      imageRotation: 90,
      preferredLanguage: 'es',
      autoTranslate: true,
      hasSeenIntro: true,
      visitCount: 5,
      lastVisit: '2026-05-01',
      lastPage: 3,
    }))
    
    const { usePreferences } = await import('@/lib/use-preferences')
    const { result } = renderHook(() => usePreferences())
    
    // Wait for hydration
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0))
    })
    
    expect(result.current.preferences.readingMode).toBe('light')
    expect(result.current.preferences.zoom).toBe(1.5)
    expect(result.current.preferences.viewMode).toBe('image')
  })

  it('should track visit count', async () => {
    const { usePreferences } = await import('@/lib/use-preferences')
    const { result } = renderHook(() => usePreferences())
    
    expect(result.current.preferences.visitCount).toBeGreaterThanOrEqual(0)
  })

  it('should handle corrupted localStorage gracefully', async () => {
    mockLocalStorage.setItem('alleycats-preferences', 'not-valid-json')
    
    const { usePreferences } = await import('@/lib/use-preferences')
    const { result } = renderHook(() => usePreferences())
    
    // Should fall back to defaults
    expect(result.current.preferences.readingMode).toBe('dark')
  })

  it('should update multiple preferences', async () => {
    const { usePreferences } = await import('@/lib/use-preferences')
    const { result } = renderHook(() => usePreferences())
    
    act(() => {
      result.current.updatePreference('zoom', 2)
      result.current.updatePreference('readingMode', 'sepia')
      result.current.updatePreference('viewMode', 'text')
    })
    
    expect(result.current.preferences.zoom).toBe(2)
    expect(result.current.preferences.readingMode).toBe('sepia')
    expect(result.current.preferences.viewMode).toBe('text')
  })
})
