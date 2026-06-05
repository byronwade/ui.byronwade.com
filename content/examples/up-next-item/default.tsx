"use client"

import { Flag, Clock, ListPlus } from "lucide-react"

import { UpNextItem } from "@/components/up-next-item"

export default function Example() {
  return (
    <div className="w-[400px] flex flex-col gap-2">
      <UpNextItem
        title="The state of CSS in 2026 — what changed and what's next"
        href="#"
        thumbnailSrc="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=480&q=80"
        live
        channelName="frontend weekly"
        verified
        views={48200}
        timestamp="streaming now"
      />
      <UpNextItem
        title="Building a design system from scratch — tokens, primitives, and composites"
        href="#"
        thumbnailSrc="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=480&q=80"
        duration="14:08"
        progress={42}
        channelName="byronwade"
        verified
        views={2200000}
        timestamp="2 months ago"
      />
      <UpNextItem
        title="A quiet hour of ambient focus music for deep work"
        href="#"
        thumbnailSrc="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=480&q=80"
        duration="1:02:11"
        channelName="lofi room"
        views={910000}
        timestamp="1 year ago"
        menuItems={[
          {
            key: "save",
            label: "Save to playlist",
            icon: <ListPlus className="size-4" />,
            onClick: () => {},
          },
          {
            key: "watch-later",
            label: "Save to Watch later",
            icon: <Clock className="size-4" />,
            onClick: () => {},
          },
          {
            key: "report",
            label: "Report",
            icon: <Flag className="size-4" />,
            onClick: () => {},
          },
        ]}
      />
    </div>
  )
}
