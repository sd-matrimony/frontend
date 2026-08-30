"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import { useUserDetails } from "@/hooks/use-user";

import FindUser from "./find-user";
import Confirm from "./confirm";

function MakeMatch() {
  const searchParams = useSearchParams()
  const prefillId = searchParams.get("userId") || ""

  const { data: prefillUser } = useUserDetails(prefillId)

  const [female, setFemale] = useState<Partial<userT> | null>(null)
  const [male, setMale] = useState<Partial<userT> | null>(null)
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (!prefillUser?._id) return

    if (prefillUser.gender === "Female") setFemale(prefillUser)
    else if (prefillUser.gender === "Male") setMale(prefillUser)
  }, [prefillUser])

  function onConfirm() {
    setMale(null)
    setFemale(null)
    setKey(key + 1)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Make Match</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        <FindUser
          key={`male-${key}`}
          selected={male?._id || ""}
          setSelected={setMale}
          gender="Male"
        />

        <FindUser
          key={`female-${key}`}
          selected={female?._id || ""}
          setSelected={setFemale}
          gender="Female"
        />

        <Confirm
          male={male}
          female={female}
          onConfirm={onConfirm}
        />
      </div>
    </div>
  )
}

export default MakeMatch
