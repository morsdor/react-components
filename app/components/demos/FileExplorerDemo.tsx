'use client'

import { useState } from 'react'
import { FileExplorer, FileSystemNode } from '../ui/FileExplorer'
import { FILE_SYSTEM_DATA } from '../../data/mock-data'

/**
 * Demo component showcasing the FileExplorer functionality
 */
export function FileExplorerDemo() {
  const [selectedNode, setSelectedNode] = useState<FileSystemNode | null>(null)

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">File Explorer Tree Demo</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* File Explorer */}
          <div>
            <FileExplorer
              data={FILE_SYSTEM_DATA}
              onSelect={setSelectedNode}
              selectedId={selectedNode?.id}
            />
          </div>

          {/* Selected item details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium mb-3">Selected Item</h4>
            {selectedNode ? (
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">{selectedNode.name}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Type:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    selectedNode.type === 'folder' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {selectedNode.type}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-600">ID:</span>
                  <span className="ml-2 text-sm font-mono bg-gray-200 px-2 py-1 rounded">
                    {selectedNode.id}
                  </span>
                </div>
                {selectedNode.children && (
                  <div>
                    <span className="text-sm text-gray-600">Children:</span>
                    <span className="ml-2">{selectedNode.children.length} items</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Click on a file or folder to see details</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Tree Navigation:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <strong>Click:</strong> Select files/folders and toggle folder expansion</li>
          <li>• <kbd className="bg-gray-200 px-2 py-1 rounded">→</kbd> Expand collapsed folders</li>
          <li>• <kbd className="bg-gray-200 px-2 py-1 rounded">←</kbd> Collapse expanded folders</li>
          <li>• <kbd className="bg-gray-200 px-2 py-1 rounded">Enter</kbd> or <kbd className="bg-gray-200 px-2 py-1 rounded">Space</kbd> Select/toggle items</li>
          <li>• <strong>Recursive Architecture:</strong> Handles unlimited nesting levels</li>
        </ul>
      </div>
    </div>
  )
}
