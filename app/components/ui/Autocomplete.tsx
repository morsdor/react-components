'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { FiChevronDown, FiX } from 'react-icons/fi'

interface AutocompleteOption {
  id: string
  label: string
  value: string
}

interface AutocompleteProps {
  options: AutocompleteOption[]
  placeholder?: string
  onSelect: (option: AutocompleteOption | null) => void
  debounceMs?: number
  maxResults?: number
  allowClear?: boolean
}

/**
 * High-performance autocomplete component with debouncing and accessibility
 * Implements WAI-ARIA combobox pattern with keyboard navigation
 */
export function Autocomplete({ 
  options, 
  placeholder = "Search...", 
  onSelect, 
  debounceMs = 300,
  maxResults = 10,
  allowClear = true
}: AutocompleteProps) {
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [selectedOption, setSelectedOption] = useState<AutocompleteOption | null>(null)
  const [debouncedValue, setDebouncedValue] = useState('')

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  // Debounce the input value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [inputValue, debounceMs])

  // Filter options based on debounced input
  const filteredOptions = useMemo(() => {
    if (!debouncedValue.trim()) return []
    
    return options
      .filter(option => 
        option.label.toLowerCase().includes(debouncedValue.toLowerCase()) ||
        option.value.toLowerCase().includes(debouncedValue.toLowerCase())
      )
      .slice(0, maxResults)
  }, [options, debouncedValue, maxResults])

  // Reset selected index when options change
  useEffect(() => {
    setSelectedIndex(-1)
  }, [filteredOptions])

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setIsOpen(true)
        setSelectedIndex(prev => 
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        )
        break
      
      case 'ArrowUp':
        event.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        )
        break
      
      case 'Enter':
        event.preventDefault()
        if (selectedIndex >= 0 && filteredOptions[selectedIndex]) {
          handleSelect(filteredOptions[selectedIndex])
        }
        break
      
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        inputRef.current?.blur()
        break
      
      case 'Tab':
        setIsOpen(false)
        break
    }
  }

  /**
   * Handle option selection
   */
  const handleSelect = (option: AutocompleteOption) => {
    setSelectedOption(option)
    setInputValue(option.label)
    setIsOpen(false)
    setSelectedIndex(-1)
    onSelect(option)
  }

  /**
   * Clear selection
   */
  const handleClear = () => {
    setSelectedOption(null)
    setInputValue('')
    setIsOpen(false)
    onSelect(null)
    inputRef.current?.focus()
  }

  return (
    <div className="relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value)
            setIsOpen(true)
            if (!e.target.value.trim()) {
              setSelectedOption(null)
              onSelect(null)
            }
          }}
          onFocus={() => {
            if (filteredOptions.length > 0) {
              setIsOpen(true)
            }
          }}
          onBlur={() => {
            // Delay closing to allow for option selection
            setTimeout(() => setIsOpen(false), 150)
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          aria-describedby="autocomplete-help"
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {allowClear && selectedOption && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded"
              aria-label="Clear selection"
            >
              <FiX size={16} />
            </button>
          )}
          <FiChevronDown 
            size={16} 
            className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </div>
      </div>

      {/* Results dropdown */}
      {isOpen && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredOptions.length === 0 ? (
            <li className="px-4 py-2 text-gray-500 text-sm">
              {debouncedValue ? 'No results found' : 'Start typing to search...'}
            </li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.id}
                role="option"
                aria-selected={index === selectedIndex}
                className={`
                  px-4 py-2 cursor-pointer transition-colors
                  ${index === selectedIndex 
                    ? 'bg-blue-100 text-blue-900' 
                    : 'hover:bg-gray-100'
                  }
                `}
                onClick={() => handleSelect(option)}
              >
                <div className="font-medium">{option.label}</div>
                {option.value !== option.label && (
                  <div className="text-sm text-gray-500">{option.value}</div>
                )}
              </li>
            ))
          )}
        </ul>
      )}

      <div id="autocomplete-help" className="sr-only">
        Use arrow keys to navigate options, Enter to select, Escape to close
      </div>
    </div>
  )
}
