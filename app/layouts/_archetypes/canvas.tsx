"use client"

// Canvas archetype, a full-bleed spatial map with floating glass overlays.
// uses: InputGroup, Button, StatusPill, StatusDot, GradientAvatar, FilterPill, Separator
import * as React from "react"
import {
  Bookmark,
  Clock,
  Locate,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Search,
  Star,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { GradientAvatar } from "@/components/ui/gradient-avatar"
import { Separator } from "@/components/ui/separator"
import { StatusDot, type StatusTone } from "@/components/ui/status-dot"
import { StatusPill } from "@/components/status-pill"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

interface Place {
  id: string
  name: string
  category: string
  rating: number
  distance: string
  open: boolean
  x: number
  y: number
  tone: StatusTone
}

const places: Place[] = [
  {
    id: "p1",
    name: "Cartographer Coffee",
    category: "Café · $$",
    rating: 4.8,
    distance: "0.3 mi",
    open: true,
    x: 38,
    y: 42,
    tone: "success",
  },
  {
    id: "p2",
    name: "Meridian Books",
    category: "Bookstore",
    rating: 4.6,
    distance: "0.5 mi",
    open: true,
    x: 62,
    y: 32,
    tone: "info",
  },
  {
    id: "p3",
    name: "North Pier Market",
    category: "Grocery · $",
    rating: 4.4,
    distance: "0.7 mi",
    open: false,
    x: 55,
    y: 62,
    tone: "warning",
  },
  {
    id: "p4",
    name: "Atlas Athletic Club",
    category: "Gym",
    rating: 4.2,
    distance: "1.1 mi",
    open: true,
    x: 26,
    y: 68,
    tone: "neutral",
  },
]

export function CanvasArchetype() {
  const [activeId, setActiveId] = React.useState(places[0].id)
  const active = places.find((p) => p.id === activeId) ?? places[0]

  return (
    <div className="relative h-dvh overflow-hidden bg-muted/40 text-foreground">
      {/* ── Map canvas (pure CSS terrain) ─────────────────────────── */}
      <div aria-hidden className="absolute inset-0">
        <div className="bg-grid absolute inset-0 opacity-[0.4]" />
        <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-success/5" />
        {/* water */}
        <div className="absolute -right-24 -top-24 size-[460px] rotate-12 rounded-[40%] bg-brand/10 blur-[2px]" />
        <div className="absolute bottom-[-120px] left-[-60px] size-[380px] rounded-[45%] bg-brand/10" />
        {/* parkland */}
        <div className="absolute left-[18%] top-[14%] size-48 rounded-[42%] bg-success/10" />
        {/* roads */}
        <div className="absolute left-0 top-[38%] h-px w-full rotate-[-4deg] bg-border" />
        <div className="absolute left-0 top-[64%] h-px w-full rotate-[2deg] bg-border" />
        <div className="absolute left-[44%] top-0 h-full w-px rotate-[3deg] bg-border" />
        <div className="absolute left-[70%] top-0 h-full w-px -rotate-[5deg] bg-border/70" />
      </div>

      {/* ── Pins ───────────────────────────────────────────────────── */}
      {places.map((p) => {
        const isActive = p.id === activeId
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => setActiveId(p.id)}
            aria-label={p.name}
            aria-pressed={isActive}
            className="group absolute -translate-x-1/2 -translate-y-full outline-none"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <span
              className={cn(
                "relative grid place-items-center rounded-full border shadow-float transition-all",
                isActive
                  ? "size-9 border-brand bg-brand text-brand-foreground"
                  : "size-7 border-border bg-card text-foreground group-hover:-translate-y-0.5",
              )}
            >
              <MapPin className={isActive ? "size-4.5" : "size-3.5"} />
            </span>
            <span className="mx-auto block size-1.5 -translate-y-1 rotate-45 bg-card shadow-float" />
            {isActive && (
              <span className="absolute left-1/2 top-[-2.1rem] -translate-x-1/2 whitespace-nowrap rounded-full bg-card px-2.5 py-1 text-xs font-medium shadow-float">
                {p.name}
              </span>
            )}
          </button>
        )
      })}

      {/* ── Top search bar (floating glass) ───────────────────────── */}
      <div className="absolute inset-x-3 top-3 z-10 flex items-center gap-2 sm:inset-x-4 sm:top-4">
        <div className="flex flex-1 items-center gap-2 rounded-full bg-card/80 p-1.5 pl-2 shadow-float backdrop-blur">
          <InputGroup className="flex-1 border-0 bg-transparent shadow-none">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search this area…"
              defaultValue="Near Mission District"
            />
          </InputGroup>
          <div className="hidden items-center gap-1.5 sm:flex">
            <button
              type="button"
              aria-pressed="true"
              className="inline-flex h-8 items-center rounded-full border border-brand bg-brand/10 px-3 text-sm font-medium text-brand outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Open now
            </button>
            <button
              type="button"
              className="inline-flex h-8 items-center rounded-full border border-border bg-background px-3 text-sm font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              Top rated
            </button>
          </div>
          <GradientAvatar seed="byron" size="sm" className="mr-0.5" />
        </div>
      </div>

      {/* ── Results panel (floating, left) ────────────────────────── */}
      <aside className="absolute left-3 top-20 z-10 hidden w-80 flex-col overflow-hidden rounded-2xl bg-card/85 shadow-float backdrop-blur lg:flex sm:left-4">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-semibold tracking-tight">
            {places.length} places nearby
          </p>
          <span className="text-xs text-muted-foreground">
            Mission District
          </span>
        </div>
        <Separator />
        <div className="max-h-[min(60vh,420px)] divide-y divide-border overflow-y-auto">
          {places.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActiveId(p.id)}
              data-active={p.id === activeId}
              className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60 data-[active=true]:bg-muted"
            >
              <StatusDot tone={p.tone} className="mt-1.5 shrink-0" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-medium">{p.name}</span>
                  <span className="flex shrink-0 items-center gap-0.5 text-xs font-medium">
                    <Star className="size-3 fill-warning text-warning" />
                    {p.rating}
                  </span>
                </span>
                <span className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{p.category}</span>
                  <span aria-hidden>·</span>
                  <span className="shrink-0">{p.distance}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </aside>

      {/* ── Selected detail card (floating, bottom) ───────────────── */}
      <div className="absolute inset-x-3 bottom-3 z-10 sm:inset-x-auto sm:bottom-4 sm:left-4 sm:w-80 lg:left-[21rem]">
        <div className="overflow-hidden rounded-2xl bg-card/90 shadow-float backdrop-blur">
          <div className="h-20 bg-gradient-to-br from-brand/25 to-success/20" />
          <div className="space-y-3 p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="truncate text-base font-semibold tracking-tight">
                  {active.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {active.category}
                </p>
              </div>
              <StatusPill tone={active.open ? "success" : "danger"}>
                {active.open ? "Open" : "Closed"}
              </StatusPill>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Star className="size-3.5 fill-warning text-warning" />
                {active.rating}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3.5" />
                Closes 9 PM
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" />
                {active.distance}
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1">
                <Navigation data-icon="inline-start" />
                Directions
              </Button>
              <Button size="sm" variant="outline">
                <Bookmark data-icon="inline-start" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Map controls (floating, bottom-right) ─────────────────── */}
      <div className="absolute bottom-4 right-3 z-10 flex flex-col gap-2 sm:right-4">
        <div className="flex flex-col overflow-hidden rounded-full bg-card/85 shadow-float backdrop-blur">
          <button
            type="button"
            aria-label="Zoom in"
            className="grid size-9 place-items-center transition-colors hover:bg-muted"
          >
            <Plus className="size-4" />
          </button>
          <Separator />
          <button
            type="button"
            aria-label="Zoom out"
            className="grid size-9 place-items-center transition-colors hover:bg-muted"
          >
            <Minus className="size-4" />
          </button>
        </div>
        <button
          type="button"
          aria-label="Recenter"
          className="grid size-9 place-items-center rounded-full bg-card/85 text-brand shadow-float backdrop-blur transition-colors hover:bg-muted"
        >
          <Locate className="size-4" />
        </button>
      </div>
    </div>
  )
}
