import { useEffect } from 'react';
// import { differenceInYears } from 'date-fns';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { z } from 'zod';

import { maritalStatus, ageRange, salaryRange } from '@/utils';
import { usePartnerPreferences } from '@/hooks/use-user';
import { useUserDetailsMini } from '@/hooks/use-account';

import { InputWrapper, SelectWrapper } from '@/components/ui/field-wrapper-rhf';
import { SelectListWrapper, SelectSubCastesWrapper } from '@/components/common/lists';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';

interface props {
  contentHt?: string
  hasFilters: boolean
  onSave: (filterData: any) => void
  onClose?: () => void
}

const schema = z.object({
  minQualification: z.string().optional(),
  profession: z.string().optional(),
  sector: z.string().optional(),

  salaryRange: z.string().optional(),
  minSalary: z.coerce.number().optional().or(z.string()),

  ageRange: z.string().optional(),
  minAge: z.coerce.number().optional().or(z.string()),
  maxAge: z.coerce.number().optional().or(z.string()),

  maritalStatus: z.string().optional(),
  motherTongue: z.string().optional(),
  religion: z.string().optional(),
  caste: z.string().optional(),
  subCaste: z.string().optional(),

  nakshatra: z.string().optional(),
  lagna: z.string().optional(),
  rasi: z.string().optional(),
})

const defaultValues: z.infer<typeof schema> = {
  minQualification: '',
  profession: '',
  sector: '',

  salaryRange: '',
  minSalary: '',

  ageRange: '',
  minAge: '',
  maxAge: '',

  maritalStatus: '',
  motherTongue: '',
  religion: '',
  caste: '',
  subCaste: '',

  nakshatra: '',
  lagna: '',
  rasi: '',
}

type listProps = {
  name: keyof z.infer<typeof schema>
  listName: staticsNameT
}

const list: listProps[] = [
  {
    name: 'minQualification',
    listName: "educationLevels",
  },
  {
    name: 'sector',
    listName: "sectors",
  },
  {
    name: 'profession',
    listName: "professions",
  },
  {
    name: 'motherTongue',
    listName: "languages",
  },
  {
    name: 'religion',
    listName: "religions",
  },
  {
    name: 'caste',
    listName: "castes",
  },
  {
    name: 'rasi',
    listName: "raasi",
  },
  {
    name: 'nakshatra',
    listName: "nakshatra",
  },
  {
    name: 'lagna',
    listName: "raasi",
  },
]

function getPayload(userPartnerPreferences: Pick<userT, "partnerPreferences"> & { dob: string }) {
  const payload: any = {
    ...userPartnerPreferences,
    salaryRange: "",
    ageRange: "",
    lagna: "",
    rasi: "",
    // maxAge: differenceInYears(new Date(), new Date(userPartnerPreferences?.dob || "")) || "",
  }

  Object.entries(payload).forEach(([key, value]) => {
    if (!value) {
      payload[key] = ""
    }
  })

  return payload
}

const FILTER_STORAGE_KEY = 'sdm-user-filters'

function Filters({ onSave, hasFilters, contentHt = "", onClose }: props) {
  const t = useTranslations("user.filters")
  const tCommon = useTranslations("common")
  const { data: userMini, isLoading: isLoadingMini } = useUserDetailsMini()
  const { data: user, isLoading: isLoading2 } = usePartnerPreferences(isLoadingMini ? "" : userMini?._id || "")

  const isLoading = isLoadingMini || isLoading2

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { ...defaultValues },
  })

  const choosedCaste = form.watch("caste")

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(FILTER_STORAGE_KEY)
      if (saved) {
        form.reset(JSON.parse(saved))
      } else {
        const payload: any = getPayload(user)
        form.reset(payload)
        onSave(payload)
      }
    }
  }, [user])

  function onReset() {
    localStorage.removeItem(FILTER_STORAGE_KEY)
    form.reset({ ...defaultValues })
    onSave({})
    onClose?.()
  }

  function onApply() {
    if (!user) return
    const payload: any = getPayload(user)
    form.reset(payload)
    onSave(payload)
    onClose?.()
  }

  function onSubmit(data: z.infer<typeof schema>) {
    const filtered = Object.fromEntries(
      Object.entries(data)
        .filter(([_, value]) => Boolean(value) && value !== "Any")
        .map(([key, value]) => [key, `${value}`?.split(" (")?.[0]?.trim()])
    ) as Partial<typeof data>

    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filtered))
    onSave(filtered)
    onClose?.()
  }

  return (
    <>
      <div className='df md:justify-between md:mb-4'>
        <h5 className='text-sm font-medium'>
          {t("title")}{" "}
          {
            hasFilters && <span className='text-xs font-normal'>
              {t("applied")}
            </span>
          }
        </h5>

        {
          hasFilters &&
          <Button
            size="sm"
            variant="secondary"
            className='h-6 text-xs font-normal hover:bg-input'
            onClick={onReset}
          >
            {t("reset")}
          </Button>
        }
      </div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("dfc h-[calc(100svh-10rem)]", contentHt)}
        >
          <div className="scroll-y -mx-4 md:-mx-6 px-4 md:px-6 py-4 space-y-4 border-y [&_label]:font-normal">
            <SelectWrapper
              name="salaryRange"
              label={t("fields.salaryRange")}
              control={form.control}
              items={salaryRange}
            />

            <div className='mb-0 -mt-1 text-xs text-center'>{t("or")}</div>

            <InputWrapper
              name="minSalary"
              label={t("fields.minSalary")}
              control={form.control}
              className='mb-8'
            />

            <SelectWrapper
              name="ageRange"
              label={t("fields.ageRange")}
              control={form.control}
              items={ageRange}
            />

            <div className='mb-2 -mt-1 text-xs text-center'>{t("or")}</div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <InputWrapper
                name="minAge"
                label={t("fields.minAge")}
                control={form.control}
              />

              <InputWrapper
                name="maxAge"
                label={t("fields.maxAge")}
                control={form.control}
              />
            </div>

            <SelectWrapper
              name="maritalStatus"
              label={t("fields.maritalStatus")}
              control={form.control}
              items={maritalStatus}
            />

            {
              list.map((item) => (
                <div key={item.name}>
                  <SelectListWrapper
                    {...item}
                    label={t(`fields.${item.name}`)}
                    control={form.control}
                    additionalOpts="Any"
                    canCreateNew
                  />

                  {
                    item.name === "caste" &&
                    <SelectSubCastesWrapper
                      name="subCaste"
                      control={form.control}
                      choosed={choosedCaste || ""}
                      additionalOpts="Any"
                      className="mt-4"
                    />
                  }
                </div>
              ))
            }
          </div>

          <div className="df mt-2">
            {
              !isLoading &&
              <Button
                type="button"
                variant="link"
                className='p-0 font-normal'
                onClick={onApply}
              >
                {t("applyPreferences")}
              </Button>
            }

            <Button
              type="submit"
              className='ml-auto'
            >
              {tCommon("save")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

export default Filters
