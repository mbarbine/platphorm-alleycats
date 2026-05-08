'use client'

import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { motion, AnimatePresence, PanInfo, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut,
  Menu,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  RotateCcw,
  Terminal,
  Share2,
  Clock,
  Image as ImageIcon,
  FileText,
  Layers
} from 'lucide-react'
import { alleycatsZine, tableOfContents } from '@/lib/zine-data'
import { getDaysUntilNextIssue } from '@/lib/ascii-utils'
import { usePreferences, useReadingStats, useBookmarks } from '@/lib/use-preferences'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { DownloadDialog } from '@/components/download-dialog'
import { ProgressBar } from '@/components/progress-bar'
import { BookmarkButton } from '@/components/bookmark-button'

interface ZineReaderProps {
  onBack: () => void
}

type ReadingMode = 'dark' | 'sepia' | 'light'

// Optimized spring config for mobile
const SPRING_CONFIG = {
  type: 'spring' as const,
  stiffness: 400,
  damping: 35,
  mass: 0.5,
}

// Faster transition for reduced motion or performance
const FAST_TRANSITION = {
  duration: 0.15,
  ease: [0.25, 0.1, 0.25, 1] as const,
}

// Auto-zoom levels
const ZOOM_LEVELS = {
  default: 1,
  fit: 1.05,
  doubleTap: 1.5,
  max: 3,
  min: 0.5,
}

export function ZineReader({ onBack }: ZineReaderProps) {
  // localStorage-backed preferences (persists reading position, mode, etc.)
  const { preferences, updatePreference, isLoaded } = usePreferences()
  
  // Reading stats and bookmarks
  const { markPageRead, completedZine } = useReadingStats(alleycatsZine.pages.length)
  const { isBookmarked } = useBookmarks()
  
  // Local UI state (not persisted)
  const [currentPage, setCurrentPage] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [isSwiping, setIsSwiping] = useState(false)
  const [showShareMenu, setShowShareMenu] = useState(false)
  const [edgeBounce, setEdgeBounce] = useState<'left' | 'right' | null>(null)
  const [lastTapTime, setLastTapTime] = useState(0)
  const [announcement, setAnnouncement] = useState('')
  
  // Derive from preferences (with localStorage persistence)
  const readingMode = preferences.readingMode
  const zoom = preferences.zoom
  const imageRotation = preferences.imageRotation
  const isAsciiMode = preferences.isAsciiMode
  const viewMode = preferences.viewMode
  
  // Update helpers that persist to localStorage
  const setReadingMode = (mode: ReadingMode) => updatePreference('readingMode', mode)
  const setZoom = (z: number) => updatePreference('zoom', z)
  const setImageRotation = (r: number) => updatePreference('imageRotation', r)
  const setIsAsciiMode = (a: boolean) => updatePreference('isAsciiMode', a)
  const setViewMode = (mode: 'both' | 'image' | 'text') => updatePreference('viewMode', mode)
  
  // Restore last page on mount and set default rotation
  useEffect(() => {
    if (isLoaded && preferences.lastPage > 0 && preferences.lastPage < alleycatsZine.pages.length) {
      setCurrentPage(preferences.lastPage)
      // Set rotation to page's default
      const page = alleycatsZine.pages[preferences.lastPage]
      const defaultRot = (page as { defaultRotation?: number })?.defaultRotation ?? 0
      if (defaultRot !== 0) {
        setImageRotation(defaultRot)
      }
    }
  }, [isLoaded, preferences.lastPage])
  
  // Save current page to preferences and track reading
  useEffect(() => {
    if (isLoaded) {
      updatePreference('lastPage', currentPage)
      // Track page as read after a short delay (ensures intentional viewing)
      const timer = setTimeout(() => {
        markPageRead(currentPage)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [currentPage, isLoaded, updatePreference, markPageRead])
  
  // Next issue countdown
  const nextIssueInfo = useMemo(() => getDaysUntilNextIssue(), [])
  
  const containerRef = useRef<HTMLDivElement>(null)
  const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const prefersReducedMotion = useReducedMotion()

  const pages = alleycatsZine.pages
  const totalPages = pages.length

  // Memoize transition config based on reduced motion preference
  const transitionConfig = useMemo(() => 
    prefersReducedMotion ? FAST_TRANSITION : SPRING_CONFIG,
    [prefersReducedMotion]
  )

  // Get default rotation for a page (some photos are taken vertically)
  const getDefaultRotation = useCallback((pageIndex: number) => {
    const page = pages[pageIndex]
    return (page as { defaultRotation?: number })?.defaultRotation ?? 0
  }, [pages])

  const nextPage = useCallback(() => {
    if (currentPage < totalPages - 1) {
      const nextIdx = currentPage + 1
      setCurrentPage(nextIdx)
      setZoom(1)
      setImageRotation(getDefaultRotation(nextIdx))
      // Screen reader announcement
      const page = pages[nextIdx]
      setAnnouncement(`Page ${nextIdx + 1} of ${totalPages}${page.title ? `: ${page.title}` : ''}`)
    }
  }, [currentPage, totalPages, getDefaultRotation, pages])

  const prevPage = useCallback(() => {
    if (currentPage > 0) {
      const prevIdx = currentPage - 1
      setCurrentPage(prevIdx)
      setZoom(1)
      setImageRotation(getDefaultRotation(prevIdx))
      // Screen reader announcement
      const page = pages[prevIdx]
      setAnnouncement(`Page ${prevIdx + 1} of ${totalPages}${page.title ? `: ${page.title}` : ''}`)
    }
  }, [currentPage, getDefaultRotation, pages, totalPages])

  const goToPage = useCallback((index: number) => {
    setCurrentPage(index)
    setZoom(1)
    setImageRotation(getDefaultRotation(index))
    setIsMenuOpen(false)
    // Screen reader announcement
    const page = pages[index]
    setAnnouncement(`Jumped to page ${index + 1} of ${totalPages}${page.title ? `: ${page.title}` : ''}`)
  }, [getDefaultRotation, pages, totalPages])

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch {
      // Fullscreen not supported or denied
    }
  }, [])

  const handleZoomIn = useCallback(() => {
    setZoom(prev => Math.min(prev + 0.25, 3))
  }, [])

  const handleZoomOut = useCallback(() => {
    setZoom(prev => Math.max(prev - 0.25, 0.5))
  }, [])

  const rotateImage = useCallback(() => {
    setImageRotation(prev => (prev + 90) % 360)
  }, [])

  // Double-tap to zoom
  const handleDoubleTap = useCallback(() => {
    const now = Date.now()
    if (now - lastTapTime < 300) {
      // Double tap detected - toggle between fit and zoomed
      setZoom(prev => prev >= ZOOM_LEVELS.doubleTap ? ZOOM_LEVELS.fit : ZOOM_LEVELS.doubleTap)
    }
    setLastTapTime(now)
  }, [lastTapTime])

  // Edge bounce feedback when at boundaries
  const triggerEdgeBounce = useCallback((direction: 'left' | 'right') => {
    setEdgeBounce(direction)
    // Haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10)
    }
    setTimeout(() => setEdgeBounce(null), 400)
  }, [])

  // Improved swipe handling with velocity and distance thresholds
  const handleDragStart = useCallback(() => {
    setIsSwiping(true)
  }, [])

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsSwiping(false)
    
    const swipeThreshold = 50
    const velocityThreshold = 200
    
    const shouldSwipeLeft = 
      (info.offset.x < -swipeThreshold && info.velocity.x < 0) ||
      (info.velocity.x < -velocityThreshold)
    
    const shouldSwipeRight = 
      (info.offset.x > swipeThreshold && info.velocity.x > 0) ||
      (info.velocity.x > velocityThreshold)
    
    if (shouldSwipeLeft) {
      if (currentPage >= totalPages - 1) {
        triggerEdgeBounce('right') // At end
      } else {
        nextPage()
      }
    } else if (shouldSwipeRight) {
      if (currentPage <= 0) {
        triggerEdgeBounce('left') // At start
      } else {
        prevPage()
      }
    }
  }, [nextPage, prevPage, currentPage, totalPages, triggerEdgeBounce])

  // Keyboard navigation with full shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Navigation
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault()
        if (currentPage >= totalPages - 1) {
          triggerEdgeBounce('right')
        } else {
          nextPage()
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        if (currentPage <= 0) {
          triggerEdgeBounce('left')
        } else {
          prevPage()
        }
      } else if (e.key === 'Home') {
        e.preventDefault()
        goToPage(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        goToPage(totalPages - 1)
      }
      // Zoom
      else if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        handleZoomIn()
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        handleZoomOut()
      }
      // View & Display
      else if (e.key === 't') {
        e.preventDefault()
        const modes: Array<'both' | 'image' | 'text'> = ['both', 'image', 'text']
        const currentIndex = modes.indexOf(viewMode)
        setViewMode(modes[(currentIndex + 1) % modes.length])
      } else if (e.key === 'r') {
        rotateImage()
      } else if (e.key === 'f') {
        toggleFullscreen()
      }
      // Exit
      else if (e.key === 'Escape') {
        if (isFullscreen) {
          document.exitFullscreen()
          setIsFullscreen(false)
        } else if (showSettings) {
          setShowSettings(false)
        } else if (showShareMenu) {
          setShowShareMenu(false)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [nextPage, prevPage, currentPage, totalPages, isFullscreen, toggleFullscreen, rotateImage, goToPage, handleZoomIn, handleZoomOut, viewMode, setViewMode, triggerEdgeBounce, showSettings, showShareMenu])

  // Auto-hide controls with debounce
  useEffect(() => {
    const handleInteraction = () => {
      setShowControls(true)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (!isSwiping) {
          setShowControls(false)
        }
      }, 3500)
    }

    window.addEventListener('mousemove', handleInteraction, { passive: true })
    window.addEventListener('touchstart', handleInteraction, { passive: true })
    
    return () => {
      window.removeEventListener('mousemove', handleInteraction)
      window.removeEventListener('touchstart', handleInteraction)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isSwiping])

  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const currentPageData = pages[currentPage]

  const bgClasses: Record<ReadingMode, string> = {
    dark: 'bg-[#0a0810]',
    sepia: 'bg-[#f4ecd8]',
    light: 'bg-white',
  }

  const textClasses: Record<ReadingMode, string> = {
    dark: 'text-foreground',
    sepia: 'text-[#433422]',
    light: 'text-gray-900',
  }

  // ASCII mode overrides
  const asciiStyles = isAsciiMode ? {
    background: '#000000',
    fontFamily: 'monospace',
    filter: 'contrast(1.2)',
  } : {}

  return (
    <TooltipProvider delayDuration={300}>
      {/* Screen reader announcements */}
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcement}
      </div>
      
      <div 
        ref={containerRef}
        id="main-content"
        role="main"
        className={`fixed inset-0 overflow-hidden flex flex-col transition-colors duration-200 no-tap-highlight no-select scrollbar-hide ${bgClasses[readingMode]}`}
        aria-label={`Zine reader - Page ${currentPage + 1} of ${totalPages}`}
        aria-describedby="keyboard-shortcuts"
      >
        {/* Hidden keyboard shortcut help */}
        <div id="keyboard-shortcuts" className="sr-only">
          Use arrow keys to navigate pages. Press F for fullscreen, R to rotate, T to toggle view mode, plus and minus to zoom.
        </div>
        
        {/* Header */}
      <AnimatePresence>
        {showControls && (
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={FAST_TRANSITION}
            className={`absolute top-0 left-0 right-0 z-50 safe-top ${
              readingMode === 'dark' 
                ? 'bg-gradient-to-b from-black/90 via-black/50 to-transparent' 
                : 'bg-gradient-to-b from-white/95 via-white/50 to-transparent'
            }`}
          >
            <div className="px-3 py-2.5 flex items-center justify-between max-w-screen-2xl mx-auto">
              {/* Left: Menu + Title */}
              <div className="flex items-center gap-1.5 min-w-0 flex-1">
                <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <SheetTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className={`shrink-0 h-10 w-10 ${textClasses[readingMode]} hover:bg-primary/10 active:scale-95`}
                          aria-label="Open table of contents"
                        >
                          <Menu className="h-5 w-5" />
                        </Button>
                      </SheetTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Table of contents</TooltipContent>
                  </Tooltip>
                  <SheetContent side="left" className="w-[85vw] max-w-[320px] bg-card border-border overflow-y-auto scroll-smooth-touch">
                    <SheetHeader className="text-left">
                      <SheetTitle className="text-foreground text-lg">{alleycatsZine.title}</SheetTitle>
                      <p className="text-xs text-muted-foreground">Issue #{alleycatsZine.issue} - {alleycatsZine.date}</p>
                    </SheetHeader>
                    
                    <nav className="mt-6">
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Pages</p>
                      <div className="space-y-0.5">
                        {pages.map((page, index) => (
                          <button
                            key={page.id}
                            onClick={() => goToPage(index)}
                            className={`w-full text-left px-3 py-3 rounded-lg transition-colors active:scale-[0.98] ${
                              currentPage === index 
                                ? 'bg-primary text-primary-foreground' 
                                : 'text-foreground hover:bg-muted active:bg-muted/80'
                            }`}
                          >
                            <span className="text-sm font-medium line-clamp-1">
                              {page.type === 'cover' ? 'Cover' : 
                               page.type === 'back' ? 'Back Cover' :
                               page.title || `Page ${index + 1}`}
                            </span>
                          </button>
                        ))}
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-border">
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Contents</p>
                        <div className="space-y-2.5">
                          {tableOfContents.map((item) => (
                            <div key={item.number} className="flex gap-2">
                              <span className="text-primary font-bold text-sm shrink-0">{item.number}.</span>
                              <div className="min-w-0">
                                <p className="text-sm text-foreground line-clamp-2">{item.title}</p>
                                <p className="text-xs text-muted-foreground">{item.author}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </nav>
                  </SheetContent>
                </Sheet>

                <div className="min-w-0 hidden sm:block">
                  <p className={`text-sm font-medium truncate ${textClasses[readingMode]}`}>
                    {alleycatsZine.title}
                  </p>
                </div>
              </div>

              {/* Center: Page indicator */}
              <div className={`flex items-center justify-center ${textClasses[readingMode]}`}>
                <span className="text-sm tabular-nums font-semibold">
                  {currentPage + 1}
                </span>
                <span className="text-muted-foreground mx-1 text-xs">/</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {totalPages}
                </span>
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-0.5 justify-end flex-1">
                {/* Rotate button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={rotateImage}
                      className={`h-10 w-10 ${textClasses[readingMode]} hover:bg-primary/10 active:scale-95`}
                      aria-label="Rotate image 90 degrees"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Rotate image</TooltipContent>
                </Tooltip>

                {/* Zoom controls - desktop only */}
                <div className="hidden md:flex items-center gap-0.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleZoomOut}
                        disabled={zoom <= 0.5}
                        className={`h-9 w-9 ${textClasses[readingMode]} hover:bg-primary/10 disabled:opacity-30`}
                        aria-label="Zoom out"
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Zoom out</TooltipContent>
                  </Tooltip>
                  <span className={`text-xs w-10 text-center tabular-nums ${textClasses[readingMode]}`} aria-live="polite">
                    {Math.round(zoom * 100)}%
                  </span>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleZoomIn}
                        disabled={zoom >= 3}
                        className={`h-9 w-9 ${textClasses[readingMode]} hover:bg-primary/10 disabled:opacity-30`}
                        aria-label="Zoom in"
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Zoom in</TooltipContent>
                  </Tooltip>
                </div>

                {/* View mode toggle */}
                <div className="hidden sm:flex items-center gap-0.5 border-l border-border/30 pl-1 ml-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setViewMode('both')}
                        className={`h-9 w-9 ${viewMode === 'both' ? 'bg-primary/20' : ''} ${textClasses[readingMode]} hover:bg-primary/10`}
                        aria-label="Show image and text"
                        aria-pressed={viewMode === 'both'}
                      >
                        <Layers className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Image and text</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setViewMode('image')}
                        className={`h-9 w-9 ${viewMode === 'image' ? 'bg-primary/20' : ''} ${textClasses[readingMode]} hover:bg-primary/10`}
                        aria-label="Show image only"
                        aria-pressed={viewMode === 'image'}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Image only</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setViewMode('text')}
                        className={`h-9 w-9 ${viewMode === 'text' ? 'bg-primary/20' : ''} ${textClasses[readingMode]} hover:bg-primary/10`}
                        aria-label="Show text only"
                        aria-pressed={viewMode === 'text'}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Text only</TooltipContent>
                  </Tooltip>
                </div>

                {/* Reading mode toggle */}
                <div className="relative">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowSettings(!showSettings)}
                        className={`h-10 w-10 ${textClasses[readingMode]} hover:bg-primary/10 active:scale-95`}
                        aria-label="Change reading theme"
                        aria-expanded={showSettings}
                      >
                        {readingMode === 'dark' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Reading theme</TooltipContent>
                  </Tooltip>
                  
                  <AnimatePresence>
                    {showSettings && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 p-2 bg-card rounded-xl shadow-xl border border-border min-w-[130px] z-[60]"
                      >
                        <p className="text-xs text-muted-foreground px-2 pb-2">Theme</p>
                        {(['dark', 'sepia', 'light'] as const).map((mode) => (
                          <button
                            key={mode}
                            onClick={() => { setReadingMode(mode); setShowSettings(false) }}
                            className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm capitalize transition-colors active:scale-[0.98] ${
                              readingMode === mode 
                                ? 'bg-primary text-primary-foreground' 
                                : 'text-foreground hover:bg-muted'
                            }`}
                          >
                            <div className={`w-4 h-4 rounded-full border-2 ${
                              mode === 'dark' ? 'bg-[#0a0810] border-gray-500' :
                              mode === 'sepia' ? 'bg-[#f4ecd8] border-amber-400' :
                              'bg-white border-gray-300'
                            }`} />
                            {mode}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* ASCII theme toggle */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => setIsAsciiMode(!isAsciiMode)}
                      className={`h-10 w-10 ${isAsciiMode ? 'text-[#00ff00] bg-black/50' : textClasses[readingMode]} hover:bg-primary/10 active:scale-95`}
                      aria-label="Toggle ASCII mode"
                      aria-pressed={isAsciiMode}
                    >
                      <Terminal className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>ASCII mode</TooltipContent>
                </Tooltip>

                {/* Share button */}
                <div className="relative">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        className={`h-10 w-10 ${textClasses[readingMode]} hover:bg-primary/10 active:scale-95`}
                        aria-label="Share this page"
                        aria-expanded={showShareMenu}
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share</TooltipContent>
                  </Tooltip>
                  
                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 p-3 bg-card rounded-xl shadow-xl border border-border min-w-[200px] z-[60]"
                      >
                        <p className="text-xs text-muted-foreground px-1 pb-2 flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {nextIssueInfo.days} days until Issue #{nextIssueInfo.issueNumber}
                        </p>
                        <div className="space-y-1">
                          <button
                            onClick={() => {
                              navigator.share?.({ 
                                title: 'Alleycats Alcove Zine', 
                                text: `Check out Issue #1 - "${alleycatsZine.theme}"`,
                                url: window.location.href 
                              }).catch(() => {
                                navigator.clipboard.writeText(window.location.href)
                              })
                              setShowShareMenu(false)
                            }}
                            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted active:scale-[0.98] transition-colors"
                          >
                            Share this page
                          </button>
                          <a
                            href={`/api/og?variant=countdown`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted"
                            onClick={() => setShowShareMenu(false)}
                          >
                            Countdown image
                          </a>
                          <a
                            href={`/api/og?variant=ascii`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full text-left px-3 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted"
                            onClick={() => setShowShareMenu(false)}
                          >
                            ASCII share image
                          </a>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Fullscreen - desktop only */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={toggleFullscreen}
                      className={`hidden md:flex h-10 w-10 ${textClasses[readingMode]} hover:bg-primary/10`}
                      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                    >
                      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}</TooltipContent>
                </Tooltip>

                {/* Bookmark current page */}
                <BookmarkButton 
                  pageIndex={currentPage} 
                  className={`h-10 w-10 ${textClasses[readingMode]} hover:bg-primary/10`}
                />

                <DownloadDialog />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Main reader area */}
      <div 
        className={`flex-1 relative flex items-center justify-center overflow-hidden touch-action-pan-y px-12 md:px-16 py-4 ${
          edgeBounce === 'left' ? 'edge-bounce-left' : edgeBounce === 'right' ? 'edge-bounce-right' : ''
        }`}
        onClick={(e) => {
          setShowSettings(false)
          // Double-tap detection
          handleDoubleTap()
        }}
      >
        {/* Navigation buttons - larger touch targets on mobile */}
        <AnimatePresence>
          {showControls && currentPage > 0 && (
            <motion.button
              initial={{ opacity: 0, x: -20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20, scale: 0.8 }}
              whileHover={{ scale: 1.1, x: 2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={prevPage}
              className={`absolute left-2 md:left-6 z-40 p-3 md:p-4 rounded-full backdrop-blur-md border ${
                readingMode === 'dark'
                  ? 'bg-black/50 border-white/20 text-white hover:bg-black/70'
                  : 'bg-white/80 border-gray-300 text-gray-800 hover:bg-white'
              }`}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showControls && currentPage < totalPages - 1 && (
            <motion.button
              initial={{ opacity: 0, x: 20, scale: 0.8 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.8 }}
              whileHover={{ scale: 1.1, x: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              onClick={nextPage}
              className={`absolute right-2 md:right-6 z-40 p-3 md:p-4 rounded-full backdrop-blur-md border ${
                readingMode === 'dark'
                  ? 'bg-black/50 border-white/20 text-white hover:bg-black/70'
                  : 'bg-white/80 border-gray-300 text-gray-800 hover:bg-white'
              }`}
              aria-label="Next page"
            >
              <ChevronRight className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Page content with smooth parallax transition */}
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, x: 80, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -80, scale: 0.95 }}
            transition={transitionConfig}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{ scale: zoom }}
            className="w-full h-full flex items-center justify-center px-2 py-14 md:px-4 md:py-16 cursor-grab active:cursor-grabbing gpu-accelerate"
          >
            <ZinePageDisplay 
              page={currentPageData} 
              readingMode={readingMode} 
              rotation={imageRotation}
              viewMode={viewMode}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Progress bar */}
      <ProgressBar current={currentPage} total={totalPages} className="safe-bottom" />

      {/* Mobile page dots */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 md:hidden px-3 py-2 rounded-full bg-black/40 backdrop-blur-md safe-bottom"
          >
            {pages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`transition-all rounded-full active:scale-90 ${
                  currentPage === index 
                    ? 'bg-primary w-6 h-2' 
                    : 'bg-white/30 w-2 h-2 hover:bg-white/50'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}

// Optimized page display component
function ZinePageDisplay({ 
  page, 
  readingMode,
  rotation = 0,
  viewMode = 'both'
}: { 
  page: typeof alleycatsZine.pages[0] | undefined
  readingMode: ReadingMode
  rotation?: number
  viewMode?: 'both' | 'image' | 'text'
}) {
  const [imageLoaded, setImageLoaded] = useState(false)
  
  if (!page) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const cardBg = readingMode === 'dark' 
    ? 'bg-card/50' 
    : readingMode === 'sepia' 
      ? 'bg-[#faf6ed]' 
      : 'bg-gray-50'

  const textColor = readingMode === 'dark' 
    ? 'text-foreground' 
    : readingMode === 'sepia'
      ? 'text-[#5c4b3a]'
      : 'text-gray-900'

  // Calculate if we need to rotate for proper viewing
  // The zine photos are taken rotated, so we display them full-screen as images
  const isRotated = rotation !== 0

  // Text-only view - no scrollbars, fit content with dynamic sizing
  if (viewMode === 'text') {
    return (
      <div className={`w-full h-full max-w-2xl mx-auto p-4 md:p-6 flex flex-col justify-center ${cardBg} rounded-lg md:rounded-xl shadow-2xl ring-1 ring-white/10 gpu-accelerate`}>
        <div className="space-y-2 md:space-y-3">
          {page.title && (
            <h2 className={`fit-text-lg font-bold font-serif ${textColor}`}>
              {page.title}
            </h2>
          )}
          {page.author && (
            <p className="text-muted-foreground fit-text-sm">by {page.author}</p>
          )}
          {page.content && (
            <div className={`max-w-none ${readingMode === 'dark' ? 'prose-invert' : ''}`}>
              <p className={`whitespace-pre-wrap font-serif fit-text line-clamp-[18] md:line-clamp-[22] ${textColor}`}>
                {page.content}
              </p>
            </div>
          )}
          {!page.content && page.type === 'cover' && (
            <div className={`text-center py-6 ${textColor}`}>
              <h1 className="fit-text-lg font-bold mb-2">Alleycats Alcove</h1>
              <p className="fit-text text-muted-foreground">Issue #1</p>
              <p className="fit-text-sm mt-3">A Letter to A Substance</p>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Both view - side by side on desktop, no scrollbars
  if (viewMode === 'both') {
    return (
      <div className="w-full h-full max-w-6xl mx-auto flex flex-col lg:flex-row gap-2 lg:gap-3 p-2 lg:p-3">
        {/* Image side - auto zoom to fit */}
        <div 
          className={`relative flex-1 min-h-[35vh] lg:min-h-0 ${cardBg} rounded-lg overflow-hidden shadow-xl ring-1 ring-white/10 auto-zoom-container gpu-accelerate`}
          data-loaded={imageLoaded}
          style={{
            transform: isRotated ? `rotate(${rotation}deg) scale(0.7)` : undefined,
            transformOrigin: 'center center',
          }}
        >
          {!imageLoaded && (
            <div className="absolute inset-0 shimmer" />
          )}
          {page.image && (
            <Image
              src={page.image}
              alt={page.title || `Zine page ${page.pageNumber}`}
              fill
              className={`object-contain transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              priority={page.pageNumber <= 2}
              sizes="(max-width: 1024px) 100vw, 50vw"
              quality={75}
              onLoad={() => setImageLoaded(true)}
            />
          )}
        </div>
        
        {/* Text side - fit content, no scroll */}
        <div className={`flex-1 ${cardBg} rounded-lg p-3 lg:p-4 flex flex-col justify-center shadow-xl ring-1 ring-white/10 gpu-accelerate`}>
          <div className="space-y-1.5">
            {page.title && (
              <h2 className={`fit-text-lg font-bold font-serif ${textColor}`}>
                {page.title}
              </h2>
            )}
            {page.author && (
              <p className="text-muted-foreground fit-text-sm">by {page.author}</p>
            )}
            {page.content && (
              <div className={`max-w-none ${readingMode === 'dark' ? 'prose-invert' : ''}`}>
                <p className={`whitespace-pre-wrap font-serif fit-text-sm line-clamp-[14] lg:line-clamp-[18] ${textColor}`}>
                  {page.content}
                </p>
              </div>
            )}
            {!page.content && page.type === 'cover' && (
              <div className={`text-center py-4 ${textColor}`}>
                <h1 className="fit-text-lg font-bold mb-1">Alleycats Alcove</h1>
                <p className="fit-text text-muted-foreground">Issue #1</p>
                <p className="fit-text-sm mt-2">A Letter to A Substance</p>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Image-only view - auto zoom for immersive experience
  return (
    <div 
      className={`relative w-full h-full flex items-center justify-center ${cardBg} rounded-lg md:rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10 auto-zoom-container gpu-accelerate`}
      data-loaded={imageLoaded}
      style={{
        transform: isRotated ? `rotate(${rotation}deg) scale(0.75)` : undefined,
        transformOrigin: 'center center',
      }}
    >
      {/* Shimmer loading skeleton */}
      {!imageLoaded && (
        <div className="absolute inset-0 shimmer" />
      )}
      
      {page.image && (
        <Image
          src={page.image}
          alt={page.title || `Zine page ${page.pageNumber}`}
          fill
          className={`object-contain transition-all duration-600 ${imageLoaded ? 'opacity-100 image-reveal' : 'opacity-0'}`}
          priority={page.pageNumber <= 3}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 1200px"
          quality={85}
          onLoad={() => setImageLoaded(true)}
        />
      )}
    </div>
  )
}
