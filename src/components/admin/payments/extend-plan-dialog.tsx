"use client";

import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { useExtendUserPlan } from "@/hooks/use-super-admin";

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

import { ReasonField } from "./reason-field";

type props = {
  userId: string
  fullName: string
  expiryDate: string
}

const DAY_MS = 24 * 60 * 60 * 1000

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}

export function ExtendPlanDialog({ userId, fullName, expiryDate }: props) {
  const t = useTranslations("shared.planActions")
  const tc = useTranslations("common")
  const [open, setOpen] = useState(false)
  const [days, setDays] = useState(30)
  const [reason, setReason] = useState("")

  const { mutate: extendPlan, isPending } = useExtendUserPlan()

  const currentExpiry = new Date(expiryDate)
  const isActive = currentExpiry > new Date()
  const isValidDays = Number.isInteger(days) && days >= 1 && days <= 365
  const base = isActive ? currentExpiry : new Date()
  const newExpiry = new Date(base.getTime() + (isValidDays ? days : 0) * DAY_MS)

  function onExtend() {
    if (!isValidDays) return
    extendPlan(
      { _id: userId, days, reason: reason.trim() || undefined },
      { onSuccess: () => { setOpen(false); setReason("") } },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <CalendarPlus />
        {t("extendPlan")}
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("extendPlanFor", { fullName })}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t("currentExpiry", { date: formatDate(currentExpiry) })}
          </p>

          <div className="space-y-1.5">
            <Label htmlFor={`extend-days-${userId}`}>{t("extendDays")}</Label>
            <Input
              id={`extend-days-${userId}`}
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

          <ReasonField id={`extend-reason-${userId}`} value={reason} onChange={setReason} />
        </div>

        <DialogFooter>
          <Button variant="outline" disabled={isPending} onClick={() => setOpen(false)}>
            {tc("cancel")}
          </Button>
          <Button disabled={!isValidDays || isPending} onClick={onExtend}>
            {t("extend")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
