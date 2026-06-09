"use client"

import { useMemo, useState } from "react"
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Box,
  Cable,
  ChevronRight,
  Cloud,
  FileText,
  Globe,
  LayoutDashboard,
  Network,
  Radio,
  Server,
  Settings2,
  Shield,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import {
  createServiceMapDemoGraph,
  SERVICE_MAP_DURATION_SECONDS,
} from "@/lib/service-map-demo-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ServiceMapCanvas } from "@/app/layouts/_components/service-map/service-map-canvas"

type ObservabilityRoute =
  | "home"
  | "service-map"
  | "traces"
  | "logs"
  | "metrics"
  | "infra"
  | "connectors"
  | "alerts"

const TIME_PRESETS = ["15m", "1h", "6h", "12h", "24h", "7d"] as const

const NAV_ITEMS: Array<{
  id: ObservabilityRoute
  label: string
  icon: typeof Network
  section?: string
}> = [
  { id: "home", label: "Home", icon: LayoutDashboard, section: "Overview" },
  {
    id: "service-map",
    label: "Service map",
    icon: Network,
    section: "Observe",
  },
  { id: "traces", label: "Traces", icon: Activity, section: "Observe" },
  { id: "logs", label: "Logs", icon: FileText, section: "Observe" },
  { id: "metrics", label: "Metrics", icon: BarChart3, section: "Observe" },
  { id: "infra", label: "Infrastructure", icon: Box, section: "Observe" },
  { id: "connectors", label: "Connectors", icon: Cable, section: "Ingest" },
  { id: "alerts", label: "Alerts", icon: AlertTriangle, section: "Respond" },
]

const ADAPTERS = [
  {
    id: "otlp",
    name: "OpenTelemetry OTLP",
    kind: "Standard",
    icon: Radio,
    description:
      "Export traces, logs, and metrics via OTLP/gRPC or OTLP/HTTP to the Maple ingest gateway.",
    snippet: `OTLPTraceExporter({
  url: "https://ingest.maple.dev/v1/traces",
  headers: { Authorization: "Bearer maple_pk_..." },
})`,
  },
  {
    id: "effect-sdk",
    name: "@maple-dev/effect-sdk",
    kind: "Server",
    icon: Server,
    description:
      "Effect-native tracing layer for Node, Bun, and server runtimes.",
    snippet: `const TracerLive = Maple.layer({ serviceName: "my-app" })
Effect.provide(program, TracerLive)`,
  },
  {
    id: "browser",
    name: "@maple-dev/browser",
    kind: "Client",
    icon: Globe,
    description:
      "Browser RUM, distributed tracing, and optional session replay.",
    snippet: `MapleBrowser.init({
  ingestKey: process.env.NEXT_PUBLIC_MAPLE_INGEST_KEY!,
  serviceName: "acme-web",
})`,
  },
  {
    id: "cloudflare",
    name: "@maple-dev/effect-sdk/cloudflare",
    kind: "Edge",
    icon: Cloud,
    description: "Workers instrumentation with waitUntil flush semantics.",
    snippet: `const telemetry = MapleCloudflareSDK.make({ serviceName: "my-worker" })
ctx.waitUntil(telemetry.flush(env))`,
  },
  {
    id: "prometheus",
    name: "Prometheus scrape targets",
    kind: "Connector",
    icon: Activity,
    description:
      "Managed scrape jobs discovered by the OTel collector via HTTP SD.",
    snippet: `scrape_interval: 30s
metrics_path: /metrics
service_name: payments-api`,
  },
  {
    id: "logpush",
    name: "Cloudflare Logpush",
    kind: "Connector",
    icon: Shield,
    description: "Zone log streams forwarded to Maple ingest endpoints.",
    snippet: `POST /v1/logpush/{zoneId}
Authorization: Bearer maple_sk_...`,
  },
  {
    id: "k8s",
    name: "maple-k8s-infra Helm chart",
    kind: "Infrastructure",
    icon: Box,
    description:
      "OpenTelemetry Operator injection + k8sattributes for pod badges and infra tab.",
    snippet: `helm upgrade --install maple-k8s-infra \\
  oci://ghcr.io/makisuo/charts/maple-k8s-infra`,
  },
  {
    id: "collector",
    name: "mapleexporter (OTel Collector)",
    kind: "Collector",
    icon: Zap,
    description: "Custom ClickHouse exporter for self-hosted Maple warehouses.",
    snippet: `exporters:
  maple:
    endpoint: https://ch.example.com
    org_id: org_xxx`,
  },
] as const

function RoutePlaceholder({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-10 text-center">
      <div className="grid size-12 place-items-center rounded-xl edge bg-muted/40">
        <Activity className="size-5 text-muted-foreground" />
      </div>
      <div className="max-w-md space-y-1">
        <p className="text-sm font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Badge variant="secondary">Demo data only</Badge>
    </div>
  )
}

function ConnectorsView() {
  const [tab, setTab] = useState<"all" | "sdk" | "connector" | "infra">("all")
  const filtered = ADAPTERS.filter((adapter) => {
    if (tab === "all") return true
    if (tab === "sdk")
      return ["Server", "Client", "Edge", "Standard"].includes(adapter.kind)
    if (tab === "connector") return adapter.kind === "Connector"
    return adapter.kind === "Infrastructure" || adapter.kind === "Collector"
  })

  return (
    <div className="flex h-full flex-col">
      <div className="border-b px-6 py-4">
        <h2 className="text-sm font-semibold tracking-tight text-foreground">
          Ingest adapters
        </h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Every path Maple accepts telemetry from — SDKs, standard OTLP, managed
          connectors, and collector exporters.
        </p>
        <div className="mt-4">
          <SegmentedControl
            value={tab}
            onValueChange={setTab}
            options={[
              { label: "All", value: "all" },
              { label: "SDKs", value: "sdk" },
              { label: "Connectors", value: "connector" },
              { label: "Infra", value: "infra" },
            ]}
          />
        </div>
      </div>
      <ScrollArea className="min-h-0 flex-1">
        <div className="grid gap-4 p-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((adapter) => (
            <article
              key={adapter.id}
              data-slot="service-map-adapter-card"
              className="flex flex-col rounded-xl edge bg-card p-4"
            >
              <div className="flex items-start gap-3">
                <div className="grid size-9 shrink-0 place-items-center rounded-lg edge bg-muted/40">
                  <adapter.icon className="size-4 text-brand" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-medium text-foreground">
                      {adapter.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="font-mono text-[10px]"
                    >
                      {adapter.kind}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {adapter.description}
                  </p>
                </div>
              </div>
              <pre className="mt-4 overflow-x-auto rounded-lg bg-muted/50 p-3 font-mono text-[10px] leading-relaxed text-foreground">
                {adapter.snippet}
              </pre>
            </article>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

function HomeOverview({
  serviceCount,
  edgeCount,
  onOpenMap,
}: {
  serviceCount: number
  edgeCount: number
  onOpenMap: () => void
}) {
  return (
    <div className="flex h-full flex-col gap-6 p-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Services",
            value: String(serviceCount),
            tone: "text-brand",
          },
          {
            label: "Dependencies",
            value: String(edgeCount),
            tone: "text-foreground",
          },
          { label: "Error budget", value: "94.2%", tone: "text-success" },
          {
            label: "Ingest adapters",
            value: String(ADAPTERS.length),
            tone: "text-foreground",
          },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl edge bg-card px-4 py-3">
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p
              className={cn("mt-1 font-mono text-2xl tabular-nums", stat.tone)}
            >
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl edge bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-medium text-foreground">
              Service topology
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Live dependency graph with animated traffic particles, database
              nodes, and infrastructure context.
            </p>
          </div>
          <Button size="sm" onClick={onOpenMap}>
            Open service map
            <ChevronRight data-icon="inline-end" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sdk">
        <TabsList>
          <TabsTrigger value="sdk">Quick-start SDKs</TabsTrigger>
          <TabsTrigger value="connectors">Connectors</TabsTrigger>
        </TabsList>
        <TabsContent value="sdk" className="mt-4">
          <div className="grid gap-3 md:grid-cols-2">
            {ADAPTERS.slice(0, 4).map((adapter) => (
              <div
                key={adapter.id}
                className="rounded-lg edge bg-muted/20 px-4 py-3"
              >
                <p className="text-sm font-medium text-foreground">
                  {adapter.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {adapter.description}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="connectors" className="mt-4">
          <div className="grid gap-3 md:grid-cols-2">
            {ADAPTERS.slice(4).map((adapter) => (
              <div
                key={adapter.id}
                className="rounded-lg edge bg-muted/20 px-4 py-3"
              >
                <p className="text-sm font-medium text-foreground">
                  {adapter.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {adapter.description}
                </p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function ServiceMapWorkspace({
  fullPage = true,
}: {
  fullPage?: boolean
}) {
  const graph = useMemo(() => createServiceMapDemoGraph(), [])
  const [route, setRoute] = useState<ObservabilityRoute>("service-map")
  const [timePreset, setTimePreset] =
    useState<(typeof TIME_PRESETS)[number]>("12h")

  const sections = useMemo(() => {
    const map = new Map<string, typeof NAV_ITEMS>()
    for (const item of NAV_ITEMS) {
      const section = item.section ?? "Other"
      const list = map.get(section) ?? []
      list.push(item)
      map.set(section, list)
    }
    return Array.from(map.entries())
  }, [])

  const routeMeta = NAV_ITEMS.find((item) => item.id === route)

  const main = (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3 sm:px-6">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Maple</span>
            <ChevronRight className="size-3" />
            <span className="text-foreground">{routeMeta?.label}</span>
          </div>
          <h1 className="mt-0.5 truncate text-sm font-semibold tracking-tight text-foreground sm:text-base">
            {routeMeta?.label}
          </h1>
          {route === "service-map" && (
            <p className="hidden text-xs text-muted-foreground sm:block">
              Visualize service-to-service dependencies and data flow.
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SegmentedControl
            value={timePreset}
            onValueChange={setTimePreset}
            options={TIME_PRESETS.map((preset) => ({
              label: preset,
              value: preset,
            }))}
          />
          <Button variant="outline" size="sm">
            <Settings2 data-icon="inline-start" />
            Settings
          </Button>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-hidden">
        {route === "service-map" && (
          <ServiceMapCanvas
            edges={graph.edges}
            dbEdges={graph.dbEdges}
            platforms={graph.platforms}
            runtimes={graph.runtimes}
            overviews={graph.overviews}
            workloads={graph.workloads}
            dbSummaries={graph.dbSummaries}
            durationSeconds={SERVICE_MAP_DURATION_SECONDS}
            showInfraTab
          />
        )}
        {route === "home" && (
          <HomeOverview
            serviceCount={graph.overviews.length}
            edgeCount={graph.edges.length}
            onOpenMap={() => setRoute("service-map")}
          />
        )}
        {route === "connectors" && <ConnectorsView />}
        {route === "traces" && (
          <RoutePlaceholder
            title="Distributed traces"
            description="Flamegraphs and span timelines appear when OTLP trace data is ingested via any adapter."
          />
        )}
        {route === "logs" && (
          <RoutePlaceholder
            title="Structured logs"
            description="Correlated log streams from OTLP logs exporter or Cloudflare Logpush connector."
          />
        )}
        {route === "metrics" && (
          <RoutePlaceholder
            title="Metrics explorer"
            description="OTLP metrics and Prometheus scrape targets feed the metrics warehouse."
          />
        )}
        {route === "infra" && (
          <RoutePlaceholder
            title="Kubernetes infrastructure"
            description="Pod badges and workload rows require the maple-k8s-infra Helm chart."
          />
        )}
        {route === "alerts" && (
          <RoutePlaceholder
            title="Alert rules"
            description="Threshold and anomaly alerts evaluate against the same ClickHouse warehouse."
          />
        )}
      </div>
    </div>
  )

  if (!fullPage) return main

  return (
    <SidebarProvider defaultOpen>
      <div
        data-slot="service-map-workspace"
        className="flex h-dvh min-h-0 w-full overflow-hidden bg-background text-foreground"
      >
        <Sidebar collapsible="icon" className="border-r border-border">
          <SidebarHeader className="border-b border-border px-3 py-3">
            <div className="flex items-center gap-2 px-1">
              <div className="grid size-8 place-items-center rounded-lg bg-brand text-brand-foreground">
                <Network className="size-4" />
              </div>
              <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                <p className="truncate text-sm font-semibold tracking-tight">
                  Maple
                </p>
                <p className="truncate text-[10px] text-muted-foreground">
                  Observability
                </p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            {sections.map(([section, items]) => (
              <SidebarGroup key={section}>
                <SidebarGroupLabel>{section}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {items.map((item) => (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          isActive={route === item.id}
                          onClick={() => setRoute(item.id)}
                          tooltip={item.label}
                        >
                          <item.icon />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            ))}
          </SidebarContent>
          <SidebarFooter className="border-t border-border p-3">
            <div className="rounded-lg edge bg-muted/30 px-3 py-2 group-data-[collapsible=icon]:hidden">
              <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                Ingest status
              </p>
              <div className="mt-1 flex items-center gap-2">
                <span className="size-2 rounded-full bg-success" />
                <span className="font-mono text-xs text-foreground">
                  8 adapters active
                </span>
              </div>
            </div>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <Separator className="sr-only" />
          {main}
        </div>
      </div>
    </SidebarProvider>
  )
}
