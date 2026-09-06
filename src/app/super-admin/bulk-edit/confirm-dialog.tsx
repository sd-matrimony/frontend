"use client"

import { useMemo } from "react"
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

const LABELS: Record<string, string> = {
  fullName: "Name", dob: "Date of Birth", gender: "Gender",
  maritalStatus: "Marital Status", hasDisability: "Disability",
  "contactDetails.address": "Address",
  "otherDetails.caste": "Caste", "otherDetails.subCaste": "Sub Caste",
  "otherDetails.religion": "Religion", "otherDetails.motherTongue": "Mother Tongue",
  "otherDetails.height": "Height", "otherDetails.color": "Complexion",
  "otherDetails.houseType": "House Type",
  "otherDetails.otherProperties": "Other Properties",
  "proffessionalDetails.highestQualification": "Qualification",
  "proffessionalDetails.qualifications": "Qualification Details",
  "proffessionalDetails.profession": "Profession", "proffessionalDetails.sector": "Sector",
  "proffessionalDetails.salary": "Salary", "proffessionalDetails.companyName": "Company",
  "proffessionalDetails.companyLocation": "Company Location",
  "vedicHoroscope.rasi": "Rasi", "vedicHoroscope.lagna": "Lagna",
  "vedicHoroscope.nakshatra": "Nakshatra", "vedicHoroscope.dashaPeriod": "Dasha Period",
  "vedicHoroscope.placeOfBirth": "Place of Birth", "vedicHoroscope.timeOfBirth": "Time of Birth",
  "vedicHoroscope.dosham": "Dosham",
  "familyDetails.fatherName": "Father's Name", "familyDetails.motherName": "Mother's Name",
  "familyDetails.noOfBrothers": "Brothers", "familyDetails.noOfSisters": "Sisters",
  "familyDetails.birthOrder": "Birth Order",
  "familyDetails.isFatherAlive": "Father Status", "familyDetails.isMotherAlive": "Mother Status",
  "partnerPreferences.minAge": "Min Age", "partnerPreferences.maxAge": "Max Age",
  "partnerPreferences.religion": "Religion Pref", "partnerPreferences.caste": "Caste Pref",
  "partnerPreferences.minSalary": "Min Salary", "partnerPreferences.minQualification": "Min Qualification",
  "partnerPreferences.profession": "Profession Pref", "partnerPreferences.sector": "Sector Pref",
  "partnerPreferences.motherTongue": "Mother Tongue Pref", "partnerPreferences.location": "Location",
  "partnerPreferences.expectation": "Expectation", "partnerPreferences.maritalStatus": "Marital Status Pref",
}

function label(path: string) {
  return LABELS[path] ?? path.split(".").pop() ?? path
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

function formatValue(value: any): string {
  if (typeof value === "string" && value === "") return "(removed)"
  if (typeof value === "boolean") return value ? "Yes" : "No"
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
  const entries = Object.entries(changes)

  const usersMap = useMemo(
    () => new Map((users ?? []).map(u => [u._id!, u])),
    [users],
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            Confirm {entries.length} update{entries.length > 1 ? "s" : ""}
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
                    {fields.length} field{fields.length > 1 ? "s" : ""}
                  </span>
                </div>

                <div className="px-3 py-2 grid grid-cols-2 gap-x-4 gap-y-1">
                  {fields.map(({ path, value }) => (
                    <div key={path} className="text-xs df gap-1">
                      <span className="text-muted-foreground shrink-0">{label(path)}:</span>
                      <span className={cn("font-medium truncate", !NORMAL_CASE_FIELDS.has(path) && "capitalize")}>{formatValue(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button
            className="bg-pink-600 hover:bg-pink-500"
            onClick={onConfirm}
            disabled={isPending}
          >
            {isPending && <Loader className="animate-spin size-4 mr-1" />}
            Confirm & Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
