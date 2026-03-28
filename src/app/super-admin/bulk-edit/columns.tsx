"use client"

import { Pencil } from "lucide-react"
import { type ColumnDef } from "@tanstack/react-table"

import { maritalStatus, gender } from "@/utils/enums"
import type { OnBlurChange } from "./types"

import { Button } from "@/components/ui/button"

import { EditInput, EditSelect, EditCombobox } from "./editable-cell"

type Params = {
  onBlurChange: OnBlurChange
  onEditMore: (userId: string) => void
  resetKey: number
  castes: optionsT | undefined
  isCasteLoading: boolean
  casteMap: Record<string, string[]> | undefined
}

export function createColumns({ onBlurChange, onEditMore, resetKey, castes, isCasteLoading, casteMap }: Params): ColumnDef<Partial<userT>>[] {
  return [
    {
      id: "name",
      accessorKey: "fullName",
      header: "Name",
      cell: ({ row }) => (
        <div className="df gap-2 items-center min-w-52">
          <img
            src={row.original.profileImg || "/imgs/user.jpg"}
            className="size-10 shrink-0 rounded object-cover"
            alt=""
          />
          <EditInput
            userId={row.original._id!}
            path="fullName"
            initialValue={row.original.fullName}
            resetKey={resetKey}
            onBlurChange={onBlurChange}
          />
        </div>
      ),
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <p className="text-xs normal-case text-muted-foreground min-w-36 truncate">
          {row.original.email || "—"}
        </p>
      ),
    },
    {
      id: "mobile",
      accessorKey: "contactDetails.mobile",
      header: "Mobile",
      cell: ({ row }) => (
        <p className="text-xs text-muted-foreground">
          {row.original.contactDetails?.mobile || "—"}
        </p>
      ),
    },
    {
      id: "caste",
      accessorKey: "otherDetails.caste",
      header: "Caste",
      cell: ({ row }) => (
        <EditCombobox
          userId={row.original._id!}
          path="otherDetails.caste"
          initialValue={row.original.otherDetails?.caste}
          resetKey={resetKey}
          onBlurChange={onBlurChange}
          options={castes ?? []}
          isLoading={isCasteLoading}
        />
      ),
    },
    {
      id: "subCaste",
      accessorKey: "otherDetails.subCaste",
      header: "Sub Caste",
      cell: ({ row }) => {
        const caste = row.original.otherDetails?.caste ?? ""
        const subCasteOpts: optionsT = casteMap?.[caste] ?? []
        return (
          <EditCombobox
            userId={row.original._id!}
            path="otherDetails.subCaste"
            initialValue={row.original.otherDetails?.subCaste}
            resetKey={resetKey}
            onBlurChange={onBlurChange}
            options={subCasteOpts}
          />
        )
      },
    },
    {
      id: "salary",
      accessorKey: "proffessionalDetails.salary",
      header: "Salary",
      cell: ({ row }) => (
        <EditInput
          userId={row.original._id!}
          path="proffessionalDetails.salary"
          initialValue={row.original.proffessionalDetails?.salary}
          resetKey={resetKey}
          onBlurChange={onBlurChange}
          type="number"
        />
      ),
    },
    {
      id: "gender",
      accessorKey: "gender",
      header: "Gender",
      cell: ({ row }) => (
        <EditSelect
          userId={row.original._id!}
          path="gender"
          initialValue={row.original.gender}
          resetKey={resetKey}
          onBlurChange={onBlurChange}
          options={gender}
        />
      ),
    },
    {
      id: "maritalStatus",
      accessorKey: "maritalStatus",
      header: "Marital Status",
      cell: ({ row }) => (
        <EditSelect
          userId={row.original._id!}
          path="maritalStatus"
          initialValue={row.original.maritalStatus}
          resetKey={resetKey}
          onBlurChange={onBlurChange}
          options={maritalStatus}
        />
      ),
    },
    {
      id: "edit",
      header: "",
      enableHiding: false,
      cell: ({ row }) => (
        <Button
          size="icon"
          variant="ghost"
          className="size-8 shrink-0"
          onClick={() => onEditMore(row.original._id!)}
        >
          <Pencil className="size-3.5" />
        </Button>
      ),
    },
  ]
}
