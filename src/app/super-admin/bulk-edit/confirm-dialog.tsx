"use client"

import { useMemo } from "react"
import { useTranslations } from "next-intl"
import { Loader } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog"

import type { ChangeMap } from "./types"

const NORMAL_CASE_FIELDS = new Set([
  "otherDetails.caste", "otherDetails.subCaste",
  "partnerPreferences.caste", "partnerPreferences.subCaste",
])

const FIELD_KEYS: Record<string, string> = {
  fullName: "fullName", dob: "dob", gender: "gender",
  maritalStatus: "maritalStatus", hasDisability: "hasDisability",
  "contactDetails.address": "contactDetails_address", "contactDetails.place": "contactDetails_place",
  "otherDetails.caste": "otherDetails_caste", "otherDetails.subCaste": "otherDetails_subCaste",
  "otherDetails.religion": "otherDetails_religion", "otherDetails.motherTongue": "otherDetails_motherTongue",
  "otherDetails.height": "otherDetails_height", "otherDetails.color": "otherDetails_color",
  "otherDetails.houseType": "otherDetails_houseType",
  "otherDetails.otherProperties": "otherDetails_otherProperties",
  "proffessionalDetails.highestQualification": "proffessionalDetails_highestQualification",
  "proffessionalDetails.qualifications": "proffessionalDetails_qualifications",
  "proffessionalDetails.profession": "proffessionalDetails_profession", "proffessionalDetails.sector": "proffessionalDetails_sector",
  "proffessionalDetails.salary": "proffessionalDetails_salary", "proffessionalDetails.companyName": "proffessionalDetails_companyName",
  "proffessionalDetails.companyLocation": "proffessionalDetails_companyLocation",
  "vedicHoroscope.rasi": "vedicHoroscope_rasi", "vedicHoroscope.lagna": "vedicHoroscope_lagna",
  "vedicHoroscope.nakshatra": "vedicHoroscope_nakshatra", "vedicHoroscope.dashaPeriod": "vedicHoroscope_dashaPeriod",
  "vedicHoroscope.placeOfBirth": "vedicHoroscope_placeOfBirth", "vedicHoroscope.timeOfBirth": "vedicHoroscope_timeOfBirth",
  "vedicHoroscope.dosham": "vedicHoroscope_dosham",
  "familyDetails.fatherName": "familyDetails_fatherName", "familyDetails.motherName": "familyDetails_motherName",
  "familyDetails.noOfBrothers": "familyDetails_noOfBrothers", "familyDetails.noOfSisters": "familyDetails_noOfSisters",
  "familyDetails.birthOrder": "familyDetails_birthOrder",
  "familyDetails.isFatherAlive": "familyDetails_isFatherAlive", "familyDetails.isMotherAlive": "familyDetails_isMotherAlive",
  "partnerPreferences.minAge": "partnerPreferences_minAge", "partnerPreferences.maxAge": "partnerPreferences_maxAge",
  "partnerPreferences.religion": "partnerPreferences_religion", "partnerPreferences.caste": "partnerPreferences_caste",
  "partnerPreferences.minSalary": "partnerPreferences_minSalary", "partnerPreferences.minQualification": "partnerPreferences_minQualification",
  "partnerPreferences.profession": "partnerPreferences_profession", "partnerPreferences.sector": "partnerPreferences_sector",
  "partnerPreferences.motherTongue": "partnerPreferences_motherTongue", "partnerPreferences.location": "partnerPreferences_location",
  "partnerPreferences.expectation": "partnerPreferences_expectation", "partnerPreferences.maritalStatus": "partnerPreferences_maritalStatus",
}

function flattenFields(obj: any, prefix = ""): Array<{ path: string; value: any }> {
  const result: Array<{ path: string; value: any }> = []
  for (const [k, v] of Object.entries(obj ?? {})) {
    const path = prefix ? `${prefix}.${k}` : k
    if (v !== null && v !== undefined && typeof v === "object" && !Array.isArray(v)) {
      result.push(...flattenFields(v, path))
    } else if (v !== undefined && v !== null) {
      result.push({ path, value: v })
    }
  }
  return result
}

function formatValue(value: any, labels: { removed: string; yes: string; no: string }): string {
  if (typeof value === "string" && value === "") return labels.removed
  if (typeof value === "boolean") return value ? labels.yes : labels.no
  if (typeof value === "number") return value.toLocaleString()
  if (typeof value === "string" && value.match(/^\d{4}-\d{2}-\d{2}T/)) {
    return new Date(value).toLocaleDateString("en-IN")
  }
  return String(value)
}

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  changes: ChangeMap
  users: Partial<userT>[]
  isPending: boolean
  onConfirm: () => void
}

export function ConfirmDialog({ open, onOpenChange, changes, users, isPending, onConfirm }: Props) {
  const t = useTranslations("superAdmin.bulkEdit")
  const tCommon = useTranslations("common")
  const entries = Object.entries(changes)

  const usersMap = useMemo(
    () => new Map((users ?? []).map(u => [u._id!, u])),
    [users],
  )

  const valueLabels = { removed: t("removedValue"), yes: tCommon("yes"), no: tCommon("no") }

  function label(path: string) {
    const key = FIELD_KEYS[path]
    return key ? t(`fields.${key}` as any) : path.split(".").pop() ?? path
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {t("confirmTitle", { count: entries.length })}
          </DialogTitle>
        </DialogHeader>

        <div className="scroll-y -mx-2 px-2 flex-1 space-y-4 py-1">
          {entries.map(([userId, userChanges]) => {
            const user = usersMap.get(userId)
            const fields = flattenFields(userChanges)
            if (fields.length === 0) return null

            return (
              <div key={userId} className="border rounded-md overflow-hidden">
                <div className="df gap-2 px-3 py-2 bg-muted/50 border-b">
                  <img
                    src={user?.profileImg || "/imgs/user.jpg"}
                    className="size-7 rounded object-cover shrink-0"
                    alt=""
                  />
                  <span className="text-sm font-medium truncate">
                    {user?.fullName ?? userId}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto shrink-0">
                    {t("fieldsCount", { count: fields.length })}
                  </span>
                </div>

                <div className="px-3 py-2 grid grid-cols-2 gap-x-4 gap-y-1">
                  {fields.map(({ path, value }) => (
                    <div key={path} className="text-xs df gap-1">
                      <span className="text-muted-foreground shrink-0">{label(path)}:</span>
                      <span className={cn("font-medium truncate", !NORMAL_CASE_FIELDS.has(path) && "capitalize")}>{formatValue(value, valueLabels)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            {tCommon("cancel")}
          </Button>
          <Button
            className="bg-pink-600 hover:bg-pink-500"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <Loader className="animate-spin size-4 mr-1" />}
            {t("confirmAndSave")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
