"use server";

import { cookies } from "next/headers";

import { localeCookieName, defaultLocale, locales } from "@/utils";

export async function getServerSideLocale() {
  const cookiesStore = await cookies()
  const locale = cookiesStore.get(localeCookieName)?.value
  return locales.includes(locale as (typeof locales)[number]) ? locale : defaultLocale
}
