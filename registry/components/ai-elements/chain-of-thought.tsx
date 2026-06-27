"use client";

import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Brain, CaretDown, Circle, type Icon } from "@/lib/icons"
import type { ComponentProps, ReactNode } from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/**
 * ChainOfThought — collapsible, step-by-step "reasoning trace" for AI responses,
 * adapted from Vercel AI Elements to the byronwade/ui Design DNA.
 *
 * Built on our Base UI `collapsible` primitive and `badge`. Tokens only
 * (muted-foreground → foreground on the trigger, `bg-muted` image well,
 * `bg-border` connector rail). Every rendered part carries a `data-slot`; each
 * step also exposes `data-status` so callers/tests can target state without
 * matching classes. Step status styles live in a `cva(...)` block.
 *
 * Controllable: pass `open` + `onOpenChange` to drive the disclosure externally,
 * or `defaultOpen` for uncontrolled.
 */

// ---------------------------------------------------------------------------
// useControllableState — tiny inlined controllable-state hook (replaces
// @radix-ui/react-use-controllable-state). Supports a controlled `prop`, an
// uncontrolled `defaultProp`, and an `onChange` callback fired on change.
// ---------------------------------------------------------------------------

type UseControllableStateParams<T> = {
  prop?: T;
  defaultProp?: T;
  onChange?: (value: T) => void;
};

function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateParams<T>): [T | undefined, (next: T) => void] {
  const [uncontrolled, setUncontrolled] = useState<T | undefined>(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolled;

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onChangeRef.current?.(next);
    },
    [isControlled]
  );

  return [value, setValue];
}

type ChainOfThoughtContextValue = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
};

const ChainOfThoughtContext =
  createContext<ChainOfThoughtContextValue | null>(null);

export const useChainOfThought = () => {
  const context = useContext(ChainOfThoughtContext);
  if (!context) {
    throw new Error(
      "ChainOfThought components must be used within ChainOfThought"
    );
  }
  return context;
};

export type ChainOfThoughtProps = ComponentProps<"div"> & {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const ChainOfThought = memo(
  ({
    className,
    open,
    defaultOpen = false,
    onOpenChange,
    children,
    ...props
  }: ChainOfThoughtProps) => {
    const [isOpen, setIsOpen] = useControllableState({
      prop: open,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    });

    const chainOfThoughtContext = useMemo(
      () => ({ isOpen: isOpen ?? false, setIsOpen }),
      [isOpen, setIsOpen]
    );

    return (
      <ChainOfThoughtContext.Provider value={chainOfThoughtContext}>
        <div
          className={cn("not-prose max-w-prose space-y-4", className)}
          data-slot="chain-of-thought"
          {...props}
        >
          {children}
        </div>
      </ChainOfThoughtContext.Provider>
    );
  }
);

export type ChainOfThoughtHeaderProps = ComponentProps<"button">;

export const ChainOfThoughtHeader = memo(
  ({ className, children, onClick, ...props }: ChainOfThoughtHeaderProps) => {
    const { isOpen, setIsOpen } = useChainOfThought();

    return (
      <button
        aria-expanded={isOpen}
        className={cn(
          "group flex w-full items-center gap-2 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50",
          className
        )}
        data-panel-open={isOpen || undefined}
        data-slot="chain-of-thought-header"
        onClick={(event) => {
          onClick?.(event);
          setIsOpen(!isOpen);
        }}
        type="button"
        {...props}
      >
        <Brain
          className="size-4"
          data-slot="chain-of-thought-header-icon"
        />
        <span className="flex-1 text-left">
          {children ?? "Chain of Thought"}
        </span>
        <CaretDown
          className="size-4 transition-transform group-data-[panel-open]:rotate-180"
          data-slot="chain-of-thought-header-chevron"
        />
      </button>
    );
  }
);

const chainOfThoughtStepVariants = cva(
  "flex gap-2 text-sm fade-in-0 slide-in-from-top-2 animate-in",
  {
    variants: {
      status: {
        complete: "text-muted-foreground",
        active: "text-foreground",
        pending: "text-muted-foreground/50",
      },
    },
    defaultVariants: {
      status: "complete",
    },
  }
);

export type ChainOfThoughtStepProps = ComponentProps<"div"> &
  VariantProps<typeof chainOfThoughtStepVariants> & {
    icon?: Icon;
    label: ReactNode;
    description?: ReactNode;
  };

export const ChainOfThoughtStep = memo(
  ({
    className,
    icon: Icon = Circle,
    label,
    description,
    status = "complete",
    children,
    ...props
  }: ChainOfThoughtStepProps) => (
    <div
      className={cn(chainOfThoughtStepVariants({ status }), className)}
      data-slot="chain-of-thought-step"
      data-status={status}
      {...props}
    >
      <div className="relative mt-0.5">
        <Icon className="size-4" data-slot="chain-of-thought-step-icon" />
        <div className="-mx-px absolute top-7 bottom-0 left-1/2 w-px bg-border" />
      </div>
      <div className="flex-1 space-y-2 overflow-hidden">
        <div data-slot="chain-of-thought-step-label">{label}</div>
        {description && (
          <div
            className="text-xs text-muted-foreground"
            data-slot="chain-of-thought-step-description"
          >
            {description}
          </div>
        )}
        {children}
      </div>
    </div>
  )
);

export type ChainOfThoughtSearchResultsProps = ComponentProps<"div">;

export const ChainOfThoughtSearchResults = memo(
  ({ className, ...props }: ChainOfThoughtSearchResultsProps) => (
    <div
      className={cn("flex flex-wrap items-center gap-2", className)}
      data-slot="chain-of-thought-search-results"
      {...props}
    />
  )
);

export type ChainOfThoughtSearchResultProps = ComponentProps<typeof Badge>;

export const ChainOfThoughtSearchResult = memo(
  ({ className, children, ...props }: ChainOfThoughtSearchResultProps) => (
    <Badge
      className={cn("gap-1 px-2 py-0.5 text-xs font-normal", className)}
      data-slot="chain-of-thought-search-result"
      variant="secondary"
      {...props}
    >
      {children}
    </Badge>
  )
);

export type ChainOfThoughtContentProps = ComponentProps<
  typeof CollapsibleContent
>;

export const ChainOfThoughtContent = memo(
  ({ className, children, ...props }: ChainOfThoughtContentProps) => {
    const { isOpen } = useChainOfThought();

    return (
      <Collapsible open={isOpen}>
        <CollapsibleContent
          className={cn(
            "mt-2 space-y-3 text-popover-foreground outline-none data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-top-2 data-open:animate-in data-open:slide-in-from-top-2",
            className
          )}
          data-slot="chain-of-thought-content"
          {...props}
        >
          {children}
        </CollapsibleContent>
      </Collapsible>
    );
  }
);

export type ChainOfThoughtImageProps = ComponentProps<"div"> & {
  caption?: string;
};

export const ChainOfThoughtImage = memo(
  ({ className, children, caption, ...props }: ChainOfThoughtImageProps) => (
    <div
      className={cn("mt-2 space-y-2", className)}
      data-slot="chain-of-thought-image"
      {...props}
    >
      <div className="relative flex max-h-80 items-center justify-center overflow-hidden rounded-lg bg-muted p-3">
        {children}
      </div>
      {caption && (
        <p
          className="text-xs text-muted-foreground"
          data-slot="chain-of-thought-image-caption"
        >
          {caption}
        </p>
      )}
    </div>
  )
);

ChainOfThought.displayName = "ChainOfThought";
ChainOfThoughtHeader.displayName = "ChainOfThoughtHeader";
ChainOfThoughtStep.displayName = "ChainOfThoughtStep";
ChainOfThoughtSearchResults.displayName = "ChainOfThoughtSearchResults";
ChainOfThoughtSearchResult.displayName = "ChainOfThoughtSearchResult";
ChainOfThoughtContent.displayName = "ChainOfThoughtContent";
ChainOfThoughtImage.displayName = "ChainOfThoughtImage";
