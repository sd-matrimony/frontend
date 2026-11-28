"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { useUserDetailsMini } from "@/hooks/use-account";
import useUIStore from "@/store/ui";

import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@glraj/ui/dialog";
import { planDetails } from "@/components/common/plan-badge";
import { Button } from "@glraj/ui/button";

const REMIND_WITHIN_DAYS = 7
const DAY_MS = 24 * 60 * 60 * 1000
const SESSION_KEY = "plan-reminder-snoozed"

export function PlanExpiryReminder() {
  const t = useTranslations("user.planReminder")
  const { data: user } = useUserDetailsMini()
  const dismissedFor = useUIStore(s => s.planReminderDismissedFor)
  const update = useUIStore(s => s.update)
  const [open, setOpen] = useState(false)

  const plan = user?.role === "user" ? user.currentPlan : undefined
  const expiryDate = plan?.expiryDate
  const msLeft = expiryDate ? new Date(expiryDate).getTime() - Date.now() : 0
  const daysLeft = Math.ceil(msLeft / DAY_MS)
  const isEndingSoon = msLeft > 0 && msLeft <= REMIND_WITHIN_DAYS * DAY_MS

  useEffect(() => {
    if (!expiryDate || !isEndingSoon || dismissedFor === expiryDate) return
    if (sessionStorage.getItem(SESSION_KEY) === expiryDate) return
    setOpen(true)
  }, [expiryDate, isEndingSoon, dismissedFor])

  if (!plan || !expiryDate) return null

  function snooze() {
    if (expiryDate) sessionStorage.setItem(SESSION_KEY, expiryDate)
    setOpen(false)
  }

  function dontRemind() {
    if (expiryDate) update({ planReminderDismissedFor: expiryDate })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={value => { if (!value) snooze() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("desc", {
              plan: planDetails[plan.subscribedTo]?.name,
              date: new Date(expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
              days: daysLeft,
            })}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex-row flex-wrap">
          <Button size="sm" variant="outline" className="max-[450px]:flex-1 mr-auto" onClick={dontRemind}>
            {t("dontRemind")}
          </Button>

          <Button size="sm" variant="outline" className="max-[450px]:flex-1" onClick={snooze}>
            {t("later")}
          </Button>

          <Button
            size="sm"
            className="max-[450px]:flex-1 bg-pink-600 hover:bg-pink-700"
            nativeButton={false}
            render={<Link href="/user/payment" onClick={snooze} />}
          >
            {t("renew")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
