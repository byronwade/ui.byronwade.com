"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, X } from "lucide-react";

import { cn } from "@/lib/utils";

/** A single step in a flow. For a 1-step flow this is just a form. */
export interface BloomStep<S> {
  title: string;
  caption?: string;
  /** Renders the step body; `set` shallow-merges a patch into flow state. */
  body: (state: S, set: (patch: Partial<S>) => void) => React.ReactNode;
  /** Label for the Primary button on this step. */
  primaryLabel: string;
  /** Gate: Primary is disabled until this returns true. */
  canAdvance: (state: S) => boolean;
}

/** Declarative form/wizard definition rendered by `BloomFlow`. */
export interface BloomFlowDef<S, R> {
  id: string;
  initial: S;
  steps: BloomStep<S>[];
  /** Fired when the last step's Primary is pressed. */
  onComplete: (state: S) => Promise<R>;
  /** Success surface derived from the completion result. */
  success: (result: R) => { title: string; actions?: React.ReactNode };
}

type Phase = "steps" | "submitting" | "success";

export interface BloomFlowProps<S, R> {
  flow: BloomFlowDef<S, R>;
  onClose: () => void;
  className?: string;
}

export function BloomFlow<S, R>({
  flow,
  onClose,
  className,
}: BloomFlowProps<S, R>) {
  const reduce = useReducedMotion() ?? false;

  const [state, setState] = React.useState<S>(flow.initial);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [phase, setPhase] = React.useState<Phase>("steps");
  const [result, setResult] = React.useState<{ value: R } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const set = React.useCallback((patch: Partial<S>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const steps = flow.steps;
  const stepCount = steps.length;
  const step = steps[stepIndex];
  const isLast = stepIndex === stepCount - 1;
  const submitting = phase === "submitting";

  const canAdvance = step ? step.canAdvance(state) : false;

  const back = React.useCallback(() => {
    if (submitting) return;
    setError(null);
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
    } else {
      onClose();
    }
  }, [submitting, stepIndex, onClose]);

  const advance = React.useCallback(async () => {
    if (submitting || !step || !step.canAdvance(state)) return;
    setError(null);
    if (!isLast) {
      setStepIndex((i) => i + 1);
      return;
    }
    setPhase("submitting");
    try {
      const r = await flow.onComplete(state);
      setResult({ value: r });
      setPhase("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setPhase("steps");
    }
  }, [submitting, step, state, isLast, flow]);

  // Motion presets, mirroring the Bloom primitive's feel.
  const stepTransition = reduce ? { duration: 0 } : { duration: 0.2 };
  const layoutTransition = reduce
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 420, damping: 36, mass: 0.9 };

  const successView =
    phase === "success" && result ? flow.success(result.value) : null;

  return (
    <motion.div
      layout={!reduce}
      transition={layoutTransition}
      className={cn("flex w-full flex-col", className)}
    >
      {/* ── Body region (scrollable) ── */}
      <div className="min-h-0 flex-1 overflow-auto px-5 py-4">
        <AnimatePresence mode="wait" initial={false}>
          {phase === "success" && successView ? (
            <motion.div
              key="__success"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={stepTransition}
              className="flex flex-col items-center gap-4 py-6 text-center"
            >
              <SuccessRing reduce={reduce} />
              <h3 className="text-base font-semibold text-foreground">
                {successView.title}
              </h3>
              {successView.actions ? (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {successView.actions}
                </div>
              ) : null}
            </motion.div>
          ) : step ? (
            <motion.div
              key={stepIndex}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -10 }}
              transition={stepTransition}
            >
              <div className="mb-3">
                <h3 className="text-base font-semibold text-foreground">
                  {step.title}
                </h3>
                {step.caption ? (
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {step.caption}
                  </p>
                ) : null}
              </div>
              <div>{step.body(state, set)}</div>
              {error ? (
                <p
                  role="alert"
                  className="mt-3 text-sm text-destructive"
                >
                  {error}
                </p>
              ) : null}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ── Persistent footer (built once) ── */}
      <div className="flex shrink-0 items-center gap-3 border-t border-border/60 px-5 py-3">
        {phase === "success" ? (
          // Footer collapses to a single Done.
          <button
            type="button"
            onClick={onClose}
            className="ml-auto inline-flex items-center justify-center rounded-full bg-brand px-4 py-2 text-sm font-medium text-white outline-none transition-colors hover:bg-brand/90 focus-visible:ring-2 focus-visible:ring-ring"
          >
            Done
          </button>
        ) : (
          <>
            {/* Back / Close — same slot, label swaps with stepIndex. */}
            <button
              type="button"
              onClick={back}
              disabled={submitting}
              className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            >
              {stepIndex > 0 ? (
                <>
                  <ArrowLeft className="size-4" aria-hidden />
                  Back
                </>
              ) : (
                <>
                  <X className="size-4" aria-hidden />
                  Close
                </>
              )}
            </button>

            {/* Centered step-dots — one per step, position fixed. */}
            <div
              className="mx-auto flex items-center gap-1.5"
              role="presentation"
              aria-hidden
            >
              {steps.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "size-1.5 rounded-full transition-colors",
                    i === stepIndex
                      ? "bg-brand"
                      : i < stepIndex
                        ? "bg-brand/40"
                        : "bg-border",
                  )}
                />
              ))}
            </div>

            {/* Primary — label/disabled swap, slot fixed. */}
            <button
              type="button"
              onClick={advance}
              disabled={!canAdvance || submitting}
              aria-busy={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-medium text-white outline-none transition-colors hover:bg-brand/90 focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <span
                  className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                  aria-hidden
                />
              ) : null}
              {step ? step.primaryLabel : ""}
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}

/** Animated `--brand` check-ring shown on the success phase. */
function SuccessRing({ reduce }: { reduce: boolean }) {
  const draw = reduce
    ? { duration: 0 }
    : { duration: 0.5, ease: "easeInOut" as const };
  return (
    <motion.svg
      width="56"
      height="56"
      viewBox="0 0 56 56"
      fill="none"
      aria-hidden
    >
      <motion.circle
        cx="28"
        cy="28"
        r="25"
        stroke="var(--brand)"
        strokeWidth="3"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={draw}
      />
      <motion.path
        d="M18 28.5L25 35.5L39 21"
        stroke="var(--brand)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={
          reduce ? draw : { ...draw, delay: 0.35 }
        }
      />
    </motion.svg>
  );
}

export default BloomFlow;
