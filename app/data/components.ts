import { ComponentInfo } from '../types/components'

/**
 * Component metadata for navigation and display
 */
export const COMPONENTS: ComponentInfo[] = [
  {
    id: 'modal',
    title: 'Accessible Modal Dialog',
    description: 'A fully accessible modal with focus trapping and ARIA compliance',
    keyFeatures: [
      'Full WAI-ARIA implementation with proper roles and attributes',
      'Focus trapping with keyboard navigation support'
    ]
  },
  {
    id: 'autocomplete',
    title: 'Performant Autocomplete',
    description: 'High-performance typeahead with debouncing and accessibility',
    keyFeatures: [
      'Debounced input to optimize search performance',
      'Full keyboard navigation with ARIA announcements'
    ]
  },
  {
    id: 'data-grid',
    title: 'Scalable Data Grid',
    description: 'Virtualized data table handling large datasets efficiently',
    keyFeatures: [
      'Virtual scrolling for optimal performance with 1000+ rows',
      'Multi-directional sorting with stable sort algorithms'
    ]
  },
  {
    id: 'carousel',
    title: 'Accessible Image Carousel',
    description: 'Image carousel with autoplay and comprehensive accessibility',
    keyFeatures: [
      'Smart autoplay that pauses on hover for better UX',
      'Full keyboard navigation with screen reader support'
    ]
  },
  {
    id: 'tabs',
    title: 'Accessible Tabs',
    description: 'WAI-ARIA compliant tabs with keyboard navigation',
    keyFeatures: [
      'Arrow key navigation following WAI-ARIA tablist patterns',
      'Clean state management with controlled/uncontrolled modes'
    ]
  },
  {
    id: 'star-rating',
    title: 'Star Rating Widget',
    description: 'Flexible rating component with keyboard support',
    keyFeatures: [
      'Supports read-only and interactive modes with half-star ratings',
      'Full keyboard accessibility for rating selection'
    ]
  },
  {
    id: 'multi-step-form',
    title: 'Multi-step Form Wizard',
    description: 'Form wizard with validation and state management',
    keyFeatures: [
      'Per-step validation preventing invalid progression',
      'Centralized state management across all form steps'
    ]
  },
  {
    id: 'infinite-scroll',
    title: 'Infinite Scroll Hook',
    description: 'Custom hook for efficient infinite scrolling',
    keyFeatures: [
      'IntersectionObserver API for optimal performance',
      'Generic and reusable hook design'
    ]
  },
  {
    id: 'toast',
    title: 'Toast Notification System',
    description: 'Centralized notification system with context management',
    keyFeatures: [
      'React Context for centralized toast management',
      'Auto-dismiss with elegant stacking animations'
    ]
  },
  {
    id: 'file-explorer',
    title: 'File Explorer Tree',
    description: 'Hierarchical file system with recursive rendering',
    keyFeatures: [
      'Recursive component architecture for arbitrary nesting',
      'Efficient state management for expand/collapse states'
    ]
  },
  {
    id: 'transfer-list',
    title: 'Transfer List Component',
    description: 'Dual listbox for moving items between lists',
    keyFeatures: [
      'Support for single, multiple, and bulk item transfers',
      'Full keyboard operability and accessibility'
    ]
  },
  {
    id: 'kanban',
    title: 'Kanban Board',
    description: 'Drag-and-drop Kanban board with smooth interactions',
    keyFeatures: [
      'dnd-kit integration for accessible drag-and-drop',
      'Clean state updates with optimistic UI changes'
    ]
  },
  {
    id: 'progress-bar',
    title: 'Concurrent Upload Progress',
    description: 'Multiple progress bars for concurrent operations',
    keyFeatures: [
      'Independent state management for concurrent uploads',
      'Visual state indicators for progress, completion, and errors'
    ]
  },
  {
    id: 'country-game',
    title: 'Country Capital Game',
    description: 'Interactive quiz game composing multiple components',
    keyFeatures: [
      'Component composition showcasing reusable architecture',
      'Clean game state management with score tracking'
    ]
  }
]
