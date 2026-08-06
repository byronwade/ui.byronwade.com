"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"

/**
 * Owned error boundary. uxLaws require a visible, recoverable error state on
 * every resource surface — the framework default overlay is neither designed
 * nor on-system in production.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div
      data-site="platform"
      data-surface="marketing"
      className="flex min-h-svh items-center px-4 py-24 md:px-6"
    >
      <div className="mx-auto w-full max-w-2xl">
        <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
          Error
        </p>
        <h1 className="mt-6 text-[clamp(2rem,5vw,3rem)] leading-[1.05] font-medium tracking-[-0.04em] text-foreground">
          This surface failed to render.
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted-foreground">
          The page is recoverable — retry below. If it keeps failing, the
          machine kit at{" "}
          <a
            href="/r/meridian.contract.json"
            className="font-mono text-foreground underline-offset-4 hover:underline"
          >
            /r/meridian.contract.json
          </a>{" "}
          is served statically and stays available.
        </p>
        {error.digest ? (
          <p className="mt-4 font-mono text-[11px] text-muted-foreground">
            digest {error.digest}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-2.5">
          <Button size="pill" onClick={reset}>
            Retry
          </Button>
          {/* Full document load, not client navigation: the router itself may
              be part of what failed. */}
          <Button
            size="pill"
            variant="outline"
            onClick={() => window.location.assign("/")}
          >
            Back to catalog
          </Button>
        </div>
      </div>
    </div>
  )
}
