import { loadSource } from "@/lib/docs/load-source"
import {
  rawFileResponse,
  redirectToDesigned,
  wantsDesignedHtml,
} from "@/lib/docs/negotiate"

/** /agents.md — designed HTML for humans, markdown for agents. */
export async function GET(request: Request) {
  if (wantsDesignedHtml(request)) {
    return redirectToDesigned(request, "/meridian/for-agents")
  }
  const body = await loadSource("agents.md")
  return rawFileResponse(body, "text/markdown")
}
