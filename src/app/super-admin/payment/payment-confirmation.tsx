import { useState } from "react"
import { useTranslations } from "next-intl"
import { Loader } from "lucide-react"

import { planDetails, planPrices } from "@/components/common/plan-badge"
import { useGetUserCurrentPlan, useMakePaymentForUser } from "@/hooks/use-super-admin"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type props = {
  _id: string
  isAssisted: boolean
  subscribedTo: subscribedToT
  assistedMonths: number
  noOfProfilesCanView: number
  finalAmount: number
  onSuccess: () => void
}

function PaymentConfirmation({ _id, isAssisted, subscribedTo, assistedMonths, noOfProfilesCanView, finalAmount, onSuccess }: props) {
  const t = useTranslations("superAdmin.payment")
  const [open, setOpen] = useState(false)

  const { data: currentPlan, isLoading } = useGetUserCurrentPlan(_id, open)
  const { mutate, isPending } = useMakePaymentForUser()

  function handlePayment() {
    mutate(
      { _id, isAssisted, subscribedTo, assistedMonths, noOfProfilesCanView, amount: finalAmount },
      {
        onSuccess() {
          setOpen(false)
          onSuccess()
        },
      }
    )
  }

  const isAlreadySubscribed = currentPlan && new Date(currentPlan.expiryDate) > new Date()

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button size="lg" className="w-full bg-pink-600 hover:bg-pink-700" disabled={!_id} />}>
        {t("proceed")}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
          <AlertDialogDescription>{t("actionCannotBeUndone")}</AlertDialogDescription>
        </AlertDialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-2">
            <Loader className="animate-spin size-4 text-muted-foreground" />
          </div>
        )}

        {isAlreadySubscribed && (
          <Card className="py-0 border-red-300">
            <CardContent className="py-2 px-4 space-y-1">
              <p className="text-sm font-semibold">{t("alreadySubscribed")}</p>
              <p className="text-sm font-medium">
                {planDetails[currentPlan.subscribedTo].name} — ₹{planPrices[currentPlan.subscribedTo].toLocaleString()}
              </p>
              <p className="text-xs">
                {t("expires", { date: new Date(currentPlan.expiryDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) })}
              </p>
              <p className="text-xs pt-1">{t("overrideWarning")}</p>
            </CardContent>
          </Card>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>{t("cancel")}</AlertDialogCancel>

          <AlertDialogAction render={<Button onClick={handlePayment} disabled={isPending || isLoading} />}>
            {isPending && <Loader className="animate-spin" />}
            {t("proceedToPayment", { amount: finalAmount.toLocaleString() })}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default PaymentConfirmation
