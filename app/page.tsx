'use client'

import { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar'
import { ContentArea } from './components/layout/ContentArea'
import { ComponentType } from './types/components'

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState<ComponentType>('modal')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        selectedComponent={selectedComponent}
        onSelectComponent={setSelectedComponent}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <ContentArea 
        selectedComponent={selectedComponent}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
    </div>
  )
}
