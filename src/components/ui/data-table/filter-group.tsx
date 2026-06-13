import { useState } from 'react'
import { CirclePlus } from 'lucide-react'
import { Table } from '@tanstack/react-table'

import { type ComboboxWrapperProps } from '@/components/ui/combobox'
import { MenuCheckboxWrapper } from '@/components/ui/menu-wrapper'
import { buttonVariants } from '@/components/ui/button'
import { ColumnFilter } from './column-filter'

type ColumnFilterPassthroughProps = Omit<
  ComboboxWrapperProps,
  'items' | 'value' | 'onValueChange' | 'label' | 'multiple'
>
type MenuCheckboxPassthroughProps = Omit<
  React.ComponentProps<typeof MenuCheckboxWrapper>,
  'trigger' | 'items' | 'checked' | 'onCheckedChange'
>

interface FilterGroupProps<TData> {
  table: Table<TData>
  items: {
    value: string
    lable: React.ReactNode
    items: itemsT
    columnFilterProps?: ColumnFilterPassthroughProps
  }[]
  columnFilterProps?: ColumnFilterPassthroughProps
  menuCheckboxProps?: MenuCheckboxPassthroughProps
}

export function FilterGroup<TData>({
  table,
  items,
  columnFilterProps,
  menuCheckboxProps,
}: FilterGroupProps<TData>) {
  const [selected, setSelected] = useState<allowedPrimitiveT[]>([])

  return (
    <>
      {items
        .filter(f => selected.includes(f.value))
        .map(opt => (
          <ColumnFilter
            key={opt.value}
            title={opt.lable}
            items={opt.items}
            column={table.getColumn(opt.value)}
            {...columnFilterProps}
            {...opt.columnFilterProps}
          />
        ))}

      <MenuCheckboxWrapper
        trigger={
          <>
            <CirclePlus className="size-4" /> Filter
          </>
        }
        triggerCls={buttonVariants({ variant: 'outline' })}
        {...menuCheckboxProps}
        checked={selected}
        onCheckedChange={(val, checked) =>
          setSelected(prev => (!checked ? prev.filter(p => !p) : [...prev, val]))
        }
        items={items.map(m => ({ label: m.lable, value: m.value }))}
      />
    </>
  )
}
