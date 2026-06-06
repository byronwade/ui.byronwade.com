"use client"

import { VideoCard } from "@/components/video-card"
import { VideoShelf } from "@/components/video-shelf"

const TITLES = [
  "Now playing",
  "Queue controls",
  "Chapter-aware cards",
  "Compact metadata",
]

export default function Example() {
  return (
    <div className="w-[620px]">
      <VideoShelf
        variant="rail"
        density="compact"
        controls="always"
        title="Continue watching"
        itemClassName="w-[220px]"
      >
        {TITLES.map((title, index) => (
          <VideoCard
            key={title}
            variant="compact"
            title={title}
            thumbnailSrc={`https://picsum.photos/seed/video-rail-${index}/640/360`}
            progress={20 + index * 16}
            duration="8:12"
            channelName="byronwade"
          />
        ))}
      </VideoShelf>
    </div>
  )
}
