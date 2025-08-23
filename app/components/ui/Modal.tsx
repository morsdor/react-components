'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { FiX } from 'react-icons/fi'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

/**
 * Fully accessible modal dialog component
 * Implements WAI-ARIA guidelines with focus trapping and keyboard navigation
 */
export function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Size classes mapping
  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement as HTMLElement
      
      // Set aria-hidden on the main content
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.setAttribute('aria-hidden', 'true')
      }

      // Focus the modal
      setTimeout(() => {
        modalRef.current?.focus()
      }, 0)
    } else {
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }

      // Remove aria-hidden from main content
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden')
      }
    }

    return () => {
      // Cleanup on unmount
      const mainContent = document.querySelector('main')
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden')
      }
    }
  }, [isOpen])

  useEffect(() => {
    /**
     * Handle keyboard events for accessibility
     * Escape key closes modal, Tab key traps focus within modal
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return

      if (event.key === 'Escape') {
        onClose()
        return
      }

      if (event.key === 'Tab') {
        const modal = modalRef.current
        if (!modal) return

        const focusableElements = modal.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault()
            lastElement.focus()
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault()
            firstElement.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className={`
          relative bg-white rounded-lg shadow-xl w-full ${sizeClasses[size]}
          transform transition-all duration-200 ease-out
        `}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>,
    document.body
  )
}
