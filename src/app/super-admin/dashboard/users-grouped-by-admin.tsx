import { useState } from "react";
import { RefreshCcw } from "lucide-react";

import type { DragHandleProps } from "./grid";
import { useGetUsersGroupedByAdminCount } from "@/hooks/use-super-admin";
import { gender as genderOpts } from "@/utils/enums";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SelectWrapper } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

function groupData(data: Record<string, number>, dateType: "day" | "month" | "caste") {
  if (dateType === "day" || dateType === "caste") return Object.entries(data).map(([key, value]) => ({ key, value }))

  const result: { key: string; value: number }[] = []
  const indexMap: Record<string, number> = {}

  for (const [dateStr, value] of Object.entries(data)) {
    const [, month, year] = dateStr.split("-")
    const key = `${month}-${year}`

    if (indexMap[key] !== undefined) {
      result[indexMap[key]].value += value
    } else {
      indexMap[key] = result.length
      result.push({ key, value })
    }
  }

  return result
}

function UsersGroupedByAdmin({ dragHandle }: DragHandleProps) {
  const [type, setType] = useState<"date" | "caste">("date")
  const [dateType, setdateType] = useState<"day" | "month">("month")
  const [includeByAdmin, setIncludeByAdmin] = useState(false)
  const [gender, setGender] = useState("all")

  const { isLoading, isFetching, data, refetch } = useGetUsersGroupedByAdminCount({
    type,
    includeByAdmin,
    gender: gender === "all" ? "" : gender,
  })

  const datesOpts: itemsT = [
    { value: "day", label: "Day" },
    { value: "month", label: "Month" },
  ]

  const typesOpts: itemsT = [
    { value: "date", label: "Date" },
    { value: "caste", label: "Caste" },
  ]

  const includeByAdminOpts: itemsT = [
    { value: "false", label: "All" },
    { value: "true", label: "By Admin" },
  ]

  const genderOptsWithAll: itemsT = [
    { value: "all", label: "All" },
    ...genderOpts.map(g => ({ value: g as string, label: g as string })),
  ]

  return (
    <Card className="gap-0 h-full">
      <CardHeader className="flex items-center pb-1 flex-wrap">
        {dragHandle}
        <CardTitle className="shrink-0 mr-auto">Users Count by Admin</CardTitle>

        <SelectWrapper
          value={`${includeByAdmin}`}
          items={includeByAdminOpts}
          placeholder="Group by"
          triggerCls="w-fit"
          onValueChange={v => setIncludeByAdmin(v === "true")}
        />

        <SelectWrapper
          value={gender}
          items={genderOptsWithAll}
          placeholder="Gender"
          triggerCls="w-fit"
          onValueChange={v => setGender(v as any)}
        />

        <SelectWrapper
          value={type}
          items={typesOpts}
          placeholder="Select type"
          triggerCls="w-fit"
          onValueChange={v => setType(v as "date" | "caste")}
        />

        {
          type === "date" &&
          <SelectWrapper
            value={dateType}
            items={datesOpts}
            placeholder="Select date type"
            triggerCls="w-fit"
            onValueChange={v => setdateType(v as "day" | "month")}
          />
        }

        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          className="w-fit"
        >
          <RefreshCcw className={isLoading || isFetching ? "animate-spin" : ""} />
        </Button>
      </CardHeader>

      <CardContent className="flex-1 min-h-0 py-4 overflow-auto">
        {
          isLoading &&
          <Skeleton className="h-72" />
        }

        {
          !isLoading && data?.map(ad => (
            <div key={ad?._id} className="mb-2 p-4 border rounded-xl">
              <div className="df justify-between">
                <div>
                  <p>{!includeByAdmin ? "All" : ad?.fullName || "Individual"}</p>
                  {ad?.email && <p className="text-xs text-muted-foreground">{ad?.email}</p>}
                </div>

                <div className="font-semibold">{Object?.values(ad?.data)?.reduce((a, b) => a + b, 0)}</div>
              </div>

              <ul className="mt-2 df flex-wrap">
                {
                  ad?.data && groupData(ad?.data, type === "date" ? dateType : type)
                    .sort((a, b) => a.key.localeCompare(b.key))
                    .map(v => (
                      <li key={v.key} className="df justify-between px-2 py-1 text-xs border rounded-full bg-muted/20">
                        <p>{v.key} :</p>
                        <p className="font-medium">{v.value}</p>
                      </li>
                    ))
                }
              </ul>
            </div>
          ))
        }
      </CardContent>
    </Card>
  )
}

export default UsersGroupedByAdmin
