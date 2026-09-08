"use client";

import { useTranslations } from "next-intl";
import { ColumnSorter, type AppColumnDef as ColumnDef } from "@/components/ui/data-table";
import Link from "next/link";

import { planDetails } from "@/components/common/plan-badge";
import { type niuT } from "@/hooks/use-super-admin";

import InviteAction from "./invite-action";
import NumberCopy from "./number-copy";

export function useInviteColumns(): ColumnDef<niuT>[] {
  const t = useTranslations("superAdmin.invites")

  return [
  {
    accessorKey: "fullName",
    header: ({ column }) => <ColumnSorter column={column} title={t("colName")} />,
    cell({ row }) {
      return (
        <Link
          href={`/super-admin/user/${row.original._id}`}
          target="_blank"
          className="df hover:text-pink-500"
        >
          <img
            className="size-16 shrink-0 rounded object-cover"
            src={row.original.profileImg || "/imgs/user.jpg"}
            alt=""
          />
          <p>{row.original.fullName}</p>
        </Link>
      )
    },
    filterFn: (row, id, value) => value?.includes(row?.getValue(id)),
  },
  {
    id: "Caste",
    accessorKey: "otherDetails.caste",
    header: ({ column }) => <ColumnSorter column={column} title={t("colCaste")} />,
    filterFn: (row, id, value) => value?.includes(row?.getValue(id)),
    cell: ({ row }) => <p>{row?.original?.otherDetails?.caste || "---"}</p>,
  },
  {
    id: "Mobile",
    accessorKey: "contactDetails.mobile",
    enableSorting: false,
    header: t("colMobile"),
    cell: ({ row }) => <NumberCopy number={row?.original?.contactDetails?.mobile || ""} />,
  },
  {
    accessorKey: "email",
    header: t("colEmail"),
    cell: ({ row }) => <p className="normal-case">{row?.original?.email || "---"}</p>,
  },
  {
    id: "Plan",
    header: t("colPlan"),
    enableSorting: false,
    cell: ({ row }) => {
      const plan = row.original.currentPlan
      const isActive = plan && new Date(plan.expiryDate) > new Date()
      if (!isActive) return <p className="text-xs text-muted-foreground">{t("none")}</p>
      return <span className="text-xs font-medium">{planDetails[plan.subscribedTo].name}</span>
    },
  },
  {
    id: "actions",
    header: () => <p className="pr-2 text-right">{t("colActions")}</p>,
    enableSorting: false,
    cell: ({ row }) => <InviteAction user={row?.original} />
  }
  ]
}
