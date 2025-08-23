'use client'

import { useState } from 'react'
import { FiStar } from 'react-icons/fi'

interface StarRatingProps {
  value?: number
  onChange?: (rating: number) => void
  max?: number
  size?: 'sm' | 'md' | 'lg'
  readonly?: boolean
  allowHalf?: boolean
  showValue?: boolean
}

/**
 * Flexible star rating widget with keyboard support
 * Supports read-only mode, interactive mode, and half-star ratings
 */
export function StarRating({
  value = 0,
  onChange,
  max = 5,
  size = 'md',
  readonly = false,
  allowHalf = true,
  showValue = false
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0)
  const [focusedIndex, setFocusedIndex] = useState(-1)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  /**
   * Handle star click
   */
  const handleStarClick = (rating: number) => {
    if (readonly || !onChange) return
    onChange(rating)
  }

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent, rating: number) => {
    if (readonly || !onChange) return

    const step = allowHalf ? 0.5 : 1
    const maxRating = max
    const currentRating = value

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault()
        const nextRating = Math.min(currentRating + step, maxRating)
        onChange(nextRating)
        break
      
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault()
        const prevRating = Math.max(currentRating - step, 0)
        onChange(prevRating)
        break
      
      case 'Home':
        event.preventDefault()
        onChange(0)
        break
      
      case 'End':
        event.preventDefault()
        onChange(maxRating)
        break
      
      case 'Enter':
      case ' ':
        event.preventDefault()
        onChange(rating)
        break
    }
  }

  /**
   * Get fill percentage for a star
   */
  const getStarFill = (starIndex: number) => {
    const currentValue = hoverRating || value
    const starValue = starIndex + 1
    
    if (currentValue >= starValue) {
      return 100
    } else if (allowHalf && currentValue >= starValue - 0.5) {
      return 50
    }
    return 0
  }

  /**
   * Render individual star
   */
  const renderStar = (starIndex: number) => {
    const fillPercentage = getStarFill(starIndex)
    const starValue = starIndex + 1
    const halfStarValue = starValue - 0.5
    
    return (
      <div key={starIndex} className="relative inline-block">
        {/* Background star */}
        <FiStar 
          className={`${sizeClasses[size]} text-gray-300`}
          fill="currentColor"
        />
        
        {/* Filled star */}
        <div 
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${fillPercentage}%` }}
        >
          <FiStar 
            className={`${sizeClasses[size]} text-yellow-400`}
            fill="currentColor"
          />
        </div>
        
        {/* Interactive overlay */}
        {!readonly && (
          <div className="absolute inset-0">
            {allowHalf ? (
              <>
                {/* Left half for half-star rating */}
                <button
                  className="absolute inset-0 w-1/2 left-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-l opacity-0 hover:opacity-10 hover:bg-blue-500"
                  onMouseEnter={() => setHoverRating(halfStarValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleStarClick(halfStarValue)}
                  onKeyDown={(e) => handleKeyDown(e, halfStarValue)}
                  onFocus={() => setFocusedIndex(starIndex * 2)}
                  onBlur={() => setFocusedIndex(-1)}
                  aria-label={`Rate ${halfStarValue} out of ${max} stars`}
                  tabIndex={focusedIndex === starIndex * 2 ? 0 : starIndex === 0 ? 0 : -1}
                />
                
                {/* Right half for full-star rating */}
                <button
                  className="absolute inset-0 w-1/2 right-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-r opacity-0 hover:opacity-10 hover:bg-blue-500"
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleStarClick(starValue)}
                  onKeyDown={(e) => handleKeyDown(e, starValue)}
                  onFocus={() => setFocusedIndex(starIndex * 2 + 1)}
                  onBlur={() => setFocusedIndex(-1)}
                  aria-label={`Rate ${starValue} out of ${max} stars`}
                  tabIndex={focusedIndex === starIndex * 2 + 1 ? 0 : -1}
                />
              </>
            ) : (
              <button
                className="absolute inset-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded opacity-0 hover:opacity-10 hover:bg-blue-500"
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleStarClick(starValue)}
                onKeyDown={(e) => handleKeyDown(e, starValue)}
                onFocus={() => setFocusedIndex(starIndex)}
                onBlur={() => setFocusedIndex(-1)}
                aria-label={`Rate ${starValue} out of ${max} stars`}
                tabIndex={focusedIndex === starIndex ? 0 : starIndex === 0 ? 0 : -1}
              />
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      <div 
        className="flex gap-1"
        role={readonly ? 'img' : 'radiogroup'}
        aria-label={`Rating: ${value} out of ${max} stars`}
      >
        {Array.from({ length: max }, (_, index) => renderStar(index))}
      </div>
      
      {showValue && (
        <span className="ml-2 text-sm text-gray-600">
          {value.toFixed(allowHalf ? 1 : 0)} / {max}
        </span>
      )}
    </div>
  )
}
