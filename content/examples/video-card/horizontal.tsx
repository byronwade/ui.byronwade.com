"use client"

import { Clock3, ListPlus } from "lucide-react"

import { VideoCard } from "@/components/video-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <div className="w-[560px]">
      <VideoCard
        variant="horizontal"
        density="compact"
        title="How to design compact video rows for search and sidebars"
        href="#"
        thumbnailSrc="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=720&q=80"
        duration="9:41"
        views={84000}
        timestamp="3 days ago"
        channelName="byronwade"
        verified
        badges={<Badge variant="outline">Search result</Badge>}
        description="A tighter layout for results, playlists, and related-video surfaces."
        actions={
          <Button variant="ghost" size="icon-sm" aria-label="Save">
            <ListPlus />
          </Button>
        }
        menuItems={[
          {
            key: "watch-later",
            label: "Watch later",
            icon: <Clock3 className="size-4" />,
          },
        ]}
      />
    </div>
  )
}
