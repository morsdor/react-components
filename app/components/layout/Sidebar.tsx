'use client'

import { ComponentType } from '../../types/components'
import { COMPONENTS } from '../../data/components'
import { FiX } from 'react-icons/fi'

interface SidebarProps {
  selectedComponent: ComponentType
  onSelectComponent: (component: ComponentType) => void
  isOpen: boolean
  onToggle: () => void
}

/**
 * Collapsible sidebar navigation for component selection
 * Responsive design with mobile overlay behavior
 */
export function Sidebar({ selectedComponent, onSelectComponent, isOpen, onToggle }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-50 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between p-4 border-b">
          <h1 className="text-xl font-bold text-gray-900">Components</h1>
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Close sidebar"
          >
            <FiX size={20} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2 overflow-y-auto h-full">
          {COMPONENTS.map((component) => (
            <button
              key={component.id}
              onClick={() => {
                onSelectComponent(component.id)
                onToggle() // Close sidebar on mobile after selection
              }}
              className={`
                w-full text-left p-3 rounded-lg transition-colors duration-200
                ${selectedComponent === component.id 
                  ? 'bg-blue-100 text-blue-900 border-l-4 border-blue-500' 
                  : 'hover:bg-gray-100 text-gray-700'
                }
              `}
            >
              <div className="font-medium">{component.title}</div>
              <div className="text-sm text-gray-500 mt-1">{component.description}</div>
            </button>
          ))}
        </nav>
      </div>
    </>
  )
}
