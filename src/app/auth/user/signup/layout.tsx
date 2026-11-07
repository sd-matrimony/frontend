import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CardDescription, CardTitle } from "@glraj/ui/card";

async function Layout({ children }: LayoutProps<"/auth/user/signup">) {
  const t = await getTranslations("auth")

  return (
    <>
      <div className="dc -mt-10 mb-2">
        <img
          src="/logos/logo-512.webp"
          width={60}
          height={60}
          alt='SDM-logo'
        />
        <div>
          <CardTitle>{t("signup.title")}</CardTitle>
          <CardDescription>{t("tagline")}</CardDescription>
        </div>
      </div>

      {children}

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center">
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