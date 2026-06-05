"use client"

import { CommentComposer } from "@/components/comment-composer"

export default function Example() {
  return (
    <div className="w-[640px] p-8">
      <CommentComposer
        currentUserName="Byron Wade"
        avatarSrc="https://github.com/byronwade.png"
        onSubmit={(value) => console.log("comment:", value)}
      />
    </div>
  )
}
