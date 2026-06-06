import { describe, expect, it } from "vitest"

import { getServiceLegendColor } from "@/lib/service-map-colors"
import { getDbColor } from "@/app/layouts/_components/service-map/service-map-db"
import { getPlatformColor } from "@/app/layouts/_components/service-map/service-map-utils"

const RAW_COLOR_PATTERN = /#[0-9a-fA-F]{3,8}\b|\brgb\(|\bhsl\(|\boklch\(/

describe("service map palette", () => {
  it("uses token variables for service legend colors", () => {
    const services = ["web", "api", "worker", "db", "queue", "cache"]

    for (const service of services) {
      const color = getServiceLegendColor(service, services)
      expect(color).toMatch(/^var\(--chart-[1-5]\)$/)
      expect(color).not.toMatch(RAW_COLOR_PATTERN)
    }
  })

  it("uses token variables for platform colors", () => {
    for (const platform of [
      "kubernetes",
      "cloudflare",
      "lambda",
      "web",
      undefined,
    ] as const) {
      const color = getPlatformColor(platform)
      expect(color).toMatch(/^var\(--(?:brand|chart-[1-5]|muted-foreground)\)$/)
      expect(color).not.toMatch(RAW_COLOR_PATTERN)
    }
  })

  it("uses token variables for database colors", () => {
    for (const system of [
      "postgresql",
      "mysql",
      "clickhouse",
      "mongodb",
      "redis",
      "elasticsearch",
      "kafka",
      "unknown",
    ]) {
      const color = getDbColor(system)
      expect(color).toMatch(/^var\(--(?:chart-[1-5]|brand|destructive)\)$/)
      expect(color).not.toMatch(RAW_COLOR_PATTERN)
    }
  })
})
