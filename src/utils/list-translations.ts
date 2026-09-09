const sentinelTranslations: Record<string, string> = {
  Any: "எதுவும்",
  "Don't wish to specify": "குறிப்பிட விரும்பவில்லை",
}

export function translateListValue(map: Record<string, string> | undefined, value: string, locale: string): string {
  if (locale !== "ta") return value
  return map?.[value] ?? value
}

export function translateSentinel(value: string, locale: string): string {
  if (locale !== "ta") return value
  return sentinelTranslations[value] ?? value
}
