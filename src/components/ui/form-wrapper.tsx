"use client"

import { useState } from 'react'
import { Control, FieldValues, Path } from "react-hook-form"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { cn, getKey, getLabel, getValue, parseAllowedPrimitive } from "@/lib/utils"

import { type comboboxProps, type multiSelectComboboxProps, Combobox, MultiSelectCombobox } from "./combobox"
import { type selectProps, SelectWrapper as SelectPrimitiveWrapper } from "./select"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "./form"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { RadioGroup, RadioGroupItem } from "./radio-group"
import { Calendar } from "./calendar"
import { Textarea } from "./textarea"
import { Checkbox } from './checkbox'
import { Button } from "./button"
import { Switch } from './switch'
import { Input } from "./input"

type BaseProps<T extends FieldValues> = {
  name: Path<T>
  label?: React.ReactNode
  control: Control<T>
  className?: string
}

type InputProps<T extends FieldValues> = BaseProps<T> &
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'value' | 'onChange' | 'onBlur'>
export function InputWrapper<T extends FieldValues>({ name, label, control, className, type = "text", placeholder, ...props }: InputProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <Input
              type={type}
              placeholder={placeholder || `Enter ${label}`}
              {...field}
              {...props}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

type TextareaProps<T extends FieldValues> = BaseProps<T> &
  Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'name' | 'value' | 'onChange' | 'onBlur'>
export function TextareaWrapper<T extends FieldValues>({ name, label, control, className, placeholder, ...rest }: TextareaProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <Textarea placeholder={placeholder || `Enter ${label}`} {...rest} {...field} />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

type RadioProps<T extends FieldValues> = BaseProps<T> & {
  options: (allowedPrimitiveT | optionT)[]
}
export function RadioWrapper<T extends FieldValues>({ name, label, control, className, options }: RadioProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <RadioGroup
              value={`${field.value}`}
              onValueChange={value => field.onChange(parseAllowedPrimitive(value))}
              className="flex items-center flex-wrap gap-12"
            >
              {options.map((option, i) => (
                <FormItem
                  key={getKey(option, i)}
                  className="flex flex-row items-center gap-2"
                >
                  <FormControl>
                    <RadioGroupItem value={`${getValue(option)}`} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    {getLabel(option)}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

type CheckboxProps<T extends FieldValues> = BaseProps<T> & {
  options: (allowedPrimitiveT | optionT)[]
}
export function CheckboxWrapper<T extends FieldValues>({
  name,
  label,
  control,
  className,
  options
}: CheckboxProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const valueArr: allowedPrimitiveT[] = Array.isArray(field.value)
          ? field.value
          : []

        const toggleValue = (v: allowedPrimitiveT) => {
          if (valueArr.includes(v)) {
            field.onChange(valueArr.filter(x => x !== v))
          } else {
            field.onChange([...valueArr, v])
          }
        }

        return (
          <FormItem className={className}>
            {label && <FormLabel>{label}</FormLabel>}

            <div className="flex items-center flex-wrap gap-4">
              {options.map((option, i) => {
                const val = getValue(option)
                const isChecked = valueArr.includes(parseAllowedPrimitive(val))

                return (
                  <FormItem
                    key={getKey(option, i)}
                    className="flex items-center gap-2 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleValue(parseAllowedPrimitive(val))}
                      />
                    </FormControl>

                    <FormLabel className="font-normal">
                      {getLabel(option)}
                    </FormLabel>
                  </FormItem>
                )
              })}
            </div>

            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export function SwitchWrapper<T extends FieldValues>({ name, label, control, className }: BaseProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          <div className='flex items-center justify-between gap-4'>
            {label && <FormLabel className="font-normal">{label}</FormLabel>}

            <FormControl>
              <Switch
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-label={typeof label === "string" ? label : name}
              />
            </FormControl>
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

type SelectProps<T extends FieldValues> = BaseProps<T> & Omit<selectProps, "value" | "onValueChange">
export function SelectWrapper<T extends FieldValues>({ name, label, control, className, options, placeholder, ...props }: SelectProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <SelectPrimitiveWrapper
              {...props}
              options={options}
              value={`${field.value}`}
              placeholder={placeholder ?? `Select ${label}`}
              onValueChange={value => field.onChange(parseAllowedPrimitive(value))}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

type DatePickerProps<T extends FieldValues> = BaseProps<T> & Omit<React.ComponentProps<typeof Calendar>, "selected" | "onSelect">
export function DatePickerWrapper<T extends FieldValues>({ name, label, control, className, ...calendarProps }: DatePickerProps<T>) {
  const [open, setOpen] = useState(false)

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                >
                  {field.value ? format(field.value, "dd/MM/yyyy") : <span>Pick a date</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                autoFocus
                mode="single"
                captionLayout="dropdown"
                selected={field.value}
                onSelect={(date: any) => {
                  field.onChange(date)
                  setOpen(false)
                }}
                defaultMonth={field.value}
                {...calendarProps}
              />
            </PopoverContent>
          </Popover>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

type ComboboxProps<T extends FieldValues> = BaseProps<T> & Omit<comboboxProps, "value" | "onValueChange">
export function ComboboxWrapper<T extends FieldValues>({ name, label, control, className, placeholder, ...rest }: ComboboxProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <Combobox
              {...rest}
              value={field.value}
              placeholder={placeholder || `Select ${label}`}
              onValueChange={field.onChange}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}

type MultiSelectComboboxProps<T extends FieldValues> = BaseProps<T> & Omit<multiSelectComboboxProps, "value" | "onValueChange">
export function MultiSelectComboboxWrapper<T extends FieldValues>({ name, label, control, className, placeholder, ...rest }: MultiSelectComboboxProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className={className}>
          {label && <FormLabel>{label}</FormLabel>}

          <FormControl>
            <MultiSelectCombobox
              {...rest}
              value={field.value}
              placeholder={placeholder || `Select ${label}`}
              onValueChange={field.onChange}
            />
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
