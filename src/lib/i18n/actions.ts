"use server";

import { cookies } from "next/headers";

import { locales, localeCookieName } from "@/utils";

export async function setLocale(locale: (typeof locales)[number]) {
  const cookieStore = await cookies();
  cookieStore.set(localeCookieName, locale, { path: "/", maxAge: 60 * 60 * 24 * 365 });
}
