"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Loader } from "lucide-react"

import { forgotPassSchema, type ForgotPassFormT } from "@/utils/auth-schema"
import { useForgotPass } from "@/hooks/use-account"

import { InputWrapper } from "@/components/ui/field-wrapper-rhf"
import { Button } from "@/components/ui/button"

type Props = {
  role?: rolesT
}

function ForgotPass({ role = "user" }: Props) {
  const { control, handleSubmit } = useForm<ForgotPassFormT>({
    resolver: zodResolver(forgotPassSchema),
    defaultValues: { email: "" },
  })

  const { isPending, mutate } = useForgotPass()

  const onSubmit = (data: ForgotPassFormT) => mutate({ ...data, role })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <InputWrapper
        name="email"
        label="Email or Mobile Number"
        control={control}
      />

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-pink-500 hover:bg-pink-600"
      >
        {isPending && <Loader className="animate-spin" />}
        Submit
      </Button>
    </form>
  )
}

export default ForgotPass
