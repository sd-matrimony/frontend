import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TranslatedValue } from "@/components/common/translated-value";
import Edit from "./edit";

type props = {
  user: userT & { hasFullAccess?: boolean }
  canEdit: boolean
}

async function OtherDetails({ user, canEdit }: props) {
  const t = await getTranslations("shared.userProfile.other")

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
            <span className="text-sm text-muted-foreground">{t("motherTongue")}</span>
            <p className="font-medium"><TranslatedValue value={user?.otherDetails?.motherTongue} listName="languages" /></p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("religion")}</span>
            <p className="font-medium"><TranslatedValue value={user?.otherDetails?.religion} listName="religions" /></p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("caste")}</span>
            <p className="font-medium"><TranslatedValue value={user?.otherDetails?.caste} listName="castes" /></p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("subCaste")}</span>
            <p className="font-medium"><TranslatedValue value={user?.otherDetails?.subCaste} listName="subCastes" /></p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("houseType")}</span>
            <p className="font-medium">{user?.otherDetails?.houseType || "---"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("otherProperties")}</span>
            <p className="font-medium">{user?.otherDetails?.otherProperties || "---"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("height")}</span>
            <p className="font-medium">{user?.otherDetails?.height || "---"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("color")}</span>
            <p className="font-medium">{user?.otherDetails?.color || "---"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default OtherDetails
