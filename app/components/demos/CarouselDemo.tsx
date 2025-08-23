'use client'

import { useState } from 'react'
import { Carousel } from '../ui/Carousel'
import { CAROUSEL_IMAGES } from '../../data/mock-data'

/**
 * Demo component showcasing the Carousel functionality
 */
export function CarouselDemo() {
  const [autoplay, setAutoplay] = useState(true)
  const [showCaptions, setShowCaptions] = useState(true)
  const [showDots, setShowDots] = useState(true)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Image Carousel Demo</h3>
        
        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={autoplay}
              onChange={(e) => setAutoplay(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Autoplay</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showCaptions}
              onChange={(e) => setShowCaptions(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Show Captions</span>
          </label>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showDots}
              onChange={(e) => setShowDots(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Show Dots</span>
          </label>
        </div>

        <Carousel
          items={CAROUSEL_IMAGES}
          autoplay={autoplay}
          autoplayInterval={3000}
          showCaptions={showCaptions}
          showDots={showDots}
        />
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Accessibility Features:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <strong>Keyboard Navigation:</strong> Use ← → arrow keys to navigate slides</li>
          <li>• <strong>Spacebar Control:</strong> Press spacebar to toggle autoplay</li>
          <li>• <strong>Hover Pause:</strong> Autoplay pauses when hovering over carousel</li>
          <li>• <strong>Screen Reader Support:</strong> ARIA live regions announce slide changes</li>
          <li>• <strong>Focus Management:</strong> Proper focus indicators for all interactive elements</li>
        </ul>
      </div>
    </div>
  )
}
