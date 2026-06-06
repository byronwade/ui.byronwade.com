"use client"

import { ChannelByline } from "@/components/channel-byline"
import { EngagementBar } from "@/components/engagement-bar"
import { WatchMetaBar } from "@/components/watch-meta-bar"

const AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"

export default function Example() {
  return (
    <div className="w-full max-w-3xl">
      <WatchMetaBar
        channel={
          <ChannelByline
            name="Marques Brownlee"
            avatarSrc={AVATAR}
            verified
            subscriberCount={8_600_000}
          />
        }
        engagement={<EngagementBar likeCount={124_000} />}
      />
    </div>
  )
}
