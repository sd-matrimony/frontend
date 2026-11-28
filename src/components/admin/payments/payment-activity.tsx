"use client";

import { useTranslations } from "next-intl";
import { format } from "date-fns";

import { useGetUserPaymentLogs, type paymentLogT } from "@/hooks/use-super-admin";

import { Card, CardContent, CardHeader, CardTitle } from "@glraj/ui/card";
import { planDetails } from "@/components/common/plan-badge";
import { Skeleton } from "@glraj/ui/skeleton";

type props = {
  userId: string
}

function formatDay(value?: string) {
  return value ? format(new Date(value), "dd-MM-yy") : "—"
}

function formatLimit(value?: number) {
  return value === 999 ? "∞" : String(value ?? 0)
}

export function PaymentActivity({ userId }: props) {
  const t = useTranslations("superAdmin.paidUsersPage")
  const { data, isLoading } = useGetUserPaymentLogs(userId)

  function describe(log: paymentLogT) {
    const admin = log.admin?.fullName || t("unknownAdmin")
    const details = log.details ?? {}
    const plan = details.subscribedTo ? planDetails[details.subscribedTo]?.name : ""
    const amount = `₹ ${(details.amount ?? 0).toLocaleString("en-IN")}`

    switch (log.action) {
      case "created":
        return t("logCreated", { admin, plan, amount })
      case "extended":
        return t("logExtended", { admin, days: details.days ?? 0, from: formatDay(details.previousExpiry), to: formatDay(details.newExpiry) })
      case "profilesAdded":
        return t("logProfilesAdded", { admin, count: details.profiles ?? 0, from: formatLimit(details.previousProfiles), to: formatLimit(details.newProfiles) })
      case "cancelled":
        return t("logCancelled", { admin, plan })
      case "deleted":
        return t("logDeleted", { admin, plan, amount })
    }
  }

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>{t("activityTitle")}</CardTitle>
      </CardHeader>

      <CardContent className="max-h-[50vh] overflow-y-auto">
        {isLoading && <Skeleton className="h-20" />}

        {
          !isLoading && !data?.length &&
          <p className="py-6 text-center text-sm text-muted-foreground">{t("activityEmpty")}</p>
        }

        <ul className="space-y-1">
          {data?.map(log => (
            <li key={log._id} className="flex gap-3 px-2 py-2 rounded-md odd:bg-muted/60 text-sm">
              <span className="w-28 shrink-0 text-muted-foreground">{format(new Date(log.createdAt), "dd-MM-yy HH:mm")}</span>
              <div className="min-w-0">
                <p>{describe(log)}</p>
                {log.reason && <p className="text-xs text-muted-foreground break-words">{t("reasonText", { reason: log.reason })}</p>}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
