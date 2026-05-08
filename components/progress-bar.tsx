'use client'

import { motion } from 'framer-motion'

interface ProgressBarProps {
  current: number
  total: number
  className?: string
}

export function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const progress = ((current + 1) / total) * 100

  return (
    <div 
      className={`fixed bottom-0 left-0 right-0 h-1 bg-muted/30 z-50 ${className}`}
      role="progressbar"
      aria-valuenow={current + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Page ${current + 1} of ${total}`}
    >
      <motion.div
        className="h-full bg-primary/80"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      />
    </div>
  )
}
