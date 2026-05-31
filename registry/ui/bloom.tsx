"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
  type Transition,
} from "motion/react";

import { cn } from "@/lib/utils";
import {
  flipIfNeeded,
  resolvePlacement,
  type BloomAlign,
  type BloomPlacement,
  type BloomSide,
  type GrowAxis,
  type ResolvedPlacement,
} from "@/lib/bloom/placement";

// Re-export placement types for consumers.
export type {
  BloomPlacement,
  BloomSide,
  BloomAlign,
  GrowAxis,
  ResolvedPlacement,
};

export interface BloomProps {
  /** Collapsed pill content; persists as footer/header when open. */
  bar: React.ReactNode;
  /** The bloomed body. */
  children: React.ReactNode;
  /** Controlled open state. */
  open?: boolean;
  /** Uncontrolled initial open state. */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Default "bottom". */
  placement?: BloomPlacement;
  /** Viewport-fixed (default) or element-anchored. */
  anchor?: "viewport" | React.RefObject<HTMLElement>;
  /** Panel cross-size in px the bloom snaps to. Default 430. */
  size?: number;
  /** Default "surface". */
  tone?: "dock" | "surface";
  /** px from viewport edge that triggers auto-flip. Default 12. */
  collisionPadding?: number;
  /** px; below → full-width bottom sheet. Default 640. */
  mobileBreakpoint?: number;
  /** Dialog semantics. Default true. */
  modal?: boolean;
  /** Bar becomes footer (edge, default) or header (leading) when open. */
  barPosition?: "edge" | "leading";
  className?: string;
  "aria-label"?: string;
}

// useLayoutEffect warns on the server even inside a "use client" component.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/** Deterministic-on-server media query hook. Initial state is always `false`
 * (desktop) so SSR and the first client render agree; flips inside an effect. */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

const FOCUSABLE =
  'a[href],button:not([disabled]),textarea:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])';

function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  );
}

function toneClasses(tone: "dock" | "surface"): string {
  return tone === "dock"
    ? "bg-dock text-dock-foreground shadow-float"
    : "bg-card text-foreground border border-border shadow-card";
}

const SHEET_CLOSE_OFFSET = 120;
const SHEET_CLOSE_VELOCITY = 500;

export function Bloom({
  bar,
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = "bottom",
  anchor = "viewport",
  size = 430,
  tone = "surface",
  collisionPadding = 12,
  mobileBreakpoint = 640,
  modal = true,
  barPosition = "edge",
  className,
  "aria-label": ariaLabel,
}: BloomProps) {
  const reduce = useReducedMotion() ?? false;
  const isMobile = useMediaQuery(`(max-width:${mobileBreakpoint - 1}px)`);

  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (!isControlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlled, onOpenChange],
  );

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // Resolve effective placement (with auto-flip) when open on desktop.
  const [resolved, setResolved] = React.useState<ResolvedPlacement>(() =>
    resolvePlacement(placement),
  );

  useIsoLayoutEffect(() => {
    if (!open || isMobile) {
      setResolved(resolvePlacement(placement));
      return;
    }
    if (typeof window === "undefined") return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Anchor rect: the bar/element we grow from.
    let rect: DOMRect | null = null;
    if (anchor !== "viewport" && anchor.current) {
      rect = anchor.current.getBoundingClientRect();
    } else if (triggerRef.current) {
      rect = triggerRef.current.getBoundingClientRect();
    }

    const space = rect
      ? {
          top: rect.top,
          bottom: vh - rect.bottom,
          left: rect.left,
          right: vw - rect.right,
        }
      : { top: vh, bottom: vh, left: vw, right: vw };

    const flipped = flipIfNeeded(placement, space, size, collisionPadding);
    setResolved(resolvePlacement(flipped));
  }, [open, isMobile, placement, anchor, size, collisionPadding]);

  // Dialog: focus management + scroll lock.
  const prevFocusRef = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!open || !modal || isMobile === undefined) return;
    if (typeof document === "undefined") return;

    prevFocusRef.current = document.activeElement as HTMLElement | null;

    // Focus first focusable in the panel on open.
    const focusFirst = () => {
      const focusables = getFocusable(panelRef.current);
      (focusables[0] ?? panelRef.current)?.focus();
    };
    const raf = requestAnimationFrame(focusFirst);

    return () => {
      cancelAnimationFrame(raf);
      // Restore focus to the trigger on close.
      const target = triggerRef.current ?? prevFocusRef.current;
      target?.focus?.();
    };
  }, [open, modal, isMobile]);

  // Esc to close + Tab trap (modal only).
  const onPanelKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        setOpen(false);
        return;
      }
      if (!modal || e.key !== "Tab") return;
      const focusables = getFocusable(panelRef.current);
      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [modal, setOpen],
  );

  const instant: Transition = { duration: 0 };
  const ease: Transition = reduce
    ? instant
    : { type: "spring", stiffness: 420, damping: 36, mass: 0.9 };
  const fade: Transition = reduce ? instant : { duration: 0.18 };

  // ─── Collapsed: render only the bar as a pill trigger ───
  const collapsedTrigger = (
    <motion.button
      ref={triggerRef}
      type="button"
      layout={!reduce}
      onClick={() => setOpen(true)}
      aria-expanded={open}
      aria-haspopup={modal ? "dialog" : undefined}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
        toneClasses(tone),
        className,
      )}
    >
      {bar}
    </motion.button>
  );

  // The bar as it appears docked inside the open panel (footer/header).
  const dockedBar = (
    <motion.div
      layout={!reduce}
      className={cn(
        "flex shrink-0 items-center gap-2 px-4 py-3",
        resolved.barOrder === "after" ? "border-t border-border/60" : "border-b border-border/60",
      )}
    >
      {bar}
    </motion.div>
  );

  // Whether the bar docks as header or footer.
  // barPosition "leading" forces header; "edge" follows placement (barOrder).
  const barAsHeader =
    barPosition === "leading" ? true : resolved.barOrder === "before";

  const bodyContent = (
    <motion.div
      className="min-h-0 overflow-auto px-4 py-3"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={fade}
    >
      {children}
    </motion.div>
  );

  // ─── Mobile bottom sheet ───
  const onSheetDragEnd = (_e: unknown, info: PanInfo) => {
    if (info.offset.y > SHEET_CLOSE_OFFSET || info.velocity.y > SHEET_CLOSE_VELOCITY) {
      setOpen(false);
    }
  };

  const mobileSheet =
    isMobile && open ? (
      <motion.div
        ref={panelRef}
        role={modal ? "dialog" : undefined}
        aria-modal={modal ? true : undefined}
        aria-label={ariaLabel}
        onKeyDown={onPanelKeyDown}
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 flex max-h-[85vh] flex-col rounded-t-2xl",
          toneClasses(tone),
        )}
        initial={reduce ? false : { y: "100%" }}
        animate={{ y: 0 }}
        exit={reduce ? { opacity: 0 } : { y: "100%" }}
        transition={reduce ? instant : { type: "spring", stiffness: 320, damping: 34 }}
        drag={reduce ? false : "y"}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={reduce ? undefined : onSheetDragEnd}
      >
        <div className="flex justify-center pt-2">
          <div className="h-1.5 w-10 rounded-full bg-border" aria-hidden />
        </div>
        {barAsHeader ? dockedBar : null}
        <div className="min-h-0 flex-1 overflow-auto">{children}</div>
        {barAsHeader ? null : dockedBar}
      </motion.div>
    ) : null;

  // ─── Desktop panel ───
  // Cross-axis is fixed to `size`; growth axis animates 0 → auto.
  const growStyle: React.CSSProperties =
    resolved.axis === "y" ? { width: size } : { height: size };

  const desktopPanel =
    !isMobile && open ? (
      <motion.div
        ref={panelRef}
        role={modal ? "dialog" : undefined}
        aria-modal={modal ? true : undefined}
        aria-label={ariaLabel}
        onKeyDown={onPanelKeyDown}
        layout={!reduce}
        className={cn(
          "z-50 flex flex-col overflow-hidden",
          resolved.axis === "x" ? "flex-row" : "flex-col",
          toneClasses(tone),
        )}
        style={{ ...growStyle, transformOrigin: resolved.transformOrigin }}
        initial={reduce ? false : { borderRadius: 9999, opacity: 0 }}
        animate={{ borderRadius: "var(--radius-2xl)", opacity: 1 }}
        exit={reduce ? { opacity: 0 } : { borderRadius: 9999, opacity: 0 }}
        transition={ease}
      >
        {resolved.barOrder === "before" ? dockedBar : null}
        <motion.div
          className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
          initial={reduce ? false : resolved.axis === "y" ? { height: 0 } : { width: 0 }}
          animate={resolved.axis === "y" ? { height: "auto" } : { width: "auto" }}
          exit={reduce ? undefined : resolved.axis === "y" ? { height: 0 } : { width: 0 }}
          transition={ease}
        >
          {bodyContent}
        </motion.div>
        {resolved.barOrder === "after" ? dockedBar : null}
      </motion.div>
    ) : null;

  return (
    <div
      className={cn(
        "relative inline-flex",
        // Anchor the absolute panel relative to the bar for viewport/element flows.
        resolved.axis === "y" ? "flex-col" : "flex-row",
      )}
    >
      {/* Collapsed trigger stays mounted (and visually present) when closed. */}
      {!open ? collapsedTrigger : <span aria-hidden className="opacity-0">{collapsedTrigger}</span>}

      <AnimatePresence>
        {open && modal ? (
          <motion.div
            key="bloom-scrim"
            className="fixed inset-0 z-40 bg-foreground/20"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fade}
            onClick={() => setOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>{isMobile ? mobileSheet : desktopPanel}</AnimatePresence>
    </div>
  );
}

export default Bloom;
