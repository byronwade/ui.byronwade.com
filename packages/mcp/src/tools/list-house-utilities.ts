import type { McpData } from "../types.js"
export function listHouseUtilities(data: McpData): string {
  return `House utilities (reuse instead of re-rolling gradients/grids/shadows):\n${data.utilities.map((u) => `- ${u}`).join("\n")}`
}
