"use client";

import { useState } from 'react';
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { partnerPreferencesSchema, type partnerPreferencesT } from '@/utils/user-schema';
import { useUpdateProfile } from '@/hooks/use-user';
import { maritalStatus } from '@/utils';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InputWrapper, SelectWrapper, TextareaWrapper } from "@/components/ui/field-wrapper-rhf";
import { SelectListWrapper, SelectSubCastesWrapper } from '@/components/common/lists';
import { Button } from "@/components/ui/button";

function Edit({ user }: { user: userT & { hasFullAccess?: boolean } }) {
  const t = useTranslations("shared.userProfile.partner")
  const tc = useTranslations("common")
  const { mutate, isPending } = useUpdateProfile()
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(partnerPreferencesSchema),
    defaultValues: {
      minAge: user?.partnerPreferences?.minAge || "",
      maxAge: user?.partnerPreferences?.maxAge || "",
      religion: user?.partnerPreferences?.religion || "",
      caste: user?.partnerPreferences?.caste || "",
      subCaste: user?.partnerPreferences?.subCaste || "",
      minQualification: user?.partnerPreferences?.minQualification || "Any",
      sector: user?.partnerPreferences?.sector || "",
      profession: user?.partnerPreferences?.profession || "",
      minSalary: user?.partnerPreferences?.minSalary || "",
      motherTongue: user?.partnerPreferences?.motherTongue || "",
      location: user?.partnerPreferences?.location || "",
      expectation: user?.partnerPreferences?.expectation || "",
      maritalStatus: user?.partnerPreferences?.maritalStatus || "Single",
    },
  })

  const choosed = form.watch("caste")

  function onSubmit(values: partnerPreferencesT) {
    const isAdmin = window.location.pathname.includes("admin")
    mutate(
      {
        ...(isAdmin && { _id: user._id }),
        partnerPreferences: {
          ...user.partnerPreferences,
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-h-[60vh] -ml-1 -mr-6 pl-1 pr-6 overflow-y-auto">
            <div className="grid grid-cols-2 gap-4 items-start">
              <InputWrapper
                control={form.control}
                name="minAge"
                label={t("fields.minAge")}
                type="number"
                min={18}
              />

              <InputWrapper
                control={form.control}
                name="maxAge"
                label={t("fields.maxAge")}
                type="number"
                min={18}
              />
            </div>

            <SelectListWrapper
              control={form.control}
              name="religion"
              label={t("religion")}
              listName="religions"
              additionalOpts="Any"
              canCreateNew
            />

            <SelectListWrapper
              control={form.control}
              name="caste"
              label={t("caste")}
              listName="castes"
              additionalOpts="Any"
              canCreateNew
            />

            <SelectSubCastesWrapper
              name="subCaste"
              control={form.control}
              choosed={choosed || ""}
              additionalOpts="Any"
            />

            <SelectWrapper
              control={form.control}
              name="maritalStatus"
              label={t("maritalStatus")}
              items={maritalStatus}
              placeholder={t("fields.selectMaritalStatus")}
            />

            <SelectListWrapper
              control={form.control}
              name="minQualification"
              label={t("minQualification")}
              listName="educationLevels"
              additionalOpts="Any"
            />

            <SelectListWrapper
              control={form.control}
              name="sector"
              label={t("sector")}
              listName="sectors"
              additionalOpts="Any"
            />

            <SelectListWrapper
              control={form.control}
              name="profession"
              label={t("profession")}
              listName="professions"
              additionalOpts="Any"
              canCreateNew
            />

            <InputWrapper
              control={form.control}
              name="minSalary"
              label={t("fields.expectedSalary")}
              type="number"
              min={0}
            />

            <SelectListWrapper
              control={form.control}
              name="motherTongue"
              label={t("motherTongue")}
              listName="languages"
              additionalOpts="Any"
              canCreateNew
            />

            <InputWrapper
              control={form.control}
              name="location"
              label={t("location")}
            />

            <TextareaWrapper
              control={form.control}
              name="expectation"
              label={t("expectations")}
              className="min-h-25"
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

