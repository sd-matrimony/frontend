import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Edit from "./edit";
import Dob from "./dob";

type props = {
  user: userT & { hasFullAccess?: boolean }
  canEdit: boolean
}

async function PersonalDetails({ user, canEdit }: props) {
  const t = await getTranslations("shared.userProfile.personal")

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
        <div className="grid min-[400px]:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">{t("fullName")}</span>
            <p className="font-medium">{user?.fullName}{user?.hasDisability ? t("hasDisabilitySuffix") : ""}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("gender")}</span>
            <p className="font-medium">{user?.gender}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("dob")}</span>
            {user?.dob && <Dob user={user} />}
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("maritalStatus")}</span>
            <p className="font-medium">{user?.maritalStatus || "---"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default PersonalDetails
