"use client"

import * as React from "react"
import {
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Share2,
  MoreVertical,
} from "lucide-react"

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
            icon: <MessageCircle />,
            label: "Comments",
            count: 2300,
          },
          { key: "share", icon: <Share2 />, label: "Share" },
          { key: "more", icon: <MoreVertical />, label: "More actions" },
        ]}
      />
    </div>
  )
}
