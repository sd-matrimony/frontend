import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { defaultLocale, locales, localeCookieName } from "@/utils";

import enCore from "../../../messages/en/core.json";
import enAuth from "../../../messages/en/auth.json";
import enPublic from "../../../messages/en/public.json";
import enUser from "../../../messages/en/user.json";
import enAdmin from "../../../messages/en/admin.json";
import enSuperAdmin from "../../../messages/en/superAdmin.json";

import taCore from "../../../messages/ta/core.json";
import taAuth from "../../../messages/ta/auth.json";
import taPublic from "../../../messages/ta/public.json";
import taUser from "../../../messages/ta/user.json";
import taAdmin from "../../../messages/ta/admin.json";
import taSuperAdmin from "../../../messages/ta/superAdmin.json";

const messagesByLocale = {
  en: { ...enCore, ...enAuth, ...enPublic, ...enUser, ...enAdmin, ...enSuperAdmin },
  ta: { ...taCore, ...taAuth, ...taPublic, ...taUser, ...taAdmin, ...taSuperAdmin },
} as const;

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(localeCookieName)?.value;

  const locale = locales.includes(cookieLocale as (typeof locales)[number])
    ? (cookieLocale as (typeof locales)[number])
    : defaultLocale;

  return {
    locale,
    messages: messagesByLocale[locale],
  };
});
