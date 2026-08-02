import { NextResponse } from "next/server"

/**
 * Content negotiation for machine URLs (.md / .txt):
 * - Humans (browser navigation / Accept: text/html) → designed HTML page
 * - Agents (markdown/plain, curl, bots) → raw source
 *
 * Force raw with `?raw=1` or `?format=md`.
 * Force HTML with `?format=html`.
 */
function wantsDesignedHtml(request: Request): boolean {
  const url = new URL(request.url)
  const format = url.searchParams.get("format")
  if (url.searchParams.has("raw") || format === "md" || format === "txt") {
    return false
  }
  if (format === "html") return true

  const dest = request.headers.get("sec-fetch-dest")
  if (dest === "document") return true

  const accept = (request.headers.get("accept") ?? "").toLowerCase()
  const html = acceptIncludes(accept, "text/html")
  const markdown = acceptIncludes(accept, "text/markdown")
  const plain = acceptIncludes(accept, "text/plain")

  if (html && !markdown && !plain) return true
  if (html && (markdown || plain)) {
    // Browser Accept lists html first; prefer designed unless md/plain wins q
    return acceptIndex(accept, "text/html") <= acceptIndex(accept, "text/markdown") &&
      acceptIndex(accept, "text/html") <= acceptIndex(accept, "text/plain")
  }
  if (markdown || plain) return false

  const ua = request.headers.get("user-agent") ?? ""
  const looksBrowser =
    /Mozilla|Chrome|Safari|Firefox|Edg/i.test(ua) &&
    !/bot|crawl|spider|slurp|curl|wget|python-requests|node-fetch|axios|Go-http|Java\//i.test(
      ua,
    )
  return looksBrowser
}

function acceptIncludes(accept: string, type: string) {
  return accept.split(",").some((part) => part.trim().startsWith(type))
}

function acceptIndex(accept: string, type: string) {
  const parts = accept.split(",").map((p) => p.trim())
  const i = parts.findIndex((p) => p.startsWith(type))
  return i === -1 ? Number.POSITIVE_INFINITY : i
}

function redirectToDesigned(request: Request, designedPath: string) {
  const url = new URL(designedPath, request.url)
  return NextResponse.redirect(url, {
    status: 307,
    headers: {
      Vary: "Accept, Sec-Fetch-Dest, User-Agent",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  })
}

function rawFileResponse(
  body: string,
  contentType: "text/markdown" | "text/plain",
) {
  return new Response(body, {
    headers: {
      "Content-Type": `${contentType}; charset=utf-8`,
      Vary: "Accept, Sec-Fetch-Dest, User-Agent",
      "Cache-Control": "public, max-age=60, stale-while-revalidate=300",
    },
  })
}

export { wantsDesignedHtml, redirectToDesigned, rawFileResponse }
