import { useTranslations } from "next-intl";
import { CalendarDays, IndianRupee, RefreshCcw, Sun, Users } from "lucide-react";

import { useGetDashboardStats } from "@/hooks/use-super-admin";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const rupee = (n: number) => `₹ ${Number(n || 0).toLocaleString("en-IN")}`

type TileProps = {
  Icon: typeof Users
  label: string
  value: string
  sub?: React.ReactNode
  isLoading: boolean
}

function Tile({ Icon, label, value, sub, isLoading }: TileProps) {
  return (
    <Card className="py-2.5 gap-0">
      <CardContent className="px-3 space-y-0.5">
        <p className="df gap-1.5 text-xs text-muted-foreground">
          <Icon className="size-3.5" /> {label}
        </p>

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

function StatsOverview() {
  const t = useTranslations("superAdmin.dashboard.stats")
  const { data, isLoading } = useGetDashboardStats()

  const revenue = data?.revenue
  const users = data?.users

  return (
    <div className="relative mb-4">
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
          label={t("thisMonth")}
          value={rupee(revenue?.thisMonth ?? 0)}
          isLoading={isLoading}
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
