import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Edit from "./edit";

type props = {
  user: userT & { hasFullAccess?: boolean }
  canEdit: boolean
}

async function PartnerPreferences({ user, canEdit }: props) {
  const t = await getTranslations("shared.userProfile.partner")

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
            <span className="text-sm text-muted-foreground">{t("ageRange")}</span>
            <p className="font-medium">
              {t("min")}: {user?.partnerPreferences?.minAge || "---"} | {t("max")}: {user?.partnerPreferences?.maxAge || "---"}
            </p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("religion")}</span>
            <p className="font-medium">{user?.partnerPreferences?.religion || "---"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("caste")}</span>
            <p className="font-medium">{user?.partnerPreferences?.caste || "---"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("subCaste")}</span>
            <p className="font-medium">{user?.partnerPreferences?.subCaste || "---"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("maritalStatus")}</span>
            <p className="font-medium">{user?.partnerPreferences?.maritalStatus || "---"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("minQualification")}</span>
            <p className="font-medium">{user?.partnerPreferences?.minQualification || "---"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("sector")}</span>
            <p className="font-medium">{user?.partnerPreferences?.sector || "---"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("profession")}</span>
            <p className="font-medium">{user?.partnerPreferences?.profession || "---"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("minSalary")}</span>
            <p className="font-medium">{user?.partnerPreferences?.minSalary ? t("perMonth", { amount: `₹${user?.partnerPreferences?.minSalary}` }) : "---"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("motherTongue")}</span>
            <p className="font-medium">{user?.partnerPreferences?.motherTongue || "---"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("location")}</span>
            <p className="font-medium">{user?.partnerPreferences?.location || "---"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("expectations")}</span>
            <p className="font-medium mt-1">{user?.partnerPreferences?.expectation || "---"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PartnerPreferences
