import { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader } from "lucide-react";

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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type props = {
  disabled: boolean
  isPending: boolean
  description: string
  onConfirm: () => void
}

function ConfirmUpdate({ disabled, description, isPending, onConfirm }: props) {
  const [open, setOpen] = useState(false)
  const t = useTranslations("user.confirmUpdate")
  const tCommon = useTranslations("common")

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger render={<Button size="sm" variant="secondary" className="px-4 text-xs absolute top-px right-0.5 border" disabled={disabled} />}>
        {isPending && <Loader className="size-4 animate-spin" />}
        {t("trigger")}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>{tCommon("cancel")}</AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
          >
            {t("continue")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ConfirmUpdate
