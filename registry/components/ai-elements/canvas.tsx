"use client";

import { cn } from "@/lib/utils";
import {
  Background,
  BackgroundVariant,
  ReactFlow,
  type ReactFlowProps,
} from "@xyflow/react";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import "@xyflow/react/dist/style.css";

const canvasVariants = cva(
  "size-full bg-sidebar text-foreground [&_.react-flow__attribution]:bg-transparent [&_.react-flow__attribution]:text-muted-foreground",
  {
    variants: {
      pattern: {
        dots: "",
        lines: "",
        cross: "",
        none: "",
      },
    },
    defaultVariants: {
      pattern: "dots",
    },
  }
);

const patternVariant: Record<
  NonNullable<VariantProps<typeof canvasVariants>["pattern"]>,
  BackgroundVariant | null
> = {
  dots: BackgroundVariant.Dots,
  lines: BackgroundVariant.Lines,
  cross: BackgroundVariant.Cross,
  none: null,
};

export type CanvasProps = ReactFlowProps &
  VariantProps<typeof canvasVariants> & {
    children?: ReactNode;
  };

export const Canvas = ({
  children,
  className,
  pattern = "dots",
  ...props
}: CanvasProps) => {
  const resolvedPattern = patternVariant[pattern ?? "dots"];

  return (
    <ReactFlow
      className={cn(canvasVariants({ pattern }), className)}
      data-slot="ai-canvas"
      deleteKeyCode={["Backspace", "Delete"]}
      fitView
      panOnDrag={false}
      panOnScroll
      selectionOnDrag={true}
      zoomOnDoubleClick={false}
      {...props}
    >
      {resolvedPattern !== null && (
        <Background
          bgColor="var(--sidebar)"
          className="ai-canvas-background"
          color="var(--edge)"
          id="ai-canvas-background"
          variant={resolvedPattern}
        />
      )}
      {children}
    </ReactFlow>
  );
};
