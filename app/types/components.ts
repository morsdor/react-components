/**
 * Available component types in the portfolio
 */
export type ComponentType = 
  | 'modal'
  | 'autocomplete'
  | 'data-grid'
  | 'carousel'
  | 'tabs'
  | 'star-rating'
  | 'multi-step-form'
  | 'infinite-scroll'
  | 'toast'
  | 'file-explorer'
  | 'transfer-list'
  | 'kanban'
  | 'progress-bar'
  | 'country-game'

/**
 * Component metadata for sidebar navigation
 */
export interface ComponentInfo {
  id: ComponentType
  title: string
  description: string
  keyFeatures: string[]
}
