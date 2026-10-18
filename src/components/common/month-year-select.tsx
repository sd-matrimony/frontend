"use client";

import { useState } from "react";
import { format } from "date-fns";

import { SelectWrapper } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const YEARS_BACK = 5

const MONTHS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1).padStart(2, "0"),
  label: format(new Date(2000, i, 1), "MMM"),
}))

const sizeCls = {
  sm: "h-8",
  xs: "h-6 pl-2 pr-0.5 text-xs [&>span:last-child]:size-5",
}

type props = {
  value: string
  onChange: (value: string) => void
  extraOption?: { value: string, label: string }
  size?: keyof typeof sizeCls
  className?: string
}

export function MonthYearSelect({ value, onChange, extraOption, size = "sm", className }: props) {
  const currentYear = new Date().getFullYear()
  const isExtra = !!extraOption && value === extraOption.value

  const [year, setYear] = useState(isExtra ? String(currentYear) : value.slice(0, 4))
  const month = isExtra ? value : value.slice(5, 7)

  const years = Array.from({ length: YEARS_BACK }, (_, i) => String(currentYear - i))
  const months = extraOption ? [extraOption, ...MONTHS] : MONTHS

  function onMonthChange(m: string) {
    onChange(extraOption && m === extraOption.value ? m : `${year}-${m}`)
  }

  function onYearChange(y: string) {
    setYear(y)
    if (!isExtra) onChange(`${y}-${month}`)
  }

  return (
    <div className={cn("flex items-center gap-1 shrink-0", className)}>
      <SelectWrapper
        items={months}
        value={month}
        onValueChange={v => onMonthChange(v as string)}
        triggerCls={cn("w-fit", sizeCls[size])}
      />

      {
        !isExtra &&
        <SelectWrapper
          items={years}
          value={year}
          onValueChange={v => onYearChange(v as string)}
          triggerCls={cn("w-fit", sizeCls[size])}
        />
      }
    </div>
  )
}
