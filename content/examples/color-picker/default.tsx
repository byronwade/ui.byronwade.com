"use client"

import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/ui/color-picker"
import { DemoErrorState } from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"

function ColorPickerSkeleton() {
  return (
    <div className="flex max-w-sm flex-col gap-4 rounded-lg bg-card p-4 ring-1 ring-border/70">
      {/* selection field */}
      <Skeleton className="aspect-[4/3] w-full rounded-sm" />
      {/* eyedropper + hue/alpha rails */}
      <div className="flex items-center gap-4">
        <Skeleton className="size-8 shrink-0 rounded-md" />
        <div className="grid w-full gap-2">
          <Skeleton className="h-4 w-full rounded-full" />
          <Skeleton className="h-4 w-full rounded-full" />
        </div>
      </div>
      {/* format selector + value input */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-20 shrink-0 rounded-md" />
        <Skeleton className="h-8 flex-1 rounded-md" />
      </div>
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"

  if (state === "loading") {
    return <ColorPickerSkeleton />
  }

  if (state === "error") {
    return (
      <div className="max-w-sm">
        <DemoErrorState>Couldn&apos;t load</DemoErrorState>
      </div>
    )
  }

  // default / empty / success → normal color picker
  return (
    <ColorPicker
      defaultValue="#1d4ed8"
      className="max-w-sm rounded-lg edge bg-card p-4"
    >
      <ColorPickerSelection className="aspect-[4/3] w-full" />
      <div className="flex items-center gap-4">
        <ColorPickerEyeDropper />
        <div className="grid w-full gap-2">
          <ColorPickerHue />
          <ColorPickerAlpha />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <ColorPickerOutput />
        <ColorPickerFormat />
      </div>
    </ColorPicker>
  )
}
