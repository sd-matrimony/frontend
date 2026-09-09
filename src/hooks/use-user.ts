import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  addLiked, getLikesList, getMatches, getUserDetails, removeLiked,
  addImages, updateProfile, getPartnerPreferences, getUnlockedProfiles,
  unlockProfile, getCurrentPlan
} from "@/actions";
import { filterObj } from "@/utils";
import { useToast } from "@/components/ui/toast";

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
    select: data => data?.pages?.flat() as any,
    enabled: !!filters,
  })
}

export function useLikesList(type: "liked" | "disliked") {
  const limit = 50

  return useInfiniteQuery<Partial<userT>[], Error, Partial<userT>[]>({
    queryKey: ["likes-list", type],
    queryFn: ({ pageParam }) => {
      return getLikesList({
        skip: (pageParam as number || 0) * limit,
        limit,
        type,
      })
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => lastPage.length === limit ? pages.length : undefined,
    select: data => data?.pages?.flat() as any,
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes-list", "liked"] })
      queryClient.invalidateQueries({ queryKey: ["user-list", "approved"] })
      toast.success(t("addedToLiked"))
    },
    onError: (error) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes-list", "liked"] })
      queryClient.invalidateQueries({ queryKey: ["user-list", "approved"] })
      toast.success(t("removedFromLiked"))
    },
    onError: (error) => {
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
