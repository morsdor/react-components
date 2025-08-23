'use client'

import { useState } from 'react'
import { Autocomplete } from '../ui/Autocomplete'
import { COUNTRIES_DATA } from '../../data/mock-data'

/**
 * Demo component showcasing the Autocomplete functionality
 */
export function AutocompleteDemo() {
  const [selectedCountry, setSelectedCountry] = useState<any>(null)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Autocomplete Demo</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search for a country
            </label>
            <Autocomplete
              options={COUNTRIES_DATA}
              placeholder="Type to search countries..."
              onSelect={setSelectedCountry}
              debounceMs={300}
              maxResults={8}
            />
          </div>

          {selectedCountry && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-md">
              <h4 className="font-medium text-green-900">Selected Country:</h4>
              <p className="text-green-700">
                <strong>{selectedCountry.label}</strong> - Capital: {selectedCountry.value}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Try these interactions:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• Type to see debounced search results (300ms delay)</li>
          <li>• Use <kbd className="bg-gray-200 px-2 py-1 rounded">↑</kbd> and <kbd className="bg-gray-200 px-2 py-1 rounded">↓</kbd> arrow keys to navigate</li>
          <li>• Press <kbd className="bg-gray-200 px-2 py-1 rounded">Enter</kbd> to select highlighted option</li>
          <li>• Press <kbd className="bg-gray-200 px-2 py-1 rounded">Escape</kbd> to close dropdown</li>
          <li>• Click the X button to clear selection</li>
        </ul>
      </div>
    </div>
  )
}
