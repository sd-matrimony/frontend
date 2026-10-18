"use client";

import { useHiddenList } from "@/hooks/use-user";

import List from "../list";

function Page() {
  const { data: users, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useHiddenList()

  return (
    <List
      type="hidden"
      users={users || []}
      isLoading={isLoading}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      fetchNextPage={fetchNextPage}
    />
  )
}

export default Page
