"use client";

import { useState } from "react";
import { Ban, CalendarPlus, Check, Copy, CreditCard } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";

import { useExtendUserPlan, useRemoveUserPlan } from "@/hooks/use-super-admin";
import useClipboardCopy from "@/hooks/use-clipboard-copy";
import { createPass } from "@/utils/password";

import { TooltipWrapper } from "@glraj/ui/tooltip";
import { Button } from "@glraj/ui/button";
import { Input } from "@glraj/ui/input";
import { Label } from "@glraj/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@glraj/ui/dialog";
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
} from "@glraj/ui/alert-dialog";

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

  const [extendOpen, setExtendOpen] = useState(false)
  const [open, setOpen] = useState(false)
  const [days, setDays] = useState(30)

  const { mutate: removePlan, isPending: isRemoving } = useRemoveUserPlan()
  const { mutate: extendPlan, isPending: isExtending } = useExtendUserPlan()
  const { copied, onCopyClk } = useClipboardCopy()
  const queryClient = useQueryClient()

  const isSubscribed = currentPlan && new Date(currentPlan.expiryDate) > new Date()
  const isValidDays = Number.isInteger(days) && days >= 1 && days <= 365
  const extendBase = isSubscribed ? new Date(currentPlan.expiryDate) : new Date()
  const newExpiry = new Date(extendBase.getTime() + (isValidDays ? days : 0) * 24 * 60 * 60 * 1000)

  function formatDate(date: Date) {
    return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
  }

  function onExtend() {
    if (!isValidDays) return
    extendPlan({ _id, days }, { onSuccess: () => setExtendOpen(false) })
  }

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

      {currentPlan && (
        <Dialog open={extendOpen} onOpenChange={setExtendOpen}>
          <TooltipWrapper
            content={t("extendPlan")}
            triggerProps={{
              render: <DialogTrigger render={<Button size="icon" variant="outline" className="size-8" />}>
                <CalendarPlus className="size-3.5" />
              </DialogTrigger>
            }}
          />

          <DialogContent className="sm:max-w-sm">
            <DialogHeader>
              <DialogTitle>{t("extendPlanFor", { fullName })}</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {t("currentExpiry", { date: formatDate(new Date(currentPlan.expiryDate)) })}
              </p>

              <div className="space-y-1.5">
                <Label htmlFor={`extend-days-${_id}`}>{t("extendDays")}</Label>
                <Input
                  id={`extend-days-${_id}`}
                  type="number"
                  min={1}
                  max={365}
                  value={Number.isNaN(days) ? "" : days}
                  onChange={e => setDays(e.target.valueAsNumber)}
                />
              </div>

              {isValidDays && (
                <p className="text-sm font-medium">{t("newExpiry", { date: formatDate(newExpiry) })}</p>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" disabled={isExtending} onClick={() => setExtendOpen(false)}>
                {tc("cancel")}
              </Button>
              <Button disabled={!isValidDays || isExtending} onClick={onExtend}>
                {t("extend")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

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
