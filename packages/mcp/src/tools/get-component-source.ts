import type { McpData } from "../types.js";

/** Levenshtein edit distance — used to suggest near matches for typo'd names. */
function editDistance(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
    }
  }
  return dp[m][n];
}

export function getComponentSource(data: McpData, args: { name: string }): string {
  const name = (args.name ?? "").trim();
  const hit = data.components.find((c) => c.name === name);
  if (hit) return `// ${hit.name} — ${hit.install}\n\n${hit.source}`;
  // Suggest near matches: substring overlap or a small typo distance (≤2).
  const near = name
    ? data.components
        .filter(
          (c) =>
            c.name.includes(name) ||
            name.includes(c.name) ||
            editDistance(c.name, name) <= 2,
        )
        .map((c) => c.name)
    : [];
  const hint = near.length ? ` Did you mean: ${near.join(", ")}?` : "";
  return `Component "${name}" not found.${hint}`;
}
