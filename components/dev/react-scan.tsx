"use client"

import { useEffect } from "react"

/**
 * React Scan render overlay — development only.
 *
 * `react-scan init` writes a <script> tag pointing at unpkg. That loads an
 * unpinned third-party bundle into the app shell on every dev page; the
 * package is already a devDependency, so import it instead and keep the
 * supply chain local and version-locked.
 *
 * Renders nothing. Dynamic import so the library never enters a production
 * bundle.
 */
function ReactScan() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return
    let cancelled = false
    const start = async () => {
      try {
        const { scan } = await import("react-scan")
        if (!cancelled) scan({ enabled: true })
      } catch {
        /* Overlay is optional; never break the app because it failed. */
      }
    }
    void start()
    return () => {
      cancelled = true
    }
  }, [])

  return null
}

export { ReactScan }
