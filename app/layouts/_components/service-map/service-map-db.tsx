import {
  Database,
  Flame,
  MagnifyingGlass,
  PaperPlaneTilt,
  Stack,
  type Icon,
} from "@/lib/icons"

export type DbCategory = "database" | "cache" | "queue" | "search"

export interface DbDescriptor {
  category: DbCategory
  Icon: Icon
  label: string
  color: string
  branded: boolean
}

const CATEGORY_COLOR: Record<DbCategory, string> = {
  database: "var(--chart-1)",
  cache: "var(--destructive)",
  queue: "var(--chart-4)",
  search: "var(--chart-3)",
}

const CATEGORY_ICON: Record<DbCategory, Icon> = {
  database: Database,
  cache: Flame,
  queue: PaperPlaneTilt,
  search: MagnifyingGlass,
}

const CATEGORY_FALLBACK_LABEL: Record<DbCategory, string> = {
  database: "Database",
  cache: "Cache",
  queue: "Queue",
  search: "Search",
}

const CACHE_SYSTEMS = new Set(["redis", "memcached", "hazelcast"])
const QUEUE_SYSTEMS = new Set([
  "kafka",
  "rabbitmq",
  "pulsar",
  "nats",
  "activemq",
  "sqs",
])
const SEARCH_SYSTEMS = new Set(["elasticsearch", "opensearch", "solr"])

function categoryOf(system: string): DbCategory {
  if (CACHE_SYSTEMS.has(system)) return "cache"
  if (QUEUE_SYSTEMS.has(system)) return "queue"
  if (SEARCH_SYSTEMS.has(system)) return "search"
  return "database"
}

export function getDbDescriptor(system: string | undefined): DbDescriptor {
  const s = (system ?? "").toLowerCase()

  switch (s) {
    case "postgresql":
    case "postgres":
      return {
        category: "database",
        Icon: Database,
        label: "PostgreSQL",
        color: "var(--chart-1)",
        branded: true,
      }
    case "mysql":
    case "mariadb":
      return {
        category: "database",
        Icon: Database,
        label: s === "mariadb" ? "MariaDB" : "MySQL",
        color: "var(--chart-2)",
        branded: true,
      }
    case "clickhouse":
      return {
        category: "database",
        Icon: Stack,
        label: "ClickHouse",
        color: "var(--chart-5)",
        branded: true,
      }
    case "mongodb":
      return {
        category: "database",
        Icon: Database,
        label: "MongoDB",
        color: "var(--chart-3)",
        branded: true,
      }
    case "redis":
      return {
        category: "cache",
        Icon: Flame,
        label: "Redis",
        color: "var(--destructive)",
        branded: true,
      }
    case "elasticsearch":
    case "opensearch":
      return {
        category: "search",
        Icon: MagnifyingGlass,
        label: s === "opensearch" ? "OpenSearch" : "Elasticsearch",
        color: "var(--chart-3)",
        branded: true,
      }
    case "kafka":
      return {
        category: "queue",
        Icon: PaperPlaneTilt,
        label: "Kafka",
        color: "var(--chart-4)",
        branded: true,
      }
  }

  const category = categoryOf(s)
  return {
    category,
    Icon: CATEGORY_ICON[category],
    label: system ?? CATEGORY_FALLBACK_LABEL[category],
    color: CATEGORY_COLOR[category],
    branded: false,
  }
}

export function getDbColor(system: string | undefined): string {
  return getDbDescriptor(system).color
}

export function withAlpha(color: string, alpha: number): string {
  return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`
}
