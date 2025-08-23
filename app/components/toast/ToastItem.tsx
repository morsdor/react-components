'use client'

import { useEffect, useState } from 'react'
import { FiX, FiCheckCircle, FiXCircle, FiAlertTriangle, FiInfo } from 'react-icons/fi'
import { Toast } from './ToastProvider'

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

/**
 * Individual toast notification component
 * Handles animations and auto-dismiss functionality
 */
export function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Trigger enter animation
    setTimeout(() => setIsVisible(true), 10)
  }, [])

  const handleRemove = () => {
    setIsLeaving(true)
    setTimeout(() => onRemove(toast.id), 300)
  }

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <FiCheckCircle className="text-green-500" size={20} />
      case 'error':
        return <FiXCircle className="text-red-500" size={20} />
      case 'warning':
        return <FiAlertTriangle className="text-yellow-500" size={20} />
      case 'info':
        return <FiInfo className="text-blue-500" size={20} />
    }
  }

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
    }
  }

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isLeaving 
          ? 'translate-x-0 opacity-100' 
          : 'translate-x-full opacity-0'
        }
      `}
    >
      <div className={`
        ${getBackgroundColor()}
        border rounded-lg shadow-lg p-4 flex items-start gap-3
      `}>
        {getIcon()}
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900">
            {toast.title}
          </h4>
          {toast.message && (
            <p className="text-sm text-gray-600 mt-1">
              {toast.message}
            </p>
          )}
        </div>

        <button
          onClick={handleRemove}
          className="flex-shrink-0 p-1 rounded-md hover:bg-gray-100 transition-colors"
          aria-label="Close notification"
        >
          <FiX size={16} />
        </button>
      </div>
    </div>
  )
}
