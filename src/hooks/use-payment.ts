import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { createOrder, testCreateOrder, testVerifyPayment, verifyPayment } from "@/actions";
import { useToast } from "@/components/ui/toast";

export function useCreateOrder() {
  const t = useTranslations("common.toasts")
  const toast = useToast()

  return useMutation({
    mutationFn: createOrder,
    onError: (error) => {
      toast.error(error?.message || t("failedToCreateOrder"))
    },
  })
}

export function useVerifyPayment() {
  const t = useTranslations("common.toasts")
  const queryClient = useQueryClient()
  const navigate = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-details-mini"] })
      toast.success(t("paymentVerified"))
      navigate.push("/user")
    },
    onError: (error) => {
      toast.error(error?.message || t("failedToVerifyPayment"))
    },
  })
}

export function useTestCreateOrder() {
  const t = useTranslations("common.toasts")
  const toast = useToast()

  return useMutation({
    mutationFn: testCreateOrder,
    onError: (error) => {
      toast.error(error?.message || t("failedToCreateOrder"))
    },
  })
}

export function useTestVerifyPayment() {
  const t = useTranslations("common.toasts")
  const toast = useToast()

  return useMutation({
    mutationFn: testVerifyPayment,
    onSuccess: () => {
      toast.success(t("paymentVerified"))
    },
    onError: (error) => {
      toast.error(error?.message || t("failedToVerifyPayment"))
    },
  })
}
