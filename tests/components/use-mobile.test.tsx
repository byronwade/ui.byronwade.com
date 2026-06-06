/**
 * Tests for useIsMobile (@/lib/use-mobile) — 768px viewport breakpoint hook.
 */

import { render, renderHook, act, waitFor, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, it, expect, vi } from "vitest"

import { DemoViewportProvider } from "@/lib/demo-viewport"
import { useIsMobile } from "@/lib/use-mobile"

type MatchMediaListener = (event: MediaQueryListEvent) => void

function createMatchMediaMock(initialMatches: boolean) {
  let matches = initialMatches
  let listener: MatchMediaListener | null = null

  const mql = {
    get matches() {
      return matches
    },
    media: "(max-width: 767px)",
    onchange: null,
    addEventListener: vi.fn((_event: string, cb: MatchMediaListener) => {
      listener = cb
    }),
    removeEventListener: vi.fn((_event: string, cb: MatchMediaListener) => {
      if (listener === cb) listener = null
    }),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }

  return {
    mql,
    setMatches(next: boolean) {
      matches = next
      listener?.({ matches: next } as MediaQueryListEvent)
    },
  }
}

function Probe() {
  const mobile = useIsMobile()
  return <div data-testid="mobile">{mobile ? "mobile" : "desktop"}</div>
}

describe("useIsMobile", () => {
  let matchMediaMock: ReturnType<typeof createMatchMediaMock>

  function mockMatchMedia(matches: boolean) {
    matchMediaMock = createMatchMediaMock(matches)
    vi.stubGlobal("matchMedia", vi.fn().mockReturnValue(matchMediaMock.mql))
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: matches ? 500 : 1024,
    })
  }

  beforeEach(() => {
    mockMatchMedia(false)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("returns false for desktop-width viewports", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 })
    const { result } = renderHook(() => useIsMobile())
    await waitFor(() => {
      expect(result.current).toBe(false)
    })
  })

  it("returns true for mobile-width viewports", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 500 })
    const { result } = renderHook(() => useIsMobile())
    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  it("updates when matchMedia change fires", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 })
    const { result } = renderHook(() => useIsMobile())
    await waitFor(() => {
      expect(result.current).toBe(false)
    })

    Object.defineProperty(window, "innerWidth", { configurable: true, value: 500 })
    act(() => {
      matchMediaMock.setMatches(true)
    })

    await waitFor(() => {
      expect(result.current).toBe(true)
    })
  })

  it("registers and cleans up a matchMedia listener", async () => {
    const { unmount } = renderHook(() => useIsMobile())
    await waitFor(() => {
      expect(matchMediaMock.mql.addEventListener).toHaveBeenCalled()
    })
    unmount()
    expect(matchMediaMock.mql.removeEventListener).toHaveBeenCalled()
  })

  it("returns true when demo viewport is mobile regardless of window width", async () => {
    mockMatchMedia(false)
    render(
      <DemoViewportProvider viewport="mobile">
        <Probe />
      </DemoViewportProvider>,
    )
    await waitFor(() => {
      expect(screen.getByTestId("mobile")).toHaveTextContent("mobile")
    })
  })

  it("returns false when demo viewport is desktop on narrow window", async () => {
    mockMatchMedia(true)
    render(
      <DemoViewportProvider viewport="desktop">
        <Probe />
      </DemoViewportProvider>,
    )
    await waitFor(() => {
      expect(screen.getByTestId("mobile")).toHaveTextContent("desktop")
    })
  })
})
