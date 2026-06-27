"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { VerifiedBadge } from "@/components/ui/verified-badge"
import { SubscribeButton } from "@/components/ui/subscribe-button"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const compact = new Intl.NumberFormat("en", { notation: "compact" })

type ChannelHeaderProps = Omit<React.ComponentProps<"div">, "onJoin"> & {
  name: string
  verified?: boolean
  handle?: string
  subscriberCount?: number
  videoCount?: number
  description?: string
  avatarSrc?: string
  bannerSrc?: string
  subscribed?: boolean
  defaultSubscribed?: boolean
  onSubscribedChange?: (next: boolean) => void
  joinLabel?: string
  onJoin?: () => void
  tabs?: Array<{ value: string; label: string }>
  defaultTab?: string
  onTabChange?: (value: string) => void
}

function ChannelHeader({
  name,
  verified = false,
  handle,
  subscriberCount,
  videoCount,
  description,
  avatarSrc,
  bannerSrc,
  subscribed,
  defaultSubscribed,
  onSubscribedChange,
  joinLabel = "Join",
  onJoin,
  tabs,
  defaultTab,
  onTabChange,
  className,
  ...props
}: ChannelHeaderProps) {
  const initials = name.slice(0, 2).toUpperCase()

  // Meta line parts are React nodes (the counts are mono spans), so we collect
  // the present parts and interleave a "·" separator only between them.
  const metaParts: React.ReactNode[] = []
  if (handle) metaParts.push(<span key="handle">{handle}</span>)
  if (subscriberCount != null) {
    metaParts.push(
      <span key="subs" className="font-mono tabular-nums">
        {compact.format(subscriberCount)} subscribers
      </span>,
    )
  }
  if (videoCount != null) {
    metaParts.push(
      <span key="videos" className="font-mono tabular-nums">
        {compact.format(videoCount)} videos
      </span>,
    )
  }

  return (
    <div
      data-slot="channel-header"
      className={cn("flex flex-col gap-5", className)}
      {...props}
    >
      {bannerSrc ? (
        <img
          data-slot="channel-header-banner"
          src={bannerSrc}
          alt=""
          className="h-32 w-full rounded-2xl object-cover sm:h-40"
        />
      ) : null}

      <div
        data-slot="channel-header-identity"
        className="flex flex-col gap-5 sm:flex-row sm:items-center"
      >
        <Avatar size="lg" className="size-20 shrink-0 sm:size-28">
          {avatarSrc ? <AvatarImage src={avatarSrc} alt={name} /> : null}
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-col gap-2">
          <div className="flex items-center gap-1.5">
            <h1 className="text-3xl font-medium tracking-tight text-foreground">
              {name}
            </h1>
            {verified ? <VerifiedBadge size="md" /> : null}
          </div>

          {metaParts.length > 0 ? (
            <div
              data-slot="channel-header-meta"
              className="flex flex-wrap items-center gap-x-1.5 text-sm text-muted-foreground"
            >
              {metaParts.map((part, i) => (
                <React.Fragment key={i}>
                  {i > 0 ? <span aria-hidden>·</span> : null}
                  {part}
                </React.Fragment>
              ))}
            </div>
          ) : null}

          {description ? (
            <p className="line-clamp-1 text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}

          <div
            data-slot="channel-header-actions"
            className="mt-1 flex flex-wrap items-center gap-2"
          >
            <SubscribeButton
              subscribed={subscribed}
              defaultSubscribed={defaultSubscribed}
              onSubscribedChange={onSubscribedChange}
            />
            {onJoin ? (
              <Button variant="outline" onClick={onJoin}>
                {joinLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {tabs && tabs.length > 0 ? (
        <Tabs
          data-slot="channel-header-tabs"
          defaultValue={defaultTab ?? tabs[0].value}
          onValueChange={(value) => onTabChange?.(value as string)}
          className="border-b border-border"
        >
          <TabsList>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      ) : null}
    </div>
  )
}

export { ChannelHeader }
export type { ChannelHeaderProps }
