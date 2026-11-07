"use client";

import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Mic, MicOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { fieldList } from './data';

import { detectCommand, matchOption, toAmount, toDate, toMobile, toTitleCase } from '@/utils/voice-match';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useStatics } from '@/hooks/use-general';

import { Button } from '@glraj/ui/button';

type voiceFieldT = {
  name: string
  type: "text" | "tel" | "number" | "date" | "option"
  listName?: "raasi" | "nakshatra"
  items?: string[]
}

type props = {
  children: ReactNode
}

// Pink label with a pulsing dot, applied to the field container (Tailwind arbitrary variants)
const highlightClasses = [
  "[&>[data-slot=field-label]]:text-pink-600",
  "[&>[data-slot=field-label]]:before:size-2",
  "[&>[data-slot=field-label]]:before:self-center",
  "[&>[data-slot=field-label]]:before:rounded-full",
  "[&>[data-slot=field-label]]:before:bg-red-500",
  "[&>[data-slot=field-label]]:before:animate-pulse",
]
const voiceSelects = ["gender", "otherDetails.houseType"]

const voiceFields: voiceFieldT[] = fieldList
  .filter(section => section.sectionId !== "account")
  .flatMap(section => section.list)
  .flatMap<voiceFieldT>(field => {
    if (field.type === "text" || field.type === "tel" || field.type === "number" || field.type === "date") {
      return [{ name: field.name, type: field.type }]
    }
    if (field.type === "combobox" && (field.listName === "raasi" || field.listName === "nakshatra")) {
      return [{ name: field.name, type: "option", listName: field.listName }]
    }
    if (field.type === "select" && voiceSelects.includes(field.name)) {
      return [{ name: field.name, type: "option", items: toStrings(field.items) }]
    }
    return []
  })
  .sort((a, b) => Number(b.type === "tel") - Number(a.type === "tel"))

function toStrings(data: unknown) {
  return Array.isArray(data) ? data.filter((v): v is string => typeof v === "string") : []
}

function getFieldEl(index: number) {
  const el = document.getElementById(voiceFields[index].name)
  return el && el.offsetParent !== null ? el : null
}

export function VoiceFill({ children }: props) {
  const t = useTranslations("shared.voiceFill")
  const tf = useTranslations("shared.createUserFields")
  const { getValues, setValue } = useFormContext()

  const { data: raasi } = useStatics("raasi")
  const { data: nakshatra } = useStatics("nakshatra")
  const optionsRef = useRef({ raasi: [] as string[], nakshatra: [] as string[] })
  optionsRef.current = { raasi: toStrings(raasi), nakshatra: toStrings(nakshatra) }

  const { isSupported, interim, listen, abort } = useSpeechRecognition()
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [message, setMessage] = useState("")

  const activeRef = useRef<number | null>(null)
  const highlightedRef = useRef<Element | null>(null)

  function isFilled(index: number) {
    const value: unknown = getValues(voiceFields[index].name)
    return value instanceof Date || (typeof value === "string" && value.trim() !== "")
  }

  function findNext(from: number) {
    for (let i = from; i < voiceFields.length; i++) {
      if (getFieldEl(i) && !isFilled(i)) return i
    }
    return null
  }

  function findPrev(from: number) {
    for (let i = from; i >= 0; i--) {
      if (getFieldEl(i)) return i
    }
    return null
  }

  function parseValue(field: voiceFieldT, alternatives: string[]) {
    if (field.type === "tel") return toMobile(alternatives)
    if (field.type === "number") return toAmount(alternatives)
    if (field.type === "date") return toDate(alternatives)
    if (field.type === "option") {
      const options = field.items ?? (field.listName ? optionsRef.current[field.listName] : [])
      return matchOption(alternatives, options)
    }
    return toTitleCase(alternatives[0]) || null
  }

  function startListening(index: number) {
    const field = voiceFields[index]

    listen({
      lang: field.type === "option" ? "ta-IN" : "en-IN",
      onResult: alternatives => handleResult(index, alternatives),
      onSilence: () => startListening(index),
      onError: error => {
        activate(null)
        setMessage(error === "not-allowed" ? t("micBlocked") : t("failed"))
      },
    })
  }

  function activate(index: number | null) {
    highlightedRef.current?.classList.remove(...highlightClasses)
    highlightedRef.current = null
    activeRef.current = index
    setActiveIndex(index)
    setMessage("")

    if (index === null) {
      abort()
      return
    }

    const el = getFieldEl(index)
    if (el) {
      el.focus({ preventScroll: true })
      el.scrollIntoView({ block: "center", behavior: "smooth" })
      highlightedRef.current = el.closest('[data-slot="field"]')
      highlightedRef.current?.classList.add(...highlightClasses)
    }

    startListening(index)
  }

  function goNext(index: number) {
    activate(findNext(index + 1))
  }

  function handleResult(index: number, alternatives: string[]) {
    const field = voiceFields[index]
    const command = detectCommand(alternatives[0])

    if (command === "stop") return activate(null)
    if (command === "next") return goNext(index)
    if (command === "back") return activate(findPrev(index - 1) ?? index)
    if (command === "clear") {
      setValue(field.name, field.type === "date" ? undefined : "", { shouldDirty: true })
      return startListening(index)
    }

    const value = parseValue(field, alternatives)
    if (value === null) {
      if (alternatives[0]) setMessage(t("notMatched", { text: alternatives[0] }))
      return startListening(index)
    }

    setValue(field.name, value, { shouldValidate: true, shouldDirty: true })
    // Wait for the input to re-render so its blur handler (mobile duplicate check) sees the new value
    requestAnimationFrame(() => {
      if (activeRef.current === index) goNext(index)
    })
  }

  // Resume from the field in focus: itself if empty, otherwise the next empty field after it
  function findStart() {
    const focused = document.activeElement
    if (!(focused instanceof HTMLElement) || !focused.closest("form")) return findNext(0)

    const focusedIndex = voiceFields.findIndex(f => f.name === focused.id)
    if (focusedIndex !== -1) return isFilled(focusedIndex) ? findNext(focusedIndex + 1) : focusedIndex

    const after = voiceFields.findIndex((_, i) => {
      const el = getFieldEl(i)
      return !!el && !isFilled(i) && !!(focused.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)
    })
    return after !== -1 ? after : findNext(0)
  }

  function toggle() {
    if (activeRef.current !== null) return activate(null)

    const first = findStart()
    activate(first)
    if (first === null) setMessage(t("done"))
  }

  const handlersRef = useRef({ activate, toggle })
  handlersRef.current = { activate, toggle }

  useEffect(() => {
    function onFocusIn(e: FocusEvent) {
      const target = e.target
      if (activeRef.current === null || !(target instanceof HTMLElement)) return
      const index = voiceFields.findIndex(f => f.name === target.id)
      if (index !== -1 && index !== activeRef.current) handlersRef.current.activate(index)
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.altKey && e.key.toLowerCase() === "v") {
        e.preventDefault()
        handlersRef.current.toggle()
      }
    }

    document.addEventListener("focusin", onFocusIn)
    document.addEventListener("keydown", onKeyDown)
    return () => {
      document.removeEventListener("focusin", onFocusIn)
      document.removeEventListener("keydown", onKeyDown)
      highlightedRef.current?.classList.remove(...highlightClasses)
    }
  }, [])

  if (!isSupported) return <div className="grid">{children}</div>

  const active = activeIndex === null ? null : voiceFields[activeIndex]
  const status = interim || message || (active ? t("listening") : "")

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant={active ? "destructive" : "outline"}
        className="shrink-0"
        // Keep focus on the current field so voice fill can resume from it
        onMouseDown={e => e.preventDefault()}
        onClick={toggle}
        title="Alt+V"
      >
        {active ? <MicOff /> : <Mic />}
        {active ? t("stop") : t("start")}
      </Button>

      <div className="flex-1 min-w-0 text-sm">
        {status && (
          <p className="truncate text-gray-600">
            {active && (
              <>
                <span className="mr-1.5 inline-block size-2 rounded-full bg-red-500 animate-pulse" />
                <span className="font-medium">{tf(active.name)}: </span>
              </>
            )}
            {status}
          </p>
        )}
        {active && <p className="truncate text-xs text-gray-400">{t("hint")}</p>}
      </div>

      {children}
    </div>
  )
}
