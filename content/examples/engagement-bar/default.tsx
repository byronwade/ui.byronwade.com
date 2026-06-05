"use client"

import * as React from "react"
import { Scissors, Flag, ListPlus } from "lucide-react"

import { EngagementBar } from "@/components/engagement-bar"

export default function Example() {
  const [liked, setLiked] = React.useState(false)
  const [disliked, setDisliked] = React.useState(false)
  const [saved, setSaved] = React.useState(false)

  return (
    <div className="w-[640px]">
      <EngagementBar
        liked={liked}
        onLikedChange={setLiked}
        disliked={disliked}
        onDislikedChange={setDisliked}
        likeCount={88000}
        onShare={() => {}}
        saved={saved}
        onSavedChange={setSaved}
        actions={[
          { key: "clip", label: "Clip", icon: <Scissors className="size-4" /> },
        ]}
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
