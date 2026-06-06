import * as React from "react"

import { cn } from "@/lib/utils"

type WatchLayoutProps = {
  /** Primary media region — typically `MediaPlayer`. */
  player: React.ReactNode
  /** Large title below the player (YouTube places this outside the chrome). */
  title?: React.ReactNode
  /** Channel + engagement row — typically `WatchMetaBar`. */
  meta?: React.ReactNode
  description?: React.ReactNode
  /** Comments and tabs below the fold. */
  below?: React.ReactNode
  /** Right rail — chip filters + up-next list. Hidden below `xl`. */
  sidebar?: React.ReactNode
  className?: string
}

function WatchLayout({
  player,
  title,
  meta,
  description,
  below,
  sidebar,
  className,
}: WatchLayoutProps) {
  return (
    <div
      data-slot="watch-layout"
      className={cn(
        "mx-auto flex w-full max-w-[1754px] flex-col gap-4 px-4 py-4 lg:flex-row lg:gap-6 lg:px-6",
        className,
      )}
    >
      <div
        data-slot="watch-layout-main"
        className="flex min-w-0 flex-1 flex-col gap-4"
      >
        <div data-slot="watch-layout-player">{player}</div>
        {title != null ? (
          <div data-slot="watch-layout-title">{title}</div>
        ) : null}
        {meta != null ? (
          <div data-slot="watch-layout-meta">{meta}</div>
        ) : null}
        {description != null ? (
          <div data-slot="watch-layout-description">{description}</div>
        ) : null}
        {below != null ? (
          <div data-slot="watch-layout-below">{below}</div>
        ) : null}
      </div>

      {sidebar != null ? (
        <aside
          data-slot="watch-layout-sidebar"
          className="hidden w-full shrink-0 flex-col gap-3 xl:flex xl:w-[402px]"
        >
          {sidebar}
        </aside>
      ) : null}
    </div>
  )
}

type WatchLayoutTitleProps = React.ComponentProps<"h1">

function WatchLayoutTitle({ className, ...props }: WatchLayoutTitleProps) {
  return (
    <h1
      data-slot="watch-layout-title-text"
      className={cn(
        "text-xl font-medium tracking-tight text-foreground sm:text-2xl",
        className,
      )}
      {...props}
    />
  )
}

export { WatchLayout, WatchLayoutTitle }
export type { WatchLayoutProps, WatchLayoutTitleProps }
