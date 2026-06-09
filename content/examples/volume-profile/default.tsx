"use client"

import { VolumeProfile } from "@/components/ui/volume-profile"
import {
  DemoEmptyState,
  DemoErrorState,
} from "@/app/(docs)/_components/demo-state-bits"
import { useDemoState } from "@/lib/demo-viewport"
import { makeCandles } from "@/lib/market"

const BINS = 24
const WIDTH = 140
const HEIGHT = 320
const candles = makeCandles(64, { seed: 3 })

// Skeleton bars mirror the organic bell-curve silhouette of the real profile
const skeletonFractions = Array.from({ length: BINS }, (_, i) => {
  const t = i / (BINS - 1)
  const base = Math.sin((t * Math.PI * 3) / 4 + 0.6)
  const seed = Math.sin(i * 7.919 + 13.37) * 0.5 + 0.5
  return Math.max(0.12, base * 0.6 + seed * 0.4)
})

function VolumeProfileSkeleton() {
  const barHeight = HEIGHT / BINS
  return (
    <svg
      aria-hidden="true"
      width={WIDTH}
      height={HEIGHT}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="overflow-visible"
    >
      {skeletonFractions.map((fraction, i) => (
        <rect
          key={i}
          x={0}
          y={i * barHeight + 0.5}
          width={Math.round(fraction * WIDTH)}
          height={Math.max(1, barHeight - 1)}
          className="animate-pulse fill-muted"
          rx={2}
        />
      ))}
    </svg>
  )
}

export default function Example() {
  const state = useDemoState() ?? "default"
  const isLoading = state === "loading"
  const isEmpty = state === "empty"
  const isError = state === "error"

  return (
    <div className="w-full max-w-md p-4">
      {isLoading ? (
        <VolumeProfileSkeleton />
      ) : isEmpty ? (
        <div style={{ height: HEIGHT }} className="flex items-center">
          <DemoEmptyState className="w-full">No volume data</DemoEmptyState>
        </div>
      ) : isError ? (
        <div style={{ height: HEIGHT }} className="flex items-center">
          <DemoErrorState className="w-full">Couldn&apos;t load</DemoErrorState>
        </div>
      ) : (
        <VolumeProfile data={candles} width={WIDTH} height={HEIGHT} />
      )}
    </div>
  )
}
