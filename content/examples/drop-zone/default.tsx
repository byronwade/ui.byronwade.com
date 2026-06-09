"use client"

import * as React from "react"

import { DemoErrorState } from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { DropZone } from "@/components/ui/drop-zone"
import { useDemoState } from "@/lib/demo-viewport"
import { cn } from "@/lib/utils"

// Static mock files for controlled demos — constructed once, never mutate
const MOCK_FILES: File[] = [
  new File([""], "project-brief.pdf", { type: "application/pdf" }),
  new File([""], "design-assets.zip", { type: "application/zip" }),
  new File([""], "logo-final.png", { type: "image/png" }),
]

Object.defineProperties(MOCK_FILES[0], {
  size: { value: 1_423_616, configurable: true },
})
Object.defineProperties(MOCK_FILES[1], {
  size: { value: 8_912_896, configurable: true },
})
Object.defineProperties(MOCK_FILES[2], {
  size: { value: 204_800, configurable: true },
})

// Skeleton that mirrors the list-variant file rows
function FileRowSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2"
    >
      <Skeleton className="h-3.5 flex-1 rounded" />
      <Skeleton className="h-3 w-12 shrink-0 rounded" />
      <Skeleton className="size-5 shrink-0 rounded" />
    </div>
  )
}

// Loading: drop-zone shell with skeleton rows where files would appear
function LoadingDropZone() {
  return (
    <div
      aria-busy="true"
      aria-label="Uploading files…"
      className={cn(
        "group/drop-zone relative flex w-full max-w-md flex-col items-center justify-center",
        "gap-3 rounded-2xl border border-dashed border-border bg-background px-6 py-10",
        "text-center text-sm",
      )}
    >
      {/* upload glyph */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6 text-muted-foreground"
      >
        <path d="M12 16V5" />
        <path d="m7 10 5-5 5 5" />
        <path d="M5 19h14" />
      </svg>
      <div className="flex flex-col gap-1">
        <p className="text-foreground">Uploading files…</p>
        <p className="text-xs text-muted-foreground font-mono">3 files</p>
      </div>
      {/* skeleton rows mirroring the list variant */}
      <div className="flex w-full flex-col gap-1.5 text-left">
        {Array.from({ length: 3 }, (_, i) => (
          <FileRowSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  // loading — files are in-flight; show skeleton rows while uploading
  if (state === "loading") {
    return <LoadingDropZone />
  }

  // empty — the drop-zone's own empty prompt IS the natural empty state
  if (state === "empty") {
    return (
      <DropZone
        variant="list"
        accept=".pdf,.zip,.png,.jpg"
        multiple
        label="Drag files here"
        className="max-w-md"
      />
    )
  }

  // error — failed upload; show error banner below the zone with remaining files
  if (state === "error") {
    return (
      <div className="flex w-full max-w-md flex-col gap-3">
        <DropZone
          variant="list"
          accept=".pdf,.zip,.png,.jpg"
          multiple
          label="Drag files here"
          value={MOCK_FILES.slice(0, 1)}
          onChange={() => {}}
          className="max-w-md"
        />
        <DemoErrorState className="w-full">
          Upload failed — design-assets.zip could not be processed
        </DemoErrorState>
      </div>
    )
  }

  // success — all files uploaded; show the list variant in a success-toned shell
  if (state === "success") {
    return (
      <div
        className={cn(
          "w-full max-w-md rounded-2xl border border-dashed border-success/40 bg-success/5",
          "flex flex-col gap-3 px-6 py-10 text-center text-sm",
        )}
      >
        {/* success glyph */}
        <svg
          aria-label="Upload complete"
          role="img"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto size-6 text-success"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <div className="flex flex-col gap-1">
          <p className="font-medium text-foreground">3 files uploaded</p>
          <p className="text-xs text-muted-foreground">
            All files processed successfully
          </p>
        </div>
        {/* file list */}
        <ul className="flex w-full flex-col gap-1.5 text-left">
          {[
            { name: "project-brief.pdf", size: "1.4 MB" },
            { name: "design-assets.zip", size: "8.5 MB" },
            { name: "logo-final.png", size: "200 KB" },
          ].map(({ name, size }) => (
            <li
              key={name}
              className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5 shrink-0 text-success"
              >
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span className="flex-1 truncate font-mono text-xs text-foreground">
                {name}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {size}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // default — drop-zone with some uploaded files already in the list
  return (
    <DropZone
      variant="list"
      accept=".pdf,.zip,.png,.jpg"
      multiple
      label="Drag files here"
      value={MOCK_FILES}
      onChange={() => {}}
      className="max-w-md"
    />
  )
}
