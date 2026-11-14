import { type InfiniteData, type QueryClient, useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  addLiked, getLikesList, getMatches, getUserDetails, removeLiked,
  addImages, updateProfile, getPartnerPreferences, getUnlockedProfiles,
  unlockProfile, getCurrentPlan, getHiddenList, hideProfile, unhideProfile,
} from "@/actions";
import { filterObj } from "@/utils";
import { useToast } from "@glraj/ui/toast";

function uniqueById(users: Partial<userT>[]) {
  const seen = new Set<string>()
  return users.filter(user => {
    if (!user._id || seen.has(user._id)) return false
    seen.add(user._id)
    return true
  })
}

function setLikedFlag(queryClient: QueryClient, userId: string, isLiked: boolean) {
  const mark = (user: Partial<userT>) => user._id === userId ? { ...user, isLiked } : user

  queryClient.setQueriesData<InfiniteData<Partial<userT>[]>>({ queryKey: ["user-list", "approved"] }, old => old && {
    ...old,
    pages: old.pages.map(page => page.map(mark)),
  })
  queryClient.setQueryData<Partial<userT>[]>(["unlocked-profiles"], old => old?.map(mark))
}

export function useUsersList(filters?: objT) {
  const limit = 50

  return useInfiniteQuery<Partial<userT>[], Error, Partial<userT>[]>({
    queryKey: ["user-list", "approved", filters],
    queryFn: ({ pageParam }) => getMatches({
      ...(filters && filterObj(filters)),
      limit,
      skip: (pageParam as number || 0) * limit,
      approvalStatus: "approved",
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.length === limit ? pages.length : undefined,
    select: data => uniqueById(data?.pages?.flat() ?? []),
    enabled: !!filters,
  })
}

export function useLikesList() {
  const limit = 50

  return useInfiniteQuery<Partial<userT>[], Error, Partial<userT>[]>({
    queryKey: ["likes-list"],
    queryFn: ({ pageParam }) => {
      return getLikesList({
        skip: (pageParam as number || 0) * limit,
        limit,
      })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.length === limit ? pages.length : undefined,
    select: data => uniqueById(data?.pages?.flat() ?? []),
  })
}

export function useHiddenList() {
  const limit = 50

  return useInfiniteQuery<Partial<userT>[], Error, Partial<userT>[]>({
    queryKey: ["hidden-list"],
    queryFn: ({ pageParam }) => getHiddenList({
      skip: (pageParam as number || 0) * limit,
      limit,
    }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.length === limit ? pages.length : undefined,
    select: data => uniqueById(data.pages.flat()),
  })
}

export function useUserDetails(_id: string) {
  return useQuery<Partial<userT>>({
    queryKey: ["user-details", _id],
    queryFn: () => getUserDetails(_id),
    enabled: !!_id,
  })
}

export function useUnlockedProfiles() {
  return useQuery<Partial<userT>[]>({
    queryKey: ["unlocked-profiles"],
    queryFn: getUnlockedProfiles,
  })
}

type planT = currentPlanT & { unlockedCount: number }
export function useCurrentPlan() {
  return useQuery<planT>({
    queryKey: ["current-plan"],
    queryFn: getCurrentPlan,
  })
}

export function usePartnerPreferences(_id: string) {
  return useQuery<Pick<userT, "partnerPreferences"> & { dob: string }>({
    queryKey: ["partner-preferences", _id],
    queryFn: getPartnerPreferences,
    enabled: !!_id,
  })
}

export function useUpdateProfile() {
  const t = useTranslations("user.toasts")
  const queryClient = useQueryClient()
  const navigation = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-details", variables._id] })
      navigation.refresh()
      toast.success(t("profileUpdated"))
    },
    onError: (error) => {
      toast.error(error?.message || t("profileUpdateFailed"))
    },
  })
}

export function useAddImages() {
  const t = useTranslations("user.toasts")
  const queryClient = useQueryClient()
  const navigation = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: addImages,
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user-details", variables._id] })
      navigation.refresh()
      toast.success(t("imagesUpdated"))
    },
    onError: (error) => {
      toast.error(error?.message || t("imagesUpdateFailed"))
    },
  })
}

export function useAddLiked() {
  const t = useTranslations("user.toasts")
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: addLiked,
    onMutate: ({ userId }: { userId: string }) => setLikedFlag(queryClient, userId, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes-list"] })
      toast.success(t("addedToLiked"))
    },
    onError: (error, { userId }) => {
      setLikedFlag(queryClient, userId, false)
      toast.error(error?.message || t("addToLikedFailed"))
    },
  })
}

export function useRemoveLiked() {
  const t = useTranslations("user.toasts")
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: removeLiked,
    onMutate: ({ userId }: { userId: string }) => setLikedFlag(queryClient, userId, false),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes-list"] })
      toast.success(t("removedFromLiked"))
    },
    onError: (error, { userId }) => {
      setLikedFlag(queryClient, userId, true)
      toast.error(error?.message || t("removeFromLikedFailed"))
    },
  })
}

export function useUnlockProfile() {
  const t = useTranslations("user.toasts")
  const queryClient = useQueryClient()
  const router = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: unlockProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unlocked-profiles"] })
      toast.success(t("profileUnlocked"))
      router.refresh()
    },
  })
}

export function useHideProfile() {
  const t = useTranslations("user.toasts")
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: hideProfile,
    onMutate: async ({ userId }) => {
      const queryKey = ["user-list", "approved"]
      await queryClient.cancelQueries({ queryKey })
      const previous = queryClient.getQueriesData<InfiniteData<Partial<userT>[]>>({ queryKey })

      queryClient.setQueriesData<InfiniteData<Partial<userT>[]>>({ queryKey }, old => old && {
        ...old,
        pages: old.pages.map(page => page.filter(user => user._id !== userId)),
      })

      return { previous }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hidden-list"] })
      queryClient.invalidateQueries({ queryKey: ["likes-list"] })
      queryClient.invalidateQueries({ queryKey: ["unlocked-profiles"] })
      toast.success(t("profileHidden"))
    },
    onError: (error, _variables, context) => {
      context?.previous.forEach(([key, data]) => queryClient.setQueryData(key, data))
      toast.error(error?.message || t("hideFailed"))
    },
  })
}

export function useUnhideProfile() {
  const t = useTranslations("user.toasts")
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: unhideProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hidden-list"] })
      queryClient.invalidateQueries({ queryKey: ["user-list", "approved"] })
      queryClient.invalidateQueries({ queryKey: ["likes-list"] })
      queryClient.invalidateQueries({ queryKey: ["unlocked-profiles"] })
      toast.success(t("profileUnhidden"))
    },
    onError: (error) => {
      toast.error(error?.message || t("unhideFailed"))
    },
  })
}
