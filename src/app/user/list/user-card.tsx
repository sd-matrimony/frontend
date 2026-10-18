"use client";

import { memo } from "react";
import { Heart, Eye, EyeOff, Briefcase, Calendar, HeartOff, UsersRound, Gem, GraduationCap, ShieldUser, Undo2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";

import { getAge } from "@/utils";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TooltipWrapper } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { PlanBadge } from "@/components/common/plan-badge";

type props = {
  type?: "liked" | "full" | "hidden"
  canHide?: boolean
  isLiked?: boolean
  isHidden?: boolean
  onView?: (userId: string) => void
  onAdd?: (userId: string) => void
  onRemove?: (userId: string) => void
  onHide?: (userId: string) => void
  onUnhide?: (userId: string) => void
} & Partial<userT>

const UserCard = memo(function UserCard({
  _id, profileImg, fullName, maritalStatus, dob,
  otherDetails, proffessionalDetails, currentPlan,
  type = "full", canHide = false, isLiked, isVerified, isHidden,
  onView = () => { },
  onAdd = () => { },
  onRemove = () => { },
  onHide = () => { },
  onUnhide = () => { },
}: props) {
  const t = useTranslations("user.userCard")
  const hasPlan = currentPlan && new Date(currentPlan.expiryDate).getTime() > new Date().getTime()
  return (
    <Card className="p-0 overflow-hidden transition-all duration-300 hover:shadow-md @container/card">
      <div className="flex flex-col @lg/card:flex-row">
        <div className="relative w-full @lg/card:w-auto">
          <Link href={`/user/profile/${_id}`}>
            <img
              className="w-full @lg/card:w-60 h-60 object-cover hover:scale-105 transition-transform"
              src={profileImg || "/imgs/user.jpg"}
              alt={fullName || "Profile Image"}
              loading="lazy"
              decoding="async"
            />
          </Link>
          {isLiked && (
            <Badge variant="secondary" className="absolute top-2 right-2 bg-white/80">
              <Heart className="h-3 w-3 mr-1 fill-rose-500 text-rose-500" />
              {t("liked")}
            </Badge>
          )}

          <TooltipWrapper
            content={hasPlan ? t("paidUser") : t("freeUser")}
            triggerCls="p-2 absolute bottom-2 left-2 rounded-full [&>svg]:size-4 opacity-90"
            trigger={<PlanBadge subscribedTo={hasPlan ? "platinum" : "basic"} />}
          />
        </div>

        <CardContent className="flex-1 px-4 py-3 relative">
          {isVerified && (
            <TooltipWrapper
              content={t("verifiedUser")}
              trigger={
                <Badge
                  variant="secondary"
                  className="p-1.5 absolute top-2 right-2 rounded-full bg-green-100 [&>svg]:size-4.5 opacity-90 border border-green-300"
                >
                  <ShieldUser className="text-green-500" />
                </Badge>
              }
            />
          )}
          <h3 className="text-lg font-semibold mb-1 line-clamp-1">{fullName}</h3>

          <div className="grid gap-2 text-sm text-muted-foreground mb-4">
            <div className="df">
              <Calendar className="h-4 w-4 opacity-70" />
              <span className="@xl/card:w-24">{t("age")}</span>
              <span className="@xl/card:w-4">:</span>
              <span className="font-medium">{dob ? getAge(dob) : ""} {t("years")}</span>
            </div>

            <div className="df">
              <UsersRound className="h-4 w-4 opacity-70" />
              <span className="@xl/card:w-24">{t("caste")}</span>
              <span className="@xl/card:w-4">:</span>
              <span className="font-medium">{otherDetails?.caste || t("notSpecified")} {otherDetails?.subCaste ? `- ${otherDetails?.subCaste}` : ""}</span>
            </div>

            <div className="df">
              <GraduationCap className="h-4 w-4 opacity-70" />
              <span className="@xl/card:w-24">{t("qualification")}</span>
              <span className="@xl/card:w-4">:</span>
              <span className="font-medium">{proffessionalDetails?.highestQualification}</span>
            </div>

            <div className="df">
              <Briefcase className="h-4 w-4 opacity-70" />
              <span className="@xl/card:w-24">{t("profession")}</span>
              <span className="@xl/card:w-4">:</span>
              <span className="font-medium">{proffessionalDetails?.profession}</span>
            </div>

            <div className="df">
              <Gem className="h-4 w-4 opacity-70" />
              <span className="@xl/card:w-24">{t("maritalStatus")}</span>
              <span className="@xl/card:w-4">:</span>
              <span className="font-medium">{maritalStatus}</span>
            </div>
          </div>

          <CardFooter className="df flex-wrap p-0">
            {type === "full" && !isLiked &&
              <TooltipWrapper
                content={t("addToLike")}
                triggerProps={{
                  render: <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAdd(_id as string)}
                    className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <Heart className="h-4 w-4" />
                    <span className="sr-only">{t("addToLike")}</span>
                  </Button>
                }}
              />
            }

            {((type === "full" && isLiked) || type === "liked") &&
              <TooltipWrapper
                content={t("removeFromLike")}
                triggerProps={{
                  render: <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onRemove(_id as string)}
                    className="text-rose-500 border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                  >
                    <HeartOff className="h-4 w-4 fill-rose-500" />
                    <span className="sr-only">{t("removeFromLike")}</span>
                  </Button>
                }}
              />
            }

            <TooltipWrapper
              content={t("viewProfile")}
              triggerProps={{
                render: <Button
                  size="sm"
                  onClick={() => onView(_id as string)}
                  nativeButton={false}
                  render={<Link href={`/user/profile/${_id}`} />}
                >
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">{t("viewProfile")}</span>
                </Button>
              }}
            />

            {canHide && type !== "hidden" && !isHidden &&
              <TooltipWrapper
                content={t("notInterested")}
                triggerProps={{
                  render: <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onHide(_id as string)}
                    className="ml-auto text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
                  >
                    <EyeOff className="h-4 w-4" />
                    <span className="sr-only">{t("notInterested")}</span>
                  </Button>
                }}
              />
            }

            {(type === "hidden" || (canHide && isHidden)) &&
              <TooltipWrapper
                content={t("unhide")}
                triggerProps={{
                  render: <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUnhide(_id as string)}
                    className="ml-auto text-slate-500 border-slate-200 hover:bg-slate-50 hover:text-slate-700"
                  >
                    <Undo2 className="h-4 w-4" />
                    <span className="sr-only">{t("unhide")}</span>
                  </Button>
                }}
              />
            }
          </CardFooter>
        </CardContent>
      </div>
    </Card>
  )
})

export default UserCard
