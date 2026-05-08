'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Bookmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useBookmarks } from '@/lib/use-preferences'

interface BookmarkButtonProps {
  pageIndex: number
  className?: string
  size?: 'sm' | 'default' | 'lg' | 'icon'
  variant?: 'ghost' | 'outline' | 'default'
}

export function BookmarkButton({ 
  pageIndex, 
  className = '', 
  size = 'icon',
  variant = 'ghost' 
}: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks()
  const bookmarked = isBookmarked(pageIndex)

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={variant}
          size={size}
          onClick={() => toggleBookmark(pageIndex)}
          className={className}
          aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          aria-pressed={bookmarked}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={bookmarked ? 'filled' : 'empty'}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Bookmark 
                className={`h-4 w-4 transition-colors ${
                  bookmarked ? 'fill-primary text-primary' : ''
                }`} 
              />
            </motion.div>
          </AnimatePresence>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {bookmarked ? 'Remove bookmark' : 'Bookmark this page'}
      </TooltipContent>
    </Tooltip>
  )
}
