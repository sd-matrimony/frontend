import { useEffect } from 'react';
// import { differenceInYears } from 'date-fns';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
  label: string
  listName: staticsNameT
}

const list: listProps[] = [
  {
    name: 'minQualification',
    label: 'Min Qualification',
    listName: "educationLevels",
  },
  {
    name: 'sector',
    label: 'Sector',
    listName: "sectors",
  },
  {
    name: 'profession',
    label: 'Profession',
    listName: "professions",
  },
  {
    name: 'motherTongue',
    label: 'Mother Tongue',
    listName: "languages",
  },
  {
    name: 'religion',
    label: 'Religion',
    listName: "religions",
  },
  {
    name: 'caste',
    label: 'Caste',
    listName: "castes",
  },
  {
    name: 'rasi',
    label: 'Rasi',
    listName: "raasi",
  },
  {
    name: 'nakshatra',
    label: 'Nakshatra',
    listName: "nakshatra",
  },
  {
    name: 'lagna',
    label: 'Lagna',
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

function Filters({ onSave, hasFilters, contentHt = "" }: props) {
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
  }

  function onApply() {
    if (!user) return
    const payload: any = getPayload(user)
    form.reset(payload)
    onSave(payload)
  }

  function onSubmit(data: z.infer<typeof schema>) {
    const filtered = Object.fromEntries(
      Object.entries(data)
        .filter(([_, value]) => Boolean(value) && value !== "Any")
        .map(([key, value]) => [key, `${value}`?.split(" (")?.[0]])
    ) as Partial<typeof data>

    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(filtered))
    onSave(filtered)
  }

  return (
    <>
      <div className='df md:justify-between md:mb-4'>
        <h5 className='text-sm font-medium'>
          Filters{" "}
          {
            hasFilters && <span className='text-xs font-normal'>
              (Applied)
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
            Reset
          </Button>
        }
      </div>

      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("dfc h-[calc(100vh-10rem)]", contentHt)}
        >
          <div className="scroll-y -mx-4 md:-mx-6 px-4 md:px-6 py-4 space-y-4 border-y [&_label]:font-normal">
            <SelectWrapper
              name="salaryRange"
              label="Salary Range"
              control={form.control}
              items={salaryRange}
            />

            <div className='mb-0 -mt-1 text-xs text-center'>Or</div>

            <InputWrapper
              name="minSalary"
              label="Min Salary"
              control={form.control}
              className='mb-8'
            />

            <SelectWrapper
              name="ageRange"
              label="Age Range"
              control={form.control}
              items={ageRange}
            />

            <div className='mb-2 -mt-1 text-xs text-center'>Or</div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <InputWrapper
                name="minAge"
                label="Min Age"
                control={form.control}
              />

              <InputWrapper
                name="maxAge"
                label="Max Age"
                control={form.control}
              />
            </div>

            <SelectWrapper
              name="maritalStatus"
              label="Marital Status"
              control={form.control}
              items={maritalStatus}
            />

            {
              list.map((item) => (
                <div key={item.name}>
                  <SelectListWrapper
                    {...item}
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
                Apply Your Preferences
              </Button>
            }

            <Button
              type="submit"
              className='ml-auto'
            >
              Save
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  )
}

export default Filters
