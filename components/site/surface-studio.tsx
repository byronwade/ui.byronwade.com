/**
 * App-like surface studio — switch lanes in one chrome shell.
 * Marketing page that feels like product navigation.
 */
"use client"

import { useState } from "react"
import { Workbench } from "@/components/surfaces/workbench"
import { ComposerShell } from "@/components/surfaces/composer-shell"
import { MarketingFrame } from "@/components/surfaces/marketing-frame"
import { MobileFrame } from "@/components/surfaces/mobile-frame"
import { DesktopFrame } from "@/components/surfaces/desktop-frame"
import { Button } from "@/components/ui/button"
import { designCn, radiusIntent } from "@/lib/design"
import { surfaces } from "@/lib/surfaces"
import { cn } from "@/lib/utils"

const lanes = [
  {
    id: "workbench",
    label: "Workbench",
    meta: "application · agent",
    Demo: Workbench,
  },
  {
    id: "composer",
    label: "Composer",
    meta: "desktop · bound AI",
    Demo: ComposerShell,
  },
  {
    id: "marketing",
    label: "Marketing",
    meta: "theater lane",
    Demo: MarketingFrame,
  },
  {
    id: "mobile",
    label: "Mobile",
    meta: "touch density",
    Demo: MobileFrame,
  },
  {
    id: "desktop",
    label: "Desktop",
    meta: "wide chrome",
    Demo: DesktopFrame,
  },
] as const

type LaneId = (typeof lanes)[number]["id"]

type SurfaceStudioProps = {
  className?: string
}

function SurfaceStudio({ className }: SurfaceStudioProps) {
  const [lane, setLane] = useState<LaneId>("workbench")
  const active = lanes.find((l) => l.id === lane) ?? lanes[0]
  const Demo = active.Demo
  const surfaceMeta = surfaces.find(
    (s) =>
      s.id ===
      (lane === "workbench" || lane === "composer" ? "application" : lane),
  )

  return (
    <div
      className={designCn(
        "flex min-h-[36rem] flex-col overflow-hidden bg-card edge md:min-h-[40rem]",
        radiusIntent("shell"),
        className,
      )}
    >
      <header className="flex flex-col gap-3 border-b border-border bg-muted/20 px-3 py-3 md:flex-row md:items-center md:gap-4 md:px-4">
        <div className="min-w-0 shrink-0">
          <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
            Surface studio
          </p>
          <p className="text-sm font-medium tracking-tight">Try the lanes</p>
        </div>
        <nav
          className="flex min-w-0 flex-1 gap-1 overflow-x-auto pb-0.5"
          aria-label="Surface lanes"
        >
          {lanes.map((item) => (
            <Button
              key={item.id}
              type="button"
              size="sm"
              variant="ghost"
              aria-pressed={lane === item.id}
              onClick={() => setLane(item.id)}
              className={cn(
                "h-8 shrink-0 px-2.5 text-[12px]",
                radiusIntent("control"),
                lane === item.id && "bg-brand/10 text-foreground",
              )}
            >
              {item.label}
            </Button>
          ))}
        </nav>
        <p className="hidden shrink-0 font-mono text-[11px] text-muted-foreground lg:block">
          {active.meta}
        </p>
      </header>

      <div className="grid min-h-0 flex-1 lg:grid-cols-[1fr_13rem]">
        <div className="min-w-0 bg-muted/15 p-3 md:p-4">
          <Demo
            className={cn(
              "h-[min(70svh,32rem)] md:h-[min(72svh,34rem)]",
              (lane === "marketing" ||
                lane === "mobile" ||
                lane === "desktop") &&
                "mx-auto max-w-4xl",
            )}
          />
        </div>

        <aside className="hidden space-y-4 border-l border-border bg-muted/10 p-4 lg:block">
          <div>
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              Active
            </p>
            <p className="mt-1 text-sm font-medium tracking-tight">
              {active.label}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{active.meta}</p>
          </div>
          {surfaceMeta ? (
            <div className="space-y-2 border-t border-border pt-4">
              <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
                Density
              </p>
              <p className="text-sm tracking-tight">{surfaceMeta.density}</p>
              <p className="text-sm text-muted-foreground">
                {surfaceMeta.summary}
              </p>
            </div>
          ) : null}
          <div className="border-t border-border pt-4">
            <p className="font-mono text-[10px] tracking-[0.14em] text-muted-foreground uppercase">
              Interact
            </p>
            <ul className="mt-2 space-y-1.5 text-[12px] text-muted-foreground">
              <li>Select rows / files</li>
              <li>Ask the agent rail</li>
              <li>Switch lanes without scroll</li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  )
}

export { SurfaceStudio }
export type { SurfaceStudioProps }
