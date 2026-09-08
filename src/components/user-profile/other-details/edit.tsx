"use client";

import { useState } from 'react';
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { otherDetailsSchema, type otherDetailsT } from '@/utils/user-schema';
import { useUpdateProfile } from '@/hooks/use-user';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SelectListWrapper, SelectSubCastesWrapper } from '@/components/common/lists';
import { InputWrapper, SelectWrapper } from "@/components/ui/field-wrapper-rhf";
import { Button } from "@/components/ui/button";

function Edit({ user }: { user: userT & { hasFullAccess?: boolean } }) {
  const t = useTranslations("shared.userProfile.other")
  const tc = useTranslations("common")
  const { mutate, isPending } = useUpdateProfile()
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(otherDetailsSchema),
    defaultValues: {
      motherTongue: user?.otherDetails?.motherTongue || "",
      houseType: user?.otherDetails?.houseType || "",
      otherProperties: user?.otherDetails?.otherProperties || "",
      religion: user?.otherDetails?.religion || "",
      height: user?.otherDetails?.height || "",
      color: user?.otherDetails?.color || "",
      caste: user?.otherDetails?.caste || "",
      subCaste: user?.otherDetails?.subCaste || "",
    },
  })

  const choosed = form.watch("caste")

  function onSubmit(values: otherDetailsT) {
    const isAdmin = window.location.pathname.includes("admin")
    mutate(
      {
        ...(isAdmin && { _id: user._id }),
        otherDetails: {
          ...user.otherDetails,
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
            <SelectListWrapper
              control={form.control}
              name="motherTongue"
              label={t("fields.motherTongue")}
              listName="languages"
              additionalOpts="Don't wish to specify"
              canCreateNew
            />

            <SelectListWrapper
              control={form.control}
              name="religion"
              label={t("fields.religion")}
              listName="religions"
              additionalOpts="Don't wish to specify"
              canCreateNew
            />

            <SelectListWrapper
              control={form.control}
              name="caste"
              label={t("fields.caste")}
              listName="castes"
              additionalOpts="Don't wish to specify"
              canCreateNew
            />

            <SelectSubCastesWrapper
              name="subCaste"
              control={form.control}
              choosed={choosed || ""}
              additionalOpts="Don't wish to specify"
            />

            <SelectWrapper
              control={form.control}
              name="houseType"
              label={t("fields.houseType")}
              items={["Own", "Rented"]}
            />

            <InputWrapper
              control={form.control}
              name="otherProperties"
              label={t("fields.otherProperties")}
            />

            <InputWrapper
              control={form.control}
              name="height"
              label={t("fields.height")}
              type="number"
            />

            <InputWrapper
              control={form.control}
              name="color"
              label={t("fields.color")}
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

