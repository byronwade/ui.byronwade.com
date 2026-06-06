import type {
  ServiceDbEdge,
  ServiceDbQuerySummary,
  ServiceEdge,
  ServiceMapGraph,
  ServiceOverview,
  ServicePlatform,
  ServiceWorkload,
} from "@/lib/service-map-types"

const DURATION_SECONDS = 3600

const SERVICES = [
  "web-frontend",
  "api-gateway",
  "auth-service",
  "user-service",
  "billing-service",
  "notification-service",
  "search-service",
  "analytics-worker",
  "order-service",
  "inventory-service",
  "payment-service",
  "recommendation-engine",
  "media-service",
  "cdn-edge",
  "worker-queue",
] as const

const PLATFORMS: Record<string, ServicePlatform> = {
  "web-frontend": "web",
  "api-gateway": "kubernetes",
  "auth-service": "kubernetes",
  "user-service": "kubernetes",
  "billing-service": "lambda",
  "notification-service": "cloudflare",
  "search-service": "kubernetes",
  "analytics-worker": "kubernetes",
  "order-service": "kubernetes",
  "inventory-service": "kubernetes",
  "payment-service": "lambda",
  "recommendation-engine": "kubernetes",
  "media-service": "cloudflare",
  "cdn-edge": "cloudflare",
  "worker-queue": "kubernetes",
}

const RUNTIMES: Record<string, string> = {
  "web-frontend": "edge-light",
  "api-gateway": "nodejs",
  "auth-service": "nodejs",
  "user-service": "bun",
  "billing-service": "nodejs",
  "notification-service": "workerd",
  "search-service": "nodejs",
  "analytics-worker": "nodejs",
  "order-service": "bun",
  "inventory-service": "nodejs",
  "payment-service": "nodejs",
  "recommendation-engine": "nodejs",
  "media-service": "workerd",
  "cdn-edge": "workerd",
  "worker-queue": "nodejs",
}

function edge(
  source: string,
  target: string,
  rps: number,
  errorRate: number,
  opts?: { sampling?: boolean },
): ServiceEdge {
  const callCount = Math.round(rps * DURATION_SECONDS)
  const hasSampling = opts?.sampling ?? false
  return {
    sourceService: source,
    targetService: target,
    callCount,
    estimatedCallCount: hasSampling ? Math.round(callCount * 4) : callCount,
    errorCount: Math.round(callCount * errorRate),
    errorRate,
    avgDurationMs: 8 + rps * 0.4,
    p95DurationMs: 40 + rps * 2,
    hasSampling,
    samplingWeight: hasSampling ? 4 : 1,
  }
}

function dbEdge(
  source: string,
  dbSystem: string,
  rps: number,
  errorRate: number,
): ServiceDbEdge {
  const callCount = Math.round(rps * DURATION_SECONDS)
  return {
    sourceService: source,
    dbSystem,
    callCount,
    estimatedCallCount: callCount,
    errorCount: Math.round(callCount * errorRate),
    errorRate,
    avgDurationMs: 2 + rps * 0.2,
    p95DurationMs: 12 + rps,
    hasSampling: false,
    samplingWeight: 1,
  }
}

function overview(
  serviceName: string,
  rps: number,
  errorRate: number,
  opts?: { sampling?: boolean },
): ServiceOverview {
  const hasSampling = opts?.sampling ?? false
  return {
    serviceName,
    environment: "production",
    p50LatencyMs: 6 + rps * 0.3,
    p95LatencyMs: 35 + rps * 1.5,
    p99LatencyMs: 80 + rps * 3,
    errorRate,
    throughput: hasSampling ? rps * 4 : rps,
    tracedThroughput: rps,
    hasSampling,
    samplingWeight: hasSampling ? 4 : 1,
  }
}

function makeDbSummary(dbSystem: string, rps: number): ServiceDbQuerySummary {
  const base = Math.round((rps * DURATION_SECONDS) / 12)
  const timeseries = Array.from({ length: 12 }, (_, i) => {
    const jitter = 0.85 + (i % 5) * 0.05
    const count = Math.round(base * jitter)
    return {
      bucket: new Date(Date.now() - (11 - i) * 5 * 60_000).toISOString(),
      queryCount: count,
      estimatedQueryCount: count,
      p50DurationMs: 3 + rps * 0.15,
      p95DurationMs: 18 + rps * 0.8,
    }
  })
  return {
    summary: {
      queryCount: timeseries.reduce((s, p) => s + p.queryCount, 0),
      estimatedQueryCount: timeseries.reduce(
        (s, p) => s + p.estimatedQueryCount,
        0,
      ),
      errorRate: 0.004,
      avgDurationMs: 4.2,
      p50DurationMs: 3.1,
      p95DurationMs: 22,
    },
    timeseries,
    topQueries: [
      {
        queryKey: "select-users",
        queryLabel: `SELECT id, email FROM users WHERE tenant = $1`,
        queryCount: Math.round(base * 3),
        estimatedQueryCount: Math.round(base * 3),
        errorRate: 0.002,
        p50DurationMs: 2.8,
        p95DurationMs: 14,
        serviceCount: 2,
        sampleService: "user-service",
      },
      {
        queryKey: "insert-event",
        queryLabel: `INSERT INTO events (type, payload) VALUES ($1, $2)`,
        queryCount: Math.round(base * 1.4),
        estimatedQueryCount: Math.round(base * 1.4),
        errorRate: 0.006,
        p50DurationMs: 4.5,
        p95DurationMs: 28,
        serviceCount: 3,
        sampleService: "analytics-worker",
      },
    ],
  }
}

export function createServiceMapDemoGraph(): ServiceMapGraph {
  const edges: ServiceEdge[] = [
    edge("web-frontend", "api-gateway", 420, 0.003, { sampling: true }),
    edge("web-frontend", "cdn-edge", 180, 0.001),
    edge("api-gateway", "auth-service", 310, 0.008),
    edge("api-gateway", "user-service", 240, 0.004),
    edge("api-gateway", "order-service", 190, 0.012),
    edge("api-gateway", "search-service", 95, 0.006),
    edge("api-gateway", "media-service", 72, 0.002),
    edge("auth-service", "user-service", 140, 0.005),
    edge("user-service", "notification-service", 55, 0.003),
    edge("order-service", "inventory-service", 120, 0.009),
    edge("order-service", "payment-service", 88, 0.018),
    edge("order-service", "billing-service", 64, 0.007),
    edge("payment-service", "billing-service", 52, 0.004),
    edge("inventory-service", "worker-queue", 38, 0.002),
    edge("search-service", "recommendation-engine", 45, 0.011),
    edge("analytics-worker", "recommendation-engine", 28, 0.005),
    edge("notification-service", "worker-queue", 22, 0.001),
    edge("recommendation-engine", "analytics-worker", 18, 0.003),
  ]

  const dbEdges: ServiceDbEdge[] = [
    dbEdge("user-service", "postgresql", 95, 0.003),
    dbEdge("auth-service", "postgresql", 72, 0.002),
    dbEdge("order-service", "postgresql", 58, 0.005),
    dbEdge("search-service", "elasticsearch", 44, 0.008),
    dbEdge("inventory-service", "postgresql", 36, 0.004),
    dbEdge("analytics-worker", "clickhouse", 120, 0.001),
    dbEdge("recommendation-engine", "redis", 210, 0.002),
    dbEdge("worker-queue", "kafka", 48, 0.003),
    dbEdge("notification-service", "redis", 32, 0.001),
    dbEdge("payment-service", "postgresql", 28, 0.006),
  ]

  const overviews = SERVICES.map((name) => {
    const inbound = edges.filter((e) => e.targetService === name)
    const rps =
      inbound.reduce((s, e) => s + e.callCount, 0) / DURATION_SECONDS || 12
    const err =
      inbound.length > 0
        ? inbound.reduce((s, e) => s + e.errorRate, 0) / inbound.length
        : 0.002
    return overview(name, rps, err, {
      sampling: name === "web-frontend" || name === "api-gateway",
    })
  })

  const workloads: ServiceWorkload[] = SERVICES.filter(
    (s) => PLATFORMS[s] === "kubernetes",
  ).flatMap((name, i) => [
    {
      serviceName: name,
      workloadKind: "deployment",
      workloadName: `${name.replace(/-service$/, "")}-api`,
      namespace: i % 2 === 0 ? "production" : "platform",
      clusterName: "us-east-1",
      podCount: 3 + (i % 4),
      avgCpuLimitUtilization: 0.35 + (i % 5) * 0.08,
      avgMemoryLimitUtilization: 0.42 + (i % 4) * 0.1,
    },
  ])

  const platforms = new Map(Object.entries(PLATFORMS))
  const runtimes = new Map(Object.entries(RUNTIMES))

  const dbSummaries = new Map<string, ServiceDbQuerySummary>()
  for (const system of [
    "postgresql",
    "redis",
    "clickhouse",
    "elasticsearch",
    "kafka",
  ]) {
    const rps =
      dbEdges
        .filter((e) => e.dbSystem === system)
        .reduce((s, e) => s + e.callCount, 0) / DURATION_SECONDS
    dbSummaries.set(system, makeDbSummary(system, rps || 10))
  }

  return {
    edges,
    dbEdges,
    overviews,
    workloads,
    platforms,
    runtimes,
    dbSummaries,
  }
}

export const SERVICE_MAP_DURATION_SECONDS = DURATION_SECONDS
