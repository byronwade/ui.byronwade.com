"use client"

import { CommentModerationRow } from "@/components/comment-moderation-row"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"

const AVATAR =
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80"
const AVATAR_2 =
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80"
const THUMB =
  "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=200&q=80"

function SkeletonRow() {
  return (
    <div className="flex gap-3 rounded-lg border border-border/60 p-3">
      <Skeleton className="mt-0.5 size-8 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="ml-auto h-5 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/5" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-3.5 w-10" />
          <Skeleton className="h-3.5 w-32" />
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
  const isSuccess = state === "success"

  if (isLoading) {
    return (
      <div className="flex w-[720px] max-w-full flex-col gap-3">
        <SkeletonRow />
        <SkeletonRow />
        <SkeletonRow />
      </div>
    )
  }

  if (isEmpty) {
    return (
      <div className="w-[720px] max-w-full">
        <DemoEmptyState>No comments to moderate</DemoEmptyState>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="w-[720px] max-w-full">
        <DemoErrorState>Couldn&apos;t load queue</DemoErrorState>
      </div>
    )
  }

  return (
    <div className="flex w-[720px] max-w-full flex-col gap-3">
      <CommentModerationRow
        author="Marques Brownlee"
        authorAvatarSrc={AVATAR}
        verified
        timestamp="2 days ago"
        text="First! Honestly the cleanest breakdown of this pipeline I've watched."
        likeCount={1240}
        status={isSuccess ? "approved" : "held"}
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
        status={isSuccess ? "approved" : "held"}
        defaultHearted={isSuccess}
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
