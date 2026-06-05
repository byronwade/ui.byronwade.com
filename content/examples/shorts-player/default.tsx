"use client"

import * as React from "react"

import { ShortsPlayer } from "@/components/shorts-player"

export default function Example() {
  const [liked, setLiked] = React.useState(false)
  const [following, setFollowing] = React.useState(false)

  return (
    <div className="flex justify-center">
      <ShortsPlayer
        posterSrc="https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=720&h=1280&fit=crop"
        author={{
          name: "Coastline Studio",
          handle: "@coastline",
          avatarSrc:
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop",
          verified: true,
        }}
        following={following}
        onFollowingChange={setFollowing}
        caption="Golden hour over the cliffs — turn the sound on for the full vibe."
        sound="original sound · Coastline Studio"
        liked={liked}
        onLikedChange={setLiked}
        likeCount={128000}
        commentCount={2400}
        shareCount={910}
      />
    </div>
  )
}
