'use client'

import { useEffect, useRef } from 'react'
import { type VirtualizerOptions, useVirtualizer } from '@tanstack/react-virtual'
import { flexRender } from '@tanstack/react-table'
import type { RowData } from '@tanstack/react-table'
import { Loader } from 'lucide-react'

import { cn } from '@/lib/utils'
import { type AppTable as TanstackTable } from './table-features'

import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface DataTableProps<TData extends RowData> {
  table: TanstackTable<TData>
  className?: string
  hasNextPage?: boolean
  emptyMessage?: string
  isFetchingNextPage?: boolean
  fetchNextPage?: () => void
  pinLeft?: string[]
  pinRight?: string[]
  virtualizerOptions?: Partial<
    Omit<VirtualizerOptions<HTMLDivElement, Element>, 'count' | 'getScrollElement'>
  >
}

function getPinCls(id: string, pinLeft: string[], pinRight: string[], isHeader = false) {
  const z = isHeader ? 'z-20' : 'z-10'
  if (pinLeft.includes(id)) return cn(z, 'sticky left-0 border-b bg-background backdrop-blur-md group-hover:bg-muted/40 shadow-[4px_0_6px_-4px_rgb(0_0_0_/_0.2)]')
  if (pinRight.includes(id)) return cn(z, 'sticky right-0 border-b bg-background backdrop-blur-md group-hover:bg-muted/40 shadow-[-4px_0_6px_-4px_rgb(0_0_0_/_0.2)]')
  return ''
}

function getGapCls(nextId: string | undefined, pinRight: string[]) {
  return nextId && pinRight.includes(nextId) ? 'pr-6' : ''
}

export function DataTableVirtualized<TData extends RowData>({
  table,
  className = '',
  hasNextPage = false,
  emptyMessage = 'No matching results.',
  isFetchingNextPage = false,
  fetchNextPage = () => { },
  pinLeft = [],
  pinRight = [],
  virtualizerOptions,
}: DataTableProps<TData>) {
  const rows = table.getRowModel().rows
  const columnCount = table.getAllColumns().length
  const hasRows = rows.length > 0

  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: hasNextPage ? rows.length + 1 : rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 81,
    overscan: 10,
    ...(virtualizerOptions ?? {}),
  })

  const virtualItems = virtualizer.getVirtualItems()

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse()

    if (!lastItem) return

    if (lastItem.index >= rows.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage?.()
    }
  }, [rows.length, hasNextPage, virtualItems, isFetchingNextPage, fetchNextPage])

  return (
    <div ref={parentRef} className={cn('overflow-auto isolate', className)}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        <table className="w-full caption-bottom text-sm">
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header, i) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'text-theme-grey-text',
                      getPinCls(header.column.id, pinLeft, pinRight, true),
                      getGapCls(headerGroup.headers[i + 1]?.column.id, pinRight),
                    )}
                  >
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
              virtualItems.map((virtualRow, index) => {
                const isLoaderRow = virtualRow.index > rows.length - 1
                const row = rows[virtualRow.index]

                if (!row) {
                  if (isLoaderRow && hasNextPage) {
                    return (
                      <TableRow
                        key="loader"
                        ref={virtualizer.measureElement}
                        data-index={virtualRow.index}
                        style={{
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
                        }}
                      >
                        <TableCell colSpan={columnCount}>
                          <div className="dc">
                            <Loader className="animate-spin" />
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  }
                  return null
                }

                return (
                  <TableRow
                    key={row.id}
                    ref={virtualizer.measureElement}
                    data-state={row?.getIsSelected?.() && 'selected'}
                    data-index={virtualRow.index}
                    className="group hover:bg-muted/40"
                    style={{
                      height: `${virtualRow.size}px`,
                      transform: `translateY(${virtualRow.start - (isLoaderRow ? index - 1 : index) * virtualRow.size}px)`,
                    }}
                  >
                    {row?.getVisibleCells()?.map((cell, i, cells) => (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          'text-[13px] capitalize',
                          getPinCls(cell.column.id, pinLeft, pinRight),
                          getGapCls(cells[i + 1]?.column.id, pinRight),
                        )}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columnCount} className="border-b">
                  <div className="dc h-32 my-4 text-sm text-center">{emptyMessage}</div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </table>
      </div>
    </div>
  )
}
