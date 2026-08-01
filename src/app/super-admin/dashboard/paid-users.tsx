import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

import { useGetPaidUsers } from "@/hooks/use-super-admin";

import { Card, CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlanBadge } from "@/components/common/plan-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import LoadMore from "@/components/common/load-more";

function PaidUsers() {
  const { isLoading, data, isFetching, hasNextPage, fetchNextPage, refetch } = useGetPaidUsers()
  const [search, setSearch] = useState("")

  const filtered = search.trim()
    ? data?.filter(user => {
      const q = search.trim().toLowerCase()
      return (
        user?.user?.fullName?.toLowerCase().includes(q) ||
        user?.user?.email?.toLowerCase().includes(q) ||
        user?.user?.contactDetails?.mobile?.toLowerCase().includes(q)
      )
    })
    : data
  console.log(filtered)
  return (
    <Card className="gap-0">
      <CardHeader>
        <CardTitle>Paid Users</CardTitle>
        <Input
          placeholder="Search by name, email or mobile..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="mb-3"
        />
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

      <CardContent className="max-h-80 py-4 overflow-auto">
        {
          isLoading &&
          <Skeleton className="h-72" />
        }

        <table className="w-full table-fixed overflow-x-auto">
          <thead>
            <tr className="text-left">
              <th className="w-40 px-1 py-2 text-sm font-medium">User</th>
              <th className="w-28 px-1 py-2 text-sm font-medium">Plan</th>
              <th className="w-32 pl-1 pr-4 py-2 text-sm font-medium text-right">Amount</th>
              <th className="w-24 px-1 py-2 text-sm font-medium text-center">Expiry Date</th>
            </tr>
          </thead>

          <tbody>
            {
              !isLoading &&
              filtered
                ?.filter(user => user?.user)
                ?.map(user => (
                  <tr key={user?._id} className="mb-2 text-sm odd:bg-muted/60">
                    <td className="px-1 py-2">
                      <Link target="_blank" href={`/super-admin/user/${user?.user?._id}`}>
                        <div className="df group">
                          <img
                            className="size-10 shrink-0 rounded object-cover"
                            src={user?.user?.profileImg || "/imgs/user.jpg"}
                            alt=""
                          />
                          <div className="min-w-0 flex-1">
                            <p className="group-hover:text-pink-400">{user?.user?.fullName}</p>
                            <p className="text-xs text-muted-foreground truncate">{user?.user?.contactDetails?.mobile} - {user?.user?.email}</p>
                          </div>
                        </div>
                      </Link>
                    </td>

                    <td className="px-1 py-2">
                      <div className="df">
                        <PlanBadge
                          subscribedTo={user?.subscribedTo}
                          className="p-2"
                        />
                        <p className="capitalize">{user?.subscribedTo}</p>
                      </div>
                    </td>

                    <td className="pl-1 pr-4 py-2 text-right">₹ {Number(user?.amount).toLocaleString()}</td>

                    <td className="px-1 py-2 text-center">{format(new Date(user?.expiryDate), "dd-MM-yy")}</td>
                  </tr>
                ))
            }
          </tbody>
        </table>

        {
          !isLoading && hasNextPage && !isFetching &&
          <LoadMore fn={fetchNextPage} />
        }
      </CardContent>
    </Card>
  )
}

export default PaidUsers
