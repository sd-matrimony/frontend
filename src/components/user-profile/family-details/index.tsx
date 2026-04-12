"use client";

import { Info } from "lucide-react";

import useUnlock from "../contact-details/use-unlock";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ToolTipWrapper } from "@/components/ui/tooltip";

import UpgradeBtn from "../contact-details/upgrade-btn";
import Edit from "./edit";

type props = {
  user: userT & { hasFullAccess?: boolean }
  canEdit: boolean
}

function FamilyDetails({ user, canEdit }: props) {
  const { isPending, unlockBtnClk } = useUnlock()
  const isUnlocked = !!user?.hasFullAccess

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Family Details</CardTitle>
          <CardDescription>Information about your family</CardDescription>
        </div>

        {
          canEdit &&
          <Edit user={user} />
        }
      </CardHeader>

      <CardContent>
        <div className="grid min-[400px]:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Father's Name</span>
            {
              user?.contactDetails?.mobile === "restricted"
                ?
                <p className="df">
                  9791155234
                  <ToolTipWrapper description="This is restricted account, Contact admin by the given number">
                    <Info className="size-4" />
                  </ToolTipWrapper>
                </p>
                :
                <UpgradeBtn
                  value={`${user?.familyDetails?.fatherName} ${!user?.familyDetails?.isFatherAlive ? "(Deceased)" : ""}`}
                  unlocked={isUnlocked}
                  isPending={isPending}
                  unlockBtnClk={() => unlockBtnClk(user._id)}
                />}
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Mother's Name</span>
            {
              user?.contactDetails?.mobile === "restricted"
                ?
                <p className="df">
                  9791155234
                  <ToolTipWrapper description="This is restricted account, Contact admin by the given number">
                    <Info className="size-4" />
                  </ToolTipWrapper>
                </p>
                :
                <UpgradeBtn
                  value={`${user?.familyDetails?.motherName} ${!user?.familyDetails?.isMotherAlive ? "(Deceased)" : ""}`}
                  unlocked={isUnlocked}
                  isPending={isPending}
                  unlockBtnClk={() => unlockBtnClk(user._id)}
                />}
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Number of Brothers</span>
            <p className="font-medium">{user?.familyDetails?.noOfBrothers}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Number of Sisters</span>
            <p className="font-medium">{user?.familyDetails?.noOfSisters}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Birth Order</span>
            <p className="font-medium">{user?.familyDetails?.birthOrder}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FamilyDetails
