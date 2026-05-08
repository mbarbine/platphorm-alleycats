'use client'

import { useState, useEffect, useCallback } from 'react'

// Zine reader preferences stored in localStorage
export type ViewMode = 'both' | 'image' | 'text'

export interface ZinePreferences {
  // Reading
  readingMode: 'dark' | 'sepia' | 'light'
  lastPage: number
  zoom: number
  // Display
  viewMode: ViewMode  // 'both' | 'image' | 'text'
  isAsciiMode: boolean
  imageRotation: number
  // Language (for reader.platphormnews.com integration)
  preferredLanguage: string
  autoTranslate: boolean
  // Session
  hasSeenIntro: boolean
  visitCount: number
  lastVisit: string
  // Engagement
  bookmarkedPages: number[]
  pagesRead: number[]
  totalPagesViewed: number
  completedZine: boolean
}

const STORAGE_KEY = 'alleycats-alcove-preferences'

const defaultPreferences: ZinePreferences = {
  readingMode: 'dark',
  lastPage: 0,
  zoom: 1,
  viewMode: 'both',
  isAsciiMode: false,
  imageRotation: 0,
  preferredLanguage: 'en',
  autoTranslate: false,
  hasSeenIntro: false,
  visitCount: 0,
  lastVisit: new Date().toISOString(),
  bookmarkedPages: [],
  pagesRead: [],
  totalPagesViewed: 0,
  completedZine: false,
}

export function usePreferences() {
  const [preferences, setPreferences] = useState<ZinePreferences>(defaultPreferences)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<ZinePreferences>
        setPreferences(prev => ({
          ...prev,
          ...parsed,
          visitCount: (parsed.visitCount || 0) + 1,
          lastVisit: new Date().toISOString(),
        }))
      } else {
        // First visit
        setPreferences(prev => ({
          ...prev,
          visitCount: 1,
          lastVisit: new Date().toISOString(),
        }))
      }
    } catch {
      // localStorage unavailable or corrupted
    }
    setIsLoaded(true)
  }, [])

  // Persist to localStorage on change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences))
      } catch {
        // localStorage full or unavailable
      }
    }
  }, [preferences, isLoaded])

  const updatePreference = useCallback(<K extends keyof ZinePreferences>(
    key: K,
    value: ZinePreferences[K]
  ) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetPreferences = useCallback(() => {
    setPreferences({ ...defaultPreferences, visitCount: preferences.visitCount })
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // Ignore
    }
  }, [preferences.visitCount])

  return {
    preferences,
    updatePreference,
    resetPreferences,
    isLoaded,
    isReturningVisitor: preferences.visitCount > 1,
  }
}

// Simple hook for skip-intro logic
export function useSkipIntro() {
  const { preferences, updatePreference, isReturningVisitor } = usePreferences()
  
  const markIntroSeen = useCallback(() => {
    updatePreference('hasSeenIntro', true)
  }, [updatePreference])

  return {
    shouldSkipIntro: preferences.hasSeenIntro || isReturningVisitor,
    markIntroSeen,
  }
}

// Hook for bookmarking pages
export function useBookmarks() {
  const { preferences, updatePreference } = usePreferences()
  
  const toggleBookmark = useCallback((pageIndex: number) => {
    const current = preferences.bookmarkedPages || []
    const isBookmarked = current.includes(pageIndex)
    
    if (isBookmarked) {
      updatePreference('bookmarkedPages', current.filter(p => p !== pageIndex))
    } else {
      updatePreference('bookmarkedPages', [...current, pageIndex].sort((a, b) => a - b))
    }
  }, [preferences.bookmarkedPages, updatePreference])
  
  const isBookmarked = useCallback((pageIndex: number) => {
    return (preferences.bookmarkedPages || []).includes(pageIndex)
  }, [preferences.bookmarkedPages])
  
  return {
    bookmarks: preferences.bookmarkedPages || [],
    toggleBookmark,
    isBookmarked,
  }
}

// Hook for reading progress and stats
export function useReadingStats(totalPages: number) {
  const { preferences, updatePreference } = usePreferences()
  
  const markPageRead = useCallback((pageIndex: number) => {
    const current = preferences.pagesRead || []
    if (!current.includes(pageIndex)) {
      const updated = [...current, pageIndex]
      updatePreference('pagesRead', updated)
      updatePreference('totalPagesViewed', (preferences.totalPagesViewed || 0) + 1)
      
      // Check if zine is complete
      if (updated.length >= totalPages) {
        updatePreference('completedZine', true)
      }
    }
  }, [preferences.pagesRead, preferences.totalPagesViewed, updatePreference, totalPages])
  
  const progress = ((preferences.pagesRead || []).length / totalPages) * 100
  
  return {
    pagesRead: preferences.pagesRead || [],
    totalPagesViewed: preferences.totalPagesViewed || 0,
    completedZine: preferences.completedZine || false,
    progress,
    markPageRead,
  }
}
