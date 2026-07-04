import { useEffect, useState } from 'react'
import { type Column } from '@tanstack/react-table'

import { getLabel, getValue, isGroup } from '@/lib/utils'

import { ComboboxWrapper, type ComboboxWrapperProps } from '@/components/ui/combobox'

interface ColumnFacetedFilterProps<TData, TValue>
  extends Omit<ComboboxWrapperProps, 'value' | 'onValueChange' | 'label'> {
  column?: Column<TData, TValue>
  title: React.ReactNode
}

function change(item: allowedPrimitiveT | itemT, facets?: Map<any, number>) {
  const value = getValue(item)
  const label = getLabel(item)

  return {
    label: (
      <>
        {label}
        {facets?.get(value) && (
          <span className="ml-auto flex h-4 w-4 items-center justify-center text-xs">
            {facets.get(value)}
          </span>
        )}
      </>
    ),
    value,
  }
}

export function ColumnFacetedFilter<TData, TValue>({
  column,
  title,
  items,
  ...props
}: ColumnFacetedFilterProps<TData, TValue>) {
  const [facets, setFacets] = useState<Map<unknown, number> | undefined>()

  useEffect(() => {
    setFacets(column?.getFacetedUniqueValues())
  }, [column])

  const newItems = (items ?? []).map(item => {
    if (isGroup(item)) {
      return {
        ...item,
        items: item.items.map(o => change(o, facets)),
      }
    }

    return change(item, facets)
  })

  function onSelect(selected: allowedPrimitiveT[]) {
    column?.setFilterValue(selected?.length ? selected : undefined)
  }

  return (
    <ComboboxWrapper
      multiple
      items={newItems}
      value={(column?.getFilterValue() as string[]) ?? []}
      onValueChange={v => onSelect(v as any)}
      // label={typeof title === "object" ? title : <span className="font-semibold">{title}</span>}
      indicatorAt=""
      {...props}
    />
  )
}
