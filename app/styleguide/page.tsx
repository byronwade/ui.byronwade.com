import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  Check,
  CheckCircle2,
  FileTextIcon,
  Inbox,
  ItalicIcon,
  Plus,
  SearchIcon,
  Settings,
  UnderlineIcon,
  X,
} from "lucide-react"

import Link from "next/link"

import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { FilterPill } from "@/components/ui/filter-pill"
import { StatusDot } from "@/components/ui/status-dot"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"
import { ActivityRing } from "@/components/ui/activity-ring"
import { ActivityGrid } from "@/components/ui/activity-grid"
import { GradientAvatar } from "@/components/ui/gradient-avatar"

import { StatusPill } from "@/components/status-pill"
import { PageHeader } from "@/components/page-header"
import { MetricStat } from "@/components/metric-stat"
import { StatCard } from "@/components/stat-card"
import { EmptyState } from "@/components/empty-state"
import { HeroSection } from "@/components/hero-section"
import { CenteredFocal } from "@/components/centered-focal"
import { SplitWithRail } from "@/components/split-with-rail"
import { TimelineRail } from "@/components/timeline-rail"
import { DetailHeader } from "@/components/detail-header"
import { Section as PanelSection } from "@/components/section"
import { EventTimeline } from "@/components/event-timeline"
import { VerificationProgress } from "@/components/verification-progress"

import { animalName } from "@/lib/identity"

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
  SheetDemo,
  CommandDemo,
  NavigationMenuDemo,
} from "@/app/_styleguide/sections"
import { VsComparison } from "@/app/_styleguide/comparisons"

const avatarSeeds = ["abc", "def", "ghi", "jkl"]
const activityData = Array.from({ length: 78 }, (_, i) => (i * 7) % 5)

function HeroPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full edge px-2.5 py-0.5 text-xs text-muted-foreground">
      {children}
    </span>
  )
}

/** Staggered page-load reveal wrapper. */
function Reveal({
  delay,
  children,
}: {
  delay: number
  children: React.ReactNode
}) {
  return (
    <div
      className="animate-in fade-in slide-in-from-bottom-3 duration-700"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      {children}
    </div>
  )
}

export default function StyleguidePage() {
  return (
    <div className="relative min-h-dvh overflow-x-clip bg-background text-foreground">
      {/* Faint dotted-grid atmosphere (calm, not loud) */}
      <div className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-[0.35]" />

      {/* Top clearance for the centered floating nav dock (mounted globally). */}
      <div className="mx-auto max-w-6xl px-6 pt-16">
        {/* Hero */}
        <Reveal delay={0}>
          <header className="py-16 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
              byronwade/ui
            </p>
            <h1 className="mt-3 text-[clamp(2rem,5vw,3.25rem)] font-normal tracking-tight text-balance text-foreground">
              Design system
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
              The tokens, primitives, and layout archetypes that compose every
              surface, a calm, content-first aesthetic built around one brand
              accent.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <HeroPill>Calm &amp; content-first</HeroPill>
              <HeroPill>Geist</HeroPill>
              <HeroPill>
                <span className="size-1.5 rounded-full bg-brand" />
                Single green accent
              </HeroPill>
            </div>
          </header>
        </Reveal>

        {/* Body: hub + vertical sub-nav archetype */}
        <div className="grid gap-12 pb-28 lg:grid-cols-[240px_minmax(0,1fr)]">
          <SideNav />

          <main className="min-w-0 space-y-20">
            {/* Philosophy */}
            <Reveal delay={60}>
              <Section
                id="philosophy"
                title="Philosophy"
                description="Why every surface looks the way it does, the thinking the rest of this page applies."
              >
                <Specimen name="Calm over chrome" plain>
                  <div className="space-y-4">
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      The product should feel quiet. One brand accent does all
                      the emphasizing; everything else comes from semantic
                      foreground, background, and muted tokens. Whitespace is a
                      material, pages are centered and given room to breathe. We
                      reach for the inset{" "}
                      <code className="font-mono text-[12px] text-foreground">
                        edge
                      </code>{" "}
                      hairline instead of a drop shadow or hard outline.
                      Restraint is the point: when only one thing is colored,
                      that one thing means something.
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

                <Specimen
                  name="No generic grids, one signature hero per page"
                  plain
                >
                  <div className="space-y-4">
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      Consistency comes from shared materials and constant
                      chrome, never from a repeated page template. The thing to
                      avoid is the uniform multi-column card grid. Every page
                      earns a distinctive centerpiece, pick{" "}
                      <span className="text-foreground">
                        one signature hero
                      </span>{" "}
                      and compose everything else around it. Secondary content
                      may use cards, but cards are never a page&apos;s primary
                      identity. The kit below exists precisely so each page can
                      look unique without looking random.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { label: "Hero-chart", href: "/layouts/hero-chart" },
                        { label: "Gauge", href: "/layouts/gauge" },
                        { label: "Split + rail", href: "/layouts/split-rail" },
                        { label: "Map / geo", href: "/layouts" },
                        {
                          label: "Rich inventory",
                          href: "/layouts/rich-inventory",
                        },
                        {
                          label: "Centered tool",
                          href: "/layouts/centered-tool",
                        },
                        { label: "Hub + sub-nav", href: "/layouts" },
                        { label: "Cockpit", href: "/layouts/cockpit" },
                      ].map((a) => (
                        <Link
                          key={a.label}
                          href={a.href}
                          className="inline-flex items-center rounded-full edge px-2.5 py-0.5 text-xs text-muted-foreground transition-colors hover:border-brand/40 hover:bg-brand/5 hover:text-foreground"
                        >
                          {a.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </Specimen>

                <Specimen name="Constant chrome, bespoke body" plain>
                  <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    The shell never moves. A light top bar (brand mark + org
                    switcher, user avatar) and a dark floating dock, the primary
                    nav, are identical on every surface; only the body changes.
                    That fixed frame is what lets each page be a bespoke
                    composition without the product feeling disjointed. There is
                    exactly one deliberate exception to the calm-and-light
                    rules: a{" "}
                    <span className="text-foreground">dark, dense surface</span>{" "}
                    (e.g. an inbox/cockpit), a two-pane layout that trades the
                    airy spacing for speed, still on our single green accent.
                  </p>
                </Specimen>
              </Section>
            </Reveal>

            {/* Principles */}
            <Reveal delay={80}>
              <Section
                id="principles"
                title="Principles"
                description="The rules behind every surface, read these before composing anything new."
              >
                <Specimen name="Single-accent rule" plain>
                  <div className="space-y-4">
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      One warm green (
                      <code className="font-mono text-[12px] text-foreground">
                        --brand
                      </code>
                      ) carries all emphasis, links, primary actions, the lone
                      chart series. Chart series beyond the first step down a
                      grayscale ramp (
                      <code className="font-mono text-[12px] text-foreground">
                        --chart-2…5
                      </code>
                      ), never a rainbow. The single multi-hue exception is
                      identity avatars, where color encodes a person.
                    </p>
                    <div className="flex flex-wrap items-center gap-5">
                      <div className="flex items-center gap-2">
                        <span className="size-4 rounded-full bg-chart-1" />
                        <span className="font-mono text-[11px] text-muted-foreground">
                          --chart-1 · the green
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-4 rounded-full bg-chart-2" />
                        <span className="size-4 rounded-full bg-chart-3" />
                        <span className="size-4 rounded-full bg-chart-4" />
                        <span className="size-4 rounded-full bg-chart-5" />
                        <span className="ml-1 font-mono text-[11px] text-muted-foreground">
                          --chart-2…5 · grayscale
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="flex -space-x-1.5">
                          <GradientAvatar seed="abc" size="sm" />
                          <GradientAvatar seed="def" size="sm" />
                          <GradientAvatar seed="ghi" size="sm" />
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          identity · the exception
                        </span>
                      </div>
                    </div>
                  </div>
                </Specimen>

                <Specimen name="Status convention" plain>
                  <div className="space-y-4">
                    <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                      Status reads from a small colored dot, not colored text.
                      Keep labels in foreground ink so the meaning is the dot,
                      legible in either theme.
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
                    <div className="edge space-y-3 rounded-xl bg-background p-5">
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
                    <div className="edge space-y-3 rounded-xl bg-background p-5">
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
                        {[
                          "rounded-lg",
                          "rounded-xl",
                          "rounded-2xl",
                          "rounded-3xl",
                        ].map((r) => (
                          <div
                            key={r}
                            className="flex flex-col items-center gap-2"
                          >
                            <div className={`size-12 edge bg-muted ${r}`} />
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {r}
                            </span>
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
                          <div
                            key={name}
                            className="flex flex-col items-center gap-2"
                          >
                            <span
                              className={`w-10 rounded-md bg-brand/20 ${h}`}
                            />
                            <span className="font-mono text-[11px] text-muted-foreground">
                              {name}
                            </span>
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
                description="Color, radius, elevation, and type, the raw material everything is built from."
              >
                <Specimen name="Color" from="app/globals.css" plain>
                  <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                    <Swatch
                      name="--brand"
                      className="bg-brand"
                      role="The one accent"
                    />
                    <Swatch
                      name="--success"
                      className="bg-success"
                      role="Good · = brand"
                    />
                    <Swatch
                      name="--warning"
                      className="bg-warning"
                      role="Needs work"
                    />
                    <Swatch
                      name="--destructive"
                      className="bg-destructive"
                      role="Poor / danger"
                    />
                    <Swatch
                      name="--foreground"
                      className="bg-foreground"
                      role="Text"
                    />
                    <Swatch
                      name="--muted-foreground"
                      className="bg-muted-foreground"
                      role="Secondary text"
                    />
                    <Swatch
                      name="--background"
                      className="bg-background"
                      role="Page"
                    />
                    <Swatch name="--card" className="bg-card" role="Surfaces" />
                    <Swatch name="--muted" className="bg-muted" role="Fills" />
                    <Swatch
                      name="--primary"
                      className="bg-primary"
                      role="Solid buttons"
                    />
                    <Swatch
                      name="--border"
                      className="border-2 bg-transparent"
                      role="Hairlines"
                    />
                    <Swatch
                      name="--dock"
                      className="bg-dock"
                      role="Floating dock"
                    />
                    <Swatch
                      name="--accent"
                      className="bg-accent"
                      role="Hover fills"
                    />
                    <Swatch
                      name="--sidebar"
                      className="bg-sidebar"
                      role="Sidebar surface"
                    />
                    <Swatch
                      name="--chart-1"
                      className="bg-chart-1"
                      role="Chart · the green"
                    />
                    <Swatch
                      name="--chart-2"
                      className="bg-chart-2"
                      role="Grayscale series"
                    />
                    <Swatch
                      name="--chart-3"
                      className="bg-chart-3"
                      role="Grayscale series"
                    />
                    <Swatch
                      name="--chart-4"
                      className="bg-chart-4"
                      role="Grayscale series"
                    />
                    <Swatch
                      name="--chart-5"
                      className="bg-chart-5"
                      role="Grayscale series"
                    />
                  </div>
                </Specimen>

                <Specimen name="Radius" from="--radius-*" plain>
                  <div className="flex flex-wrap items-end gap-5">
                    {[
                      "rounded-lg",
                      "rounded-xl",
                      "rounded-2xl",
                      "rounded-3xl",
                      "rounded-4xl",
                    ].map((r) => (
                      <div key={r} className="flex flex-col items-center gap-2">
                        <div className={`size-14 edge bg-muted ${r}`} />
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {r}
                        </span>
                      </div>
                    ))}
                  </div>
                </Specimen>

                <Specimen name="Depth" from=".edge">
                  <div className="flex flex-wrap gap-8">
                    {[
                      ["card-edge", "edge", "cards"],
                      ["overlay-edge", "edge", "dock · popovers"],
                    ].map(([key, s, role]) => (
                      <div
                        key={key}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className={`size-16 rounded-2xl bg-card ${s}`} />
                        <div className="text-center">
                          <p className="font-mono text-[11px] text-foreground">
                            {s}
                          </p>
                          <p className="text-[11px] text-muted-foreground">
                            {role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Specimen>

                <Specimen
                  name="Typography"
                  from="Geist · font-sans / font-mono"
                  plain
                >
                  <div className="space-y-3">
                    <p className="font-heading text-4xl font-semibold tracking-tight">
                      The quick brown fox
                    </p>
                    <p className="font-heading text-xl font-semibold tracking-tight">
                      Section heading · xl semibold
                    </p>
                    <p className="text-sm">
                      Body copy · sm, calm, readable, generous line height for
                      long-form settings and descriptions.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Muted · sm, captions, hints, and secondary metadata.
                    </p>
                    <p className="font-mono text-xs text-muted-foreground">
                      Mono · 12px, values, IDs, and code (e.g. usr_8f2a91c4).
                    </p>
                  </div>
                </Specimen>

                <Specimen name="Utilities" from="app/globals.css" plain>
                  <div className="space-y-6">
                    <h3 className="text-gradient-brand font-heading text-3xl font-medium tracking-tight">
                      Built on one brand accent
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="space-y-1.5">
                        <div className="edge relative h-24 overflow-hidden rounded-xl bg-card">
                          <div className="glow-brand absolute inset-0" />
                        </div>
                        <p className="font-mono text-[11px] text-muted-foreground">
                          .glow-brand
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="bg-grid edge h-24 rounded-xl bg-card" />
                        <p className="font-mono text-[11px] text-muted-foreground">
                          .bg-grid
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <div className="mask-fade-x edge flex h-24 items-center gap-2 overflow-hidden rounded-xl bg-card px-3">
                          {Array.from({ length: 8 }, (_, i) => (
                            <span
                              key={i}
                              className="inline-flex shrink-0 items-center rounded-full edge px-2.5 py-0.5 text-xs text-muted-foreground"
                            >
                              usr_{(2040 + i).toString(16)}
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
                description="The base controls, every one a pill, token-driven, light & dark safe."
              >
                <Specimen name="Button, variants" from="@/components/ui/button">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button>Default</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="link">Link</Button>
                  </div>
                </Specimen>

                <Specimen name="Button, sizes" from="@/components/ui/button">
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
                    <FilterPill>All projects</FilterPill>
                  </div>
                </Specimen>

                <Specimen
                  name="SegmentedControl"
                  from="@/components/ui/segmented-control"
                >
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
                    <StatusPill tone="info">In review</StatusPill>
                    <StatusPill tone="neutral">Draft</StatusPill>
                  </div>
                </Specimen>

                <Specimen name="Card" from="@/components/ui/card" plain>
                  <Card className="max-w-sm">
                    <CardHeader>
                      <CardTitle>Usage this month</CardTitle>
                      <CardDescription>
                        Events across all projects.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-semibold tracking-tight tabular-nums">
                        12,480
                      </p>
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
                description="Inputs and controls, labeled fields, token-driven, light & dark safe."
              >
                <Specimen name="Input" from="@/components/ui/input">
                  <div className="max-w-sm space-y-1.5">
                    <Label htmlFor="sg-display-name">Display name</Label>
                    <Input id="sg-display-name" placeholder="Acme Support" />
                  </div>
                </Specimen>

                <Specimen name="Textarea" from="@/components/ui/textarea">
                  <div className="max-w-sm space-y-1.5">
                    <Label htmlFor="sg-greeting">Welcome message</Label>
                    <Textarea
                      id="sg-greeting"
                      placeholder="Welcome to Acme. How can we help?"
                    />
                  </div>
                </Specimen>

                <Specimen name="Select" from="@/components/ui/select">
                  <div className="max-w-sm space-y-1.5">
                    <Label htmlFor="capability">Role</Label>
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
                  <Label htmlFor="sg-label-only">Project name</Label>
                </Specimen>

                <Specimen name="Toggle" from="@/components/ui/toggle">
                  <div className="flex flex-wrap items-center gap-2">
                    <Toggle variant="outline" aria-label="Bold">
                      <BoldIcon />
                    </Toggle>
                    <Toggle variant="outline" aria-label="Italic">
                      <ItalicIcon />
                    </Toggle>
                    <Toggle
                      variant="outline"
                      aria-label="Underline"
                      defaultPressed
                    >
                      <UnderlineIcon />
                    </Toggle>
                  </div>
                </Specimen>

                <Specimen
                  name="ToggleGroup"
                  from="@/components/ui/toggle-group"
                >
                  <ToggleGroup defaultValue={["left"]} variant="outline">
                    <ToggleGroupItem value="left" aria-label="Align left">
                      <AlignLeftIcon />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label="Align center">
                      <AlignCenterIcon />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="right" aria-label="Align right">
                      <AlignRightIcon />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </Specimen>

                <Specimen name="InputGroup" from="@/components/ui/input-group">
                  <div className="max-w-sm space-y-2">
                    <InputGroup>
                      <InputGroupAddon align="inline-start">
                        <SearchIcon className="size-4" />
                      </InputGroupAddon>
                      <Input
                        placeholder="Search projects…"
                        className="border-0 bg-transparent shadow-none"
                      />
                    </InputGroup>
                  </div>
                </Specimen>
              </Section>
            </Reveal>

            {/* Overlays */}
            <Reveal delay={400}>
              <Section
                id="overlays"
                title="Overlays"
                description="Floating surfaces, triggers open content via the render prop. Dark over light by design."
              >
                <Specimen name="Tooltip" from="@/components/ui/tooltip">
                  <TooltipDemo />
                </Specimen>

                <Specimen name="Popover" from="@/components/ui/popover">
                  <PopoverDemo />
                </Specimen>

                <Specimen
                  name="DropdownMenu"
                  from="@/components/ui/dropdown-menu"
                >
                  <DropdownMenuDemo />
                </Specimen>

                <Specimen name="Dialog" from="@/components/ui/dialog">
                  <DialogDemo />
                </Specimen>

                <Specimen name="Sheet" from="@/components/ui/sheet">
                  <SheetDemo />
                </Specimen>

                <Specimen name="Command" from="@/components/ui/command">
                  <CommandDemo />
                </Specimen>

                <Specimen
                  name="NavigationMenu"
                  from="@/components/ui/navigation-menu"
                >
                  <NavigationMenuDemo />
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
                description="Status, progress, and loading, how a surface tells you what's happening."
              >
                <Specimen name="Alert" from="@/components/ui/alert">
                  <div className="space-y-3">
                    <Alert>
                      <CheckCircle2 />
                      <AlertTitle>Changes saved</AlertTitle>
                      <AlertDescription>
                        Your workspace settings have been updated.
                      </AlertDescription>
                    </Alert>
                    <Alert variant="destructive">
                      <AlertTitle>Action required</AlertTitle>
                      <AlertDescription>
                        Confirm your billing details to keep your plan active.
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
                description="Reading surfaces, how records, structure, and identity are presented."
              >
                <Specimen name="Tabs" from="@/components/ui/tabs">
                  <Tabs defaultValue="overview">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="activity">Activity</TabsTrigger>
                      <TabsTrigger value="settings">Settings</TabsTrigger>
                    </TabsList>
                    <TabsContent
                      value="overview"
                      className="pt-3 text-muted-foreground"
                    >
                      1,284 events this week, up 14%.
                    </TabsContent>
                    <TabsContent
                      value="activity"
                      className="pt-3 text-muted-foreground"
                    >
                      42 active users in the last 24 hours.
                    </TabsContent>
                    <TabsContent
                      value="settings"
                      className="pt-3 text-muted-foreground"
                    >
                      3 members can edit this project.
                    </TabsContent>
                  </Tabs>
                </Specimen>

                <Specimen name="Accordion" from="@/components/ui/accordion">
                  <Accordion className="max-w-md">
                    <AccordionItem value="invite">
                      <AccordionTrigger>
                        How do I invite a teammate?
                      </AccordionTrigger>
                      <AccordionContent>
                        Open your workspace settings, choose Members, and send
                        an invite by email with a role of Editor or Admin.
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="billing">
                      <AccordionTrigger>
                        How does billing work?
                      </AccordionTrigger>
                      <AccordionContent>
                        You&apos;re billed monthly based on usage. Upgrade or
                        downgrade anytime; changes prorate to the current cycle.
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
                    <span>Overview</span>
                    <Separator orientation="vertical" />
                    <span>Activity</span>
                    <Separator orientation="vertical" />
                    <span>Settings</span>
                  </div>
                </Specimen>

                <Specimen name="Breadcrumb" from="@/components/ui/breadcrumb">
                  <Breadcrumb>
                    <BreadcrumbList>
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Projects</BreadcrumbLink>
                      </BreadcrumbItem>
                      <BreadcrumbSeparator />
                      <BreadcrumbItem>
                        <BreadcrumbLink href="#">Acme</BreadcrumbLink>
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
                        <TableHead>Name</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right tabular-nums">
                          Usage
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Acme Inc.</TableCell>
                        <TableCell>
                          <Badge variant="success">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          1,284
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Globex</TableCell>
                        <TableCell>
                          <Badge variant="warning">Pending</Badge>
                        </TableCell>
                        <TableCell className="text-right tabular-nums">
                          0
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </Specimen>

                <Specimen
                  name="AspectRatio"
                  from="@/components/ui/aspect-ratio"
                >
                  <AspectRatio
                    ratio={16 / 9}
                    className="edge max-w-xs overflow-hidden rounded-xl bg-muted"
                  >
                    <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                      16 / 9
                    </div>
                  </AspectRatio>
                </Specimen>

                <Specimen name="ScrollArea" from="@/components/ui/scroll-area">
                  <ScrollArea className="edge h-36 max-w-xs rounded-xl">
                    <div className="p-4 space-y-2">
                      {Array.from({ length: 12 }, (_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                        >
                          <FileTextIcon className="size-4 shrink-0" />
                          <span>
                            Document {String(i + 1).padStart(2, "0")}.pdf
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </Specimen>

                <Specimen name="Collapsible" from="@/components/ui/collapsible">
                  <Collapsible className="max-w-xs">
                    <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg edge px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors">
                      Advanced settings
                      <Plus className="size-4 text-muted-foreground" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-1 rounded-lg edge px-4 py-3">
                      <p className="text-sm text-muted-foreground">
                        Debug mode, verbose logging, and rate limit overrides
                        live here.
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </Specimen>
              </Section>
            </Reveal>

            {/* Patterns */}
            <Reveal delay={640}>
              <Section
                id="patterns"
                title="Patterns"
                description="Composed pieces, the recurring building blocks of a page."
              >
                <Specimen
                  name="PageHeader"
                  from="@/components/page-header"
                  plain
                >
                  <div className="space-y-8">
                    <PageHeader
                      title="People"
                      description="8 people this week"
                      align="center"
                    />
                    <div className="border-t border-border pt-8">
                      <PageHeader
                        title="Projects"
                        description="3 active projects"
                        align="start"
                      >
                        <Button size="sm">
                          <Plus />
                          New project
                        </Button>
                      </PageHeader>
                    </div>
                  </div>
                </Specimen>

                <Specimen name="MetricStat" from="@/components/metric-stat">
                  <div className="flex flex-wrap gap-12">
                    <MetricStat
                      label="Revenue"
                      value="$48.2k"
                      delta={{ value: "+100%", direction: "up" }}
                    />
                    <MetricStat
                      label="Active users"
                      value="1,204"
                      delta={{ value: "-12%", direction: "down" }}
                    />
                    <MetricStat
                      label="Churn"
                      value="2.4%"
                      delta={{ value: "0%", direction: "flat" }}
                    />
                  </div>
                </Specimen>

                <Specimen name="StatCard" from="@/components/stat-card" plain>
                  <StatCard
                    label="Total spend"
                    value="$842.10"
                    hint="Across 3 projects"
                    delta={{ value: "+8%", direction: "up" }}
                    className="max-w-xs"
                  />
                </Specimen>

                <Specimen
                  name="Ring gauge"
                  from="@/components/ui/activity-ring"
                >
                  <div className="flex flex-wrap items-center gap-8">
                    <ActivityRing value={32} label="Poor" />
                    <ActivityRing value={67} label="Needs work" />
                    <ActivityRing value={94} label="Great" />
                  </div>
                </Specimen>

                <Specimen
                  name="ActivityGrid"
                  from="@/components/ui/activity-grid"
                >
                  <ActivityGrid data={activityData} />
                </Specimen>

                <Specimen
                  name="GradientAvatar + animalName"
                  from="@/components/ui/gradient-avatar"
                >
                  <div className="flex flex-wrap gap-8">
                    {avatarSeeds.map((seed) => (
                      <div
                        key={seed}
                        className="flex flex-col items-center gap-2"
                      >
                        <GradientAvatar seed={seed} size="lg" />
                        <span className="text-xs text-muted-foreground">
                          {animalName(seed)}
                        </span>
                      </div>
                    ))}
                  </div>
                </Specimen>

                <Specimen
                  name="EmptyState"
                  from="@/components/empty-state"
                  plain
                >
                  <EmptyState
                    icon={Inbox}
                    title="No activity yet"
                    description="Events for this project will show up here."
                    action={
                      <Button size="sm">
                        <Plus />
                        New event
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
                description="One green series, soft gradient fade, faint gridlines, endpoint labels only, never a rainbow."
              >
                <Specimen name="Area chart" from="@/components/ui/chart" plain>
                  <div className="edge rounded-xl bg-background p-6">
                    <AreaChartDemo />
                  </div>
                </Specimen>

                <Specimen name="Bar chart" from="@/components/ui/chart" plain>
                  <div className="edge rounded-xl bg-background p-6">
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
                description="Composed dashboard pieces, detail headers, settings panels, and event timelines."
              >
                <Specimen
                  name="DetailHeader"
                  from="@/components/detail-header"
                  plain
                >
                  <div className="edge rounded-xl bg-background p-6">
                    <DetailHeader
                      title="Acme Inc."
                      badge={<StatusPill tone="success">Active</StatusPill>}
                      actions={
                        <Button variant="outline" size="sm">
                          <Settings />
                          Settings
                        </Button>
                      }
                      meta={[
                        { label: "Plan", value: "Pro" },
                        { label: "Region", value: "US · California" },
                        { label: "Created", value: "Mar 14, 2026" },
                        { label: "Monthly", value: "$49.00" },
                      ]}
                    />
                  </div>
                </Specimen>

                <Specimen
                  name="Section (settings panel)"
                  from="@/components/section"
                  plain
                >
                  <PanelSection
                    title="Display name"
                    description="The name shown across your workspace."
                    action={
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    }
                  >
                    <div className="px-5 py-5">
                      <p className="text-sm">Acme Inc.</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Visible to teammates and on shared links.
                      </p>
                    </div>
                  </PanelSection>
                </Specimen>

                <Specimen
                  name="EventTimeline"
                  from="@/components/event-timeline"
                  plain
                >
                  <div className="edge rounded-xl bg-background p-6">
                    <EventTimeline
                      events={[
                        {
                          tone: "success",
                          title: "Deployment live",
                          description: "Production build published.",
                          timestamp: "Today · 9:42 AM",
                        },
                        {
                          tone: "info",
                          title: "Changes pushed",
                          description: "Awaiting review.",
                          timestamp: "Mar 14 · 4:18 PM",
                        },
                        {
                          tone: "warning",
                          title: "Action needed",
                          description: "Billing details could not be verified.",
                          timestamp: "Mar 12 · 11:02 AM",
                        },
                        {
                          tone: "neutral",
                          title: "Project created",
                          timestamp: "Mar 11 · 8:30 AM",
                        },
                      ]}
                    />
                  </div>
                </Specimen>

                <Specimen
                  name="VerificationProgress"
                  from="@/components/verification-progress"
                  plain
                >
                  <div className="edge space-y-6 rounded-xl bg-background p-6">
                    <VerificationProgress
                      steps={[
                        { tone: "success", label: "Verified", count: 55 },
                        { tone: "warning", label: "Action needed", count: 12 },
                        { tone: "neutral", label: "Pending", count: 8 },
                      ]}
                    />
                    <div className="border-t border-border pt-5">
                      <VerificationProgress
                        steps={[
                          {
                            tone: "success",
                            label: "Brand registered",
                            description: "Carrier approved",
                          },
                          {
                            tone: "success",
                            label: "Number verified",
                            description: "Calls active",
                          },
                          {
                            tone: "warning",
                            label: "SMS pending",
                            description: "Awaiting review",
                          },
                          {
                            tone: "neutral",
                            label: "A2P 10DLC",
                            description: "Not started",
                          },
                        ]}
                      />
                    </div>
                  </div>
                </Specimen>
              </Section>
            </Reveal>

            {/* Layouts */}
            <Reveal delay={880}>
              <Section
                id="layouts"
                title="Layout archetypes"
                description="Composition shells, every page picks one signature hero, never a generic card grid."
                count={3}
              >
                <Link
                  href="/layouts"
                  className="group flex flex-wrap items-center justify-between gap-3 rounded-xl border border-brand/20 bg-brand/5 px-5 py-4 transition-colors hover:border-brand/40 hover:bg-brand/10"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-foreground">
                      See all six archetypes as full, live pages
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Open the gallery to inspect each at any viewport, in
                      either theme, and re-skin them live.
                    </p>
                  </div>
                  <span className={buttonVariants({ size: "sm" })}>
                    Explore layouts →
                  </span>
                </Link>

                <Specimen
                  name="HeroSection"
                  from="@/components/hero-section"
                  plain
                >
                  <div className="edge relative overflow-hidden rounded-xl bg-background pt-6">
                    <div className="px-6">
                      <HeroSection
                        header={
                          <>
                            <MetricStat
                              label="Sessions"
                              value="3,201"
                              delta={{ value: "+14%", direction: "up" }}
                            />
                            <MetricStat label="Avg session" value="2m 41s" />
                          </>
                        }
                      >
                        <div className="h-40 bg-gradient-to-b from-brand/20 to-transparent" />
                      </HeroSection>
                    </div>
                  </div>
                </Specimen>

                <Specimen
                  name="CenteredFocal"
                  from="@/components/centered-focal"
                  plain
                >
                  <div className="edge overflow-hidden rounded-xl bg-background">
                    <CenteredFocal className="min-h-[20rem]">
                      <h3 className="text-base font-medium">
                        Waiting for events
                      </h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Nothing has come through yet. Send a test to get
                        started.
                      </p>
                      <Button className="mt-5" size="sm">
                        Send a test
                      </Button>
                    </CenteredFocal>
                  </div>
                </Specimen>

                <Specimen
                  name="SplitWithRail + TimelineRail"
                  from="@/components/split-with-rail"
                  plain
                >
                  <SplitWithRail
                    summary={
                      <div className="space-y-5">
                        <div className="flex items-center gap-3">
                          <GradientAvatar seed="abc" size="xl" />
                          <div>
                            <p className="font-medium">{animalName("abc")}</p>
                            <p className="font-mono text-sm text-muted-foreground">
                              usr_8f2a91c4
                            </p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <MetricStat label="Sessions" value="42" />
                          <MetricStat label="Events" value="118" />
                        </div>
                      </div>
                    }
                    rail={
                      <TimelineRail
                        groups={[
                          {
                            label: "Today",
                            items: [
                              {
                                tone: "success",
                                title: "Signed in",
                                meta: "1m 8s",
                              },
                              {
                                tone: "info",
                                title: "Viewed dashboard",
                                meta: "12s",
                              },
                            ],
                          },
                          {
                            label: "Yesterday",
                            items: [
                              {
                                tone: "warning",
                                title: "Failed login",
                                meta: "0s",
                              },
                              {
                                tone: "neutral",
                                title: "Updated profile",
                                meta: "44s",
                              },
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
                description="The same twelve components, ours on the left, a design system you know on the right. Toggle between Vercel, Linear, 0.email, Shopify, Stripe, GitHub, Atlassian, Radix, Mailchimp, and Apple, and flip our side light or dark."
                count={12}
              >
                <VsComparison />
              </Section>
            </Reveal>
          </main>
        </div>
      </div>
    </div>
  )
}
