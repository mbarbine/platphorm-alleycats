'use client'

import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { CinematicIntro } from '@/components/cinematic-intro'
import { ZineReader } from '@/components/zine-reader'

type ViewState = 'intro' | 'reader'

export default function ZinePage() {
  const [view, setView] = useState<ViewState | null>(null)

  // Check URL params and session for quick entry
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const skipIntro = params.get('read') === 'true' || params.get('skip') === 'true'
    const hasVisited = sessionStorage.getItem('alleycats-visited')
    
    // Quick entry conditions
    if (skipIntro || hasVisited) {
      setView('reader')
    } else {
      setView('intro')
    }
  }, [])

  const handleIntroComplete = useCallback(() => {
    setView('reader')
    sessionStorage.setItem('alleycats-visited', 'true')
  }, [])

  const handleSkipIntro = useCallback(() => {
    setView('reader')
    sessionStorage.setItem('alleycats-visited', 'true')
  }, [])

  const handleBackToIntro = useCallback(() => {
    sessionStorage.removeItem('alleycats-visited')
    setView('intro')
    window.scrollTo(0, 0)
  }, [])

  // Loading state
  if (view === null) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <motion.div
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-sm text-muted-foreground">Loading zine...</p>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {view === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <CinematicIntro 
              onComplete={handleIntroComplete} 
              onSkip={handleSkipIntro} 
            />
          </motion.div>
        )}
        
        {view === 'reader' && (
          <motion.div
            key="reader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <ZineReader onBack={handleBackToIntro} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
