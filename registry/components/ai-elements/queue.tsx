"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDownIcon, PaperclipIcon } from "lucide-react";
import type { ComponentProps } from "react";

export type QueueMessagePart = {
  type: string;
  text?: string;
  url?: string;
  filename?: string;
  mediaType?: string;
};

export type QueueMessage = {
  id: string;
  parts: QueueMessagePart[];
};

export type QueueTodo = {
  id: string;
  title: string;
  description?: string;
  status?: "pending" | "completed";
};

export type QueueItemProps = ComponentProps<"li">;

export const QueueItem = ({ className, ...props }: QueueItemProps) => (
  <li
    data-slot="queue-item"
    className={cn(
      "group flex flex-col gap-1 rounded-md px-3 py-1 text-sm transition-colors hover:bg-muted",
      className
    )}
    {...props}
  />
);

const queueItemIndicatorVariants = cva(
  "mt-0.5 inline-block size-2.5 rounded-full border",
  {
    variants: {
      completed: {
        true: "border-muted-foreground/20 bg-muted-foreground/10",
        false: "border-muted-foreground/50",
      },
    },
    defaultVariants: {
      completed: false,
    },
  }
);

export type QueueItemIndicatorProps = ComponentProps<"span"> &
  VariantProps<typeof queueItemIndicatorVariants>;

export const QueueItemIndicator = ({
  completed = false,
  className,
  ...props
}: QueueItemIndicatorProps) => (
  <span
    data-slot="queue-item-indicator"
    data-completed={completed ? "" : undefined}
    className={cn(queueItemIndicatorVariants({ completed }), className)}
    {...props}
  />
);

const queueItemContentVariants = cva("line-clamp-1 grow break-words", {
  variants: {
    completed: {
      true: "text-muted-foreground/50 line-through",
      false: "text-muted-foreground",
    },
  },
  defaultVariants: {
    completed: false,
  },
});

export type QueueItemContentProps = ComponentProps<"span"> &
  VariantProps<typeof queueItemContentVariants>;

export const QueueItemContent = ({
  completed = false,
  className,
  ...props
}: QueueItemContentProps) => (
  <span
    data-slot="queue-item-content"
    data-completed={completed ? "" : undefined}
    className={cn(queueItemContentVariants({ completed }), className)}
    {...props}
  />
);

const queueItemDescriptionVariants = cva("ml-6 text-xs", {
  variants: {
    completed: {
      true: "text-muted-foreground/40 line-through",
      false: "text-muted-foreground",
    },
  },
  defaultVariants: {
    completed: false,
  },
});

export type QueueItemDescriptionProps = ComponentProps<"div"> &
  VariantProps<typeof queueItemDescriptionVariants>;

export const QueueItemDescription = ({
  completed = false,
  className,
  ...props
}: QueueItemDescriptionProps) => (
  <div
    data-slot="queue-item-description"
    data-completed={completed ? "" : undefined}
    className={cn(queueItemDescriptionVariants({ completed }), className)}
    {...props}
  />
);

export type QueueItemActionsProps = ComponentProps<"div">;

export const QueueItemActions = ({
  className,
  ...props
}: QueueItemActionsProps) => (
  <div
    data-slot="queue-item-actions"
    className={cn("flex gap-1", className)}
    {...props}
  />
);

export type QueueItemActionProps = Omit<
  ComponentProps<typeof Button>,
  "variant" | "size"
>;

export const QueueItemAction = ({
  className,
  ...props
}: QueueItemActionProps) => (
  <Button
    data-slot="queue-item-action"
    className={cn(
      "size-auto rounded-sm p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted-foreground/10 hover:text-foreground group-hover:opacity-100",
      className
    )}
    size="icon"
    type="button"
    variant="ghost"
    {...props}
  />
);

export type QueueItemAttachmentProps = ComponentProps<"div">;

export const QueueItemAttachment = ({
  className,
  ...props
}: QueueItemAttachmentProps) => (
  <div
    data-slot="queue-item-attachment"
    className={cn("mt-1 flex flex-wrap gap-2", className)}
    {...props}
  />
);

export type QueueItemImageProps = ComponentProps<"img">;

export const QueueItemImage = ({
  alt = "",
  className,
  ...props
}: QueueItemImageProps) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    alt={alt}
    data-slot="queue-item-image"
    className={cn("h-8 w-8 rounded-sm border object-cover", className)}
    height={32}
    width={32}
    {...props}
  />
);

export type QueueItemFileProps = ComponentProps<"span">;

export const QueueItemFile = ({
  children,
  className,
  ...props
}: QueueItemFileProps) => (
  <span
    data-slot="queue-item-file"
    className={cn(
      "flex items-center gap-1 rounded-sm border bg-muted px-2 py-1 text-xs",
      className
    )}
    {...props}
  >
    <PaperclipIcon className="size-3" data-slot="queue-item-file-icon" />
    <span className="max-w-24 truncate">{children}</span>
  </span>
);

export type QueueListProps = ComponentProps<typeof ScrollArea>;

export const QueueList = ({
  children,
  className,
  ...props
}: QueueListProps) => (
  <ScrollArea
    data-slot="queue-list"
    className={cn("-mb-1 mt-2", className)}
    {...props}
  >
    <div className="max-h-40 pr-4">
      <ul>{children}</ul>
    </div>
  </ScrollArea>
);

// QueueSection - collapsible section container
export type QueueSectionProps = ComponentProps<typeof Collapsible>;

export const QueueSection = ({
  className,
  defaultOpen = true,
  ...props
}: QueueSectionProps) => (
  <Collapsible
    data-slot="queue-section"
    className={cn(className)}
    defaultOpen={defaultOpen}
    {...props}
  />
);

// QueueSectionTrigger - section header/trigger
export type QueueSectionTriggerProps = ComponentProps<
  typeof CollapsibleTrigger
>;

export const QueueSectionTrigger = ({
  children,
  className,
  ...props
}: QueueSectionTriggerProps) => (
  <CollapsibleTrigger
    data-slot="queue-section-trigger"
    className={cn(
      "group flex w-full items-center justify-between rounded-md bg-muted/40 px-3 py-2 text-left text-sm font-medium text-muted-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring",
      className
    )}
    {...props}
  >
    {children}
  </CollapsibleTrigger>
);

// QueueSectionLabel - label content with icon and count
export type QueueSectionLabelProps = ComponentProps<"span"> & {
  count?: number;
  label: string;
  icon?: React.ReactNode;
};

export const QueueSectionLabel = ({
  count,
  label,
  icon,
  className,
  ...props
}: QueueSectionLabelProps) => (
  <span
    data-slot="queue-section-label"
    className={cn("flex items-center gap-2", className)}
    {...props}
  >
    <ChevronDownIcon
      className="size-4 -rotate-90 transition-transform group-data-[panel-open]:rotate-0"
      data-slot="queue-section-label-chevron"
    />
    {icon}
    <span className="font-mono">
      {count} {label}
    </span>
  </span>
);

// QueueSectionContent - collapsible content area
export type QueueSectionContentProps = ComponentProps<
  typeof CollapsibleContent
>;

export const QueueSectionContent = ({
  className,
  ...props
}: QueueSectionContentProps) => (
  <CollapsibleContent
    data-slot="queue-section-content"
    className={cn(className)}
    {...props}
  />
);

export type QueueProps = ComponentProps<"div">;

export const Queue = ({ className, ...props }: QueueProps) => (
  <div
    data-slot="queue"
    className={cn(
      "flex flex-col gap-2 rounded-xl border border-border bg-background px-3 pt-2 pb-2 shadow-xs",
      className
    )}
    {...props}
  />
);
