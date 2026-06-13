import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { Table } from '@tanstack/react-table'

import { SelectWrapper } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

interface PaginationProps<TData> {
  table: Table<TData>
}

export function Pagination<TData>({ table }: PaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-2 px-2 mt-4">
      <div className="flex-1 whitespace-nowrap text-sm text-muted-foreground">
        Total: {table.getFilteredRowModel().rows.length} row(s)
      </div>

      <div className="flex items-center gap-2">
        <p className="text-xs">Rows per page</p>
        <SelectWrapper
          value={`${table.getState().pagination.pageSize}`}
          onValueChange={value => table.setPageSize(Number(value))}
          items={[10, 20, 30, 40, 50]}
          placeholder={`${table.getState().pagination.pageSize}`}
          triggerCls="h-8 w-[70px]"
        />
      </div>

      <div className="text-xs mx-2">
        Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to first page</span>
          <ChevronsLeft className="size-4" />
        </Button>

        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="sr-only">Go to previous page</span>
          <ChevronLeft className="size-4" />
        </Button>

        <Button
          variant="outline"
          className="h-8 w-8 p-0"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to next page</span>
          <ChevronRight className="size-4" />
        </Button>

        <Button
          variant="outline"
          className="hidden h-8 w-8 p-0 lg:flex"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          <span className="sr-only">Go to last page</span>
          <ChevronsRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
