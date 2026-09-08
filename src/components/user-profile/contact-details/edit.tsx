"use client";

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon } from 'lucide-react';
import { FormProvider, useForm } from "react-hook-form";
import { useTranslations } from 'next-intl';
import { z } from "zod";

import { contactDetailsSchema } from '@/utils/user-schema';
import { useUpdateProfile } from '@/hooks/use-user';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TextareaWrapper, InputWrapper } from "@/components/ui/field-wrapper-rhf";
import { Button } from "@/components/ui/button";

function Edit({ user }: { user: userT & { hasFullAccess?: boolean } }) {
  const t = useTranslations("shared.userProfile.contact")
  const tc = useTranslations("common")
  const { mutate, isPending } = useUpdateProfile()
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(contactDetailsSchema),
    defaultValues: {
      mobile: user?.contactDetails?.mobile,
      address: user?.contactDetails?.address,
      place: user?.contactDetails?.place,
    },
  })

  function onSubmit(values: z.infer<typeof contactDetailsSchema>) {
    const isAdmin = window.location.pathname.includes("admin")
    mutate(
      {
        ...(isAdmin && { _id: user._id }),
        contactDetails: {
          ...user.contactDetails,
          ...values,
        },
      },
      {
        onSuccess() {
          setOpen(false)
        }
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        <EditIcon className="h-4 w-4 mr-2" />
        {tc("edit")}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("editTitle")}</DialogTitle>
          <DialogDescription>{t("editDesc")}</DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <TextareaWrapper
              control={form.control}
              name="address"
              label={t("fields.address")}
            />

            <InputWrapper
              control={form.control}
              name="place"
              label={t("fields.place")}
              placeholder={t("fields.placeholderPlace")}
            />

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => setOpen(false)}
              >
                {tc("cancel")}
              </Button>

              <Button
                type="submit"
                disabled={isPending}
              >
                {tc("saveChanges")}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default Edit

