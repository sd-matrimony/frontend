"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Loader } from "lucide-react"
import { useTable } from "@tanstack/react-table"
import type {
  ColumnVisibilityState, SortingState,
} from "@tanstack/react-table"

import type { ChangeMap, OnBlurChange } from "./types"

import { useBulkUpdateUsers } from "@/hooks/use-super-admin"
import { useUserFilters } from "@/hooks/use-user-filters"
import { useUsersList } from "@/hooks/use-admin"
import { useStatics } from "@/hooks/use-general"
import { filterObj } from "@/utils"

import { DataTable, ColumnToggle, appTableFeatures } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"

import UsersFiltersRow from "@/components/common/users-filters-row"

import { ConfirmDialog } from "./confirm-dialog"
import { createColumns } from "./columns"
import { EditSheet } from "./edit-sheet"

function setNested(obj: any, keys: string[], value: any): any {
  const [key, ...rest] = keys
  return rest.length === 0
    ? { ...obj, [key]: value }
    : { ...obj, [key]: setNested(obj?.[key] ?? {}, rest, value) }
}

function deepMerge(target: any, source: any): any {
  const result = { ...target }
  for (const [k, v] of Object.entries(source ?? {})) {
    if (v !== null && v !== undefined && typeof v === "object" && !Array.isArray(v)) {
      result[k] = deepMerge(result[k] ?? {}, v)
    } else if (v !== undefined) {
      result[k] = v
    }
  }
  return result
}

function buildPayloads(changes: ChangeMap) {
  return Object.entries(changes).map(([_id, fields]) => ({ _id, ...fields }))
}

export function BulkEditTable() {
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibilityState>({
    gender: false,
    maritalStatus: false,
  })
  const [resetKey, setResetKey] = useState(0)
  const [dirtyIds, setDirtyIds] = useState<Set<string>>(new Set())
  const [sorting, setSorting] = useState<SortingState>([])

  const changesRef = useRef<ChangeMap>({})

  const [pendingChanges, setPendingChanges] = useState<ChangeMap>({})
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [editUserId, setEditUserId] = useState<string | null>(null)

  const sentinelRef = useRef<HTMLDivElement>(null)

  const { final, methods, onReset, onSubmit } = useUserFilters({
    maritalStatus: [],
    fullName: "",
    gender: [],
    caste: [],
    email: "",
    mobile: "",
  })

  const {
    data: usersList, isLoading, isFetching, hasNextPage, isFetchingNextPage,
    fetchNextPage, refetch,
  } = useUsersList(filterObj(final))

  const { data: castes, isLoading: isCasteLoading } = useStatics("castes")
  const { data: casteMap } = useStatics("casteMap")

  const { mutate: bulkUpdate, isPending } = useBulkUpdateUsers()

  const updateChange = useCallback<OnBlurChange>((userId, path, value) => {
    changesRef.current = {
      ...changesRef.current,
      [userId]: setNested(changesRef.current[userId] ?? {}, path.split("."), value),
    }
    setDirtyIds(prev => {
      if (prev.has(userId)) return prev
      const next = new Set(prev)
      next.add(userId)
      return next
    })
  }, [])

  const columns = useMemo(
    () => createColumns({
      onBlurChange: updateChange,
      onEditMore: setEditUserId,
      resetKey,
      castes,
      isCasteLoading,
      casteMap,
      changesRef,
    }),
    [updateChange, resetKey, castes, isCasteLoading, casteMap],
  )

  const users = useMemo(() => usersList ?? [], [usersList])

  const table = useTable({
    features: appTableFeatures,
    data: users,
    columns,
    state: { sorting, columnVisibility },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
  })

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasNextPage || isFetchingNextPage) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) fetchNextPage() },
      { threshold: 0 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  function handleOpenConfirm() {
    setPendingChanges({ ...changesRef.current })
    setConfirmOpen(true)
  }

  function handleConfirmedSave() {
    bulkUpdate(buildPayloads(pendingChanges) as userT[], {
      onSuccess: () => {
        changesRef.current = {}
        setDirtyIds(new Set())
        setResetKey(k => k + 1)
        setConfirmOpen(false)
        setPendingChanges({})
        onReset()
      },
    })
  }

  function handleSheetApply(changes: Partial<userT>) {
    if (!editUserId || Object.keys(changes).length === 0) return
    changesRef.current = {
      ...changesRef.current,
      [editUserId]: deepMerge(changesRef.current[editUserId] ?? {}, changes),
    }
    setDirtyIds(prev => {
      const next = new Set(prev)
      next.add(editUserId)
      return next
    })
  }

  function handleReset() {
    onReset()
    changesRef.current = {}
    setDirtyIds(new Set())
    setResetKey(k => k + 1)
  }

  const changedCount = dirtyIds.size

  return (
    <>
      <div className="dfc h-[calc(100vh-5.5rem)] sm:h-[calc(100vh-7.5rem)]">
        <UsersFiltersRow
          methods={methods}
          needReset={!!final && Object.keys(final).length > 0}
          isLoading={isLoading || isFetching}
          onSubmit={onSubmit}
          onReset={handleReset}
          onRefresh={refetch}
        >
          <ColumnToggle table={table} />

          {changedCount > 0 && (
            <Button
              className="bg-pink-600 hover:bg-pink-500"
              onClick={handleOpenConfirm}
              disabled={isPending}
            >
              Save {changedCount} change{changedCount > 1 ? "s" : ""}
            </Button>
          )}
        </UsersFiltersRow>

        {isLoading ? (
          <div className="dc flex-1">
            <Loader className="animate-spin" />
          </div>
        ) : (
          <div className="scroll-y sm:pr-4 sm:-mr-4">
            <DataTable
              table={table}
              className="[&_td]:py-2 [&_th]:min-w-36"
            />
            <div ref={sentinelRef} className="h-8 dc">
              {isFetchingNextPage && <Loader className="animate-spin size-4" />}
            </div>
          </div>
        )}
      </div>

      {editUserId && (
        <EditSheet
          _id={editUserId}
          open={!!editUserId}
          onOpenChange={open => { if (!open) setEditUserId(null) }}
          onApply={handleSheetApply}
        />
      )}

      {
        confirmOpen &&
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          changes={pendingChanges}
          users={users!}
          isPending={isPending}
          onConfirm={handleConfirmedSave}
        />
      }
    </>
  )
}
