import { useState } from "react";
import { useTranslations } from "next-intl";
import { Ban, Check, Copy, CreditCard } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { type niuT, useRemoveUserPlan } from "@/hooks/use-super-admin";
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

import MakePaymentForUser from "../payment/make-payment-for-user";

type props = {
  user: niuT
}

function InviteAction({ user }: props) {
  const t = useTranslations("superAdmin.invites")
  const [open, setOpen] = useState(false)

  const { mutate: removePlan, isPending: isRemoving } = useRemoveUserPlan()
  const { copied, onCopyClk } = useClipboardCopy()
  const queryClient = useQueryClient()

  const isSubscribed = user.currentPlan && new Date(user.currentPlan.expiryDate) > new Date()

  function onCopy() {
    const pass = createPass(user?.fullName, user?.dob)
    onCopyClk(t("inviteMessage", {
      name: user?.fullName || "User",
      mobile: user?.contactDetails?.mobile || "",
      password: pass,
    }))
  }

  function onSuccess() {
    queryClient.invalidateQueries({ queryKey: ["user-invitations"] })
    setOpen(false)
  }

  return (
    <div className="flex items-center justify-end gap-1">
      <TooltipWrapper
        content={copied ? t("copiedTooltip") : t("copyTooltip")}
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
          content={t("makePaymentTooltip")}
          triggerProps={{
            render: <DialogTrigger render={<Button size="icon" variant="outline" className="size-8" />}>
              <CreditCard className="size-3.5" />
            </DialogTrigger>
          }}
        />

        <DialogContent className="@container lg:max-w-5xl">
          <DialogHeader>
            <DialogTitle>{t("paymentFor", { name: user?.fullName || "" })}</DialogTitle>
          </DialogHeader>

          <div className="max-h-[80vh] p-0.5 pr-4 -mr-4 overflow-y-auto">
            <MakePaymentForUser userId={user?._id} compact onSuccess={onSuccess} />
          </div>
        </DialogContent>
      </Dialog>

      {isSubscribed && (
        <AlertDialog>
          <TooltipWrapper
            content={t("cancelSubscriptionTooltip")}
            triggerProps={{
              render: <AlertDialogTrigger render={<Button size="icon" variant="outline" className="size-8 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300" />}>
                <Ban className="size-3.5" />
              </AlertDialogTrigger>
            }}
          />

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{t("cancelSubscriptionTitle")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("cancelSubscriptionDescription", { name: user?.fullName || "" })}
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel disabled={isRemoving}>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction render={<Button variant="destructive" disabled={isRemoving} onClick={() => removePlan(user._id!)} />}>
                {t("remove")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  )
}

export default InviteAction
