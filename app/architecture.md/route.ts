import { loadSource } from "@/lib/docs/load-source"
import {
  rawFileResponse,
  redirectToDesigned,
  wantsDesignedHtml,
} from "@/lib/docs/negotiate"

/** /architecture.md — designed HTML for humans, markdown for agents. */
export async function GET(request: Request) {
  if (wantsDesignedHtml(request)) {
    return redirectToDesigned(request, "/architecture")
  }
  const body = await loadSource("docs/architecture.md")
  return rawFileResponse(body, "text/markdown")
}
