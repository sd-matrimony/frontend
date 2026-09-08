"use client";

import { useState } from "react";
import { Ban, Check, Copy, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
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
  const t = useTranslations("shared.planActions")
  const tc = useTranslations("common")
  const [open, setOpen] = useState(false)

  const { mutate: removePlan, isPending: isRemoving } = useRemoveUserPlan()
  const { copied, onCopyClk } = useClipboardCopy()
  const queryClient = useQueryClient()

  const isSubscribed = currentPlan && new Date(currentPlan.expiryDate) > new Date()

  function onCopy() {
    const pass = createPass(fullName, dob)
    onCopyClk(t("inviteMessage", { fullName: fullName || "User", mobile: mobile || "", password: pass }))
  }

  function onSuccess() {
    queryClient.invalidateQueries({ queryKey: ["user-list"], refetchType: "all" })
    setOpen(false)
  }

  return (
    <>
      <TooltipWrapper
        content={copied ? t("copied") : t("copyInviteMessage")}
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
          content={t("makePayment")}
          triggerProps={{
            render: <DialogTrigger render={<Button size="icon" variant="outline" className="size-8" />}>
              <CreditCard className="size-3.5" />
            </DialogTrigger>
          }}
        />

        <DialogContent className="@container lg:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{t("paymentFor", { fullName })}</DialogTitle>
          </DialogHeader>

          <div className="max-h-[80vh] p-0.5 pr-4 -mr-4 overflow-y-auto">
            <MakePaymentForUser userId={_id} compact onSuccess={onSuccess} />
          </div>
        </DialogContent>
      </Dialog>

      {isSubscribed && (
        <AlertDialog>
          <TooltipWrapper
            content={t("cancelSubscription")}
            triggerProps={{
              render: <AlertDialogTrigger render={<Button size="icon" variant="outline" className="size-8 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300" />}>
                <Ban className="size-3.5" />
              </AlertDialogTrigger>
            }}
          />

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("cancelSubscriptionConfirmTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("cancelSubscriptionConfirmDesc", { fullName })}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isRemoving}>{tc("cancel")}</AlertDialogCancel>
              <AlertDialogAction render={<Button variant="destructive" disabled={isRemoving} onClick={() => removePlan(_id)} />}>
                {t("remove")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}

export default PlanActions
