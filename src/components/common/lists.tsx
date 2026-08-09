"use client";

import { Control, FieldValues, Path } from "react-hook-form";

import { useStatics } from "@/hooks/use-general";

import { AutocompleteWrapper, ComboboxWrapper, SelectWrapper } from "@/components/ui/field-wrapper-rhf";

type BaseProps<T extends FieldValues> = {
  name: Path<T>
  control: Control<T>
  additionalOpts?: string | string[]
}

type props<T extends FieldValues> = BaseProps<T> & {
  label?: string
  listName: staticsNameT
  placeholder?: string
  canCreateNew?: boolean
  showClear?: boolean
  className?: string
}
export function SelectListWrapper<T extends FieldValues>({ name, label, control, placeholder, listName, canCreateNew, showClear, className, additionalOpts }: props<T>) {
  const { data, isLoading } = useStatics(listName)

  const Comp = canCreateNew ? AutocompleteWrapper : showClear ? ComboboxWrapper : SelectWrapper
  return (
    <Comp
      name={name}
      label={label}
      control={control}
      items={isLoading ? [] : [
        ...(additionalOpts ? typeof additionalOpts === "string" ? [additionalOpts] : additionalOpts : []),
        ...(data || [])
      ]}
      isLoading={isLoading}
      showClear={showClear}
      placeholder={placeholder || `Select ${label}`}
      className={className}
    />
  )
}

type props2<T extends FieldValues> = BaseProps<T> & {
  choosed: string
  className?: string
}
export function SelectSubCastesWrapper<T extends FieldValues>({ name, control, choosed = "", className, additionalOpts }: props2<T>) {
  const { data, isLoading } = useStatics("casteMap")

  return (
    <AutocompleteWrapper
      name={name}
      label="Sub / Other Caste"
      control={control}
      items={isLoading ? [] : [
        ...(additionalOpts ? typeof additionalOpts === "string" ? [additionalOpts] : additionalOpts : []),
        ...(data?.[choosed] || [])
      ]}
      isLoading={isLoading}
      placeholder="Select Sub / Other Caste"
      className={className}
    />
  )
}
