import { ChevronsDown, ChevronsUp, ChevronsUpDown } from 'lucide-react'
import { Column } from '@tanstack/react-table'

import { cn } from '@/lib/utils'

import { Button } from '@/components/ui/button'

interface ColumnHeaderProps<TData, TValue> {
  className?: string
  column: Column<TData, TValue>
  title: React.ReactNode
}

export function ColumnSorter<TData, TValue>({
  title,
  column,
  className,
}: ColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) return <div className={cn(className)}>{title}</div>

  const sorted = column.getIsSorted()

  function onSort() {
    if (sorted === 'asc') {
      column.toggleSorting(true)
    } else if (sorted === 'desc') {
      column.clearSorting()
    } else {
      column.toggleSorting(false)
    }
  }

  return (
    <Button variant="ghost" className={cn('-ml-2', className)} onClick={onSort}>
      {title}
      {sorted === 'desc' ? (
        <ChevronsDown className="ml-4 opacity-80" />
      ) : sorted === 'asc' ? (
        <ChevronsUp className="ml-4 opacity-80" />
      ) : (
        <ChevronsUpDown className="ml-4 opacity-80" />
      )}
    </Button>
  )
}
