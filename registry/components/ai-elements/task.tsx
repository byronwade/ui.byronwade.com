"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { CaretDown, MagnifyingGlass } from "@/lib/icons"
import type { ComponentProps } from "react";

const taskItemFileVariants = cva(
  "inline-flex items-center gap-1 rounded-lg edge px-1.5 py-0.5 text-xs",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground",
        muted: "bg-muted text-muted-foreground",
        brand: "border-brand/20 bg-brand/10 text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type TaskItemFileProps = ComponentProps<"div"> &
  VariantProps<typeof taskItemFileVariants>;

export const TaskItemFile = ({
  children,
  className,
  variant,
  ...props
}: TaskItemFileProps) => (
  <div
    data-slot="task-item-file"
    className={cn(taskItemFileVariants({ variant }), className)}
    {...props}
  >
    {children}
  </div>
);

export type TaskItemProps = ComponentProps<"div">;

export const TaskItem = ({ children, className, ...props }: TaskItemProps) => (
  <div
    data-slot="task-item"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </div>
);

export type TaskProps = ComponentProps<typeof Collapsible>;

export const Task = ({
  defaultOpen = true,
  className,
  ...props
}: TaskProps) => (
  <Collapsible
    data-slot="task"
    className={cn(className)}
    defaultOpen={defaultOpen}
    {...props}
  />
);

export type TaskTriggerProps = ComponentProps<typeof CollapsibleTrigger> & {
  title: string;
};

export const TaskTrigger = ({
  children,
  className,
  title,
  ...props
}: TaskTriggerProps) => (
  <CollapsibleTrigger
    data-slot="task-trigger"
    className={cn(
      "group flex w-full cursor-pointer items-center gap-2 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
      className
    )}
    {...props}
  >
    {children ?? (
      <>
        <MagnifyingGlass className="size-4" data-slot="task-trigger-icon" />
        <p className="text-sm">{title}</p>
        <CaretDown
          className="size-4 transition-transform group-data-[panel-open]:rotate-180"
          data-slot="task-trigger-chevron"
        />
      </>
    )}
  </CollapsibleTrigger>
);

export type TaskContentProps = ComponentProps<typeof CollapsibleContent>;

export const TaskContent = ({
  children,
  className,
  ...props
}: TaskContentProps) => (
  <CollapsibleContent
    data-slot="task-content"
    className={cn(
      "text-popover-foreground outline-none data-closed:animate-accordion-up data-open:animate-accordion-down",
      className
    )}
    {...props}
  >
    <div className="mt-4 space-y-2 border-l-2 border-muted pl-4">
      {children}
    </div>
  </CollapsibleContent>
);
