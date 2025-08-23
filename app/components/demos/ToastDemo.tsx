'use client'

import { useToast } from '../toast/ToastProvider'

/**
 * Demo component showcasing the Toast notification system
 */
export function ToastDemo() {
  const { addToast } = useToast()

  const showSuccessToast = () => {
    addToast({
      type: 'success',
      title: 'Success!',
      message: 'Your action was completed successfully.',
      duration: 4000
    })
  }

  const showErrorToast = () => {
    addToast({
      type: 'error',
      title: 'Error occurred',
      message: 'Something went wrong. Please try again.',
      duration: 6000
    })
  }

  const showWarningToast = () => {
    addToast({
      type: 'warning',
      title: 'Warning',
      message: 'Please review your input before proceeding.',
      duration: 5000
    })
  }

  const showInfoToast = () => {
    addToast({
      type: 'info',
      title: 'Information',
      message: 'Here\'s some helpful information for you.',
      duration: 4000
    })
  }

  const showMultipleToasts = () => {
    addToast({
      type: 'info',
      title: 'First toast',
      message: 'This is the first toast in a series.'
    })
    
    setTimeout(() => {
      addToast({
        type: 'success',
        title: 'Second toast',
        message: 'This is the second toast.'
      })
    }, 500)
    
    setTimeout(() => {
      addToast({
        type: 'warning',
        title: 'Third toast',
        message: 'This is the third toast.'
      })
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Toast Notification Demo</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <button
            onClick={showSuccessToast}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            Success Toast
          </button>
          
          <button
            onClick={showErrorToast}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Error Toast
          </button>
          
          <button
            onClick={showWarningToast}
            className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
          >
            Warning Toast
          </button>
          
          <button
            onClick={showInfoToast}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Info Toast
          </button>
        </div>

        <button
          onClick={showMultipleToasts}
          className="bg-purple-600 text-white px-6 py-3 rounded-md hover:bg-purple-700 transition-colors"
        >
          Show Multiple Toasts
        </button>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Toast Features:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <strong>Centralized Management:</strong> Use useToast() hook from any component</li>
          <li>• <strong>Auto-dismiss:</strong> Toasts automatically disappear after specified duration</li>
          <li>• <strong>Stacking:</strong> Multiple toasts stack neatly with smooth animations</li>
          <li>• <strong>Manual Dismiss:</strong> Click the X button to close immediately</li>
          <li>• <strong>Type Variants:</strong> Success, Error, Warning, and Info styles</li>
        </ul>
      </div>
    </div>
  )
}
