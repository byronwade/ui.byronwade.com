import type { MetadataRoute } from "next"

import { designContracts } from "@/lib/contracts/catalog"
import { docs } from "@/lib/docs/catalog"
import { systemDocs } from "@/lib/docs/system-docs"
import { ROUTE_SLOTS } from "@/lib/platform/skeleton"

const site = "https://ui.byronwade.com"

/** Shared showcase slots every contract should expose for DX. */
const showcaseSegments = ["install", "ui", "theme", "surfaces", "for-agents"] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const contractPages = designContracts.flatMap((c) => {
    const base = {
      lastModified: now,
      changeFrequency: "weekly" as const,
    }
    const home = {
      url: `${site}${c.href}`,
      ...base,
      priority: c.status === "live" ? 0.9 : 0.55,
    }
    const showcases = showcaseSegments.map((seg) => ({
      url: `${site}${c.href}/${seg}`,
      ...base,
      priority: 0.65,
    }))
    return [home, ...showcases]
  })

  const meridianDocs = docs.map((d) => ({
    url: `${site}${d.href}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  const system = systemDocs.map((d) => ({
    url: `${site}/meridian/system/${d.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }))

  // Keep ROUTE_SLOTS referenced so sitemap stays aligned with platform nav.
  void ROUTE_SLOTS

  return [
    {
      url: site,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...contractPages,
    ...meridianDocs,
    ...system,
    {
      url: `${site}/r/meridian.contract.json`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]
}
