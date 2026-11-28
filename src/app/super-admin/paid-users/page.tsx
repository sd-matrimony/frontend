"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader, RefreshCcw } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

import { useGetPaymentUsers, type paymentUsersStatusT } from "@/hooks/use-super-admin";

import { PlanBadge, planDetails } from "@/components/common/plan-badge";
import { SelectWrapper } from "@glraj/ui/select";
import { Skeleton } from "@glraj/ui/skeleton";
import { Button } from "@glraj/ui/button";
import { Badge } from "@glraj/ui/badge";
import { Input } from "@glraj/ui/input";

function Page() {
  const t = useTranslations("superAdmin.paidUsersPage")
  const [searchInput, setSearchInput] = useState("")
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<paymentUsersStatusT>("all")
  const sentinelRef = useRef<HTMLDivElement>(null)

  const { data, isLoading, isFetching, hasNextPage, isFetchingNextPage, fetchNextPage, refetch } = useGetPaymentUsers(search, status)

  const statusOptions = [
    { value: "all", label: t("statusAll") },
    { value: "active", label: t("statusActive") },
    { value: "expired", label: t("statusExpired") },
  ]

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || isLoading || !hasNextPage || isFetchingNextPage) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) fetchNextPage() },
      { threshold: 0, rootMargin: "200px" },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage])

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSearch(searchInput.trim())
  }

  return (
    <section className="px-2 sm:px-4 pt-4">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <h1 className="text-lg font-semibold mr-auto">{t("title")}</h1>

        <form onSubmit={onSearch} className="df">
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            className="w-64 h-8"
          />
          <Button type="submit" size="sm">{t("search")}</Button>
        </form>

        <SelectWrapper
          items={statusOptions}
          value={status}
          onValueChange={v => setStatus(v as paymentUsersStatusT)}
          triggerCls="w-fit h-8"
        />

        <Button size="sm" variant="outline" onClick={() => refetch()}>
          <RefreshCcw className={isFetching ? "animate-spin" : ""} />
        </Button>
      </div>

      {isLoading && <Skeleton className="h-72" />}

      {
        !isLoading && !data?.length &&
        <p className="py-16 text-center text-sm text-muted-foreground">{t("empty")}</p>
      }

      {
        !isLoading && !!data?.length &&
        <div className="max-h-[calc(100dvh-7.5rem)] overflow-auto">
          <table className="w-full min-w-3xl text-sm">
            <thead className="sticky top-0 z-1 bg-background">
              <tr className="text-left shadow-[inset_0_-1px_0_var(--border)]">
                <th className="px-2 py-2 font-medium">{t("colUser")}</th>
                <th className="px-2 py-2 font-medium">{t("colPlan")}</th>
                <th className="px-2 py-2 font-medium">{t("colExpiry")}</th>
                <th className="px-2 py-2 font-medium text-center">{t("colUnlocked")}</th>
                <th className="px-2 py-2 font-medium text-center">{t("colPayments")}</th>
                <th className="px-2 py-2 font-medium text-right">{t("colTotal")}</th>
                <th className="px-2 py-2 font-medium text-center">{t("colLastPaid")}</th>
              </tr>
            </thead>

            <tbody>
              {data.map(item => {
                const plan = item.currentPlan ?? item.latestPlan
                const isActive = !!plan && new Date(plan.expiryDate) > new Date()
                const isCancelled = !item.currentPlan && isActive

                return (
                  <tr key={item._id} className="odd:bg-muted/60 hover:bg-muted">
                    <td className="px-2 py-2">
                      <Link href={`/super-admin/paid-users/${item._id}`} className="df group">
                        <img
                          className="size-10 shrink-0 rounded object-cover"
                          src={item.user.profileImg || "/imgs/user.jpg"}
                          alt=""
                        />
                        <div className="min-w-0">
                          <p className="group-hover:text-pink-500 truncate">{item.user.fullName}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {[item.user.contactDetails?.mobile, item.user.email].filter(Boolean).join(" - ")}
                          </p>
                        </div>
                      </Link>
                    </td>

                    <td className="px-2 py-2">
                      {
                        plan
                          ? <div className="df">
                            <PlanBadge subscribedTo={plan.subscribedTo} className="p-2" />
                            <span>{planDetails[plan.subscribedTo]?.name}</span>
                          </div>
                          : <span className="text-muted-foreground">{t("noPlan")}</span>
                      }
                    </td>

                    <td className="px-2 py-2">
                      {
                        plan &&
                        <div className="df">
                          <span>{format(new Date(plan.expiryDate), "dd-MM-yy")}</span>
                          {!isActive && <Badge variant="destructive">{t("expired")}</Badge>}
                          {isCancelled && <Badge variant="destructive">{t("cancelled")}</Badge>}
                        </div>
                      }
                    </td>

                    <td className="px-2 py-2 text-center tabular-nums">
                      {
                        plan
                          ? `${item.currentUnlocked} / ${plan.noOfProfilesCanView === 999 ? "∞" : plan.noOfProfilesCanView}`
                          : item.unlockedCount
                      }
                      {
                        plan && item.unlockedCount > item.currentUnlocked &&
                        <p className="text-xs text-muted-foreground">{t("unlockedTotal", { count: item.unlockedCount })}</p>
                      }
                    </td>
                    <td className="px-2 py-2 text-center">{item.paymentsCount}</td>
                    <td className="px-2 py-2 text-right">₹ {item.totalAmount.toLocaleString("en-IN")}</td>
                    <td className="px-2 py-2 text-center">{format(new Date(item.lastPaidAt), "dd-MM-yy")}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <div ref={sentinelRef} className="h-8 dc">
            {isFetchingNextPage && <Loader className="animate-spin size-4" />}
          </div>
        </div>
      }
    </section>
  )
}

export default Page
