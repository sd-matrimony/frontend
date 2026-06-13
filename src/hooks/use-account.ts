"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import {
  checkApprovalStatus, forgotPass, login, logout, registerImage,
  resendVerifyEmail, resetPass, signup, verifyAccount, isExists,
  updateEmail, updateMobile, updatePassword, userDetailsMini,
} from "@/actions";
import { removeToken, setToken } from "@/actions/token";
import { useToast } from "@/components/ui/toast";

export function useSignup() {
  const router = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: signup,
    onSuccess(_, variables) {
      toast.add({ title: 'Account created successfully' })
      router.push(`/auth/${variables?.role || "user"}/signin`)
    },
    onError(error) {
      toast.add({ type: 'error', title: 'Signup failed', description: error?.message })
    },
  })
}

export function useRegisterImage() {
  return useMutation({
    mutationFn: registerImage,
  })
}

export function useLogin() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: login,
    onSuccess(res) {
      const { access_token: token, ...rest } = res
      setToken(token)
      toast.add({ title: 'Logged in successfully' })
      queryClient.setQueryData(["user-details-mini"], rest)
      router.replace("/" + rest?.role || "user")
    },
    onError(error) {
      toast.add({ type: 'error', title: 'Login failed', description: error.message })
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
  const router = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: forgotPass,
    onSuccess(_, variables) {
      toast.add({ title: 'Check your email' })
      router.replace(`/auth/${variables?.role || "user"}/reset-pass`)
    },
    onError(error) {
      toast.add({ type: 'error', title: 'Failed to send password reset link', description: error.message })
    },
  })
}

export function useResetPass() {
  const router = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: resetPass,
    onSuccess(_, variables) {
      toast.add({ title: 'Password reset successfully' })
      router.replace(`/auth/${variables?.role || "user"}/signin`)
    },
    onError(error) {
      toast.add({ type: 'error', title: 'Password reset failed', description: error.message })
    },
  })
}

export function useVerifyAccount() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: verifyAccount,
    onSuccess(res) {
      toast.add({ title: 'Account verified successfully' })
      router.replace(`/auth/${res?.role || "user"}/signin`)
      queryClient.invalidateQueries({ queryKey: ["account-info"] })
    },
    onError(error) {
      toast.add({ type: 'error', title: 'Account verification failed', description: error.message })
      router.replace("/")
    },
  })
}

export function useResendVerifyEmail() {
  const toast = useToast()

  return useMutation({
    mutationFn: resendVerifyEmail,
    onSuccess() {
      toast.add({ title: 'Verification email sent successfully', description: "Please check your email" })
    },
    onError(error) {
      toast.add({ type: 'error', title: 'Failed to send verification email', description: error.message })
    },
  })
}

export function useUpdatePassword() {
  const toast = useToast()

  return useMutation({
    mutationFn: updatePassword,
    onSuccess() {
      toast.add({ title: 'Password updated successfully' })
    },
    onError(error) {
      toast.add({ type: 'error', title: 'Failed to update password', description: error.message })
    },
  })
}

export function useUpdateMobile() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: updateMobile,
    onSuccess() {
      toast.add({ title: 'Mobile number updated successfully' })
      queryClient.invalidateQueries({ queryKey: ["user-details-mini"] })
    },
    onError(error) {
      toast.add({ type: 'error', title: 'Failed to update mobile number', description: error.message })
    },
  })
}

export function useUpdateEmail() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: updateEmail,
    onSuccess() {
      toast.add({ title: 'Email updated successfully', description: "Please check your email to verify this email" })
      queryClient.invalidateQueries({ queryKey: ["user-details-mini"] })
    },
    onError(error) {
      toast.add({ type: 'error', title: 'Failed to update email', description: error.message })
    },
  })
}

export function useLogout() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const toast = useToast()

  function onSuccess() {
    const toUser = window.location.pathname.startsWith("/user") ? "user" : "admin"
    removeToken()
    queryClient.clear()
    toast.add({ title: 'Logged out successfully' })
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
