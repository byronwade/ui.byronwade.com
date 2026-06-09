"use client"

import { useState } from "react"
import {
  HomeIcon,
  InboxIcon,
  SettingsIcon,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const NAV_ITEMS: { icon: LucideIcon; label: string; active?: boolean }[] = [
  { icon: HomeIcon, label: "Home", active: true },
  { icon: InboxIcon, label: "Inbox" },
  { icon: SettingsIcon, label: "Settings" },
]

const VARIANTS = ["sidebar", "floating", "inset"] as const
const COLLAPSIBLE = ["offcanvas", "icon", "none"] as const
const SIDES = ["left", "right"] as const

type LayoutVariant = (typeof VARIANTS)[number]
type CollapsibleMode = (typeof COLLAPSIBLE)[number]
type Side = (typeof SIDES)[number]

function OptionRow<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: readonly T[]
  value: T
  onChange: (value: T) => void
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      <span className="w-24 shrink-0 text-sm text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={value === option ? "default" : "outline"}
            className="capitalize"
            onClick={() => onChange(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  )
}

function SidebarPreview({
  variant,
  collapsible,
  side,
}: {
  variant: LayoutVariant
  collapsible: CollapsibleMode
  side: Side
}) {
  return (
    <div className="h-[min(28rem,70vh)] w-full min-w-0 overflow-hidden rounded-xl edge bg-background">
      <SidebarProvider contained className="h-full">
        <Sidebar variant={variant} collapsible={collapsible} side={side}>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV_ITEMS.map(({ icon: Icon, label, active }) => (
                    <SidebarMenuItem key={label}>
                      <SidebarMenuButton
                        isActive={active}
                        tooltip={collapsible === "icon" ? label : undefined}
                      >
                        <Icon />
                        {label}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <SidebarInset className="min-h-0">
          <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
            {collapsible !== "none" && side !== "right" ? (
              <SidebarTrigger />
            ) : null}
            <span className="text-sm font-medium capitalize">
              {variant} · {collapsible}
            </span>
            {collapsible !== "none" && side === "right" ? (
              <SidebarTrigger className="ml-auto rotate-180" />
            ) : null}
          </header>
          <div className="flex flex-1 flex-col justify-center gap-1 overflow-auto p-4 text-sm text-muted-foreground">
            <p>Main content area</p>
            <p className="font-mono text-xs">
              variant={variant} · collapsible={collapsible} · side={side}
            </p>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}

export default function Example() {
  const [variant, setVariant] = useState<LayoutVariant>("sidebar")
  const [collapsible, setCollapsible] = useState<CollapsibleMode>("icon")
  const [side, setSide] = useState<Side>("left")

  return (
    <div className="flex w-full min-w-0 flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-xl edge bg-muted/30 p-4">
        <OptionRow
          label="Variant"
          options={VARIANTS}
          value={variant}
          onChange={setVariant}
        />
        <OptionRow
          label="Collapsible"
          options={COLLAPSIBLE}
          value={collapsible}
          onChange={setCollapsible}
        />
        <OptionRow
          label="Side"
          options={SIDES}
          value={side}
          onChange={setSide}
        />
      </div>

      <SidebarPreview
        key={`${variant}-${collapsible}-${side}`}
        variant={variant}
        collapsible={collapsible}
        side={side}
      />
    </div>
  )
}
