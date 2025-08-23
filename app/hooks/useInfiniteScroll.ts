'use client'

import { useEffect, useRef, useCallback } from 'react'

interface UseInfiniteScrollOptions {
  hasNextPage: boolean
  isFetchingNextPage: boolean
  threshold?: number
}

/**
 * Custom hook for infinite scrolling using IntersectionObserver
 * Provides efficient detection of when user reaches end of list
 */
export function useInfiniteScroll(
  fetchNextPage: () => void,
  options: UseInfiniteScrollOptions
) {
  const { hasNextPage, isFetchingNextPage, threshold = 1.0 } = options
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement | null>(null)

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  )

  useEffect(() => {
    const element = loadingRef.current
    if (!element) return

    observerRef.current = new IntersectionObserver(handleObserver, {
      threshold,
      rootMargin: '20px'
    })

    observerRef.current.observe(element)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [handleObserver, threshold])

  return { loadingRef }
}
