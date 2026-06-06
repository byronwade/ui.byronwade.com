"use client"

import type { ComponentPropsWithoutRef } from "react"
import { useState } from "react"
import { Pause, Play, SkipBack, SkipForward } from "lucide-react"

import { Button } from "@/components/ui/button"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

type ReplaySpeed = "0.5x" | "1x" | "2x" | "4x"

const SPEED_OPTIONS: { label: string; value: ReplaySpeed }[] = [
  { label: "0.5×", value: "0.5x" },
  { label: "1×", value: "1x" },
  { label: "2×", value: "2x" },
  { label: "4×", value: "4x" },
]

type ReplayControlsProps = Omit<ComponentPropsWithoutRef<"div">, "children"> & {
  playing?: boolean
  position?: number
  duration?: number
  speed?: ReplaySpeed
  onPlay?: () => void
  onPause?: () => void
  onSeek?: (position: number) => void
  onSpeedChange?: (speed: ReplaySpeed) => void
  onStepBack?: () => void
  onStepForward?: () => void
}

function ReplayControls({
  playing: playingProp,
  position: positionProp,
  duration = 100,
  speed: speedProp,
  onPlay,
  onPause,
  onSeek,
  onSpeedChange,
  onStepBack,
  onStepForward,
  className,
  ...props
}: ReplayControlsProps) {
  const [internalPlaying, setInternalPlaying] = useState(false)
  const [internalPosition, setInternalPosition] = useState(0)
  const [internalSpeed, setInternalSpeed] = useState<ReplaySpeed>("1x")

  const playing = playingProp ?? internalPlaying
  const position = positionProp ?? internalPosition
  const speed = speedProp ?? internalSpeed

  const togglePlay = () => {
    if (playing) {
      onPause?.()
      if (playingProp === undefined) setInternalPlaying(false)
    } else {
      onPlay?.()
      if (playingProp === undefined) setInternalPlaying(true)
    }
  }

  const handleSeek = (values: number | readonly number[]) => {
    const next = Array.isArray(values) ? (values[0] ?? 0) : values
    onSeek?.(next)
    if (positionProp === undefined) setInternalPosition(next)
  }

  const handleSpeed = (next: ReplaySpeed) => {
    onSpeedChange?.(next)
    if (speedProp === undefined) setInternalSpeed(next)
  }

  return (
    <div
      data-slot="replay-controls"
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3",
        className,
      )}
      {...props}
    >
      <div
        data-slot="replay-controls-transport"
        className="flex items-center justify-center gap-2"
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Step back one bar"
          onClick={onStepBack}
        >
          <SkipBack className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label={playing ? "Pause replay" : "Play replay"}
          onClick={togglePlay}
        >
          {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Step forward one bar"
          onClick={onStepForward}
        >
          <SkipForward className="size-4" />
        </Button>
      </div>
      <Slider
        aria-label="Replay position"
        min={0}
        max={duration}
        value={[position]}
        onValueChange={handleSeek}
      />
      <div
        data-slot="replay-controls-meta"
        className="flex items-center justify-between gap-3"
      >
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {Math.round(position)} / {duration}
        </span>
        <SegmentedControl
          options={SPEED_OPTIONS}
          value={speed}
          onValueChange={handleSpeed}
        />
      </div>
    </div>
  )
}

export { ReplayControls }
export type { ReplayControlsProps, ReplaySpeed }
