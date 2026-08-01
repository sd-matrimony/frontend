import { useMemo, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { RefreshCcw } from "lucide-react";

import { type findUserSchemaT } from "@/hooks/use-user-filters";
import { gender, maritalStatus } from '@/utils/enums';
import { useStatics } from "@/hooks/use-general";
import { cn } from "@/lib/utils";

import { InputWrapper, ComboboxWrapper } from "@/components/ui/field-wrapper-rhf";
import { Button } from "@/components/ui/button";

function useCreatableItems(base: string[] | undefined, extra: string[], query: string) {
  return useMemo(() => {
    const merged = Array.from(new Set([...(base || []), ...extra]))
    const q = query.trim()
    if (q && !merged.some(v => v.toLowerCase() === q.toLowerCase())) {
      return [...merged, q]
    }
    return merged
  }, [base, extra, query])
}

function commitNewValues(value: unknown, known: string[] | undefined, setExtra: React.Dispatch<React.SetStateAction<string[]>>) {
  const values = Array.isArray(value) ? value as string[] : []
  const unknown = values.filter(v => v && !known?.includes(v))
  if (unknown.length) {
    setExtra(prev => Array.from(new Set([...prev, ...unknown])))
  }
}

type props = {
  methods: UseFormReturn<findUserSchemaT>
  children?: React.ReactNode
  className?: string
  needReset?: boolean
  isLoading: boolean
  onReset: () => void
  onSubmit: (v: findUserSchemaT) => void
  onRefresh?: () => void
}

function UsersFiltersRow({ methods, children, className, needReset, isLoading, onSubmit, onReset, onRefresh }: props) {
  const { data: castes, isLoading: isCasteLoading } = useStatics("castes")
  const { data: casteMap, isLoading: isCasteMapLoading } = useStatics("casteMap")

  const selectedCastes = methods.watch("caste")
  const casteList = Array.isArray(selectedCastes) ? selectedCastes : selectedCastes ? [selectedCastes] : []

  const subCastes = useMemo(() => {
    const map = (casteMap || {}) as Record<string, string[]>
    const source = casteList.length ? casteList : Object.keys(map)
    return Array.from(new Set(source.flatMap(caste => map[caste] || [])))
  }, [casteMap, casteList.join(",")])

  const [casteQuery, setCasteQuery] = useState("")
  const [casteExtra, setCasteExtra] = useState<string[]>([])
  const casteItems = useCreatableItems(castes, casteExtra, casteQuery)

  const [subCasteQuery, setSubCasteQuery] = useState("")
  const [subCasteExtra, setSubCasteExtra] = useState<string[]>([])
  const subCasteItems = useCreatableItems(subCastes, subCasteExtra, subCasteQuery)

  return (
    <form
      onSubmit={methods.handleSubmit(onSubmit)}
      className={cn("df flex-wrap", className)}
    >
      <InputWrapper
        name="fullName"
        control={methods.control}
        placeholder="Enter Full Name"
        className="max-w-48"
      />

      <InputWrapper
        type="tel"
        name="mobile"
        control={methods.control}
        placeholder="Mobile"
        className="max-w-48"
      />

      <InputWrapper
        name="email"
        control={methods.control}
        placeholder="Email"
        className="max-w-48"
      />

      <ComboboxWrapper
        multiple
        name="gender"
        placeholder="Gender"
        items={gender}
        control={methods.control}
        className="min-w-36 max-w-40"

      />

      <ComboboxWrapper
        multiple
        name="maritalStatus"
        placeholder="Marital Status"
        items={maritalStatus}
        control={methods.control}
        className="min-w-32 sm:min-w-40 max-w-40"
      />

      <ComboboxWrapper
        multiple
        name="caste"
        placeholder="Caste, or type to add new"
        items={casteItems}
        control={methods.control}
        isLoading={isCasteLoading}
        inputValue={casteQuery}
        onInputValueChange={setCasteQuery}
        onValueChange={value => {
          commitNewValues(value, castes, setCasteExtra)
          setCasteQuery("")
        }}
        className="min-w-44 sm:min-w-56 max-w-52"
      />

      <ComboboxWrapper
        multiple
        name="subCaste"
        placeholder="Sub Caste, or type to add new"
        items={subCasteItems}
        control={methods.control}
        isLoading={isCasteMapLoading}
        inputValue={subCasteQuery}
        onInputValueChange={setSubCasteQuery}
        onValueChange={value => {
          commitNewValues(value, subCastes, setSubCasteExtra)
          setSubCasteQuery("")
        }}
        className="min-w-44 sm:min-w-56 max-w-52"
      />

      {children}

      <span className="flex-1"></span>

      {
        methods.formState.isDirty &&
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="font-normal"
        >
          Reset to previuos
        </Button>
      }

      {
        needReset &&
        <Button
          type="button"
          variant="secondary"
          onClick={onReset}
          className="border font-normal order-12"
        >
          Reset to Default
        </Button>
      }

      <Button
        type="submit"
        className="bg-pink-600 hover:bg-pink-500 order-12"
        disabled={!methods.formState.isDirty}
      >
        Search
      </Button>

      <Button
        type="button"
        variant="outline"
        onClick={onRefresh}
        className="font-normal group order-12"
        disabled={isLoading}
      >
        <RefreshCcw
          className={cn("transition-transform", {
            "animate-spin": isLoading,
            "group-hover:rotate-180": !isLoading,
          })}
        />
      </Button>
    </form>
  )
}

export default UsersFiltersRow
