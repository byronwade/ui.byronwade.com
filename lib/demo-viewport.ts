"use client"

import * as React from "react"

import type { DemoViewport } from "@/content/demo-contexts"

const DemoViewportContext = React.createContext<DemoViewport | null>(null)

export function DemoViewportProvider({
  viewport,
  children,
}: {
  viewport: DemoViewport
  children: React.ReactNode
}) {
  return React.createElement(
    DemoViewportContext.Provider,
    { value: viewport },
    children,
  )
}

export function useDemoViewport(): DemoViewport | null {
  return React.useContext(DemoViewportContext)
}

export function isDemoMobile(viewport: DemoViewport | null): boolean | null {
  if (viewport == null) return null
  return viewport === "mobile"
}
