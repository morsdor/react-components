'use client'

import { useState } from 'react'
import { MultiStepForm } from '../ui/MultiStepForm'
import { useToast } from '../toast/ToastProvider'

/**
 * Demo component showcasing the MultiStepForm functionality
 */
export function MultiStepFormDemo() {
  const [isCompleted, setIsCompleted] = useState(false)
  const [submittedData, setSubmittedData] = useState<any>(null)
  const { addToast } = useToast()

  const handleFormComplete = (data: any) => {
    setSubmittedData(data)
    setIsCompleted(true)
    addToast({
      type: 'success',
      title: 'Form Completed!',
      message: 'Your information has been successfully submitted.'
    })
  }

  const resetForm = () => {
    setIsCompleted(false)
    setSubmittedData(null)
  }

  if (isCompleted) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Form Completed Successfully!</h3>
          <p className="text-gray-600 mb-6">Thank you for providing your information.</p>
          
          <button
            onClick={resetForm}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Start Over
          </button>
        </div>

        {submittedData && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h4 className="font-semibold mb-3">Submitted Data:</h4>
            <pre className="text-sm bg-white p-4 rounded border overflow-auto">
              {JSON.stringify(submittedData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Multi-step Form Wizard Demo</h3>
        <p className="text-gray-600 mb-6">
          Complete all steps to submit the form. Each step has validation that prevents progression with invalid data.
        </p>
        
        <MultiStepForm onComplete={handleFormComplete} />
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Form Features:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <strong>Per-step Validation:</strong> Cannot proceed with invalid fields</li>
          <li>• <strong>Centralized State:</strong> Single reducer manages all form data</li>
          <li>• <strong>Progress Indicator:</strong> Visual progress with step completion</li>
          <li>• <strong>Real-time Validation:</strong> Errors clear as user types</li>
          <li>• <strong>Review Step:</strong> Final confirmation before submission</li>
        </ul>
      </div>
    </div>
  )
}
