"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { useUserDetailsMini } from "@/hooks/use-account";
import { useUnlockProfile } from "@/hooks/use-user";
import { useToast } from "@/components/ui/toast";

function useUnlock() {
  const t = useTranslations("shared.userProfile.unlock")
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
            title: error?.message || t("failedToUnlock"),
            position: "top-center",
            description: t("proceedToPayment"),
            timeout: 6000,
            actionProps: {
              children: t("payNow"),
              onClick: () => router.push("/user/payment"),
            },
          })
        },
      })

    } else {
      toast.add({
        title: t("unlockMoreDetails"),
        position: "top-center",
        description: t("paymentRequired"),
        timeout: 6000,
        actionProps: {
          children: t("payNow"),
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
