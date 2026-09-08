"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle, XCircle, Mail, Lock, CreditCard, Loader, User, Phone } from "lucide-react";

import { useResendVerifyEmail, useUpdateEmail, useUpdateMobile, useUserDetailsMini } from "@/hooks/use-account";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import ConfirmUpdate from "./confirm-update";
import CardWrapper from "./card-wrapper";
import PlanDetails from "./plan-details";
import UpdatePass from "./update-pass";

function Page() {
  const t = useTranslations("user.account");
  const tCommon = useTranslations("common");
  const { data: user, isLoading } = useUserDetailsMini()

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [mobile, setMobile] = useState(user?.contactDetails?.mobile || "")
  const [email, setEmail] = useState(user?.email || "")

  const { mutate: resendVerifyEmailMutate, isPending: isPending1 } = useResendVerifyEmail()
  const { mutate: mobileMutate, isPending: isMobilePending } = useUpdateMobile()
  const { mutate: emailMutate, isPending: isEmailPending } = useUpdateEmail()

  useEffect(() => {
    if (user) {
      setEmail(user?.email || "")
      setMobile(user?.contactDetails?.mobile || "")
    }
  }, [user])

  function updatePass() {
    setShowPasswordForm(p => !p)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-10 py-20">
      <CardWrapper Icon={User} title={t("title")} description={t("description")}>
        <div className="space-y-2">
          <div className="df">
            <Mail className="h-4 w-4" />
            <Label htmlFor="email" className="flex-1">
              {t("email.label")}
            </Label>

            {
              isLoading
                ? <Loader className="h-4 w-4 animate-spin" />
                :
                <Badge
                  variant={user?.isVerified ? "default" : "destructive"}
                  className="flex items-center gap-1"
                >
                  {user?.isVerified ? (
                    <>
                      <CheckCircle className="h-3 w-3" />
                      {t("email.verified")}
                    </>
                  ) : (
                    <>
                      <XCircle className="h-3 w-3" />
                      {t("email.notVerified")}
                    </>
                  )}
                </Badge>
            }
          </div>

          <div className="relative">
            <Input
              id="email"
              type="email"
              value={isLoading ? tCommon("loading") : email}
              className="flex-1"
              onChange={e => setEmail(e.target.value)}
            />

            <ConfirmUpdate
              description={t("email.confirmDescription", { email })}
              disabled={!email || email === user?.email}
              isPending={isEmailPending}
              onConfirm={() => emailMutate({ email: email })}
            />
          </div>

          {
            !isLoading &&
            !!user?.email &&
            !user?.isVerified && (
              <Button
                size="sm"
                variant="outline"
                className="mt-2 bg-transparent"
                onClick={() => resendVerifyEmailMutate({ email: user?.email })}
                disabled={isPending1}
              >
                {isPending1 && <Loader className="h-4 w-4 animate-spin" />}
                {t("email.sendVerification")}
              </Button>
            )
          }
        </div>

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="mobile" className="df mb-2">
            <Phone className="h-4 w-4" />
            {t("mobile.label")}
          </Label>

          <div className="relative">
            <Input
              id="mobile"
              type="tel"
              value={isLoading ? tCommon("loading") : mobile}
              className="flex-1"
              onChange={e => setMobile(e.target.value)}
            />
            <ConfirmUpdate
              description={t("mobile.confirmDescription", { mobile })}
              disabled={!mobile || mobile === user?.contactDetails?.mobile}
              isPending={isMobilePending}
              onConfirm={() => mobileMutate({ mobile: mobile })}
            />
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="df text-base font-medium">
                <Lock className="h-4 w-4" />
                {t("password.label")}
              </Label>

              <p className="text-sm text-muted-foreground">{t("password.description")}</p>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={updatePass}
            >
              {showPasswordForm ? tCommon("cancel") : t("password.change")}
            </Button>
          </div>

          {
            showPasswordForm &&
            <UpdatePass onSuccess={updatePass} />
          }
        </div>
      </CardWrapper>

      <CardWrapper
        Icon={CreditCard}
        title={t("plan.title")}
        description={t("plan.description")}
      >
        {
          isLoading
            ? <div className="dc h-60"><Loader className="size-6 animate-spin" /></div>
            : <PlanDetails />
        }
      </CardWrapper>
    </div>
  )
}

export default Page
