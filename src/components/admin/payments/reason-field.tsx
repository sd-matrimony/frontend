"use client";

import { useTranslations } from "next-intl";

import { Textarea } from "@glraj/ui/textarea";
import { Label } from "@glraj/ui/label";

type props = {
  id: string
  value: string
  onChange: (value: string) => void
}

export function ReasonField({ id, value, onChange }: props) {
  const t = useTranslations("superAdmin.paidUsersPage")

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{t("reasonLabel")}</Label>
      <Textarea
        id={id}
        rows={2}
        maxLength={300}
        value={value}
        placeholder={t("reasonPlaceholder")}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  )
}
