/**
 * Per-contract DNA — the ONLY layer allowed to diverge between contracts.
 * Architecture, MCP tool names, filenames, JSON keys live in lib/platform/skeleton.ts.
 */

import type { ContractPreviewTone } from "@/lib/design/knobs"

export type ContractStatus = "live" | "preview" | "soon"

export type ContractCinema = "full" | "subtle" | "none"

export type ContractDna = {
  id: string
  name: string
  tagline: string
  preview: ContractPreviewTone
  status: ContractStatus
  version: string
  features: readonly string[]
  /** One-line aesthetic for catalog cards + kit JSON. */
  aesthetic: string
  /** Deep human DNA doc under docs/. */
  dnaDoc: string
  /** Authored law books under contracts/{id}/ (DESIGN.md · AGENTS.md). */
  lawBookDir: string
  voice: string
  paper: string
  accentName: string
  density: string
  cinema: ContractCinema
  /** DNA-specific MUST lines (on top of platform agentMandate). */
  must: readonly string[]
  /** DNA-specific MUST NOT lines. */
  mustNot: readonly string[]
  /** Native skill pack — check:platform requires these on disk. */
  skillSlugs: readonly string[]
  /** Recipes this DNA prefers agents reach for first. */
  preferredRecipes: readonly string[]
}
