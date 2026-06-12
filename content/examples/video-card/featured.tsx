"use client"

import { ShareNetwork } from "@/lib/icons"

import { Button } from "@/components/ui/button"
import { VideoCard } from "@/components/video-card"

export default function Example() {
  return (
    <div className="w-[760px]">
      <VideoCard
        variant="featured"
        size="lg"
        title="The complete guide to token-driven video interfaces"
        href="#"
        thumbnailSrc="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=960&q=80"
        duration="24:18"
        progress={68}
        views={1400000}
        timestamp="1 week ago"
        channelName="byronwade"
        verified
        description="A long-form session covering thumbnails, watch pages, Shorts, mini players, and reusable media layouts."
        actions={
          <Button variant="outline" size="sm">
            <ShareNetwork />
            Share
          </Button>
        }
      />
    </div>
  )
}
