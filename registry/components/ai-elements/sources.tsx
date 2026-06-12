"use client";

import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Book, CaretDown } from "@/lib/icons"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const sourcesVariants = cva("not-prose mb-4 text-xs text-foreground");

export type SourcesProps = ComponentProps<typeof Collapsible> &
  VariantProps<typeof sourcesVariants>;

export const Sources = ({ className, ...props }: SourcesProps) => (
  <Collapsible
    className={cn(sourcesVariants(), className)}
    data-provenance="source"
    data-slot="sources"
    {...props}
  />
);

const sourcesTriggerVariants = cva(
  "flex items-center gap-2 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring [&_svg]:transition-transform data-[panel-open]:[&_svg]:rotate-180",
);

export type SourcesTriggerProps = ComponentProps<typeof CollapsibleTrigger> &
  VariantProps<typeof sourcesTriggerVariants> & {
    count: number;
  };

export const SourcesTrigger = ({
  className,
  count,
  children,
  ...props
}: SourcesTriggerProps) => (
  <CollapsibleTrigger
    className={cn(sourcesTriggerVariants(), className)}
    data-slot="sources-trigger"
    {...props}
  >
    {children ?? (
      <>
        <span className="font-medium">
          Used <span className="font-mono">{count}</span> sources
        </span>
        <CaretDown className="size-4" />
      </>
    )}
  </CollapsibleTrigger>
);

const sourcesContentVariants = cva(
  "mt-3 flex w-fit flex-col gap-2 outline-none data-closed:animate-out data-closed:fade-out-0 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-top-2",
);

export type SourcesContentProps = ComponentProps<typeof CollapsibleContent> &
  VariantProps<typeof sourcesContentVariants>;

export const SourcesContent = ({
  className,
  ...props
}: SourcesContentProps) => (
  <CollapsibleContent
    className={cn(sourcesContentVariants(), className)}
    data-slot="sources-content"
    {...props}
  />
);

const sourceVariants = cva(
  "flex items-center gap-2 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring",
);

export type SourceProps = ComponentProps<"a"> &
  VariantProps<typeof sourceVariants>;

export const Source = ({
  href,
  title,
  children,
  className,
  ...props
}: SourceProps) => (
  <a
    className={cn(sourceVariants(), className)}
    data-provenance="source-item"
    data-slot="source"
    href={href}
    rel="noreferrer"
    target="_blank"
    {...props}
  >
    {children ?? (
      <>
        <Book className="size-4" />
        <span className="block font-medium">{title}</span>
      </>
    )}
  </a>
);
