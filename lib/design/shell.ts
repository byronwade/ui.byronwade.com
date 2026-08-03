/**
 * Shell rhythm — spacing, sizing, and typography that follow the surface.
 *
 * One component family; `data-surface` remaps CSS vars. Agents pick a surface,
 * never invent off-scale pixel heights, type, or pads.
 */
import type { SurfaceId } from "@/lib/design/grammar"

/** 4px Fluent-style spacing scale (rem). */
export const spaceScale = {
  0: "0",
  1: "0.25rem", // 4
  2: "0.5rem", // 8
  3: "0.75rem", // 12
  4: "1rem", // 16
  5: "1.25rem", // 20
  6: "1.5rem", // 24
  8: "2rem", // 32
  10: "2.5rem", // 40
  12: "3rem", // 48
} as const

export type SpaceStep = keyof typeof spaceScale

/** Control height tokens — closed; Button sizes map here. */
export const controlScale = {
  xs: { token: "--control-h-xs", px: 24 },
  sm: { token: "--control-h-sm", px: 28 },
  default: { token: "--control-h", px: 32 },
  md: { token: "--control-h-md", px: 36 },
  lg: { token: "--control-h-lg", px: 40 },
  touch: { token: "--control-h-touch", px: 44 },
} as const

export type ControlStep = keyof typeof controlScale

/**
 * Per-surface rhythm — source of truth mirrored in globals.css `[data-surface]`.
 * Keep CSS and this table in sync (check:design validates keys).
 */
export const shellRhythm = {
  application: {
    label: "Application",
    job: "Operate data-rich work",
    controlPx: 32,
    rowPx: 40,
    padPx: 20,
    gapPx: 12,
    typeUiPx: 14,
    typeRowPx: 13,
    typeMetaPx: 11,
    typeLabelPx: 10,
    leadingUi: 1.35,
    leadingTight: 1.25,
    css: {
      "--control-h": "2rem",
      "--row-h": "2.5rem",
      "--surface-pad": "1.25rem",
      "--surface-gap": "0.75rem",
      "--type-ui": "0.875rem",
      "--type-row": "0.8125rem",
      "--type-meta": "0.6875rem",
      "--type-label": "0.625rem",
      "--leading-ui": "1.35",
      "--leading-tight": "1.25",
    },
  },
  desktop: {
    label: "Desktop",
    job: "Keyboard + pointer chrome",
    controlPx: 28,
    rowPx: 32,
    padPx: 12,
    gapPx: 8,
    typeUiPx: 13,
    typeRowPx: 12,
    typeMetaPx: 10,
    typeLabelPx: 10,
    leadingUi: 1.3,
    leadingTight: 1.2,
    css: {
      "--control-h": "1.75rem",
      "--row-h": "2rem",
      "--surface-pad": "0.75rem",
      "--surface-gap": "0.5rem",
      "--type-ui": "0.8125rem",
      "--type-row": "0.75rem",
      "--type-meta": "0.625rem",
      "--type-label": "0.625rem",
      "--leading-ui": "1.3",
      "--leading-tight": "1.2",
    },
  },
  marketing: {
    label: "Marketing",
    job: "Present · cinema · docs chrome",
    controlPx: 36,
    rowPx: 44,
    padPx: 24,
    gapPx: 20,
    typeUiPx: 16,
    typeRowPx: 14,
    typeMetaPx: 12,
    typeLabelPx: 10,
    leadingUi: 1.45,
    leadingTight: 1.3,
    css: {
      "--control-h": "2.25rem",
      "--row-h": "2.75rem",
      "--surface-pad": "1.5rem",
      "--surface-gap": "1.25rem",
      "--type-ui": "1rem",
      "--type-row": "0.875rem",
      "--type-meta": "0.75rem",
      "--type-label": "0.625rem",
      "--leading-ui": "1.45",
      "--leading-tight": "1.3",
    },
  },
  mobile: {
    label: "Mobile",
    job: "Thumb-first · 44px floor",
    controlPx: 44,
    rowPx: 52,
    padPx: 16,
    gapPx: 12,
    typeUiPx: 16,
    typeRowPx: 15,
    typeMetaPx: 12,
    typeLabelPx: 11,
    leadingUi: 1.4,
    leadingTight: 1.3,
    css: {
      "--control-h": "2.75rem",
      "--row-h": "3.25rem",
      "--surface-pad": "1rem",
      "--surface-gap": "0.75rem",
      "--type-ui": "1rem",
      "--type-row": "0.9375rem",
      "--type-meta": "0.75rem",
      "--type-label": "0.6875rem",
      "--leading-ui": "1.4",
      "--leading-tight": "1.3",
    },
  },
} as const satisfies Record<
  SurfaceId,
  {
    label: string
    job: string
    controlPx: number
    rowPx: number
    padPx: number
    gapPx: number
    typeUiPx: number
    typeRowPx: number
    typeMetaPx: number
    typeLabelPx: number
    leadingUi: number
    leadingTight: number
    css: Record<string, string>
  }
>

export type ShellRhythm = (typeof shellRhythm)[SurfaceId]

/** Shell type utilities — map to CSS classes in globals. */
export const shellTypeClass = {
  ui: "type-ui",
  row: "type-row",
  meta: "type-meta",
  label: "type-label",
} as const

export type ShellTypeRole = keyof typeof shellTypeClass

/** Spacing / sizing utilities that read surface CSS vars. */
export const shellLayoutClass = {
  pad: "shell-pad",
  gap: "shell-gap",
  stack: "shell-stack",
  control: "h-control",
  row: "h-row",
} as const

/**
 * Laws agents must keep — mirrored in design.md / density.md.
 */
export const shellLaws = {
  densityFollowsTask: true,
  oneComponentManyDensities: true,
  fourPxGrid: true,
  touchFloorMobilePx: 44,
  desktopChromeMinPx: 28,
  indexesDenseDetailBreathes: true,
  typeFromSurfaceVars: true,
  noArbitraryPxHeights: true,
  noArbitraryPxType: true,
  monoForData: true,
  displayMediumMax: true,
} as const

export function getShellRhythm(surface: SurfaceId): ShellRhythm {
  return shellRhythm[surface]
}
