"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Users, Loader } from "lucide-react";
import Script from "next/script";

import { useCreateOrder, useVerifyPayment } from "@/hooks/use-payment";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioIndicator } from "@/components/ui/radio";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { assistedPrices, extraProfiles, PlanBadge, planDetails, planPrices, planValidityMonths, profilesCount } from "@/components/common/plan-badge";

type props = {
  showCheckout?: boolean
}

function Checkout({ showCheckout = true }: props) {
  const t = useTranslations("user.payment")
  const tPlan = useTranslations("user.plan")
  const [additionalProfilesCount, setAdditionalProfilesCount] = useState(10)
  const [addAdditionalProfiles, setAddAdditionalProfiles] = useState(false)
  const [assistedMonths, setAssistedMonths] = useState(1)
  const [subscribedTo, setSubscribedTo] = useState<subscribedToT>("basic")
  const [isAssisted, setIsAssisted] = useState(false)

  const { mutateAsync: createOrderMutate, isPending: isCreateOrderPending } = useCreateOrder()
  const { mutate: verifyPaymentMutate, isPending: isVerifyPaymentPending } = useVerifyPayment()

  const handlePayment = async () => {
    const noOfProfilesCanView = !addAdditionalProfiles
      ? profilesCount[subscribedTo]
      : additionalProfilesCount === 999
        ? additionalProfilesCount
        : additionalProfilesCount + profilesCount[subscribedTo]

    const payload = {
      subscribedTo,
      noOfProfilesCanView,
      isAssisted,
      assistedMonths,
    }
    const data = await createOrderMutate(payload)

    if ((window as any)?.PhonePeCheckout) {
      (window as any)?.PhonePeCheckout?.transact?.({
        tokenUrl: data?.redirectUrl,
        type: "IFRAME",
        callback(res: string) {
          if (res === "CONCLUDED") {
            verifyPaymentMutate({
              ...payload,
              amount: data.amount,
              orderId: data.orderId,
              merchantOrderId: data.merchantOrderId,
            })
          }
        },
      })
    }
  }

  let finalAmount = planPrices[subscribedTo]

  if (addAdditionalProfiles) {
    if (additionalProfilesCount === 999) {
      finalAmount += extraProfiles[999]
      // Unlimited
    } else {
      finalAmount += extraProfiles[additionalProfilesCount]
    }
  }

  if (isAssisted) {
    finalAmount += assistedPrices[assistedMonths]
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 to-rose-50 px-8 py-20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <img
              src="/logos/logo-512.webp"
              width={80}
              height={80}
              alt='SDM-logo'
            />
            <h1 className="text-3xl font-bold text-gray-900">{t("heroTitle")}</h1>
          </div>

          <div className="text-gray-600 text-lg">{t("heroSubtitle")}</div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t("selectPlan")}
                </CardTitle>
                <CardDescription>
                  {t("selectPlanDesc")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={subscribedTo} onValueChange={(value) => setSubscribedTo(value as subscribedToT)}>
                  <div className="grid gap-4">
                    {Object.entries(planDetails).map(([key, plan]) => {
                      const isSelected = subscribedTo === key
                      return (
                        <div
                          key={key}
                          className={`relative rounded-xl border transition-all cursor-pointer ${isSelected
                            ? "border-pink-500 bg-linear-to-r from-pink-50 to-pink-50 shadow-md"
                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                            }`}
                        >
                          <Label htmlFor={key} className="cursor-pointer block">
                            <div className="p-6">
                              <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                  <PlanBadge
                                    className="p-3 rounded-full [&>svg]:size-6"
                                    subscribedTo={key as subscribedToT}
                                  />
                                  <div>
                                    <h3 className="font-semibold text-xl text-gray-900">{plan.name}</h3>
                                    <p className="text-sm text-gray-500">{plan.duration}</p>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <div className="text-2xl font-bold text-gray-900">
                                    ₹{planPrices[key as subscribedToT].toLocaleString()}
                                  </div>
                                  <RadioIndicator value={key} id={key} className="mt-2" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                {[
                                  tPlan("unlockFeature", { count: profilesCount[key as subscribedToT] }),
                                  // "View user information",
                                  // "Phone numbers & contact details"
                                ].map((feature, index) => (
                                  <div key={index} className="flex items-center gap-2 text-gray-600">
                                    <Check className="h-4 w-4 text-green-500 shrink-0" />
                                    <span className="text-sm">{feature}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </Label>
                        </div>
                      )
                    })}
                  </div>
                </RadioGroup>

                <Separator className="my-6" />

                <div className="mb-1 text-sm text-gray-600">
                  {t("fullAccessNote")}
                </div>

                <div className="df flex-wrap">
                  <Checkbox
                    id="additional-profile-access"
                    checked={addAdditionalProfiles}
                    onCheckedChange={(value) => setAddAdditionalProfiles(value as boolean)}
                    label={t("additionalUnlockProfiles")}
                  />

                  {/* <Label htmlFor="additional-profile-access" className="mr-auto text-base font-medium shrink-0">
                    Additional Unlock Profiles
                  </Label> */}

                  {
                    addAdditionalProfiles &&
                    <Select
                      value={additionalProfilesCount.toString()}
                      onValueChange={(value) => setAdditionalProfilesCount(Number.parseInt(value || ""))}
                    >
                      <SelectTrigger className="w-60">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          Object.entries(extraProfiles).map(([key, price]) => (
                            <SelectItem key={key} value={key}>
                              {`${Number(key) === 999 ? t("unlimited") : `+${key}`} ${t("profilesSuffix")} (+${price?.toLocaleString()})`}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                  }
                </div>

                <div className="mb-1 mt-6 text-sm text-gray-600">{t("assistedNote")}</div>

                <div className="df flex-wrap">
                  <Checkbox
                    id="assisted"
                    checked={isAssisted}
                    onCheckedChange={(value) => setIsAssisted(value as boolean)}
                    label={t("assistedServices")}
                  />
                  {/* <Label htmlFor="assisted" className="mr-auto text-base font-medium shrink-0">
                    Assisted Services
                  </Label> */}

                  {isAssisted && (
                    <Select
                      value={assistedMonths.toString()}
                      onValueChange={(value) => setAssistedMonths(Number.parseInt(value || ""))}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {
                          Object.entries(assistedPrices)
                            .filter(([month]) => +month <= planValidityMonths[subscribedTo])
                            .map(([month, price]) => (
                              <SelectItem key={month} value={month.toString()}>
                                {month} {t("monthsSuffix")} (+₹{price?.toLocaleString()})
                              </SelectItem>
                            ))
                        }
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="mt-8 text-xs text-gray-500">
                  {t("assistedFootnote")}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-28">
              <CardHeader>
                <CardTitle>{t("orderSummary")}</CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <p>{tPlan("nameSuffix", { name: planDetails[subscribedTo].name })} <span className="text-xs capitalize text-gray-500">( {planDetails[subscribedTo].duration} - {profilesCount[subscribedTo]} {t("profilesSuffix")} )</span></p>
                  <span className="font-semibold">₹{planPrices[subscribedTo].toLocaleString()}</span>
                </div>

                {
                  addAdditionalProfiles &&
                  <div className="flex justify-between text-sm">
                    <p>{t("additionalProfiles")} <span className="text-xs capitalize text-gray-500">( {additionalProfilesCount === 999 ? ` ${t("unlimited")}` : ` +${additionalProfilesCount}`} )</span></p>
                    <span className="font-semibold">+ ₹{(extraProfiles[additionalProfilesCount]).toLocaleString()}</span>
                  </div>
                }

                {isAssisted && (
                  <div className="flex justify-between text-sm">
                    <p>{t("assistedServices")} <span className="text-xs capitalize text-gray-500">( {assistedMonths} {t("monthsSuffix")} )</span></p>
                    <span className="font-semibold">+ ₹{(assistedPrices[assistedMonths]).toLocaleString()}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>{t("totalAmount")}</span>
                  <span className="text-pink-600 font-bold">₹{finalAmount.toLocaleString()}</span>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• {t("additionalUnlockProfilesLine", { value: addAdditionalProfiles ? (additionalProfilesCount === 999 ? t("unlimited") : additionalProfilesCount + profilesCount[subscribedTo]) : profilesCount[subscribedTo] })}</p>
                  <p>• {t("assistedServicesLine", { value: isAssisted ? `${assistedMonths} ${t("monthsSuffix")}` : t("notOpted") })}</p>
                </div>
              </CardContent>

              {
                showCheckout &&
                <CardFooter>
                  <Button
                    size="lg"
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    onClick={handlePayment}
                    disabled={isCreateOrderPending || isVerifyPaymentPending}
                  >
                    {(isCreateOrderPending || isVerifyPaymentPending) && <Loader className="animate-spin" />}
                    {t("proceedToPayment", { amount: finalAmount.toLocaleString() })}
                  </Button>
                </CardFooter>
              }
            </Card>
          </div>
        </div>
      </div>

      {
        showCheckout &&
        <Script
          src="https://mercury.phonepe.com/web/bundle/checkout.js"
        />
      }
    </div>
  )
}

export default Checkout
