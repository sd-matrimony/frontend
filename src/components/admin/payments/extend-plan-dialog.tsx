"use client";

import { useState } from "react";
import { CalendarPlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { useExtendUserPlan } from "@/hooks/use-super-admin";
import { addMonths } from "@/utils/date";

import { TooltipWrapper } from "@glraj/ui/tooltip";
import { SelectWrapper } from "@glraj/ui/select";
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
  paymentId?: string
  iconOnly?: boolean
}

type unitT = "months" | "days"

const DAY_MS = 24 * 60 * 60 * 1000
const LIMITS: Record<unitT, number> = { months: 24, days: 365 }

function formatDate(date: Date) {
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}

export function ExtendPlanDialog({ userId, fullName, expiryDate, paymentId, iconOnly }: props) {
  const t = useTranslations("shared.planActions")
  const tc = useTranslations("common")
  const [open, setOpen] = useState(false)
  const [unit, setUnit] = useState<unitT>("months")
  const [amount, setAmount] = useState(1)
  const [reason, setReason] = useState("")

  const { mutate: extendPlan, isPending } = useExtendUserPlan()

  const currentExpiry = new Date(expiryDate)
  const isActive = currentExpiry > new Date()
  const isValidAmount = Number.isInteger(amount) && amount >= 1 && amount <= LIMITS[unit]
  const base = isActive ? currentExpiry : new Date()
  const newExpiry = unit === "months"
    ? addMonths(base, isValidAmount ? amount : 0)
    : new Date(base.getTime() + (isValidAmount ? amount : 0) * DAY_MS)

  const unitOptions = [
    { value: "months", label: t("unitMonths") },
    { value: "days", label: t("unitDays") },
  ]

  function onExtend() {
    if (!isValidAmount) return
    extendPlan(
      { _id: userId, paymentId, [unit]: amount, reason: reason.trim() || undefined },
      { onSuccess: () => { setOpen(false); setReason("") } },
    )
  }

  const trigger = iconOnly
    ? <TooltipWrapper
      content={t("extendPlan")}
      triggerProps={{
        render: <DialogTrigger render={<Button size="icon" variant="outline" className="size-8" aria-label={t("extendPlan")} />}>
          <CalendarPlus className="size-3.5" />
        </DialogTrigger>
      }}
    />
    : <DialogTrigger render={<Button size="sm" variant="outline" />}>
      <CalendarPlus />
      {t("extendPlan")}
    </DialogTrigger>

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger}

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("extendPlanFor", { fullName })}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t(isActive ? "currentExpiry" : "expiredOnStartsToday", { date: formatDate(currentExpiry) })}
          </p>

          <div className="space-y-1.5">
            <Label htmlFor={`extend-amount-${paymentId ?? userId}`}>{t("extendBy")}</Label>
            <div className="df">
              <Input
                id={`extend-amount-${paymentId ?? userId}`}
                type="number"
                min={1}
                max={LIMITS[unit]}
                value={Number.isNaN(amount) ? "" : amount}
                onChange={e => setAmount(e.target.valueAsNumber)}
              />
              <SelectWrapper
                items={unitOptions}
                value={unit}
                onValueChange={v => setUnit(v as unitT)}
                triggerCls="w-32 shrink-0"
              />
            </div>
          </div>

          {isValidAmount && (
            <p className="text-sm font-medium">{t("newExpiry", { date: formatDate(newExpiry) })}</p>
          )}

          <ReasonField id={`extend-reason-${paymentId ?? userId}`} value={reason} onChange={setReason} />
        </div>

        <DialogFooter>
          <Button variant="outline" disabled={isPending} onClick={() => setOpen(false)}>
            {tc("cancel")}
          </Button>
          <Button disabled={!isValidAmount || isPending} onClick={onExtend}>
            {t("extend")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
