"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { BrainIcon, ChevronDownIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Streamdown } from "streamdown";
import { Shimmer } from "./shimmer";

/**
 * Reasoning — collapsible "thinking" trace for AI responses, adapted from
 * Vercel AI Elements to the byronwade/ui Design DNA.
 *
 * Built on our Base UI `collapsible` primitive. Tokens only (muted-foreground →
 * foreground on the trigger, `font-mono` for the duration count, `bg-muted`
 * rail on the content). Every rendered part carries a `data-slot`. Variants live
 * in a `cva(...)` block. While `isStreaming`, the trigger auto-opens; once the
 * stream ends it records the elapsed seconds and (when uncontrolled +
 * `defaultOpen`) auto-collapses after a short delay.
 *
 * Controllable: pass `open` + `onOpenChange` to drive it externally, or
 * `defaultOpen` for uncontrolled. Same for `duration`.
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

type ReasoningContextValue = {
  isStreaming: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  duration: number | undefined;
};

const ReasoningContext = createContext<ReasoningContextValue | null>(null);

export const useReasoning = () => {
  const context = useContext(ReasoningContext);
  if (!context) {
    throw new Error("Reasoning components must be used within Reasoning");
  }
  return context;
};

export type ReasoningProps = ComponentProps<typeof Collapsible> & {
  isStreaming?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  duration?: number;
};

const AUTO_CLOSE_DELAY = 1000;
const MS_IN_S = 1000;

export const Reasoning = memo(
  ({
    className,
    isStreaming = false,
    open,
    defaultOpen = true,
    onOpenChange,
    duration: durationProp,
    children,
    ...props
  }: ReasoningProps) => {
    const [isOpen, setIsOpen] = useControllableState({
      prop: open,
      defaultProp: defaultOpen,
      onChange: onOpenChange,
    });
    const [duration, setDuration] = useControllableState<number | undefined>({
      prop: durationProp,
      defaultProp: undefined,
    });

    const [hasAutoClosed, setHasAutoClosed] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);

    // Track duration when streaming starts and ends
    useEffect(() => {
      if (isStreaming) {
        if (startTime === null) {
          setStartTime(Date.now());
        }
      } else if (startTime !== null) {
        setDuration(Math.ceil((Date.now() - startTime) / MS_IN_S));
        setStartTime(null);
      }
    }, [isStreaming, startTime, setDuration]);

    // Auto-open when streaming starts, auto-close when streaming ends (once only)
    useEffect(() => {
      if (defaultOpen && !isStreaming && isOpen && !hasAutoClosed) {
        // Add a small delay before closing to allow user to see the content
        const timer = setTimeout(() => {
          setIsOpen(false);
          setHasAutoClosed(true);
        }, AUTO_CLOSE_DELAY);

        return () => clearTimeout(timer);
      }
    }, [isStreaming, isOpen, defaultOpen, setIsOpen, hasAutoClosed]);

    const handleOpenChange = (newOpen: boolean) => {
      setIsOpen(newOpen);
    };

    return (
      <ReasoningContext.Provider
        value={{
          isStreaming,
          isOpen: Boolean(isOpen),
          setIsOpen,
          duration,
        }}
      >
        <Collapsible
          data-slot="reasoning"
          className={cn("not-prose mb-4", className)}
          onOpenChange={handleOpenChange}
          open={isOpen}
          {...props}
        >
          {children}
        </Collapsible>
      </ReasoningContext.Provider>
    );
  }
);

const reasoningTriggerVariants = cva(
  "group flex w-full items-center gap-2 text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
  {
    variants: {
      size: {
        sm: "text-xs",
        default: "text-sm",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export type ReasoningTriggerProps = ComponentProps<typeof CollapsibleTrigger> &
  VariantProps<typeof reasoningTriggerVariants> & {
    getThinkingMessage?: (isStreaming: boolean, duration?: number) => ReactNode;
  };

const defaultGetThinkingMessage = (isStreaming: boolean, duration?: number) => {
  if (isStreaming || duration === 0) {
    return (
      <Shimmer duration={1}>Thinking...</Shimmer>
    );
  }
  if (duration === undefined) {
    return <p data-slot="reasoning-message">Thought for a few seconds</p>;
  }
  return (
    <p data-slot="reasoning-message">
      Thought for <span className="font-mono">{duration}</span> seconds
    </p>
  );
};

export const ReasoningTrigger = memo(
  ({
    className,
    children,
    size,
    getThinkingMessage = defaultGetThinkingMessage,
    ...props
  }: ReasoningTriggerProps) => {
    const { isStreaming, duration } = useReasoning();

    return (
      <CollapsibleTrigger
        data-slot="reasoning-trigger"
        className={cn(reasoningTriggerVariants({ size }), className)}
        {...props}
      >
        {children ?? (
          <>
            <BrainIcon className="size-4" data-slot="reasoning-trigger-icon" />
            {getThinkingMessage(isStreaming, duration)}
            <ChevronDownIcon
              className="size-4 transition-transform group-data-[panel-open]:rotate-180"
              data-slot="reasoning-trigger-chevron"
            />
          </>
        )}
      </CollapsibleTrigger>
    );
  }
);

export type ReasoningContentProps = Omit<
  ComponentProps<typeof CollapsibleContent>,
  "children"
> & {
  children: string;
};

export const ReasoningContent = memo(
  ({ className, children, ...props }: ReasoningContentProps) => (
    <CollapsibleContent
      data-slot="reasoning-content"
      className={cn(
        "mt-4 text-sm text-muted-foreground outline-none data-closed:animate-accordion-up data-open:animate-accordion-down",
        className
      )}
      {...props}
    >
      <Streamdown>{children}</Streamdown>
    </CollapsibleContent>
  )
);

Reasoning.displayName = "Reasoning";
ReasoningTrigger.displayName = "ReasoningTrigger";
ReasoningContent.displayName = "ReasoningContent";
