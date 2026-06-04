"use client";

import { cn } from "@/lib/utils";
import { NodeToolbar, Position } from "@xyflow/react";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

const toolbarVariants = cva(
  "flex items-center gap-1 rounded-sm bg-popover p-1.5 text-popover-foreground edge",
  {
    variants: {
      orientation: {
        horizontal: "flex-row",
        vertical: "flex-col",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
);

export type ToolbarProps = ComponentProps<typeof NodeToolbar> &
  VariantProps<typeof toolbarVariants>;

export const Toolbar = ({
  className,
  orientation,
  position = Position.Bottom,
  ...props
}: ToolbarProps) => (
  <NodeToolbar
    className={cn(toolbarVariants({ orientation }), className)}
    data-slot="toolbar"
    position={position}
    {...props}
  />
);
