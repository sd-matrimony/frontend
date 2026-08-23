'use client'

import { useState } from 'react'
import { useTable } from '@tanstack/react-table'
import type { ColumnFiltersState, SortingState, ColumnVisibilityState, RowData } from '@tanstack/react-table'

import { appTableFeatures, type AppColumnDef } from './table-features'

interface useTableProps<TData extends RowData, TValue> {
  data: TData[]
  columns: AppColumnDef<TData, TValue>[]
}

export function useDataTable<TData extends RowData, TValue>({ data, columns }: useTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')

  return useTable({
    features: appTableFeatures,
    data,
    columns: columns as unknown as AppColumnDef<TData, unknown>[],
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
  })
}

export default useDataTable
