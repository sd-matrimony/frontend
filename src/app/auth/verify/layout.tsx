"use client";

import { Suspense } from "react";
import { Loader } from "lucide-react";
import { useTranslations } from "next-intl";

function Layout({ children }: LayoutProps<"/auth/verify">) {
  const t = useTranslations("auth.verify")

  return (
    <Suspense fallback={<Loader className="animate-spin" />}>
      <div className="dc flex-col">
        <h1>{t("inProgress")}</h1>
        <Loader className="animate-spin" />
        {children}
      </div>
    </Suspense>
  )
}

export default Layout
