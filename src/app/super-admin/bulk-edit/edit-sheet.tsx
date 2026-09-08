"use client"

import { useEffect } from "react"
import { FormProvider, useForm, useWatch } from "react-hook-form"
import { useTranslations } from "next-intl"
import { Loader } from "lucide-react"

import { aliveOptions, gender, maritalStatus } from "@/utils/enums"
import { useUserDetails } from "@/hooks/use-user"
import { useStatics } from "@/hooks/use-general"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SheetWrapper } from "@/components/ui/sheet"
import {
  ComboboxWrapper, DatePickerWrapper, InputWrapper,
  SelectWrapper, SwitchWrapper,
} from "@/components/ui/field-wrapper-rhf"

function computeChanges(original: any, current: any): any {
  const diff: any = {}
  for (const [k, v] of Object.entries(current ?? {})) {
    if (v === null || v === undefined) continue
    const origV = original?.[k]
    if (typeof v === "object" && !Array.isArray(v) && !(v instanceof Date)) {
      const nested = computeChanges(origV, v)
      if (Object.keys(nested).length > 0) diff[k] = nested
    } else {
      const vStr = v instanceof Date ? v.toISOString() : String(v)
      const oStr = origV instanceof Date ? origV.toISOString() : String(origV ?? "")
      if (vStr !== oStr) diff[k] = v instanceof Date ? v.toISOString() : v
    }
  }
  return diff
}

function toDefaultValues(user: Partial<userT>) {
  return {
    ...user,
    dob: user.dob ? new Date(user.dob) : undefined,
  }
}

type Props = {
  _id: string
  open: boolean
  onOpenChange: (v: boolean) => void
  onApply: (changes: Partial<userT>) => void
}

const TABS = ["Personal", "Professional", "Horoscope", "Family & Prefs"] as const

export function EditSheet({ _id, open, onOpenChange, onApply }: Props) {
  const t = useTranslations("superAdmin.bulkEdit")
  const tCommon = useTranslations("common")

  const TAB_LABELS: Record<typeof TABS[number], string> = {
    Personal: t("editSheet.tabPersonal"),
    Professional: t("editSheet.tabProfessional"),
    Horoscope: t("editSheet.tabHoroscope"),
    "Family & Prefs": t("editSheet.tabFamilyPrefs"),
  }

  const { data: user = {}, isLoading: isUserLoading } = useUserDetails(_id)

  const { data: educationLevels } = useStatics("educationLevels")
  const { data: professions } = useStatics("professions")
  const { data: sectors } = useStatics("sectors")
  const { data: religions } = useStatics("religions")
  const { data: languages } = useStatics("languages")
  const { data: nakshatraOpts } = useStatics("nakshatra")
  const { data: raasiOpts } = useStatics("raasi")
  const { data: castes } = useStatics("castes")
  const { data: casteMap } = useStatics("casteMap")

  const form = useForm({ defaultValues: toDefaultValues(user) })

  useEffect(() => {
    if (user?._id) {
      form.reset(toDefaultValues(user))
    }
  }, [user])

  function handleApply() {
    const raw = form.getValues()
    const changes = computeChanges(user, raw)
    onApply(changes)
    onOpenChange(false)
  }

  const { control } = form
  const watchedCaste = useWatch({ control, name: "otherDetails.caste" }) ?? ""
  const watchedPrefCaste = useWatch({ control, name: "partnerPreferences.caste" }) ?? ""
  const subCasteOpts: itemsT = (casteMap as any)?.[watchedCaste] ?? []
  const prefSubCasteOpts: itemsT = (casteMap as any)?.[watchedPrefCaste] ?? []

  return (
    <SheetWrapper
      open={open}
      onOpenChange={onOpenChange}
      title={
        <span className="df gap-2 items-center">
          <img
            src={user.profileImg || "/imgs/user.jpg"}
            className="size-8 rounded object-cover"
            alt=""
          />
          {user.fullName}
        </span>
      }
      side="right"
      contentCls="w-full sm:max-w-xl flex flex-col gap-0"
      action={t("editSheet.applyChanges")}
      cancel={tCommon("cancel")}
      onAction={handleApply}
      actionCls="bg-pink-600 hover:bg-pink-500"
    >
      {isUserLoading ? (
        <div className="dc flex-1">
          <Loader className="animate-spin" />
        </div>
      ) : (
        <FormProvider {...form}>
          <Tabs defaultValue="Personal" className="flex-1 flex flex-col min-h-0 pt-2">
            <TabsList className="shrink-0 w-full justify-start border-b bg-transparent rounded-none px-4">
              {TABS.map(tab => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="text-xs px-3 pb-2 -mb-1.5 border-0 border-b-2 data-[state=active]:border-primary rounded-none data-[state=active]:shadow-none"
                >
                  {TAB_LABELS[tab]}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="Personal" className="scroll-y px-4 pt-4 pb-20 mt-0 grid grid-cols-2 gap-x-4 gap-y-3 content-start">
              <InputWrapper name="fullName" label={t("fields.fullName")} control={control} className="col-span-2 gap-0.5" />
              <DatePickerWrapper
                name="dob"
                label={t("fields.dob")}
                control={control}
                className="gap-0.5"
                captionLayout="dropdown"
              />
              <SelectWrapper name="gender" label={t("fields.gender")} control={control} items={gender} className="gap-0.5" />
              <SelectWrapper name="maritalStatus" label={t("fields.maritalStatus")} control={control} items={maritalStatus} className="gap-0.5" />
              <SwitchWrapper name="hasDisability" label={t("fields.hasDisability")} control={control} className="gap-0.5" />
              <InputWrapper name="contactDetails.address" label={t("fields.contactDetails_address")} control={control} className="col-span-2 gap-0.5" />
              <InputWrapper name="contactDetails.place" label={t("fields.contactDetails_place")} placeholder={t("editSheet.fullNamePlaceholder")} control={control} className="gap-0.5" />
              <ComboboxWrapper name="otherDetails.caste" label={t("fields.otherDetails_caste")} control={control} items={castes ?? []} className="gap-0.5" /> {/*canCreateNew*/}
              <ComboboxWrapper name="otherDetails.subCaste" label={t("fields.otherDetails_subCaste")} control={control} items={subCasteOpts} className="gap-0.5" /> {/*canCreateNew*/}
              <ComboboxWrapper name="otherDetails.religion" label={t("fields.otherDetails_religion")} control={control} items={religions ?? []} className="gap-0.5" /> {/*canCreateNew*/}
              <ComboboxWrapper name="otherDetails.motherTongue" label={t("fields.otherDetails_motherTongue")} control={control} items={languages ?? []} className="gap-0.5" /> {/*canCreateNew*/}
              <InputWrapper name="otherDetails.height" label={t("fields.otherDetails_height")} control={control} className="gap-0.5" />
              <InputWrapper name="otherDetails.color" label={t("fields.otherDetails_color")} control={control} className="gap-0.5" />
              <InputWrapper name="otherDetails.houseType" label={t("fields.otherDetails_houseType")} control={control} className="gap-0.5" />
              <InputWrapper name="otherDetails.otherProperties" label={t("fields.otherDetails_otherProperties")} control={control} className="gap-0.5" />
            </TabsContent>

            <TabsContent value="Professional" className="scroll-y px-4 pt-4 pb-20 mt-0 grid grid-cols-2 gap-x-4 gap-y-3 content-start">
              <ComboboxWrapper name="proffessionalDetails.highestQualification" label={t("fields.proffessionalDetails_highestQualification")} control={control} items={educationLevels ?? []} className="col-span-2 gap-0.5" />
              <InputWrapper name="proffessionalDetails.qualifications" label={t("fields.proffessionalDetails_qualifications")} control={control} className="col-span-2 gap-0.5" />
              <ComboboxWrapper name="proffessionalDetails.profession" label={t("fields.proffessionalDetails_profession")} control={control} items={professions ?? []} className="gap-0.5" /> {/*canCreateNew*/}
              <ComboboxWrapper name="proffessionalDetails.sector" label={t("fields.proffessionalDetails_sector")} control={control} items={sectors ?? []} className="gap-0.5" /> {/*canCreateNew*/}
              <InputWrapper name="proffessionalDetails.salary" label={t("fields.proffessionalDetails_salary")} control={control} type="number" className="gap-0.5" />
              <InputWrapper name="proffessionalDetails.companyName" label={t("fields.proffessionalDetails_companyName")} control={control} className="gap-0.5" />
              <InputWrapper name="proffessionalDetails.companyLocation" label={t("fields.proffessionalDetails_companyLocation")} control={control} className="col-span-2 gap-0.5" />
            </TabsContent>

            <TabsContent value="Horoscope" className="scroll-y px-4 pt-4 pb-20 mt-0 grid grid-cols-2 gap-x-4 gap-y-3 content-start">
              <ComboboxWrapper name="vedicHoroscope.rasi" label={t("fields.vedicHoroscope_rasi")} control={control} items={raasiOpts ?? []} className="gap-0.5" />
              <ComboboxWrapper name="vedicHoroscope.lagna" label={t("fields.vedicHoroscope_lagna")} control={control} items={raasiOpts ?? []} className="gap-0.5" />
              <ComboboxWrapper name="vedicHoroscope.nakshatra" label={t("fields.vedicHoroscope_nakshatra")} control={control} items={nakshatraOpts ?? []} className="gap-0.5" />
              <InputWrapper name="vedicHoroscope.dashaPeriod" label={t("fields.vedicHoroscope_dashaPeriod")} control={control} className="gap-0.5" />
              <InputWrapper name="vedicHoroscope.dosham" label={t("fields.vedicHoroscope_dosham")} control={control} className="col-span-2 gap-0.5" />
            </TabsContent>

            <TabsContent value="Family & Prefs" className="scroll-y px-4 pt-4 pb-20 mt-0 grid grid-cols-2 gap-x-4 gap-y-3 content-start">
              <p className="col-span-2 text-xs font-medium text-muted-foreground uppercase tracking-wide pt-1">{t("editSheet.familyDetailsSection")}</p>
              <InputWrapper name="familyDetails.fatherName" label={t("fields.familyDetails_fatherName")} control={control} className="gap-0.5" />
              <InputWrapper name="familyDetails.motherName" label={t("fields.familyDetails_motherName")} control={control} className="gap-0.5" />
              <SelectWrapper name="familyDetails.isFatherAlive" label={t("fields.familyDetails_isFatherAlive")} control={control} items={aliveOptions} className="gap-0.5" />
              <SelectWrapper name="familyDetails.isMotherAlive" label={t("fields.familyDetails_isMotherAlive")} control={control} items={aliveOptions} className="gap-0.5" />
              <InputWrapper name="familyDetails.noOfBrothers" label={t("fields.familyDetails_noOfBrothers")} control={control} type="number" className="gap-0.5" />
              <InputWrapper name="familyDetails.noOfSisters" label={t("fields.familyDetails_noOfSisters")} control={control} type="number" className="gap-0.5" />
              <InputWrapper name="familyDetails.birthOrder" label={t("fields.familyDetails_birthOrder")} control={control} type="number" className="gap-0.5" />

              <p className="col-span-2 text-xs font-medium text-muted-foreground uppercase tracking-wide pt-3">{t("editSheet.partnerPreferencesSection")}</p>
              <InputWrapper name="partnerPreferences.minAge" label={t("fields.partnerPreferences_minAge")} control={control} type="number" className="gap-0.5" />
              <InputWrapper name="partnerPreferences.maxAge" label={t("fields.partnerPreferences_maxAge")} control={control} type="number" className="gap-0.5" />
              <ComboboxWrapper name="partnerPreferences.religion" label={t("fields.partnerPreferences_religion")} control={control} items={religions ?? []} className="gap-0.5" /> {/*canCreateNew*/}
              <ComboboxWrapper name="partnerPreferences.caste" label={t("fields.partnerPreferences_caste")} control={control} items={castes ?? []} className="gap-0.5" /> {/*canCreateNew*/}
              <ComboboxWrapper name="partnerPreferences.subCaste" label={t("fields.partnerPreferences_subCaste")} control={control} items={prefSubCasteOpts} className="gap-0.5" /> {/*canCreateNew*/}
              <InputWrapper name="partnerPreferences.minSalary" label={t("fields.partnerPreferences_minSalary")} control={control} type="number" className="gap-0.5" />
              <ComboboxWrapper name="partnerPreferences.profession" label={t("fields.partnerPreferences_profession")} control={control} items={professions ?? []} className="gap-0.5" /> {/*canCreateNew*/}
              <ComboboxWrapper name="partnerPreferences.sector" label={t("fields.partnerPreferences_sector")} control={control} items={sectors ?? []} className="gap-0.5" /> {/*canCreateNew*/}
              <ComboboxWrapper name="partnerPreferences.motherTongue" label={t("fields.partnerPreferences_motherTongue")} control={control} items={languages ?? []} className="gap-0.5" /> {/*canCreateNew*/}
              <SelectWrapper name="partnerPreferences.maritalStatus" label={t("fields.partnerPreferences_maritalStatus")} control={control} items={maritalStatus} className="gap-0.5" />
              <ComboboxWrapper name="partnerPreferences.minQualification" label={t("fields.partnerPreferences_minQualification")} control={control} items={educationLevels ?? []} className="gap-0.5" />
              <InputWrapper name="partnerPreferences.location" label={t("fields.partnerPreferences_location")} control={control} className="gap-0.5" />
              <InputWrapper name="partnerPreferences.expectation" label={t("fields.partnerPreferences_expectation")} control={control} className="col-span-2 gap-0.5" />
            </TabsContent>
          </Tabs>
        </FormProvider>
      )}
    </SheetWrapper>
  )
}
