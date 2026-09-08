import { getTranslations } from "next-intl/server";

import { CardDescription, CardTitle } from "@/components/ui/card";

async function Layout({ children }: LayoutProps<"/auth/admin/signin">) {
  const t = await getTranslations("auth")

  return (
    <>
      <div className="flex flex-col items-center space-y-2 mb-6">
        <img
          src="/logos/logo-512.webp"
          width={80}
          height={80}
          alt='SDM-logo'
        />
        <CardTitle>{t("adminSignin.title")}</CardTitle>
        <CardDescription>{t("tagline")}</CardDescription>
      </div>

      {children}
    </>
  )
}

export default Layout
