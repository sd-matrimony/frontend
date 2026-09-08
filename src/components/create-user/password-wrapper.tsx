import { useState } from "react";
import { useController, useFormContext } from "react-hook-form";
import { usePathname } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";

import { createPass } from "@/utils/password";

import { InputGroupWrapper, InputGroupButton } from "@/components/ui/input-group";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

type props = {
  className?: string
}

export function PasswordWrapper({ className }: props) {
  const t = useTranslations("shared.createUser")
  const [showPassword, setShowPassword] = useState(true)
  const { control, getValues, setValue, clearErrors } = useFormContext()
  const { field, fieldState } = useController({ name: "password", control })
  const toast = useToast()

  const pathname = usePathname()
  const isAdmin = pathname.includes("admin")

  function autoGeneratePassword() {
    const { fullName, dob } = getValues()
    if (!fullName) return toast.add({ title: t("fillFullName") })
    if (!dob) return toast.add({ title: t("fillDob") })
    const password = createPass(fullName, dob)
    setValue("password", password)
    clearErrors("password")
  }

  return (
    <Field className={className} invalid={fieldState.invalid}>
      <div className="df justify-between">
        <FieldLabel htmlFor="password">{t("password")}</FieldLabel>
        {isAdmin && (
          <Button
            size="sm"
            type="button"
            variant="secondary"
            className="h-auto p-0 text-xs bg-transparent font-normal hover:underline hover:bg-transparent shadow-none"
            onClick={autoGeneratePassword}
          >
            {t("autoGenerate")}
          </Button>
        )}
      </div>
      <InputGroupWrapper
        id="password"
        type={showPassword ? "text" : "password"}
        placeholder={t("enterPassword")}
        addonEnd={
          <InputGroupButton onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
          </InputGroupButton>
        }
        {...field}
        value={field.value ?? ''}
      />
      <FieldError errors={[fieldState.error]} />
    </Field>
  )
}
