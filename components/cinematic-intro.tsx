'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useReducedMotion } from 'framer-motion'
import { ChevronDown, BookOpen } from 'lucide-react'

interface CinematicIntroProps {
  onComplete: () => void
  onSkip: () => void
}

export function CinematicIntro({ onComplete, onSkip }: CinematicIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isReady, setIsReady] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Lighter spring for mobile performance
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: prefersReducedMotion ? 400 : 150,
    damping: prefersReducedMotion ? 40 : 28,
    restDelta: 0.001,
  })

  useEffect(() => {
    // Quick fade in
    const timer = setTimeout(() => setIsReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', (value) => {
      if (value > 0.92) {
        onComplete()
      }
    })
    return () => unsubscribe()
  }, [smoothProgress, onComplete])

  // Faster parallax transitions
  const bgY = useTransform(smoothProgress, [0, 1], ['0%', '30%'])
  const bgOpacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.4, 0.6, 0.4, 0.2])

  // Section transforms - tighter timing
  const section1Opacity = useTransform(smoothProgress, [0, 0.2, 0.35], [1, 1, 0])
  const section1Y = useTransform(smoothProgress, [0, 0.35], ['0vh', '-25vh'])
  
  const section2Opacity = useTransform(smoothProgress, [0.25, 0.35, 0.55, 0.65], [0, 1, 1, 0])
  const section2Y = useTransform(smoothProgress, [0.25, 0.35, 0.65], ['25vh', '0vh', '-25vh'])
  
  const section3Opacity = useTransform(smoothProgress, [0.55, 0.65, 0.85, 0.95], [0, 1, 1, 0])
  const section3Y = useTransform(smoothProgress, [0.55, 0.65, 0.95], ['25vh', '0vh', '-15vh'])

  const finalOpacity = useTransform(smoothProgress, [0.85, 1], [0, 1])
  const finalScale = useTransform(smoothProgress, [0.85, 1], [0.9, 1])

  const handleScrollHint = useCallback(() => {
    window.scrollBy({ top: window.innerHeight * 0.6, behavior: 'smooth' })
  }, [])

  // Skip to reader immediately if reduced motion
  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center px-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            ALLEYCATS ALCOVE
          </h1>
          <p className="text-muted-foreground mb-8">Issue #1 - A Letter to A Substance</p>
          <button
            onClick={onComplete}
            className="px-8 py-4 bg-primary text-primary-foreground font-bold rounded-full"
          >
            Start Reading
          </button>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="relative h-[300vh] bg-background no-tap-highlight" style={{ position: 'relative' }}>
      {/* Fixed viewport */}
      <div className="fixed inset-0 overflow-hidden gpu-accelerate">
        {/* Ambient background */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: bgY }}
        >
          <motion.div 
            className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,_var(--tw-gradient-stops))] from-primary/15 via-background to-background"
            style={{ opacity: bgOpacity }}
          />
          {/* Subtle texture */}
          <div className="absolute inset-0 opacity-[0.02] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNhKSIvPjwvc3ZnPg==')]" />
        </motion.div>

        {/* Skip/Enter button - always visible */}
        <AnimatePresence>
          {isReady && (
            <motion.button
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onSkip}
              className="fixed top-5 right-5 z-50 px-5 py-2.5 text-sm font-medium text-foreground bg-card/60 hover:bg-card border border-border/60 rounded-full backdrop-blur-md transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Start Reading</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Progress bar */}
        <motion.div 
          className="fixed top-0 left-0 right-0 h-0.5 bg-muted z-50"
          style={{ opacity: useTransform(smoothProgress, [0, 0.05], [0, 1]) }}
        >
          <motion.div
            className="h-full bg-primary"
            style={{ width: useTransform(smoothProgress, [0, 1], ['0%', '100%']) }}
          />
        </motion.div>

        {/* Section 1: Title */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
          style={{ opacity: section1Opacity, y: section1Y }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={isReady ? { opacity: 1 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isReady ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-4"
            >
              <span className="inline-block px-4 py-1.5 text-xs tracking-[0.25em] uppercase text-accent border border-accent/30 rounded-full">
                Issue #1 — May 2026
              </span>
            </motion.div>
            
            <motion.h1 
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-[0.9] text-foreground"
              initial={{ opacity: 0, y: 30 }}
              animate={isReady ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <span className="block">ALLEYCATS</span>
              <span className="block text-primary">ALCOVE</span>
            </motion.h1>
            
            <motion.p 
              className="mt-5 text-lg sm:text-xl md:text-2xl text-muted-foreground font-serif italic"
              initial={{ opacity: 0 }}
              animate={isReady ? { opacity: 1 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              A Collaborative Zine with Substance
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Section 2: Theme + Context */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
          style={{ opacity: section2Opacity, y: section2Y }}
        >
          <div className="max-w-2xl text-center">
            <motion.div className="w-16 h-px bg-primary mx-auto mb-8" />
            <motion.p className="text-sm sm:text-base tracking-[0.2em] uppercase text-accent mb-4">
              {"This Month's Theme"}
            </motion.p>
            <motion.p className="text-2xl sm:text-3xl md:text-4xl font-serif text-foreground leading-relaxed">
              {"\"A Letter to A Substance\""}
            </motion.p>
            <motion.p className="mt-6 text-base sm:text-lg text-muted-foreground font-serif leading-relaxed max-w-xl mx-auto">
              From the underground literary community. Raw voices, real stories, unapologetic art.
            </motion.p>
          </div>
        </motion.div>

        {/* Section 3: The Writers */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
          style={{ opacity: section3Opacity, y: section3Y }}
        >
          <div className="max-w-xl text-center">
            <motion.p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-accent/80 mb-6">
              {"The Writer's Alcove • Fridays 5:30-7:00"}
            </motion.p>
            <motion.p className="text-base sm:text-lg md:text-xl text-muted-foreground font-serif leading-relaxed">
              {"They meet on Friday evenings before Karaoke starts and do their little exercises. One day they decided—"}
            </motion.p>
            <motion.p className="mt-4 text-xl sm:text-2xl text-primary font-bold italic">
              {"\"Let's start a zine!\""}
            </motion.p>
            <motion.p className="mt-6 text-sm text-muted-foreground/80 italic">
              Not to use substances... but to write!
            </motion.p>
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
          style={{ opacity: finalOpacity, scale: finalScale }}
        >
          <div className="text-center">
            <motion.div className="mb-6">
              <BookOpen className="w-10 h-10 text-primary mx-auto" />
            </motion.div>
            <motion.button
              onClick={onComplete}
              className="group px-8 py-4 bg-primary text-primary-foreground font-bold text-base sm:text-lg rounded-full active:scale-95 transition-transform shadow-lg shadow-primary/20"
              whileTap={{ scale: 0.95 }}
            >
              Enter the Alcove
            </motion.button>
            <motion.p className="mt-4 text-xs text-muted-foreground">
              8 pieces by 6 local artists
            </motion.p>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div 
          className="fixed bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={isReady ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
          onClick={handleScrollHint}
          style={{ 
            opacity: useTransform(smoothProgress, [0, 0.08, 0.85, 1], [1, 0.6, 0.4, 0])
          }}
        >
          <span className="text-[10px] text-muted-foreground/60 tracking-[0.2em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="w-5 h-5 text-primary/60" />
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
