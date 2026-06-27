"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { CaretDown } from "@/lib/icons"
import type { ComponentProps, ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";

export type WebPreviewContextValue = {
  url: string;
  setUrl: (url: string) => void;
  consoleOpen: boolean;
  setConsoleOpen: (open: boolean) => void;
};

const WebPreviewContext = createContext<WebPreviewContextValue | null>(null);

const useWebPreview = () => {
  const context = useContext(WebPreviewContext);
  if (!context) {
    throw new Error("WebPreview components must be used within a WebPreview");
  }
  return context;
};

export type WebPreviewProps = ComponentProps<"div"> & {
  defaultUrl?: string;
  onUrlChange?: (url: string) => void;
};

export const WebPreview = ({
  className,
  children,
  defaultUrl = "",
  onUrlChange,
  ...props
}: WebPreviewProps) => {
  const [url, setUrl] = useState(defaultUrl);
  const [consoleOpen, setConsoleOpen] = useState(false);

  const handleUrlChange = (newUrl: string) => {
    setUrl(newUrl);
    onUrlChange?.(newUrl);
  };

  const contextValue: WebPreviewContextValue = {
    url,
    setUrl: handleUrlChange,
    consoleOpen,
    setConsoleOpen,
  };

  return (
    <WebPreviewContext.Provider value={contextValue}>
      <div
        data-slot="web-preview"
        className={cn(
          "flex size-full flex-col overflow-hidden rounded-2xl bg-card edge",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </WebPreviewContext.Provider>
  );
};

export type WebPreviewNavigationProps = ComponentProps<"div">;

export const WebPreviewNavigation = ({
  className,
  children,
  ...props
}: WebPreviewNavigationProps) => (
  <div
    data-slot="web-preview-navigation"
    className={cn("flex items-center gap-1 border-b border-border p-2", className)}
    {...props}
  >
    {children}
  </div>
);

export type WebPreviewNavigationButtonProps = ComponentProps<typeof Button> & {
  tooltip?: string;
};

export const WebPreviewNavigationButton = ({
  onClick,
  disabled,
  tooltip,
  children,
  className,
  "aria-label": ariaLabel,
  ...props
}: WebPreviewNavigationButtonProps) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            data-slot="web-preview-navigation-button"
            className={cn("text-muted-foreground hover:text-foreground", className)}
            disabled={disabled}
            onClick={onClick}
            size="icon-sm"
            variant="ghost"
            // Icon-only buttons need a discernible name; fall back to the tooltip.
            aria-label={ariaLabel ?? tooltip}
            {...props}
          >
            {children}
          </Button>
        }
      />
      {tooltip ? (
        <TooltipContent>
          <p>{tooltip}</p>
        </TooltipContent>
      ) : null}
    </Tooltip>
  </TooltipProvider>
);

export type WebPreviewUrlProps = ComponentProps<typeof Input>;

export const WebPreviewUrl = ({
  value,
  onChange,
  onKeyDown,
  className,
  ...props
}: WebPreviewUrlProps) => {
  const { url, setUrl } = useWebPreview();
  const [inputValue, setInputValue] = useState(url);

  // Sync input value with context URL when it changes externally
  useEffect(() => {
    setInputValue(url);
  }, [url]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    onChange?.(event);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const target = event.target as HTMLInputElement;
      setUrl(target.value);
    }
    onKeyDown?.(event);
  };

  return (
    <Input
      data-slot="web-preview-url"
      className={cn("h-8 flex-1 font-mono text-sm", className)}
      onChange={onChange ?? handleChange}
      onKeyDown={handleKeyDown}
      placeholder="Enter URL..."
      value={value ?? inputValue}
      {...props}
    />
  );
};

export type WebPreviewBodyProps = Omit<ComponentProps<"iframe">, "loading"> & {
  /** Overlay node rendered alongside the iframe (e.g. a skeleton). */
  loading?: ReactNode;
};

export const WebPreviewBody = ({
  className,
  loading,
  src,
  ...props
}: WebPreviewBodyProps) => {
  const { url } = useWebPreview();

  return (
    <div data-slot="web-preview-body" className="flex-1">
      <iframe
        data-slot="web-preview-body-iframe"
        className={cn("size-full", className)}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
        src={(src ?? url) || undefined}
        title="Preview"
        {...props}
      />
      {loading}
    </div>
  );
};

const consoleLogVariants = cva("text-xs", {
  variants: {
    level: {
      log: "text-foreground",
      warn: "text-warning",
      error: "text-destructive",
    },
  },
  defaultVariants: {
    level: "log",
  },
});

export type WebPreviewConsoleLog = {
  level: "log" | "warn" | "error";
  message: string;
  timestamp: Date;
};

export type WebPreviewConsoleProps = ComponentProps<typeof Collapsible> & {
  logs?: Array<WebPreviewConsoleLog>;
};

export const WebPreviewConsole = ({
  className,
  logs = [],
  children,
  ...props
}: WebPreviewConsoleProps) => {
  const { consoleOpen, setConsoleOpen } = useWebPreview();

  return (
    <Collapsible
      data-slot="web-preview-console"
      className={cn("border-t border-border bg-muted/50 font-mono text-sm", className)}
      onOpenChange={setConsoleOpen}
      open={consoleOpen}
      {...props}
    >
      <CollapsibleTrigger
        data-slot="web-preview-console-trigger"
        className="group flex w-full cursor-pointer items-center justify-between p-4 text-left font-medium text-foreground outline-none transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        Console
        <CaretDown
          data-slot="web-preview-console-chevron"
          className="size-4 transition-transform duration-200 group-data-[panel-open]:rotate-180"
        />
      </CollapsibleTrigger>
      <CollapsibleContent
        data-slot="web-preview-console-content"
        className="px-4 pb-4 outline-none data-closed:animate-accordion-up data-open:animate-accordion-down"
      >
        <div className="max-h-48 space-y-1 overflow-y-auto scrollbar-thin">
          {logs.length === 0 ? (
            <p className="text-muted-foreground">No console output</p>
          ) : (
            logs.map((log, index) => (
              <div
                data-slot="web-preview-console-log"
                className={cn(consoleLogVariants({ level: log.level }))}
                key={`${log.timestamp.getTime()}-${index}`}
              >
                <span className="text-muted-foreground">
                  {log.timestamp.toLocaleTimeString()}
                </span>{" "}
                {log.message}
              </div>
            ))
          )}
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
