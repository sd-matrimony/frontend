import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CardDescription, CardTitle } from "@/components/ui/card";

async function Layout({ children }: LayoutProps<"/auth/user/signup">) {
  const t = await getTranslations("auth")

  return (
    <>
      <div className="dc gap-0 flex-col -mt-8 mb-4">
        <img
          src="/logos/logo-512.webp"
          width={60}
          height={60}
          alt='SDM-logo'
        />
        <CardTitle>{t("signup.title")}</CardTitle>
        <CardDescription>{t("tagline")}</CardDescription>
      </div>

      {children}

      <div className="mt-4 -mb-8 text-center">
        <p className="text-sm text-gray-600">
          {t("signup.haveAccount")}{" "}
          <Link className="font-medium text-pink-600 hover:underline" href="/auth/user/signin">
            {t("signup.signIn")}
          </Link>
        </p>
      </div>
    </>
  )
}

export default Layout