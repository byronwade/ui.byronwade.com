"use client"

import { Comment } from "@/components/comment"

const AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
const REPLY_AVATAR =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80"

export default function Example() {
  return (
    <div className="w-[640px] max-w-full">
      <Comment
        author="Marques Brownlee"
        authorAvatarSrc={AVATAR}
        verified
        timestamp="2 days ago"
        text="This is the cleanest explanation of the camera pipeline I've seen — bookmarking for later."
        likeCount={12400}
        pinned
        hearted
        replyCount={2}
        onReply={() => {}}
        onLikedChange={() => {}}
        onDislikedChange={() => {}}
        defaultRepliesOpen
      >
        <Comment
          author="Jules"
          authorAvatarSrc={REPLY_AVATAR}
          timestamp="1 day ago"
          text="Totally agree, the diagrams really helped it click."
          likeCount={86}
          onReply={() => {}}
        />
        <Comment
          author="Sam Rivera"
          timestamp="20 hours ago"
          text="Second this — would love a follow-up on low-light handling."
          likeCount={14}
          onReply={() => {}}
        />
      </Comment>
    </div>
  )
}
