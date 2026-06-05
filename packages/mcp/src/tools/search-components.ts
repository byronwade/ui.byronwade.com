import type { McpData } from "../types.js"

export function searchComponents(
  data: McpData,
  args: { query: string },
): string {
  const q = (args.query ?? "").trim().toLowerCase()
  const matches = data.components.filter(
    (c) =>
      q === "" ||
      c.name.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q),
  )
  if (matches.length === 0) return `No components match "${args.query}".`
  return matches
    .map(
      (c) =>
        `## ${c.name} (${c.type})\n${c.description}\nInstall: ${c.install}\nDeps: ${c.deps.join(", ") || "none"}`,
    )
    .join("\n\n")
}
