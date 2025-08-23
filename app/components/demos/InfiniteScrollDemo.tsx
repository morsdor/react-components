'use client'

import { useState, useCallback } from 'react'
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll'

interface Item {
  id: number
  title: string
  description: string
  category: string
}

/**
 * Demo component showcasing the useInfiniteScroll hook
 */
export function InfiniteScrollDemo() {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [page, setPage] = useState(0)

  // Simulate API call to fetch more items
  const fetchMoreItems = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    const newItems: Item[] = Array.from({ length: 10 }, (_, index) => {
      const id = page * 10 + index + 1
      const categories = ['Technology', 'Design', 'Business', 'Science', 'Art']
      return {
        id,
        title: `Item ${id}`,
        description: `This is the description for item ${id}. It contains some sample text to demonstrate the infinite scroll functionality.`,
        category: categories[Math.floor(Math.random() * categories.length)]
      }
    })

    setItems(prev => [...prev, ...newItems])
    setPage(prev => prev + 1)
    setIsLoading(false)

    // Simulate reaching end of data after 5 pages
    if (page >= 4) {
      setHasNextPage(false)
    }
  }, [page, isLoading])

  // Initialize with first batch of items
  useState(() => {
    fetchMoreItems()
  })

  const { loadingRef } = useInfiniteScroll(fetchMoreItems, {
    hasNextPage,
    isFetchingNextPage: isLoading
  })

  const resetDemo = () => {
    setItems([])
    setPage(0)
    setHasNextPage(true)
    setIsLoading(false)
    fetchMoreItems()
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Infinite Scroll Demo</h3>
          <button
            onClick={resetDemo}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Reset Demo
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Scroll down to automatically load more items. The hook uses IntersectionObserver for efficient detection.
        </p>

        {/* Items list */}
        <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
          {items.map((item) => (
            <div key={item.id} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{item.title}</h4>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          ))}

          {/* Loading indicator / Observer target */}
          <div ref={loadingRef} className="py-4 text-center">
            {isLoading && (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span className="text-gray-600">Loading more items...</span>
              </div>
            )}
            
            {!hasNextPage && items.length > 0 && (
              <p className="text-gray-500">No more items to load</p>
            )}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Loaded {items.length} items • Page {page}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Hook Features:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <strong>IntersectionObserver:</strong> Efficient scroll detection without scroll event listeners</li>
          <li>• <strong>Configurable Threshold:</strong> Customize when to trigger loading (default: 1.0)</li>
          <li>• <strong>Loading State Management:</strong> Prevents duplicate requests during loading</li>
          <li>• <strong>Generic & Reusable:</strong> Works with any data fetching function</li>
          <li>• <strong>Performance Optimized:</strong> Minimal re-renders and efficient cleanup</li>
        </ul>
      </div>
    </div>
  )
}
