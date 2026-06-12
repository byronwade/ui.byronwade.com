"use client"

import * as React from "react"
import { Flag, ListPlus } from "@/lib/icons"

import { EngagementBar } from "@/components/engagement-bar"

export default function Example() {
  const [liked, setLiked] = React.useState(false)
  const [disliked, setDisliked] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  return (
    <div className="w-[720px]">
      <EngagementBar
        liked={liked}
        onLikedChange={setLiked}
        disliked={disliked}
        onDislikedChange={setDisliked}
        likeCount={88000}
        onShare={() => {}}
        saved={saved}
        onSavedChange={setSaved}
        onClip={() => {}}
        onRemix={() => {}}
        menuItems={[
          {
            key: "playlist",
            label: "Save to playlist",
            icon: <ListPlus className="size-4" />,
          },
          { key: "report", label: "Report", icon: <Flag className="size-4" /> },
        ]}
      />
    </div>
  )
}
