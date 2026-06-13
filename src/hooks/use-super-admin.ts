"use client";

import { useMutation, useInfiniteQuery, useQueryClient, useQuery } from "@tanstack/react-query";

import { type findUserSchemaT } from "./use-user-filters";

import {
  getPaidUsers, getAssistedSubscribedUsers, getAllPayments, getUsersByCreatedBy,
  getUsersGroupedByAdminCount, getUsersGroupedCount, getAdminsList,
  createAdmin, updateAdmin, getUserInvitations, userInvited,
  getUsersGroupList, resetPassByAdmin, makePaymentForUser, bulkUpdateUsers,
  getUserCurrentPlan, removeUserPlan,
} from "@/actions";
import { useToast } from "@/components/ui/toast";

type userAndPlanT = currentPlanT & {
  user: Partial<userT>
  assistedExpire: string
}
export function useGetPaidUsers() {
  const limit = 50

  return useInfiniteQuery<userAndPlanT[], Error, userAndPlanT[]>({
    queryKey: ["paid-users"],
    queryFn: ({ pageParam }) => getPaidUsers({ skip: (pageParam as number || 0) * limit, limit }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.length === limit ? pages.length : undefined,
    select: data => data?.pages?.flat() as any,
  })
}

export function useGetAssistedSubscribedUsers() {
  const limit = 50

  return useInfiniteQuery<userAndPlanT[], Error, userAndPlanT[]>({
    queryKey: ["assisted-subscribed-users"],
    queryFn: ({ pageParam }) => getAssistedSubscribedUsers({ skip: (pageParam as number || 0) * limit, limit }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.length === limit ? pages.length : undefined,
    select: data => data?.pages?.flat() as any,
  })
}

type userAllPaymentsT = {
  _id: string
  user: Partial<userT>
  payments: currentPlanT[]
}
export function useGetAllPayments() {
  const limit = 50

  return useInfiniteQuery<userAllPaymentsT[], Error, userAllPaymentsT[]>({
    queryKey: ["all-payments"],
    queryFn: ({ pageParam }) => getAllPayments({ skip: (pageParam as number || 0) * limit, limit }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.length === limit ? pages.length : undefined,
    select: data => data?.pages?.flat() as any,
  })
}

type createdByProps = {
  createdBy?: string
  createdAtToday?: boolean
}
export function useGetUsersByCreatedBy(data: createdByProps) {
  const limit = 50

  return useInfiniteQuery<Partial<userT>[], Error, Partial<userT>[]>({
    queryKey: ["users-by-created-by", data],
    queryFn: ({ pageParam }) => getUsersByCreatedBy({ skip: (pageParam as number || 0) * limit, limit, ...data }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.length === limit ? pages.length : undefined,
    select: data => data?.pages?.flat() as any,
  })
}

type ucspaT = adminT & {
  data: Record<string, number>
}
type ucspaParamsT = { type?: "date" | "caste"; includeByAdmin?: boolean; gender?: string }
export function useGetUsersGroupedByAdminCount(params: ucspaParamsT = {}) {
  return useQuery<ucspaT[], Error, ucspaT[]>({
    queryKey: ["users-grouped-by-admin", params],
    queryFn: () => getUsersGroupedByAdminCount(params),
  })
}

type uctT = adminT & {
  created: number
}
export function useGetUsersGroupedCount(params: any = {}) {
  return useQuery<uctT[], Error, uctT[]>({
    queryKey: ["users-grouped-count", params],
    queryFn: () => getUsersGroupedCount(params),
  })
}

type uglT = Pick<userT, "_id" | "fullName" | "maritalStatus" | "profileImg" | "isBlocked" | "isDeleted">
export function useGetUsersGroupList(params: any = {}) {
  const limit = 50

  return useInfiniteQuery<uglT[], Error, uglT[]>({
    queryKey: ["users-group-list", params],
    queryFn: ({ pageParam }) => getUsersGroupList({ skip: (pageParam as number || 0) * limit, limit, ...params }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.length === limit ? pages.length : undefined,
    select: data => data?.pages?.flat() as any,
  })
}

export function useGetAdmins() {
  return useQuery<adminT[], Error, adminT[]>({
    queryKey: ["admins"],
    queryFn: getAdminsList,
  })
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (data: any) => data._id ? updateAdmin(data) : createAdmin(data),
    onSuccess(_, variables) {
      toast.success(`Admin ${variables._id ? "updated" : "created"} successfully`)
      queryClient.invalidateQueries({ queryKey: ["admins"] })
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong!!!")
    }
  })
}

export type niuT = Pick<userT, "_id" | "email" | "contactDetails" | "dob" | "profileImg" | "fullName" | "otherDetails"> & {
  currentPlan?: currentPlanT
}
export function useGetUserInvitations(data: findUserSchemaT) {
  const limit = 50

  return useInfiniteQuery<niuT[], Error, niuT[]>({
    queryKey: ["user-invitations", data],
    queryFn: ({ pageParam }) => getUserInvitations({ skip: (pageParam as number || 0) * limit, limit, ...data }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.length === limit ? pages.length : undefined,
    select: data => data?.pages?.flat() as any,
  })
}

export function useRemoveUserPlan() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: removeUserPlan,
    onSuccess() {
      toast.success("Subscription removed successfully")
      queryClient.invalidateQueries({ queryKey: ["user-invitations"] })
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong!!!")
    }
  })
}

export function useUserInvite() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: userInvited,
    onSuccess() {
      toast.success("User invited successfully")
      queryClient.invalidateQueries({ queryKey: ["user-invitations"] })
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong!!!")
    }
  })
}

export function useResetPassByAdmin() {
  const toast = useToast()

  return useMutation({
    mutationFn: resetPassByAdmin,
    onSuccess() {
      toast.success("Password reset successfully")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong!!!")
    }
  })
}

export function useGetUserCurrentPlan(id: string, enabled: boolean) {
  return useQuery<currentPlanT | null>({
    queryKey: ["user-current-plan", id],
    queryFn: () => getUserCurrentPlan(id),
    enabled: !!id && enabled,
  })
}

export function useMakePaymentForUser() {
  const toast = useToast()

  return useMutation({
    mutationFn: makePaymentForUser,
    onSuccess() {
      toast.success("Payment added successfully")
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong!!!")
    }
  })
}

export function useBulkUpdateUsers() {
  const toast = useToast()

  return useMutation({
    mutationFn: bulkUpdateUsers,
    onSuccess(_, variables) {
      toast.success(`${variables.length} user(s) updated successfully`)
    },
    onError(error) {
      toast.error(error?.message || "Something went wrong!!!")
    }
  })
}
