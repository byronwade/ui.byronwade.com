"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { VerifiedBadge } from "@/components/ui/verified-badge"
import { SubscribeButton } from "@/components/ui/subscribe-button"

const compact = new Intl.NumberFormat("en", { notation: "compact" })

type ChannelBylineProps = React.ComponentProps<"div"> & {
  name: string
  avatarSrc?: string
  verified?: boolean
  subscriberCount?: number
  href?: string
  defaultSubscribed?: boolean
  subscribed?: boolean
  onSubscribedChange?: (next: boolean) => void
  actions?: React.ReactNode
}

function ChannelByline({
  name,
  avatarSrc,
  verified = false,
  subscriberCount,
  href,
  defaultSubscribed,
  subscribed,
  onSubscribedChange,
  actions,
  className,
  ...props
}: ChannelBylineProps) {
  const initials = name.slice(0, 2).toUpperCase()

  const identity = (
    <>
      <Avatar className="shrink-0">
        {avatarSrc ? <AvatarImage src={avatarSrc} alt={name} /> : null}
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>

      <span className="flex min-w-0 flex-col">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-sm font-medium tracking-tight text-foreground">
            {name}
          </span>
          {verified ? <VerifiedBadge /> : null}
        </span>
        {subscriberCount != null ? (
          <span className="font-mono text-xs tabular-nums text-muted-foreground">
            {compact.format(subscriberCount)} subscribers
          </span>
        ) : null}
      </span>
    </>
  )

  return (
    <div
      data-slot="channel-byline"
      className={cn("flex items-center justify-between gap-4", className)}
      {...props}
    >
      {href !== undefined ? (
        <a
          data-slot="channel-byline-identity"
          href={href}
          className="flex min-w-0 items-center gap-3"
        >
          {identity}
        </a>
      ) : (
        <span
          data-slot="channel-byline-identity"
          className="flex min-w-0 items-center gap-3"
        >
          {identity}
        </span>
      )}

      <span className="flex shrink-0 items-center gap-2">
        {actions != null ? (
          <span data-slot="channel-byline-actions">{actions}</span>
        ) : null}
        <span data-slot="channel-byline-subscribe">
          <SubscribeButton
            subscribed={subscribed}
            defaultSubscribed={defaultSubscribed}
            onSubscribedChange={onSubscribedChange}
          />
        </span>
      </span>
    </div>
  )
}

export { ChannelByline }
export type { ChannelBylineProps }
