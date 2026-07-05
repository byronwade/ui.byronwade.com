"use client"

import * as React from "react"
import { CaretDown, Palette } from "@/lib/icons"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type Skin = "warm" | "polaris"

const SKINS: { value: Skin; label: string; desc: string }[] = [
  { value: "warm", label: "Warm", desc: "byronwade — warm paper, one accent" },
  { value: "polaris", label: "Polaris", desc: "Shopify-inspired admin skin" },
]

function currentSkin(): Skin {
  if (typeof document === "undefined") return "warm"
  return document.documentElement.dataset.skin === "polaris"
    ? "polaris"
    : "warm"
}

/**
 * Skin switcher — toggles the active token skin across every component at once
 * by setting `data-skin` on the document root (persisted in localStorage). The
 * skins themselves are pure token overrides (see `app/skins.css`).
 */
export function SkinToggle() {
  const [skin, setSkin] = React.useState<Skin>("warm")

  // Sync from the DOM after mount (set by the no-flash script in the layout).
  React.useEffect(() => {
    setSkin(currentSkin())
  }, [])

  const apply = React.useCallback((next: Skin) => {
    setSkin(next)
    document.documentElement.dataset.skin = next
    try {
      localStorage.setItem("skin", next)
    } catch {
      // ignore — best-effort persistence
    }
  }, [])

  const active = SKINS.find((s) => s.value === skin) ?? SKINS[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Change skin"
        className={cn(
          "flex h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium text-muted-foreground outline-none transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
        )}
      >
        <Palette className="size-4" strokeWidth={2} />
        <span className="hidden lg:inline">{active.label}</span>
        <CaretDown className="hidden size-3 lg:inline" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-60">
        <DropdownMenuLabel className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Skin
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          value={skin}
          onValueChange={(v) => apply(v as Skin)}
        >
          {SKINS.map((s) => (
            <DropdownMenuRadioItem
              key={s.value}
              value={s.value}
              className="flex-col items-start gap-0.5"
            >
              <span className="text-sm text-foreground">{s.label}</span>
              <span className="text-xs text-muted-foreground">{s.desc}</span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
