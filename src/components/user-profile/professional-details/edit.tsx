"use client";

import { useState } from 'react';
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from 'next/navigation';
import { EditIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { professionalDetailsSchema, type professionalDetailsT } from '@/utils/user-schema';
import { useUpdateProfile } from '@/hooks/use-user';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SelectListWrapper } from '@/components/common/lists';
import { InputWrapper } from '@/components/ui/field-wrapper-rhf';
import { Button } from "@/components/ui/button";

function Edit({ user }: { user: userT & { hasFullAccess?: boolean } }) {
  const t = useTranslations("shared.userProfile.professional")
  const tc = useTranslations("common")
  const { mutate, isPending } = useUpdateProfile()
  const [open, setOpen] = useState(false)

  const pathname = usePathname()
  const isAdmin = pathname.includes("admin")

  const form = useForm({
    resolver: zodResolver(professionalDetailsSchema),
    defaultValues: {
      highestQualification: user?.proffessionalDetails?.highestQualification || "",
      qualifications: user?.proffessionalDetails?.qualifications || "",
      companyName: user?.proffessionalDetails?.companyName || "",
      profession: user?.proffessionalDetails?.profession || "",
      sector: user?.proffessionalDetails?.sector || "",
      salary: user?.proffessionalDetails?.salary || 0,
    },
  })

  function onSubmit(values: professionalDetailsT) {
    const isAdmin = window.location.pathname.includes("admin")
    mutate(
      {
        ...(isAdmin && { _id: user._id }),
        proffessionalDetails: {
          ...user.proffessionalDetails,
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
              name="highestQualification"
              label={t("highestQualification")}
              listName="educationLevels"
            />

            <InputWrapper
              control={form.control}
              name="qualifications"
              label={t("qualifications")}
            />

            <SelectListWrapper
              control={form.control}
              name="sector"
              label={t("sector")}
              listName="sectors"
            />

            <SelectListWrapper
              control={form.control}
              name="profession"
              label={t("profession")}
              listName="professions"
              canCreateNew
            />

            <InputWrapper
              control={form.control}
              name="companyName"
              label={t("companyName")}
            />

            <InputWrapper
              control={form.control}
              name="companyLocation"
              label={t("companyLocation")}
            />

            <div className="pt-2 relative">
              {!isAdmin && <p className="absolute top-1.5 right-0 text-sm text-muted-foreground">{t("contactAdminNote")}</p>}
              <InputWrapper
                control={form.control}
                type="number"
                name="salary"
                label={t("monthlySalary")}
                disabled={!isAdmin}
                min={0}
                step={1000}
              />
            </div>

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

