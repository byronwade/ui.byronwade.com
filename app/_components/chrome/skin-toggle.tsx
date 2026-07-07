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

type Skin = "warm" | "linear" | "polaris"

const SKINS: { value: Skin; label: string; desc: string }[] = [
  { value: "warm", label: "Warm", desc: "byronwade — warm paper, one accent" },
  {
    value: "linear",
    label: "Linear",
    desc: "Dark product OS — indigo accent, dense rows",
  },
  { value: "polaris", label: "Polaris", desc: "Shopify-inspired admin skin" },
]

function currentSkin(): Skin {
  if (typeof document === "undefined") return "warm"
  const skin = document.documentElement.dataset.skin
  if (skin === "linear" || skin === "polaris") return skin
  return "warm"
}

/**
 * Skin switcher — toggles the active token skin across every component at once
 * by setting `data-skin` on the document root (persisted in localStorage). The
 * skins themselves are pure token overrides (see `app/globals.css`).
 */
export function SkinToggle() {
  const [skin, setSkin] = React.useState<Skin>("warm")

  React.useEffect(() => {
    setSkin(currentSkin())
  }, [])

  const apply = React.useCallback((next: Skin) => {
    setSkin(next)
    if (next === "warm") {
      delete document.documentElement.dataset.skin
      try {
        localStorage.removeItem("skin")
      } catch {
        // ignore
      }
      return
    }
    document.documentElement.dataset.skin = next
    try {
      localStorage.setItem("skin", next)
    } catch {
      // ignore
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
