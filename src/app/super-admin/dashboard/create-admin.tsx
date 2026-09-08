"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Loader } from "lucide-react";
import { z } from "zod";

import { useUpdateAdmin } from "@/hooks/use-super-admin";
import useUIStore from "@/store/ui";

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InputWrapper, TextareaWrapper } from "@/components/ui/field-wrapper-rhf";
import { Button } from "@/components/ui/button";

const schema = (isUpdate: boolean) => z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: isUpdate
    ? z
      .string()
      .optional()
      .refine((val) => !val || val.length >= 8, {
        message: "Password must be at least 8 characters",
      })
    : z.string().min(8, "Password must be at least 8 characters"),
  contactDetails: z.object({
    mobile: z
      .string()
      .nonempty("Mobile is required")
      .min(10, "Mobile must be at least 10 characters"),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .optional()
      .or(z.literal("")),
  }),
})

function CreateAdmin() {
  const t = useTranslations("superAdmin.dashboard.createAdmin")
  const close = useUIStore(s => s.close)
  const open = useUIStore(s => s.open)
  const data = useUIStore(s => s.data)

  const form = useForm({
    resolver: zodResolver(schema(!!data)),
    defaultValues: data || {
      fullName: "",
      email: "",
      password: "",
      contactDetails: {
        mobile: "",
        address: "",
      },
    },
  })

  const { mutate, isPending } = useUpdateAdmin()

  function onSubmit(values: z.infer<ReturnType<typeof schema>>) {
    const payload: any = { ...values }

    if (data) {
      payload._id = data._id

      if (data.email === values.email) {
        delete payload.email
      }

      if (data.contactDetails.mobile === values.contactDetails.mobile) {
        delete payload.contactDetails.mobile
      }

      if (!values.password) {
        delete payload.password
      }
    }

    mutate(payload, {
      onSuccess() {
        close()
      }
    })
  }

  return (
    <Dialog open={open === "admin"} onOpenChange={close}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data ? t("updateTitle") : t("createTitle")}</DialogTitle>
          <DialogDescription>
            {data ? t("updateDescription") : t("createDescription")}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputWrapper
              control={form.control}
              name="fullName"
              label={t("fullName")}
            />

            <InputWrapper
              control={form.control}
              name="email"
              label={t("email")}
              type="email"
              disabled={!!data}
            />

            <InputWrapper
              control={form.control}
              name="password"
              label={t("password")}
            />

            <InputWrapper
              control={form.control}
              name="contactDetails.mobile"
              label={t("mobile")}
              type="tel"
              disabled={!!data}
            />

            <TextareaWrapper
              control={form.control}
              name="contactDetails.address"
              label={t("address")}
            />

            <DialogFooter>
              <DialogClose render={<Button type="button" variant="outline" onClick={close} />}>
                {t("close")}
              </DialogClose>

              <Button
                type="submit"
                disabled={isPending}
              >
                {isPending && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                {data ? t("update") : t("create")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default CreateAdmin
