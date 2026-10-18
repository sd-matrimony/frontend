import { useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { CalendarDays, IndianRupee, Lock, LockOpen, Sun, Users } from "lucide-react";

import { useGetDashboardStats } from "@/hooks/use-super-admin";
import { STATS_PIN } from "@/utils/enums";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MonthYearSelect } from "@/components/common/month-year-select";

const rupee = (n: number) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`

type TileProps = {
  Icon: typeof Users
  label: string
  value: string
  sub?: React.ReactNode
  action?: React.ReactNode
  isLoading: boolean
}

function Tile({ Icon, label, value, sub, action, isLoading }: TileProps) {
  return (
    <Card className="py-2.5 gap-0">
      <CardContent className="px-3 space-y-0.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Icon className="size-3.5" /> {label}
          {action}
        </div>

        {
          isLoading
            ? <Skeleton className="h-6 w-20" />
            : <p className="text-lg font-semibold leading-tight tabular-nums">{value}</p>
        }

        {
          !isLoading && sub &&
          <div className="text-[11px] leading-tight text-muted-foreground truncate">{sub}</div>
        }
      </CardContent>
    </Card>
  )
}

function StatsLock({ onUnlock }: { onUnlock: () => void }) {
  const t = useTranslations("superAdmin.dashboard.stats")
  const [pin, setPin] = useState("")
  const [error, setError] = useState(false)

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (pin === STATS_PIN) return onUnlock()
    setError(true)
    setPin("")
  }

  return (
    <Card className="py-2.5 mb-4">
      <CardContent className="px-3">
        <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-2">
          <p className="df gap-1.5 text-sm text-muted-foreground mr-auto">
            <Lock className="size-3.5" /> {t("locked")}
          </p>

          {
            error &&
            <p className="text-xs text-destructive">{t("wrongPin")}</p>
          }

          <Input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            maxLength={4}
            value={pin}
            placeholder={t("pinPlaceholder")}
            aria-label={t("pinPlaceholder")}
            onChange={e => {
              setPin(e.target.value.replace(/\D/g, ""))
              setError(false)
            }}
            className="h-8 w-28"
          />

          <Button type="submit" size="sm" disabled={pin.length !== 4}>
            <LockOpen className="size-3.5" /> {t("unlock")}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function StatsOverview() {
  const t = useTranslations("superAdmin.dashboard.stats")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [month, setMonth] = useState(() => format(new Date(), "yyyy-MM"))
  const { data, isLoading } = useGetDashboardStats(isUnlocked, month)

  const revenue = data?.revenue
  const users = data?.users

  if (!isUnlocked) return <StatsLock onUnlock={() => setIsUnlocked(true)} />

  return (
    <div className="relative mb-4">
      <Button
        size="icon"
        variant="ghost"
        aria-label={t("lock")}
        title={t("lock")}
        onClick={() => setIsUnlocked(false)}
        className="absolute top-1.5 right-1.5 z-1 size-6 text-muted-foreground"
      >
        <Lock className="size-3.5" />
      </Button>

      <div className="grid gap-2 grid-cols-2 lg:grid-cols-4">
        <Tile
          Icon={IndianRupee}
          label={t("totalRevenue")}
          value={rupee(revenue?.total ?? 0)}
          isLoading={isLoading}
          sub={
            <>
              {t("online")}: {rupee(revenue?.online ?? 0)} · {t("byAdmin")}: {rupee(revenue?.byAdmin ?? 0)} · {t("payments", { count: revenue?.count ?? 0 })}
            </>
          }
        />

        <Tile
          Icon={CalendarDays}
          label={t("month")}
          value={rupee(revenue?.month ?? 0)}
          isLoading={isLoading}
          sub={t("payments", { count: revenue?.monthCount ?? 0 })}
          action={
            <MonthYearSelect
              size="xs"
              value={month}
              onChange={setMonth}
              className="ml-auto max-lg:mr-6"
            />
          }
        />

        <Tile
          Icon={Sun}
          label={t("today")}
          value={rupee(revenue?.today ?? 0)}
          isLoading={isLoading}
        />

        <Tile
          Icon={Users}
          label={t("activeUsers")}
          value={String(users?.activeToday ?? 0)}
          isLoading={isLoading}
          sub={
            <>
              {t("active7d")}: {users?.active7d ?? 0} · {t("active30d")}: {users?.active30d ?? 0} · {t("ofTotal", { total: users?.total ?? 0 })}
            </>
          }
        />
      </div>
    </div>
  )
}

export default StatsOverview
