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

/** Sticky in-page nav — the Settings "hub + vertical sub-nav" archetype, with scroll-spy. */
export function SideNav() {
  const [active, setActive] = React.useState<string>(SECTIONS[0].id);

  React.useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-25% 0px -65% 0px" },
    );
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    }
    return () => obs.disconnect();
  }, []);

  return (
    <nav className="sticky top-24 hidden self-start lg:block">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Contents
      </p>
      <ul className="space-y-0.5 border-l border-border">
        {SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              className={cn(
                "-ml-px block border-l-2 px-3 py-1 text-sm transition-colors",
                active === s.id
                  ? "border-brand font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {s.label}
            </a>
          </li>
        ))}
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
    <div className="space-y-3">
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
