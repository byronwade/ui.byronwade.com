import type { ContractDna } from "@/lib/contracts/dna/types"

export const atlasDna = {
  id: "atlas",
  name: "Atlas",
  tagline: "Developer workbench — mono metadata, keyboard-first scanning.",
  preview: "ink",
  status: "preview",
  version: "0.1.0",
  features: [
    "Law book + atlas-* skills + CI gates",
    "Desktop density lane",
    "Command-palette / jump patterns",
    "Mono metadata discipline",
    "Optional contract MCP accelerator",
  ],
  aesthetic:
    "Ink-forward workbench, mono metadata, keyboard-first scanning chrome.",
  dnaDoc: "docs/atlas.md",
  lawBookDir: "contracts/atlas",
  voice: "Tooling precision — sharp, sparse, keyboard-native",
  paper: "Ink paper — cool steel neutrals, higher contrast chrome",
  accentName: "Steel ink (workbench brand)",
  density: "Desktop density · mono paths · cmd+k first",
  cinema: "subtle",
  must: [
    "Mono for paths, hashes, tool names, durations, and palette rows",
    "Keyboard-first: visible shortcuts, focus rings, no hover-only actions",
    "Workbench shells over marketing layouts — command palette over mega-nav",
  ],
  mustNot: [
    "Soft ops admin pastiche (Harbor) or essay reading lanes as default (Vellum)",
    "Full Meridian cinema frames as the default workbench chrome",
    "Hide primary actions behind icon-only controls without labels/tooltips",
  ],
  skillSlugs: [
    "atlas-theme",
    "atlas-compose",
    "atlas-workbench",
    "atlas-surface",
    "atlas-a11y",
  ],
  preferredRecipes: [
    "list-resource",
    "object-detail",
    "agent-rail",
    "settings-form",
    "empty-recovery",
  ],
} as const satisfies ContractDna
