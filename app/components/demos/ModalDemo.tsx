'use client'

import { useState } from 'react'
import { Modal } from '../ui/Modal'

/**
 * Demo component showcasing the Modal functionality
 */
export function ModalDemo() {
  const [isOpen, setIsOpen] = useState(false)
  const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md')

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Modal Dialog Demo</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modal Size
            </label>
            <select 
              value={modalSize} 
              onChange={(e) => setModalSize(e.target.value as any)}
              className="border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
              <option value="xl">Extra Large</option>
            </select>
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Open Modal
          </button>
        </div>
      </div>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Accessible Modal Dialog"
        size={modalSize}
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            This modal demonstrates full accessibility compliance with WAI-ARIA guidelines.
            Try the following interactions:
          </p>
          
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>Press <kbd className="bg-gray-100 px-2 py-1 rounded">Escape</kbd> to close</li>
            <li>Click the backdrop to close</li>
            <li>Use <kbd className="bg-gray-100 px-2 py-1 rounded">Tab</kbd> to navigate focusable elements</li>
            <li>Focus is trapped within the modal</li>
            <li>Background content is hidden from screen readers</li>
          </ul>

          <div className="flex gap-2 pt-4">
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
              Sample Button 1
            </button>
            <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors">
              Sample Button 2
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
