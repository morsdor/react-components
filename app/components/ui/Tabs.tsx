'use client'

import { useState, useRef, useEffect } from 'react'

interface Tab {
  id: string
  label: string
  content: React.ReactNode
}

interface TabsProps {
  tabs: Tab[]
  defaultTab?: string
  onChange?: (tabId: string) => void
}

/**
 * Accessible tabs component following WAI-ARIA tablist pattern
 * Supports keyboard navigation with arrow keys
 */
export function Tabs({ tabs, defaultTab, onChange }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id)
  const tabListRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({})

  /**
   * Handle tab change
   */
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    onChange?.(tabId)
  }

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent, tabId: string) => {
    const currentIndex = tabs.findIndex(tab => tab.id === tabId)
    let nextIndex = currentIndex

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault()
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1
        break
      
      case 'ArrowRight':
        event.preventDefault()
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0
        break
      
      case 'Home':
        event.preventDefault()
        nextIndex = 0
        break
      
      case 'End':
        event.preventDefault()
        nextIndex = tabs.length - 1
        break
      
      default:
        return
    }

    const nextTab = tabs[nextIndex]
    if (nextTab) {
      handleTabChange(nextTab.id)
      tabRefs.current[nextTab.id]?.focus()
    }
  }

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content

  return (
    <div className="w-full">
      {/* Tab List */}
      <div
        ref={tabListRef}
        role="tablist"
        className="flex border-b border-gray-200 bg-gray-50 rounded-t-lg"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            ref={(el) => { tabRefs.current[tab.id] = el }}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            className={`
              px-6 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset
              ${activeTab === tab.id
                ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }
            `}
            onClick={() => handleTabChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-white border border-t-0 border-gray-200 rounded-b-lg">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`panel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
            className="p-6 focus:outline-none"
            tabIndex={0}
          >
            {activeTab === tab.id && tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}
