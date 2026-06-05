"use client"

import { TrackList, TrackRow } from "@/components/ui/track-list"

export default function Example() {
  return (
    <div className="w-full max-w-lg p-4">
      <TrackList>
        <TrackRow
          index={1}
          title="Lost in the Echo"
          artist="Aurora Skies"
          duration="3:24"
          active
          playing
          liked
          onPlay={() => {}}
          onLikeToggle={() => {}}
        />
        <TrackRow
          index={2}
          title="Neon Roads"
          artist="Aurora Skies"
          duration="4:01"
          explicit
          onPlay={() => {}}
          onLikeToggle={() => {}}
        />
        <TrackRow
          index={3}
          title="Slow Tide"
          artist="Aurora Skies"
          album="Coastlines"
          duration="2:58"
          onPlay={() => {}}
          onLikeToggle={() => {}}
        />
      </TrackList>
    </div>
  )
}
