"use client"

import { VideoCard } from "@/components/video-card"
import { VideoShelf } from "@/components/video-shelf"

const TITLES = [
  "Design tokens for media surfaces",
  "Building accessible thumbnails",
  "Video metadata patterns",
  "Compact browsing layouts",
  "Watch-page composition",
  "Shorts overlays and action rails",
]

export default function Example() {
  return (
    <div className="w-[760px]">
      <VideoShelf
        variant="grid"
        title="Latest workshops"
        description="A responsive grid uses the same section primitive without carousel controls."
      >
        {TITLES.map((title, index) => (
          <VideoCard
            key={title}
            title={title}
            thumbnailSrc={`https://picsum.photos/seed/video-grid-${index}/640/360`}
            duration="11:24"
            views={56000 + index * 9000}
            timestamp={`${index + 1} days ago`}
            channelName="byronwade/ui"
          />
        ))}
      </VideoShelf>
    </div>
  )
}
