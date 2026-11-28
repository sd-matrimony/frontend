"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Ban, CreditCard, ExternalLink, RefreshCcw, Trash2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

import {
  useDeletePayment, useGetUserPayments, useGetUserUnlockedProfiles, useRemoveUserPlan,
  type userPaymentT,
} from "@/hooks/use-super-admin";

import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@glraj/ui/card";
import { PlanBadge, planDetails } from "@/components/common/plan-badge";
import { Skeleton } from "@glraj/ui/skeleton";
import { Button } from "@glraj/ui/button";
import { Badge } from "@glraj/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@glraj/ui/dialog";
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
} from "@glraj/ui/alert-dialog";

import MakePaymentForUser from "@/app/super-admin/payment/make-payment-for-user";
import { AddProfilesDialog } from "./add-profiles-dialog";
import { ExtendPlanDialog } from "./extend-plan-dialog";
import { PaymentActivity } from "./payment-activity";
import { ReasonField } from "./reason-field";

type props = {
  id: string
}

function formatAmount(amount: number) {
  return `₹ ${amount.toLocaleString("en-IN")}`
}

function isActivePayment(payment: Pick<userPaymentT, "expiryDate">) {
  return new Date(payment.expiryDate) > new Date()
}

function DeletePaymentButton({ payment }: { payment: userPaymentT }) {
  const t = useTranslations("superAdmin.paidUsersPage")
  const tc = useTranslations("common")
  const { mutate, isPending } = useDeletePayment()
  const [reason, setReason] = useState("")

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            size="icon"
            variant="outline"
            aria-label={t("deletePayment")}
            className="size-8 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300"
          />
        }
      >
        <Trash2 className="size-3.5" />
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("deletePaymentTitle")}</AlertDialogTitle>
          <AlertDialogDescription render={<div />}>
            <p>
              {t("deletePaymentDesc", {
                amount: formatAmount(payment.amount),
                plan: planDetails[payment.subscribedTo]?.name,
                date: format(new Date(payment.createdAt), "dd-MM-yy"),
                count: payment.unlockedCount,
              })}
            </p>
            {payment.isCurrent && <p className="mt-2 font-medium text-foreground">{t("deletePaymentCurrent")}</p>}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ReasonField id={`delete-reason-${payment._id}`} value={reason} onChange={setReason} />

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{tc("cancel")}</AlertDialogCancel>
          <AlertDialogAction render={<Button variant="destructive" disabled={isPending} onClick={() => mutate({ _id: payment._id, reason: reason.trim() || undefined })} />}>
            {t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

type unlockedProps = {
  userId: string
  payment?: userPaymentT
  onShowAll: () => void
}

function UnlockedProfiles({ userId, payment, onShowAll }: unlockedProps) {
  const t = useTranslations("superAdmin.paidUsersPage")
  const { data, isLoading } = useGetUserUnlockedProfiles(userId, true, payment?._id ?? "all")

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle>{t("unlockedTitle")}</CardTitle>
        <CardDescription>
          {
            payment
              ? t("unlockedFor", {
                plan: planDetails[payment.subscribedTo]?.name,
                date: format(new Date(payment.createdAt), "dd-MM-yy"),
              })
              : t("unlockedAll")
          }
        </CardDescription>
        {
          payment &&
          <CardAction>
            <Button size="sm" variant="outline" onClick={onShowAll}>{t("showAllUnlocked")}</Button>
          </CardAction>
        }
      </CardHeader>

      <CardContent className="max-h-[60vh] overflow-y-auto">
        {isLoading && <Skeleton className="h-40" />}

        {
          !isLoading && !data?.profiles?.length &&
          <p className="py-8 text-center text-sm text-muted-foreground">{payment ? t("unlockedEmpty") : t("unlockedEmptyAll")}</p>
        }

        {
          !isLoading && data?.profiles?.map(profile => (
            <Link
              key={profile._id}
              target="_blank"
              href={`/super-admin/user/${profile._id}`}
              className="df group px-2 py-2 rounded-md odd:bg-muted/60"
            >
              <img
                className="size-10 shrink-0 rounded object-cover"
                src={profile.profileImg || "/imgs/user.jpg"}
                alt=""
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm group-hover:text-pink-500 truncate">{profile.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {[profile.otherDetails?.caste, profile.contactDetails?.mobile].filter(Boolean).join(" - ")}
                </p>
              </div>
              <p className="text-xs text-muted-foreground shrink-0">
                {t("unlockedOn", { date: format(new Date(profile.unlockedAt), "dd-MM-yy") })}
              </p>
            </Link>
          ))
        }
      </CardContent>
    </Card>
  )
}

export function PaidUserDetails({ id }: props) {
  const t = useTranslations("superAdmin.paidUsersPage")
  const tp = useTranslations("shared.planActions")
  const tc = useTranslations("common")

  const [paymentOpen, setPaymentOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [selectedPaymentId, setSelectedPaymentId] = useState<string>()

  const { data, isLoading, isFetching, refetch } = useGetUserPayments(id)
  const { mutate: removePlan, isPending: isRemoving } = useRemoveUserPlan()

  const user = data?.user
  const payments = data?.payments ?? []
  const currentPayment = payments.find(payment => payment.isCurrent)
  const selectedPayment = payments.find(payment => payment._id === selectedPaymentId)
  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const isCurrentActive = !!currentPayment && isActivePayment(currentPayment)

  if (isLoading) {
    return (
      <section className="px-2 sm:px-4 pt-4 space-y-4">
        <Skeleton className="h-24" />
        <Skeleton className="h-72" />
      </section>
    )
  }

  if (!user) return null

  const profileLimit = currentPayment?.noOfProfilesCanView === 999 ? t("unlimited") : currentPayment?.noOfProfilesCanView

  return (
    <section className="px-2 sm:px-4 pt-4 pb-8 space-y-4">
      <div className="df">
        <Button size="sm" variant="ghost" nativeButton={false} render={<Link href="/super-admin/paid-users" />}>
          <ArrowLeft />
          {t("back")}
        </Button>

        <Button size="sm" variant="outline" className="ml-auto" onClick={() => refetch()}>
          <RefreshCcw className={isFetching ? "animate-spin" : ""} />
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_2fr]">
        <Card>
          <CardHeader>
            <div className="df gap-3">
              <img
                className="size-14 shrink-0 rounded object-cover"
                src={user.profileImg || "/imgs/user.jpg"}
                alt=""
              />
              <div className="min-w-0">
                <CardTitle className="truncate">{user.fullName}</CardTitle>
                <CardDescription className="truncate">
                  {[user.contactDetails?.mobile, user.email].filter(Boolean).join(" - ")}
                </CardDescription>
              </div>
            </div>
            <CardAction>
              <Button
                size="icon"
                variant="ghost"
                aria-label={t("viewProfile")}
                nativeButton={false}
                render={<Link target="_blank" href={`/super-admin/user/${user._id}`} />}
              >
                <ExternalLink />
              </Button>
            </CardAction>
          </CardHeader>

          <CardContent className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">{t("totalPaid")}</p>
              <p className="text-lg font-semibold">{formatAmount(totalPaid)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">{t("colPayments")}</p>
              <p className="text-lg font-semibold">{t("paymentsCount", { count: payments.length })}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("currentPlan")}</CardTitle>
            <CardDescription>
              {
                currentPayment
                  ? (isCurrentActive ? t("expires", { date: format(new Date(currentPayment.expiryDate), "dd-MM-yy") }) : t("expiredOn", { date: format(new Date(currentPayment.expiryDate), "dd-MM-yy") }))
                  : t("noPlan")
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {
              currentPayment &&
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <div className="df">
                  <PlanBadge subscribedTo={currentPayment.subscribedTo} className="p-2" />
                  <span className="font-medium">{planDetails[currentPayment.subscribedTo]?.name}</span>
                  <Badge variant={isCurrentActive ? "secondary" : "destructive"}>
                    {isCurrentActive ? t("active") : t("expired")}
                  </Badge>
                </div>
                <span>{t("profilesUsed", { used: currentPayment.unlockedCount, limit: profileLimit ?? 0 })}</span>
                {currentPayment.isAssisted && <span>{t("assisted", { months: currentPayment.assistedMonths })}</span>}
              </div>
            }

            <div className="flex flex-wrap gap-2">
              <Dialog open={paymentOpen} onOpenChange={setPaymentOpen}>
                <DialogTrigger render={<Button size="sm" />}>
                  <CreditCard />
                  {tp("makePayment")}
                </DialogTrigger>

                <DialogContent className="@container lg:max-w-5xl">
                  <DialogHeader>
                    <DialogTitle>{tp("paymentFor", { fullName: user.fullName })}</DialogTitle>
                  </DialogHeader>

                  <div className="max-h-[80vh] p-0.5 pr-4 -mr-4 overflow-y-auto">
                    <MakePaymentForUser userId={user._id} compact onSuccess={() => setPaymentOpen(false)} />
                  </div>
                </DialogContent>
              </Dialog>

              {
                currentPayment &&
                <ExtendPlanDialog userId={user._id} fullName={user.fullName} expiryDate={currentPayment.expiryDate} />
              }

              {
                currentPayment && currentPayment.noOfProfilesCanView < 999 &&
                <AddProfilesDialog userId={user._id} fullName={user.fullName} currentLimit={currentPayment.noOfProfilesCanView} />
              }

              {
                isCurrentActive &&
                <AlertDialog>
                  <AlertDialogTrigger render={<Button size="sm" variant="outline" className="text-red-500 hover:text-red-600 border-red-200 hover:border-red-300" />}>
                    <Ban />
                    {t("cancelPlan")}
                  </AlertDialogTrigger>

                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("cancelPlanTitle")}</AlertDialogTitle>
                      <AlertDialogDescription>{t("cancelPlanDesc", { fullName: user.fullName })}</AlertDialogDescription>
                    </AlertDialogHeader>

                    <ReasonField id="cancel-plan-reason" value={cancelReason} onChange={setCancelReason} />

                    <AlertDialogFooter>
                      <AlertDialogCancel disabled={isRemoving}>{tc("cancel")}</AlertDialogCancel>
                      <AlertDialogAction render={<Button variant="destructive" disabled={isRemoving} onClick={() => removePlan({ _id: user._id, reason: cancelReason.trim() || undefined }, { onSuccess: () => setCancelReason("") })} />}>
                        {tp("remove")}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              }
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="gap-2">
        <CardHeader>
          <CardTitle>{t("paymentsTitle")}</CardTitle>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-3xl text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="px-2 py-2 font-medium">{t("colDate")}</th>
                <th className="px-2 py-2 font-medium">{t("colPlanName")}</th>
                <th className="px-2 py-2 font-medium text-right">{t("colAmount")}</th>
                <th className="px-2 py-2 font-medium text-center">{t("colProfiles")}</th>
                <th className="px-2 py-2 font-medium text-center">{t("colAssisted")}</th>
                <th className="px-2 py-2 font-medium text-center">{t("colExpiry")}</th>
                <th className="px-2 py-2 font-medium">{t("colSource")}</th>
                <th className="px-2 py-2 font-medium">{t("colStatus")}</th>
                <th className="px-2 py-2" />
              </tr>
            </thead>

            <tbody>
              {payments.map(payment => {
                const isActive = isActivePayment(payment)
                const isSelected = payment._id === selectedPayment?._id
                const limit = payment.noOfProfilesCanView === 999 ? "∞" : payment.noOfProfilesCanView

                return (
                  <tr key={payment._id} className={isSelected ? "bg-pink-50" : "odd:bg-muted/60"}>
                    <td className="px-2 py-2">{format(new Date(payment.createdAt), "dd-MM-yy")}</td>
                    <td className="px-2 py-2">
                      <div className="df">
                        <PlanBadge subscribedTo={payment.subscribedTo} className="p-2" />
                        <span>{planDetails[payment.subscribedTo]?.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-right">{formatAmount(payment.amount)}</td>
                    <td className="px-2 py-2 text-center">
                      <Button
                        size="sm"
                        variant="link"
                        className="h-auto p-0"
                        aria-label={t("showUnlocked")}
                        onClick={() => setSelectedPaymentId(payment._id)}
                      >
                        {payment.unlockedCount} / {limit}
                      </Button>
                    </td>
                    <td className="px-2 py-2 text-center">{payment.isAssisted ? payment.assistedMonths : t("none")}</td>
                    <td className="px-2 py-2 text-center">{format(new Date(payment.expiryDate), "dd-MM-yy")}</td>
                    <td className="px-2 py-2 text-muted-foreground">
                      {payment.orderId?.startsWith("by-admin") ? t("byAdmin") : t("online")}
                    </td>
                    <td className="px-2 py-2">
                      <div className="flex flex-wrap gap-1">
                        {payment.isCurrent && <Badge>{t("current")}</Badge>}
                        <Badge variant={isActive ? "secondary" : "destructive"}>
                          {isActive ? t("active") : t("expired")}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-2 py-2 text-right">
                      <DeletePaymentButton payment={payment} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <UnlockedProfiles userId={user._id} payment={selectedPayment} onShowAll={() => setSelectedPaymentId(undefined)} />
        <PaymentActivity userId={user._id} />
      </div>
    </section>
  )
}
