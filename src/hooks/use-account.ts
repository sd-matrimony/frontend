"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  checkApprovalStatus, forgotPass, login, logout, registerImage,
  resendVerifyEmail, resetPass, signup, verifyAccount, isExists,
  updateEmail, updateMobile, updatePassword, userDetailsMini,
} from "@/actions";
import { removeToken, setToken } from "@/actions/token";
import { useToast } from "@/components/ui/toast";

export function useSignup() {
  const t = useTranslations("auth.toasts")
  const router = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: signup,
    onSuccess(_, variables) {
      toast.add({ title: t('accountCreated') })
      router.push(`/auth/${variables?.role || "user"}/signin`)
    },
    onError(error) {
      toast.add({ type: 'error', title: t('signupFailed'), description: error?.message })
    },
  })
}

export function useRegisterImage() {
  return useMutation({
    mutationFn: registerImage,
  })
}

export function useLogin() {
  const t = useTranslations("auth.toasts")
  const queryClient = useQueryClient()
  const router = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: login,
    onSuccess(res) {
      const { access_token: token, ...rest } = res
      setToken(token)
      toast.add({ title: t('loggedIn') })
      queryClient.setQueryData(["user-details-mini"], rest)
      router.replace("/" + rest?.role || "user")
    },
    onError(error) {
      toast.add({ type: 'error', title: t('loginFailed'), description: error.message })
    },
  })
}

export function useCheckApprovalStatus() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: checkApprovalStatus,
    onSuccess(res) {
      const { access_token: token, ...rest } = res
      setToken(token)
      router.replace("/")
      queryClient.setQueryData(["user-details-mini"], rest)
    },
    onError(error) {
      toast.error(error.message)
    },
  })
}

export function useIsExists() {
  return useMutation({
    mutationFn: isExists,
  })
}

export function useForgotPass() {
  const t = useTranslations("auth.toasts")
  const router = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: forgotPass,
    onSuccess(_, variables) {
      toast.add({ title: t('checkYourEmail') })
      router.replace(`/auth/${variables?.role || "user"}/reset-pass`)
    },
    onError(error) {
      toast.add({ type: 'error', title: t('resetLinkFailed'), description: error.message })
    },
  })
}

export function useResetPass() {
  const t = useTranslations("auth.toasts")
  const router = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: resetPass,
    onSuccess(_, variables) {
      toast.add({ title: t('passwordReset') })
      router.replace(`/auth/${variables?.role || "user"}/signin`)
    },
    onError(error) {
      toast.add({ type: 'error', title: t('passwordResetFailed'), description: error.message })
    },
  })
}

export function useVerifyAccount() {
  const t = useTranslations("auth.toasts")
  const queryClient = useQueryClient()
  const router = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: verifyAccount,
    onSuccess(res) {
      toast.add({ title: t('accountVerified') })
      router.replace(`/auth/${res?.role || "user"}/signin`)
      queryClient.invalidateQueries({ queryKey: ["account-info"] })
    },
    onError(error) {
      toast.add({ type: 'error', title: t('accountVerificationFailed'), description: error.message })
      router.replace("/")
    },
  })
}

export function useResendVerifyEmail() {
  const t = useTranslations("auth.toasts")
  const toast = useToast()

  return useMutation({
    mutationFn: resendVerifyEmail,
    onSuccess() {
      toast.add({ title: t('verificationEmailSent'), description: t('pleaseCheckEmail') })
    },
    onError(error) {
      toast.add({ type: 'error', title: t('verificationEmailFailed'), description: error.message })
    },
  })
}

export function useUpdatePassword() {
  const t = useTranslations("auth.toasts")
  const toast = useToast()

  return useMutation({
    mutationFn: updatePassword,
    onSuccess() {
      toast.add({ title: t('passwordUpdated') })
    },
    onError(error) {
      toast.add({ type: 'error', title: t('passwordUpdateFailed'), description: error.message })
    },
  })
}

export function useUpdateMobile() {
  const t = useTranslations("auth.toasts")
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: updateMobile,
    onSuccess() {
      toast.add({ title: t('mobileUpdated') })
      queryClient.invalidateQueries({ queryKey: ["user-details-mini"] })
    },
    onError(error) {
      toast.add({ type: 'error', title: t('mobileUpdateFailed'), description: error.message })
    },
  })
}

export function useUpdateEmail() {
  const t = useTranslations("auth.toasts")
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: updateEmail,
    onSuccess() {
      toast.add({ title: t('emailUpdated'), description: t('emailUpdateVerifyNote') })
      queryClient.invalidateQueries({ queryKey: ["user-details-mini"] })
    },
    onError(error) {
      toast.add({ type: 'error', title: t('emailUpdateFailed'), description: error.message })
    },
  })
}

export function useLogout() {
  const t = useTranslations("auth.toasts")
  const queryClient = useQueryClient()
  const router = useRouter()
  const toast = useToast()

  function onSuccess() {
    const toUser = window.location.pathname.startsWith("/user") ? "user" : "admin"
    removeToken()
    queryClient.clear()
    toast.add({ title: t('loggedOut') })
    router.replace(`/auth/${toUser}/signin`)
  }

  return useMutation({
    mutationFn: logout,
    onSettled() {
      onSuccess()
    },
  })
}

type miniT = Pick<userT, "_id" | "email" | "contactDetails" | "fullName" | "gender" | "isVerified"> & {
  currentPlan: Pick<currentPlanT, "subscribedTo" | "expiryDate">
  role: rolesT
}
export function useUserDetailsMini() {
  return useQuery<miniT>({
    queryKey: ["user-details-mini"],
    queryFn: userDetailsMini,
  })
}
