"use client";

import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";

import { useCheckApprovalStatus } from "@/hooks/use-account";

import { Button } from "@glraj/ui/button";

function Refresh() {
  const { mutate, isPending } = useCheckApprovalStatus()
  const t = useTranslations("public.refresh");

  return (
    <Button
      size="sm"
      variant="secondary"
      onClick={() => mutate()}
      disabled={isPending}
    >
      {isPending && <Loader className="animate-spin" />}
      {t("label")}
    </Button>
  )
}

export default Refresh
