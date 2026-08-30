"use client";

import { useState } from "react";
import { Ban, Check, Copy, CreditCard } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { useRemoveUserPlan } from "@/hooks/use-super-admin";
import useClipboardCopy from "@/hooks/use-clipboard-copy";
import { createPass } from "@/utils/password";

import { TooltipWrapper } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import MakePaymentForUser from "@/app/super-admin/payment/make-payment-for-user";

type props = {
  _id: string
  fullName: string
  dob: string
  mobile?: string
  currentPlan?: currentPlanT
}

function PlanActions({ _id, fullName, dob, mobile, currentPlan }: props) {
  const [open, setOpen] = useState(false)

  const { mutate: removePlan, isPending: isRemoving } = useRemoveUserPlan()
  const { copied, onCopyClk } = useClipboardCopy()
  const queryClient = useQueryClient()

  const isSubscribed = currentPlan && new Date(currentPlan.expiryDate) > new Date()

  function onCopy() {
    const pass = createPass(fullName, dob)
    onCopyClk(`
Hello ${fullName || "User"},

You've been added to SD Matrimony!
We're excited to have you on board and help you connect with meaningful matches.

Here are your login details:

Id: ${mobile || ""} (your mobile number)

Password: ${pass}

You can log in using the link below:
👉 Login to SD Matrimony - https://sdmatrimony.com/auth/user/signin

If you did not intend to join SD Matrimony or believe this was a mistake, you can delete your account anytime or contact our support team for assistance.
    `)
  }

  function onSuccess() {
    queryClient.invalidateQueries({ queryKey: ["user-list"], refetchType: "all" })
    setOpen(false)
  }

  return (
    <>
      <TooltipWrapper
        content={copied ? "Copied!" : "Copy invite message"}
        triggerProps={{
          render: (
            <Button size="icon" variant="outline" className="size-8" onClick={onCopy}>
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
            </Button>
          )
        }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <TooltipWrapper
          content="Make payment"
          triggerProps={{
            render: <DialogTrigger render={<Button size="icon" variant="outline" className="size-8" />}>
              <CreditCard className="size-3.5" />
            </DialogTrigger>
          }}
        />

        <DialogContent className="@container lg:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Payment for {fullName}</DialogTitle>
          </DialogHeader>

          <div className="max-h-[80vh] p-0.5 pr-4 -mr-4 overflow-y-auto">
            <MakePaymentForUser userId={_id} compact onSuccess={onSuccess} />
          </div>
        </DialogContent>
      </Dialog>

      {isSubscribed && (
        <AlertDialog>
          <TooltipWrapper
            content="Cancel active subscription"
            triggerProps={{
              render: <AlertDialogTrigger render={<Button size="icon" variant="outline" className="size-8 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300" />}>
                <Ban className="size-3.5" />
              </AlertDialogTrigger>
            }}
          />

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel subscription?</AlertDialogTitle>
              <AlertDialogDescription>
                This will remove the active plan for {fullName}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
              <AlertDialogAction render={<Button variant="destructive" disabled={isRemoving} onClick={() => removePlan(_id)} />}>
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}

export default PlanActions
