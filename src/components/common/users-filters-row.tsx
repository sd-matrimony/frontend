import { type UseFormReturn } from "react-hook-form";
import { RefreshCcw } from "lucide-react";

import { type findUserSchemaT } from "@/hooks/use-user-filters";
import { gender, maritalStatus } from '@/utils/enums';
import { useStatics } from "@/hooks/use-general";
import { cn } from "@/lib/utils";

import { InputWrapper, ComboboxWrapper } from "@/components/ui/field-wrapper-rhf";
import { Button } from "@/components/ui/button";

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
        placeholder="Caste"
        items={castes}
        control={methods.control}
        isLoading={isCasteLoading}
        className="min-w-44 sm:min-w-56 max-w-52"
      // canCreateNew
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
