/**
 * @ban-examples — this file intentionally contains banned code as the
 * `bad` half of each pair. check:design skips it and reports the exemption.
 */
/**
 * Few-shot good/bad pairs — short examples agents can load with the contract.
 */

export type FewShot = {
  id: string
  task: string
  good: string
  bad: string
  why: string
}

export const fewShots: readonly FewShot[] = [
  {
    id: "row-selected",
    task: "Highlight a selected index row",
    good: 'className="… bg-brand/10 …"',
    bad: 'className="… border-2 border-blue-500 …"',
    why: "Selected state is brand wash, not a new border color.",
  },
  {
    id: "panel-depth",
    task: "Raise a panel slightly",
    good: 'className="rounded-2xl bg-card edge depth-soft"',
    bad: 'className="rounded-xl shadow-lg"',
    why: "House depth utilities only — never Tailwind shadow-*.",
  },
  {
    id: "agent-disclosure",
    task: "Show agent work on an object",
    good: "Outcome summary first; activity trace in <details>.",
    bad: "Stream raw tool logs as the primary UI.",
    why: "UX law: agentOutcomeThenTrace — humans read outcomes first.",
  },
  {
    id: "typeset-docs",
    task: "Long help article",
    good: 'className="reading-ui" or typesetClass("docs")',
    bad: "Full-bleed text-sm paragraphs across the viewport",
    why: "Reading lanes are measured (≤65ch) — UI chrome stays compact.",
  },
  {
    id: "icon-import",
    task: "Add a search icon",
    good: 'import { MagnifyingGlass } from "@/lib/icons"',
    bad: 'import { Search } from "lucide-react"',
    why: "One Phosphor barrel; duotone default.",
  },
] as const
