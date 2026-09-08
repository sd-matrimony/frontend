"use client";

import { useCallback, useState } from 'react';
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDropzone } from 'react-dropzone';
import { EditIcon, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { vedicHoroscopeSchema, type vedicHoroscopeT } from '@/utils/user-schema';
import { acceptedImagesTypes } from '@/utils';
import { useRegisterImage } from '@/hooks/use-account';
import { useUpdateProfile } from '@/hooks/use-user';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SelectListWrapper } from '@/components/common/lists';
import { InputWrapper } from "@/components/ui/field-wrapper-rhf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Edit({ user }: { user: userT & { hasFullAccess?: boolean } }) {
  const t = useTranslations("shared.userProfile.horoscope")
  const tc = useTranslations("common")
  const { mutate, isPending } = useUpdateProfile()
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(vedicHoroscopeSchema),
    defaultValues: {
      nakshatra: user?.vedicHoroscope?.nakshatra || "",
      rasi: user?.vedicHoroscope?.rasi || "",
      lagna: user?.vedicHoroscope?.lagna || "",
      dashaPeriod: user?.vedicHoroscope?.dashaPeriod || "",
      vedicHoroscopePic: user?.vedicHoroscope?.vedicHoroscopePic || "",
    },
  })

  const { isPending: isPending1, mutateAsync: mutateRegisterImage } = useRegisterImage()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    form.setValue("vedicHoroscopePic", acceptedFiles[0])
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedImagesTypes,
    multiple: false,
    maxFiles: 1,
  })

  const file = form.watch("vedicHoroscopePic")

  async function uploadPic(image: File | string) {
    if (typeof image === "string") return image
    const formData = new FormData()
    formData.append('image', image)
    const { url } = await mutateRegisterImage(formData)
    return url
  }

  async function onSubmit(values: vedicHoroscopeT) {
    const isAdmin = window.location.pathname.includes("admin")

    const payload = {
      ...values,
    }
    if (payload.vedicHoroscopePic && typeof payload.vedicHoroscopePic !== "string") {
      payload.vedicHoroscopePic = await uploadPic(payload.vedicHoroscopePic)
    }

    if (payload.nakshatra) {
      payload.nakshatra = payload.nakshatra.split(" (")[0]
    }
    if (payload.rasi) {
      payload.rasi = payload.rasi.split(" (")[0]
    }
    if (payload.lagna) {
      payload.lagna = payload.lagna.split(" (")[0]
    }
    mutate(
      {
        ...(isAdmin && { _id: user._id }),
        vedicHoroscope: {
          ...user.vedicHoroscope,
          ...payload,
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
              name="nakshatra"
              label={t("fields.nakshatra")}
              listName="nakshatra"
              additionalOpts="Don't wish to specify"
              showClear
            />

            <SelectListWrapper
              control={form.control}
              name="rasi"
              label={t("fields.rasi")}
              listName="raasi"
              additionalOpts="Don't wish to specify"
              showClear
            />

            <SelectListWrapper
              control={form.control}
              name="lagna"
              label={t("fields.lagna")}
              listName="raasi"
              additionalOpts="Don't wish to specify"
              showClear
            />

            <InputWrapper
              control={form.control}
              name="dashaPeriod"
              label={t("fields.dashaPeriod")}
            />

            <InputWrapper
              control={form.control}
              name="dosham"
              label={t("fields.dosham")}
            />

            <div className="space-y-4">
              <div
                className="space-y-2"
                {...getRootProps()}
              >
                <Label htmlFor="images">{t("fields.image")}</Label>
                <Input
                  id="images"
                  {...getInputProps({
                    multiple: false,
                    style: {}
                  })}
                />
              </div>

              {
                file &&
                <div className="size-40 border relative">
                  <img
                    src={typeof file === "string" ? file : URL.createObjectURL(file)}
                    alt="Horoscope"
                    className="object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => form.setValue("vedicHoroscopePic", "")}
                    className="absolute top-0 right-0 p-1 bg-black/50 text-white rounded-bl cursor-pointer backdrop-blur"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              }
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isPending || isPending1}
                onClick={() => setOpen(false)}
              >
                {tc("cancel")}
              </Button>

              <Button
                type="submit"
                disabled={isPending || isPending1}
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

