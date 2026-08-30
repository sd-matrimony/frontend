"use client";

import { useState } from "react";

import { SelectWrapper } from "@/components/ui/select";
import Users from "@/components/admin/users";

const statusOpts: itemsT = [
  { value: "approved", label: "Approved" },
  // { value: "rejected", label: "Rejected" },
  // { value: "blocked", label: "Blocked" },
  { value: "deleted", label: "Deleted" },
]

function Page() {
  const [status, setStatus] = useState("approved")

  const statusProps =
    status === "deleted" ? { isDeleted: true } :
      // status === "rejected" ? { approvalStatus: "rejected" as const } :
      // status === "blocked" ? { isBlocked: true } :
      { approvalStatus: "approved" as const }

  return (
    <section className="px-2 sm:px-4 pt-4">
      <Users
        role="super-admin"
        {...statusProps}
        statusSelect={
          <SelectWrapper
            value={status}
            items={statusOpts}
            placeholder="Status"
            triggerCls="w-fit"
            onValueChange={v => setStatus(v as string)}
          />
        }
      />
    </section>
  )
}

export default Page
