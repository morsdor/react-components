'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { FiMoreHorizontal } from 'react-icons/fi'

export interface KanbanCard {
  id: string
  title: string
  description: string
  priority: 'low' | 'medium' | 'high'
}

export interface KanbanColumn {
  id: string
  title: string
  cards: KanbanCard[]
}

interface KanbanBoardProps {
  columns: KanbanColumn[]
  onChange: (columns: KanbanColumn[]) => void
}

/**
 * Individual draggable card component
 */
function KanbanCardComponent({ card }: { card: KanbanCard }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: card.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-gray-900 text-sm">{card.title}</h4>
        <button className="text-gray-400 hover:text-gray-600 p-1">
          <FiMoreHorizontal size={14} />
        </button>
      </div>
      
      <p className="text-gray-600 text-xs mb-3 line-clamp-2">{card.description}</p>
      
      <div className="flex justify-between items-center">
        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(card.priority)}`}>
          {card.priority}
        </span>
      </div>
    </div>
  )
}

/**
 * Droppable column component
 */
function KanbanColumnComponent({ column }: { column: KanbanColumn }) {
  return (
    <div className="bg-gray-50 rounded-lg p-4 min-h-96 w-80">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-gray-900">{column.title}</h3>
        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
          {column.cards.length}
        </span>
      </div>
      
      <SortableContext items={column.cards.map(card => card.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {column.cards.map((card) => (
            <KanbanCardComponent key={card.id} card={card} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

/**
 * Kanban board with drag-and-drop functionality
 * Uses dnd-kit for accessible and performant drag-and-drop
 */
export function KanbanBoard({ columns, onChange }: KanbanBoardProps) {
  const [activeCard, setActiveCard] = useState<KanbanCard | null>(null)
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  /**
   * Handle drag start
   */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const card = findCardById(active.id as string)
    setActiveCard(card)
  }

  /**
   * Handle drag end
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveCard(null)

    if (!over) return

    const activeCardId = active.id as string
    const overCardId = over.id as string

    if (activeCardId === overCardId) return

    const activeCard = findCardById(activeCardId)
    const overCard = findCardById(overCardId)

    if (!activeCard) return

    // Find source and destination columns
    const activeColumnIndex = columns.findIndex(col => 
      col.cards.some(card => card.id === activeCardId)
    )
    const overColumnIndex = overCard 
      ? columns.findIndex(col => col.cards.some(card => card.id === overCardId))
      : columns.findIndex(col => col.id === over.id)

    if (activeColumnIndex === -1 || overColumnIndex === -1) return

    const newColumns = [...columns]
    const activeColumn = newColumns[activeColumnIndex]
    const overColumn = newColumns[overColumnIndex]

    // Remove card from source column
    const activeCardIndex = activeColumn.cards.findIndex(card => card.id === activeCardId)
    const [movedCard] = activeColumn.cards.splice(activeCardIndex, 1)

    if (activeColumnIndex === overColumnIndex) {
      // Same column - reorder
      const overCardIndex = overColumn.cards.findIndex(card => card.id === overCardId)
      overColumn.cards.splice(overCardIndex, 0, movedCard)
    } else {
      // Different column - move to end or specific position
      if (overCard) {
        const overCardIndex = overColumn.cards.findIndex(card => card.id === overCardId)
        overColumn.cards.splice(overCardIndex, 0, movedCard)
      } else {
        overColumn.cards.push(movedCard)
      }
    }

    onChange(newColumns)
  }

  /**
   * Find card by ID across all columns
   */
  const findCardById = (cardId: string): KanbanCard | null => {
    for (const column of columns) {
      const card = column.cards.find(card => card.id === cardId)
      if (card) return card
    }
    return null
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumnComponent key={column.id} column={column} />
        ))}
      </div>

      <DragOverlay>
        {activeCard ? (
          <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg rotate-3">
            <h4 className="font-medium text-gray-900 text-sm mb-2">{activeCard.title}</h4>
            <p className="text-gray-600 text-xs">{activeCard.description}</p>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
