import { describe, expect, it } from "vitest"

import {
  allocateParticleBudget,
  getParticleVisualSettings,
  type EdgeParticleSpec,
} from "@/app/layouts/_components/service-map/service-map-particles"

function edge(callsPerSecond: number): EdgeParticleSpec {
  return {
    pathString: "M 0 0 L 100 0",
    sourceColor: "var(--chart-1)",
    callsPerSecond,
    strokeWidth: 4,
  }
}

describe("service map particles", () => {
  it("keeps animation modes ordered by intensity", () => {
    const calm = getParticleVisualSettings("calm")
    const live = getParticleVisualSettings("live")
    const surge = getParticleVisualSettings("surge")

    expect(calm.density).toBeLessThan(live.density)
    expect(live.density).toBeLessThan(surge.density)
    expect(calm.speed).toBeLessThan(live.speed)
    expect(live.speed).toBeLessThan(surge.speed)
  })

  it("uses trails without high-opacity flashing cores", () => {
    for (const mode of ["calm", "live", "surge"] as const) {
      const settings = getParticleVisualSettings(mode)
      expect(settings.trailSteps).toBeGreaterThanOrEqual(2)
      expect(settings.coreAlpha).toBeLessThan(0.9)
      expect(settings.glowAlpha).toBeLessThanOrEqual(0.2)
    }
  })

  it("respects the configured global particle budget", () => {
    const specs = new Map(
      Array.from({ length: 20 }, (_, index) => [
        `edge-${index}`,
        edge(100 + index),
      ]),
    )
    const budget = allocateParticleBudget(specs, 24)
    const total = Array.from(budget.values()).reduce(
      (sum, value) => sum + value,
      0,
    )

    expect(total).toBe(24)
  })
})
