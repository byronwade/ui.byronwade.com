"use client"

import type { ComponentPropsWithoutRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import {
  Circle,
  Minus,
  MoveHorizontal,
  PenLine,
  Slash,
  Square,
  Type,
  type LucideIcon,
} from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { cn } from "@/lib/utils"

type DrawingTool = {
  id: string
  label: string
  icon: LucideIcon
}

const DEFAULT_TOOLS: DrawingTool[] = [
  { id: "cursor", label: "Cursor", icon: MoveHorizontal },
  { id: "trendline", label: "Trend line", icon: Slash },
  { id: "hline", label: "Horizontal line", icon: Minus },
  { id: "rectangle", label: "Rectangle", icon: Square },
  { id: "fib", label: "Fibonacci", icon: Circle },
  { id: "text", label: "Text", icon: Type },
  { id: "brush", label: "Brush", icon: PenLine },
]

const drawingToolbarVariants = cva(
  "inline-flex rounded-xl border border-border bg-card p-1",
  {
    variants: {
      orientation: {
        vertical: "flex-col",
        horizontal: "flex-row flex-wrap",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
)

type DrawingToolbarProps = Omit<ComponentPropsWithoutRef<"div">, "children"> &
  VariantProps<typeof drawingToolbarVariants> & {
    tools?: DrawingTool[]
    activeTool?: string
    onToolChange?: (toolId: string) => void
  }

function DrawingToolbar({
  tools = DEFAULT_TOOLS,
  activeTool = "cursor",
  onToolChange,
  orientation = "vertical",
  className,
  ...props
}: DrawingToolbarProps) {
  return (
    <div
      data-slot="drawing-toolbar"
      className={cn(drawingToolbarVariants({ orientation }), className)}
      {...props}
    >
      <TooltipProvider>
        <ToggleGroup
          role="toolbar"
          aria-label="Drawing tools"
          variant="outline"
          size="sm"
          spacing={0}
          orientation={orientation}
          value={[activeTool]}
          onValueChange={(values) => {
            const next = values[0]
            if (next) onToolChange?.(next)
          }}
          className="border-0 bg-transparent p-0 shadow-none"
        >
          {tools.map((tool) => {
            const Icon = tool.icon
            return (
              <Tooltip key={tool.id}>
                <TooltipTrigger
                  render={
                    <ToggleGroupItem
                      value={tool.id}
                      aria-label={tool.label}
                      data-slot="drawing-toolbar-item"
                      data-tool-id={tool.id}
                      className="px-2"
                    />
                  }
                >
                  <Icon className="size-4" />
                </TooltipTrigger>
                <TooltipContent>{tool.label}</TooltipContent>
              </Tooltip>
            )
          })}
        </ToggleGroup>
      </TooltipProvider>
    </div>
  )
}

export { DrawingToolbar, drawingToolbarVariants, DEFAULT_TOOLS }
export type { DrawingToolbarProps, DrawingTool }
