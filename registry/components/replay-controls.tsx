"use client"

import type { ComponentPropsWithoutRef } from "react"
import { useState } from "react"

import { useControllableState } from "@/lib/controllable-state"
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
  defaultPlaying?: boolean
  onPlayingChange?: (playing: boolean) => void
  position?: number
  duration?: number
  speed?: ReplaySpeed
  /** @deprecated Prefer onPlayingChange */
  onPlay?: () => void
  /** @deprecated Prefer onPlayingChange */
  onPause?: () => void
  onSeek?: (position: number) => void
  onSpeedChange?: (speed: ReplaySpeed) => void
  onStepBack?: () => void
  onStepForward?: () => void
  /** Card layout for panels; bar layout for terminal footers. */
  variant?: "card" | "bar"
  showSlider?: boolean
}

function ReplayControls({
  playing: playingProp,
  defaultPlaying = false,
  onPlayingChange,
  position: positionProp,
  duration = 100,
  speed: speedProp,
  onPlay,
  onPause,
  onSeek,
  onSpeedChange,
  onStepBack,
  onStepForward,
  variant = "card",
  showSlider = variant === "card",
  className,
  ...props
}: ReplayControlsProps) {
  const [playing, setPlaying] = useControllableState({
    prop: playingProp,
    defaultProp: defaultPlaying,
    onChange: onPlayingChange,
  })
  const [internalPosition, setInternalPosition] = useState(0)
  const [internalSpeed, setInternalSpeed] = useState<ReplaySpeed>("1x")

  const position = positionProp ?? internalPosition
  const speed = speedProp ?? internalSpeed

  const togglePlay = () => {
    const next = !playing
    setPlaying(next)
    if (next) onPlay?.()
    else onPause?.()
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

  const bar = variant === "bar"

  return (
    <div
      data-slot="replay-controls"
      data-variant={variant}
      className={cn(
        bar
          ? "flex items-center gap-1"
          : "flex flex-col gap-3 rounded-xl border border-border bg-card px-4 py-3",
        className,
      )}
      {...props}
    >
      <div
        data-slot="replay-controls-transport"
        className={cn(
          "flex items-center",
          bar ? "gap-0.5" : "justify-center gap-2",
        )}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={cn(bar && "size-6")}
          aria-label="Step back one bar"
          onClick={onStepBack}
        >
          <SkipBack className={cn(bar ? "size-3" : "size-4")} />
        </Button>
        <Button
          type="button"
          variant={bar ? "ghost" : "outline"}
          size={bar ? "icon-sm" : "icon"}
          className={cn(bar && "size-6")}
          aria-label={playing ? "Pause replay" : "Play replay"}
          onClick={togglePlay}
        >
          {playing ? (
            <Pause className={cn(bar ? "size-3" : "size-4")} />
          ) : (
            <Play className={cn(bar ? "size-3" : "size-4")} />
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className={cn(bar && "size-6")}
          aria-label="Step forward one bar"
          onClick={onStepForward}
        >
          <SkipForward className={cn(bar ? "size-3" : "size-4")} />
        </Button>
      </div>
      {showSlider ? (
        <Slider
          aria-label="Replay position"
          min={0}
          max={duration}
          value={[position]}
          onValueChange={handleSeek}
        />
      ) : null}
      <div
        data-slot="replay-controls-meta"
        className={cn(
          "flex items-center gap-3",
          bar ? "gap-1.5" : "justify-between",
        )}
      >
        <span className="font-mono text-xs tabular-nums text-muted-foreground">
          {Math.round(position)}/{duration}
        </span>
        {!bar ? (
          <SegmentedControl
            options={SPEED_OPTIONS}
            value={speed}
            onValueChange={handleSpeed}
          />
        ) : null}
      </div>
    </div>
  )
}

export { ReplayControls }
export type { ReplayControlsProps, ReplaySpeed }
