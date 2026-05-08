'use client'

import { useCallback, useRef, useState, useEffect } from 'react'

interface GestureState {
  isPinching: boolean
  pinchScale: number
  initialDistance: number | null
}

interface UseGesturesOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onDoubleTap?: () => void
  onPinch?: (scale: number) => void
  onLongPress?: () => void
  swipeThreshold?: number
  velocityThreshold?: number
  longPressDelay?: number
}

export function useGestures(options: UseGesturesOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onDoubleTap,
    onPinch,
    onLongPress,
    swipeThreshold = 50,
    velocityThreshold = 0.3,
    longPressDelay = 500,
  } = options

  const [gestureState, setGestureState] = useState<GestureState>({
    isPinching: false,
    pinchScale: 1,
    initialDistance: null,
  })

  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null)
  const lastTapRef = useRef<number>(0)
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Calculate distance between two touch points
  const getDistance = useCallback((touches: TouchList): number => {
    if (touches.length < 2) return 0
    const [t1, t2] = [touches[0], touches[1]]
    return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
  }, [])

  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Clear any existing long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
    }

    if (e.touches.length === 2) {
      // Pinch start
      setGestureState(prev => ({
        ...prev,
        isPinching: true,
        initialDistance: getDistance(e.touches),
      }))
    } else if (e.touches.length === 1) {
      // Single touch start
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now(),
      }

      // Start long press timer
      if (onLongPress) {
        longPressTimerRef.current = setTimeout(() => {
          onLongPress()
          // Haptic feedback
          if (navigator.vibrate) {
            navigator.vibrate(50)
          }
        }, longPressDelay)
      }
    }
  }, [getDistance, onLongPress, longPressDelay])

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    // Cancel long press on move
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }

    if (e.touches.length === 2 && gestureState.initialDistance !== null) {
      // Pinch move
      const currentDistance = getDistance(e.touches)
      const scale = currentDistance / gestureState.initialDistance
      
      setGestureState(prev => ({ ...prev, pinchScale: scale }))
      onPinch?.(scale)
    }
  }, [gestureState.initialDistance, getDistance, onPinch])

  // Handle touch end
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }

    // Reset pinch state
    if (gestureState.isPinching) {
      setGestureState({
        isPinching: false,
        pinchScale: 1,
        initialDistance: null,
      })
      return
    }

    // Process swipe or tap
    if (!touchStartRef.current) return

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
      time: Date.now(),
    }

    const deltaX = touchEnd.x - touchStartRef.current.x
    const deltaY = touchEnd.y - touchStartRef.current.y
    const deltaTime = touchEnd.time - touchStartRef.current.time
    const distance = Math.hypot(deltaX, deltaY)

    // Check for tap (minimal movement)
    if (distance < 10) {
      const now = Date.now()
      const timeSinceLastTap = now - lastTapRef.current
      
      if (timeSinceLastTap < 300 && onDoubleTap) {
        onDoubleTap()
        lastTapRef.current = 0 // Reset to prevent triple tap
      } else {
        lastTapRef.current = now
      }
      return
    }

    // Calculate velocity
    const velocity = distance / deltaTime

    // Determine swipe direction
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX > absY) {
      // Horizontal swipe
      if (absX > swipeThreshold || velocity > velocityThreshold) {
        if (deltaX < 0) {
          onSwipeLeft?.()
        } else {
          onSwipeRight?.()
        }
      }
    } else {
      // Vertical swipe
      if (absY > swipeThreshold || velocity > velocityThreshold) {
        if (deltaY < 0) {
          onSwipeUp?.()
        } else {
          onSwipeDown?.()
        }
      }
    }

    touchStartRef.current = null
  }, [gestureState.isPinching, swipeThreshold, velocityThreshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, onDoubleTap])

  // Cleanup
  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current)
      }
    }
  }, [])

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    gestureState,
  }
}

// Hook for haptic feedback
export function useHaptic() {
  const vibrate = useCallback((pattern: number | number[] = 10) => {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }, [])

  return {
    light: () => vibrate(10),
    medium: () => vibrate(25),
    heavy: () => vibrate([50, 30, 50]),
    success: () => vibrate([10, 50, 10]),
    error: () => vibrate([50, 100, 50]),
  }
}
