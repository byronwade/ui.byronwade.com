"use client"

import * as React from "react"
import { Bell, BellOff, BellRing, ChevronDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

type NotificationLevel = "all" | "personalized" | "none"

const notificationIcon = {
  all: Bell,
  personalized: BellRing,
  none: BellOff,
} as const

type SubscribeButtonProps = {
  /** Controlled subscribed state. Omit to let the component manage it. */
  subscribed?: boolean
  defaultSubscribed?: boolean
  onSubscribedChange?: (next: boolean) => void
  /** Controlled notification level. Omit to let the component manage it. */
  notification?: NotificationLevel
  defaultNotification?: NotificationLevel
  onNotificationChange?: (level: NotificationLevel) => void
  label?: string
  subscribedLabel?: string
  className?: string
}

function SubscribeButton({
  subscribed,
  defaultSubscribed = false,
  onSubscribedChange,
  notification,
  defaultNotification = "personalized",
  onNotificationChange,
  label = "Subscribe",
  subscribedLabel = "Subscribed",
  className,
}: SubscribeButtonProps) {
  const [internalSubscribed, setInternalSubscribed] =
    React.useState(defaultSubscribed)
  const [internalNotification, setInternalNotification] =
    React.useState<NotificationLevel>(defaultNotification)

  const isSubscribed =
    subscribed !== undefined ? subscribed : internalSubscribed
  const level = notification !== undefined ? notification : internalNotification

  function setSubscribed(next: boolean) {
    if (subscribed === undefined) setInternalSubscribed(next)
    onSubscribedChange?.(next)
  }

  function setNotification(next: NotificationLevel) {
    if (notification === undefined) setInternalNotification(next)
    onNotificationChange?.(next)
  }

  if (!isSubscribed) {
    return (
      <span
        data-slot="subscribe-button"
        className={cn("inline-flex", className)}
      >
        <Button
          data-slot="subscribe-button-subscribe"
          onClick={() => setSubscribed(true)}
        >
          {label}
        </Button>
      </span>
    )
  }

  const LevelIcon = notificationIcon[level]

  return (
    <span data-slot="subscribe-button" className={cn("inline-flex", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="secondary" data-slot="subscribe-button-manage">
              <LevelIcon />
              {subscribedLabel}
              <ChevronDown className="text-muted-foreground" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="min-w-44">
          <DropdownMenuItem
            data-slot="subscribe-button-level-all"
            onClick={() => setNotification("all")}
          >
            <Bell />
            All
          </DropdownMenuItem>
          <DropdownMenuItem
            data-slot="subscribe-button-level-personalized"
            onClick={() => setNotification("personalized")}
          >
            <BellRing />
            Personalized
          </DropdownMenuItem>
          <DropdownMenuItem
            data-slot="subscribe-button-level-none"
            onClick={() => setNotification("none")}
          >
            <BellOff />
            None
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            data-slot="subscribe-button-unsubscribe"
            onClick={() => setSubscribed(false)}
          >
            Unsubscribe
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  )
}

export { SubscribeButton }
export type { SubscribeButtonProps, NotificationLevel }
