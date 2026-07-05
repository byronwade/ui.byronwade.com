"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { ArrowElbowDownLeft, Cube, Hash, MagnifyingGlass } from "@/lib/icons"

import { cn } from "@/lib/utils"
import { searchIndex, type SearchEntry } from "@/content/search-index"

const ENTRIES = searchIndex

function score(entry: SearchEntry, q: string): boolean {
  if (!q) return true
  const hay =
    `${entry.label} ${entry.meta ?? ""} ${entry.keywords ?? ""}`.toLowerCase()
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((tok) => hay.includes(tok))
}

/** Hash-aware navigation (smooth-scroll if the anchor is on the current page). */
function go(href: string, router: ReturnType<typeof useRouter>) {
  const hash = href.indexOf("#")
  if (hash === -1) return router.push(href)
  const path = href.slice(0, hash) || "/"
  const id = href.slice(hash + 1)
  const here = typeof window !== "undefined" ? window.location.pathname : ""
  const el =
    here === path && typeof document !== "undefined"
      ? document.getElementById(id)
      : null
  if (el) {
    el.scrollIntoView({ behavior: "smooth" })
    history.replaceState(null, "", href)
  } else {
    router.push(href)
  }
}

/**
 * Command palette — a centered, keyboard-first search over the whole site.
 * Opened by ⌘K / Ctrl-K, the header search button, or the `open-command-palette`
 * event. Token-styled (calm popover surface + hairline), not dock chrome.
 */
export function CommandPalette() {
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const [active, setActive] = React.useState(0)

  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLDivElement>(null)

  const results = React.useMemo(
    () => ENTRIES.filter((e) => score(e, query)),
    [query],
  )
  const sections = results.filter((e) => e.kind === "Section")
  const components = results.filter((e) => e.kind === "Component")
  const flat = React.useMemo(
    () => [...sections, ...components],
    [sections, components],
  )

  const close = React.useCallback(() => {
    setOpen(false)
    setQuery("")
    setActive(0)
  }, [])

  const run = React.useCallback(
    (href: string) => {
      close()
      go(href, router)
    },
    [close, router],
  )

  // Close on route change.
  const [lastPath, setLastPath] = React.useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    if (open) close()
  }

  // ⌘K toggle + external open event.
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault()
        setOpen((p) => !p)
      }
    }
    const onOpen = () => setOpen(true)
    window.addEventListener("keydown", onKey)
    window.addEventListener("open-command-palette", onOpen)
    return () => {
      window.removeEventListener("keydown", onKey)
      window.removeEventListener("open-command-palette", onOpen)
    }
  }, [])

  // Focus the field when opened.
  React.useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true })
  }, [open])

  // Esc to close.
  React.useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        close()
      }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open, close])

  const safeActive = Math.min(active, Math.max(0, flat.length - 1))
  React.useEffect(() => {
    if (!open) return
    listRef.current
      ?.querySelector<HTMLElement>(`[data-idx="${safeActive}"]`)
      ?.scrollIntoView({ block: "nearest" })
  }, [safeActive, open])

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActive(Math.min(safeActive + 1, flat.length - 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActive(Math.max(safeActive - 1, 0))
    } else if (e.key === "Enter") {
      e.preventDefault()
      const hit = flat[safeActive]
      if (hit) run(hit.href)
    }
  }

  if (!open) return null

  const Row = (entry: SearchEntry, idx: number) => (
    <button
      key={entry.href}
      type="button"
      data-idx={idx}
      onMouseMove={() => setActive(idx)}
      onClick={() => run(entry.href)}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm outline-none transition-colors",
        idx === safeActive
          ? "bg-brand/10 text-foreground"
          : "text-muted-foreground hover:bg-muted/40",
      )}
    >
      {entry.kind === "Section" ? (
        <Hash className="size-4 shrink-0 opacity-70" />
      ) : (
        <Cube className="size-4 shrink-0 opacity-70" />
      )}
      <span className="flex-1 truncate text-foreground">{entry.label}</span>
      {entry.meta && (
        <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
          {entry.meta}
        </span>
      )}
    </button>
  )

  let cursor = 0

  return (
    <div className="fixed inset-0 z-[60] print:hidden">
      {/* backdrop */}
      <button
        type="button"
        aria-label="Close search"
        onClick={close}
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in duration-150"
      />
      {/* panel */}
      <div
        role="dialog"
        aria-label="Search"
        className="animate-in fade-in slide-in-from-top-2 duration-200 absolute left-1/2 top-[12vh] w-[min(36rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-2xl bg-popover text-popover-foreground edge depth-600"
      >
        {/* query field */}
        <div className="flex items-center gap-2.5 border-b border-border px-3.5 py-3">
          <MagnifyingGlass className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActive(0)
            }}
            onKeyDown={onInputKey}
            placeholder="Search components, sections, templates…"
            aria-label="Search"
            className="h-6 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
            esc
          </kbd>
        </div>

        {/* results */}
        <div
          ref={listRef}
          className="scrollbar-thin max-h-[min(24rem,60vh)] overflow-y-auto p-1.5"
        >
          {flat.length === 0 ? (
            <div className="px-2.5 py-8 text-center text-sm text-muted-foreground">
              No results for “{query}”.
            </div>
          ) : (
            <>
              {sections.length > 0 && (
                <div className="mb-1">
                  <div className="px-2.5 pb-1 pt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    Pages &amp; sections
                  </div>
                  {sections.map((e) => Row(e, cursor++))}
                </div>
              )}
              {components.length > 0 && (
                <div>
                  <div className="px-2.5 pb-1 pt-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                    Components
                  </div>
                  {components.map((e) => Row(e, cursor++))}
                </div>
              )}
            </>
          )}
        </div>

        {/* footer hints */}
        <div className="flex items-center gap-3 border-t border-border bg-muted/30 px-3.5 py-2 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-border bg-muted px-1 font-mono">
              ↑↓
            </kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="flex items-center rounded border border-border bg-muted px-1 font-mono">
              <ArrowElbowDownLeft className="size-3" />
            </kbd>
            open
          </span>
          <span className="ml-auto font-mono tabular-nums">
            {flat.length} results
          </span>
        </div>
      </div>
    </div>
  )
}
