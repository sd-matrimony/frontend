"use client";

import { useState } from "react";
import { Check, Copy, CreditCard, ReceiptText } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";

import useClipboardCopy from "@/hooks/use-clipboard-copy";
import { createPass } from "@/utils/password";

import { TooltipWrapper } from "@glraj/ui/tooltip";
import { Button } from "@glraj/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@glraj/ui/dialog";

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

  const [open, setOpen] = useState(false)

  const { copied, onCopyClk } = useClipboardCopy()
  const queryClient = useQueryClient()

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

      {
        currentPlan
          ? <TooltipWrapper
            content={t("viewPayments")}
            triggerProps={{
              render: (
                <Button size="icon" variant="outline" className="size-8" render={<Link href={`/super-admin/paid-users/${_id}`} />} nativeButton={false}>
                  <ReceiptText className="size-3.5" />
                </Button>
              )
            }}
          />
          : <Dialog open={open} onOpenChange={setOpen}>
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
      }
    </>
  )
}

export default PlanActions
