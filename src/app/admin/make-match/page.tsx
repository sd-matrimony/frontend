import { Suspense } from "react";
import MakeMatch from "@/components/admin/make-match";

function Page() {
  return (
    <Suspense>
      <MakeMatch />
    </Suspense>
  )
}

export default Page
