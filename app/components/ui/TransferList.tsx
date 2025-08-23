'use client'

import { useState } from 'react'
import { FiChevronRight, FiChevronLeft, FiChevronsRight, FiChevronsLeft } from 'react-icons/fi'

export interface TransferItem {
  id: string
  label: string
  category?: string
}

interface TransferListProps {
  availableItems: TransferItem[]
  selectedItems: TransferItem[]
  onChange: (available: TransferItem[], selected: TransferItem[]) => void
  availableTitle?: string
  selectedTitle?: string
  height?: number
}

/**
 * Transfer list component for moving items between two lists
 * Supports single, multiple, and bulk item transfers with full keyboard accessibility
 */
export function TransferList({
  availableItems,
  selectedItems,
  onChange,
  availableTitle = "Available",
  selectedTitle = "Selected",
  height = 300
}: TransferListProps) {
  const [availableSelected, setAvailableSelected] = useState<Set<string>>(new Set())
  const [selectedSelected, setSelectedSelected] = useState<Set<string>>(new Set())

  /**
   * Handle item selection in a list
   */
  const handleItemSelect = (
    itemId: string, 
    isSelected: boolean, 
    listType: 'available' | 'selected',
    event: React.MouseEvent | React.KeyboardEvent
  ) => {
    const currentSelection = listType === 'available' ? availableSelected : selectedSelected
    const setSelection = listType === 'available' ? setAvailableSelected : setSelectedSelected
    
    const newSelection = new Set(currentSelection)
    
    if (event.ctrlKey || event.metaKey) {
      // Multi-select with Ctrl/Cmd
      if (isSelected) {
        newSelection.delete(itemId)
      } else {
        newSelection.add(itemId)
      }
    } else if (event.shiftKey && currentSelection.size > 0) {
      // Range select with Shift
      const items = listType === 'available' ? availableItems : selectedItems
      const currentIndex = items.findIndex(item => item.id === itemId)
      const lastSelectedIndex = items.findIndex(item => currentSelection.has(item.id))
      
      if (lastSelectedIndex !== -1) {
        const start = Math.min(currentIndex, lastSelectedIndex)
        const end = Math.max(currentIndex, lastSelectedIndex)
        
        for (let i = start; i <= end; i++) {
          newSelection.add(items[i].id)
        }
      }
    } else {
      // Single select
      newSelection.clear()
      if (!isSelected) {
        newSelection.add(itemId)
      }
    }
    
    setSelection(newSelection)
  }

  /**
   * Move selected items from available to selected
   */
  const moveToSelected = () => {
    const itemsToMove = availableItems.filter(item => availableSelected.has(item.id))
    const newAvailable = availableItems.filter(item => !availableSelected.has(item.id))
    const newSelected = [...selectedItems, ...itemsToMove]
    
    onChange(newAvailable, newSelected)
    setAvailableSelected(new Set())
  }

  /**
   * Move selected items from selected to available
   */
  const moveToAvailable = () => {
    const itemsToMove = selectedItems.filter(item => selectedSelected.has(item.id))
    const newSelected = selectedItems.filter(item => !selectedSelected.has(item.id))
    const newAvailable = [...availableItems, ...itemsToMove]
    
    onChange(newAvailable, newSelected)
    setSelectedSelected(new Set())
  }

  /**
   * Move all items to selected
   */
  const moveAllToSelected = () => {
    const newSelected = [...selectedItems, ...availableItems]
    onChange([], newSelected)
    setAvailableSelected(new Set())
  }

  /**
   * Move all items to available
   */
  const moveAllToAvailable = () => {
    const newAvailable = [...availableItems, ...selectedItems]
    onChange(newAvailable, [])
    setSelectedSelected(new Set())
  }

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (
    event: React.KeyboardEvent,
    itemId: string,
    listType: 'available' | 'selected'
  ) => {
    const items = listType === 'available' ? availableItems : selectedItems
    const currentSelection = listType === 'available' ? availableSelected : selectedSelected
    const currentIndex = items.findIndex(item => item.id === itemId)

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault()
        if (currentIndex > 0) {
          const prevItem = items[currentIndex - 1]
          document.getElementById(`${listType}-${prevItem.id}`)?.focus()
        }
        break
      
      case 'ArrowDown':
        event.preventDefault()
        if (currentIndex < items.length - 1) {
          const nextItem = items[currentIndex + 1]
          document.getElementById(`${listType}-${nextItem.id}`)?.focus()
        }
        break
      
      case 'Enter':
      case ' ':
        event.preventDefault()
        handleItemSelect(itemId, currentSelection.has(itemId), listType, event)
        break
      
      case 'a':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault()
          const setSelection = listType === 'available' ? setAvailableSelected : setSelectedSelected
          setSelection(new Set(items.map(item => item.id)))
        }
        break
    }
  }

  /**
   * Render item list
   */
  const renderList = (items: TransferItem[], listType: 'available' | 'selected') => {
    const currentSelection = listType === 'available' ? availableSelected : selectedSelected
    
    return (
      <div className="border border-gray-300 rounded-lg bg-white">
        <div className="bg-gray-50 px-4 py-2 border-b border-gray-300">
          <h4 className="font-medium text-gray-900">
            {listType === 'available' ? availableTitle : selectedTitle} ({items.length})
          </h4>
        </div>
        
        <div 
          className="overflow-y-auto p-2 space-y-1"
          style={{ height }}
          role="listbox"
          aria-multiselectable="true"
        >
          {items.length === 0 ? (
            <div className="text-center text-gray-500 py-8 text-sm">
              No items
            </div>
          ) : (
            items.map((item) => {
              const isSelected = currentSelection.has(item.id)
              return (
                <div
                  key={item.id}
                  id={`${listType}-${item.id}`}
                  className={`
                    px-3 py-2 rounded cursor-pointer transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
                    ${isSelected 
                      ? 'bg-blue-100 text-blue-900 border border-blue-300' 
                      : 'hover:bg-gray-100 border border-transparent'
                    }
                  `}
                  onClick={(e) => handleItemSelect(item.id, isSelected, listType, e)}
                  onKeyDown={(e) => handleKeyDown(e, item.id, listType)}
                  tabIndex={0}
                  role="option"
                  aria-selected={isSelected}
                >
                  <div className="font-medium text-sm">{item.label}</div>
                  {item.category && (
                    <div className="text-xs text-gray-500">{item.category}</div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex gap-4 items-center">
      {/* Available items */}
      <div className="flex-1">
        {renderList(availableItems, 'available')}
      </div>

      {/* Transfer controls */}
      <div className="flex flex-col gap-2">
        <button
          onClick={moveToSelected}
          disabled={availableSelected.size === 0}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Move selected to right"
          aria-label="Move selected items to selected list"
        >
          <FiChevronRight size={20} />
        </button>
        
        <button
          onClick={moveAllToSelected}
          disabled={availableItems.length === 0}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Move all to right"
          aria-label="Move all items to selected list"
        >
          <FiChevronsRight size={20} />
        </button>
        
        <button
          onClick={moveAllToAvailable}
          disabled={selectedItems.length === 0}
          className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Move all to left"
          aria-label="Move all items to available list"
        >
          <FiChevronsLeft size={20} />
        </button>
        
        <button
          onClick={moveToAvailable}
          disabled={selectedSelected.size === 0}
          className="p-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Move selected to left"
          aria-label="Move selected items to available list"
        >
          <FiChevronLeft size={20} />
        </button>
      </div>

      {/* Selected items */}
      <div className="flex-1">
        {renderList(selectedItems, 'selected')}
      </div>
    </div>
  )
}
