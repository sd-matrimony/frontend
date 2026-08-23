import {
  tableFeatures,
  stockFeatures,
  createSortedRowModel,
  createFilteredRowModel,
  createPaginatedRowModel,
  createFacetedRowModel,
  createFacetedUniqueValues,
} from '@tanstack/react-table'
import type { ColumnDef, Column, Table, ReactTable, RowData } from '@tanstack/react-table'

export const appTableFeatures = tableFeatures({
  ...stockFeatures,
  sortedRowModel: createSortedRowModel(),
  filteredRowModel: createFilteredRowModel(),
  paginatedRowModel: createPaginatedRowModel(),
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
})

export type AppTableFeatures = typeof appTableFeatures

export type AppColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<AppTableFeatures, TData, TValue>
export type AppColumn<TData extends RowData, TValue = unknown> = Column<AppTableFeatures, TData, TValue>
export type AppTable<TData extends RowData> = Table<AppTableFeatures, TData>
export type AppReactTable<TData extends RowData> = ReactTable<AppTableFeatures, TData>
