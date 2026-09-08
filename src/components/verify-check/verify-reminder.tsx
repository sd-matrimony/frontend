import { useTranslations } from "next-intl";

import { useResendVerifyEmail } from "@/hooks/use-account";
import useUIStore from "@/store/ui";

import { DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type props = {
  email: string
  onSuccess: () => void
}

function VerifyReminder({ email, onSuccess }: props) {
  const t = useTranslations("shared.userProfile.verifyReminder")
  const update = useUIStore(s => s.update)

  const { mutate, isPending } = useResendVerifyEmail()

  return (
    <>
      <DialogHeader>
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription>
          {t.rich("desc", { email, b: (chunks) => <span className="font-medium">{chunks}</span> })}
        </DialogDescription>
      </DialogHeader>

      <DialogFooter className="flex-row flex-wrap">
        <Button
          size="sm"
          variant="outline"
          className="max-[450px]:flex-1 mr-auto"
          disabled={isPending}
          onClick={() => update({ remindVerification: false })}
        >
          {t("doNotShowAgain")}
        </Button>

        <DialogClose render={<Button size="sm" variant="outline" disabled={isPending} className="max-[450px]:flex-1" />}>
          {t("verifyLater")}
        </DialogClose>

        <Button
          size="sm"
          disabled={isPending}
          onClick={() => mutate({ email }, { onSuccess })}
          className="max-[450px]:flex-1"
        >
          {t("verifyNow")}
        </Button>
      </DialogFooter>
    </>
  )
}

export default VerifyReminder
