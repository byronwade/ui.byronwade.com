"use client";

import { Bookmark, type IconProps } from "@/lib/icons"
import type { ComponentProps, HTMLAttributes } from "react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type CheckpointProps = HTMLAttributes<HTMLDivElement>;

export const Checkpoint = ({
  className,
  children,
  ...props
}: CheckpointProps) => (
  <div
    data-slot="checkpoint"
    className={cn(
      "flex items-center gap-0.5 overflow-hidden text-muted-foreground",
      className
    )}
    {...props}
  >
    {children}
    <Separator />
  </div>
);

export type CheckpointIconProps = IconProps;

export const CheckpointIcon = ({
  className,
  children,
  ...props
}: CheckpointIconProps) =>
  children ?? (
    <Bookmark
      data-slot="checkpoint-icon"
      className={cn("size-4 shrink-0", className)}
      {...props}
    />
  );

export type CheckpointTriggerProps = ComponentProps<typeof Button> & {
  tooltip?: string;
};

export const CheckpointTrigger = ({
  children,
  className,
  variant = "ghost",
  size = "sm",
  tooltip,
  ...props
}: CheckpointTriggerProps) =>
  tooltip ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <Button
              data-slot="checkpoint-trigger"
              className={className}
              size={size}
              type="button"
              variant={variant}
              {...props}
            >
              {children}
            </Button>
          }
        />
        <TooltipContent align="start" side="bottom">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <Button
      data-slot="checkpoint-trigger"
      className={className}
      size={size}
      type="button"
      variant={variant}
      {...props}
    >
      {children}
    </Button>
  );
