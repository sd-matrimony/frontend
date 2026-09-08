"use client";

import { useTranslations } from "next-intl";

import { nakshatraMap, raasiMap } from "@/utils";
import useUnlock from "../contact-details/use-unlock";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import VerdicPic from "./verdic-pic";
import Edit from "./edit";

type props = {
  user: userT & { hasFullAccess?: boolean }
  canEdit: boolean
}

function getValue(val: string, map: Record<string, string>) {
  return val ? val + (map[val] ? ` (${map[val]})` : "") : "---"
}

function HoroscopeDetails({ user, canEdit }: props) {
  const t = useTranslations("shared.userProfile.horoscope")
  const { isPending, unlockBtnClk } = useUnlock()
  const isUnlocked = !!user?.hasFullAccess

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{t("cardTitle")}</CardTitle>
          <CardDescription>{t("cardDesc")}</CardDescription>
        </div>

        {
          canEdit &&
          <Edit user={user} />
        }
      </CardHeader>

      <CardContent>
        <div className="grid min-[400px]:grid-cols-2 gap-4 mb-6">
          <div>
            <span className="text-sm text-muted-foreground">{t("rasi")}</span>
            <p className="font-medium">{getValue(user?.vedicHoroscope?.rasi, raasiMap)}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("nakshatra")}</span>
            <p className="font-medium">{getValue(user?.vedicHoroscope?.nakshatra, nakshatraMap)}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("lagna")}</span>
            <p className="font-medium">{getValue(user?.vedicHoroscope?.lagna, raasiMap)}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("dashaPeriod")}</span>
            <p className="font-medium">{user?.vedicHoroscope?.dashaPeriod || "---"}</p>
          </div>
          {/* <div>
            <span className="text-sm text-muted-foreground">Dosham</span>
            <p className="font-medium">{user?.vedicHoroscope?.dosham || "---"}</p>
          </div> */}
        </div>

        <div>
          <span className="text-sm text-muted-foreground">{t("picLabel")}</span>
          <VerdicPic
            user={user}
            isPending={isPending}
            isUnlocked={isUnlocked}
            unlockBtnClk={unlockBtnClk}
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default HoroscopeDetails
