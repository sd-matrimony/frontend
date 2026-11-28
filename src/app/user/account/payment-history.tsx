"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Printer, ReceiptText } from "lucide-react";
import { format } from "date-fns";

import { useMyPayments, type myPaymentT } from "@/hooks/use-user";
import { useUserDetailsMini } from "@/hooks/use-account";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@glraj/ui/dialog";
import { PlanBadge, planDetails } from "@/components/common/plan-badge";
import { Skeleton } from "@glraj/ui/skeleton";
import { Button } from "@glraj/ui/button";

function formatAmount(amount: number) {
  return `₹ ${amount.toLocaleString("en-IN")}`
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

type receiptRow = [string, string]

function printReceipt(title: string, rows: receiptRow[]) {
  const win = window.open("", "_blank", "width=480,height=640")
  if (!win) return

  const body = rows
    .map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`)
    .join("")

  win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>
  body { font-family: system-ui, sans-serif; padding: 24px; color: #111; }
  h1 { font-size: 18px; margin: 0 0 4px; color: #be185d; }
  p { margin: 0 0 16px; color: #555; font-size: 13px; }
  table { width: 100%; border-collapse: collapse; font-size: 14px; }
  th, td { text-align: left; padding: 8px 4px; border-bottom: 1px solid #eee; }
  th { color: #555; font-weight: 500; width: 45%; }
</style></head><body><h1>SD Matrimony</h1><p>${escapeHtml(title)}</p><table>${body}</table></body></html>`)
  win.document.close()
  win.focus()
  win.print()
}

function useReceiptRows() {
  const t = useTranslations("user.account.paymentHistory")
  const { data: me } = useUserDetailsMini()

  return (payment: myPaymentT): receiptRow[] => [
    [t("receiptNo"), payment.orderId || payment._id],
    [t("paidOn"), format(new Date(payment.createdAt), "dd MMM yyyy")],
    [t("name"), me?.fullName || ""],
    [t("plan"), planDetails[payment.subscribedTo]?.name || payment.subscribedTo],
    [t("profiles"), payment.noOfProfilesCanView === 999 ? t("unlimited") : String(payment.noOfProfilesCanView)],
    [t("assisted"), payment.isAssisted ? t("months", { count: payment.assistedMonths }) : t("notIncluded")],
    [t("validTill"), format(new Date(payment.expiryDate), "dd MMM yyyy")],
    [t("amount"), formatAmount(payment.amount)],
  ]
}

function PaymentHistory() {
  const t = useTranslations("user.account.paymentHistory")
  const { data, isLoading } = useMyPayments()
  const [receipt, setReceipt] = useState<myPaymentT | null>(null)
  const getRows = useReceiptRows()

  if (isLoading) return <Skeleton className="h-32" />

  if (!data?.length) return <p className="py-6 text-center text-sm text-muted-foreground">{t("empty")}</p>

  const rows = receipt ? getRows(receipt) : []

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-md text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="px-2 py-2 font-medium">{t("colDate")}</th>
              <th className="px-2 py-2 font-medium">{t("colPlan")}</th>
              <th className="px-2 py-2 font-medium text-right">{t("colAmount")}</th>
              <th className="px-2 py-2 font-medium text-center">{t("colValidTill")}</th>
              <th className="px-2 py-2" />
            </tr>
          </thead>

          <tbody>
            {data.map(payment => (
              <tr key={payment._id} className="odd:bg-muted/60">
                <td className="px-2 py-2">{format(new Date(payment.createdAt), "dd-MM-yy")}</td>
                <td className="px-2 py-2">
                  <div className="df">
                    <PlanBadge subscribedTo={payment.subscribedTo} className="p-2" />
                    <span>{planDetails[payment.subscribedTo]?.name}</span>
                  </div>
                </td>
                <td className="px-2 py-2 text-right">{formatAmount(payment.amount)}</td>
                <td className="px-2 py-2 text-center">{format(new Date(payment.expiryDate), "dd-MM-yy")}</td>
                <td className="px-2 py-2 text-right">
                  <Button size="sm" variant="outline" onClick={() => setReceipt(payment)}>
                    <ReceiptText />
                    {t("receipt")}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={!!receipt} onOpenChange={open => { if (!open) setReceipt(null) }}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("receiptTitle")}</DialogTitle>
          </DialogHeader>

          <dl className="text-sm divide-y">
            {rows.map(([label, value]) => (
              <div key={label} className="flex justify-between gap-4 py-2">
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="font-medium text-right break-all">{value}</dd>
              </div>
            ))}
          </dl>

          <DialogFooter>
            <Button onClick={() => printReceipt(t("receiptTitle"), rows)}>
              <Printer />
              {t("print")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default PaymentHistory
