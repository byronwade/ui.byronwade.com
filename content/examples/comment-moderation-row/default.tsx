"use client"

import { CommentModerationRow } from "@/components/comment-moderation-row"

const AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
const AVATAR_2 =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80"
const THUMB =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&q=80"

export default function Example() {
  return (
    <div className="flex w-[720px] max-w-full flex-col gap-3">
      <CommentModerationRow
        author="Marques Brownlee"
        authorAvatarSrc={AVATAR}
        verified
        timestamp="2 days ago"
        text="First! Honestly the cleanest breakdown of this pipeline I've watched."
        likeCount={1240}
        status="held"
        videoTitle="The cleanest camera pipeline explained"
        videoThumbnailSrc={THUMB}
        onApprove={() => {}}
        onRemove={() => {}}
        onReply={() => {}}
        onHeartedChange={() => {}}
      />
      <CommentModerationRow
        author="Jules"
        authorAvatarSrc={AVATAR_2}
        timestamp="1 day ago"
        text="Loved this, would buy the merch immediately, link please?"
        likeCount={86}
        status="approved"
        defaultHearted
      />
      <CommentModerationRow
        author="spam_bot_2049"
        timestamp="3 hours ago"
        text="Make $5000/week from home, DM me now!!!"
        status="removed"
      />
    </div>
  )
}
