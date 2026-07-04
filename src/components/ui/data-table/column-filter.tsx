import { type Column } from '@tanstack/react-table'

import { ComboboxWrapper, type ComboboxWrapperProps } from '@/components/ui/combobox'

interface ColumndFilterProps<TData, TValue>
  extends Omit<ComboboxWrapperProps, 'value' | 'onValueChange' | 'label'> {
  column?: Column<TData, TValue>
  title: React.ReactNode
}

export function ColumnFilter<TData, TValue>({
  title,
  items,
  column,
  ...props
}: ColumndFilterProps<TData, TValue>) {
  function onSelect(selected: allowedPrimitiveT) {
    column?.setFilterValue(selected ?? undefined)
  }

  return (
    <ComboboxWrapper
      items={items}
      value={column?.getFilterValue() ?? ''}
      onValueChange={v => onSelect(v as any)}
      // label={typeof title === "object" ? title : <span className="font-semibold">{title}</span>}
      {...props}
    />
  )
}
