import { Check, CheckCircle2, Inbox, Plus, Settings, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { FilterPill } from "@/components/ui/filter-pill";
import { StatusDot } from "@/components/ui/status-dot";
import { Gauge } from "@/components/ui/gauge";
import { ActivityGrid } from "@/components/ui/activity-grid";
import { GradientAvatar } from "@/components/ui/gradient-avatar";

import { StatusPill } from "@/components/status-pill";
import { PageHeader } from "@/components/page-header";
import { MetricStat } from "@/components/metric-stat";
import { StatCard } from "@/components/stat-card";
import { EmptyState } from "@/components/empty-state";
import { HeroSection } from "@/components/hero-section";
import { CenteredFocal } from "@/components/centered-focal";
import { SplitWithRail } from "@/components/split-with-rail";
import { TimelineRail } from "@/components/timeline-rail";
import { DetailHeader } from "@/components/detail-header";
import { Section as PanelSection } from "@/components/section";
import { EventTimeline } from "@/components/event-timeline";

import { animalName } from "@/lib/identity";

import {
  Section,
  Specimen,
  Swatch,
  SegmentedDemo,
  SideNav,
  SelectDemo,
  CheckboxDemo,
  SwitchDemo,
  RadioGroupDemo,
  TooltipDemo,
  PopoverDemo,
  DropdownMenuDemo,
  DialogDemo,
  HoverCardDemo,
  ToastDemo,
  AreaChartDemo,
  BarChartDemo,
} from "@/app/_styleguide/sections";
import { VsComparison } from "@/app/_styleguide/comparisons";
import { SiteHeader } from "@/app/_styleguide/site-header";

const avatarSeeds = ["abc", "def", "ghi", "jkl"];
const activityData = Array.from({ length: 78 }, (_, i) => (i * 7) % 5);

function HeroPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
      {children}
    </span>
  );
}

/** Staggered page-load reveal wrapper. */
function Reveal({ delay, children }: { delay: number; children: React.ReactNode }) {
  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-3 duration-700"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      {children}
    </div>
  );
}

export default function StyleguidePage() {
  return (
    <div className="relative min-h-dvh overflow-x-clip bg-background text-foreground">
      {/* Faint dotted-grid atmosphere (calm, not loud) */}
      <div className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.35]" />

      <SiteHeader />

      <div className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <Reveal delay={0}>
          <header className="py-16 text-center">
            <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
              byronwade/ui
            </p>
            <h1 className="mt-3 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
              Design system
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              The tokens, primitives, and layout archetypes that compose every surface — the
              Visitors aesthetic, built around one warm-green accent.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <HeroPill>Visitors aesthetic</HeroPill>
              <HeroPill>Geist</HeroPill>
              <HeroPill>
                <span className="size-1.5 rounded-full bg-brand" />
                Single green accent
              </HeroPill>
            </div>
          </header>
        </Reveal>

        {/* Body: hub + vertical sub-nav archetype */}
        <div className="grid gap-12 pb-28 lg:grid-cols-[220px_minmax(0,1fr)]">
          <SideNav />

          <main className="min-w-0 space-y-20">
            {/* Philosophy */}
            <Reveal delay={60}>
              <Section
                id="philosophy"
                title="Philosophy"
                description="Why every surface looks the way it does — the thinking the rest of this page applies."
                count={3}
              >
                <Specimen name="Calm over chrome" plain>
                  <div className="space-y-4">
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      The product should feel quiet. One warm-green accent does all the
                      emphasizing; everything else is near-black ink on white with gray for
                      the muted. Whitespace is a material — pages are centered and given room
                      to breathe. We reach for a hairline{" "}
                      <code className="font-mono text-[12px] text-foreground">--border</code>{" "}
                      before a shadow, and when a shadow appears it&apos;s soft enough to
                      almost miss. Restraint is the point: when only one thing is colored, that
                      one thing means something.
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1.5">
                        {Array.from({ length: 6 }, (_, i) => (
                          <span
                            key={i}
                            className={`size-2.5 rounded-full ${i === 2 ? "bg-brand" : "bg-muted"}`}
                          />
                        ))}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        one accent among the neutrals
                      </span>
                    </div>
                  </div>
                </Specimen>

                <Specimen name="No generic grids — one signature hero per page" plain>
                  <div className="space-y-4">
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      Consistency comes from shared materials and constant chrome, never from a
                      repeated page template. The thing to avoid is the uniform multi-column
                      card grid. Every page earns a distinctive centerpiece — pick{" "}
                      <span className="text-foreground">one signature hero</span> and compose
                      everything else around it. Secondary content may use cards, but cards are
                      never a page&apos;s primary identity. The kit below exists precisely so
                      each page can look unique without looking random.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "Hero-chart",
                        "Gauge",
                        "Split + rail",
                        "Map / geo",
                        "Rich inventory",
                        "Centered tool",
                        "Hub + sub-nav",
                        "Cockpit",
                      ].map((a) => (
                        <span
                          key={a}
                          className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                </Specimen>

                <Specimen name="Constant chrome, bespoke body" plain>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    The shell never moves. A light top bar (brand mark + org switcher, user
                    avatar) and a dark floating dock — the primary nav — are identical on every
                    surface; only the body changes. That fixed frame is what lets each page be a
                    bespoke composition without the product feeling disjointed. There is exactly
                    one deliberate exception to the calm-and-light rules: the{" "}
                    <span className="text-foreground">Messages cockpit</span>, a dark, dense,
                    two-pane surface that trades the airy spacing for an inbox built for speed —
                    still on our single green accent.
                  </p>
                </Specimen>
              </Section>
            </Reveal>

            {/* Principles */}
            <Reveal delay={80}>
              <Section
                id="principles"
                title="Principles"
                description="The rules behind every surface — read these before composing anything new."
                count={5}
              >
                <Specimen name="Single-accent rule" plain>
                  <div className="space-y-4">
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      One warm green (<code className="font-mono text-[12px] text-foreground">--brand</code>)
                      carries all emphasis — links, primary actions, the lone chart series. Chart
                      series beyond the first step down a grayscale ramp
                      (<code className="font-mono text-[12px] text-foreground">--chart-2…5</code>), never a
                      rainbow. The single multi-hue exception is identity avatars, where color encodes
                      a person.
                    </p>
                    <div className="flex flex-wrap items-center gap-5">
                      <div className="flex items-center gap-2">
                        <span className="size-4 rounded-full bg-chart-1" />
                        <span className="font-mono text-[11px] text-muted-foreground">--chart-1 · the green</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-4 rounded-full bg-chart-2" />
                        <span className="size-4 rounded-full bg-chart-3" />
                        <span className="size-4 rounded-full bg-chart-4" />
                        <span className="size-4 rounded-full bg-chart-5" />
                        <span className="ml-1 font-mono text-[11px] text-muted-foreground">--chart-2…5 · grayscale</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex -space-x-1.5">
                          <GradientAvatar seed="abc" size="sm" />
                          <GradientAvatar seed="def" size="sm" />
                          <GradientAvatar seed="ghi" size="sm" />
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">identity · the exception</span>
                      </div>
                    </div>
                  </div>
                </Specimen>

                <Specimen name="Status convention" plain>
                  <div className="space-y-4">
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      Status reads from a small colored dot, not colored text. Keep labels in
                      foreground ink so the meaning is the dot, legible in either theme.
                    </p>
                    <div className="flex flex-wrap items-center gap-6 text-sm">
                      <span className="flex items-center gap-2">
                        <StatusDot tone="success" />
                        Delivered
                      </span>
                      <span className="flex items-center gap-2">
                        <StatusDot tone="warning" />
                        Pending
                      </span>
                      <span className="flex items-center gap-2">
                        <StatusDot tone="danger" />
                        Failed
                      </span>
                    </div>
                  </div>
                </Specimen>

                <Specimen name="Do / Don't" plain>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-3 rounded-xl border border-border bg-background p-5">
                      {[
                        "Generic uniform card grid",
                        "Hardcoded hex / oklch values",
                        "Rainbow chart series",
                        "Heavy drop shadows",
                      ].map((t) => (
                        <div key={t} className="flex items-start gap-2 text-sm">
                          <X className="mt-0.5 size-4 shrink-0 text-destructive" />
                          <span className="text-muted-foreground">{t}</span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3 rounded-xl border border-border bg-background p-5">
                      {[
                        "One signature hero per page",
                        "CSS tokens only",
                        "Green + grayscale ramp",
                        "Hairline --border separators",
                      ].map((t) => (
                        <div key={t} className="flex items-start gap-2 text-sm">
                          <Check className="mt-0.5 size-4 shrink-0 text-success" />
                          <span>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Specimen>

                <Specimen name="Spacing & radius" plain>
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <p className="text-sm">
                        Radius base{" "}
                        <code className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[12px] text-foreground">
                          --radius: 0.75rem
                        </code>
                        , scaled up for cards and down for chips.
                      </p>
                      <div className="flex flex-wrap items-end gap-5">
                        {["rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl"].map((r) => (
                          <div key={r} className="flex flex-col items-center gap-2">
                            <div className={`size-12 border border-border bg-muted ${r}`} />
                            <span className="font-mono text-[11px] text-muted-foreground">{r}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm">Spacing scale</p>
                      <div className="flex flex-wrap items-end gap-6">
                        {[
                          ["gap-1", "h-1"],
                          ["gap-2", "h-2"],
                          ["gap-4", "h-4"],
                          ["gap-6", "h-6"],
                          ["gap-8", "h-8"],
                        ].map(([name, h]) => (
                          <div key={name} className="flex flex-col items-center gap-2">
                            <span className={`w-10 rounded-md bg-brand/20 ${h}`} />
                            <span className="font-mono text-[11px] text-muted-foreground">{name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Specimen>
              </Section>
            </Reveal>

            {/* Foundations */}
            <Reveal delay={160}>
              <Section
                id="foundations"
                title="Foundations"
                description="Color, radius, elevation, and type — the raw material everything is built from."
                count={5}
              >
                <Specimen name="Color" from="app/globals.css" plain>
                  <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                    <Swatch name="--brand" className="bg-brand" role="The one accent" />
                    <Swatch name="--success" className="bg-success" role="Good · = brand" />
                    <Swatch name="--warning" className="bg-warning" role="Needs work" />
                    <Swatch name="--destructive" className="bg-destructive" role="Poor / danger" />
                    <Swatch name="--foreground" className="bg-foreground" role="Text" />
                    <Swatch name="--muted-foreground" className="bg-muted-foreground" role="Secondary text" />
                    <Swatch name="--background" className="bg-background" role="Page" />
                    <Swatch name="--card" className="bg-card" role="Surfaces" />
                    <Swatch name="--muted" className="bg-muted" role="Fills" />
                    <Swatch name="--primary" className="bg-primary" role="Solid buttons" />
                    <Swatch name="--border" className="border-2 bg-transparent" role="Hairlines" />
                    <Swatch name="--dock" className="bg-dock" role="Floating dock" />
                    <Swatch name="--accent" className="bg-accent" role="Hover fills" />
                    <Swatch name="--sidebar" className="bg-sidebar" role="Sidebar surface" />
                    <Swatch name="--chart-1" className="bg-chart-1" role="Chart · the green" />
                    <Swatch name="--chart-2" className="bg-chart-2" role="Grayscale series" />
                    <Swatch name="--chart-3" className="bg-chart-3" role="Grayscale series" />
                    <Swatch name="--chart-4" className="bg-chart-4" role="Grayscale series" />
                    <Swatch name="--chart-5" className="bg-chart-5" role="Grayscale series" />
                  </div>
                </Specimen>

                <Specimen name="Radius" from="--radius-*" plain>
                  <div className="flex flex-wrap items-end gap-5">
                    {["rounded-lg", "rounded-xl", "rounded-2xl", "rounded-3xl", "rounded-4xl"].map(
                      (r) => (
                        <div key={r} className="flex flex-col items-center gap-2">
                          <div className={`size-14 border border-border bg-muted ${r}`} />
                          <span className="font-mono text-[11px] text-muted-foreground">{r}</span>
                        </div>
                      ),
                    )}
                  </div>
                </Specimen>

                <Specimen name="Elevation" from=".shadow-*">
                  <div className="flex flex-wrap gap-8">
                    {[
                      ["shadow-card", "cards"],
                      ["shadow-float", "dock · popovers"],
                    ].map(([s, role]) => (
                      <div key={s} className="flex flex-col items-center gap-2">
                        <div className={`size-16 rounded-2xl border border-border bg-card ${s}`} />
                        <div className="text-center">
                          <p className="font-mono text-[11px] text-foreground">{s}</p>
                          <p className="text-[11px] text-muted-foreground">{role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Specimen>

                <Specimen name="Typography" from="Geist · font-sans / font-mono" plain>
                  <div className="space-y-3">
                    <p className="font-heading text-4xl font-semibold tracking-tight">
                      The quick brown fox
                    </p>
                    <p className="font-heading text-xl font-semibold tracking-tight">
                      Section heading · xl semibold
                    </p>
                    <p className="text-sm">
                      Body copy · sm — calm, readable, generous line height for long-form settings
                      and descriptions.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Muted · sm — captions, hints, and secondary metadata.
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      Mono · 12px — values, IDs, and code (e.g. +1 555 010 2048).
                    </p>
                  </div>
                </Specimen>

                <Specimen name="Utilities" from="app/globals.css" plain>
                  <div className="space-y-6">
                    <h3 className="text-gradient-brand font-heading text-3xl font-semibold tracking-tight">
                      Built on one warm-green accent
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <div className="relative h-24 overflow-hidden rounded-xl border border-border bg-card">
                          <div className="glow-brand absolute inset-0" />
                        </div>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          .glow-brand
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="bg-grid h-24 rounded-xl border border-border bg-card" />
                        <p className="font-mono text-[11px] text-muted-foreground">
                          .bg-grid
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="mask-fade-x flex h-24 items-center gap-2 overflow-hidden rounded-xl border border-border bg-card px-3">
                          {Array.from({ length: 8 }, (_, i) => (
                            <span
                              key={i}
                              className="inline-flex shrink-0 items-center rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                            >
                              +1 (555) 010-{2040 + i}
                            </span>
                          ))}
                        </div>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          .mask-fade-x
                        </p>
                      </div>
                    </div>
                  </div>
                </Specimen>
              </Section>
            </Reveal>

            {/* Primitives */}
            <Reveal delay={240}>
              <Section
                id="primitives"
                title="Primitives"
                description="The base controls — every one a pill, token-driven, light & dark safe."
                count={8}
              >
                <Specimen name="Button — variants" from="@/components/ui/button">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button>Default</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </Specimen>

                <Specimen name="Button — sizes" from="@/components/ui/button">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="xs">Extra small</Button>
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon" aria-label="Add">
                      <Plus />
                    </Button>
                  </div>
                </Specimen>

                <Specimen name="Badge" from="@/components/ui/badge">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge>Default</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="ghost">Ghost</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                  </div>
                </Specimen>

                <Specimen name="FilterPill" from="@/components/ui/filter-pill">
                  <div className="flex flex-wrap items-center gap-2">
                    <FilterPill>Today</FilterPill>
                    <FilterPill>7 days</FilterPill>
                    <FilterPill>All numbers</FilterPill>
                  </div>
                </Specimen>

                <Specimen name="SegmentedControl" from="@/components/ui/segmented-control">
                  <SegmentedDemo />
                </Specimen>

                <Specimen name="StatusDot" from="@/components/ui/status-dot">
                  <div className="flex flex-wrap items-center gap-5">
                    <StatusDot tone="success" />
                    <StatusDot tone="warning" />
                    <StatusDot tone="danger" />
                    <StatusDot tone="info" />
                    <StatusDot tone="neutral" />
                    <StatusDot tone="success" pulse />
                  </div>
                </Specimen>

                <Specimen name="StatusPill" from="@/components/status-pill">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusPill tone="success">Active</StatusPill>
                    <StatusPill tone="warning">Pending</StatusPill>
                    <StatusPill tone="danger">Failed</StatusPill>
                    <StatusPill tone="info">Provisioning</StatusPill>
                    <StatusPill tone="neutral">Draft</StatusPill>
                  </div>
                </Specimen>

                <Specimen name="Card" from="@/components/ui/card" plain>
                  <Card className="max-w-sm">
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
                </Specimen>
              </Section>
            </Reveal>

            {/* Forms */}
            <Reveal delay={320}>
              <Section
                id="forms"
                title="Forms"
                description="Inputs and controls — labeled fields, token-driven, light & dark safe."
                count={7}
              >
                <Specimen name="Input" from="@/components/ui/input">
                  <div className="max-w-sm space-y-1.5">
                    <Label htmlFor="sg-display-name">Display name</Label>
                    <Input id="sg-display-name" placeholder="Acme Support" />
                  </div>
                </Specimen>

                <Specimen name="Textarea" from="@/components/ui/textarea">
                  <div className="max-w-sm space-y-1.5">
                    <Label htmlFor="sg-greeting">Voicemail greeting</Label>
                    <Textarea
                      id="sg-greeting"
                      placeholder="You've reached Acme. Leave a message…"
                    />
                  </div>
                </Specimen>

                <Specimen name="Select" from="@/components/ui/select">
                  <div className="max-w-sm space-y-1.5">
                    <Label htmlFor="capability">Capability</Label>
                    <SelectDemo />
                  </div>
                </Specimen>

                <Specimen name="Checkbox" from="@/components/ui/checkbox">
                  <CheckboxDemo />
                </Specimen>

                <Specimen name="Switch" from="@/components/ui/switch">
                  <SwitchDemo />
                </Specimen>

                <Specimen name="RadioGroup" from="@/components/ui/radio-group">
                  <RadioGroupDemo />
                </Specimen>

                <Specimen name="Label" from="@/components/ui/label">
                  <Label htmlFor="sg-label-only">Number label</Label>
                </Specimen>
              </Section>
            </Reveal>

            {/* Overlays */}
            <Reveal delay={400}>
              <Section
                id="overlays"
                title="Overlays"
                description="Floating surfaces — triggers open content via the render prop. Dark over light by design."
                count={5}
              >
                <Specimen name="Tooltip" from="@/components/ui/tooltip">
                  <TooltipDemo />
                </Specimen>

                <Specimen name="Popover" from="@/components/ui/popover">
                  <PopoverDemo />
                </Specimen>

                <Specimen name="DropdownMenu" from="@/components/ui/dropdown-menu">
                  <DropdownMenuDemo />
                </Specimen>

                <Specimen name="Dialog" from="@/components/ui/dialog">
                  <DialogDemo />
                </Specimen>

                <Specimen name="HoverCard" from="@/components/ui/hover-card">
                  <HoverCardDemo />
                </Specimen>
              </Section>
            </Reveal>

            {/* Feedback */}
            <Reveal delay={480}>
              <Section
                id="feedback"
                title="Feedback"
                description="Status, progress, and loading — how a surface tells you what's happening."
                count={4}
              >
                <Specimen name="Alert" from="@/components/ui/alert">
                  <div className="space-y-3">
                    <Alert>
                      <CheckCircle2 />
                      <AlertTitle>Number verified</AlertTitle>
                      <AlertDescription>
                        Outbound calls now show your business caller ID.
                      </AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                      <AlertTitle>Carrier registration required</AlertTitle>
                      <AlertDescription>
                        Texting is paused until your brand is approved.
                      </AlertDescription>
                    </Alert>
                  </div>
                </Specimen>

                <Specimen name="Progress" from="@/components/ui/progress">
                  <Progress value={68} className="max-w-sm">
                    <ProgressLabel>Monthly quota</ProgressLabel>
                    <ProgressValue />
                  </Progress>
                </Specimen>

                <Specimen name="Skeleton" from="@/components/ui/skeleton">
                  <div className="flex max-w-sm items-center gap-3">
                    <Skeleton className="size-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3.5 w-2/3" />
                      <Skeleton className="h-3 w-1/3" />
                    </div>
                  </div>
                </Specimen>

                <Specimen name="Toast" from="sonner">
                  <ToastDemo />
                </Specimen>
              </Section>
            </Reveal>

            {/* Data display */}
            <Reveal delay={560}>
              <Section
                id="data"
                title="Data display"
                description="Reading surfaces — how records, structure, and identity are presented."
                count={6}
              >
                <Specimen name="Tabs" from="@/components/ui/tabs">
                  <Tabs defaultValue="calls">
                    <TabsList>
                      <TabsTrigger value="calls">Calls</TabsTrigger>
                      <TabsTrigger value="texts">Texts</TabsTrigger>
                      <TabsTrigger value="voicemail">Voicemail</TabsTrigger>
                    </TabsList>
                    <TabsContent value="calls" className="pt-3 text-muted-foreground">
                      42 calls this week, averaging 2m 41s.
                    </TabsContent>
                    <TabsContent value="texts" className="pt-3 text-muted-foreground">
                      118 texts delivered, 2 pending.
                    </TabsContent>
                    <TabsContent
                      value="voicemail"
                      className="pt-3 text-muted-foreground"
                    >
                      3 new voicemails to review.
                    </TabsContent>
                  </Tabs>
                </Specimen>

                <Specimen name="Accordion" from="@/components/ui/accordion">
                  <Accordion className="max-w-md">
                    <AccordionItem value="route">
                      <AccordionTrigger>How are calls routed?</AccordionTrigger>
                      <AccordionContent>
                        Inbound calls ring your number, then fall back to the AI
                        agent or voicemail based on your rules.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="verify">
                      <AccordionTrigger>What is verification?</AccordionTrigger>
                      <AccordionContent>
                        Carrier verification confirms your business so calls show a
                        trusted caller ID instead of &ldquo;Spam Likely&rdquo;.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </Specimen>

                <Specimen name="Avatar" from="@/components/ui/avatar">
                  <div className="flex items-center gap-4">
                    <Avatar size="sm">
                      <AvatarFallback>PG</AvatarFallback>
                    </Avatar>
                    <Avatar>
                      <AvatarFallback>OT</AvatarFallback>
                    </Avatar>
                    <Avatar size="lg">
                      <AvatarFallback>FX</AvatarFallback>
                    </Avatar>
                  </div>
                </Specimen>

                <Specimen name="Separator" from="@/components/ui/separator">
                  <div className="flex h-5 items-center gap-3 text-sm text-muted-foreground">
                    <span>Calls</span>
                    <Separator orientation="vertical" />
                    <span>Texts</span>
                    <Separator orientation="vertical" />
                    <span>Voicemail</span>
                  </div>
                </Specimen>

                <Specimen name="Breadcrumb" from="@/components/ui/breadcrumb">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Numbers</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">+1 (555) 010-2048</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbPage>Settings</BreadcrumbPage>
                      </BreadcrumbItem>
                    </BreadcrumbList>
                  </Breadcrumb>
                </Specimen>

                <Specimen name="Table" from="@/components/ui/table">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Number</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right tabular-nums">
                          Calls
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-mono">+1 (555) 010-2048</TableCell>
                        <TableCell>
                          <Badge variant="success">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">42</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-mono">+1 (555) 010-7720</TableCell>
                        <TableCell>
                          <Badge variant="warning">Pending</Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">0</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Specimen>
              </Section>
            </Reveal>

            {/* Patterns */}
            <Reveal delay={640}>
              <Section
                id="patterns"
                title="Patterns"
                description="Composed pieces — the recurring building blocks of a page."
                count={7}
              >
                <Specimen name="PageHeader" from="@/components/page-header" plain>
                  <div className="space-y-8">
                    <PageHeader title="People" description="8 people this week" align="center" />
                    <div className="border-t border-border pt-8">
                      <PageHeader title="Numbers" description="3 active numbers" align="start">
                        <Button size="sm">
                          <Plus />
                          Add number
                        </Button>
                      </PageHeader>
                    </div>
                  </div>
                </Specimen>

                <Specimen name="MetricStat" from="@/components/metric-stat">
                  <div className="flex flex-wrap gap-12">
                    <MetricStat label="Delivered" value="1,204" delta={{ value: "+100%", direction: "up" }} />
                    <MetricStat label="Bounced" value="48" delta={{ value: "-12%", direction: "down" }} />
                    <MetricStat label="Queued" value="320" delta={{ value: "0%", direction: "flat" }} />
                  </div>
                </Specimen>

                <Specimen name="StatCard" from="@/components/stat-card" plain>
                  <StatCard
                    label="Total spend"
                    value="$842.10"
                    hint="Across 3 numbers"
                    delta={{ value: "+8%", direction: "up" }}
                    className="max-w-xs"
                  />
                </Specimen>

                <Specimen name="Gauge" from="@/components/ui/gauge">
                  <div className="flex flex-wrap items-center gap-8">
                    <Gauge value={32} label="Poor" />
                    <Gauge value={67} label="Needs work" />
                    <Gauge value={94} label="Great" />
                  </div>
                </Specimen>

                <Specimen name="ActivityGrid" from="@/components/ui/activity-grid">
                  <ActivityGrid data={activityData} />
                </Specimen>

                <Specimen name="GradientAvatar + animalName" from="@/components/ui/gradient-avatar">
                  <div className="flex flex-wrap gap-8">
                    {avatarSeeds.map((seed) => (
                      <div key={seed} className="flex flex-col items-center gap-2">
                        <GradientAvatar seed={seed} size="lg" />
                        <span className="text-xs text-muted-foreground">{animalName(seed)}</span>
                      </div>
                    ))}
                  </div>
                </Specimen>

                <Specimen name="EmptyState" from="@/components/empty-state" plain>
                  <EmptyState
                    icon={Inbox}
                    title="No messages yet"
                    description="Texts and calls to this number will show up here."
                    action={
                      <Button size="sm">
                        <Plus />
                        New message
                      </Button>
                    }
                  />
                </Specimen>
              </Section>
            </Reveal>

            {/* Charts */}
            <Reveal delay={720}>
              <Section
                id="charts"
                title="Charts"
                description="One green series, soft gradient fade, faint gridlines, endpoint labels only — never a rainbow."
                count={2}
              >
                <Specimen name="Area chart" from="@/components/ui/chart" plain>
                  <div className="rounded-xl border border-border bg-background p-6">
                    <AreaChartDemo />
                  </div>
                </Specimen>

                <Specimen name="Bar chart" from="@/components/ui/chart" plain>
                  <div className="rounded-xl border border-border bg-background p-6">
                    <BarChartDemo />
                  </div>
                </Specimen>
              </Section>
            </Reveal>

            {/* House components */}
            <Reveal delay={800}>
              <Section
                id="house"
                title="House components"
                description="Composed dashboard pieces — detail headers, settings panels, and event timelines."
                count={3}
              >
                <Specimen name="DetailHeader" from="@/components/detail-header" plain>
                  <div className="rounded-xl border border-border bg-background p-6">
                    <DetailHeader
                      title="+1 (555) 010-2048"
                      badge={<StatusPill tone="success">Active</StatusPill>}
                      actions={
                        <Button variant="outline" size="sm">
                          <Settings />
                          Settings
                        </Button>
                      }
                      meta={[
                        { label: "Capability", value: "Voice & SMS" },
                        { label: "Region", value: "US · California" },
                        { label: "Provisioned", value: "Mar 14, 2026" },
                        { label: "Monthly", value: "$1.15" },
                      ]}
                    />
                  </div>
                </Specimen>

                <Specimen name="Section (settings panel)" from="@/components/section" plain>
                  <PanelSection
                    title="Caller ID"
                    description="The name shown to people you call from this number."
                    action={
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    }
                  >
                    <div className="px-5 py-5">
                      <p className="text-sm">Acme Support</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Verified caller ID, shown on outbound calls.
                      </p>
                    </div>
                  </PanelSection>
                </Specimen>

                <Specimen name="EventTimeline" from="@/components/event-timeline" plain>
                  <div className="rounded-xl border border-border bg-background p-6">
                    <EventTimeline
                      events={[
                        {
                          tone: "success",
                          title: "Number verified",
                          description: "Carrier registration approved.",
                          timestamp: "Today · 9:42 AM",
                        },
                        {
                          tone: "info",
                          title: "Brand submitted",
                          description: "Awaiting carrier review.",
                          timestamp: "Mar 14 · 4:18 PM",
                        },
                        {
                          tone: "warning",
                          title: "Action needed",
                          description: "Business address could not be matched.",
                          timestamp: "Mar 12 · 11:02 AM",
                        },
                        {
                          tone: "neutral",
                          title: "Number provisioned",
                          timestamp: "Mar 11 · 8:30 AM",
                        },
                      ]}
                    />
                  </div>
                </Specimen>
              </Section>
            </Reveal>

            {/* Layouts */}
            <Reveal delay={880}>
              <Section
                id="layouts"
                title="Layout archetypes"
                description="Composition shells — every page picks one signature hero, never a generic card grid."
                count={3}
              >
                <Specimen name="HeroSection" from="@/components/hero-section" plain>
                  <div className="relative overflow-hidden rounded-xl border border-border bg-background pt-6">
                    <div className="px-6">
                      <HeroSection
                        header={
                          <>
                            <MetricStat label="Calls" value="3,201" delta={{ value: "+14%", direction: "up" }} />
                            <MetricStat label="Avg duration" value="2m 41s" />
                          </>
                        }
                      >
                        <div className="h-40 bg-gradient-to-b from-brand/20 to-transparent" />
                      </HeroSection>
                    </div>
                  </div>
                </Specimen>

                <Specimen name="CenteredFocal" from="@/components/centered-focal" plain>
                  <div className="overflow-hidden rounded-xl border border-border bg-background">
                    <CenteredFocal className="min-h-[20rem]">
                      <h3 className="text-base font-semibold">Waiting for events</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Nothing has come through yet. Send a test to get started.
                      </p>
                      <Button className="mt-5" size="sm">
                        Send a test
                      </Button>
                    </CenteredFocal>
                  </div>
                </Specimen>

                <Specimen name="SplitWithRail + TimelineRail" from="@/components/split-with-rail" plain>
                  <SplitWithRail
                    summary={
                      <div className="space-y-5">
                        <div className="flex items-center gap-3">
                          <GradientAvatar seed="abc" size="xl" />
                          <div>
                            <p className="font-semibold">{animalName("abc")}</p>
                            <p className="font-mono text-sm text-muted-foreground">+1 (555) 010-2048</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <MetricStat label="Calls" value="42" />
                          <MetricStat label="Texts" value="118" />
                        </div>
                      </div>
                    }
                    rail={
                      <TimelineRail
                        groups={[
                          {
                            label: "Today",
                            items: [
                              { tone: "success", title: "Inbound call answered", meta: "1m 8s" },
                              { tone: "info", title: "Text received", meta: "12s" },
                            ],
                          },
                          {
                            label: "Yesterday",
                            items: [
                              { tone: "warning", title: "Missed call", meta: "0s" },
                              { tone: "neutral", title: "Voicemail left", meta: "44s" },
                            ],
                          },
                        ]}
                      />
                    }
                  />
                </Specimen>
              </Section>
            </Reveal>

            {/* Side by side */}
            <Reveal delay={960}>
              <Section
                id="comparison"
                title="Side by side"
                description="The same twelve components — ours on the left, a design system you know on the right. Toggle between Vercel, Linear, 0.email, Shopify, Stripe, GitHub, Atlassian, Radix, Mailchimp, and Apple — and flip our side light or dark."
                count={12}
              >
                <VsComparison />
              </Section>
            </Reveal>
          </main>
        </div>
      </div>
    </div>
  );
}
