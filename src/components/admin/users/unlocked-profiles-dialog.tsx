"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { Info } from "lucide-react";
import Link from "next/link";

import { useGetUserUnlockedProfiles } from "@/hooks/use-super-admin";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { planDetails } from "@/components/common/plan-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type props = {
  _id: string
  fullName: string
}

function UnlockedProfilesDialog({ _id, fullName }: props) {
  const t = useTranslations("shared.adminUsersTable.unlocked")
  const [open, setOpen] = useState(false)

  const { data, isLoading } = useGetUserUnlockedProfiles(_id, open)

  const plan = data?.plan
  const limit = plan?.noOfProfilesCanView === 999 ? t("unlimited") : plan?.noOfProfilesCanView ?? 0

  return (
    <>
      <TooltipWrapper
        content={t("tooltip")}
        triggerProps={{
          render: (
            <Button
              size="icon"
              variant="ghost"
              aria-label={t("tooltip")}
              className="size-5 text-muted-foreground hover:text-foreground"
              onClick={() => setOpen(true)}
            >
              <Info className="size-3.5" />
            </Button>
          )
        }}
      />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("title", { name: fullName })}</DialogTitle>
            <DialogDescription render={<div />}>
              {
                isLoading ? <Skeleton className="h-4 w-48" /> :
                  plan
                    ? <>
                      <span className="font-medium text-foreground">{t("used", { used: data?.used ?? 0, limit })}</span>
                      <br />
                      {t("planExpires", { plan: planDetails[plan.subscribedTo].name, date: format(new Date(plan.expiryDate), "dd-MM-yy") })}
                    </>
                    : t("noPlan")
              }
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto -mx-1 px-1">
            {
              isLoading &&
              <Skeleton className="h-40" />
            }

            {
              !isLoading && plan && !data?.profiles?.length &&
              <p className="py-8 text-center text-sm text-muted-foreground">{t("empty")}</p>
            }

            {
              !isLoading && data?.profiles?.map(profile => (
                <Link
                  key={profile._id}
                  target="_blank"
                  href={`/super-admin/user/${profile._id}`}
                  className="df group px-2 py-2 rounded-md odd:bg-muted/60"
                >
                  <img
                    className="size-10 shrink-0 rounded object-cover"
                    src={profile.profileImg || "/imgs/user.jpg"}
                    alt=""
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm group-hover:text-pink-400 truncate">{profile.fullName}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {[profile.otherDetails?.caste, profile.contactDetails?.mobile].filter(Boolean).join(" - ")}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground shrink-0">
                    {t("unlockedOn", { date: format(new Date(profile.unlockedAt), "dd-MM-yy") })}
                  </p>
                </Link>
              ))
            }
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default UnlockedProfilesDialog
