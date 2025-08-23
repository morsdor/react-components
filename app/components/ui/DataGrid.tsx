'use client'

import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { FiChevronUp, FiChevronDown, FiSearch, FiFilter, FiX } from 'react-icons/fi'

export interface Column<T> {
  key: keyof T
  title: string
  sortable?: boolean
  filterable?: boolean
  searchable?: boolean
  width?: number | string
  minWidth?: number
  render?: (value: any, row: T, index: number) => React.ReactNode
  align?: 'left' | 'center' | 'right'
}

export interface FilterOption {
  label: string
  value: any
}

export interface DataGridFilter {
  column: string
  value: any
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt'
}

export interface DataGridSort {
  column: keyof any
  direction: 'asc' | 'desc'
}

export interface DataGridProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  
  // Pagination mode
  pagination?: {
    page: number
    pageSize: number
    total: number
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
  }
  
  // Infinite scroll mode
  infiniteScroll?: {
    hasNextPage: boolean
    isFetchingNextPage: boolean
    onFetchNextPage: () => void
  }
  
  // Callbacks
  onSort?: (sort: DataGridSort | null) => void
  onFilter?: (filters: DataGridFilter[]) => void
  onSearch?: (searchTerm: string, searchableColumns: string[]) => void
  
  // Styling
  height?: number
  rowHeight?: number
  stickyHeader?: boolean
  striped?: boolean
  
  // Selection
  selectable?: boolean
  selectedRows?: Set<string | number>
  onSelectionChange?: (selectedRows: Set<string | number>) => void
  getRowId?: (row: T, index: number) => string | number
}

/**
 * Advanced DataGrid component with filtering, searching, sorting, and dual mode support
 * Supports both pagination and infinite scroll modes based on props
 */
export function DataGrid<T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  pagination,
  infiniteScroll,
  onSort,
  onFilter,
  onSearch,
  height = 500,
  rowHeight = 50,
  stickyHeader = true,
  striped = true,
  selectable = false,
  selectedRows = new Set(),
  onSelectionChange,
  getRowId = (row, index) => index
}: DataGridProps<T>) {
  const [sortState, setSortState] = useState<DataGridSort | null>(null)
  const [filters, setFilters] = useState<DataGridFilter[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [columnFilters, setColumnFilters] = useState<Record<string, any>>({})
  
  const containerRef = useRef<HTMLDivElement>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // Calculate column widths
  const totalFixedWidth = columns.reduce((sum, col) => {
    return sum + (typeof col.width === 'number' ? col.width : 0)
  }, 0)
  
  const flexColumns = columns.filter(col => typeof col.width !== 'number')
  const flexWidth = flexColumns.length > 0 ? `calc((100% - ${totalFixedWidth}px) / ${flexColumns.length})` : 'auto'

  // Handle sorting
  const handleSort = (column: keyof T) => {
    const columnConfig = columns.find(col => col.key === column)
    if (!columnConfig?.sortable) return

    let newSort: DataGridSort | null = null
    
    if (sortState?.column === column) {
      if (sortState.direction === 'asc') {
        newSort = { column, direction: 'desc' }
      } else {
        newSort = null // Remove sort
      }
    } else {
      newSort = { column, direction: 'asc' }
    }
    
    setSortState(newSort)
    onSort?.(newSort)
  }

  // Handle search
  const handleSearch = useCallback((term: string) => {
    setSearchTerm(term)
    const searchableColumns = columns
      .filter(col => col.searchable)
      .map(col => String(col.key))
    
    onSearch?.(term, searchableColumns)
  }, [columns, onSearch])

  // Handle column filter
  const handleColumnFilter = (columnKey: string, value: any) => {
    const newColumnFilters = { ...columnFilters }
    
    if (value === '' || value === null || value === undefined) {
      delete newColumnFilters[columnKey]
    } else {
      newColumnFilters[columnKey] = value
    }
    
    setColumnFilters(newColumnFilters)
    
    // Convert to DataGridFilter format
    const newFilters = Object.entries(newColumnFilters).map(([key, val]) => ({
      column: key,
      value: val,
      operator: 'contains' as const
    }))
    
    setFilters(newFilters)
    onFilter?.(newFilters)
  }

  // Get unique values for filterable columns
  const getFilterOptions = (columnKey: keyof T): FilterOption[] => {
    const uniqueValues = [...new Set(data.map(row => row[columnKey]))]
      .filter(val => val !== null && val !== undefined && val !== '')
      .sort()
    
    return uniqueValues.map(val => ({
      label: String(val),
      value: val
    }))
  }

  // Handle row selection
  const handleRowSelect = (rowId: string | number, selected: boolean) => {
    if (!onSelectionChange) return
    
    const newSelection = new Set(selectedRows)
    if (selected) {
      newSelection.add(rowId)
    } else {
      newSelection.delete(rowId)
    }
    onSelectionChange(newSelection)
  }

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    if (!onSelectionChange) return
    
    if (selected) {
      const allIds = data.map((row, index) => getRowId(row, index))
      onSelectionChange(new Set(allIds))
    } else {
      onSelectionChange(new Set())
    }
  }

  // Infinite scroll observer
  useEffect(() => {
    if (!infiniteScroll || !loadingRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && infiniteScroll.hasNextPage && !infiniteScroll.isFetchingNextPage) {
          infiniteScroll.onFetchNextPage()
        }
      },
      { threshold: 1.0, rootMargin: '20px' }
    )

    observer.observe(loadingRef.current)
    return () => observer.disconnect()
  }, [infiniteScroll])

  // Get sort icon
  const getSortIcon = (column: keyof T) => {
    if (sortState?.column !== column) return null
    return sortState.direction === 'asc' ? (
      <FiChevronUp className="inline ml-1" size={14} />
    ) : (
      <FiChevronDown className="inline ml-1" size={14} />
    )
  }

  const isAllSelected = data.length > 0 && data.every((row, index) => 
    selectedRows.has(getRowId(row, index))
  )
  const isSomeSelected = data.some((row, index) => 
    selectedRows.has(getRowId(row, index))
  )

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-4">
        <div className="flex justify-between items-center gap-4">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX size={16} />
                </button>
              )}
            </div>
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
              showFilters || filters.length > 0
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'bg-white border border-gray-300 hover:bg-gray-50'
            }`}
          >
            <FiFilter size={16} />
            Filters
            {filters.length > 0 && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {filters.length}
              </span>
            )}
          </button>

          {/* Row count */}
          <div className="text-sm text-gray-600">
            {pagination ? (
              `${((pagination.page - 1) * pagination.pageSize) + 1}-${Math.min(pagination.page * pagination.pageSize, pagination.total)} of ${pagination.total}`
            ) : (
              `${data.length} rows`
            )}
          </div>
        </div>

        {/* Column filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {columns.filter(col => col.filterable).map((column) => {
              const options = getFilterOptions(column.key)
              return (
                <div key={String(column.key)}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {column.title}
                  </label>
                  <select
                    value={columnFilters[String(column.key)] || ''}
                    onChange={(e) => handleColumnFilter(String(column.key), e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All</option>
                    {options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Table container */}
      <div 
        ref={containerRef}
        className="overflow-auto"
        style={{ height: height - (showFilters ? 140 : 80) }}
      >
        <table className="w-full">
          {/* Header */}
          <thead className={`bg-gray-50 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
            <tr className="border-b border-gray-300">
              {selectable && (
                <th className="w-12 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected && !isAllSelected
                    }}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`
                    px-4 py-3 text-left text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0
                    ${column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''}
                    ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                  `}
                  style={{ 
                    width: typeof column.width === 'number' ? `${column.width}px` : column.width || flexWidth,
                    minWidth: column.minWidth || 100
                  }}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center justify-between">
                    <span>{column.title}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {loading && data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    Loading...
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-4 py-8 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              data.map((row, index) => {
                const rowId = getRowId(row, index)
                const isSelected = selectedRows.has(rowId)
                
                return (
                  <tr
                    key={rowId}
                    className={`
                      border-b border-gray-200 hover:bg-gray-50 transition-colors
                      ${striped && index % 2 === 1 ? 'bg-gray-25' : ''}
                      ${isSelected ? 'bg-blue-50' : ''}
                    `}
                    style={{ height: rowHeight }}
                  >
                    {selectable && (
                      <td className="w-12 px-4 py-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => handleRowSelect(rowId, e.target.checked)}
                          className="rounded"
                        />
                      </td>
                    )}
                    {columns.map((column) => (
                      <td
                        key={String(column.key)}
                        className={`
                          px-4 py-3 text-sm text-gray-900 border-r border-gray-200 last:border-r-0
                          ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                        `}
                        style={{ 
                          width: typeof column.width === 'number' ? `${column.width}px` : column.width || flexWidth,
                          minWidth: column.minWidth || 100
                        }}
                      >
                        <div className="truncate">
                          {column.render 
                            ? column.render(row[column.key], row, index)
                            : String(row[column.key] ?? '')
                          }
                        </div>
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>

        {/* Infinite scroll loading indicator */}
        {infiniteScroll && (
          <div ref={loadingRef} className="py-4 text-center">
            {infiniteScroll.isFetchingNextPage && (
              <div className="flex items-center justify-center gap-2 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                Loading more...
              </div>
            )}
            {!infiniteScroll.hasNextPage && data.length > 0 && (
              <p className="text-gray-500 text-sm">No more data to load</p>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="bg-gray-50 border-t border-gray-300 px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                value={pagination.pageSize}
                onChange={(e) => pagination.onPageSizeChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => pagination.onPageChange(pagination.page - 1)}
                disabled={pagination.page <= 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {Math.ceil(pagination.total / pagination.pageSize)}
              </span>
              
              <button
                onClick={() => pagination.onPageChange(pagination.page + 1)}
                disabled={pagination.page >= Math.ceil(pagination.total / pagination.pageSize)}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
