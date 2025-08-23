'use client'

import { Toast } from './ToastProvider'
import { ToastItem } from './ToastItem'

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

/**
 * Container for rendering toast notifications
 * Handles stacking and positioning of multiple toasts
 */
export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}
