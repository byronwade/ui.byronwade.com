"use client";

import * as React from "react";
import { ChevronsLeftRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { useChromeMorph } from "@/lib/use-chrome-morph";

/**
 * A single navigable item in the dock. Mirrors a route/tab but stays generic —
 * the dock never knows about routing, products, or cookies; the consumer wires
 * `onSelect`/`href` and the active/badge state.
 */
export interface MorphDockItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onSelect?: () => void;
  href?: string;
  /** Current page → `aria-current="page"` + active fill. */
  active?: boolean;
  /** Always visible, even compact (the few primary destinations). */
  core?: boolean;
  /** Always visible AND pinned to the trailing end (e.g. Settings). */
  pinned?: boolean;
  /** Unread/count → a small brand dot (>0) when set. */
  badge?: number;
}

export interface MorphDockProps {
  items: MorphDockItem[];
  /** Allow compact ↔ full toggling. Default true. */
  expandable?: boolean;
  /** Custom trailing slot (count + badge, env tag, search button…). */
  cluster?: React.ReactNode;
  /**
   * A contextual action pill at the trailing end. With `children` present it
   * blooms the dock open; otherwise it just runs `onSelect`.
   */
  action?: {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    onSelect?: () => void;
  };
  /** Dark dock pill (default) or light surface. */
  tone?: "dock" | "surface";
  /** Accessible name for the nav landmark. Default "Primary". */
  navLabel?: string;
  className?: string;

  /** Controlled morph — when open, the dock blooms into `children`. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** The panel the dock morphs into (a search, a form, a flow…). */
  children?: React.ReactNode;
  /** Open-panel width in px. Default 360. */
  panelWidth?: number;
  /** Bloom width + height (default) or width-only. */
  growHeight?: boolean;
}

/** Visible in compact mode? Expanded shows all; otherwise only core/pinned/active. */
function isVisible(item: MorphDockItem, expanded: boolean): boolean {
  return expanded || !!item.core || !!item.pinned || !!item.active;
}

const PILL =
  "relative flex size-8 shrink-0 items-center justify-center rounded-full outline-none transition-colors focus-visible:ring-2 focus-visible:ring-white/30";
const PILL_IDLE = "text-dock-foreground hover:bg-dock-active hover:text-dock-active-foreground";
const PILL_ACTIVE = "bg-dock-active text-dock-active-foreground";

/**
 * One nav item — `<a>` when `href`, else a `<button>`. Compact-hidden items
 * morph to zero width via CSS (`w-0 scale-50 opacity-0`, 300ms cubic-bezier),
 * so the pill's auto width reflows smoothly without any animation library.
 */
function DockItem({ item, collapsed }: { item: MorphDockItem; collapsed: boolean }) {
  const Icon = item.icon;
  const hasBadge = typeof item.badge === "number" && item.badge > 0;

  const inner = (
    <>
      <Icon className="size-4 shrink-0" />
      <span className="sr-only">{item.label}</span>
      {hasBadge ? (
        <span
          aria-hidden
          className="absolute right-1 top-1 size-2 rounded-full bg-brand ring-2 ring-dock"
        />
      ) : null}
    </>
  );

  const className = cn(PILL, item.active ? PILL_ACTIVE : PILL_IDLE);
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    item.onSelect?.();
  };

  const content =
    item.href !== undefined ? (
      <a
        href={item.href}
        title={item.label}
        aria-label={item.label}
        aria-current={item.active ? "page" : undefined}
        onClick={onClick}
        className={className}
      >
        {inner}
      </a>
    ) : (
      <button
        type="button"
        title={item.label}
        aria-label={item.label}
        aria-current={item.active ? "page" : undefined}
        onClick={onClick}
        className={className}
      >
        {inner}
      </button>
    );

  return (
    <div
      className={cn(
        "flex shrink-0 items-center overflow-hidden",
        "transition-[width,opacity,transform] duration-300 ease-[cubic-bezier(.22,1,.36,1)] motion-reduce:transition-none",
        collapsed ? "w-0 scale-50 opacity-0" : "w-8 scale-100 opacity-100",
      )}
      aria-hidden={collapsed}
    >
      {content}
    </div>
  );
}

/**
 * Config-driven morphing navigation dock. The item row morphs compact ↔ full
 * (each item animates its own width/opacity via CSS), and the whole pill blooms
 * — in place, on a single tuned cubic-bezier — into a consumer-provided `children`
 * panel via the shared `useChromeMorph` hook, then shrinks cleanly back. Pure
 * tokens (`--dock-*`), so it stays dark in light + dark themes; reduced-motion,
 * Esc, and click-away handled.
 */
export function MorphDock({
  items,
  expandable = true,
  cluster,
  action,
  tone = "dock",
  navLabel = "Primary",
  className,
  open: openProp,
  onOpenChange,
  children,
  panelWidth = 360,
  growHeight = true,
}: MorphDockProps) {
  const [expanded, setExpanded] = React.useState(false);
  const [openUncontrolled, setOpenUncontrolled] = React.useState(false);
  const open = openProp ?? openUncontrolled;
  const setOpen = React.useCallback(
    (v: boolean) => {
      setOpenUncontrolled(v);
      onOpenChange?.(v);
    },
    [onOpenChange],
  );

  const rootRef = React.useRef<HTMLDivElement>(null);
  const morphRef = React.useRef<HTMLDivElement>(null);
  const barRef = React.useRef<HTMLDivElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  const hasPanel = children != null;

  useChromeMorph({
    morphRef,
    restRef: barRef,
    panelRef,
    open: open && hasPanel,
    growHeight,
    width: () => panelWidth,
    deps: [open, hasPanel],
  });

  // Esc + click-away close the morphed panel.
  React.useEffect(() => {
    if (!open || !hasPanel) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open, hasPanel, setOpen]);

  const mainItems = items.filter((i) => !i.pinned);
  const pinnedItems = items.filter((i) => i.pinned);
  const hasCollapsible = items.some((i) => !i.core && !i.pinned);
  const showToggle = expandable && hasCollapsible;
  const ActionIcon = action?.icon;

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <div
        ref={morphRef}
        className={cn(
          "transform-gpu overflow-hidden p-[3px] [will-change:width,height]",
          open ? "rounded-2xl" : "rounded-full",
          tone === "dock"
            ? "bg-dock text-dock-foreground shadow-float"
            : "border border-border bg-card text-foreground shadow-card",
        )}
      >
        {/* BAR — the resting item row (fades out as the panel blooms in). */}
        <div
          ref={barRef}
          className={cn(
            "flex items-center gap-1 transition-opacity duration-150",
            open && hasPanel && "pointer-events-none",
          )}
        >
          <nav aria-label={navLabel} className="flex items-center gap-1">
            {mainItems.map((item) => (
              <DockItem key={item.id} item={item} collapsed={!isVisible(item, expanded)} />
            ))}

            {showToggle ? (
              <button
                type="button"
                aria-expanded={expanded}
                aria-label={expanded ? "Show fewer" : "Show all"}
                title={expanded ? "Show fewer" : "Show all"}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded((v) => !v);
                }}
                className={cn(PILL, expanded ? PILL_ACTIVE : PILL_IDLE)}
              >
                <ChevronsLeftRight className="size-4 shrink-0" />
                <span className="sr-only">{expanded ? "Show fewer" : "Show all"}</span>
              </button>
            ) : null}

            {pinnedItems.map((item) => (
              <DockItem key={item.id} item={item} collapsed={!isVisible(item, expanded)} />
            ))}
          </nav>

          {cluster ? <div className="flex shrink-0 items-center">{cluster}</div> : null}

          {action && ActionIcon ? (
            <button
              type="button"
              aria-haspopup={hasPanel ? "dialog" : undefined}
              aria-expanded={hasPanel ? open : undefined}
              onClick={(e) => {
                e.stopPropagation();
                if (hasPanel) setOpen(true);
                action.onSelect?.();
              }}
              className={cn(
                "ml-1 flex h-8 shrink-0 items-center gap-2 rounded-full px-3 text-[13px] font-semibold",
                "bg-dock-active text-dock-active-foreground outline-none transition-colors",
                "focus-visible:ring-2 focus-visible:ring-white/30",
              )}
            >
              <ActionIcon className="size-4 shrink-0" />
              {action.label}
            </button>
          ) : null}
        </div>

        {/* PANEL — the morph target (consumer content). */}
        {hasPanel ? (
          <div
            ref={panelRef}
            role="dialog"
            aria-label={action?.label ?? "Panel"}
            aria-hidden={!open}
            style={{ width: panelWidth }}
            className={cn(
              "absolute left-0 top-0 opacity-0 transition-opacity duration-150 outline-none",
              open ? "pointer-events-auto" : "pointer-events-none",
            )}
          >
            {children}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default MorphDock;
