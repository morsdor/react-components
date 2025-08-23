'use client'

import { useState, useEffect, useRef } from 'react'
import { FiChevronLeft, FiChevronRight, FiPlay, FiPause } from 'react-icons/fi'
import Image from 'next/image'

interface CarouselItem {
  id: string
  src: string
  alt: string
  caption?: string
}

interface CarouselProps {
  items: CarouselItem[]
  autoplay?: boolean
  autoplayInterval?: number
  showDots?: boolean
  showCaptions?: boolean
}

/**
 * Accessible image carousel with autoplay and keyboard navigation
 * Implements ARIA live regions for screen reader announcements
 */
export function Carousel({ 
  items, 
  autoplay = true, 
  autoplayInterval = 4000,
  showDots = true,
  showCaptions = true
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoplay)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Auto-advance slides
  useEffect(() => {
    if (isPlaying && !isHovered && items.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % items.length)
      }, autoplayInterval)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPlaying, isHovered, items.length, autoplayInterval])

  /**
   * Navigate to specific slide
   */
  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  /**
   * Navigate to previous slide
   */
  const goToPrevious = () => {
    setCurrentIndex(prev => prev === 0 ? items.length - 1 : prev - 1)
  }

  /**
   * Navigate to next slide
   */
  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % items.length)
  }

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        goToPrevious()
        break
      case 'ArrowRight':
        event.preventDefault()
        goToNext()
        break
      case ' ':
        event.preventDefault()
        setIsPlaying(!isPlaying)
        break
    }
  }

  /**
   * Toggle autoplay
   */
  const toggleAutoplay = () => {
    setIsPlaying(!isPlaying)
  }

  if (items.length === 0) {
    return <div className="text-center text-gray-500">No images to display</div>
  }

  const currentItem = items[currentIndex]

  return (
    <div 
      ref={carouselRef}
      className="relative bg-gray-900 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="region"
      aria-label="Image carousel"
      aria-live="polite"
    >
      {/* Main image */}
      <div className="relative aspect-video">
        <Image
          src={currentItem.src || "/placeholder.svg"}
          alt={currentItem.alt}
          fill
          className="object-cover"
          priority
        />
        
        {/* Navigation buttons */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Previous image"
        >
          <FiChevronLeft size={24} />
        </button>
        
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Next image"
        >
          <FiChevronRight size={24} />
        </button>

        {/* Autoplay control */}
        <button
          onClick={toggleAutoplay}
          className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all focus:outline-none focus:ring-2 focus:ring-white"
          aria-label={isPlaying ? 'Pause autoplay' : 'Start autoplay'}
        >
          {isPlaying ? <FiPause size={20} /> : <FiPlay size={20} />}
        </button>

        {/* Caption */}
        {showCaptions && currentItem.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4">
            <p className="text-sm">{currentItem.caption}</p>
          </div>
        )}
      </div>

      {/* Dot indicators */}
      {showDots && items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-white ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Image {currentIndex + 1} of {items.length}: {currentItem.alt}
        {currentItem.caption && `. ${currentItem.caption}`}
      </div>
    </div>
  )
}
