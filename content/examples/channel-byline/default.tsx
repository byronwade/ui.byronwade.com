"use client"

import { ChannelByline } from "@/components/channel-byline"

const AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"

export default function Example() {
  return (
    <div className="w-[600px] max-w-full">
      <ChannelByline
        name="Marques Brownlee"
        avatarSrc={AVATAR}
        verified
        subscriberCount={8600000}
        href="#"
        defaultSubscribed={false}
        onSubscribedChange={() => {}}
      />
    </div>
  )
}
