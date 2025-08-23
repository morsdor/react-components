'use client'

import { useState, useReducer } from 'react'
import { FiChevronLeft, FiChevronRight, FiCheck } from 'react-icons/fi'

interface FormData {
  personalInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  accountSetup: {
    username: string
    password: string
    confirmPassword: string
    newsletter: boolean
  }
  preferences: {
    theme: 'light' | 'dark' | 'auto'
    notifications: string[]
    language: string
  }
}

interface FormErrors {
  [key: string]: string
}

type FormAction = 
  | { type: 'UPDATE_FIELD'; step: keyof FormData; field: string; value: any }
  | { type: 'SET_ERRORS'; errors: FormErrors }
  | { type: 'CLEAR_ERRORS' }

const initialFormData: FormData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  },
  accountSetup: {
    username: '',
    password: '',
    confirmPassword: '',
    newsletter: false
  },
  preferences: {
    theme: 'light',
    notifications: [],
    language: 'en'
  }
}

/**
 * Multi-step form wizard with validation and state management
 * Implements per-step validation and centralized state management
 */
export function MultiStepForm({ onComplete }: { onComplete?: (data: FormData) => void }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<FormErrors>({})

  const [formData, dispatch] = useReducer((state: FormData, action: FormAction) => {
    switch (action.type) {
      case 'UPDATE_FIELD':
        return {
          ...state,
          [action.step]: {
            ...state[action.step],
            [action.field]: action.value
          }
        }
      default:
        return state
    }
  }, initialFormData)

  const steps = [
    { id: 'personalInfo', title: 'Personal Information', description: 'Tell us about yourself' },
    { id: 'accountSetup', title: 'Account Setup', description: 'Create your account' },
    { id: 'preferences', title: 'Preferences', description: 'Customize your experience' },
    { id: 'review', title: 'Review', description: 'Review and confirm' }
  ]

  /**
   * Update form field
   */
  const updateField = (step: keyof FormData, field: string, value: any) => {
    dispatch({ type: 'UPDATE_FIELD', step, field, value })
    // Clear field error when user starts typing
    if (errors[`${step}.${field}`]) {
      const newErrors = { ...errors }
      delete newErrors[`${step}.${field}`]
      setErrors(newErrors)
    }
  }

  /**
   * Validate current step
   */
  const validateStep = (stepIndex: number): boolean => {
    const newErrors: FormErrors = {}

    switch (stepIndex) {
      case 0: // Personal Info
        if (!formData.personalInfo.firstName.trim()) {
          newErrors['personalInfo.firstName'] = 'First name is required'
        }
        if (!formData.personalInfo.lastName.trim()) {
          newErrors['personalInfo.lastName'] = 'Last name is required'
        }
        if (!formData.personalInfo.email.trim()) {
          newErrors['personalInfo.email'] = 'Email is required'
        } else if (!/\S+@\S+\.\S+/.test(formData.personalInfo.email)) {
          newErrors['personalInfo.email'] = 'Email is invalid'
        }
        if (!formData.personalInfo.phone.trim()) {
          newErrors['personalInfo.phone'] = 'Phone number is required'
        }
        break

      case 1: // Account Setup
        if (!formData.accountSetup.username.trim()) {
          newErrors['accountSetup.username'] = 'Username is required'
        } else if (formData.accountSetup.username.length < 3) {
          newErrors['accountSetup.username'] = 'Username must be at least 3 characters'
        }
        if (!formData.accountSetup.password) {
          newErrors['accountSetup.password'] = 'Password is required'
        } else if (formData.accountSetup.password.length < 6) {
          newErrors['accountSetup.password'] = 'Password must be at least 6 characters'
        }
        if (formData.accountSetup.password !== formData.accountSetup.confirmPassword) {
          newErrors['accountSetup.confirmPassword'] = 'Passwords do not match'
        }
        break

      case 2: // Preferences
        // No required fields in preferences step
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Go to next step
   */
  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  /**
   * Go to previous step
   */
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  /**
   * Submit form
   */
  const handleSubmit = () => {
    if (validateStep(2)) { // Validate all previous steps
      onComplete?.(formData)
    }
  }

  /**
   * Render step content
   */
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.firstName}
                  onChange={(e) => updateField('personalInfo', 'firstName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['personalInfo.firstName'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors['personalInfo.firstName'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['personalInfo.firstName']}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.personalInfo.lastName}
                  onChange={(e) => updateField('personalInfo', 'lastName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors['personalInfo.lastName'] ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors['personalInfo.lastName'] && (
                  <p className="text-red-500 text-sm mt-1">{errors['personalInfo.lastName']}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                value={formData.personalInfo.email}
                onChange={(e) => updateField('personalInfo', 'email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors['personalInfo.email'] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors['personalInfo.email'] && (
                <p className="text-red-500 text-sm mt-1">{errors['personalInfo.email']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={formData.personalInfo.phone}
                onChange={(e) => updateField('personalInfo', 'phone', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors['personalInfo.phone'] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors['personalInfo.phone'] && (
                <p className="text-red-500 text-sm mt-1">{errors['personalInfo.phone']}</p>
              )}
            </div>
          </div>
        )

      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username *
              </label>
              <input
                type="text"
                value={formData.accountSetup.username}
                onChange={(e) => updateField('accountSetup', 'username', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors['accountSetup.username'] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors['accountSetup.username'] && (
                <p className="text-red-500 text-sm mt-1">{errors['accountSetup.username']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <input
                type="password"
                value={formData.accountSetup.password}
                onChange={(e) => updateField('accountSetup', 'password', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors['accountSetup.password'] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors['accountSetup.password'] && (
                <p className="text-red-500 text-sm mt-1">{errors['accountSetup.password']}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <input
                type="password"
                value={formData.accountSetup.confirmPassword}
                onChange={(e) => updateField('accountSetup', 'confirmPassword', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors['accountSetup.confirmPassword'] ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors['accountSetup.confirmPassword'] && (
                <p className="text-red-500 text-sm mt-1">{errors['accountSetup.confirmPassword']}</p>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="newsletter"
                checked={formData.accountSetup.newsletter}
                onChange={(e) => updateField('accountSetup', 'newsletter', e.target.checked)}
                className="rounded"
              />
              <label htmlFor="newsletter" className="ml-2 text-sm text-gray-700">
                Subscribe to our newsletter
              </label>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme Preference
              </label>
              <select
                value={formData.preferences.theme}
                onChange={(e) => updateField('preferences', 'theme', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notification Preferences
              </label>
              <div className="space-y-2">
                {['Email updates', 'SMS notifications', 'Push notifications', 'Marketing emails'].map((option) => (
                  <label key={option} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.preferences.notifications.includes(option)}
                      onChange={(e) => {
                        const notifications = e.target.checked
                          ? [...formData.preferences.notifications, option]
                          : formData.preferences.notifications.filter(n => n !== option)
                        updateField('preferences', 'notifications', notifications)
                      }}
                      className="rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={formData.preferences.language}
                onChange={(e) => updateField('preferences', 'language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Personal Information</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2">{formData.personalInfo.firstName} {formData.personalInfo.lastName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2">{formData.personalInfo.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">Phone:</span>
                  <span className="ml-2">{formData.personalInfo.phone}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Account Setup</h4>
              <div className="text-sm space-y-2">
                <div>
                  <span className="text-gray-600">Username:</span>
                  <span className="ml-2">{formData.accountSetup.username}</span>
                </div>
                <div>
                  <span className="text-gray-600">Newsletter:</span>
                  <span className="ml-2">{formData.accountSetup.newsletter ? 'Subscribed' : 'Not subscribed'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Preferences</h4>
              <div className="text-sm space-y-2">
                <div>
                  <span className="text-gray-600">Theme:</span>
                  <span className="ml-2 capitalize">{formData.preferences.theme}</span>
                </div>
                <div>
                  <span className="text-gray-600">Language:</span>
                  <span className="ml-2">{formData.preferences.language.toUpperCase()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Notifications:</span>
                  <span className="ml-2">
                    {formData.preferences.notifications.length > 0 
                      ? formData.preferences.notifications.join(', ')
                      : 'None selected'
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                ${index < currentStep 
                  ? 'bg-green-500 text-white' 
                  : index === currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }
              `}>
                {index < currentStep ? <FiCheck size={16} /> : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-16 h-1 mx-2 ${
                  index < currentStep ? 'bg-green-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-4 text-center">
          <h3 className="text-lg font-semibold">{steps[currentStep].title}</h3>
          <p className="text-gray-600">{steps[currentStep].description}</p>
        </div>
      </div>

      {/* Form content */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        {renderStepContent()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiChevronLeft size={16} />
          Previous
        </button>

        {currentStep < steps.length - 1 ? (
          <button
            onClick={nextStep}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Next
            <FiChevronRight size={16} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          >
            <FiCheck size={16} />
            Complete
          </button>
        )}
      </div>
    </div>
  )
}
