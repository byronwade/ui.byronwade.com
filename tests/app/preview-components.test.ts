import { describe, it, expect } from "vitest"
import { generateStaticParams } from "@/app/preview/components/[slug]/page"

describe("/preview/components/[slug] generateStaticParams", () => {
  it("includes every catalog component slug", async () => {
    const params = await generateStaticParams()
    expect(params).toContainEqual({ slug: "button" })
    expect(params.length).toBeGreaterThan(100)
  })
})
