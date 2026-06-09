"use client"

import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Image } from "@/components/ai-elements/image"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"

// A tiny 1x1 transparent PNG used as a stand-in for an AI-generated image.
const PIXEL =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  return (
    <div className="flex min-h-[260px] items-center justify-center bg-background p-8">
      <figure className="flex w-72 flex-col gap-3">
        {isLoading ? (
          <Skeleton className="aspect-video w-full rounded-lg" />
        ) : isEmpty ? (
          <DemoEmptyState className="aspect-video flex items-center justify-center py-0">
            No image generated
          </DemoEmptyState>
        ) : isError ? (
          <DemoErrorState className="aspect-video flex items-center justify-center py-0">
            Couldn&apos;t generate image
          </DemoErrorState>
        ) : (
          <Image
            base64={PIXEL}
            uint8Array={new Uint8Array()}
            mediaType="image/png"
            alt="A neon city skyline at dusk, generated from a text prompt"
            className="aspect-video"
          />
        )}
        <figcaption className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {isLoading
              ? "Generating…"
              : isEmpty
                ? "No image"
                : isError
                  ? "Generation failed"
                  : "Generated image"}
          </span>
          {!isLoading && !isEmpty && !isError && (
            <span className="font-mono text-xs">1024×576</span>
          )}
        </figcaption>
      </figure>
    </div>
  )
}
