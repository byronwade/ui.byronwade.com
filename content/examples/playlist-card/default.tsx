"use client"

import { PlaylistCard } from "@/components/playlist-card"

const COVER =
  "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80"

export default function Example() {
  return (
    <div className="flex flex-wrap gap-4 p-8">
      <PlaylistCard
        src={COVER}
        title="Evening Acoustic"
        description="Wind down with mellow guitar and soft vocals."
        onPlay={() => {}}
      />
      <PlaylistCard
        src={COVER}
        title="Deep Focus"
        description="Keep calm and focus with ambient and post-rock."
        playing
        onPlay={() => {}}
      />
      <PlaylistCard
        src={COVER}
        title="Morning Drive"
        description="Upbeat tracks to start the day."
        onPlay={() => {}}
      />
    </div>
  )
}
