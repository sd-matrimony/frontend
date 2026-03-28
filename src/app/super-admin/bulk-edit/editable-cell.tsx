"use client"

import { useState, useEffect } from "react"

import { cn } from "@/lib/utils"
import { Combobox } from "@/components/ui/combobox"
import { SelectWrapper } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

import type { OnBlurChange } from "./types"

type BaseCellProps = {
  userId: string
  path: string
  initialValue: string | number | undefined
  resetKey: number
  onBlurChange: OnBlurChange
  className?: string
}

function toStr(v: string | number | undefined): string {
  return v !== undefined && v !== null ? String(v) : ""
}

type EditInputProps = BaseCellProps & { type?: "text" | "number" }

export function EditInput({ userId, path, initialValue, resetKey, onBlurChange, type = "text", className }: EditInputProps) {
  const [value, setValue] = useState(() => toStr(initialValue))

  useEffect(() => {
    setValue(toStr(initialValue))
  }, [resetKey])

  const isDirty = value !== toStr(initialValue)

  function handleBlur() {
    if (!isDirty) return
    const parsed = type === "number"
      ? (value === "" ? undefined : Number(value))
      : (value || undefined)
    onBlurChange(userId, path, parsed)
  }

  return (
    <Input
      type={type}
      value={value}
      onChange={e => setValue(e.target.value)}
      onBlur={handleBlur}
      className={cn("h-7 text-xs min-w-28 px-2", isDirty && "border-primary", className)}
    />
  )
}

type EditSelectProps = BaseCellProps & { options: optionsT }

export function EditSelect({ userId, path, initialValue, resetKey, onBlurChange, options, className }: EditSelectProps) {
  const [value, setValue] = useState(() => toStr(initialValue))

  useEffect(() => {
    setValue(toStr(initialValue))
  }, [resetKey])

  const isDirty = value !== toStr(initialValue)

  function handleChange(v: string) {
    setValue(v)
    onBlurChange(userId, path, v)
  }

  return (
    <SelectWrapper
      options={options}
      value={value}
      onValueChange={handleChange}
      triggerCls={cn("h-7 text-xs min-w-28 px-2 font-normal", isDirty && "border-primary", className)}
    />
  )
}

type EditComboboxProps = BaseCellProps & { options: optionsT; isLoading?: boolean }

export function EditCombobox({ userId, path, initialValue, resetKey, onBlurChange, options, isLoading, className }: EditComboboxProps) {
  const [value, setValue] = useState(() => toStr(initialValue))

  useEffect(() => {
    setValue(toStr(initialValue))
  }, [resetKey])

  const isDirty = value !== toStr(initialValue)

  function handleChange(v: string | number | boolean) {
    const str = String(v)
    setValue(str)
    onBlurChange(userId, path, str)
  }

  return (
    <Combobox
      options={options}
      isLoading={isLoading}
      canCreateNew
      value={value}
      onValueChange={handleChange}
      triggerCls={cn("h-7 text-xs min-w-32 px-2 font-normal", isDirty && "border-primary", className)}
    />
  )
}
