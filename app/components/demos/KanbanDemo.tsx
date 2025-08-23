'use client'

import { useState } from 'react'
import { KanbanBoard, KanbanColumn } from '../ui/KanbanBoard'
import { KANBAN_DATA } from '../../data/mock-data'

/**
 * Demo component showcasing the KanbanBoard functionality
 */
export function KanbanDemo() {
  const [columns, setColumns] = useState<KanbanColumn[]>(KANBAN_DATA.columns)

  const resetDemo = () => {
    setColumns(KANBAN_DATA.columns)
  }

  const addNewCard = () => {
    const newCard = {
      id: `card-${Date.now()}`,
      title: 'New Task',
      description: 'This is a new task added to the board',
      priority: 'medium' as const
    }

    const newColumns = [...columns]
    newColumns[0].cards.push(newCard)
    setColumns(newColumns)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Kanban Board Demo</h3>
          <div className="flex gap-2">
            <button
              onClick={addNewCard}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add Card
            </button>
            <button
              onClick={resetDemo}
              className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Reset Demo
            </button>
          </div>
        </div>
        
        <p className="text-gray-600 mb-6">
          Drag and drop cards between columns to update their status. The board uses dnd-kit for smooth, accessible interactions.
        </p>

        <KanbanBoard columns={columns} onChange={setColumns} />
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Drag & Drop Features:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <strong>Smooth Interactions:</strong> dnd-kit provides optimized drag-and-drop performance</li>
          <li>• <strong>Accessibility:</strong> Full keyboard support and screen reader compatibility</li>
          <li>• <strong>Visual Feedback:</strong> Drag overlay and hover states for better UX</li>
          <li>• <strong>State Management:</strong> Clean state updates with optimistic UI changes</li>
          <li>• <strong>Cross-column Movement:</strong> Move cards between any columns</li>
          <li>• <strong>Reordering:</strong> Change card order within the same column</li>
        </ul>
      </div>
    </div>
  )
}
