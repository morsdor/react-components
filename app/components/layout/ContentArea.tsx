'use client'

import { ComponentType } from '../../types/components'
import { COMPONENTS } from '../../data/components'
import { FiMenu } from 'react-icons/fi'

// Component imports
import { ModalDemo } from '../demos/ModalDemo'
import { AutocompleteDemo } from '../demos/AutocompleteDemo'
import { DataGridDemo } from '../demos/DataGridDemo'
import { CarouselDemo } from '../demos/CarouselDemo'
import { TabsDemo } from '../demos/TabsDemo'
import { StarRatingDemo } from '../demos/StarRatingDemo'
import { MultiStepFormDemo } from '../demos/MultiStepFormDemo'
import { InfiniteScrollDemo } from '../demos/InfiniteScrollDemo'
import { ToastDemo } from '../demos/ToastDemo'
import { FileExplorerDemo } from '../demos/FileExplorerDemo'
import { TransferListDemo } from '../demos/TransferListDemo'
import { KanbanDemo } from '../demos/KanbanDemo'
import { ProgressBarDemo } from '../demos/ProgressBarDemo'
import { CountryGameDemo } from '../demos/CountryGameDemo'

interface ContentAreaProps {
  selectedComponent: ComponentType
  onToggleSidebar: () => void
}

/**
 * Main content area displaying the selected component demo
 */
export function ContentArea({ selectedComponent, onToggleSidebar }: ContentAreaProps) {
  const componentInfo = COMPONENTS.find(c => c.id === selectedComponent)!

  const renderComponent = () => {
    switch (selectedComponent) {
      case 'modal': return <ModalDemo />
      case 'autocomplete': return <AutocompleteDemo />
      case 'data-grid': return <DataGridDemo />
      case 'carousel': return <CarouselDemo />
      case 'tabs': return <TabsDemo />
      case 'star-rating': return <StarRatingDemo />
      case 'multi-step-form': return <MultiStepFormDemo />
      case 'infinite-scroll': return <InfiniteScrollDemo />
      case 'toast': return <ToastDemo />
      case 'file-explorer': return <FileExplorerDemo />
      case 'transfer-list': return <TransferListDemo />
      case 'kanban': return <KanbanDemo />
      case 'progress-bar': return <ProgressBarDemo />
      case 'country-game': return <CountryGameDemo />
      default: return <div>Component not found</div>
    }
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-sm border-b px-6 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
            aria-label="Open sidebar"
          >
            <FiMenu size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{componentInfo.title}</h1>
            <p className="text-gray-600 mt-1">{componentInfo.description}</p>
          </div>
        </div>
      </header>

      {/* Key Features */}
      <div className="bg-blue-50 border-b px-6 py-4">
        <h2 className="text-sm font-semibold text-blue-900 mb-2">Key Features</h2>
        <ul className="space-y-1">
          {componentInfo.keyFeatures.map((feature, index) => (
            <li key={index} className="text-sm text-blue-800 flex items-start">
              <span className="text-blue-500 mr-2">•</span>
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {/* Component Demo */}
      <main className="flex-1 overflow-auto p-6">
        {renderComponent()}
      </main>
    </div>
  )
}
