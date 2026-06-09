"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import { Check, Terminal } from "lucide-react"

import { cn } from "@/lib/utils"
import { bySlug } from "@/content/components"

/**
 * The contextual toolbar, pinned top-right (the inverse corner of the launcher),
 * the docs-site analogue of SignalRoute's `DockToolbar`. SignalRoute carries the
 * page's permanent + contextual actions here; a docs site has exactly one useful
 * page action: copy the component's install command. When there's nothing to show
 * (home, foundation) the pill is absent, mirroring the source's empty-state return.
 */
export function DockToolbar() {
  const pathname = usePathname()
  const [copied, setCopied] = React.useState(false)

  const slug = React.useMemo(() => {
    const m = pathname.match(/^\/docs\/([^/]+)\/?$/)
    return m ? m[1] : null
  }, [pathname])

  const doc = slug ? bySlug(slug) : null
  // Foundation installs via `shadcn init`, not `add`, no command to copy.
  const showInstall = !!doc && doc.slug !== "foundation"

  React.useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(t)
  }, [copied])

  if (!showInstall) return null

  const command = `npx shadcn@latest add @byronwade/${doc.slug}`
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command)
      setCopied(true)
    } catch {
      /* clipboard unavailable, no-op */
    }
  }

  return (
    <div className="pointer-events-none fixed top-3 right-3 z-50 print:hidden">
      <div className="pointer-events-auto inline-flex transform-gpu items-center rounded-3xl bg-dock p-[3px] text-dock-foreground edge">
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy install command for ${doc.name}`}
          className={cn(
            "flex h-8 items-center gap-2 rounded-full px-3 text-[13px] font-medium",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            copied
              ? "bg-dock-active text-dock-active-foreground"
              : "text-dock-foreground hover:bg-dock-active hover:text-dock-active-foreground",
          )}
        >
          {copied ? (
            <Check className="size-4 shrink-0 text-brand" strokeWidth={2.5} />
          ) : (
            <Terminal className="size-4 shrink-0" strokeWidth={2} />
          )}
          <span className="whitespace-nowrap">
            {copied ? "Copied" : "Copy install"}
          </span>
        </button>
      </div>
    </div>
  )
}
