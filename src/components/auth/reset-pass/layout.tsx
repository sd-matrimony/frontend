import { HeartIcon } from 'lucide-react';
import { getTranslations } from "next-intl/server";

import { CardDescription, CardTitle } from "@/components/ui/card";

async function Layout({ children }: { children: React.ReactNode; }) {
  const t = await getTranslations("auth")

  return (
    <>
      <div className="flex flex-col items-center space-y-2 mb-6">
        <HeartIcon className="h-12 w-12 text-pink-500" />
        <CardTitle>{t("resetPass.title")}</CardTitle>
        <CardDescription>{t("resetPass.recoverAccount")}</CardDescription>
      </div>

      {children}
    </>
  )
}

export default Layout