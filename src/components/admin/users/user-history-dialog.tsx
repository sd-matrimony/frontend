"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";

import { useGetUserHistory, type userHistoryT } from "@/hooks/use-super-admin";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@glraj/ui/dialog";
import { Skeleton } from "@glraj/ui/skeleton";

type props = {
  _id: string
  fullName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

const fieldKeys: Record<string, string> = {
  fullName: "fieldName",
  email: "fieldEmail",
  gender: "fieldGender",
  dob: "fieldDob",
  maritalStatus: "fieldMaritalStatus",
  "contactDetails.mobile": "fieldMobile",
  "proffessionalDetails.salary": "fieldSalary",
  "otherDetails.caste": "fieldCaste",
  "otherDetails.subCaste": "fieldSubCaste",
  approvalStatus: "fieldApprovalStatus",
  isBlocked: "fieldBlocked",
  isDeleted: "fieldDeleted",
  isMarried: "fieldMarried",
  marriedOn: "fieldMarriedOn",
  marriedTo: "fieldMarriedTo",
  invited: "fieldInvited",
}

const DATE_FIELDS = new Set(["dob", "marriedOn"])

export function UserHistoryDialog({ _id, fullName, open, onOpenChange }: props) {
  const t = useTranslations("shared.adminUsersTable.history")
  const { data, isLoading } = useGetUserHistory(_id, open)

  function fieldLabel(field: string) {
    const key = fieldKeys[field]
    return key ? t(key) : field
  }

  function formatValue(field: string, value: unknown) {
    if (value === null || value === undefined || value === "") return t("empty")
    if (typeof value === "boolean") return value ? t("yes") : t("no")
    if (DATE_FIELDS.has(field) && typeof value === "string" && !Number.isNaN(Date.parse(value))) return format(new Date(value), "dd-MM-yyyy")
    if (typeof value === "object") return JSON.stringify(value)
    return String(value)
  }

  function describe(log: userHistoryT) {
    const admin = log.admin?.fullName || t("unknownAdmin")

    switch (log.action) {
      case "created":
        return log.admin ? t("created", { admin }) : t("signedUp")
      case "updated":
        return t("updated", { admin, count: log.changes?.length ?? 0 })
      case "passwordReset":
        return t("passwordReset", { admin })
      case "married":
        return t("markedMarried", { admin })
      case "invited":
        return t("invited", { admin })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{t("title", { name: fullName })}</DialogTitle>
        </DialogHeader>

        <div className="max-h-[65vh] overflow-y-auto -mx-1 px-1">
          {isLoading && <Skeleton className="h-40" />}

          {
            !isLoading && !data?.length &&
            <p className="py-8 text-center text-sm text-muted-foreground">{t("none")}</p>
          }

          <ul className="space-y-1">
            {data?.map(log => (
              <li key={log._id} className="flex gap-3 px-2 py-2 rounded-md odd:bg-muted/60 text-sm">
                <span className="w-28 shrink-0 text-muted-foreground">{format(new Date(log.createdAt), "dd-MM-yy HH:mm")}</span>
                <div className="min-w-0 space-y-1">
                  <p>{describe(log)}</p>
                  {
                    !!log.changes?.length &&
                    <ul className="text-xs text-muted-foreground space-y-0.5">
                      {log.changes.map(change => (
                        <li key={change.field} className="break-words">
                          <span className="font-medium text-foreground">{fieldLabel(change.field)}</span>
                          {
                            ("from" in change || "to" in change) &&
                            <span>: {formatValue(change.field, change.from)} → {formatValue(change.field, change.to)}</span>
                          }
                        </li>
                      ))}
                    </ul>
                  }
                </div>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  )
}
