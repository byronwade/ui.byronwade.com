"use client";

import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { ToolUIPart } from "ai";
import { CaretDown, CheckCircle, Circle, Clock, Wrench, XCircle } from "@/lib/icons"
import type { ComponentProps, ReactNode } from "react";
import { isValidElement } from "react";
import { CodeBlock } from "./code-block";

export type ToolProps = ComponentProps<typeof Collapsible>;

export const Tool = ({ className, ...props }: ToolProps) => (
  <Collapsible
    data-slot="tool"
    data-provenance="tool"
    className={cn(
      "not-prose mb-4 w-full overflow-hidden rounded-2xl bg-card text-card-foreground edge",
      className
    )}
    {...props}
  />
);

export type ToolHeaderProps = {
  title?: string;
  type: ToolUIPart["type"];
  state: ToolUIPart["state"];
  className?: string;
};

const getStatusBadge = (status: ToolUIPart["state"]) => {
  const labels: Record<ToolUIPart["state"], string> = {
    "input-streaming": "Pending",
    "input-available": "Running",
    "approval-requested": "Awaiting Approval",
    "approval-responded": "Responded",
    "output-available": "Completed",
    "output-error": "Error",
    "output-denied": "Denied",
  };

  const icons: Record<ToolUIPart["state"], ReactNode> = {
    "input-streaming": <Circle className="size-4" />,
    "input-available": <Clock className="size-4 animate-pulse" />,
    "approval-requested": <Clock className="size-4 text-warning" />,
    "approval-responded": <CheckCircle className="size-4 text-brand" />,
    "output-available": <CheckCircle className="size-4 text-success" />,
    "output-error": <XCircle className="size-4 text-destructive" />,
    "output-denied": <XCircle className="size-4 text-warning" />,
  };

  const variants: Record<
    ToolUIPart["state"],
    ComponentProps<typeof Badge>["variant"]
  > = {
    "input-streaming": "secondary",
    "input-available": "secondary",
    "approval-requested": "warning",
    "approval-responded": "secondary",
    "output-available": "success",
    "output-error": "destructive",
    "output-denied": "warning",
  };

  return (
    <Badge
      className="gap-1.5 rounded-full font-mono text-xs"
      data-slot="tool-status-badge"
      variant={variants[status]}
    >
      {icons[status]}
      {labels[status]}
    </Badge>
  );
};

export const ToolHeader = ({
  className,
  title,
  type,
  state,
  ...props
}: ToolHeaderProps) => (
  <CollapsibleTrigger
    data-slot="tool-header"
    className={cn(
      "group flex w-full items-center justify-between gap-4 p-3 outline-none transition-colors hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50",
      className
    )}
    {...props}
  >
    <div className="flex items-center gap-2" data-slot="tool-header-meta">
      <Wrench className="size-4 text-muted-foreground" />
      <span
        className="font-medium font-mono text-muted-foreground text-xs uppercase tracking-wide"
        data-slot="tool-provenance"
      >
        Tool
      </span>
      <span className="font-medium text-sm" data-slot="tool-header-title">
        {title ?? type.split("-").slice(1).join("-")}
      </span>
      {getStatusBadge(state)}
    </div>
    <CaretDown
      className="size-4 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180"
      data-slot="tool-header-chevron"
    />
  </CollapsibleTrigger>
);

export type ToolContentProps = ComponentProps<typeof CollapsibleContent>;

export const ToolContent = ({ className, ...props }: ToolContentProps) => (
  <CollapsibleContent
    data-slot="tool-content"
    className={cn(
      "text-popover-foreground outline-none data-closed:animate-accordion-up data-open:animate-accordion-down",
      className
    )}
    {...props}
  />
);

export type ToolInputProps = ComponentProps<"div"> & {
  input: ToolUIPart["input"];
};

export const ToolInput = ({ className, input, ...props }: ToolInputProps) => (
  <div
    data-slot="tool-input"
    className={cn("space-y-2 overflow-hidden p-4", className)}
    {...props}
  >
    <h4 className="font-medium font-mono text-muted-foreground text-xs uppercase tracking-wide">
      Parameters
    </h4>
    <div className="rounded-lg bg-muted/50">
      <CodeBlock code={JSON.stringify(input, null, 2)} language="json" />
    </div>
  </div>
);

export type ToolOutputProps = ComponentProps<"div"> & {
  output: ToolUIPart["output"];
  errorText: ToolUIPart["errorText"];
};

export const ToolOutput = ({
  className,
  output,
  errorText,
  ...props
}: ToolOutputProps) => {
  if (!(output || errorText)) {
    return null;
  }

  let Output = <div>{output as ReactNode}</div>;

  if (typeof output === "object" && !isValidElement(output)) {
    Output = (
      <CodeBlock code={JSON.stringify(output, null, 2)} language="json" />
    );
  } else if (typeof output === "string") {
    Output = <CodeBlock code={output} language="json" />;
  }

  return (
    <div
      data-slot="tool-output"
      className={cn("space-y-2 p-4", className)}
      {...props}
    >
      <h4 className="font-medium font-mono text-muted-foreground text-xs uppercase tracking-wide">
        {errorText ? "Error" : "Result"}
      </h4>
      <div
        className={cn(
          "overflow-x-auto rounded-lg text-xs [&_table]:w-full",
          errorText
            ? "bg-destructive/10 text-destructive"
            : "bg-muted/50 text-foreground"
        )}
      >
        {errorText && <div>{errorText}</div>}
        {Output}
      </div>
    </div>
  );
};
