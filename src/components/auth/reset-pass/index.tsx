"use client"

import { useState } from "react"
import { Eye, EyeOff, Loader } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { resetPassSchema, type ResetPassFormT } from "@/utils/auth-schema"
import { useResetPass } from "@/hooks/use-account"

import { InputGroupWrapper, InputWrapper } from "@/components/ui/field-wrapper-rhf"
import { InputGroupButton } from "@/components/ui/input-group"
import { Button } from "@/components/ui/button"

type Props = {
  role?: rolesT
}

function ResetPass({ role = "user" }: Props) {
  const [showPass, setShowPass] = useState(false)

  const { control, handleSubmit } = useForm<ResetPassFormT>({
    resolver: zodResolver(resetPassSchema),
    defaultValues: { email: "", password: "", otp: "" },
  })

  const { isPending, mutate } = useResetPass()

  const onSubmit = (data: ResetPassFormT) => mutate({ ...data, otp: Number(data.otp), role })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <InputWrapper
        name="email"
        control={control}
        label="Email or Mobile Number"
      />

      <InputGroupWrapper
        name="password"
        label="New Password"
        control={control}
        type={showPass ? "text" : "password"}
        addonEnd={
          <InputGroupButton onClick={() => setShowPass(p => !p)}>
            {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </InputGroupButton>
        }
      />

      <InputWrapper
        name="otp"
        type="number"
        label="OTP"
        control={control}
        className="no-number-arrows"
      />

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-pink-500 hover:bg-pink-600"
      >
        {isPending && <Loader className="animate-spin" />}
        Confirm
      </Button>
    </form>
  )
}

export default ResetPass
