import type * as React from "react"

import { cn } from "@/lib/utils"

type WatchMetaBarProps = {
  /** Left cluster — typically `ChannelByline`. */
  channel: React.ReactNode
  /** Right cluster — typically `EngagementBar`. */
  engagement: React.ReactNode
  className?: string
}

function WatchMetaBar({ channel, engagement, className }: WatchMetaBarProps) {
  return (
    <div
      data-slot="watch-meta-bar"
      className={cn(
        "flex flex-col gap-4 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div
        data-slot="watch-meta-bar-channel"
        className="min-w-0 flex-1"
      >
        {channel}
      </div>
      <div
        data-slot="watch-meta-bar-engagement"
        className="scrollbar-thin -mx-1 shrink-0 overflow-x-auto px-1"
      >
        {engagement}
      </div>
    </div>
  )
}

export { WatchMetaBar }
export type { WatchMetaBarProps }
