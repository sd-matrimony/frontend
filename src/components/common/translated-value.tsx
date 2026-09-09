"use client";

import { useLocale } from "next-intl";

import { useStaticsTranslations } from "@/hooks/use-general";
import { translateListValue } from "@/utils/list-translations";

type props = {
  value?: string
  listName: staticsNameT
  fallback?: string
}

export function TranslatedValue({ value, listName, fallback = "---" }: props) {
  const locale = useLocale()
  const { data: map } = useStaticsTranslations(listName, locale)

  if (!value) return <>{fallback}</>
  return <>{translateListValue(map, value, locale)}</>
}
