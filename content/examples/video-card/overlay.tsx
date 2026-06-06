"use client"

import { Badge } from "@/components/ui/badge"
import { VideoCard } from "@/components/video-card"

export default function Example() {
  return (
    <div className="w-[380px]">
      <VideoCard
        variant="overlay"
        title="A cinematic product walkthrough for launch week"
        href="#"
        thumbnailSrc="https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=720&q=80"
        duration="3:20"
        channelName="Launch Studio"
        badges={<Badge variant="secondary">Premiere</Badge>}
        stats={<span className="font-mono tabular-nums">Live in 12m</span>}
      />
    </div>
  )
}
