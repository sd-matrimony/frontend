import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { createOrder, testCreateOrder, testVerifyPayment, verifyPayment } from "@/actions";
import { useToast } from "@/components/ui/toast";

export function useCreateOrder() {
  const toast = useToast()

  return useMutation({
    mutationFn: createOrder,
    onError: (error) => {
      toast.error(error?.message || "Failed to create order")
    },
  })
}

export function useVerifyPayment() {
  const queryClient = useQueryClient()
  const navigate = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: verifyPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-details-mini"] })
      toast.success("Payment verified successfully")
      navigate.push("/user")
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to verify payment")
    },
  })
}

export function useTestCreateOrder() {
  const toast = useToast()

  return useMutation({
    mutationFn: testCreateOrder,
    onError: (error) => {
      toast.error(error?.message || "Failed to create order")
    },
  })
}

export function useTestVerifyPayment() {
  const toast = useToast()

  return useMutation({
    mutationFn: testVerifyPayment,
    onSuccess: () => {
      toast.success("Payment verified successfully")
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to verify payment")
    },
  })
}
