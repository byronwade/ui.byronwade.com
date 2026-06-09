"use client"

import * as React from "react"

type DemoSurface = "app" | "marketing"
type DemoViewport = "desktop" | "tablet" | "mobile"
type DemoDensity = "compact" | "default" | "comfortable"
type DemoFrame = "default" | "inset"
type DemoDepth = "none" | "soft" | "raised"
type DemoState = "default" | "loading" | "empty" | "success" | "error"

type DemoContext = {
  surface: DemoSurface
  viewport: DemoViewport
  density: DemoDensity
  frame: DemoFrame
  depth: DemoDepth
  state: DemoState
}

const DemoViewportContext = React.createContext<DemoViewport | null>(null)
const DemoContextContext = React.createContext<DemoContext | null>(null)

function DemoViewportProvider({
  surface = "app",
  viewport,
  density = "default",
  frame = "default",
  depth = "none",
  state = "default",
  children,
}: {
  surface?: DemoSurface
  viewport: DemoViewport
  density?: DemoDensity
  frame?: DemoFrame
  depth?: DemoDepth
  state?: DemoState
  children: React.ReactNode
}) {
  const context: DemoContext = {
    surface,
    viewport,
    density,
    frame,
    depth,
    state,
  }
  return React.createElement(
    DemoContextContext.Provider,
    { value: context },
    React.createElement(
      DemoViewportContext.Provider,
      { value: viewport },
      children,
    ),
  )
}

function useDemoViewport(): DemoViewport | null {
  return React.useContext(DemoViewportContext)
}

function useDemoContext(): DemoContext | null {
  return React.useContext(DemoContextContext)
}

function useDemoDensity(): DemoDensity | null {
  return React.useContext(DemoContextContext)?.density ?? null
}

function useDemoFrame(): DemoFrame | null {
  return React.useContext(DemoContextContext)?.frame ?? null
}

function useDemoDepth(): DemoDepth | null {
  return React.useContext(DemoContextContext)?.depth ?? null
}

function useDemoState(): DemoState | null {
  return React.useContext(DemoContextContext)?.state ?? null
}

function isDemoMobile(viewport: DemoViewport | null): boolean | null {
  if (viewport == null) return null
  return viewport === "mobile"
}

export {
  DemoViewportProvider,
  useDemoViewport,
  useDemoContext,
  useDemoDensity,
  useDemoFrame,
  useDemoDepth,
  useDemoState,
  isDemoMobile,
}

export type {
  DemoContext,
  DemoDensity,
  DemoFrame,
  DemoDepth,
  DemoState,
  DemoSurface,
  DemoViewport,
}
