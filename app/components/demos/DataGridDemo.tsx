'use client'

import { useState, useMemo, useCallback } from 'react'
import { DataGrid, Column, DataGridSort, DataGridFilter } from '../ui/DataGrid'
import { generateLargeDataset } from '../../data/mock-data'

interface Employee {
  id: number
  firstName: string
  lastName: string
  email: string
  department: string
  salary: number
  city: string
  joinDate: string
  isActive: boolean
}

/**
 * Demo component showcasing both pagination and infinite scroll modes
 */
export function DataGridDemo() {
  const [mode, setMode] = useState<'pagination' | 'infinite'>('pagination')
  
  // Generate full dataset
  const fullDataset = useMemo(() => generateLargeDataset(1000), [])
  
  // Pagination state
  const [paginationState, setPaginationState] = useState({
    page: 1,
    pageSize: 25,
    sortedData: fullDataset,
    filteredData: fullDataset
  })
  
  // Infinite scroll state
  const [infiniteState, setInfiniteState] = useState({
    data: fullDataset.slice(0, 50), // Start with first 50 items
    hasNextPage: true,
    isFetchingNextPage: false,
    sortedData: fullDataset,
    filteredData: fullDataset
  })

  // Column configuration
  const columns: Column<Employee>[] = [
    {
      key: 'id',
      title: 'ID',
      sortable: true,
      width: 80,
      align: 'center'
    },
    {
      key: 'firstName',
      title: 'First Name',
      sortable: true,
      searchable: true,
      filterable: true,
      width: 120
    },
    {
      key: 'lastName',
      title: 'Last Name',
      sortable: true,
      searchable: true,
      filterable: true,
      width: 120
    },
    {
      key: 'email',
      title: 'Email',
      sortable: true,
      searchable: true,
      width: 200
    },
    {
      key: 'department',
      title: 'Department',
      sortable: true,
      filterable: true,
      width: 120
    },
    {
      key: 'salary',
      title: 'Salary',
      sortable: true,
      width: 120,
      align: 'right',
      render: (value: number) => `$${value.toLocaleString()}`
    },
    {
      key: 'city',
      title: 'City',
      sortable: true,
      filterable: true,
      width: 120
    },
    {
      key: 'joinDate',
      title: 'Join Date',
      sortable: true,
      width: 120,
      render: (value: string) => new Date(value).toLocaleDateString()
    },
    {
      key: 'isActive',
      title: 'Status',
      sortable: true,
      filterable: true,
      width: 100,
      align: 'center',
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    }
  ]

  // Apply filters and search
  const applyFiltersAndSearch = useCallback((
    data: Employee[], 
    filters: DataGridFilter[], 
    searchTerm: string, 
    searchableColumns: string[]
  ) => {
    let filtered = [...data]

    // Apply filters
    filters.forEach(filter => {
      filtered = filtered.filter(row => {
        const value = row[filter.column as keyof Employee]
        if (filter.operator === 'contains') {
          return String(value).toLowerCase().includes(String(filter.value).toLowerCase())
        }
        return value === filter.value
      })
    })

    // Apply search
    if (searchTerm && searchableColumns.length > 0) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(row =>
        searchableColumns.some(col =>
          String(row[col as keyof Employee]).toLowerCase().includes(searchLower)
        )
      )
    }

    return filtered
  }, [])

  // Apply sorting
  const applySorting = useCallback((data: Employee[], sort: DataGridSort | null) => {
    if (!sort) return data

    return [...data].sort((a, b) => {
      const aVal = a[sort.column as keyof Employee]
      const bVal = b[sort.column as keyof Employee]

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sort.direction === 'asc' ? aVal - bVal : bVal - aVal
      }

      if (aVal instanceof Date && bVal instanceof Date) {
        return sort.direction === 'asc' 
          ? aVal.getTime() - bVal.getTime() 
          : bVal.getTime() - aVal.getTime()
      }

      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      
      if (sort.direction === 'asc') {
        return aStr < bStr ? -1 : aStr > bStr ? 1 : 0
      } else {
        return aStr > bStr ? -1 : aStr < bStr ? 1 : 0
      }
    })
  }, [])

  // Pagination handlers
  const handlePaginationSort = (sort: DataGridSort | null) => {
    const sorted = applySorting(paginationState.filteredData, sort)
    setPaginationState(prev => ({
      ...prev,
      sortedData: sorted,
      page: 1 // Reset to first page
    }))
  }

  const handlePaginationFilter = (filters: DataGridFilter[]) => {
    const filtered = applyFiltersAndSearch(fullDataset, filters, '', [])
    const sorted = applySorting(filtered, null)
    setPaginationState(prev => ({
      ...prev,
      filteredData: filtered,
      sortedData: sorted,
      page: 1
    }))
  }

  const handlePaginationSearch = (searchTerm: string, searchableColumns: string[]) => {
    const filtered = applyFiltersAndSearch(fullDataset, [], searchTerm, searchableColumns)
    const sorted = applySorting(filtered, null)
    setPaginationState(prev => ({
      ...prev,
      filteredData: filtered,
      sortedData: sorted,
      page: 1
    }))
  }

  // Infinite scroll handlers
  const handleInfiniteSort = (sort: DataGridSort | null) => {
    const sorted = applySorting(infiniteState.filteredData, sort)
    setInfiniteState(prev => ({
      ...prev,
      sortedData: sorted,
      data: sorted.slice(0, prev.data.length) // Keep same amount of data
    }))
  }

  const handleInfiniteFilter = (filters: DataGridFilter[]) => {
    const filtered = applyFiltersAndSearch(fullDataset, filters, '', [])
    const sorted = applySorting(filtered, null)
    setInfiniteState(prev => ({
      ...prev,
      filteredData: filtered,
      sortedData: sorted,
      data: sorted.slice(0, 50), // Reset to first 50
      hasNextPage: sorted.length > 50
    }))
  }

  const handleInfiniteSearch = (searchTerm: string, searchableColumns: string[]) => {
    const filtered = applyFiltersAndSearch(fullDataset, [], searchTerm, searchableColumns)
    const sorted = applySorting(filtered, null)
    setInfiniteState(prev => ({
      ...prev,
      filteredData: filtered,
      sortedData: sorted,
      data: sorted.slice(0, 50),
      hasNextPage: sorted.length > 50
    }))
  }

  const handleFetchNextPage = () => {
    if (infiniteState.isFetchingNextPage || !infiniteState.hasNextPage) return

    setInfiniteState(prev => ({ ...prev, isFetchingNextPage: true }))

    // Simulate network delay
    setTimeout(() => {
      setInfiniteState(prev => {
        const nextBatch = prev.sortedData.slice(prev.data.length, prev.data.length + 50)
        const newData = [...prev.data, ...nextBatch]
        
        return {
          ...prev,
          data: newData,
          hasNextPage: newData.length < prev.sortedData.length,
          isFetchingNextPage: false
        }
      })
    }, 1000)
  }

  // Get current page data for pagination mode
  const paginationData = useMemo(() => {
    const start = (paginationState.page - 1) * paginationState.pageSize
    const end = start + paginationState.pageSize
    return paginationState.sortedData.slice(start, end)
  }, [paginationState])

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Enhanced Data Grid Demo</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setMode('pagination')}
              className={`px-4 py-2 rounded-md transition-colors ${
                mode === 'pagination'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Pagination Mode
            </button>
            <button
              onClick={() => setMode('infinite')}
              className={`px-4 py-2 rounded-md transition-colors ${
                mode === 'infinite'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Infinite Scroll Mode
            </button>
          </div>
        </div>

        <p className="text-gray-600 mb-6">
          {mode === 'pagination' 
            ? 'Pagination mode with server-side-like data fetching simulation.'
            : 'Infinite scroll mode that loads more data as you scroll to the bottom.'
          }
        </p>

        {mode === 'pagination' ? (
          <DataGrid
            data={paginationData}
            columns={columns}
            height={600}
            pagination={{
              page: paginationState.page,
              pageSize: paginationState.pageSize,
              total: paginationState.sortedData.length,
              onPageChange: (page) => setPaginationState(prev => ({ ...prev, page })),
              onPageSizeChange: (pageSize) => setPaginationState(prev => ({ 
                ...prev, 
                pageSize, 
                page: 1 
              }))
            }}
            onSort={handlePaginationSort}
            onFilter={handlePaginationFilter}
            onSearch={handlePaginationSearch}
            selectable={true}
            stickyHeader={true}
            striped={true}
          />
        ) : (
          <DataGrid
            data={infiniteState.data}
            columns={columns}
            height={600}
            infiniteScroll={{
              hasNextPage: infiniteState.hasNextPage,
              isFetchingNextPage: infiniteState.isFetchingNextPage,
              onFetchNextPage: handleFetchNextPage
            }}
            onSort={handleInfiniteSort}
            onFilter={handleInfiniteFilter}
            onSearch={handleInfiniteSearch}
            selectable={true}
            stickyHeader={true}
            striped={true}
          />
        )}
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">Enhanced Features:</h4>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>• <strong>Consistent Column Widths:</strong> Fixed table layout with proper column alignment</li>
          <li>• <strong>Smooth Scrolling:</strong> Optimized scrolling performance with proper overflow handling</li>
          <li>• <strong>Advanced Filtering:</strong> Column-based filters with dropdown options</li>
          <li>• <strong>Global Search:</strong> Search across multiple searchable columns</li>
          <li>• <strong>Dual Mode Support:</strong> Both pagination and infinite scroll in the same component</li>
          <li>• <strong>Row Selection:</strong> Single and multi-row selection with select all</li>
          <li>• <strong>Sticky Header:</strong> Header remains visible during scrolling</li>
          <li>• <strong>Custom Rendering:</strong> Flexible cell rendering with custom components</li>
        </ul>
      </div>
    </div>
  )
}
