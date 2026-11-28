"use client";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { useTranslations } from "next-intl";

import { useAddUserProfiles } from "@/hooks/use-super-admin";

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
  currentLimit: number
}

const UNLIMITED = 999

export function AddProfilesDialog({ userId, fullName, currentLimit }: props) {
  const t = useTranslations("superAdmin.paidUsersPage")
  const tc = useTranslations("common")
  const [open, setOpen] = useState(false)
  const [count, setCount] = useState(5)
  const [reason, setReason] = useState("")

  const { mutate, isPending } = useAddUserProfiles()

  const isValidCount = Number.isInteger(count) && count >= 1 && count <= 500
  const newLimit = Math.min(currentLimit + (isValidCount ? count : 0), UNLIMITED)

  function onAdd() {
    if (!isValidCount) return
    mutate(
      { _id: userId, count, reason: reason.trim() || undefined },
      { onSuccess: () => { setOpen(false); setReason("") } },
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size="sm" variant="outline" />}>
        <UserPlus />
        {t("addProfiles")}
      </DialogTrigger>

      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{t("addProfilesFor", { fullName })}</DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{t("currentLimit", { count: currentLimit })}</p>

          <div className="space-y-1.5">
            <Label htmlFor={`add-profiles-${userId}`}>{t("profilesToAdd")}</Label>
            <Input
              id={`add-profiles-${userId}`}
              type="number"
              min={1}
              max={500}
              value={Number.isNaN(count) ? "" : count}
              onChange={e => setCount(e.target.valueAsNumber)}
            />
          </div>

          {isValidCount && <p className="text-sm font-medium">{t("newLimit", { count: newLimit })}</p>}

          <ReasonField id={`add-profiles-reason-${userId}`} value={reason} onChange={setReason} />
        </div>

        <DialogFooter>
          <Button variant="outline" disabled={isPending} onClick={() => setOpen(false)}>
            {tc("cancel")}
          </Button>
          <Button disabled={!isValidCount || isPending} onClick={onAdd}>
            {t("add")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
