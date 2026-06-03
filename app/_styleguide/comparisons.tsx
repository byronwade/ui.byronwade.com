"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Check, CheckCircle2, ChevronDown, Info, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GradientAvatar } from "@/components/ui/gradient-avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { StatusPill } from "@/components/status-pill";

/* ──────────────────────────────────────────────────────────────────────────
 * Quarantined recreations of six design systems for side-by-side contrast.
 *
 * Shared layout lives under `.cmp-scope` and is themed purely through CSS
 * variables; each system sets those variables (plus a few tone rules) on its
 * own theme class (`.vercel-scope`, `.linear-scope`, `.zero-scope`,
 * `.shopify-scope`, `.stripe-scope`, `.github-scope`). No `:root` writes, no
 * Tailwind-layer edits — nothing leaks into our global theme. The
 * right column wears exactly one theme; the left column is always our real
 * components, unchanged.
 * ─────────────────────────────────────────────────────────────────────────── */

type SystemId =
  | "vercel"
  | "linear"
  | "zero"
  | "shopify"
  | "stripe"
  | "github"
  | "atlassian"
  | "radix"
  | "mailchimp"
  | "apple";

const SYSTEMS: Record<
  SystemId,
  {
    label: string;
    scope: string;
    typeface: string;
    accent: string;
    well: string;
    border: string;
    dark: boolean;
    tagline: string;
  }
> = {
  vercel: {
    label: "Vercel",
    scope: "vercel-scope",
    typeface: "Geist",
    accent: "#0070f3",
    well: "#fafafa",
    border: "#eaeaea",
    dark: false,
    tagline: "Monochrome and sharp — a flat black primary, hairline borders, one blue. 6px radius, no chrome.",
  },
  linear: {
    label: "Linear",
    scope: "linear-scope",
    typeface: "Inter",
    accent: "#5e6ad2",
    well: "#0f1011",
    border: "#23242a",
    dark: true,
    tagline: "Dark-first and refined — an indigo accent spent on the primary, soft depth, 8px radius.",
  },
  zero: {
    label: "0.email",
    scope: "zero-scope",
    typeface: "Geist",
    accent: "#006ffe",
    well: "#0a0a0a",
    border: "rgba(255,255,255,0.1)",
    dark: true,
    tagline: "A dark, dense inbox — blue accent, tight rows, built for keyboard speed over calm.",
  },
  shopify: {
    label: "Shopify",
    scope: "shopify-scope",
    typeface: "Polaris",
    accent: "#008060",
    well: "#f1f1f1",
    border: "#e3e3e3",
    dark: false,
    tagline: "Tonal role colors, layered button shadows, a denser 8/12px grid — more structure, more chrome.",
  },
  stripe: {
    label: "Stripe",
    scope: "stripe-scope",
    typeface: "system",
    accent: "#635bff",
    well: "#f6f9fc",
    border: "#e3e8ee",
    dark: false,
    tagline: "Refined and trustworthy — an indigo accent, soft layered shadows, a light blue canvas, gentle radii.",
  },
  github: {
    label: "GitHub",
    scope: "github-scope",
    typeface: "system",
    accent: "#1f883d",
    well: "#f6f8fa",
    border: "#d0d7de",
    dark: false,
    tagline: "Utilitarian Primer — green buttons, a blue interactive accent, an orange tab underline, flat bordered surfaces.",
  },
  atlassian: {
    label: "Atlassian",
    scope: "atlassian-scope",
    typeface: "system",
    accent: "#0c66e4",
    well: "#f7f8f9",
    border: "#dfe1e6",
    dark: false,
    tagline: "Enterprise-plain ADS — a blue primary, tiny uppercase Lozenges, hard 3px corners, flat elevation.",
  },
  radix: {
    label: "Radix",
    scope: "radix-scope",
    typeface: "system",
    accent: "#18181b",
    well: "#ffffff",
    border: "#e4e4e7",
    dark: false,
    tagline: "The shadcn baseline — a neutral near-black primary at 6px, variant-based badges, no accent hue. The closest to ours.",
  },
  mailchimp: {
    label: "Mailchimp",
    scope: "mailchimp-scope",
    typeface: "system",
    accent: "#ffe01b",
    well: "#f6f4ef",
    border: "#e0ddd5",
    dark: false,
    tagline: "Bold and warm — the signature yellow button with black text, a teal interactive accent, rounded tonal tags.",
  },
  apple: {
    label: "Apple",
    scope: "apple-scope",
    typeface: "SF",
    accent: "#007aff",
    well: "#f5f5f7",
    border: "#d2d2d7",
    dark: false,
    tagline: "Apple HIG — the iOS system blue, soft 10–14px radii, vibrant tonal pills, a green toggle, SF-set.",
  },
};

const SYSTEM_ORDER: SystemId[] = [
  "vercel",
  "linear",
  "zero",
  "shopify",
  "stripe",
  "github",
  "atlassian",
  "radix",
  "mailchimp",
  "apple",
];

const CSS = `
.cmp-scope * { box-sizing: border-box; }
.cmp-scope { line-height: 1.4; -webkit-font-smoothing: antialiased; }

/* Shared layout — themed only through CSS variables set per scope. */
.cmp-scope .c-btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 6px;
  min-height: 32px; padding: 6px 12px; font-size: 13px; font-weight: 500;
  line-height: 1; border: 1px solid transparent; cursor: default; white-space: nowrap;
  border-radius: var(--c-radius);
}
.cmp-scope .c-btn--primary { background: var(--c-primary); color: var(--c-primary-fg); box-shadow: var(--c-btn-shadow); }
.cmp-scope .c-btn--secondary { background: var(--c-secondary-bg); color: inherit; border-color: var(--c-border-strong); }
.cmp-scope .c-btn--critical { background: var(--c-critical); color: #fff; box-shadow: var(--c-btn-shadow); }

.cmp-scope .c-badge {
  display: inline-flex; align-items: center; gap: 6px; min-height: 20px;
  padding: 2px 8px; font-size: 12px; line-height: 1.2; border-radius: var(--c-badge-radius);
}
.cmp-scope .c-badge__dot { width: 8px; height: 8px; border-radius: 9999px; background: currentColor; }

.cmp-scope .c-card {
  padding: 16px; background: var(--c-surface); border: 1px solid var(--c-border);
  border-radius: var(--c-radius-lg); box-shadow: var(--c-card-shadow);
}
.cmp-scope .c-card__title { font-weight: 600; font-size: 14px; }
.cmp-scope .c-card__sub { margin-top: 2px; color: var(--c-sub); }
.cmp-scope .c-card__value { font-size: 24px; font-weight: 650; margin: 12px 0; font-variant-numeric: tabular-nums; }

.cmp-scope .c-label { display: block; font-size: 13px; margin-bottom: 4px; }
.cmp-scope .c-input {
  width: 100%; min-height: 32px; padding: 6px 12px; font: inherit; color: inherit;
  background: var(--c-input-bg); border: 1px solid var(--c-input-border); border-radius: var(--c-radius);
}
.cmp-scope .c-input::placeholder { color: var(--c-sub); opacity: 0.8; }
.cmp-scope .c-input:focus-visible { outline: 2px solid var(--c-focus); outline-offset: 1px; border-color: var(--c-focus); }
.cmp-scope .c-help { font-size: 12px; margin-top: 4px; color: var(--c-sub); }

.cmp-scope .c-select {
  display: inline-flex; align-items: center; justify-content: space-between; gap: 8px; width: 100%;
  min-height: 32px; padding: 6px 12px; font: inherit; color: inherit;
  background: var(--c-input-bg); border: 1px solid var(--c-input-border); border-radius: var(--c-radius);
}
.cmp-scope .c-select__chev { flex: none; opacity: 0.6; }

.cmp-scope .c-check-row, .cmp-scope .c-switch-row { display: inline-flex; align-items: center; gap: 8px; font-size: 13px; }
.cmp-scope .c-check {
  width: 16px; height: 16px; flex: none; display: inline-flex; align-items: center; justify-content: center;
  border: 1px solid var(--c-border-strong); border-radius: var(--c-check-radius); background: var(--c-input-bg);
}
.cmp-scope .c-check--on { background: var(--c-accent); border-color: var(--c-accent); color: #fff; }

.cmp-scope .c-switch {
  position: relative; flex: none; display: inline-block; width: 30px; height: 18px;
  border-radius: 9999px; background: var(--c-border-strong);
}
.cmp-scope .c-switch--on { background: var(--c-accent); }
.cmp-scope .c-switch__thumb {
  position: absolute; top: 2px; left: 2px; width: 14px; height: 14px; border-radius: 9999px;
  background: #fff; box-shadow: 0 1px 2px rgba(0,0,0,0.3); transition: left 0.15s;
}
.cmp-scope .c-switch--on .c-switch__thumb { left: 14px; }

.cmp-scope .c-progress { width: 100%; height: 6px; border-radius: 9999px; background: var(--c-track); overflow: hidden; }
.cmp-scope .c-progress__bar { height: 100%; width: 64%; background: var(--c-accent); border-radius: 9999px; }

.cmp-scope .c-avatar {
  width: 36px; height: 36px; flex: none; display: inline-flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600; border-radius: var(--c-avatar-radius);
  background: var(--c-avatar-bg); color: var(--c-avatar-fg);
}

.cmp-scope .c-banner { display: flex; gap: 8px; padding: 12px 14px; border: 1px solid transparent; border-radius: var(--c-radius-lg); }
.cmp-scope .c-banner__icon { flex: none; margin-top: 1px; }
.cmp-scope .c-banner__title { font-weight: 600; font-size: 13px; }
.cmp-scope .c-banner__body { margin-top: 2px; color: var(--c-sub); }

.cmp-scope .c-table {
  width: 100%; border-collapse: collapse; font-size: 13px; overflow: hidden;
  background: var(--c-surface); border: 1px solid var(--c-border); border-radius: var(--c-radius-lg);
}
.cmp-scope .c-table th {
  text-align: left; font-weight: 600; font-size: 12px; padding: 8px 12px;
  color: var(--c-sub); background: var(--c-th-bg); border-bottom: 1px solid var(--c-border);
}
.cmp-scope .c-table td { padding: 10px 12px; border-bottom: 1px solid var(--c-border); }
.cmp-scope .c-table tr:last-child td { border-bottom: none; }
.cmp-scope .c-num { text-align: right; font-variant-numeric: tabular-nums; }
.cmp-scope .c-mono { font-family: ui-monospace, SFMono-Regular, Menlo, monospace; }

.cmp-scope .c-tabs { display: flex; gap: 4px; border-bottom: 1px solid var(--c-border); }
.cmp-scope .c-tab {
  display: inline-flex; align-items: center; min-height: 28px; padding: 4px 12px;
  font-size: 13px; font-weight: 500; color: var(--c-sub); border-radius: var(--c-tab-radius);
}
.cmp-scope .c-tabs__panel { padding-top: 12px; font-size: 13px; color: var(--c-sub); }

/* ── Vercel (Geist) — inherits the app's Geist; monochrome + blue ──────── */
.vercel-scope {
  --c-sub: #666; --c-border: #eaeaea; --c-border-strong: #eaeaea; --c-surface: #fff;
  --c-radius: 6px; --c-radius-lg: 8px; --c-badge-radius: 6px; --c-tab-radius: 0; --c-check-radius: 4px; --c-avatar-radius: 9999px;
  --c-primary: #000; --c-primary-fg: #fff; --c-secondary-bg: #fff; --c-critical: #e5484d; --c-accent: #000;
  --c-input-bg: #fff; --c-input-border: #eaeaea; --c-focus: #000; --c-th-bg: #fafafa; --c-track: #eaeaea;
  --c-avatar-bg: #f2f2f2; --c-avatar-fg: #000;
  --c-card-shadow: none; --c-btn-shadow: none;
  color: #000; font-size: 14px;
}
.vercel-scope .c-badge { text-transform: uppercase; letter-spacing: 0.03em; font-size: 11px; font-weight: 500; }
.vercel-scope .c-badge__dot { display: none; }
.vercel-scope .c-badge--success { background: #edf9f0; color: #17794d; }
.vercel-scope .c-badge--warning { background: #fdf6e3; color: #946800; }
.vercel-scope .c-badge--critical { background: #fdecec; color: #c5292a; }
.vercel-scope .c-badge--info { background: #e8f1fd; color: #0060d1; }
.vercel-scope .c-tab { background: none; }
.vercel-scope .c-tab--active { color: #000; box-shadow: inset 0 -2px 0 #000; }
.vercel-scope .c-banner--info { background: #f0f7ff; border-color: #cce3ff; }
.vercel-scope .c-banner--info .c-banner__icon { color: #0070f3; }
.vercel-scope .c-banner--critical { background: #fff5f5; border-color: #ffd1d1; }
.vercel-scope .c-banner--critical .c-banner__icon { color: #e5484d; }

/* ── Linear — dark, indigo ─────────────────────────────────────────────── */
.linear-scope {
  --c-sub: #8a8f98; --c-border: #23242a; --c-border-strong: #3a3b42; --c-surface: #191a20;
  --c-radius: 8px; --c-radius-lg: 10px; --c-badge-radius: 9999px; --c-tab-radius: 0; --c-check-radius: 4px; --c-avatar-radius: 9999px;
  --c-primary: #5e6ad2; --c-primary-fg: #fff; --c-secondary-bg: rgba(255,255,255,0.05); --c-critical: #eb5757; --c-accent: #5e6ad2;
  --c-input-bg: #16171b; --c-input-border: #2a2b32; --c-focus: #5e6ad2; --c-th-bg: transparent; --c-track: #2a2b32;
  --c-avatar-bg: #2a2b32; --c-avatar-fg: #f7f8f8;
  --c-card-shadow: 0 1px 2px rgba(0,0,0,0.4); --c-btn-shadow: none;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #f7f8f8; font-size: 13.5px;
}
.linear-scope .c-badge--success { background: rgba(76,201,160,0.16); color: #7ee2c0; }
.linear-scope .c-badge--warning { background: rgba(242,201,76,0.16); color: #f2c94c; }
.linear-scope .c-badge--critical { background: rgba(235,87,87,0.18); color: #f08c8c; }
.linear-scope .c-badge--info { background: rgba(94,106,210,0.22); color: #a5adf5; }
.linear-scope .c-tab { background: none; }
.linear-scope .c-tab--active { color: #f7f8f8; box-shadow: inset 0 -2px 0 #5e6ad2; }
.linear-scope .c-banner--info { background: rgba(94,106,210,0.12); border-color: rgba(94,106,210,0.3); }
.linear-scope .c-banner--info .c-banner__icon { color: #a5adf5; }
.linear-scope .c-banner--critical { background: rgba(235,87,87,0.12); border-color: rgba(235,87,87,0.3); }
.linear-scope .c-banner--critical .c-banner__icon { color: #f08c8c; }

/* ── Zero / 0.email — dark, blue, dense ────────────────────────────────── */
.zero-scope {
  --c-sub: #a1a1a1; --c-border: rgba(255,255,255,0.1); --c-border-strong: rgba(255,255,255,0.16); --c-surface: #141414;
  --c-radius: 8px; --c-radius-lg: 8px; --c-badge-radius: 9999px; --c-tab-radius: 6px; --c-check-radius: 4px; --c-avatar-radius: 9999px;
  --c-primary: #006ffe; --c-primary-fg: #fff; --c-secondary-bg: rgba(255,255,255,0.06); --c-critical: #f43f5e; --c-accent: #006ffe;
  --c-input-bg: #1a1a1a; --c-input-border: rgba(255,255,255,0.14); --c-focus: #006ffe; --c-th-bg: transparent; --c-track: rgba(255,255,255,0.12);
  --c-avatar-bg: rgba(255,255,255,0.1); --c-avatar-fg: #fafafa;
  --c-card-shadow: 0 1px 2px rgba(0,0,0,0.5); --c-btn-shadow: none;
  color: #fafafa; font-size: 13px;
}
.zero-scope .c-card { padding: 12px; }
.zero-scope .c-table th { padding: 6px 12px; }
.zero-scope .c-table td { padding: 7px 12px; }
.zero-scope .c-badge--success { background: rgba(34,197,94,0.16); color: #5ce08a; }
.zero-scope .c-badge--warning { background: rgba(245,158,11,0.16); color: #fbbf4d; }
.zero-scope .c-badge--critical { background: rgba(244,63,94,0.16); color: #fb7185; }
.zero-scope .c-badge--info { background: rgba(0,111,254,0.2); color: #5ea2ff; }
.zero-scope .c-tab--active { background: rgba(0,111,254,0.16); color: #fafafa; }
.zero-scope .c-banner--info { background: rgba(0,111,254,0.12); border-color: rgba(0,111,254,0.3); }
.zero-scope .c-banner--info .c-banner__icon { color: #5ea2ff; }
.zero-scope .c-banner--critical { background: rgba(244,63,94,0.12); border-color: rgba(244,63,94,0.3); }
.zero-scope .c-banner--critical .c-banner__icon { color: #fb7185; }

/* ── Shopify Polaris — tonal, layered, denser ──────────────────────────── */
.shopify-scope {
  --c-sub: #616161; --c-border: #e3e3e3; --c-border-strong: #b5b5b5; --c-surface: #fff;
  --c-radius: 8px; --c-radius-lg: 12px; --c-badge-radius: 8px; --c-tab-radius: 8px; --c-check-radius: 4px; --c-avatar-radius: 8px;
  --c-primary: #303030; --c-primary-fg: #fff; --c-secondary-bg: #fff; --c-critical: #e51c00; --c-accent: #303030;
  --c-input-bg: #fff; --c-input-border: #8a8a8a; --c-focus: #005bd3; --c-th-bg: #fafafa; --c-track: #e3e3e3;
  --c-avatar-bg: #e3e3e3; --c-avatar-fg: #303030;
  --c-card-shadow: 0 1px 0 0 rgba(26,26,26,0.07); --c-btn-shadow: 0 1px 0 rgba(0,0,0,0.08), 0 -1px 0 rgba(0,0,0,0.2) inset;
  font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #303030; font-size: 13px;
}
.shopify-scope .c-btn { font-weight: 600; }
.shopify-scope .c-tabs { padding-bottom: 6px; }
.shopify-scope .c-badge--success { background: #cdfee1; color: #0c5132; }
.shopify-scope .c-badge--warning { background: #ffe9b3; color: #5e4200; }
.shopify-scope .c-badge--critical { background: #ffeae5; color: #8e1f0b; }
.shopify-scope .c-badge--info { background: #d6e7ff; color: #00527c; }
.shopify-scope .c-tab--active { background: #f1f1f1; color: #303030; }
.shopify-scope .c-banner--info { background: #ebf3ff; border-color: #b4d4ff; }
.shopify-scope .c-banner--info .c-banner__icon { color: #0094d5; }
.shopify-scope .c-banner--critical { background: #fff0f0; border-color: #ffc2bd; }
.shopify-scope .c-banner--critical .c-banner__icon { color: #c91111; }

/* ── Stripe — refined, indigo, soft shadows ────────────────────────────── */
.stripe-scope {
  --c-sub: #697386; --c-border: #e3e8ee; --c-border-strong: #d5dbe1; --c-surface: #fff;
  --c-radius: 6px; --c-radius-lg: 8px; --c-badge-radius: 9999px; --c-tab-radius: 6px; --c-check-radius: 4px; --c-avatar-radius: 9999px;
  --c-primary: #635bff; --c-primary-fg: #fff; --c-secondary-bg: #fff; --c-critical: #df1b41; --c-accent: #635bff;
  --c-input-bg: #fff; --c-input-border: #d5dbe1; --c-focus: #635bff; --c-th-bg: #fff; --c-track: #e3e8ee;
  --c-avatar-bg: #e6e6f7; --c-avatar-fg: #635bff;
  --c-card-shadow: 0 0 0 1px rgba(60,66,87,0.04), 0 2px 5px -1px rgba(60,66,87,0.1), 0 1px 3px -1px rgba(60,66,87,0.08);
  --c-btn-shadow: 0 1px 1px rgba(0,0,0,0.06), 0 2px 5px rgba(60,66,87,0.1);
  font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; color: #1a1f36; font-size: 13.5px;
}
.stripe-scope .c-badge--success { background: #cbf4c9; color: #0e6245; }
.stripe-scope .c-badge--warning { background: #f8e6b9; color: #983705; }
.stripe-scope .c-badge--critical { background: #fde2dd; color: #b3093c; }
.stripe-scope .c-badge--info { background: #d6e0ff; color: #3f4eae; }
.stripe-scope .c-tab { background: none; }
.stripe-scope .c-tab--active { color: #1a1f36; box-shadow: inset 0 -2px 0 #635bff; border-radius: 0; }
.stripe-scope .c-banner--info { background: #f5f6ff; border-color: #c7c9f9; }
.stripe-scope .c-banner--info .c-banner__icon { color: #635bff; }
.stripe-scope .c-banner--critical { background: #fff0f3; border-color: #f7c0cf; }
.stripe-scope .c-banner--critical .c-banner__icon { color: #df1b41; }

/* ── GitHub Primer — utilitarian, green + blue, orange tab underline ────── */
.github-scope {
  --c-sub: #656d76; --c-border: #d0d7de; --c-border-strong: #d0d7de; --c-surface: #fff;
  --c-radius: 6px; --c-radius-lg: 6px; --c-badge-radius: 9999px; --c-tab-radius: 6px; --c-check-radius: 4px; --c-avatar-radius: 6px;
  --c-primary: #1f883d; --c-primary-fg: #fff; --c-secondary-bg: #f6f8fa; --c-critical: #cf222e; --c-accent: #0969da;
  --c-input-bg: #fff; --c-input-border: #d0d7de; --c-focus: #0969da; --c-th-bg: #f6f8fa; --c-track: #eaeef2;
  --c-avatar-bg: #eaeef2; --c-avatar-fg: #24292f;
  --c-card-shadow: none; --c-btn-shadow: 0 1px 0 rgba(31,35,40,0.04);
  font-family: ui-sans-serif, -apple-system, "Segoe UI", system-ui, sans-serif; color: #1f2328; font-size: 13.5px;
}
.github-scope .c-badge--success { background: #dafbe1; color: #1a7f37; }
.github-scope .c-badge--warning { background: #fff8c5; color: #9a6700; }
.github-scope .c-badge--critical { background: #ffebe9; color: #cf222e; }
.github-scope .c-badge--info { background: #ddf4ff; color: #0969da; }
.github-scope .c-tab { background: none; }
.github-scope .c-tab--active { color: #24292f; font-weight: 600; box-shadow: inset 0 -2px 0 #fd8c73; border-radius: 0; }
.github-scope .c-banner--info { background: #ddf4ff; border-color: #54aeff; }
.github-scope .c-banner--info .c-banner__icon { color: #0969da; }
.github-scope .c-banner--critical { background: #ffebe9; border-color: #ff8182; }
.github-scope .c-banner--critical .c-banner__icon { color: #cf222e; }

/* ── Atlassian — enterprise blue, hard 3px corners, uppercase lozenges ──── */
.atlassian-scope {
  --c-sub: #44546f; --c-border: #dfe1e6; --c-border-strong: #b3b9c4; --c-surface: #fff;
  --c-radius: 3px; --c-radius-lg: 3px; --c-badge-radius: 3px; --c-tab-radius: 0; --c-check-radius: 3px; --c-avatar-radius: 9999px;
  --c-primary: #0c66e4; --c-primary-fg: #fff; --c-secondary-bg: #f1f2f4; --c-critical: #ca3521; --c-accent: #0c66e4;
  --c-input-bg: #fff; --c-input-border: #b3b9c4; --c-focus: #0c66e4; --c-th-bg: #f7f8f9; --c-track: #dfe1e6;
  --c-avatar-bg: #dfe1e6; --c-avatar-fg: #172b4d;
  --c-card-shadow: 0 1px 1px rgba(9,30,66,0.25), 0 0 1px rgba(9,30,66,0.31); --c-btn-shadow: none;
  font-family: ui-sans-serif, system-ui, -apple-system, sans-serif; color: #172b4d; font-size: 13.5px;
}
.atlassian-scope .c-btn--secondary { border-color: transparent; }
.atlassian-scope .c-badge { text-transform: uppercase; letter-spacing: 0.03em; font-size: 11px; font-weight: 700; }
.atlassian-scope .c-badge__dot { display: none; }
.atlassian-scope .c-badge--success { background: #dcfff1; color: #216e4e; }
.atlassian-scope .c-badge--info { background: #deebff; color: #0055cc; }
.atlassian-scope .c-badge--warning { background: #fff7d6; color: #7f5f01; }
.atlassian-scope .c-badge--critical { background: #ffeceb; color: #ae2e24; }
.atlassian-scope .c-tab { background: none; }
.atlassian-scope .c-tab--active { color: #0c66e4; box-shadow: inset 0 -2px 0 #0c66e4; }
.atlassian-scope .c-banner--info { background: #deebff; border-color: #85b8ff; }
.atlassian-scope .c-banner--info .c-banner__icon { color: #0c66e4; }
.atlassian-scope .c-banner--critical { background: #ffeceb; border-color: #fd9891; }
.atlassian-scope .c-banner--critical .c-banner__icon { color: #ca3521; }

/* ── Radix / shadcn — the neutral baseline (closest to ours) ────────────── */
.radix-scope {
  --c-sub: #71717a; --c-border: #e4e4e7; --c-border-strong: #e4e4e7; --c-surface: #fff;
  --c-radius: 6px; --c-radius-lg: 8px; --c-badge-radius: 6px; --c-tab-radius: 6px; --c-check-radius: 4px; --c-avatar-radius: 9999px;
  --c-primary: #18181b; --c-primary-fg: #fafafa; --c-secondary-bg: #f4f4f5; --c-critical: #ef4444; --c-accent: #18181b;
  --c-input-bg: #fff; --c-input-border: #e4e4e7; --c-focus: #18181b; --c-th-bg: transparent; --c-track: #f4f4f5;
  --c-avatar-bg: #f4f4f5; --c-avatar-fg: #18181b;
  --c-card-shadow: 0 1px 2px rgba(0,0,0,0.05); --c-btn-shadow: none;
  font-family: ui-sans-serif, system-ui, sans-serif; color: #18181b; font-size: 14px;
}
.radix-scope .c-badge { font-weight: 500; }
.radix-scope .c-badge__dot { display: none; }
.radix-scope .c-badge--success { background: #18181b; color: #fafafa; }
.radix-scope .c-badge--warning { background: #f4f4f5; color: #18181b; }
.radix-scope .c-badge--critical { background: #ef4444; color: #fff; }
.radix-scope .c-badge--info { background: transparent; color: #18181b; border: 1px solid #e4e4e7; }
.radix-scope .c-tabs { border-bottom: none; background: #f4f4f5; border-radius: 8px; padding: 3px; gap: 0; }
.radix-scope .c-tab { border-radius: 6px; }
.radix-scope .c-tab--active { background: #fff; color: #18181b; box-shadow: 0 1px 2px rgba(0,0,0,0.08); }
.radix-scope .c-banner--info { background: #fff; border-color: #e4e4e7; }
.radix-scope .c-banner--info .c-banner__icon { color: #18181b; }
.radix-scope .c-banner--critical { background: #fff; border-color: #ef4444; }
.radix-scope .c-banner--critical .c-banner__icon { color: #ef4444; }

/* ── Mailchimp — bold yellow + black, warm canvas, teal accent ─────────── */
.mailchimp-scope {
  --c-sub: #6c6c6c; --c-border: #e0ddd5; --c-border-strong: #241c15; --c-surface: #fff;
  --c-radius: 4px; --c-radius-lg: 8px; --c-badge-radius: 9999px; --c-tab-radius: 0; --c-check-radius: 4px; --c-avatar-radius: 9999px;
  --c-primary: #ffe01b; --c-primary-fg: #241c15; --c-secondary-bg: #fff; --c-critical: #d3320d; --c-accent: #007c89;
  --c-input-bg: #fff; --c-input-border: #bcb5a8; --c-focus: #007c89; --c-th-bg: #f6f4ef; --c-track: #e0ddd5;
  --c-avatar-bg: #ffe9a8; --c-avatar-fg: #241c15;
  --c-card-shadow: 0 1px 3px rgba(36,28,21,0.1); --c-btn-shadow: none;
  font-family: ui-sans-serif, system-ui, sans-serif; color: #241c15; font-size: 14px;
}
.mailchimp-scope .c-btn { font-weight: 700; }
.mailchimp-scope .c-badge { font-weight: 600; }
.mailchimp-scope .c-badge__dot { display: none; }
.mailchimp-scope .c-badge--success { background: #d4f7df; color: #1a6b3c; }
.mailchimp-scope .c-badge--info { background: #d6eef0; color: #007c89; }
.mailchimp-scope .c-badge--warning { background: #fdf0c9; color: #8a6d00; }
.mailchimp-scope .c-badge--critical { background: #fde3dd; color: #b3290f; }
.mailchimp-scope .c-tab { background: none; }
.mailchimp-scope .c-tab--active { color: #241c15; box-shadow: inset 0 -3px 0 #241c15; font-weight: 700; }
.mailchimp-scope .c-banner--info { background: #eef7f8; border-color: #a9d6db; }
.mailchimp-scope .c-banner--info .c-banner__icon { color: #007c89; }
.mailchimp-scope .c-banner--critical { background: #fdeae5; border-color: #f3b6a6; }
.mailchimp-scope .c-banner--critical .c-banner__icon { color: #d3320d; }

/* ── Apple HIG — iOS blue, soft radii, vibrant pills, green toggle ──────── */
.apple-scope {
  --c-sub: #6e6e73; --c-border: #d2d2d7; --c-border-strong: #d2d2d7; --c-surface: #fff;
  --c-radius: 10px; --c-radius-lg: 14px; --c-badge-radius: 9999px; --c-tab-radius: 7px; --c-check-radius: 6px; --c-avatar-radius: 9999px;
  --c-primary: #007aff; --c-primary-fg: #fff; --c-secondary-bg: #fff; --c-critical: #ff3b30; --c-accent: #007aff;
  --c-input-bg: #fff; --c-input-border: #d2d2d7; --c-focus: #007aff; --c-th-bg: #f5f5f7; --c-track: #e9e9eb;
  --c-avatar-bg: #e9e9eb; --c-avatar-fg: #1d1d1f;
  --c-card-shadow: 0 2px 8px rgba(0,0,0,0.06); --c-btn-shadow: none;
  font-family: -apple-system, ui-sans-serif, system-ui, sans-serif; color: #1d1d1f; font-size: 14px;
}
.apple-scope .c-badge { font-weight: 590; }
.apple-scope .c-badge__dot { display: none; }
.apple-scope .c-badge--success { background: rgba(52,199,89,0.16); color: #248a3d; }
.apple-scope .c-badge--info { background: rgba(0,122,255,0.14); color: #0066cc; }
.apple-scope .c-badge--warning { background: rgba(255,149,0,0.16); color: #9a6200; }
.apple-scope .c-badge--critical { background: rgba(255,59,48,0.14); color: #d70015; }
.apple-scope .c-switch--on { background: #34c759; }
.apple-scope .c-tabs { border-bottom: none; background: #eff0f2; border-radius: 9px; padding: 2px; gap: 2px; }
.apple-scope .c-tab { border-radius: 7px; }
.apple-scope .c-tab--active { background: #fff; color: #1d1d1f; box-shadow: 0 1px 3px rgba(0,0,0,0.12); }
.apple-scope .c-banner--info { background: rgba(0,122,255,0.08); border-color: rgba(0,122,255,0.25); }
.apple-scope .c-banner--info .c-banner__icon { color: #007aff; }
.apple-scope .c-banner--critical { background: rgba(255,59,48,0.08); border-color: rgba(255,59,48,0.25); }
.apple-scope .c-banner--critical .c-banner__icon { color: #ff3b30; }
`;

/* ── Right-column markup (shared; styled by the active scope) ───────────── */

const BADGES: [string, string][] = [
  ["success", "Active"],
  ["warning", "Pending"],
  ["critical", "Failed"],
  ["info", "In review"],
];

function RBadges() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {BADGES.map(([tone, label]) => (
        <span key={label} className={`c-badge c-badge--${tone}`}>
          <span className="c-badge__dot" />
          {label}
        </span>
      ))}
    </div>
  );
}

const RIGHT: Record<string, React.ReactNode> = {
  Button: (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button className="c-btn c-btn--primary">Save</button>
      <button className="c-btn c-btn--secondary">Cancel</button>
      <button className="c-btn c-btn--critical">Delete</button>
    </div>
  ),
  Status: <RBadges />,
  Card: (
    <div className="c-card mx-auto" style={{ maxWidth: "20rem" }}>
      <div className="c-card__title">Usage this month</div>
      <div className="c-card__sub">Events across all projects.</div>
      <div className="c-card__value">12,480</div>
      <button className="c-btn c-btn--secondary">View details</button>
    </div>
  ),
  "Text field": (
    <div className="mx-auto" style={{ maxWidth: "20rem" }}>
      <label className="c-label" htmlFor="cmp-field">
        Display name
      </label>
      <input id="cmp-field" className="c-input" placeholder="Acme Support" />
      <p className="c-help">Shown to teammates across your workspace.</p>
    </div>
  ),
  Select: (
    <div className="mx-auto" style={{ maxWidth: "20rem" }}>
      <label className="c-label">Role</label>
      <div className="c-select">
        <span>Editor</span>
        <ChevronDown className="c-select__chev" size={16} />
      </div>
    </div>
  ),
  Checkbox: (
    <div className="flex flex-col gap-3">
      <span className="c-check-row">
        <span className="c-check c-check--on">
          <Check size={11} />
        </span>
        Email me a weekly summary
      </span>
      <span className="c-check-row">
        <span className="c-check" />
        Notify me of mentions
      </span>
    </div>
  ),
  Switch: (
    <div className="flex flex-col gap-3">
      <span className="c-switch-row">
        <span className="c-switch c-switch--on">
          <span className="c-switch__thumb" />
        </span>
        Enable two-factor authentication
      </span>
      <span className="c-switch-row">
        <span className="c-switch">
          <span className="c-switch__thumb" />
        </span>
        Make project public
      </span>
    </div>
  ),
  Progress: (
    <div className="mx-auto w-full" style={{ maxWidth: "20rem" }}>
      <div
        style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}
      >
        <span>Monthly quota</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>64%</span>
      </div>
      <div className="c-progress">
        <div className="c-progress__bar" />
      </div>
    </div>
  ),
  Avatar: (
    <div className="flex items-center justify-center gap-3">
      <span className="c-avatar">PG</span>
      <span className="c-avatar">OT</span>
      <span className="c-avatar">FX</span>
    </div>
  ),
  Banner: (
    <div className="mx-auto space-y-3" style={{ maxWidth: "24rem" }}>
      <div className="c-banner c-banner--info">
        <Info className="c-banner__icon" size={18} />
        <div>
          <div className="c-banner__title">Changes saved</div>
          <div className="c-banner__body">
            Your workspace settings have been updated.
          </div>
        </div>
      </div>
      <div className="c-banner c-banner--critical">
        <TriangleAlert className="c-banner__icon" size={18} />
        <div>
          <div className="c-banner__title">Action required</div>
          <div className="c-banner__body">
            Confirm your billing details to keep your plan active.
          </div>
        </div>
      </div>
    </div>
  ),
  Table: (
    <table className="c-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Status</th>
          <th className="c-num">Usage</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Acme Inc.</td>
          <td>
            <span className="c-badge c-badge--success">
              <span className="c-badge__dot" />
              Active
            </span>
          </td>
          <td className="c-num">1,284</td>
        </tr>
        <tr>
          <td>Globex</td>
          <td>
            <span className="c-badge c-badge--warning">
              <span className="c-badge__dot" />
              Pending
            </span>
          </td>
          <td className="c-num">0</td>
        </tr>
      </tbody>
    </table>
  ),
  Tabs: (
    <div className="mx-auto" style={{ maxWidth: "24rem" }}>
      <div className="c-tabs">
        <span className="c-tab c-tab--active">Overview</span>
        <span className="c-tab">Activity</span>
        <span className="c-tab">Settings</span>
      </div>
      <div className="c-tabs__panel">1,284 events this week.</div>
    </div>
  ),
};

/* ── Left-column markup (always our real components) ────────────────────── */

function OursSelect() {
  const [value, setValue] = React.useState("editor");
  return (
    <Select value={value} onValueChange={(v) => setValue(v as string)}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="viewer">Read only</SelectItem>
        <SelectItem value="editor">Editor</SelectItem>
        <SelectItem value="admin">Admin</SelectItem>
      </SelectContent>
    </Select>
  );
}

const OURS: Record<string, React.ReactNode> = {
  Button: (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Button>Save</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Delete</Button>
    </div>
  ),
  Status: (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <StatusPill tone="success">Active</StatusPill>
      <StatusPill tone="warning">Pending</StatusPill>
      <StatusPill tone="danger">Failed</StatusPill>
      <StatusPill tone="info">In review</StatusPill>
    </div>
  ),
  Card: (
    <Card className="mx-auto max-w-xs">
      <CardHeader>
        <CardTitle>Usage this month</CardTitle>
        <CardDescription>Calls and texts across all numbers.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">12,480</p>
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">
          View details
        </Button>
      </CardFooter>
    </Card>
  ),
  "Text field": (
    <div className="mx-auto max-w-xs space-y-1.5">
      <Label htmlFor="cmp-ours-field">Display name</Label>
      <Input id="cmp-ours-field" placeholder="Acme Support" />
      <p className="text-xs text-muted-foreground">Shown to teammates across your workspace.</p>
    </div>
  ),
  Select: (
    <div className="mx-auto max-w-xs space-y-1.5">
      <Label>Capability</Label>
      <OursSelect />
    </div>
  ),
  Checkbox: (
    <div className="flex flex-col gap-3">
      <Label className="gap-2">
        <Checkbox defaultChecked />
        Email me a weekly summary
      </Label>
      <Label className="gap-2">
        <Checkbox />
        Notify me of mentions
      </Label>
    </div>
  ),
  Switch: (
    <div className="flex flex-col gap-3">
      <Label className="gap-2">
        <Switch defaultChecked />
        Enable two-factor authentication
      </Label>
      <Label className="gap-2">
        <Switch />
        Make project public
      </Label>
    </div>
  ),
  Progress: (
    <Progress value={64} className="mx-auto max-w-xs">
      <ProgressLabel>Monthly quota</ProgressLabel>
      <ProgressValue />
    </Progress>
  ),
  Avatar: (
    <div className="flex items-center justify-center gap-3">
      <Avatar>
        <AvatarFallback>PG</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>OT</AvatarFallback>
      </Avatar>
      <GradientAvatar seed="abc" size="lg" />
    </div>
  ),
  Banner: (
    <div className="mx-auto max-w-sm space-y-3">
      <Alert>
        <CheckCircle2 />
        <AlertTitle>Changes saved</AlertTitle>
        <AlertDescription>
          Your workspace settings have been updated.
        </AlertDescription>
      </Alert>
    </div>
  ),
  Table: (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right tabular-nums">Usage</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Acme Inc.</TableCell>
          <TableCell>
            <Badge variant="success">Active</Badge>
          </TableCell>
          <TableCell className="text-right tabular-nums">1,284</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Globex</TableCell>
          <TableCell>
            <Badge variant="warning">Pending</Badge>
          </TableCell>
          <TableCell className="text-right tabular-nums">0</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
  Tabs: (
    <Tabs defaultValue="overview" className="mx-auto max-w-sm">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="pt-3 text-sm text-muted-foreground">
        1,284 events this week.
      </TabsContent>
      <TabsContent value="activity" className="pt-3 text-sm text-muted-foreground">
        42 active users today.
      </TabsContent>
      <TabsContent value="settings" className="pt-3 text-sm text-muted-foreground">
        3 members can edit.
      </TabsContent>
    </Tabs>
  ),
};

/* Our constant identity, then each system's contrast with it. */
const OURS_NOTE =
  "Ours pills every control, keeps borders to a hairline, reserves the single warm green for status (not buttons), and lets whitespace carry the layout.";

const NOTES: Record<string, Record<string, string>> = {
  Button: {
    vercel: "Vercel squares to 6px and stays monochrome — a flat black primary, a hairline secondary, no accent on the button.",
    linear: "Linear rounds to 8px and spends its indigo accent on the primary itself, where we stay neutral.",
    zero: "0.email puts a blue primary on a dark surface, tuned for an inbox rather than a calm dashboard.",
    shopify: "Polaris uses 8px with a layered button shadow and a filled critical-red role — more chrome, fuller palette.",
    stripe: "Stripe gives the indigo primary a soft layered shadow and gentle radius — refined depth where we stay flat.",
    github: "GitHub pairs a green primary with a grey bordered secondary at 6px — utilitarian, never a pill.",
  },
  Status: {
    vercel: "Vercel's badges are small, squared, and uppercase — tonal text on a faint fill, no leading dot.",
    linear: "Linear tints a translucent pill in the status hue with matching text — subtle on dark.",
    zero: "0.email leans on the colored dot too, but as a dense, unread-style signal on a dark row.",
    shopify: "Polaris fills the whole badge with a tonal background per role, fusing color and text.",
    stripe: "Stripe uses soft tonal pills — green, indigo, red fills, fully rounded, no dot.",
    github: "GitHub's Primer Labels are fully-rounded tints (green, blue, red) carrying state as fill.",
  },
  Card: {
    vercel: "Vercel keeps the card flat — 8px, a single #eaeaea border, no shadow. Structure from the line.",
    linear: "Linear floats a dark surface with a soft shadow at 10px — depth is part of the language.",
    zero: "0.email tightens a dark panel — denser padding at 8px, built to stack many at once.",
    shopify: "Polaris uses 12px, a denser 16px rhythm, and a soft drop shadow to lift the surface.",
    stripe: "Stripe floats a white card on its blue canvas with the signature layered Stripe shadow.",
    github: "GitHub keeps a flat #d0d7de-bordered box on a grey canvas — no elevation, all line.",
  },
  "Text field": {
    vercel: "Vercel's input is a crisp 6px box with a hairline border that darkens to black on focus — no ring.",
    linear: "Linear sinks the field into the dark surface with a faint border and an indigo focus ring.",
    zero: "0.email's field is a dark, compact box with a blue focus — at home in a command-driven inbox.",
    shopify: "Polaris boxes the input at 8px with a stronger #8a8a8a border and a 2px blue focus ring.",
    stripe: "Stripe's field carries a soft border that lights up with an indigo focus glow.",
    github: "GitHub boxes the field at 6px with a #d0d7de border and a 2px blue focus outline.",
  },
  Select: {
    vercel: "Vercel's trigger is a monochrome 6px box with a quiet chevron — it matches the input exactly.",
    linear: "Linear's trigger sinks into the dark surface, chevron in subdued grey.",
    zero: "0.email's trigger is a compact dark box, blue on focus, dense like the inbox.",
    shopify: "Polaris boxes the trigger at 8px with its stronger border.",
    stripe: "Stripe's trigger is soft-bordered at gentle radius, indigo on focus.",
    github: "GitHub's trigger is a #d0d7de box at 6px — Primer's standard control.",
  },
  Checkbox: {
    vercel: "Vercel's box fills solid black when checked — monochrome, no blue.",
    linear: "Linear fills the box indigo when checked, on the dark surface.",
    zero: "0.email fills the box blue when checked — the inbox accent.",
    shopify: "Polaris fills the box near-black (#303030) — its interactive ink, not the brand green.",
    stripe: "Stripe fills the box indigo with a soft check — refined and rounded.",
    github: "GitHub fills the box Primer blue (#0969da) — the interactive accent, distinct from its green buttons.",
  },
  Switch: {
    vercel: "Vercel's track flips to solid black when on — a monochrome toggle.",
    linear: "Linear's track turns indigo when on, sitting on dark.",
    zero: "0.email's track turns blue when on, dense like the inbox.",
    shopify: "Polaris's track turns near-black when on — its interactive ink.",
    stripe: "Stripe's track turns indigo with a soft thumb shadow.",
    github: "GitHub's track turns blue (#0969da) when on — the interactive accent.",
  },
  Progress: {
    vercel: "Vercel draws a thin black bar on a grey track — monochrome throughout.",
    linear: "Linear draws an indigo bar on a dark track.",
    zero: "0.email draws a blue bar on a dark track.",
    shopify: "Polaris draws a near-black bar on a light track.",
    stripe: "Stripe draws an indigo bar on a soft track.",
    github: "GitHub draws a blue bar on a light grey track.",
  },
  Avatar: {
    vercel: "Vercel keeps the avatar a circle with a neutral grey fill.",
    linear: "Linear's avatar is a circle on dark with a subdued fill.",
    zero: "0.email's avatar is a dense, dark circle.",
    shopify: "Polaris uses a rounded-square (squircle) avatar — its identity shape.",
    stripe: "Stripe's avatar is a circle with a soft indigo-tinted fill.",
    github: "GitHub uses a rounded-square avatar at 6px — Primer's identity shape.",
  },
  Banner: {
    vercel: "Vercel keeps callouts light — a faint tinted surface and a single accent icon.",
    linear: "Linear renders the banner on dark with a low-opacity tonal fill and a glowing accent icon.",
    zero: "0.email's banners are dark and tonal, color carrying the urgency against near-black.",
    shopify: "Polaris paints the whole surface in the tone's color, so the banner announces itself.",
    stripe: "Stripe shows a soft tinted banner with an indigo or red icon — quietly refined.",
    github: "GitHub's Primer flash is a bordered tonal strip with a blue or red icon.",
  },
  Table: {
    vercel: "Vercel's table is clean and monochrome — a #fafafa header, hairline rows, plain.",
    linear: "Linear's grid is dark and quiet — subdued header, faint dividers, light values.",
    zero: "0.email packs the rows tightest on dark — an inbox density.",
    shopify: "Polaris rules every edge with a subdued small-caps header — instrument density.",
    stripe: "Stripe's table is airy and bordered on white — refined and legible.",
    github: "GitHub rules the table with #d0d7de and a grey header row — Primer's data grid.",
  },
  Tabs: {
    vercel: "Vercel uses underline tabs — a black bottom-rule under the selected label, no track.",
    linear: "Linear marks the selection with an indigo underline on dark, text brightening to full white.",
    zero: "0.email selects with a blue-tinted fill, echoing the highlighted row in its inbox.",
    shopify: "Polaris fits its tabs along a divider, marking the selected one with a soft grey fill.",
    stripe: "Stripe draws a quiet indigo underline beneath the active tab.",
    github: "GitHub uses its signature orange underline beneath the active tab.",
  },
};

/* Notes for the four later additions, merged with NOTES at render time. */
const NOTES2: Record<string, Record<string, string>> = {
  Button: {
    atlassian: "Atlassian squares hard to a 3px radius — a blue primary, a borderless grey secondary, enterprise-plain.",
    radix: "shadcn's baseline — a near-black primary at 6px, no accent hue, variant-based not pill. Ours adds the pill and the green.",
    mailchimp: "Mailchimp shouts in its signature yellow with black text, and a bold dark-bordered secondary.",
    apple: "Apple uses the iOS system blue at a soft 10px radius — friendly, rounded, SF-set.",
  },
  Status: {
    atlassian: "Atlassian's Lozenges are tiny uppercase tonal tags at a 3px radius.",
    radix: "shadcn has no status scale — it reuses default / secondary / destructive / outline variants instead of tones.",
    mailchimp: "Mailchimp's tags are bold rounded pills in warm tonal colors.",
    apple: "Apple uses vibrant iOS tinted pills — system green, orange, red, blue.",
  },
  Card: {
    atlassian: "Atlassian boxes a flat 3px card with a faint elevation shadow.",
    radix: "shadcn's card is a neutral bordered surface at 8px with a barely-there shadow — close to ours, minus the pill language.",
    mailchimp: "Mailchimp warms the card on a cream canvas with a soft border.",
    apple: "Apple rounds the card to ~14px on its signature grey — soft and friendly.",
  },
  "Text field": {
    atlassian: "Atlassian's field is a 3px box with a grey border and a 2px blue focus.",
    radix: "shadcn's input is a neutral 6px box with a subtle ring on focus.",
    mailchimp: "Mailchimp's field is a warm-bordered box with a teal focus.",
    apple: "Apple's field is a soft 10px box with the iOS blue focus.",
  },
  Select: {
    atlassian: "Atlassian's trigger is a square 3px box with a grey border.",
    radix: "shadcn's trigger is a neutral 6px box — it matches its input.",
    mailchimp: "Mailchimp's trigger is warm-bordered with a teal focus.",
    apple: "Apple's trigger is a soft rounded box, iOS-blue on focus.",
  },
  Checkbox: {
    atlassian: "Atlassian fills the box blue (#0c66e4) at a tight 3px radius.",
    radix: "shadcn fills the box near-black — its monochrome primary, no accent hue.",
    mailchimp: "Mailchimp fills the box teal (#007c89) — its interactive accent, not the yellow.",
    apple: "Apple fills the box iOS blue with a rounded check.",
  },
  Switch: {
    atlassian: "Atlassian's track turns blue when on.",
    radix: "shadcn's track turns near-black when on — monochrome.",
    mailchimp: "Mailchimp's track turns teal when on.",
    apple: "Apple's track turns iOS green (#34c759) when on — the signature toggle.",
  },
  Progress: {
    atlassian: "Atlassian draws a blue bar on a grey track.",
    radix: "shadcn draws a near-black bar on a muted track.",
    mailchimp: "Mailchimp draws a teal bar on a warm track.",
    apple: "Apple draws an iOS-blue bar on a soft track.",
  },
  Avatar: {
    atlassian: "Atlassian keeps the avatar circular with a tinted fill.",
    radix: "shadcn's avatar is a neutral circle.",
    mailchimp: "Mailchimp's avatar is a warm circle.",
    apple: "Apple's avatar is a circle (squircle) with a soft fill.",
  },
  Banner: {
    atlassian: "Atlassian's section message is a tonal 3px strip with an icon.",
    radix: "shadcn's alert is a neutral bordered box — restrained, no tonal wash.",
    mailchimp: "Mailchimp's banner is warm and tonal with a bold icon.",
    apple: "Apple's notice is a soft tinted card with an iOS-colored icon.",
  },
  Table: {
    atlassian: "Atlassian rules a tight 3px-cornered grid with a subtle header.",
    radix: "shadcn's table is a clean neutral grid with muted headers.",
    mailchimp: "Mailchimp's table is warm-bordered and roomy.",
    apple: "Apple's table is soft and rounded with a light grey header.",
  },
  Tabs: {
    atlassian: "Atlassian underlines the active tab in blue.",
    radix: "shadcn uses a muted segmented track with the active tab as a white card at 6px — like ours, minus the full pill.",
    mailchimp: "Mailchimp underlines the active tab in its dark ink.",
    apple: "Apple uses an iOS segmented control — a grey track with a white selected pill.",
  },
};

const COMPONENT_ORDER = [
  "Button",
  "Status",
  "Card",
  "Text field",
  "Select",
  "Checkbox",
  "Switch",
  "Progress",
  "Avatar",
  "Banner",
  "Table",
  "Tabs",
] as const;

function ColHead({ label, color }: { label: string; color?: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn("size-1.5 rounded-full", !color && "bg-brand")}
        style={color ? { background: color } : undefined}
      />
      <span className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
    </div>
  );
}

export function VsComparison() {
  const [system, setSystem] = React.useState<SystemId>("vercel");
  const { resolvedTheme, setTheme } = useTheme();
  // Lint-safe mounted flag (no setState-in-effect): false on server, true on client.
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const meta = SYSTEMS[system];
  const oursTheme: "light" | "dark" =
    mounted && resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div>
      <style>{CSS}</style>

      {/* Toggle + selected-system identity */}
      <div className="space-y-3 pb-2">
        <div className="flex flex-wrap items-center gap-3">
          <div className="-mx-1 max-w-full overflow-x-auto px-1">
            <SegmentedControl
              options={SYSTEM_ORDER.map((id) => ({ label: SYSTEMS[id].label, value: id }))}
              value={system}
              onValueChange={setSystem}
            />
          </div>
          <span className="text-xs text-muted-foreground">
            Toggle the system shown beside ours
          </span>
        </div>
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-3 rounded-full" style={{ background: meta.accent }} />
            <span className="font-medium">{meta.label}</span>
          </span>
          <span className="text-muted-foreground">· {meta.typeface}</span>
          <span className="text-muted-foreground">— {meta.tagline}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Theme</span>
          <SegmentedControl
            options={[
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
            ]}
            value={oursTheme}
            onValueChange={(v) => setTheme(v)}
          />
          <span className="text-xs text-muted-foreground">
            our side flips; each system keeps its own
          </span>
        </div>
      </div>

      <div className="divide-y divide-border [&>*]:py-8 [&>*:first-child]:pt-6 [&>*:last-child]:pb-0">
        {COMPONENT_ORDER.map((name) => (
          <div key={name} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <ColHead label="byronwade/ui" />
                <div className="edge flex min-h-[148px] items-center justify-center rounded-xl bg-background p-6 transition-colors">
                  <div className="w-full">{OURS[name]}</div>
                </div>
              </div>
              <div className="space-y-2">
                <ColHead label={meta.label} color={meta.accent} />
                <div
                  className={cn(
                    "cmp-scope flex min-h-[148px] items-center justify-center rounded-xl border p-6 transition-colors",
                    meta.scope,
                  )}
                  style={{ background: meta.well, borderColor: meta.border }}
                >
                  <div className="w-full">{RIGHT[name]}</div>
                </div>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">{name}.</span>{" "}
              {name === "Button" ? `${OURS_NOTE} ` : ""}
              {NOTES[name]?.[system] ?? NOTES2[name]?.[system] ?? ""}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
