"use client"

import {
  WebPreview,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
  WebPreviewBody,
  WebPreviewConsole,
} from "@/components/ai-elements/web-preview"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  RotateCwIcon,
  ExternalLinkIcon,
} from "lucide-react"

const logs = [
  {
    level: "log" as const,
    message: "App mounted, hydration complete",
    timestamp: new Date("2026-06-03T10:24:01"),
  },
  {
    level: "warn" as const,
    message: "Deprecated prop `legacy` on <Button>",
    timestamp: new Date("2026-06-03T10:24:02"),
  },
  {
    level: "error" as const,
    message: "Failed to fetch /api/session (401)",
    timestamp: new Date("2026-06-03T10:24:03"),
  },
]

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  const previewUrl = isEmpty || isError ? "" : "https://byronwade.ui"

  return (
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <WebPreview defaultUrl={previewUrl} className="h-[480px] max-w-2xl">
        <WebPreviewNavigation>
          <WebPreviewNavigationButton tooltip="Back" disabled>
            <ArrowLeftIcon />
          </WebPreviewNavigationButton>
          <WebPreviewNavigationButton tooltip="Forward" disabled>
            <ArrowRightIcon />
          </WebPreviewNavigationButton>
          <WebPreviewNavigationButton tooltip="Reload" disabled={isLoading}>
            <RotateCwIcon />
          </WebPreviewNavigationButton>
          <WebPreviewUrl />
          <WebPreviewNavigationButton
            tooltip="Open in new tab"
            disabled={isEmpty || isError}
          >
            <ExternalLinkIcon />
          </WebPreviewNavigationButton>
        </WebPreviewNavigation>

        {isEmpty ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <DemoEmptyState>No preview</DemoEmptyState>
          </div>
        ) : isError ? (
          <div className="flex flex-1 items-center justify-center p-6">
            <DemoErrorState>Couldn&apos;t load preview</DemoErrorState>
          </div>
        ) : (
          <WebPreviewBody
            loading={
              isLoading ? (
                <div className="absolute inset-0 flex flex-col gap-3 bg-card p-4">
                  <Skeleton className="h-6 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-5/6 rounded-md" />
                  <Skeleton className="h-4 w-4/6 rounded-md" />
                  <Skeleton className="mt-2 h-32 w-full rounded-md" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                </div>
              ) : undefined
            }
          />
        )}

        {!isEmpty && !isError && (
          <WebPreviewConsole logs={isLoading ? [] : logs} />
        )}
      </WebPreview>
    </div>
  )
}
