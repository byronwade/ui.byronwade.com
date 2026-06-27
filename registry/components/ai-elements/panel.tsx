"use client";

import { cn } from "@/lib/utils";
import { Panel as PanelPrimitive } from "@xyflow/react";
import type { ComponentProps } from "react";

export type PanelProps = ComponentProps<typeof PanelPrimitive>;

export const Panel = ({ className, ...props }: PanelProps) => (
  <PanelPrimitive
    className={cn(
      "edge m-4 overflow-hidden rounded-2xl bg-card p-1 text-card-foreground",
      className
    )}
    data-slot="panel"
    {...props}
  />
);
