import { NextResponse } from "next/server"

import { buildMeridianContract } from "@/lib/contracts/meridian-contract"

export const dynamic = "force-static"

/** Machine contract — agents / MCP fetch this JSON. */
export function GET() {
  const contract = buildMeridianContract()
  return NextResponse.json(contract, {
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
