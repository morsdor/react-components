'use client'

import { useState, useCallback } from 'react'
import { ProgressBar, UploadProgress } from '../ui/ProgressBar'

/**
 * Demo component showcasing the ProgressBar functionality
 */
export function ProgressBarDemo() {
  const [uploads, setUploads] = useState<UploadProgress[]>([])

  /**
   * Simulate file upload with progress updates
   */
  const simulateUpload = useCallback((upload: UploadProgress) => {
    const updateProgress = () => {
      setUploads(prev => prev.map(u => {
        if (u.id !== upload.id) return u
        
        if (u.status === 'pending') {
          return { ...u, status: 'uploading', progress: 0 }
        }
        
        if (u.status === 'uploading') {
          const newProgress = Math.min(u.progress + Math.random() * 15, 100)
          
          if (newProgress >= 100) {
            // Randomly simulate success or error
            const success = Math.random() > 0.2 // 80% success rate
            return {
              ...u,
              progress: 100,
              status: success ? 'completed' : 'error'
            }
          }
          
          return { ...u, progress: newProgress }
        }
        
        return u
      }))
    }

    // Start uploading after a short delay
    setTimeout(() => {
      const interval = setInterval(() => {
        setUploads(current => {
          const currentUpload = current.find(u => u.id === upload.id)
          if (!currentUpload || currentUpload.status === 'completed' || currentUpload.status === 'error') {
            clearInterval(interval)
            return current
          }
          
          updateProgress()
          return current
        })
      }, 200 + Math.random() * 300) // Variable speed for realism
    }, Math.random() * 1000)
  }, [])

  /**
   * Add new upload
   */
  const addUpload = () => {
    const fileNames = [
      'document.pdf',
      'presentation.pptx',
      'spreadsheet.xlsx',
      'image.jpg',
      'video.mp4',
      'archive.zip',
      'code.js',
      'data.csv'
    ]
    
    const fileName = fileNames[Math.floor(Math.random() * fileNames.length)]
    const size = Math.floor(Math.random() * 50000000) + 1000000 // 1MB to 50MB
    
    const newUpload: UploadProgress = {
      id: `upload-${Date.now()}-${Math.random()}`,
      fileName: `${fileName.split('.')[0]}_${Date.now()}.${fileName.split('.')[1]}`,
      progress: 0,
      status: 'pending',
      size
    }

    setUploads(prev => [...prev, newUpload])
    simulateUpload(newUpload)
  }

  /**
   * Add multiple uploads
   */
  const addMultipleUploads = () => {
    const count = Math.floor(Math.random() * 4) + 2 // 2-5 files
    for (let i = 0; i < count; i++) {
      setTimeout(() => addUpload(), i * 200)
    }
  }

  /**
   * Remove upload
   */
  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id))
  }

  /**
   * Clear all uploads
   */
  const clearAll = () => {
    setUploads([])
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Concurrent Upload Progress Demo</h3>
          <div className="flex gap-2">
            <button
              onClick={addUpload}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Upload
            </button>
            <button
              onClick={addMultipleUploads}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add Multiple
            </button>
            <button
              onClick={clearAll}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          Simulate concurrent file uploads with independent progress tracking. Each upload has its own state and visual indicators.
        </p>

        <ProgressBar uploads={uploads} onRemove={removeUpload} />
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Progress Features:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <strong>Independent State:</strong> Each upload maintains its own progress and status</li>
          <li>• <strong>Visual Indicators:</strong> Color-coded progress bars and status icons</li>
          <li>• <strong>Real-time Updates:</strong> Progress updates smoothly with transitions</li>
          <li>• <strong>Error Handling:</strong> Failed uploads are clearly indicated</li>
          <li>• <strong>File Information:</strong> Shows file names and sizes</li>
          <li>• <strong>Management Actions:</strong> Remove completed or failed uploads</li>
        </ul>
      </div>
    </div>
  )
}
