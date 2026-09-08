"use client"

import { useState } from "react"
import { Eye, EyeOff, Loader } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { useTranslations } from "next-intl"

import { signinSchema, type SigninFormT } from "@/utils/auth-schema"
import { useLogin } from "@/hooks/use-account"
import { trimObj } from "@/utils"

import { InputGroupWrapper, InputWrapper } from "@/components/ui/field-wrapper-rhf"
import { InputGroupButton } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"

type Props = {
  role?: rolesT
}

function Signin({ role = "user" }: Props) {
  const t = useTranslations("auth")
  const [showPass, setShowPass] = useState(false)

  const { control, handleSubmit } = useForm<SigninFormT>({
    resolver: zodResolver(signinSchema),
    defaultValues: { email: "", password: "" },
  })

  const { isPending, mutate } = useLogin()

  const onSubmit = (data: SigninFormT) => mutate({ ...trimObj(data), role })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputWrapper
        name="email"
        label={t("fields.emailOrMobile")}
        control={control}
      />

      <InputGroupWrapper
        name="password"
        label={t("fields.password")}
        control={control}
        type={showPass ? "text" : "password"}
        addonEnd={
          <InputGroupButton onClick={() => setShowPass(p => !p)}>
            {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </InputGroupButton>
        }
      />

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-pink-500 hover:bg-pink-600"
      >
        {isPending && <Loader className="animate-spin" />}
        {t("actions.signIn")}
      </Button>
    </form>
  )
}

export default Signin
