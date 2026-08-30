"use client";

import { useMemo, useState } from "react";
import { Loader } from "lucide-react";
import { useTable } from "@tanstack/react-table";
import type {
  SortingState,
  ColumnVisibilityState,
} from "@tanstack/react-table";

import { useUserFilters, type findUserSchemaT } from "@/hooks/use-user-filters";
import { useUsersList } from '@/hooks/use-admin';
import { cn } from "@/lib/utils";

import { ColumnToggle, DataTableVirtualized, appTableFeatures } from "@/components/ui/data-table";
import { columns } from "./columns";

import UsersFiltersRow from "@/components/common/users-filters-row";

function Users({ role = "admin", loaderHt = "h-[calc(100vh-4rem)] sm:h-[calc(100vh-4.5rem)]", statusSelect, ...props }: findUserSchemaT & { role?: rolesT, loaderHt?: string, statusSelect?: React.ReactNode }) {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({ email: false, maritalStatus: false })
  const [sorting, setSorting] = useState<SortingState>([])

  const { final, methods, onReset, onSubmit } = useUserFilters({
    maritalStatus: [],
    fullName: "",
    gender: [],
    caste: [],
    subCaste: [],
    email: "",
    mobile: "",
  })

  const {
    data: users, isLoading, isFetching, hasNextPage, isFetchingNextPage,
    fetchNextPage, refetch
  } = useUsersList({ ...props, ...final })

  const currentTab: any = props.approvalStatus || (props.isBlocked ? "blocked" : "deleted")

  const tableColumns = useMemo(() => columns(currentTab, role), [currentTab, role])

  const table = useTable({
    features: appTableFeatures,
    data: users as any || [],
    columns: tableColumns,
    state: {
      sorting,
      columnVisibility,
    },
    manualPagination: true,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
  })

  return (
    <div className={cn("dfc", loaderHt)}>
      <UsersFiltersRow
        methods={methods}
        needReset={!!final && Object.keys(final)?.length > 0}
        isLoading={isLoading || isFetching}
        onSubmit={onSubmit}
        onReset={onReset}
        onRefresh={refetch}
        moreChildren={statusSelect}
      >
        <ColumnToggle table={table} />
      </UsersFiltersRow>

      {
        isLoading ?
          <div className="dc scroll-y">
            <Loader className="animate-spin" />
          </div>
          :
          <DataTableVirtualized
            table={table}
            className="scroll-y sm:-mr-4 [&_th:nth-child(-n+4)]:min-w-60"
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
            pinLeft={["fullName"]}
            pinRight={["action"]}
          />
      }
    </div>
  )
}

export default Users
