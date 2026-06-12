"use client"

// Studio archetype, a now-playing media surface built around one big artwork.
// uses: Button, Badge, StatusPill, GradientAvatar, ScrollArea, Separator, InputGroup
import * as React from "react"
import {
  Heart,
  MagnifyingGlass,
  Pause,
  Play,
  Playlist,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  SpeakerHigh,
} from "@/lib/icons"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GradientAvatar } from "@/components/ui/gradient-avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { StatusPill } from "@/components/status-pill"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

interface Track {
  id: string
  title: string
  artist: string
  length: string
  seed: string
}

const queue: Track[] = [
  {
    id: "t1",
    title: "Parallax",
    artist: "Holloway",
    length: "4:12",
    seed: "parallax",
  },
  {
    id: "t2",
    title: "Slow Tide",
    artist: "Mirena",
    length: "3:48",
    seed: "slowtide",
  },
  {
    id: "t3",
    title: "Northbound",
    artist: "Holloway",
    length: "5:02",
    seed: "northbound",
  },
  {
    id: "t4",
    title: "Glasshouse",
    artist: "VELD",
    length: "3:21",
    seed: "glasshouse",
  },
  {
    id: "t5",
    title: "Afterglow",
    artist: "Mirena",
    length: "4:40",
    seed: "afterglow",
  },
]

// Deterministic waveform amplitudes (0–1) so SSR and client agree.
const wave = Array.from({ length: 56 }, (_, i) => {
  const v = Math.sin(i * 0.55) * 0.5 + Math.sin(i * 0.21 + 1.3) * 0.35 + 0.55
  return Math.min(1, Math.max(0.18, v))
})

const PROGRESS = 0.42

export function StudioArchetype() {
  const [playing, setPlaying] = React.useState(true)
  const now = queue[0]

  return (
    <div className="flex h-dvh flex-col bg-background text-foreground">
      <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border px-4 sm:px-6">
        <div className="flex items-center gap-2 font-medium tracking-tight">
          <span className="grid size-6 place-items-center rounded-md bg-brand text-brand-foreground">
            <Playlist className="size-3.5" />
          </span>
          Resonate
        </div>
        <div className="hidden w-full max-w-sm sm:block">
          <InputGroup>
            <InputGroupAddon>
              <MagnifyingGlass />
            </InputGroupAddon>
            <InputGroupInput placeholder="Search songs, artists, albums…" />
          </InputGroup>
        </div>
        <GradientAvatar seed="byron" size="sm" />
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px]">
        {/* ── Now playing centerpiece ─────────────────────────────── */}
        <section className="flex min-h-0 flex-col items-center justify-center gap-6 overflow-hidden px-6 py-8">
          <div className="relative">
            <div
              className="size-56 rounded-3xl edge sm:size-64"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 28% 24%, var(--brand), color-mix(in oklch, var(--brand), #000 55%))",
              }}
            />
            {/* reflection */}
            <div
              className="absolute inset-x-6 top-full h-16 rounded-3xl opacity-30 blur-md"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 50% 0%, var(--brand), transparent 70%)",
              }}
            />
          </div>

          <div className="w-full max-w-md space-y-4 text-center">
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-medium tracking-tight">
                  {now.title}
                </h1>
                <StatusPill tone="info">Lossless</StatusPill>
              </div>
              <p className="text-sm text-muted-foreground">
                {now.artist} · Drift Sessions
              </p>
            </div>

            {/* waveform progress */}
            <div className="space-y-1.5">
              <div className="flex h-14 items-center gap-0.5">
                {wave.map((amp, i) => {
                  const played = i / wave.length < PROGRESS
                  return (
                    <span
                      key={i}
                      className={cn(
                        "flex-1 rounded-full transition-colors",
                        played ? "bg-brand" : "bg-muted-foreground/25",
                      )}
                      style={{ height: `${Math.round(amp * 100)}%` }}
                    />
                  )
                })}
              </div>
              <div className="flex justify-between font-mono text-[11px] text-muted-foreground">
                <span>1:46</span>
                <span>{now.length}</span>
              </div>
            </div>

            {/* transport */}
            <div className="flex items-center justify-center gap-3">
              <Button variant="ghost" size="icon" aria-label="Shuffle">
                <Shuffle />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Previous">
                <SkipBack />
              </Button>
              <Button
                size="icon-lg"
                aria-label={playing ? "Pause" : "Play"}
                aria-pressed={playing}
                onClick={() => setPlaying((p) => !p)}
                className="size-12"
              >
                {playing ? (
                  <Pause className="size-5" />
                ) : (
                  <Play className="size-5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" aria-label="Next">
                <SkipForward />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Repeat">
                <Repeat />
              </Button>
            </div>
          </div>
        </section>

        {/* ── Queue rail ──────────────────────────────────────────── */}
        <aside className="hidden min-h-0 flex-col border-l border-border lg:flex">
          <div className="flex items-center justify-between px-4 py-3.5">
            <p className="text-sm font-medium tracking-tight">Up next</p>
            <Badge variant="secondary">{queue.length} tracks</Badge>
          </div>
          <Separator />
          <ScrollArea className="min-h-0 flex-1">
            <ul className="p-2">
              {queue.map((t, i) => {
                const isNow = i === 0
                return (
                  <li key={t.id}>
                    <button
                      type="button"
                      data-active={isNow}
                      className="group flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-muted data-[active=true]:bg-muted"
                    >
                      <span className="relative shrink-0">
                        <GradientAvatar
                          seed={t.seed}
                          size="lg"
                          className="rounded-lg"
                        />
                        {isNow && playing && (
                          <span className="absolute inset-0 grid place-items-center rounded-lg bg-background/55">
                            <Equalizer />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={cn(
                            "block truncate text-sm",
                            isNow ? "font-semibold text-brand" : "font-medium",
                          )}
                        >
                          {t.title}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {t.artist}
                        </span>
                      </span>
                      <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                        {t.length}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </ScrollArea>
        </aside>
      </div>

      {/* ── Bottom player bar ─────────────────────────────────────── */}
      <div className="flex h-16 shrink-0 items-center gap-4 border-t border-border px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <GradientAvatar seed={now.seed} size="lg" className="rounded-lg" />
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{now.title}</p>
            <p className="truncate text-xs text-muted-foreground">
              {now.artist}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Like"
            className="hidden text-brand sm:inline-flex"
          >
            <Heart className="fill-brand" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" aria-label="Previous">
            <SkipBack />
          </Button>
          <Button
            size="icon"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => setPlaying((p) => !p)}
          >
            {playing ? <Pause /> : <Play />}
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Next">
            <SkipForward />
          </Button>
        </div>

        <div className="hidden flex-1 items-center justify-end gap-2 sm:flex">
          <SpeakerHigh className="size-4 text-muted-foreground" />
          <div className="h-1 w-24 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-2/3 rounded-full bg-foreground/60" />
          </div>
        </div>
      </div>
    </div>
  )
}

function Equalizer() {
  return (
    <span className="flex items-end gap-0.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-0.5 animate-pulse rounded-full bg-brand"
          style={{
            height: `${[10, 14, 8][i]}px`,
            animationDelay: `${i * 150}ms`,
          }}
        />
      ))}
    </span>
  )
}
