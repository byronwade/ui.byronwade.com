"use client"

import { ChannelHeader } from "@/components/channel-header"

const BANNER =
  "https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=1200&q=80"
const AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"

export default function Example() {
  return (
    <div className="w-[900px] max-w-full">
      <ChannelHeader
        name="Marques Brownlee"
        verified
        handle="@mkbhd"
        subscriberCount={21000000}
        videoCount={1800}
        description="Quality tech videos, reviews, and the occasional ketchup taste test."
        avatarSrc={AVATAR}
        bannerSrc={BANNER}
        onSubscribedChange={() => {}}
        onJoin={() => {}}
        defaultTab="home"
        onTabChange={() => {}}
        tabs={[
          { value: "home", label: "Home" },
          { value: "videos", label: "Videos" },
          { value: "shorts", label: "Shorts" },
          { value: "live", label: "Live" },
          { value: "playlists", label: "Playlists" },
        ]}
      />
    </div>
  )
}
