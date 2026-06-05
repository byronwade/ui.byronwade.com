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
  ArrowLeftIcon,
  ArrowRightIcon,
  RotateCwIcon,
  ExternalLinkIcon,
} from "lucide-react"

export default function Example() {
  const logs = [
    {
      level: "log" as const,
      message: "App mounted — hydration complete",
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

  return (
    <div className="flex min-h-0 items-center justify-center bg-background p-8">
      <WebPreview
        defaultUrl="https://byronwade.ui"
        className="h-[480px] max-w-2xl"
      >
        <WebPreviewNavigation>
          <WebPreviewNavigationButton tooltip="Back" disabled>
            <ArrowLeftIcon />
          </WebPreviewNavigationButton>
          <WebPreviewNavigationButton tooltip="Forward" disabled>
            <ArrowRightIcon />
          </WebPreviewNavigationButton>
          <WebPreviewNavigationButton tooltip="Reload">
            <RotateCwIcon />
          </WebPreviewNavigationButton>
          <WebPreviewUrl />
          <WebPreviewNavigationButton tooltip="Open in new tab">
            <ExternalLinkIcon />
          </WebPreviewNavigationButton>
        </WebPreviewNavigation>
        <WebPreviewBody />
        <WebPreviewConsole logs={logs} />
      </WebPreview>
    </div>
  )
}
