const optionAliases: Record<string, string[]> = {
  Male: ["boy", "groom", "ஆண்", "பையன்", "மாப்பிள்ளை", "மணமகன்", "மேல்"],
  Female: ["girl", "bride", "பெண்", "பொண்ணு", "மணமகள்", "பீமேல்", "ஃபீமேல்"],
  Own: ["own house", "சொந்தம்", "சொந்த வீடு", "ஓன்"],
  Rented: ["rent", "rental", "வாடகை", "வாடகை வீடு", "ரெண்ட்", "ரெண்டட்"],

  Aries: ["mesham", "mesha", "மேஷம்", "மேசம்"],
  Taurus: ["rishabam", "rishabham", "rishaba", "ரிஷபம்", "ரிசபம்", "இடபம்"],
  Gemini: ["mithunam", "midhunam", "மிதுனம்"],
  Cancer: ["kadagam", "katakam", "கடகம்"],
  Leo: ["simmam", "simha", "சிம்மம்", "சிங்கம்"],
  Virgo: ["kanni", "kanya", "கன்னி"],
  Libra: ["thulam", "tulam", "துலாம்"],
  Scorpio: ["viruchigam", "vrischikam", "விருச்சிகம்"],
  Sagittarius: ["dhanusu", "thanusu", "dhanus", "தனுசு"],
  Capricorn: ["magaram", "makaram", "மகரம்"],
  Aquarius: ["kumbam", "kumbham", "கும்பம்"],
  Pisces: ["meenam", "மீனம்"],

  Ashwini: ["aswini", "asvini", "அஸ்வினி", "அசுவினி"],
  Bharani: ["barani", "பரணி"],
  Krittika: ["karthigai", "kiruthigai", "கார்த்திகை", "கிருத்திகை"],
  Rohini: ["ரோகிணி", "ரோஹிணி"],
  Mrigashira: ["mirugasirisham", "mrigasheersham", "மிருகசீரிஷம்", "மிருகசீரிடம்"],
  Ardra: ["thiruvathirai", "arudra", "திருவாதிரை"],
  Punarvasu: ["punarpoosam", "புனர்பூசம்"],
  Pushya: ["poosam", "pusam", "பூசம்"],
  Ashlesha: ["ayilyam", "aayilyam", "ஆயில்யம்"],
  Magha: ["magam", "makam", "மகம்"],
  "Purva Phalguni": ["pooram", "puram", "பூரம்"],
  "Uttara Phalguni": ["uthiram", "uthram", "உத்திரம்"],
  Hasta: ["hastham", "astham", "அஸ்தம்", "ஹஸ்தம்"],
  Chitra: ["chithirai", "சித்திரை"],
  Swati: ["swathi", "suvathi", "சுவாதி"],
  Vishakha: ["visakam", "visagam", "விசாகம்"],
  Anuradha: ["anusham", "அனுஷம்", "அனுசம்"],
  Jyeshtha: ["kettai", "கேட்டை"],
  Mula: ["moolam", "மூலம்"],
  "Purva Ashadha": ["pooradam", "பூராடம்"],
  "Uttara Ashadha": ["uthiradam", "உத்திராடம்"],
  Shravana: ["thiruvonam", "திருவோணம்", "ஓணம்"],
  Dhanishta: ["avittam", "அவிட்டம்"],
  Shatabhisha: ["sadhayam", "sathayam", "சதயம்"],
  "Purva Bhadrapada": ["poorattathi", "பூரட்டாதி"],
  "Uttara Bhadrapada": ["uthirattathi", "உத்திரட்டாதி"],
  Revati: ["revathi", "ரேவதி"],
}

const fillerWords = new Set([
  "rasi", "raasi", "rashi", "lagnam", "lagna", "lagnum", "natchathiram", "nakshatra", "nakshatram", "star",
  "ராசி", "லக்னம்", "லக்கினம்", "நட்சத்திரம்",
])

const commands = {
  next: ["next", "skip", "அடுத்து", "அடுத்தது", "நெக்ஸ்ட்", "ஸ்கிப்"],
  back: ["back", "previous", "பின்", "முந்தையது", "பேக்"],
  clear: ["clear", "அழி", "கிளியர்"],
  stop: ["stop", "நிறுத்து", "ஸ்டாப்"],
} as const

export type voiceCommandT = keyof typeof commands

const digitWords: Record<string, string> = {
  zero: "0", oh: "0", one: "1", two: "2", to: "2", too: "2", three: "3", four: "4", for: "4",
  five: "5", six: "6", seven: "7", eight: "8", nine: "9",
}

function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter(w => w && !fillerWords.has(w))
}

function levenshtein(a: string, b: string) {
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    const curr = [i]
    for (let j = 1; j <= b.length; j++) {
      curr[j] = Math.min(prev[j] + 1, curr[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
    prev = curr
  }
  return prev[b.length]
}

function similarity(a: string, b: string) {
  if (!a || !b) return 0
  return 1 - levenshtein(a, b) / Math.max(a.length, b.length)
}

// Spoken forms often drop the ending "ம்" / "m" ("மேஷ ராசி", "rishaba rasi"), so compare stems
function stem(word: string) {
  return word.replace(/(ம்|m)$/, "")
}

// Contiguous 1–3 word spans, spaces dropped, so "uthira dam" still compares against "uthiradam"
function spans(words: string[]) {
  const out: string[] = []
  for (let i = 0; i < words.length; i++) {
    for (let len = 1; len <= 3 && i + len <= words.length; len++) {
      out.push(stem(words.slice(i, i + len).join("")))
    }
  }
  return out
}

// Options look like "Aries (மேஷம்)"
export function matchOption(alternatives: string[], options: string[], threshold = 0.7) {
  const candidates = alternatives.flatMap(alt => spans(normalize(alt)))
  let best = { option: "", score: 0, length: 0 }

  for (const option of options) {
    const [en, ta = ""] = option.replace(")", "").split(" (")
    const aliases = [en, ta, ...(optionAliases[en] ?? [])].map(a => stem(normalize(a).join(""))).filter(Boolean)

    for (const candidate of candidates) {
      for (const alias of aliases) {
        const score = similarity(candidate, alias)
        // On a tie the longer span wins, so "uthira dam" picks uthiradam over uthiram
        if (score > best.score || (score === best.score && candidate.length > best.length)) {
          best = { option, score, length: candidate.length }
        }
      }
    }
  }

  return best.score >= threshold ? best.option : null
}

export function detectCommand(text: string): voiceCommandT | null {
  const spoken = normalize(text).join(" ")
  const found = Object.entries(commands).find(([, words]) => (words as readonly string[]).includes(spoken))
  return found ? (found[0] as voiceCommandT) : null
}

export function toDigits(text: string) {
  let out = ""
  let repeat = 1

  for (const word of normalize(text)) {
    if (word === "double") { repeat = 2; continue }
    if (word === "triple") { repeat = 3; continue }

    const digits = digitWords[word] ?? (/^\d+$/.test(word) ? word : "")
    if (!digits) continue

    out += digits[0].repeat(repeat) + digits.slice(1)
    repeat = 1
  }

  return out
}

export function toMobile(alternatives: string[]) {
  const numbers = alternatives.map(alt => {
    const digits = toDigits(alt)
    return digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits
  })
  return numbers.find(n => n.length === 10) ?? numbers.find(Boolean) ?? null
}

export function toAmount(alternatives: string[]) {
  for (const alt of alternatives) {
    const match = alt.toLowerCase().replace(/,/g, "").match(/(\d+(?:\.\d+)?)\s*(k|thousand|lakhs?|lacs?)?/)
    if (!match) continue

    const multiplier = !match[2] ? 1 : match[2].startsWith("la") ? 100000 : 1000
    return Math.round(Number(match[1]) * multiplier)
  }
  return null
}

const monthPrefixes = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"]

// "12 March 1998", "March 12th 1998", "12 3 1998", "12/03/1998" — numeric dates are day-month-year
export function toDate(alternatives: string[]) {
  const currentYear = new Date().getFullYear()

  for (const alt of alternatives) {
    const words = alt
      .toLowerCase()
      .replace(/(\d+)(st|nd|rd|th)\b/g, "$1")
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
      .split(" ")

    let month = -1
    const numbers: number[] = []
    for (const word of words) {
      const monthIndex = word.length >= 3 ? monthPrefixes.indexOf(word.slice(0, 3)) : -1
      if (month === -1 && monthIndex !== -1) month = monthIndex
      else if (/^\d{8}$/.test(word)) numbers.push(+word.slice(0, 2), +word.slice(2, 4), +word.slice(4))
      else if (/^\d+$/.test(word)) numbers.push(+word)
    }

    let day: number | undefined
    let year: number | undefined
    if (month !== -1) {
      day = numbers.find(n => n >= 1 && n <= 31)
      year = numbers.find(n => n >= 1900)
    } else if (numbers.length >= 3) {
      [day, month, year] = [numbers[0], numbers[1] - 1, numbers[2]]
    }

    if (!day || !year || year > currentYear) continue

    const date = new Date(year, month, day)
    if (date.getDate() === day && date.getMonth() === month) return date
  }

  return null
}

export function toTitleCase(text: string) {
  return text
    .trim()
    .replace(/\.$/, "")
    .replace(/(^|\s)(\p{Ll})/gu, (_, space: string, char: string) => space + char.toUpperCase())
}
