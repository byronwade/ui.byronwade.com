"use client"

import * as React from "react"
import { Gear } from "@/lib/icons"

import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"

type PlaybackOption = {
  label: string
  value: string
}

type PlaybackSetting = {
  key: string
  label: string
  icon?: React.ReactNode
  value: string
  options: PlaybackOption[]
  onValueChange?: (value: string) => void
}

interface PlaybackMenuProps {
  settings: PlaybackSetting[]
  trigger?: React.ReactNode
  align?: React.ComponentProps<typeof DropdownMenuContent>["align"]
  side?: React.ComponentProps<typeof DropdownMenuContent>["side"]
  className?: string
}

function currentLabel(setting: PlaybackSetting) {
  return (
    setting.options.find((option) => option.value === setting.value)?.label ??
    setting.value
  )
}

function PlaybackMenu({
  settings,
  trigger,
  align = "end",
  side = "top",
  className,
}: PlaybackMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        data-slot="playback-menu"
        aria-label={trigger ? undefined : "Settings"}
        render={trigger ? (trigger as React.ReactElement) : undefined}
        className={
          trigger
            ? className
            : cn(
                "inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground outline-none hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
                className,
              )
        }
      >
        {trigger ? undefined : <Gear className="size-5" />}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        data-slot="playback-menu-content"
        align={align}
        side={side}
        className="min-w-56"
      >
        {settings.map((setting) => (
          <DropdownMenuSub key={setting.key}>
            <DropdownMenuSubTrigger data-slot="playback-menu-row">
              {setting.icon ? setting.icon : null}
              <span className="truncate">{setting.label}</span>
              <DropdownMenuShortcut data-slot="playback-menu-value">
                {currentLabel(setting)}
              </DropdownMenuShortcut>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent data-slot="playback-menu-options">
              <DropdownMenuLabel>{setting.label}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={setting.value}
                onValueChange={(value) => setting.onValueChange?.(value)}
              >
                {setting.options.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    data-slot="playback-menu-option"
                    value={option.value}
                  >
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export { PlaybackMenu }
export type { PlaybackMenuProps, PlaybackSetting }
