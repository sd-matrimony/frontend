"use client";

import { useQuery } from "@tanstack/react-query";

import { getStatics } from "@/actions";

export function useStaticsVersion() {
  return useQuery({
    queryKey: ["statics", "latest.json"],
    queryFn: () => getStatics("latest.json"),
  })
}

export function useStatics(name: staticsNameT) {
  const { data } = useStaticsVersion()

  return useQuery({
    queryKey: ["statics", name],
    queryFn: () => getStatics(data?.[name]),
    enabled: !!name && !!data,
  })
}

export function useStaticsTranslations(name: staticsNameT | undefined, locale: string) {
  const { data } = useStaticsVersion()
  const path = name ? data?.translations?.[locale]?.[name] : undefined

  return useQuery({
    queryKey: ["statics", "translations", locale, name],
    queryFn: () => getStatics(path),
    enabled: !!name && !!path && locale !== "en",
  })
}
