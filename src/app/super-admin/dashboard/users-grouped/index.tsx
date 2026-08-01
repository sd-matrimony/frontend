import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { format } from "date-fns";

import type { DragHandleProps } from "../grid";
import { useGetUsersGroupedCount } from "@/hooks/use-super-admin";
import { useStatics } from "@/hooks/use-general";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AutocompleteWrapper } from "@/components/ui/autocomplete";
import { SelectWrapper } from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import List from "./list";

type typeT = "Date" | "Caste" | "Both"
function decidePayload({ type, date, caste }: { type: typeT, caste: string, date: string }) {
  if (type === "Both") return { date, caste }
  if (type === "Caste") return { caste }
  return { date }
}

function UsersGrouped({ dragHandle }: DragHandleProps) {
  const [caste, setCaste] = useState("14 oor kaikolar mudaliyar")
  const [type, setType] = useState<typeT>("Date")
  const [date, setDate] = useState(new Date())

  const { data: castes, isLoading: isCasteLoading } = useStatics("castes")

  const payload = decidePayload({ type, date: format(date, "yyyy-MM-dd"), caste })
  const { isLoading, isFetching, data, refetch } = useGetUsersGroupedCount(payload)

  return (
    <Card className="gap-0 h-full">
      <CardHeader className="flex items-center gap-4 flex-wrap pb-1">
        {dragHandle}
        <CardTitle className="shrink-0 mr-auto">Users Grouped</CardTitle>

        <SelectWrapper
          items={["Date", "Caste", "Both"]}
          placeholder="Select type"
          value={type}
          onValueChange={v => setType(v as typeT)}
          triggerCls="w-24"
        />

        {
          type !== "Caste" &&
          <DatePicker
            selected={date}
            onSelect={(date) => setDate(date || new Date())}
            triggerProps={{ className: "w-32" }}
            disabled={d => d > new Date()}
          />
        }

        {
          type !== "Date" &&
          <div className="w-56">
            <AutocompleteWrapper
              value={caste}
              items={castes}
              isLoading={isCasteLoading}
              emptyMessage="No caste found"
              onValueChange={v => setCaste(v as string)}
            />
          </div>
        }

        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
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
            <Collapsible key={ad._id} className="mb-4 border rounded-lg overflow-hidden">
              <CollapsibleTrigger nativeButton={false} render={<div className="df px-4 py-3 bg-muted/40 cursor-pointer rounded-none" />}>
                <div className="flex-1">
                  <p>{ad?.fullName || "Individuals"}</p>
                  {ad?.email && <p className="text-xs text-muted-foreground">{ad?.email}</p>}
                </div>

                <div className="font-medium">{ad?.created}</div>
              </CollapsibleTrigger>

              <CollapsibleContent className="border-t">
                <List
                  createdBy={ad._id}
                  {...payload}
                />
              </CollapsibleContent>
            </Collapsible>
          ))
        }

        {
          !isLoading && data?.length === 0 && (
            <p className="dc h-60 text-center">No data found</p>
          )
        }
      </CardContent>
    </Card>
  )
}

export default UsersGrouped
