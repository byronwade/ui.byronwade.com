"use client"

import * as React from "react"
import {
  ChatCircle,
  DotsThreeVertical,
  ShareNetwork,
  ThumbsDown,
  ThumbsUp,
} from "@/lib/icons"

import { ActionRail } from "@/components/ui/action-rail"

export default function Example() {
  const [liked, setLiked] = React.useState(true)

  return (
    <div className="flex h-80 w-24 items-center justify-center">
      <ActionRail
        actions={[
          {
            key: "like",
            icon: <ThumbsUp />,
            label: "Like",
            count: 128400,
            active: liked,
            onClick: () => setLiked((v) => !v),
          },
          {
            key: "dislike",
            icon: <ThumbsDown />,
            label: "Dislike",
            count: 412,
          },
          {
            key: "comments",
            icon: <ChatCircle />,
            label: "Comments",
            count: 2300,
          },
          { key: "share", icon: <ShareNetwork />, label: "Share" },
          { key: "more", icon: <DotsThreeVertical />, label: "More actions" },
        ]}
      />
    </div>
  )
}
