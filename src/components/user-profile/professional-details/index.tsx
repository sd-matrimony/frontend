import { getTranslations } from "next-intl/server";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TranslatedValue } from "@/components/common/translated-value";
import Edit from "./edit";

type props = {
  user: userT & { hasFullAccess?: boolean }
  canEdit: boolean
}

async function ProfessionalDetails({ user, canEdit }: props) {
  const t = await getTranslations("shared.userProfile.professional")

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
            <span className="text-sm text-muted-foreground">{t("highestQualification")}</span>
            <p className="font-medium"><TranslatedValue value={user?.proffessionalDetails?.highestQualification} listName="educationLevels" /></p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("qualifications")}</span>
            <p className="font-medium">{user?.proffessionalDetails?.qualifications || "---"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("sector")}</span>
            <p className="font-medium"><TranslatedValue value={user?.proffessionalDetails?.sector} listName="sectors" /></p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("profession")}</span>
            <p className="font-medium"><TranslatedValue value={user?.proffessionalDetails?.profession} listName="professions" /></p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("companyName")}</span>
            <p className="font-medium">{user?.proffessionalDetails?.companyName || "---"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("companyLocation")}</span>
            <p className="font-medium">{user?.proffessionalDetails?.companyLocation || "---"}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">{t("monthlySalary")}</span>
            <p className="font-medium">₹{user?.proffessionalDetails?.salary || "---"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProfessionalDetails
