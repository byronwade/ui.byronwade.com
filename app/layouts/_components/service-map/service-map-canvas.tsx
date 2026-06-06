"use client"

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from "react"
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  applyNodeChanges,
  type Node,
  type NodeChange,
  type NodePositionChange,
  type ReactFlowInstance,
  type Viewport,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import throttle from "lodash.throttle"
import { Crosshair, RadioTower, RotateCcw } from "lucide-react"

import { getServiceLegendColor } from "@/lib/service-map-colors"
import type {
  ServiceDbEdge,
  ServiceDbQuerySummary,
  ServiceEdge,
  ServiceOverview,
  ServicePlatform,
  ServiceWorkload,
} from "@/lib/service-map-types"
import { useServiceMapLayout } from "@/lib/service-map-layout-storage"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { SegmentedControl } from "@/components/ui/segmented-control"
import { ServiceMapEdge } from "./service-map-edge"
import { ServiceMapNode } from "./service-map-node"
import {
  createParticleRegistry,
  ParticleRegistryProvider,
  ServiceMapParticleCanvas,
  type ServiceMapAnimationMode,
  type ParticleRegistry,
} from "./service-map-particles"
import {
  DatabaseDetailPanel,
  decodeDbNodeId,
  ServiceDetailPanel,
} from "./service-map-detail-panels"
import {
  buildFlowElements,
  computeNodePositions,
  DB_NODE_PREFIX,
  DEFAULT_LAYOUT_CONFIG,
  getPlatformColor,
  getServiceMapNodeColor,
  topologyKey,
  type LayoutConfig,
  type ServiceMapColorMode,
  type ServiceNodeData,
} from "./service-map-utils"

const nodeTypes = { serviceNode: ServiceMapNode }
const edgeTypes = { serviceEdge: ServiceMapEdge }

type FlowNode = Node<ServiceNodeData>

type HealthFilter = "all" | "degraded" | "error"

const HEALTH_FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Degraded", value: "degraded" },
  { label: "Error", value: "error" },
] as const

const ANIMATION_MODE_OPTIONS = [
  { label: "Calm", value: "calm" },
  { label: "Live", value: "live" },
  { label: "Surge", value: "surge" },
] as const

function matchesHealthFilter(
  node: Node<ServiceNodeData>,
  filter: HealthFilter,
) {
  if (filter === "all") return true
  if (filter === "error") return node.data.errorRate > 0.05
  return node.data.errorRate > 0.01
}

function ServiceMiniMapNode({
  x,
  y,
  width,
  height,
  color,
  borderRadius,
}: import("@xyflow/react").MiniMapNodeProps) {
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      rx={borderRadius}
      ry={borderRadius}
      fill={color}
      stroke="none"
    />
  )
}

function mergeNodeMeasurements(next: FlowNode[], prev: FlowNode[]): FlowNode[] {
  const dimMap = new Map<
    string,
    {
      width?: number
      height?: number
      measured?: { width?: number; height?: number }
    }
  >()
  for (const n of prev) {
    dimMap.set(n.id, {
      width: n.width,
      height: n.height,
      measured: n.measured,
    })
  }
  return next.map((n) => {
    const dims = dimMap.get(n.id)
    return dims
      ? {
          ...n,
          width: dims.width,
          height: dims.height,
          measured: dims.measured,
        }
      : n
  })
}

export interface ServiceMapCanvasProps {
  edges: ServiceEdge[]
  dbEdges: ServiceDbEdge[]
  platforms: Map<string, ServicePlatform>
  runtimes: Map<string, string>
  overviews: ServiceOverview[]
  workloads: ServiceWorkload[]
  dbSummaries: Map<string, ServiceDbQuerySummary>
  showInfraTab?: boolean
  durationSeconds: number
  layoutKey?: string
  onNavigateService?: (serviceName: string) => void
}

function ServiceMapCanvasInner({
  edges: serviceEdges,
  dbEdges,
  platforms,
  runtimes,
  overviews,
  workloads,
  dbSummaries,
  showInfraTab = true,
  durationSeconds,
  layoutKey = "demo",
  onNavigateService,
}: ServiceMapCanvasProps) {
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    null,
  )
  const [layoutConfig] = useState<LayoutConfig>({ ...DEFAULT_LAYOUT_CONFIG })
  const [colorMode, setColorMode] = useState<ServiceMapColorMode>("service")
  const [healthFilter, setHealthFilter] = useState<HealthFilter>("all")
  const [focusService, setFocusService] = useState<string>("all")
  const [animationMode, setAnimationMode] =
    useState<ServiceMapAnimationMode>("live")
  const [trafficEnabled, setTrafficEnabled] = useState(true)
  const [layout, setLayout] = useServiceMapLayout(layoutKey)
  const [trafficReady, setTrafficReady] = useState(false)

  const registryRef = useRef<ParticleRegistry | null>(null)
  if (registryRef.current === null)
    registryRef.current = createParticleRegistry()
  const registry = registryRef.current

  const {
    rawNodes: allRawNodes,
    flowEdges: allFlowEdges,
    services,
  } = useMemo(() => {
    const { nodes, edges } = buildFlowElements({
      edges: serviceEdges,
      dbEdges,
      serviceOverviews: overviews,
      durationSeconds,
      serviceWorkloads: workloads,
      platforms,
      runtimes,
    })
    const allServices = Array.from(
      new Set(
        nodes.filter((n) => !n.id.startsWith(DB_NODE_PREFIX)).map((n) => n.id),
      ),
    ).toSorted()
    return { rawNodes: nodes, flowEdges: edges, services: allServices }
  }, [
    serviceEdges,
    dbEdges,
    platforms,
    runtimes,
    overviews,
    workloads,
    durationSeconds,
  ])

  const focusNodeIds = useMemo(() => {
    if (focusService === "all") return null
    const ids = new Set<string>([focusService])
    for (const edge of allFlowEdges) {
      if (edge.source === focusService) ids.add(edge.target)
      if (edge.target === focusService) ids.add(edge.source)
    }
    return ids
  }, [allFlowEdges, focusService])

  const rawNodes = useMemo(
    () =>
      allRawNodes.filter(
        (node) =>
          matchesHealthFilter(node, healthFilter) &&
          (focusNodeIds === null || focusNodeIds.has(node.id)),
      ),
    [allRawNodes, focusNodeIds, healthFilter],
  )

  const visibleNodeIds = useMemo(
    () => new Set(rawNodes.map((node) => node.id)),
    [rawNodes],
  )

  const flowEdges = useMemo(
    () =>
      allFlowEdges.filter(
        (edge) =>
          visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target),
      ),
    [allFlowEdges, visibleNodeIds],
  )

  const mapStats = useMemo(() => {
    const servicesInView = rawNodes.filter(
      (node) => !node.id.startsWith(DB_NODE_PREFIX),
    )
    const totalThroughput = servicesInView.reduce(
      (sum, node) => sum + node.data.throughput,
      0,
    )
    const degraded = servicesInView.filter(
      (node) => node.data.errorRate > 0.01,
    ).length
    const errors = servicesInView.filter(
      (node) => node.data.errorRate > 0.05,
    ).length
    return {
      services: servicesInView.length,
      dependencies: flowEdges.length,
      throughput: totalThroughput,
      degraded,
      errors,
    }
  }, [flowEdges.length, rawNodes])

  useEffect(() => {
    if (selectedServiceId && !visibleNodeIds.has(selectedServiceId)) {
      setSelectedServiceId(null)
    }
  }, [selectedServiceId, visibleNodeIds])

  const resetViewport = useCallback(() => {
    rfInstance.current?.fitView({ padding: 0.16, duration: 260 })
  }, [])

  const topoKey = useMemo(
    () => topologyKey(rawNodes, flowEdges),
    [rawNodes, flowEdges],
  )

  useEffect(() => {
    setTrafficReady(false)
    const timer = window.setTimeout(() => setTrafficReady(true), 520)
    return () => window.clearTimeout(timer)
  }, [topoKey])

  const layoutCacheRef = useRef<{
    key: string
    positions: Map<string, { x: number; y: number }>
  } | null>(null)

  const layoutedNodes = useMemo(() => {
    const key = `${topoKey}|${JSON.stringify(layoutConfig)}`
    if (layoutCacheRef.current?.key !== key) {
      layoutCacheRef.current = {
        key,
        positions: computeNodePositions(rawNodes, flowEdges, layoutConfig),
      }
    }
    const positions = layoutCacheRef.current.positions
    return rawNodes.map((node) => ({
      ...node,
      position: positions.get(node.id) ?? node.position,
    }))
  }, [rawNodes, flowEdges, layoutConfig, topoKey])

  const positionsKey = useMemo(
    () => JSON.stringify(layout.positions),
    [layout.positions],
  )

  const derivedNodes = useMemo(
    () =>
      layoutedNodes.map((node) => ({
        ...node,
        position: layout.positions[node.id] ?? node.position,
        data: {
          ...node.data,
          selected: node.id === selectedServiceId,
          colorMode,
        },
      })),
    [
      layoutedNodes,
      selectedServiceId,
      colorMode,
      positionsKey,
      layout.positions,
    ],
  )

  const nodeSyncKey = `${topoKey}|${selectedServiceId ?? ""}|${colorMode}|${positionsKey}`
  const prevNodeSyncKey = useRef(nodeSyncKey)

  const [nodes, setNodes] = useState<FlowNode[]>(derivedNodes)

  useEffect(() => {
    if (prevNodeSyncKey.current === nodeSyncKey) return
    prevNodeSyncKey.current = nodeSyncKey
    setNodes((prev) => mergeNodeMeasurements(derivedNodes, prev))
  }, [nodeSyncKey, derivedNodes])

  const rfInstance = useRef<ReactFlowInstance | null>(null)
  const didFitView = useRef(layout.viewport != null)

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const hasDrag = changes.some(
        (c) => c.type === "position" && c.dragging === true,
      )
      const hasDimension = changes.some((c) => c.type === "dimensions")

      setNodes((prev) => {
        const next = applyNodeChanges(changes, prev) as FlowNode[]

        if (
          !didFitView.current &&
          !hasDrag &&
          hasDimension &&
          rfInstance.current
        ) {
          const allMeasured =
            next.length > 0 &&
            next.every((n) => n.measured?.width && n.measured?.height)
          if (allMeasured) {
            didFitView.current = true
            requestAnimationFrame(() => {
              rfInstance.current?.fitView({ padding: 0.12, duration: 0 })
            })
          }
        }

        return next
      })

      const dragEnds = changes.filter(
        (c): c is NodePositionChange =>
          c.type === "position" && c.dragging === false && c.position != null,
      )
      if (dragEnds.length > 0) {
        setLayout((prev) => {
          const positions = { ...prev.positions }
          for (const c of dragEnds) {
            positions[c.id] = { x: c.position!.x, y: c.position!.y }
          }
          return { ...prev, positions }
        })
      }
    },
    [setLayout],
  )

  const persistViewport = useMemo(
    () =>
      throttle((viewport: Viewport) => {
        setLayout((prev) => ({ ...prev, viewport }))
      }, 400),
    [setLayout],
  )

  useEffect(() => () => persistViewport.cancel(), [persistViewport])

  const onMoveEnd = useCallback(
    (_: unknown, viewport: Viewport) => {
      persistViewport(viewport)
    },
    [persistViewport],
  )

  const handleNodeClick = useCallback(
    (_: MouseEvent, node: Node<ServiceNodeData>) => {
      setSelectedServiceId((prev) => (prev === node.id ? null : node.id))
    },
    [],
  )

  const handlePaneClick = useCallback(() => {
    setSelectedServiceId(null)
  }, [])

  const miniMapNodeColor = useCallback(
    (node: Node) => {
      const data = node.data as ServiceNodeData
      return getServiceMapNodeColor(data, data.services, colorMode)
    },
    [colorMode],
  )

  if (nodes.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="space-y-2 text-center">
          <p className="text-sm font-medium text-muted-foreground">
            No service dependencies found
          </p>
          <p className="text-xs text-muted-foreground/60">
            Service connections appear when trace data with cross-service calls
            is ingested.
          </p>
        </div>
      </div>
    )
  }

  const selectedDbSummary =
    selectedServiceId?.startsWith(DB_NODE_PREFIX) && selectedServiceId
      ? (dbSummaries.get(decodeDbNodeId(selectedServiceId)) ?? null)
      : null

  return (
    <div
      data-slot="service-map-canvas"
      className="relative flex h-full flex-col"
    >
      <div className="relative min-h-0 flex-1">
        <div className="absolute top-2 left-2 z-50 flex items-center gap-2 rounded-md border border-border bg-card/90 px-2 py-1 backdrop-blur-sm">
          <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
            Color by
          </span>
          <Select
            value={colorMode}
            onValueChange={(v) => setColorMode(v as ServiceMapColorMode)}
          >
            <SelectTrigger
              size="sm"
              className="h-6 min-w-0 border-0 bg-transparent px-1.5 text-[11px] capitalize"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="service">Service</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="platform">Platform</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="absolute top-2 right-2 z-50 flex max-w-[min(100%-1rem,720px)] flex-wrap items-center justify-end gap-2">
          <div className="flex items-center gap-1 rounded-md border border-border bg-card/90 px-2 py-1 backdrop-blur-sm">
            <Crosshair className="size-3.5 text-muted-foreground" />
            <Select
              value={focusService}
              onValueChange={(value) => setFocusService(value ?? "all")}
            >
              <SelectTrigger
                size="sm"
                className="h-6 w-36 min-w-0 border-0 bg-transparent px-1.5 text-[11px]"
                aria-label="Focus service"
              >
                <span className="truncate">
                  {focusService === "all" ? "All services" : focusService}
                </span>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All services</SelectItem>
                {services.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <SegmentedControl
            value={healthFilter}
            onValueChange={(value) => setHealthFilter(value as HealthFilter)}
            options={[...HEALTH_FILTER_OPTIONS]}
            className="rounded-md bg-card/90 p-0.5 backdrop-blur-sm [&_button]:h-7 [&_button]:px-2 [&_button]:text-[11px]"
          />

          <SegmentedControl
            value={animationMode}
            onValueChange={(value) =>
              setAnimationMode(value as ServiceMapAnimationMode)
            }
            options={[...ANIMATION_MODE_OPTIONS]}
            className="rounded-md bg-card/90 p-0.5 backdrop-blur-sm [&_button]:h-7 [&_button]:px-2 [&_button]:text-[11px]"
          />

          <Button
            type="button"
            variant={trafficEnabled ? "secondary" : "outline"}
            size="sm"
            className="h-8 gap-1.5 px-2 text-xs"
            onClick={() => setTrafficEnabled((current) => !current)}
          >
            <RadioTower className="size-3.5" />
            {trafficEnabled ? "Traffic on" : "Traffic off"}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="size-8"
            aria-label="Reset service map view"
            onClick={resetViewport}
          >
            <RotateCcw className="size-3.5" />
          </Button>
        </div>

        <ParticleRegistryProvider value={registry}>
          <ReactFlow
            nodes={nodes}
            edges={flowEdges}
            onNodesChange={onNodesChange}
            onNodeClick={handleNodeClick}
            onPaneClick={handlePaneClick}
            onMoveEnd={onMoveEnd}
            defaultViewport={layout.viewport ?? undefined}
            onInit={(instance) => {
              rfInstance.current = instance as unknown as ReactFlowInstance
            }}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            nodesDraggable
            nodesConnectable={false}
            connectOnClick={false}
            elementsSelectable={false}
            nodesFocusable={false}
            edgesFocusable={false}
            minZoom={0.1}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
            className="bg-muted/20 [contain:layout_paint_style]"
          >
            <ServiceMapParticleCanvas
              mode={animationMode}
              enabled={trafficEnabled && trafficReady}
            />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={miniMapNodeColor}
              nodeComponent={ServiceMiniMapNode}
              nodeStrokeWidth={0}
              maskColor="color-mix(in srgb, var(--background) 84%, transparent)"
              className="!border-border !bg-muted/50"
              pannable={false}
              zoomable={false}
            />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
          </ReactFlow>
        </ParticleRegistryProvider>

        {selectedServiceId && (
          <div
            data-slot="service-map-detail-overlay"
            className="absolute inset-y-0 right-0 z-30 flex w-[min(100%,360px)] flex-col border-l border-border bg-background shadow-card sm:w-[min(38%,400px)]"
          >
            {selectedServiceId.startsWith(DB_NODE_PREFIX) ? (
              <DatabaseDetailPanel
                dbSystem={decodeDbNodeId(selectedServiceId)}
                dbEdges={dbEdges}
                services={services}
                durationSeconds={durationSeconds}
                summary={selectedDbSummary}
                onClose={() => setSelectedServiceId(null)}
              />
            ) : (
              <ServiceDetailPanel
                serviceId={selectedServiceId}
                services={services}
                edges={serviceEdges}
                overviews={overviews}
                workloads={workloads}
                showInfraTab={showInfraTab}
                platforms={platforms}
                colorMode={colorMode}
                durationSeconds={durationSeconds}
                onClose={() => setSelectedServiceId(null)}
                onNavigate={onNavigateService}
              />
            )}
          </div>
        )}
      </div>

      <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-t bg-muted/30 px-3 py-2.5 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="font-mono text-[10px]">
            {mapStats.services} svc
          </Badge>
          <Badge variant="secondary" className="font-mono text-[10px]">
            {mapStats.dependencies} deps
          </Badge>
          <Badge variant="secondary" className="font-mono text-[10px]">
            {mapStats.throughput.toFixed(1)} rps
          </Badge>
        </div>
        <span className="text-foreground/30">|</span>
        <span className="font-medium">Drag nodes to arrange</span>
        <span className="text-foreground/30">|</span>
        <span className="font-medium">Scroll to zoom</span>
        {focusService !== "all" && (
          <>
            <span className="text-foreground/30">|</span>
            <span className="font-medium text-foreground">
              Focus: {focusService}
            </span>
          </>
        )}
        {colorMode === "service" && services.length > 0 && (
          <>
            <span className="text-foreground/30">|</span>
            {services.slice(0, 3).map((service) => (
              <div key={service} className="flex items-center gap-1.5">
                <div
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{
                    backgroundColor: getServiceMapNodeColor(
                      { label: service, kind: "service", errorRate: 0 },
                      services,
                      "service",
                    ),
                  }}
                />
                <span className="font-medium">{service}</span>
              </div>
            ))}
            {services.length > 3 && (
              <Popover>
                <PopoverTrigger className="cursor-pointer font-medium transition-colors hover:text-foreground">
                  +{services.length - 3} more
                </PopoverTrigger>
                <PopoverContent align="start" className="w-64 p-3" side="top">
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    {services.map((service) => (
                      <div
                        key={service}
                        className="flex min-w-0 items-center gap-1.5"
                      >
                        <div
                          className="size-2.5 shrink-0 rounded-sm"
                          style={{
                            backgroundColor: getServiceLegendColor(
                              service,
                              services,
                            ),
                          }}
                        />
                        <span className="truncate font-medium">{service}</span>
                      </div>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </>
        )}
        {colorMode === "platform" && (
          <>
            <span className="text-foreground/30">|</span>
            {(
              ["kubernetes", "cloudflare", "lambda", "web", "unknown"] as const
            ).map((p) => (
              <div key={p} className="flex items-center gap-1.5">
                <div
                  className="size-2.5 shrink-0 rounded-sm"
                  style={{
                    backgroundColor: getPlatformColor(
                      p === "unknown" ? undefined : p,
                    ),
                  }}
                />
                <span className="font-medium capitalize">{p}</span>
              </div>
            ))}
          </>
        )}
        <span className="flex-1" />
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-success" />
            <span>Healthy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-warning" />
            <span>{mapStats.degraded} degraded</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="size-2 rounded-full bg-destructive" />
            <span>{mapStats.errors} error</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ServiceMapCanvas(props: ServiceMapCanvasProps) {
  return (
    <ReactFlowProvider>
      <ServiceMapCanvasInner {...props} />
    </ReactFlowProvider>
  )
}
