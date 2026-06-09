import fs from "node:fs"
import path from "node:path"

import { describe, expect, it } from "vitest"

const projectRoot = path.resolve(__dirname, "../..")
const scannedRoots = ["registry", "app", "content", "docs"]
const blockedShadowUtilities = /\bshadow-(?:card|float|sm|md|lg|xl|2xl)\b/
const polarisElevationShadows = {
  "shadow-0": "none",
  "shadow-100": "0px 1px 0px 0px rgba(26, 26, 26, 0.07)",
  "shadow-200": "0px 3px 1px -1px rgba(26, 26, 26, 0.07)",
  "shadow-300": "0px 4px 6px -2px rgba(26, 26, 26, 0.20)",
  "shadow-400": "0px 8px 16px -4px rgba(26, 26, 26, 0.22)",
  "shadow-500": "0px 12px 20px -8px rgba(26, 26, 26, 0.24)",
  "shadow-600": "0px 20px 20px -8px rgba(26, 26, 26, 0.28)",
}
const lightBevel =
  "1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset, -1px 0px 0px 0px rgba(0, 0, 0, 0.13) inset, 0px -1px 0px 0px rgba(0, 0, 0, 0.17) inset, 0px 1px 0px 0px rgba(204, 204, 204, 0.5) inset"
const darkBevel =
  "1px 0px 0px 0px rgba(0, 0, 0, 0.32) inset, -1px 0px 0px 0px rgba(0, 0, 0, 0.32) inset, 0px -1px 0px 0px rgba(0, 0, 0, 0.48) inset, 0px 1px 0px 0px rgba(0, 0, 0, 0.24) inset"
const insetShadows = {
  "shadow-bevel-100":
    lightBevel,
  "shadow-inset-100":
    "0px 1px 2px 0px rgba(26, 26, 26, 0.15) inset, 0px 1px 1px 0px rgba(26, 26, 26, 0.15) inset",
  "shadow-inset-200":
    "0px 2px 1px 0px rgba(26, 26, 26, 0.20) inset, 1px 0px 1px 0px rgba(26, 26, 26, 0.12) inset, -1px 0px 1px 0px rgba(26, 26, 26, 0.12) inset",
}

function walk(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name)
    const relativePath = path.relative(projectRoot, fullPath)

    if (
      entry.isDirectory() &&
      (entry.name === "node_modules" ||
        entry.name === ".next" ||
        relativePath.startsWith("docs/superpowers"))
    ) {
      return []
    }

    if (entry.isDirectory()) return walk(fullPath)

    return /\.(tsx|ts|md|mdc|json)$/.test(entry.name) ? [fullPath] : []
  })
}

describe("edge surface defaults", () => {
  it("defines Polaris-compatible depth tokens and utilities for explicit depth previews", () => {
    const registry = JSON.parse(
      fs.readFileSync(path.join(projectRoot, "registry.json"), "utf8"),
    )
    const foundation = registry.items.find(
      (item: { name?: string }) => item.name === "foundation",
    )

    expect(foundation.cssVars.light).toMatchObject({
      ...polarisElevationShadows,
      ...insetShadows,
    })
    expect(foundation.cssVars.dark).toMatchObject({
      ...polarisElevationShadows,
      ...insetShadows,
      "shadow-bevel-100": darkBevel,
    })
    expect(foundation.cssVars.light["depth-soft"]).toBe(
      "var(--shadow-100), var(--shadow-bevel-100)",
    )
    expect(foundation.cssVars.dark["depth-soft"]).toBe(
      "var(--shadow-100), var(--shadow-bevel-100)",
    )
    expect(foundation.cssVars.light["depth-raised"]).toBe(
      "var(--shadow-300), var(--shadow-bevel-100)",
    )
    expect(foundation.cssVars.dark["depth-raised"]).toBe(
      "var(--shadow-300), var(--shadow-bevel-100)",
    )
    expect(foundation.css["@layer utilities"][".depth-none"]).toEqual({
      "box-shadow": "var(--shadow-0)",
    })
    expect(foundation.css["@layer utilities"][".depth-soft"]).toEqual({
      "box-shadow": "var(--depth-soft)",
    })
    expect(foundation.css["@layer utilities"][".depth-raised"]).toEqual({
      "box-shadow": "var(--depth-raised)",
    })
    expect(foundation.css["@layer utilities"][".depth-600"]).toEqual({
      "box-shadow": "var(--shadow-600), var(--shadow-bevel-100)",
    })
    expect(foundation.css["@layer utilities"][".depth-inset-200"]).toEqual({
      "box-shadow": "var(--shadow-inset-200)",
    })
  })

  it("does not use drop-shadow utilities in runtime, examples, or active docs", () => {
    const offenders = scannedRoots
      .flatMap((root) => walk(path.join(projectRoot, root)))
      .flatMap((filePath) => {
        const source = fs.readFileSync(filePath, "utf8")
        return source
          .split("\n")
          .map((line, index) => ({ line, index: index + 1 }))
          .filter(({ line }) => blockedShadowUtilities.test(line))
          .map(
            ({ line, index }) =>
              `${path.relative(projectRoot, filePath)}:${index}: ${line.trim()}`,
          )
      })

    expect(offenders).toEqual([])
  })
})
