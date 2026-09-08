import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CardDescription, CardTitle } from "@/components/ui/card";

async function Layout({ children, role = "user" }: { children: React.ReactNode; role?: rolesT }) {
  const t = await getTranslations("auth")

  return (
    <>
      <div className="flex flex-col items-center space-y-2 mb-6">
        <img
          src="/logos/logo-512.webp"
          width={92}
          height={92}
          alt='SDM-logo'
        />
        <CardTitle>{t("signin.welcomeBack")}</CardTitle>
        <CardDescription>{t("tagline")}</CardDescription>
      </div>

      {children}

      <div className="mt-4 text-center">
        <Link className="text-sm text-pink-600 hover:underline" href={`/auth/${role}/forgot-pass`}>
          {t("signin.forgotPassword")}
        </Link>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {t("signin.noAccount")}{" "}
          <Link className="font-medium text-pink-600 hover:underline" href={`/auth/${role}/signup`}>
            {t("signin.signUp")}
          </Link>
        </p>
      </div>
    </>
  )
}

export default Layout