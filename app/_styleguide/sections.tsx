"use client";

import * as React from "react";
import { toast } from "sonner";
import { Bell, Settings, Trash2 } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const SECTIONS = [
  { id: "philosophy", label: "Philosophy" },
  { id: "principles", label: "Principles" },
  { id: "foundations", label: "Foundations" },
  { id: "primitives", label: "Primitives" },
  { id: "forms", label: "Forms" },
  { id: "overlays", label: "Overlays" },
  { id: "feedback", label: "Feedback" },
  { id: "data", label: "Data display" },
  { id: "patterns", label: "Patterns" },
  { id: "charts", label: "Charts" },
  { id: "house", label: "House components" },
  { id: "layouts", label: "Layouts" },
  { id: "comparison", label: "Side by side" },
] as const;

/** Derive a URL-safe anchor id from an arbitrary string. */
export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** Full table-of-contents model: each section with its specimens. */
export const NAV: { id: string; label: string; items: { id: string; label: string }[] }[] = [
  {
    id: "philosophy",
    label: "Philosophy",
    items: [
      { id: slugify("Calm over chrome"), label: "Calm over chrome" },
      { id: slugify("No generic grids — one signature hero per page"), label: "No generic grids — one signature hero per page" },
      { id: slugify("Constant chrome, bespoke body"), label: "Constant chrome, bespoke body" },
    ],
  },
  {
    id: "principles",
    label: "Principles",
    items: [
      { id: slugify("Single-accent rule"), label: "Single-accent rule" },
      { id: slugify("Status convention"), label: "Status convention" },
      { id: slugify("Do / Don't"), label: "Do / Don't" },
      { id: slugify("Spacing & radius"), label: "Spacing & radius" },
    ],
  },
  {
    id: "foundations",
    label: "Foundations",
    items: [
      { id: slugify("Color"), label: "Color" },
      { id: slugify("Radius"), label: "Radius" },
      { id: slugify("Elevation"), label: "Elevation" },
      { id: slugify("Typography"), label: "Typography" },
      { id: slugify("Utilities"), label: "Utilities" },
    ],
  },
  {
    id: "primitives",
    label: "Primitives",
    items: [
      { id: slugify("Button — variants"), label: "Button — variants" },
      { id: slugify("Button — sizes"), label: "Button — sizes" },
      { id: slugify("Badge"), label: "Badge" },
      { id: slugify("FilterPill"), label: "FilterPill" },
      { id: slugify("SegmentedControl"), label: "SegmentedControl" },
      { id: slugify("StatusDot"), label: "StatusDot" },
      { id: slugify("StatusPill"), label: "StatusPill" },
      { id: slugify("Card"), label: "Card" },
    ],
  },
  {
    id: "forms",
    label: "Forms",
    items: [
      { id: slugify("Input"), label: "Input" },
      { id: slugify("Textarea"), label: "Textarea" },
      { id: slugify("Select"), label: "Select" },
      { id: slugify("Checkbox"), label: "Checkbox" },
      { id: slugify("Switch"), label: "Switch" },
      { id: slugify("RadioGroup"), label: "RadioGroup" },
      { id: slugify("Label"), label: "Label" },
    ],
  },
  {
    id: "overlays",
    label: "Overlays",
    items: [
      { id: slugify("Tooltip"), label: "Tooltip" },
      { id: slugify("Popover"), label: "Popover" },
      { id: slugify("DropdownMenu"), label: "DropdownMenu" },
      { id: slugify("Dialog"), label: "Dialog" },
      { id: slugify("HoverCard"), label: "HoverCard" },
    ],
  },
  {
    id: "feedback",
    label: "Feedback",
    items: [
      { id: slugify("Alert"), label: "Alert" },
      { id: slugify("Progress"), label: "Progress" },
      { id: slugify("Skeleton"), label: "Skeleton" },
      { id: slugify("Toast"), label: "Toast" },
    ],
  },
  {
    id: "data",
    label: "Data display",
    items: [
      { id: slugify("Tabs"), label: "Tabs" },
      { id: slugify("Accordion"), label: "Accordion" },
      { id: slugify("Avatar"), label: "Avatar" },
      { id: slugify("Separator"), label: "Separator" },
      { id: slugify("Breadcrumb"), label: "Breadcrumb" },
      { id: slugify("Table"), label: "Table" },
    ],
  },
  {
    id: "patterns",
    label: "Patterns",
    items: [
      { id: slugify("PageHeader"), label: "PageHeader" },
      { id: slugify("MetricStat"), label: "MetricStat" },
      { id: slugify("StatCard"), label: "StatCard" },
      { id: slugify("Gauge"), label: "Gauge" },
      { id: slugify("ActivityGrid"), label: "ActivityGrid" },
      { id: slugify("GradientAvatar + animalName"), label: "GradientAvatar + animalName" },
      { id: slugify("EmptyState"), label: "EmptyState" },
    ],
  },
  {
    id: "charts",
    label: "Charts",
    items: [
      { id: slugify("Area chart"), label: "Area chart" },
      { id: slugify("Bar chart"), label: "Bar chart" },
    ],
  },
  {
    id: "house",
    label: "House components",
    items: [
      { id: slugify("DetailHeader"), label: "DetailHeader" },
      { id: slugify("Section (settings panel)"), label: "Section (settings panel)" },
      { id: slugify("EventTimeline"), label: "EventTimeline" },
    ],
  },
  {
    id: "layouts",
    label: "Layouts",
    items: [
      { id: slugify("HeroSection"), label: "HeroSection" },
      { id: slugify("CenteredFocal"), label: "CenteredFocal" },
      { id: slugify("SplitWithRail + TimelineRail"), label: "SplitWithRail + TimelineRail" },
    ],
  },
  {
    id: "comparison",
    label: "Side by side",
    items: [],
  },
];

/** Sticky in-page nav — full TOC: each section with its specimens, component-level scroll-spy. */
export function SideNav() {
  const [active, setActive] = React.useState<string>(SECTIONS[0].id);
  const navRef = React.useRef<HTMLElement>(null);
  const prevActiveRef = React.useRef<string>(SECTIONS[0].id);

  // Build a flat ordered list of all anchor ids (section then specimens, in DOM order)
  const allIds = React.useMemo(() => {
    const ids: string[] = [];
    for (const section of NAV) {
      ids.push(section.id);
      for (const item of section.items) {
        ids.push(item.id);
      }
    }
    return ids;
  }, []);

  // Build a lookup: itemId -> parent sectionId
  const parentSection = React.useMemo(() => {
    const map: Record<string, string> = {};
    for (const section of NAV) {
      for (const item of section.items) {
        map[item.id] = section.id;
      }
      map[section.id] = section.id;
    }
    return map;
  }, []);

  React.useEffect(() => {
    const visibleIds = new Set<string>();

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            visibleIds.add(e.target.id);
          } else {
            visibleIds.delete(e.target.id);
          }
        }
        // Pick the last id in DOM order that is currently visible
        let nextActive = active;
        for (const id of allIds) {
          if (visibleIds.has(id)) nextActive = id;
        }
        if (nextActive !== prevActiveRef.current) {
          prevActiveRef.current = nextActive;
          setActive(nextActive);
        }
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );

    for (const id of allIds) {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    }

    return () => obs.disconnect();
  }, [allIds]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-scroll the active nav link into view when active changes
  React.useEffect(() => {
    if (!navRef.current) return;
    const el = navRef.current.querySelector(`[data-nav-id="${active}"]`);
    if (el) (el as HTMLElement).scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <nav
      ref={navRef}
      className="sticky top-24 hidden max-h-[calc(100dvh-7rem)] self-start overflow-y-auto pr-2 scrollbar-thin lg:block"
    >
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Contents
      </p>
      <ul className="border-l border-border">
        {NAV.map((section) => {
          const sectionIsActive = parentSection[active] === section.id;
          return (
            <li key={section.id}>
              {/* Section header */}
              <a
                href={`#${section.id}`}
                data-nav-id={section.id}
                className={cn(
                  "-ml-px block border-l-2 px-3 py-1 text-xs font-medium uppercase tracking-wide transition-colors",
                  active === section.id && section.items.length === 0
                    ? "border-brand text-foreground"
                    : sectionIsActive
                    ? "border-brand/40 text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {section.label}
              </a>
              {/* Specimen items */}
              {section.items.length > 0 && (
                <ul className="mb-1">
                  {section.items.map((item) => (
                    <li key={item.id}>
                      <a
                        href={`#${item.id}`}
                        data-nav-id={item.id}
                        className={cn(
                          "-ml-px block truncate border-l-2 py-0.5 pl-6 pr-2 text-sm transition-colors",
                          active === item.id
                            ? "border-brand font-medium text-foreground"
                            : "border-transparent text-muted-foreground hover:text-foreground",
                        )}
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** A documentation section: titled header + count, then specimens separated by hairlines. */
export function Section({
  id,
  title,
  description,
  count,
  children,
}: {
  id: string;
  title: string;
  description?: string;
  count?: number;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className="flex items-end justify-between gap-4 border-b border-border pb-4">
        <div>
          <h2 className="font-heading text-xl font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {count != null && (
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {count} {count === 1 ? "item" : "items"}
          </span>
        )}
      </div>
      <div className="divide-y divide-border [&>*]:py-8 [&>*:first-child]:pt-6 [&>*:last-child]:pb-0">
        {children}
      </div>
    </section>
  );
}

/** A single component specimen: name + import path, then the live example. */
export function Specimen({
  name,
  from,
  plain = false,
  children,
}: {
  name: string;
  from?: string;
  /** Drop the framed surface — for components that are already self-contained (cards, headers). */
  plain?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div id={slugify(name)} className="scroll-mt-24 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium">{name}</span>
        {from && (
          <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground">
            {from}
          </code>
        )}
      </div>
      <div className={cn(!plain && "rounded-xl border border-border bg-background p-6")}>
        {children}
      </div>
    </div>
  );
}

/** Token swatch: a colored tile + token name + role. */
export function Swatch({
  name,
  className,
  role,
}: {
  name: string;
  className: string;
  role?: string;
}) {
  return (
    <div className="space-y-1.5">
      <div className={cn("h-14 w-full rounded-xl border border-border", className)} />
      <p className="font-mono text-[11px] text-foreground">{name}</p>
      {role && <p className="text-[11px] leading-tight text-muted-foreground">{role}</p>}
    </div>
  );
}

export function SegmentedDemo() {
  const [value, setValue] = React.useState("top");
  return (
    <SegmentedControl
      options={[
        { label: "Top", value: "top" },
        { label: "Entered", value: "entered" },
        { label: "Exited", value: "exited" },
      ]}
      value={value}
      onValueChange={setValue}
    />
  );
}

/* ── Forms ───────────────────────────────────────────────────────────── */

export function SelectDemo() {
  const [value, setValue] = React.useState("voice");
  return (
    <Select value={value} onValueChange={(v) => setValue(v as string)}>
      <SelectTrigger id="capability" className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="voice">Voice — calls only</SelectItem>
        <SelectItem value="sms">SMS — texts only</SelectItem>
        <SelectItem value="both">Voice & SMS</SelectItem>
      </SelectContent>
    </Select>
  );
}

export function CheckboxDemo() {
  const [checked, setChecked] = React.useState(true);
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id="forward"
        checked={checked}
        onCheckedChange={(v) => setChecked(v === true)}
      />
      <Label htmlFor="forward">Forward missed calls to voicemail</Label>
    </div>
  );
}

export function SwitchDemo() {
  const [on, setOn] = React.useState(true);
  return (
    <div className="flex items-center gap-2">
      <Switch id="ai-answer" checked={on} onCheckedChange={setOn} />
      <Label htmlFor="ai-answer">AI answers after 4 rings</Label>
    </div>
  );
}

export function RadioGroupDemo() {
  const [value, setValue] = React.useState("local");
  return (
    <RadioGroup value={value} onValueChange={(v) => setValue(v as string)}>
      <Label className="gap-2">
        <RadioGroupItem value="local" />
        Local number
      </Label>
      <Label className="gap-2">
        <RadioGroupItem value="tollfree" />
        Toll-free number
      </Label>
      <Label className="gap-2">
        <RadioGroupItem value="port" />
        Port an existing number
      </Label>
    </RadioGroup>
  );
}

/* ── Overlays ────────────────────────────────────────────────────────── */

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
      <TooltipContent>Routes inbound calls to this number</TooltipContent>
    </Tooltip>
  );
}

export function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline">Open popover</Button>} />
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Caller ID</PopoverTitle>
          <PopoverDescription>
            The name shown to people you call from this number.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  );
}

export function DropdownMenuDemo() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline">Actions</Button>}
      />
      <DropdownMenuContent>
        <DropdownMenuLabel>This number</DropdownMenuLabel>
        <DropdownMenuItem>
          <Settings />
          Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Bell />
          Notifications
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <Trash2 />
          Release number
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Open dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Release this number?</DialogTitle>
          <DialogDescription>
            This permanently releases the number and stops all routing. This
            can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose
            render={<Button variant="outline">Cancel</Button>}
          />
          <DialogClose
            render={<Button variant="destructive">Release</Button>}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger
        render={<Button variant="link">@penguin</Button>}
      />
      <HoverCardContent>
        <div className="flex items-center gap-3">
          <Avatar size="lg">
            <AvatarFallback>PG</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Penguin</p>
            <p className="font-mono text-xs text-muted-foreground">
              +1 (555) 010-2048
            </p>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}

/* ── Feedback ────────────────────────────────────────────────────────── */

export function ToastDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast.success("Number provisioned", {
            description: "+1 (555) 010-2048 is ready to use.",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => toast.error("Verification failed. Try again.")}
      >
        Error
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast("Heads up", { description: "Carrier registration is pending." })
        }
      >
        Default
      </Button>
    </div>
  );
}

/* ── Charts ──────────────────────────────────────────────────────────── */

const areaConfig = {
  value: { label: "Calls", color: "var(--chart-1)" },
} satisfies ChartConfig;

// 24 hourly points — a calm, single-series curve.
const areaData = Array.from({ length: 24 }, (_, i) => {
  const wave = Math.sin((i / 23) * Math.PI * 1.6) * 18 + 26;
  const drift = (i * 13) % 9;
  return {
    hour: `${String(i).padStart(2, "0")}:00`,
    value: Math.max(2, Math.round(wave + drift)),
  };
});

/** Hero-style area chart: smooth chart-1 curve, soft gradient, endpoint labels only. */
export function AreaChartDemo() {
  return (
    <ChartContainer config={areaConfig} className="aspect-auto h-[220px] w-full">
      <AreaChart data={areaData} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
        <defs>
          <linearGradient id="sg-fill-value" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-value)" stopOpacity={0.35} />
            <stop offset="95%" stopColor="var(--color-value)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="hour"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          fontSize={11}
          ticks={[areaData[0].hour, areaData[areaData.length - 1].hour]}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={28}
          allowDecimals={false}
          tickMargin={4}
          fontSize={11}
          ticks={[0, Math.max(...areaData.map((d) => d.value))]}
        />
        <ChartTooltip
          cursor={{ strokeDasharray: "3 3" }}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Area
          dataKey="value"
          type="monotone"
          fill="url(#sg-fill-value)"
          stroke="var(--color-value)"
          strokeWidth={1.5}
        />
      </AreaChart>
    </ChartContainer>
  );
}

const barConfig = {
  value: { label: "Texts", color: "var(--chart-1)" },
} satisfies ChartConfig;

const barData = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 58 },
  { day: "Wed", value: 31 },
  { day: "Thu", value: 67 },
  { day: "Fri", value: 49 },
  { day: "Sat", value: 18 },
  { day: "Sun", value: 12 },
];

/** Small single-series bar chart in chart-1. */
export function BarChartDemo() {
  return (
    <ChartContainer config={barConfig} className="aspect-auto h-[200px] w-full">
      <BarChart data={barData} margin={{ left: 4, right: 12, top: 8, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="day"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
          fontSize={11}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={28}
          allowDecimals={false}
          tickMargin={4}
          fontSize={11}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent indicator="dot" />}
        />
        <Bar dataKey="value" fill="var(--color-value)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ChartContainer>
  );
}
