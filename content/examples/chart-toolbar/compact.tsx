"use client"

import { useState } from "react"
import { Bell, Pause, Play, Plus } from "lucide-react"

import { ChartToolbar } from "@/components/chart-toolbar"
import { Button } from "@/components/ui/button"

export default function Example() {
  const [replay, setReplay] = useState(false)

  return (
    <div className="w-full overflow-hidden rounded-xl edge bg-background">
      <ChartToolbar
        symbol="AAPL"
        interval="1D"
        density="compact"
        onIndicatorsClick={() => {}}
        symbolAddon={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="size-7"
            aria-label="Add symbol"
          >
            <Plus className="size-3.5" />
          </Button>
        }
        actions={
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs"
            >
              <Bell className="size-3.5" />
              Alert
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-7 gap-1.5 px-2 text-xs"
              onClick={() => setReplay((current) => !current)}
            >
              {replay ? (
                <Pause className="size-3.5" />
              ) : (
                <Play className="size-3.5" />
              )}
              Replay
            </Button>
            <span className="flex-1" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mr-1 h-7 text-xs"
            >
              Trade
            </Button>
          </>
        }
      />
      <div className="h-48 bg-muted/10" />
    </div>
  )
}
