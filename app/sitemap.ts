import type { MetadataRoute } from "next"

import { designContracts } from "@/lib/contracts/catalog"
import { docs } from "@/lib/docs/catalog"
import { systemDocs } from "@/lib/docs/system-docs"

const site = "https://ui.byronwade.com"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const contractPages = designContracts.map((c) => ({
    url: `${site}${c.href}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: c.status === "live" ? 0.9 : 0.5,
  }))

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
