import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";

import { useUpdateEmail } from "@/hooks/use-account";

import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { InputWrapper } from "@/components/ui/field-wrapper-rhf";
import { Button } from "@/components/ui/button";

type Props = {
  onSuccess: () => void
}

const emailSchema = z.object({
  email: z.email("Please enter a valid email"),
})

type EmailFormValues = z.infer<typeof emailSchema>

function AddEmail({ onSuccess }: Props) {
  const t = useTranslations("shared.userProfile.addEmailDialog")
  const tc = useTranslations("common")
  const { mutate, isPending } = useUpdateEmail()

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = (values: EmailFormValues) => {
    mutate(values, { onSuccess })
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription>
          {t("desc")}
        </DialogDescription>
      </DialogHeader>

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
          <InputWrapper
            name="email"
            label={t("label")}
            control={form.control}
            placeholder={t("placeholder")}
            type="email"
          />

          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" disabled={isPending} />}>
              {tc("cancel")}
            </DialogClose>

            <Button
              type="submit"
              disabled={isPending}
            >
              {t("add")}
            </Button>
          </DialogFooter>
        </form>
      </FormProvider>
    </>
  )
}

export default AddEmail
