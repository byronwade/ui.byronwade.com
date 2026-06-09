"use client"

import {
  EditorBubbleMenu,
  EditorCharacterCount,
  EditorClearFormatting,
  EditorFormatBold,
  EditorFormatCode,
  EditorFormatItalic,
  EditorFormatStrike,
  EditorNodeBulletList,
  EditorNodeCode,
  EditorNodeHeading1,
  EditorNodeHeading2,
  EditorNodeOrderedList,
  EditorNodeQuote,
  EditorNodeText,
  EditorProvider,
} from "@/components/ui/editor"
import { Skeleton } from "@/components/ui/skeleton"
import { DemoErrorState } from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

const content = `
<h2>byronwade/ui editor</h2>
<p>This is a <strong>Tiptap</strong> rich-text editor adapted to the byronwade design system. Select some text to reveal the bubble menu, or type <code>/</code> for the slash command menu.</p>
<ul>
  <li>Tokenized colors, re-skins for free in dark mode</li>
  <li>House primitives, Button, Command, Popover, Tooltip</li>
</ul>
<blockquote>Hierarchy comes from size and tracking, not weight.</blockquote>
`

function EditorSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="relative w-full max-w-2xl rounded-xl ring-1 ring-border/70 bg-card p-6 space-y-4"
    >
      {/* toolbar row */}
      <div className="flex items-center gap-2 pb-3 border-b border-border/60">
        <Skeleton className="h-7 w-16 rounded-md" />
        <Skeleton className="h-7 w-16 rounded-md" />
        <Skeleton className="h-7 w-7 rounded-md" />
        <Skeleton className="h-7 w-7 rounded-md" />
        <Skeleton className="h-7 w-7 rounded-md" />
        <Skeleton className="h-7 w-7 rounded-md" />
      </div>
      {/* h2 */}
      <Skeleton className="h-6 w-48 rounded" />
      {/* paragraph */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full rounded" />
        <Skeleton className="h-4 w-5/6 rounded" />
      </div>
      {/* bullet list */}
      <div className="space-y-2 pl-4">
        <Skeleton className="h-4 w-72 rounded" />
        <Skeleton className="h-4 w-64 rounded" />
      </div>
      {/* blockquote */}
      <div className="pl-3 border-l-2 border-border">
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>
      {/* word count badge */}
      <Skeleton className="absolute right-4 bottom-4 h-7 w-20 rounded-md" />
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
    return <EditorSkeleton />
  }

  if (isError) {
    return (
      <div className="relative w-full max-w-2xl">
        <DemoErrorState>Couldn&apos;t load document</DemoErrorState>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "relative w-full max-w-2xl rounded-xl edge bg-card p-6",
        isSuccess && "ring-success/30",
      )}
    >
      {isSuccess && (
        <div className="absolute right-4 top-4 rounded-md bg-success/10 px-2 py-1 text-xs font-medium text-success">
          Saved
        </div>
      )}
      <EditorProvider
        className="prose prose-sm max-w-none focus:outline-none dark:prose-invert"
        content={isEmpty ? "" : content}
        limit={2000}
        placeholder="Write something, or press / for commands…"
      >
        <EditorBubbleMenu>
          <EditorNodeText />
          <EditorNodeHeading1 />
          <EditorNodeHeading2 />
          <EditorNodeBulletList />
          <EditorNodeOrderedList />
          <EditorNodeQuote />
          <EditorNodeCode />
          <EditorFormatBold hideName />
          <EditorFormatItalic hideName />
          <EditorFormatStrike hideName />
          <EditorFormatCode hideName />
          <EditorClearFormatting hideName />
        </EditorBubbleMenu>
        <EditorCharacterCount.Words>Words: </EditorCharacterCount.Words>
      </EditorProvider>
    </div>
  )
}
