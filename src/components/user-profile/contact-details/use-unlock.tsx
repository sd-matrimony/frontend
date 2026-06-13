"use client";

import { useRouter } from "next/navigation";

import { useUserDetailsMini } from "@/hooks/use-account";
import { useUnlockProfile } from "@/hooks/use-user";
import { useToast } from "@/components/ui/toast";

function useUnlock() {
  const { data: user } = useUserDetailsMini()
  const toast = useToast()

  const { mutate, isPending } = useUnlockProfile()
  const router = useRouter()

  function unlockBtnClk(_id: string) {
    const currentPlan = user?.currentPlan
    if (currentPlan && new Date(currentPlan?.expiryDate).getTime() > new Date().getTime()) {
      mutate({ _id }, {
        onError: (error) => {
          toast.add({
            type: 'error',
            title: error?.message || "Failed to unlock profile",
            position: "top-center",
            description: "Proceed to payment?",
            timeout: 6000,
            actionProps: {
              children: "Pay Now",
              onClick: () => router.push("/user/payment"),
            },
          })
        },
      })

    } else {
      toast.add({
        title: "Unlock More Details",
        position: "top-center",
        description: "Payment required to view more information. Proceed to payment?",
        timeout: 6000,
        actionProps: {
          children: "Pay Now",
          onClick: () => router.push("/user/payment"),
        },
      })
    }
  }

  return {
    isPending,
    unlockBtnClk,
  }
}

export default useUnlock
