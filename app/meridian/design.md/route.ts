import { loadSource } from "@/lib/docs/load-source"
import {
  rawFileResponse,
  redirectToDesigned,
  wantsDesignedHtml,
} from "@/lib/docs/negotiate"

/** /design.md — designed HTML for humans, markdown for agents. */
export async function GET(request: Request) {
  if (wantsDesignedHtml(request)) {
    return redirectToDesigned(request, "/meridian/design")
  }
  const body = await loadSource("design.md")
  return rawFileResponse(body, "text/markdown")
}
