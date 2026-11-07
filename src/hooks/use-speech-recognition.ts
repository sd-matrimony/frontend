"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type listenOptions = {
  lang: string
  onResult: (alternatives: string[]) => void
  onSilence: () => void
  onError: (error: string) => void
}

function getRecognitionCtor() {
  if (typeof window === "undefined") return undefined
  return window.SpeechRecognition ?? window.webkitSpeechRecognition
}

export function useSpeechRecognition() {
  const [isSupported, setIsSupported] = useState(false)
  const [interim, setInterim] = useState("")
  const recognitionRef = useRef<SpeechRecognition | null>(null)

  useEffect(() => {
    setIsSupported(!!getRecognitionCtor())
  }, [])

  const abort = useCallback(() => {
    const recognition = recognitionRef.current
    recognitionRef.current = null
    setInterim("")
    recognition?.abort()
  }, [])

  const listen = useCallback(({ lang, onResult, onSilence, onError }: listenOptions) => {
    const Recognition = getRecognitionCtor()
    if (!Recognition) return

    abort()

    const recognition = new Recognition()
    recognition.lang = lang
    recognition.interimResults = true
    recognition.continuous = false
    recognition.maxAlternatives = 5

    let isDone = false
    const isCurrent = () => recognitionRef.current === recognition

    recognition.onresult = e => {
      if (!isCurrent()) return
      const result = e.results[e.results.length - 1]

      if (!result.isFinal) {
        setInterim(result[0].transcript)
        return
      }

      isDone = true
      setInterim("")
      onResult(Array.from({ length: result.length }, (_, i) => result[i].transcript.trim()))
    }

    recognition.onerror = e => {
      if (!isCurrent() || e.error === "no-speech" || e.error === "aborted") return
      isDone = true
      onError(e.error)
    }

    recognition.onend = () => {
      if (!isCurrent() || isDone) return
      onSilence()
    }

    recognitionRef.current = recognition
    recognition.start()
  }, [abort])

  useEffect(() => abort, [abort])

  return { isSupported, interim, listen, abort }
}
