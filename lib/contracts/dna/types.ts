/**
 * Per-contract DNA — the ONLY layer allowed to diverge between contracts.
 * Architecture, MCP, filenames, JSON keys live in lib/platform/skeleton.ts.
 */

import type { ContractPreviewTone } from "@/lib/design/knobs"

export type ContractStatus = "live" | "preview" | "soon"

export type ContractDna = {
  id: string
  name: string
  tagline: string
  preview: ContractPreviewTone
  status: ContractStatus
  version: string
  features: readonly string[]
  /** Short aesthetic brief — design may differ; structure may not. */
  aesthetic: string
  /**
   * Route segments this contract has authored content for (design, skills,
   * system, for-agents, architecture, llms). Slots outside this list are not
   * navigated to and do not exist — see ROUTE_SLOTS `scope: "authored"`.
   * Shared slots (install, ui, theme, surfaces, home) are always present.
   */
  authored?: readonly string[]
}
