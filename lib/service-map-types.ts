export type ServicePlatform =
  | "kubernetes"
  | "cloudflare"
  | "lambda"
  | "web"
  | "unknown"

export interface ServiceEdge {
  sourceService: string
  targetService: string
  callCount: number
  estimatedCallCount: number
  errorCount: number
  errorRate: number
  avgDurationMs: number
  p95DurationMs: number
  hasSampling: boolean
  samplingWeight: number
}

export interface ServiceDbEdge {
  sourceService: string
  dbSystem: string
  callCount: number
  estimatedCallCount: number
  errorCount: number
  errorRate: number
  avgDurationMs: number
  p95DurationMs: number
  hasSampling: boolean
  samplingWeight: number
}

export interface ServiceOverview {
  serviceName: string
  environment: string
  p50LatencyMs: number
  p95LatencyMs: number
  p99LatencyMs: number
  errorRate: number
  throughput: number
  tracedThroughput: number
  hasSampling: boolean
  samplingWeight: number
}

export interface ServiceWorkload {
  serviceName: string
  workloadKind: string
  workloadName: string
  namespace: string
  clusterName: string
  podCount: number
  avgCpuLimitUtilization: number | null
  avgMemoryLimitUtilization: number | null
}

export interface ServiceDbQueryPoint {
  bucket: string
  queryCount: number
  estimatedQueryCount: number
  p50DurationMs: number
  p95DurationMs: number
}

export interface ServiceDbQuerySummary {
  summary: {
    queryCount: number
    estimatedQueryCount: number
    errorRate: number
    avgDurationMs: number
    p50DurationMs: number
    p95DurationMs: number
  }
  timeseries: ServiceDbQueryPoint[]
  topQueries: Array<{
    queryKey: string
    queryLabel: string
    queryCount: number
    estimatedQueryCount: number
    errorRate: number
    p50DurationMs: number
    p95DurationMs: number
    serviceCount: number
    sampleService: string
  }>
}

export interface ServiceMapGraph {
  edges: ServiceEdge[]
  dbEdges: ServiceDbEdge[]
  overviews: ServiceOverview[]
  workloads: ServiceWorkload[]
  platforms: Map<string, ServicePlatform>
  runtimes: Map<string, string>
  dbSummaries: Map<string, ServiceDbQuerySummary>
}
