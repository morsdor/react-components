'use client'

import { useState } from 'react'
import { TransferList, TransferItem } from '../ui/TransferList'
import { TRANSFER_LIST_DATA } from '../../data/mock-data'

/**
 * Demo component showcasing the TransferList functionality
 */
export function TransferListDemo() {
  const [availableItems, setAvailableItems] = useState<TransferItem[]>(TRANSFER_LIST_DATA.available)
  const [selectedItems, setSelectedItems] = useState<TransferItem[]>(TRANSFER_LIST_DATA.selected)

  const handleChange = (available: TransferItem[], selected: TransferItem[]) => {
    setAvailableItems(available)
    setSelectedItems(selected)
  }

  const resetDemo = () => {
    setAvailableItems(TRANSFER_LIST_DATA.available)
    setSelectedItems(TRANSFER_LIST_DATA.selected)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Transfer List Demo</h3>
          <button
            onClick={resetDemo}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Reset Demo
          </button>
        </div>
        
        <p className="text-gray-600 mb-6">
          Move items between the two lists using the transfer buttons or keyboard shortcuts.
        </p>

        <TransferList
          availableItems={availableItems}
          selectedItems={selectedItems}
          onChange={handleChange}
          availableTitle="Available Technologies"
          selectedTitle="Selected Technologies"
          height={350}
        />

        <div className="mt-4 text-sm text-gray-600">
          Available: {availableItems.length} items • Selected: {selectedItems.length} items
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Interaction Features:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <strong>Single Select:</strong> Click items to select/deselect</li>
          <li>• <strong>Multi-select:</strong> Hold <kbd className="bg-gray-200 px-2 py-1 rounded">Ctrl</kbd> (or <kbd className="bg-gray-200 px-2 py-1 rounded">Cmd</kbd>) while clicking</li>
          <li>• <strong>Range Select:</strong> Hold <kbd className="bg-gray-200 px-2 py-1 rounded">Shift</kbd> to select ranges</li>
          <li>• <strong>Select All:</strong> <kbd className="bg-gray-200 px-2 py-1 rounded">Ctrl+A</kbd> to select all items in focused list</li>
          <li>• <strong>Keyboard Navigation:</strong> <kbd className="bg-gray-200 px-2 py-1 rounded">↑</kbd> <kbd className="bg-gray-200 px-2 py-1 rounded">↓</kbd> to navigate, <kbd className="bg-gray-200 px-2 py-1 rounded">Space</kbd> to select</li>
          <li>• <strong>Transfer Buttons:</strong> Move selected items or all items between lists</li>
        </ul>
      </div>
    </div>
  )
}
