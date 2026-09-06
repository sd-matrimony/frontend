"use client";

import { useState } from 'react';
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditIcon } from 'lucide-react';
import { z } from "zod";

import { personalDetailsSchema } from '@/utils/user-schema';
import { gender, maritalStatus, yesNoOptions } from '@/utils';
import { useUpdateProfile } from '@/hooks/use-user';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DatePickerWrapper, InputWrapper, RadioWrapper, SelectWrapper } from "@/components/ui/field-wrapper-rhf";
import { Button } from "@/components/ui/button";

function Edit({ user }: { user: userT & { hasFullAccess?: boolean } }) {
  const { mutate, isPending } = useUpdateProfile()
  const [open, setOpen] = useState(false)

  const form = useForm({
    resolver: zodResolver(personalDetailsSchema),
    defaultValues: {
      fullName: user.fullName,
      gender: user.gender,
      dob: new Date(user.dob),
      maritalStatus: user.maritalStatus,
      hasDisability: user.hasDisability ?? false,
    },
  })

  function onSubmit(values: z.infer<typeof personalDetailsSchema>) {
    const isAdmin = window.location.pathname.includes("admin")

    mutate(
      {
        ...(isAdmin && { _id: user._id }),
        ...values,
        dob: new Date(new Date(values.dob).setHours(0, 0, 0, 0)).toISOString(),
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
        Edit
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Personal Details</DialogTitle>
          <DialogDescription>Make changes to your personal information here.</DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputWrapper
              control={form.control}
              name="fullName"
              label="Full Name"
            />

            <SelectWrapper
              control={form.control}
              name="gender"
              label="Gender"
              items={gender}
              placeholder="Select gender"
            />

            <DatePickerWrapper
              control={form.control}
              name="dob"
              label="Date of Birth"
            />

            <SelectWrapper
              control={form.control}
              name="maritalStatus"
              label="Marital Status"
              items={maritalStatus}
              placeholder="Select marital status"
            />

            <RadioWrapper
              control={form.control}
              name="hasDisability"
              label="Has Disability"
              items={yesNoOptions}
            />

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isPending}
              >
                Save Changes
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}

export default Edit

