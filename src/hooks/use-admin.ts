"use client";

import { useMutation, useInfiniteQuery, useQueryClient, useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { type findUserSchemaT } from "./use-user-filters";

import {
  createUsers, extractImg, findUser, getMarriedUsers, getUsersList, getUsersCount,
  updateUserDetails, userMarriedTo,
} from "@/actions";
import { useToast } from "@/components/ui/toast";

export function useUsersList(data: findUserSchemaT) {
  const limit = 50
  const enabled = !!data && Object.keys(data).length > 0 && Object.values(data).some(v => v && (Array.isArray(v) ? v.length > 0 : true))

  return useInfiniteQuery<Partial<userT>[], Error, Partial<userT>[]>({
    queryKey: ["user-list", data],
    queryFn: ({ pageParam }) => {
      return getUsersList({
        skip: (pageParam as number || 0) * limit,
        limit,
        ...data,
      })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.length === limit ? pages.length : undefined,
    select: data => data?.pages?.flat() as any,
    enabled,
  })
}

export function useUsersCount(data: findUserSchemaT, enabled = true) {
  return useQuery<{ count: number }, Error>({
    queryKey: ["user-list-count", data],
    queryFn: () => getUsersCount(data),
    enabled,
  })
}

type marriedUserT = { male: Partial<userT>, female: Partial<userT> }
export function useMarriedUsers() {
  const limit = 50

  return useInfiniteQuery<marriedUserT[], Error, marriedUserT[]>({
    queryKey: ["married-users"],
    queryFn: ({ pageParam }) => {
      return getMarriedUsers({
        skip: (pageParam as number || 0) * limit,
        limit,
      })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.length === limit ? pages.length : undefined,
    select: data => data?.pages?.flat() as any,
  })
}

export function useFindUser(params: any) {
  return useQuery<Partial<userT>[]>({
    queryKey: ["find-user", params],
    queryFn: () => findUser(params),
    enabled: !!params && Object.keys(params).length > 0,
  })
}

export function useCreateUsersMutate() {
  const t = useTranslations("admin.toasts")
  const tCommon = useTranslations("common.toasts")
  const toast = useToast()

  return useMutation({
    mutationFn: createUsers,
    onSuccess() {
      toast.success(t("usersCreated"))
    },
    onError(error) {
      toast.error(error?.message || tCommon("somethingWentWrong"))
    }
  })
}

export function useUserMarriedToMutate() {
  const t = useTranslations("admin.toasts")
  const tCommon = useTranslations("common.toasts")
  const toast = useToast()

  return useMutation({
    mutationFn: userMarriedTo,
    onSuccess() {
      toast.success(t("marriageUpdated"))
    },
    onError(error) {
      toast.error(error?.message || tCommon("somethingWentWrong"))
    }
  })
}

export function useUpdateUserMutate() {
  const t = useTranslations("admin.toasts")
  const tCommon = useTranslations("common.toasts")
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: updateUserDetails,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["user-list"] })
      toast.success(t("applicantUpdated"))
    },
    onError(error) {
      toast.error(error?.message || tCommon("somethingWentWrong"))
    }
  })
}

export function useExtractImgMutate() {
  const t = useTranslations("admin.toasts")
  const tCommon = useTranslations("common.toasts")
  const toast = useToast()

  return useMutation({
    mutationFn: extractImg,
    onSuccess() {
      toast.success(t("imagesExtracted"))
    },
    onError(error) {
      toast.error(error?.message || tCommon("somethingWentWrong"))
    }
  })
}
