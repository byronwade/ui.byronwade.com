"use client"

import { Flag, ListPlus } from "lucide-react"

import { VideoCard } from "@/components/video-card"

export default function Example() {
  return (
    <div className="w-[360px]">
      <VideoCard
        title="Building a design system from scratch — tokens, primitives, and composites"
        href="#"
        thumbnailSrc="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=720&q=80"
        duration="14:08"
        progress={42}
        views={2200000}
        timestamp="2 months ago"
        channelName="byronwade"
        channelAvatarSrc="https://i.pravatar.cc/64?img=12"
        verified
        menuItems={[
          {
            key: "save",
            label: "Save to playlist",
            icon: <ListPlus className="size-4" />,
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
