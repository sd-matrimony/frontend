import { HeartIcon } from 'lucide-react';
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { CardDescription, CardTitle } from "@/components/ui/card";

async function Layout({ children, role = "user" }: { children: React.ReactNode; role?: rolesT }) {
  const t = await getTranslations("auth")

  return (
    <>
      <div className="flex flex-col items-center space-y-2 mb-6">
        <HeartIcon className="h-12 w-12 text-pink-500" />
        <CardTitle>{t("forgotPass.title")}</CardTitle>
        <CardDescription>{t("forgotPass.recoverAccount")}</CardDescription>
      </div>

      {children}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {t("forgotPass.rememberPassword")}{" "}
          <Link className="font-medium text-pink-600 hover:underline" href={`/auth/${role}/signin`}>
            {t("forgotPass.signIn")}
          </Link>
        </p>
      </div>
    </>
  )
}

export default Layout