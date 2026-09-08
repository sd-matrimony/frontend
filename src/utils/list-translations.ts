const religions: Record<string, string> = {
  Buddhist: "பௌத்தர்",
  Christian: "கிறிஸ்தவர்",
  Hindu: "இந்து",
  Jain: "ஜைனர்",
  Jewish: "யூதர்",
  Muslim: "முஸ்லிம்",
  Parsi: "பார்சி",
  Sikh: "சீக்கியர்",
}

const educationLevels: Record<string, string> = {
  "No Education": "கல்வி இல்லை",
  "Below SSLC": "SSLC-க்கு கீழ்",
  SSLC: "SSLC",
  HSS: "மேல்நிலை (HSS)",
  Diploma: "டிப்ளமா",
  "Bachelor's": "இளங்கலை",
  "Master's": "முதுகலை",
  Doctorate: "முனைவர் பட்டம்",
}

const sectors: Record<string, string> = {
  Government: "அரசு",
  Private: "தனியார்",
  "IT / Software": "ஐடி / மென்பொருள்",
  "Self-Employed / Freelance": "சுயதொழில் / ஃப்ரீலான்ஸ்",
  "Entrepreneur / Business Owner": "தொழில் முனைவோர் / வணிக உரிமையாளர்",
  Unemployed: "வேலையில்லாதவர்",
  Student: "மாணவர்",
  Retired: "ஓய்வு பெற்றவர்",
  Homemaker: "இல்லத்தரசி",
  "Informal Sector": "முறைசாரா துறை",
  "NGO / Non-Profit": "தன்னார்வ தொண்டு நிறுவனம்",
  Agricultural: "விவசாயம்",
  "Creative / Media / Entertainment": "படைப்பாற்றல் / ஊடகம் / பொழுதுபோக்கு",
  Healthcare: "சுகாதாரம்",
  Education: "கல்வி",
  Other: "மற்றவை",
}

const languages: Record<string, string> = {
  Assamese: "அஸ்ஸாமியம்",
  Bengali: "வங்காளம்",
  Bodo: "போடோ",
  Dogri: "டோக்ரி",
  Gujarati: "குஜராத்தி",
  English: "ஆங்கிலம்",
  Hindi: "இந்தி",
  Kannada: "கன்னடம்",
  Kashmiri: "காஷ்மீரி",
  Konkani: "கொங்கணி",
  Maithili: "மைதிலி",
  Malayalam: "மலையாளம்",
  Manipuri: "மணிப்பூரி",
  Marathi: "மராத்தி",
  Nepali: "நேபாளி",
  Odia: "ஒடியா",
  Punjabi: "பஞ்சாபி",
  Sanskrit: "சமஸ்கிருதம்",
  Santali: "சந்தாலி",
  Sindhi: "சிந்தி",
  Tamil: "தமிழ்",
  Telugu: "தெலுங்கு",
  Urdu: "உருது",
}

// castes / casteMap / professions are not translated: hundreds of entries,
// mostly community/surname-derived names where a wrong Tamil rendering can
// misrepresent someone's identity. Falls back to the original English value.
const listTranslations: Partial<Record<staticsNameT, Record<string, string>>> = {
  religions,
  educationLevels,
  sectors,
  languages,
}

const sentinelTranslations: Record<string, string> = {
  Any: "எதுவும்",
  "Don't wish to specify": "குறிப்பிட விரும்பவில்லை",
}

export function translateListValue(listName: staticsNameT | undefined, value: string, locale: string): string {
  if (locale !== "ta") return value
  return (listName && listTranslations[listName]?.[value]) ?? value
}

export function translateSentinel(value: string, locale: string): string {
  if (locale !== "ta") return value
  return sentinelTranslations[value] ?? value
}
