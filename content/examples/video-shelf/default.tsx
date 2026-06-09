"use client"

import { VideoShelf } from "@/components/video-shelf"
import { VideoCard } from "@/components/video-card"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

const TITLES = [
  "Designing a token-only design system from scratch",
  "Base UI primitives, the practical tour",
  "Editorial typography on the web",
  "CVA variants explained",
  "Dark mode for free with semantic tokens",
  "Building accessible carousels",
]

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  if (isError) {
    return (
      <div className="w-[760px]">
        <DemoErrorState>Couldn&apos;t load shelf</DemoErrorState>
      </div>
    )
  }

  return (
    <div className="w-[760px]">
      <VideoShelf
        title="Recommended"
        loading={isLoading}
        empty={<DemoEmptyState>No videos to show yet.</DemoEmptyState>}
        action={
          <a
            href="#"
            className="text-sm font-medium text-brand outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            View all
          </a>
        }
      >
        {isEmpty
          ? null
          : TITLES.map((title, i) => (
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
