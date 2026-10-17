import { useState } from "react";
import { useTranslations } from "next-intl";
import { RefreshCcw } from "lucide-react";
import { format, formatDistanceToNowStrict } from "date-fns";
import Link from "next/link";

import type { DragHandleProps } from "./grid";
import { useGetActiveUsers } from "@/hooks/use-super-admin";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectWrapper } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import LoadMore from "@/components/common/load-more";

function ActiveUsers({ dragHandle }: DragHandleProps) {
  const t = useTranslations("superAdmin.dashboard.activeUsers")
  const [days, setDays] = useState("1")
  const [search, setSearch] = useState("")

  const { isLoading, data, isFetching, hasNextPage, fetchNextPage, refetch } = useGetActiveUsers(Number(days))

  const q = search.trim().toLowerCase()
  const filtered = q
    ? data?.filter(user =>
      user?.fullName?.toLowerCase().includes(q) ||
      user?.email?.toLowerCase().includes(q) ||
      user?.contactDetails?.mobile?.toLowerCase().includes(q)
    )
    : data

  return (
    <Card className="gap-0 h-full">
      <CardHeader>
        <div className="flex items-center gap-2 flex-wrap">
          {dragHandle}
          <CardTitle className="mr-auto">{t("title")}</CardTitle>

          <Input
            placeholder={t("searchPlaceholder")}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="max-w-56 h-8"
          />

          <SelectWrapper
            items={[
              { value: "1", label: t("today") },
              { value: "7", label: t("week") },
              { value: "30", label: t("month") },
            ]}
            value={days}
            onValueChange={v => setDays(v as string)}
            triggerCls="w-36"
          />
        </div>

        <CardAction>
          <Button
            size="sm"
            variant="outline"
            onClick={() => refetch()}
          >
            <RefreshCcw className={isLoading || isFetching ? "animate-spin" : ""} />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 py-4 overflow-auto">
        {
          isLoading &&
          <Skeleton className="h-72" />
        }

        {
          !isLoading && !filtered?.length &&
          <p className="py-10 text-center text-sm text-muted-foreground">{t("empty")}</p>
        }

        {
          !isLoading && !!filtered?.length &&
          <table className="w-full table-fixed">
            <thead>
              <tr className="text-left">
                <th className="w-48 px-1 py-2 text-sm font-medium">{t("colUser")}</th>
                <th className="w-28 px-1 py-2 text-sm font-medium">{t("colLastActive")}</th>
                <th className="w-24 px-1 py-2 text-sm font-medium text-center">{t("colLastLogin")}</th>
              </tr>
            </thead>

            <tbody>
              {
                filtered.map(user => (
                  <tr key={user?._id} className="text-sm odd:bg-muted/60">
                    <td className="px-1 py-2">
                      <Link target="_blank" href={`/super-admin/user/${user?._id}`}>
                        <div className="df group">
                          <img
                            className="size-10 shrink-0 rounded object-cover"
                            src={user?.profileImg || "/imgs/user.jpg"}
                            alt=""
                          />
                          <div className="min-w-0 flex-1">
                            <p className="group-hover:text-pink-400 truncate">{user?.fullName}</p>
                            <p className="text-xs text-muted-foreground truncate">
                              {[user?.contactDetails?.mobile, user?.email].filter(Boolean).join(" - ")}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </td>

                    <td className="px-1 py-2" title={format(new Date(user.lastActiveAt), "dd-MM-yy hh:mm a")}>
                      {formatDistanceToNowStrict(new Date(user.lastActiveAt), { addSuffix: true })}
                    </td>

                    <td className="px-1 py-2 text-center">
                      {user?.lastLoginAt ? format(new Date(user.lastLoginAt), "dd-MM-yy") : "-"}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        }

        {
          !isLoading && hasNextPage && !isFetching &&
          <LoadMore fn={fetchNextPage} />
        }
      </CardContent>
    </Card>
  )
}

export default ActiveUsers
