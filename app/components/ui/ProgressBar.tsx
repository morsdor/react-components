'use client'

import { useEffect, useState } from 'react'

export interface UploadProgress {
  id: string
  fileName: string
  progress: number
  status: 'pending' | 'uploading' | 'completed' | 'error'
  size?: number
}

interface ProgressBarProps {
  uploads: UploadProgress[]
  onRemove?: (id: string) => void
}

/**
 * Individual progress bar component
 */
function ProgressBarItem({ upload, onRemove }: { upload: UploadProgress; onRemove?: (id: string) => void }) {
  const getStatusColor = () => {
    switch (upload.status) {
      case 'uploading':
        return 'bg-blue-500'
      case 'completed':
        return 'bg-green-500'
      case 'error':
        return 'bg-red-500'
      default:
        return 'bg-gray-300'
    }
  }

  const getStatusText = () => {
    switch (upload.status) {
      case 'pending':
        return 'Pending...'
      case 'uploading':
        return `${upload.progress}%`
      case 'completed':
        return 'Completed'
      case 'error':
        return 'Error'
      default:
        return ''
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return ''
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{upload.fileName}</h4>
          {upload.size && (
            <p className="text-sm text-gray-500">{formatFileSize(upload.size)}</p>
          )}
        </div>
        
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${
            upload.status === 'error' ? 'text-red-600' : 
            upload.status === 'completed' ? 'text-green-600' : 
            'text-gray-600'
          }`}>
            {getStatusText()}
          </span>
          
          {onRemove && upload.status !== 'uploading' && (
            <button
              onClick={() => onRemove(upload.id)}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-out ${getStatusColor()}`}
          style={{ width: `${upload.progress}%` }}
        />
      </div>

      {/* Status indicator */}
      <div className="flex items-center mt-2 text-xs text-gray-500">
        <div className={`w-2 h-2 rounded-full mr-2 ${
          upload.status === 'uploading' ? 'bg-blue-500 animate-pulse' :
          upload.status === 'completed' ? 'bg-green-500' :
          upload.status === 'error' ? 'bg-red-500' :
          'bg-gray-300'
        }`} />
        
        {upload.status === 'uploading' && 'Uploading...'}
        {upload.status === 'completed' && 'Upload completed successfully'}
        {upload.status === 'error' && 'Upload failed - please try again'}
        {upload.status === 'pending' && 'Waiting to start...'}
      </div>
    </div>
  )
}

/**
 * Progress bar component for concurrent uploads
 * Manages multiple upload states with independent progress tracking
 */
export function ProgressBar({ uploads, onRemove }: ProgressBarProps) {
  const completedCount = uploads.filter(u => u.status === 'completed').length
  const errorCount = uploads.filter(u => u.status === 'error').length
  const uploadingCount = uploads.filter(u => u.status === 'uploading').length

  if (uploads.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No uploads in progress
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-600">
            Total: {uploads.length} files
          </span>
          <div className="flex gap-4">
            {uploadingCount > 0 && (
              <span className="text-blue-600">
                Uploading: {uploadingCount}
              </span>
            )}
            {completedCount > 0 && (
              <span className="text-green-600">
                Completed: {completedCount}
              </span>
            )}
            {errorCount > 0 && (
              <span className="text-red-600">
                Errors: {errorCount}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Individual progress bars */}
      <div className="space-y-3">
        {uploads.map((upload) => (
          <ProgressBarItem
            key={upload.id}
            upload={upload}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  )
}
