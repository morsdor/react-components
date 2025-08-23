'use client'

import { useState } from 'react'
import { FiFolder, FiFile, FiChevronRight, FiChevronDown } from 'react-icons/fi'

export interface FileSystemNode {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileSystemNode[]
}

interface FileExplorerProps {
  data: FileSystemNode
  onSelect?: (node: FileSystemNode) => void
  selectedId?: string
}

interface FileNodeProps {
  node: FileSystemNode
  level: number
  onSelect?: (node: FileSystemNode) => void
  selectedId?: string
  expandedNodes: Set<string>
  onToggleExpand: (nodeId: string) => void
}

/**
 * Recursive file node component
 * Handles individual file/folder rendering and expansion
 */
function FileNode({ node, level, onSelect, selectedId, expandedNodes, onToggleExpand }: FileNodeProps) {
  const isExpanded = expandedNodes.has(node.id)
  const isSelected = selectedId === node.id
  const hasChildren = node.children && node.children.length > 0

  const handleClick = () => {
    if (node.type === 'folder' && hasChildren) {
      onToggleExpand(node.id)
    }
    onSelect?.(node)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault()
        handleClick()
        break
      case 'ArrowRight':
        if (node.type === 'folder' && hasChildren && !isExpanded) {
          event.preventDefault()
          onToggleExpand(node.id)
        }
        break
      case 'ArrowLeft':
        if (node.type === 'folder' && hasChildren && isExpanded) {
          event.preventDefault()
          onToggleExpand(node.id)
        }
        break
    }
  }

  const getIcon = () => {
    if (node.type === 'folder') {
      return <FiFolder className={`${isExpanded ? 'text-blue-600' : 'text-blue-500'}`} size={16} />
    }
    return <FiFile className="text-gray-500" size={16} />
  }

  const getExpandIcon = () => {
    if (node.type === 'folder' && hasChildren) {
      return isExpanded ? (
        <FiChevronDown size={16} className="text-gray-400" />
      ) : (
        <FiChevronRight size={16} className="text-gray-400" />
      )
    }
    return <div className="w-4" /> // Spacer for alignment
  }

  return (
    <div>
      <div
        className={`
          flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-gray-100 transition-colors
          ${isSelected ? 'bg-blue-100 text-blue-900' : 'text-gray-700'}
        `}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="treeitem"
        aria-expanded={node.type === 'folder' ? isExpanded : undefined}
        aria-selected={isSelected}
      >
        {getExpandIcon()}
        {getIcon()}
        <span className="text-sm truncate">{node.name}</span>
      </div>

      {/* Recursively render children */}
      {node.type === 'folder' && hasChildren && isExpanded && (
        <div role="group">
          {node.children!.map((child) => (
            <FileNode
              key={child.id}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedId={selectedId}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * File explorer component with hierarchical tree view
 * Uses recursive rendering for arbitrary nesting levels
 */
export function FileExplorer({ data, onSelect, selectedId }: FileExplorerProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([data.id]))

  const handleToggleExpand = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
      } else {
        newSet.add(nodeId)
      }
      return newSet
    })
  }

  const expandAll = () => {
    const getAllNodeIds = (node: FileSystemNode): string[] => {
      const ids = [node.id]
      if (node.children) {
        node.children.forEach(child => {
          ids.push(...getAllNodeIds(child))
        })
      }
      return ids
    }
    
    setExpandedNodes(new Set(getAllNodeIds(data)))
  }

  const collapseAll = () => {
    setExpandedNodes(new Set([data.id]))
  }

  return (
    <div className="border border-gray-300 rounded-lg bg-white">
      {/* Header with controls */}
      <div className="flex justify-between items-center p-3 border-b border-gray-200 bg-gray-50">
        <h4 className="font-medium text-gray-900">File Explorer</h4>
        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
          >
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded transition-colors"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Tree view */}
      <div className="p-2 max-h-96 overflow-y-auto" role="tree">
        <FileNode
          node={data}
          level={0}
          onSelect={onSelect}
          selectedId={selectedId}
          expandedNodes={expandedNodes}
          onToggleExpand={handleToggleExpand}
        />
      </div>
    </div>
  )
}
