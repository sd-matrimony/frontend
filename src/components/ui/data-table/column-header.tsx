import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react'
import { Column } from '@tanstack/react-table'

import { cn } from '@/lib/utils'

import { Menu, MenuContent, MenuItem, MenuSeparator, MenuTrigger } from '@/components/ui/menu'
import { buttonVariants } from '@/components/ui/button'

interface ColumnHeaderProps<TData, TValue> {
  className?: string
  column: Column<TData, TValue>
  title: React.ReactNode
}

export function ColumnHeader<TData, TValue>({
  title,
  column,
  className,
}: ColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) return <div className={cn(className)}>{title}</div>

  return (
    <Menu>
      <MenuTrigger className={cn(buttonVariants({ variant: 'ghost', className }), '-ml-2')}>
        {title}
        {column.getIsSorted() === 'desc' ? (
          <ArrowDown />
        ) : column.getIsSorted() === 'asc' ? (
          <ArrowUp />
        ) : (
          <ChevronsUpDown />
        )}
      </MenuTrigger>

      <MenuContent align="start">
        <MenuItem
          onClick={() =>
            column.getIsSorted() !== 'asc' ? column.toggleSorting(false) : column.clearSorting()
          }
        >
          <ArrowUp className="h-3.5 w-3.5 text-muted-foreground/70" />
          Asc
        </MenuItem>

        <MenuItem
          onClick={() =>
            column.getIsSorted() !== 'desc' ? column.toggleSorting(true) : column.clearSorting()
          }
        >
          <ArrowDown className="h-3.5 w-3.5 text-muted-foreground/70" />
          Desc
        </MenuItem>

        <MenuSeparator />

        <MenuItem onClick={() => column.toggleVisibility(false)}>
          <EyeOff className="h-3.5 w-3.5 text-muted-foreground/70" />
          Hide Column
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
