import { readFile } from "node:fs/promises";
import { join } from "node:path";

/** Raw Meridian AI contract — fetchable by agents at /design.md */
export async function GET() {
  const body = await readFile(join(process.cwd(), "design.md"), "utf8");
  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  });
}
