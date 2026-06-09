"use client"

import { Comment } from "@/components/comment"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

const AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
const REPLY_AVATAR =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80"

function CommentSkeleton({ indent = false }: { indent?: boolean }) {
  return (
    <div className={`flex gap-3 ${indent ? "pl-11" : ""}`} aria-hidden="true">
      <Skeleton className="mt-0.5 size-10 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-28 rounded" />
          <Skeleton className="h-3 w-14 rounded" />
        </div>
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-3/4 rounded" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-14 rounded-full" />
          <Skeleton className="h-6 w-8 rounded-full" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  return (
    <div className="w-[640px] max-w-full">
      {isLoading ? (
        <div className="flex flex-col gap-6" aria-busy="true">
          <CommentSkeleton />
          <CommentSkeleton indent />
          <CommentSkeleton indent />
        </div>
      ) : isEmpty ? (
        <DemoEmptyState>No comments yet</DemoEmptyState>
      ) : isError ? (
        <DemoErrorState>Couldn&apos;t load comments</DemoErrorState>
      ) : (
        <Comment
          author="Marques Brownlee"
          authorAvatarSrc={AVATAR}
          verified
          timestamp="2 days ago"
          text="This is the cleanest explanation of the camera pipeline I've seen, bookmarking for later."
          likeCount={12400}
          pinned
          hearted
          replyCount={2}
          onReply={() => {}}
          onLikedChange={() => {}}
          onDislikedChange={() => {}}
          defaultRepliesOpen={state === "success"}
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
            text="Second this, would love a follow-up on low-light handling."
            likeCount={14}
            onReply={() => {}}
          />
        </Comment>
      )}
    </div>
  )
}
