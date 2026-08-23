import { Settings2 } from 'lucide-react'
import { type RowData } from '@tanstack/react-table'

import { Menu, MenuCheckboxItem, MenuContent, MenuTrigger } from '@/components/ui/menu'
import { buttonVariants } from '@/components/ui/button'
import { type AppTable as Table } from './table-features'

interface ColumnToggleProps<TData extends RowData> {
  table: Table<TData>
}

export function ColumnToggle<TData extends RowData>({ table }: ColumnToggleProps<TData>) {
  return (
    <Menu>
      <MenuTrigger className={buttonVariants({ variant: 'outline' })}>
        <Settings2 />
        View
      </MenuTrigger>

      <MenuContent align="end" className="w-38">
        {/* <MenuLabel>Toggle columns</MenuLabel> */}
        {/* <MenuSeparator /> */}
        {table
          .getAllColumns()
          .filter(column => typeof column.accessorFn !== 'undefined' && column.getCanHide())
          .map(column => (
            <MenuCheckboxItem
              key={column.id}
              className="capitalize"
              checked={column.getIsVisible()}
              onCheckedChange={value => column.toggleVisibility(!!value)}
            >
              {column.id?.replace('_', ' ')}
            </MenuCheckboxItem>
          ))}
      </MenuContent>
    </Menu>
  )
}
