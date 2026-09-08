"use client";

import { ColumnSorter, type AppColumnDef as ColumnDef } from "@/components/ui/data-table";
import Link from "next/link";

import type { tab } from "./types";
import { planDetails } from "@/components/common/plan-badge";

import Actions from "./actions";

type tFn = (key: string, values?: Record<string, string | number>) => string

export const columns = (currentTab: tab, role: rolesT, t: tFn): ColumnDef<Partial<userT>>[] => {
  const cols: ColumnDef<Partial<userT>>[] = [
    {
      accessorKey: "fullName",
      header: ({ column }) => <ColumnSorter column={column} title={t("columnName")} />,
      cell({ row }) {
        return (
          <Link
            href={`/${role}/user/${row.original._id}`}
            target="_blank"
            className="df hover:text-pink-500"
          >
            <img
              className="size-16 shrink-0 rounded object-cover"
              src={row.original.profileImg || "/imgs/user.jpg"}
              alt=""
            />
            <span>{row.original.fullName}</span>
          </Link>
        )
      },
      filterFn: (row, id, value) => value?.includes(row?.getValue(id)),
    },
    {
      accessorKey: "email",
      header: ({ column }) => <ColumnSorter column={column} title={t("columnEmail")} />,
      cell: ({ row }) => <p className="normal-case">{row?.original?.email || "---"}</p>,
    },
    {
      id: "Mobile",
      accessorKey: "contactDetails.mobile",
      header: ({ column }) => <ColumnSorter column={column} title={t("columnMobile")} />,
      cell: ({ row }) => <p className="normal-case">{row?.original?.contactDetails?.mobile || "---"}</p>,
    },
    {
      id: "Caste",
      accessorKey: "otherDetails.caste",
      header: ({ column }) => <ColumnSorter column={column} title={t("columnCaste")} />,
      filterFn: (row, id, value) => value?.includes(row?.getValue(id)),
      cell: ({ row }) => (
        <p className="normal-case">
          {row?.original?.otherDetails?.caste || "---"} {row?.original?.otherDetails?.subCaste ? `- ${row?.original?.otherDetails?.subCaste}` : ""}
        </p>
      ),
    },
    {
      accessorKey: "gender",
      header: ({ column }) => <ColumnSorter column={column} title={t("columnGender")} />,
      filterFn: (row, id, value) => value?.includes(row?.getValue(id)),
    },
    {
      accessorKey: "maritalStatus",
      header: ({ column }) => <ColumnSorter column={column} title={t("columnMaritalStatus")} />,
      filterFn: (row, id, value) => value?.includes(row?.getValue(id)),
    },
    {
      id: "Salary",
      accessorKey: "proffessionalDetails.salary",
      header: ({ column }) => <ColumnSorter column={column} title={t("columnSalary")} />,
      cell: ({ row }) => <p className="normal-case">{row?.original?.proffessionalDetails?.salary?.toLocaleString() || "---"}</p>,
    },
  ]

  if (role === "super-admin") {
    cols.push({
      id: "Plan",
      header: t("columnPlan"),
      enableSorting: false,
      cell: ({ row }) => {
        const plan = row.original.currentPlan
        const isActive = plan && new Date(plan.expiryDate) > new Date()
        if (!isActive) return <p className="text-xs text-muted-foreground">{t("planNone")}</p>
        return <span className="text-xs font-medium">{planDetails[plan.subscribedTo].name}</span>
      },
    })
  }

  cols.push({
    id: "action",
    header: "",
    enableSorting: false,
    cell({ row }) {
      return (
        <Actions
          _id={row?.original?._id || ""}
          dob={row?.original?.dob || ""}
          fullName={row?.original?.fullName || ""}
          gender={row?.original?.gender}
          currentTab={currentTab}
          role={role}
          currentPlan={row?.original?.currentPlan}
          profileImg={row?.original?.profileImg}
          email={row?.original?.email}
          mobile={row?.original?.contactDetails?.mobile}
          salary={row?.original?.proffessionalDetails?.salary}
        />
      )
    }
  })

  return cols
}
