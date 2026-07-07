import * as React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type CyclePanelProps = {
  name: string
  dateRange: string
  issueCount: number
  progress: number
  className?: string
  footer?: React.ReactNode
}

function CyclePanel({
  name,
  dateRange,
  issueCount,
  progress,
  className,
  footer,
}: CyclePanelProps) {
  return (
    <Card data-slot="linear-cycle-panel" className={cn("gap-3 py-4", className)}>
      <CardHeader className="gap-1 pb-0">
        <CardTitle className="text-sm font-medium">{name}</CardTitle>
        <p className="font-mono text-xs text-muted-foreground">{dateRange}</p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Progress value={progress} className="h-1" />
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-mono tabular-nums">{progress}% complete</span>
          <span className="font-mono tabular-nums">{issueCount} issues</span>
        </div>
        {footer}
      </CardContent>
    </Card>
  )
}

export { CyclePanel }
export type { CyclePanelProps }
