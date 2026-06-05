import type { McpData } from "../types.js"
export function listDesignTokens(data: McpData): string {
  const rows = Object.entries(data.tokens)
    .map(
      ([name, v]) =>
        `- ${name}: light ${v.light} / dark ${v.dark}  (use bg-${name}, text-${name}, border-${name})`,
    )
    .join("\n")
  return `Design tokens (semantic — never hardcode color):\n${rows}`
}
