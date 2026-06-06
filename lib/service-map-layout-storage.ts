"use client"

import { useCallback, useRef, useState } from "react"
import type { Viewport } from "@xyflow/react"

export interface ServiceMapLayoutState {
  positions: Record<string, { x: number; y: number }>
  viewport: Viewport | null
}

const DEFAULT_LAYOUT: ServiceMapLayoutState = {
  positions: {},
  viewport: null,
}

function readLayout(storageKey: string): ServiceMapLayoutState {
  if (typeof window === "undefined") return DEFAULT_LAYOUT
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return DEFAULT_LAYOUT
    return JSON.parse(raw) as ServiceMapLayoutState
  } catch {
    return DEFAULT_LAYOUT
  }
}

export function useServiceMapLayout(key: string) {
  const storageKey = `service-map-layout:${key}`
  const storageKeyRef = useRef(storageKey)
  storageKeyRef.current = storageKey

  const [layout, setLayoutState] = useState<ServiceMapLayoutState>(() =>
    readLayout(storageKey),
  )

  const setLayout = useCallback(
    (
      updater:
        | ServiceMapLayoutState
        | ((prev: ServiceMapLayoutState) => ServiceMapLayoutState),
    ) => {
      setLayoutState((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater
        try {
          localStorage.setItem(storageKeyRef.current, JSON.stringify(next))
        } catch {
          /* quota */
        }
        return next
      })
    },
    [],
  )

  return [layout, setLayout] as const
}
