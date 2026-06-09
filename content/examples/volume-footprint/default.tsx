"use client"

import { VolumeFootprint } from "@/components/ui/volume-footprint"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { Skeleton } from "@/components/ui/skeleton"
import { useDemoState } from "@/lib/demo-viewport"
import { makeFootprintRows } from "@/lib/market"

const rows = makeFootprintRows(20, { seed: 2 })

function VolumeFootprintSkeleton({
  width,
  height,
}: {
  width: number
  height: number
}) {
  const rowCount = 20
  const rowHeight = Math.floor(height / rowCount)
  return (
    <div
      aria-hidden="true"
      className="flex flex-col gap-0.5"
      style={{ width, height }}
    >
      {Array.from({ length: rowCount }, (_, i) => (
        <div key={i} className="flex items-center gap-0.5">
          <Skeleton
            className="rounded-sm"
            style={{
              height: Math.max(1, rowHeight - 1),
              width: Math.round(
                (Math.sin(i * 7.3 + 1.2) * 0.5 + 0.5) * (width / 2 - 4),
              ),
            }}
          />
          <Skeleton
            className="rounded-sm"
            style={{
              height: Math.max(1, rowHeight - 1),
              width: Math.round(
                (Math.sin(i * 5.9 + 3.1) * 0.5 + 0.5) * (width / 2 - 4),
              ),
            }}
          />
        </div>
      ))}
    </div>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  const width = 220
  const height = 320

  return (
    <div
      aria-busy={isLoading}
      data-state={state}
      className="w-full max-w-xs p-4"
    >
      {isLoading ? (
        <VolumeFootprintSkeleton width={width} height={height} />
      ) : isEmpty ? (
        <div style={{ width, minHeight: height }} className="flex items-center">
          <DemoEmptyState className="w-full">No footprint data</DemoEmptyState>
        </div>
      ) : isError ? (
        <div style={{ width, minHeight: height }} className="flex items-center">
          <DemoErrorState className="w-full">Couldn&apos;t load</DemoErrorState>
        </div>
      ) : (
        <VolumeFootprint rows={rows} width={width} height={height} />
      )}
    </div>
  )
}
