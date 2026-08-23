'use client'

import { flexRender } from '@tanstack/react-table'
import type { RowData } from '@tanstack/react-table'

import { type AppTable as TanstackTable } from './table-features'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableProps<TData extends RowData> {
  table: TanstackTable<TData>
  className?: string
  emptyMessage?: string
}

export function DataTable<TData extends RowData>({
  table,
  className = '',
  emptyMessage = 'No matching results.',
}: DataTableProps<TData>) {
  const columnCount = table?.getAllColumns()?.length
  const rows = table?.getRowModel()?.rows
  const hasRows = rows?.length > 0

  return (
    <Table className={className}>
      <TableHeader>
        {table?.getHeaderGroups().map(headerGroup => (
          <TableRow key={headerGroup.id} className="hover:bg-transparent">
            {headerGroup.headers.map(header => (
              <TableHead key={header.id} className="text-theme-grey-text">
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>

      <TableBody>
        {hasRows ? (
          rows.map(row => (
            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id} className="text-[13px] capitalize">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow className="hover:bg-transparent">
            <TableCell colSpan={columnCount} className="border-b">
              <div className="dc h-32 my-4 text-sm text-center">{emptyMessage}</div>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}
