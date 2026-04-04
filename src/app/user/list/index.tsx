"use client";

import { useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { Loader } from "lucide-react";

import { useAddLiked, useRemoveLiked } from "@/hooks/use-user";
import useUIStore from "@/store/ui";

import UserCard from "./user-card";

type prrops = {
  type: "liked" | "disliked" | "full"
  users: Partial<userT>[],
  isLoading: boolean,
  isFetchingNextPage: boolean,
  hasNextPage: boolean,
  fetchNextPage: () => void
}

function List({ type, users, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage }: prrops) {
  const updateModal = useUIStore(s => s.update)

  const { mutate: unlikeMutate } = useRemoveLiked()
  const { mutate: likeMutate } = useAddLiked()

  const parentRef = useRef<HTMLElement>(null)

  const virtualizer = useVirtualizer({
    count: hasNextPage ? users.length + 1 : users.length,
    measureElement: el => el.getBoundingClientRect().height,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 242,
    overscan: 5,
    gap: 20,
  })

  const virtualItems = virtualizer.getVirtualItems()

  useEffect(() => {
    const [lastItem] = [...virtualItems].reverse()

    if (!lastItem) return

    if (lastItem.index >= users.length - 1 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage?.()
    }
  }, [users.length, hasNextPage, virtualItems, isFetchingNextPage, fetchNextPage])

  const onAdd = (userId: string, type: "liked" | "disliked") => {
    likeMutate({ userId, type })
  }

  const onRemove = (userId: string, type: "liked" | "disliked") => {
    unlikeMutate({ userId, type })
  }

  const onView = (_id: string) => {
    updateModal({ open: "user-details", data: { _id } })
  }

  if (isLoading) return (
    <div className='dc h-[calc(100vh-5rem)]'>
      <Loader className="animate-spin" />
    </div>
  )

  if (users.length === 0) return (
    <section className="dc px-2 sm:px-4 py-8 h-[calc(100vh-5rem)]">
      No users found
    </section>
  )

  return (
    <section
      ref={parentRef}
      className="px-2 sm:px-4 py-8 h-[calc(100vh-5rem)] overflow-y-auto"
    >
      <div style={{ height: `${virtualizer.getTotalSize()}px` }} className="relative max-w-2xl mx-auto">
        {
          virtualItems?.map((vItem) => {
            const isLoaderRow = vItem.index > users.length - 1
            const user = users[vItem.index]

            if (!user) {
              if (isLoaderRow && hasNextPage) {
                return (
                  <div
                    key="loader"
                    ref={virtualizer.measureElement}
                    data-index={vItem.index}
                    style={{ transform: `translateY(${vItem.start}px)` }}
                    className="w-full absolute top-0 left-0"
                  >
                    <div className="dc h-60">
                      <Loader className="animate-spin" />
                    </div>
                  </div>
                )
              }
              return null
            }

            return (
              <div
                key={vItem.key}
                ref={virtualizer.measureElement}
                data-index={vItem.index}
                style={{ transform: `translateY(${vItem.start}px)` }}
                className="w-full absolute top-0 left-0"
              >
                <UserCard
                  {...user}
                  type={type}
                  onAdd={onAdd}
                  onRemove={onRemove}
                  onView={() => onView(user?._id as string)}
                />
              </div>
            )
          })
        }
      </div>
    </section>
  )
}

export default List
