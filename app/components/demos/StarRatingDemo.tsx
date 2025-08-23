'use client'

import { useState } from 'react'
import { StarRating } from '../ui/StarRating'

/**
 * Demo component showcasing the StarRating functionality
 */
export function StarRatingDemo() {
  const [rating1, setRating1] = useState(3.5)
  const [rating2, setRating2] = useState(4)
  const [rating3, setRating3] = useState(2.5)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-6">Star Rating Widget Demo</h3>
        
        <div className="space-y-8">
          {/* Interactive with half stars */}
          <div>
            <h4 className="font-medium mb-3">Interactive with Half Stars</h4>
            <StarRating
              value={rating1}
              onChange={setRating1}
              allowHalf={true}
              showValue={true}
              size="lg"
            />
            <p className="text-sm text-gray-600 mt-2">
              Click on the left or right side of stars for half ratings
            </p>
          </div>

          {/* Interactive whole stars only */}
          <div>
            <h4 className="font-medium mb-3">Interactive - Whole Stars Only</h4>
            <StarRating
              value={rating2}
              onChange={setRating2}
              allowHalf={false}
              showValue={true}
              size="md"
            />
          </div>

          {/* Read-only display */}
          <div>
            <h4 className="font-medium mb-3">Read-only Display</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <StarRating value={4.5} readonly={true} size="sm" showValue={true} />
                <span className="text-sm text-gray-600">Product A</span>
              </div>
              <div className="flex items-center gap-4">
                <StarRating value={3.0} readonly={true} size="sm" showValue={true} />
                <span className="text-sm text-gray-600">Product B</span>
              </div>
              <div className="flex items-center gap-4">
                <StarRating value={5.0} readonly={true} size="sm" showValue={true} />
                <span className="text-sm text-gray-600">Product C</span>
              </div>
            </div>
          </div>

          {/* Different sizes */}
          <div>
            <h4 className="font-medium mb-3">Different Sizes</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <StarRating value={rating3} onChange={setRating3} size="sm" />
                <span className="text-sm text-gray-600">Small</span>
              </div>
              <div className="flex items-center gap-4">
                <StarRating value={rating3} onChange={setRating3} size="md" />
                <span className="text-sm text-gray-600">Medium</span>
              </div>
              <div className="flex items-center gap-4">
                <StarRating value={rating3} onChange={setRating3} size="lg" />
                <span className="text-sm text-gray-600">Large</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Keyboard Navigation:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <kbd className="bg-gray-200 px-2 py-1 rounded">←</kbd> <kbd className="bg-gray-200 px-2 py-1 rounded">→</kbd> Navigate between ratings</li>
          <li>• <kbd className="bg-gray-200 px-2 py-1 rounded">↑</kbd> <kbd className="bg-gray-200 px-2 py-1 rounded">↓</kbd> Alternative navigation</li>
          <li>• <kbd className="bg-gray-200 px-2 py-1 rounded">Home</kbd> Set to 0 stars</li>
          <li>• <kbd className="bg-gray-200 px-2 py-1 rounded">End</kbd> Set to maximum stars</li>
          <li>• <kbd className="bg-gray-200 px-2 py-1 rounded">Enter</kbd> or <kbd className="bg-gray-200 px-2 py-1 rounded">Space</kbd> Select current rating</li>
        </ul>
      </div>
    </div>
  )
}
