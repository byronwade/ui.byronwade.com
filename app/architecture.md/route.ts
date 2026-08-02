import { readFile } from "node:fs/promises"
import { join } from "node:path"

/** Raw architecture doc — fetchable by agents at /architecture.md */
export async function GET() {
  const body = await readFile(
    join(process.cwd(), "docs/architecture.md"),
    "utf8",
  )
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  })
}
