"use client"

import { VideoShelf } from "@/components/video-shelf"
import { VideoCard } from "@/components/video-card"

const TITLES = [
  "Designing a token-only design system from scratch",
  "Base UI primitives, the practical tour",
  "Editorial typography on the web",
  "CVA variants explained",
  "Dark mode for free with semantic tokens",
  "Building accessible carousels",
]

export default function Example() {
  return (
    <div className="w-[760px]">
      <VideoShelf
        title="Recommended"
        action={
          <a
            href="#"
            className="text-sm font-medium text-brand outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            View all
          </a>
        }
      >
        {TITLES.map((title, i) => (
          <VideoCard
            key={title}
            title={title}
            thumbnailSrc={`https://picsum.photos/seed/video-shelf-${i}/640/360`}
            duration="12:04"
            views={120000 * (i + 1)}
            timestamp={`${i + 1} weeks ago`}
            channelName="byronwade/ui"
            verified
            className="w-[300px]"
          />
        ))}
      </VideoShelf>
    </div>
  )
}
