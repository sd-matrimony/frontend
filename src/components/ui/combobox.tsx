"use client"

import { useState } from "react"
import { Check, ChevronsUpDown, Loader2, Plus } from "lucide-react"
import { Popover as PopoverPrimitive } from "radix-ui"

import { cn, getKey, getLabel, getValue, isAllowedPrimitive, isGroup, isOption, isSeparator } from "@/lib/utils"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
  CommandSeparator,
} from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const extractText = (node: any): string => {
  if (node === null || node === undefined) return ""
  if (isAllowedPrimitive(node)) return String(node)
  if (Array.isArray(node)) return node.map(extractText).join(" ")
  if (node.props?.children) return extractText(node.props.children)
  return ""
}

const findOptionByValue = (options: optionsT, value: allowedPrimitiveT) => {
  for (const item of options) {
    if (isGroup(item)) {
      const found = item.options.find((opt) => getValue(opt) === value)
      if (found) return found
    } else if (!isSeparator(item) && getValue(item) === value) {
      return item
    }
  }
  return ""
}

const filteredOptions = (options: optionsT, query: string): optionsT => {
  const q = query.toLowerCase()
  const result: optionsT = []

  for (const item of options) {
    if (isGroup(item)) {
      const filtered = item.options.filter(opt =>
        extractText(getLabel(opt)).toLowerCase().includes(q)
      )
      if (filtered.length) {
        result.push({ ...item, options: filtered })
      }
      continue
    }

    if (isSeparator(item)) {
      result.push(item)
      continue
    }

    if (extractText(getLabel(item)).toLowerCase().includes(q)) {
      result.push(item)
    }
  }

  return result
}

type ItemProps = {
  option: allowedPrimitiveT | optionT
  selected: boolean
  className?: string
  indicatorAt?: indicatorAtT
  onSelect: (value: allowedPrimitiveT) => void
}
function Item({ option, selected, indicatorAt = "left", onSelect, className }: ItemProps) {
  const value = getValue(option)
  const label = getLabel(option)
  const optCls = isOption(option) ? option.className : undefined

  if (isSeparator(value)) return <CommandSeparator className={cn("my-0.5", className, "mx-0")} />

  return (
    <CommandItem
      value={`${value}`}
      className={cn(indicatorAt === "right" ? "pr-8 pl-2" : "pr-2 pl-8", className, optCls)}
      onSelect={() => onSelect(value)}
    >
      {label}

      <Check
        className={cn(
          "absolute size-4",
          selected ? "opacity-100" : "opacity-0",
          indicatorAt === "right" ? "right-2" : "left-2",
        )}
      />
    </CommandItem>
  )
}

type base = {
  id?: string
  options: optionsT
  isLoading?: boolean
  placeholder?: string
  emptyMessage?: string

  indicatorAt?: indicatorAtT
  triggerCls?: string
  contentCls?: string
  groupCls?: string
  itemCls?: string
  matchTriggerWidth?: boolean

  open?: boolean
  onOpenChange?: (v: boolean) => void
  query?: string
  onQueryChange?: (v: string) => void

  popoverContentProps?: Omit<React.ComponentProps<typeof PopoverPrimitive.Content>, "className">
}

type comboboxProps = base & {
  value?: allowedPrimitiveT
  canCreateNew?: boolean
  onValueChange?: (value: allowedPrimitiveT) => void
}
function Combobox({
  id,
  options = [],
  isLoading,
  placeholder,
  emptyMessage,
  canCreateNew,

  matchTriggerWidth = true,
  indicatorAt,
  triggerCls,
  contentCls,
  groupCls,
  itemCls,

  value: o_value,
  onValueChange: o_onValueChange,

  query: o_query,
  onQueryChange: o_onQueryChange,

  open: o_open,
  onOpenChange: o_onOpenChange,

  popoverContentProps,
}: comboboxProps) {
  const [i_value, setIValue] = useState("")
  const [i_query, setIQuery] = useState("")
  const [i_open, setIOpen] = useState(false)

  const value = o_value ?? i_value
  const query = o_query ?? i_query
  const open = o_open ?? i_open

  const onValueChange = o_onValueChange ?? setIValue
  const onQueryChange = o_onQueryChange ?? setIQuery
  const onOpenChange = o_onOpenChange ?? setIOpen

  const selectedOption = findOptionByValue(options, value)
  const filtered = filteredOptions(options, query)
  const label = getLabel(selectedOption)

  const showCreate =
    canCreateNew &&
    query &&
    !options.some((o) =>
      isGroup(o)
        ? o.options.some((x) => extractText(getLabel(x)) === query)
        : extractText(getLabel(o)) === query
    )

  function onSelect(v: allowedPrimitiveT) {
    onValueChange(v as string)
    onOpenChange(false)
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          role="combobox"
          variant="outline"
          className={cn("font-normal", triggerCls, {
            "text-muted-foreground": !value && value !== false,
          })}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Loading...
            </>
          ) :
            <span className="flex items-center gap-2 truncate">
              {
                (selectedOption || selectedOption === false)
                  ? label
                  : placeholder
              }
            </span>
          }

          <ChevronsUpDown className="ml-auto size-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        {...popoverContentProps}
        className={cn("p-0", matchTriggerWidth && "w-[var(--radix-popover-trigger-width)]", contentCls)}
      >
        <Command shouldFilter={false}>
          {
            !isLoading &&
            <CommandInput
              placeholder="Search..."
              value={query}
              onValueChange={onQueryChange}
            />
          }

          <CommandList className="py-1">
            {
              isLoading &&
              <CommandLoading>
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin size-4" /> Loading...
                </span>
              </CommandLoading>
            }

            {
              !isLoading &&
              <CommandEmpty>{emptyMessage || "No options found"}</CommandEmpty>
            }

            {!isLoading && filtered.map((item, i) => {
              if (isGroup(item)) {
                return (
                  <CommandGroup
                    key={item.group}
                    heading={item.group}
                    className={cn("[&_[cmdk-group-heading]]:pb-0.5", groupCls, item.className)}
                  >
                    {item.options.map((opt, j) => (
                      <Item
                        key={getKey(opt, j)}
                        option={opt}
                        selected={getValue(opt) === value}
                        onSelect={onSelect}
                        className={itemCls}
                        indicatorAt={indicatorAt}
                      />
                    ))}
                  </CommandGroup>
                )
              }

              return (
                <Item
                  key={getKey(item, i)}
                  option={item}
                  selected={getValue(item) === value}
                  onSelect={onSelect}
                  indicatorAt={indicatorAt}
                  className={cn("mx-1", itemCls)}
                />
              )
            })}

            {showCreate && (
              <CommandGroup>
                <CommandItem
                  value={`__create-${query}`}
                  onSelect={() => {
                    onValueChange(query)
                    onQueryChange("")
                    onOpenChange(false)
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" /> Create: {query}
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

type btnLableProps = {
  value: allowedPrimitiveT[]
  options: optionsT
  isLoading?: boolean
  placeholder?: string
  maxVisibleCount?: number
}
function ButtonLabel({
  value,
  options,
  isLoading,
  placeholder,
  maxVisibleCount = 2,
}: btnLableProps) {
  const labelOf = (val: allowedPrimitiveT) => {
    const found = findOptionByValue(options, val)
    if (!found) return `${val}`
    const label = getLabel(found)
    return label
  }

  if (isLoading)
    return (
      <>
        <Loader2 className="size-4 animate-spin" />
        Loading...
      </>
    )

  if (value.length === 0) {
    return placeholder
  }

  if (value.length <= maxVisibleCount) {
    return (
      <>
        {value.map((v) => (
          <Badge key={String(v)} variant="secondary" className="rounded-sm px-1 font-normal">
            {labelOf(v)}
          </Badge>
        ))}
      </>
    )
  }

  return (
    <Badge variant="secondary" className="rounded-sm px-1 font-normal">
      {value.length} selected
    </Badge>
  )
}

type multiSelectComboboxProps = base & {
  value?: allowedPrimitiveT[]
  maxVisibleCount?: number
  label?: React.ReactNode
  onValueChange?: (v: allowedPrimitiveT[]) => void
}
function MultiSelectCombobox({
  id,
  options = [],
  isLoading,
  placeholder,
  emptyMessage,

  matchTriggerWidth = true,
  maxVisibleCount,
  indicatorAt,
  triggerCls,
  contentCls,
  groupCls,
  itemCls,
  label,

  value: o_value,
  onValueChange: o_onValueChange,

  query: o_query,
  onQueryChange: o_onQueryChange,

  open: o_open,
  onOpenChange: o_onOpenChange,
  popoverContentProps,
}: multiSelectComboboxProps) {
  const [i_value, setIValue] = useState<allowedPrimitiveT[]>([])
  const [i_query, setIQuery] = useState("")
  const [i_open, setIOpen] = useState(false)

  const value = o_value ?? i_value
  const query = o_query ?? i_query
  const open = o_open ?? i_open

  const onValueChange = o_onValueChange ?? setIValue
  const onQueryChange = o_onQueryChange ?? setIQuery
  const onOpenChange = o_onOpenChange ?? setIOpen

  const filtered = filteredOptions(options, query)

  const onSelect = (v: allowedPrimitiveT) => {
    onValueChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v])
  }

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          role="combobox"
          variant="outline"
          aria-expanded={open}
          className={cn("font-normal", triggerCls, {
            "text-muted-foreground": value.length === 0,
          })}
        >
          {label}

          <ButtonLabel
            value={value}
            options={options}
            isLoading={isLoading}
            placeholder={placeholder}
            maxVisibleCount={maxVisibleCount}
          />

          <ChevronsUpDown className="ml-auto size-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        {...popoverContentProps}
        className={cn("p-0", matchTriggerWidth && "w-[var(--radix-popover-trigger-width)]", contentCls)}
      >
        <Command shouldFilter={false}>
          {
            !isLoading &&
            <CommandInput
              placeholder="Search..."
              value={query}
              onValueChange={onQueryChange}
            />
          }

          <CommandList className="py-1">
            {
              isLoading &&
              <CommandLoading>
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin size-4" /> Loading...
                </span>
              </CommandLoading>
            }

            {
              !isLoading &&
              <CommandEmpty>{emptyMessage || "No options found"}</CommandEmpty>
            }

            {!isLoading && filtered.map((item, i) => {
              if (isGroup(item)) {
                return (
                  <CommandGroup
                    key={item.group}
                    heading={item.group}
                    className={cn("[&_[cmdk-group-heading]]:pb-0.5", groupCls, item.className)}
                  >
                    {item.options.map((opt, j) => (
                      <Item
                        key={getKey(opt, j)}
                        option={opt}
                        selected={value.includes(getValue(opt))}
                        onSelect={onSelect}
                        indicatorAt={indicatorAt}
                        className={itemCls}
                      />
                    ))}
                  </CommandGroup>
                )
              }

              return (
                <Item
                  key={getKey(item, i)}
                  option={item}
                  selected={value.includes(getValue(item))}
                  onSelect={onSelect}
                  indicatorAt={indicatorAt}
                  className={cn("mx-1 mb-1", itemCls)}
                />
              )
            })}

            {value.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem onSelect={() => onValueChange([])} value="__clear__" className="justify-center">
                    Clear selection(s)
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export {
  Combobox,
  MultiSelectCombobox,
  type comboboxProps,
  type multiSelectComboboxProps,
}