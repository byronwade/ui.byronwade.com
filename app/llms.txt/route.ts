import { loadSource } from "@/lib/docs/load-source"
import {
  rawFileResponse,
  redirectToDesigned,
  wantsDesignedHtml,
} from "@/lib/docs/negotiate"

/** /llms.txt — designed HTML for humans, plain text for agents. */
export async function GET(request: Request) {
  if (wantsDesignedHtml(request)) {
    return redirectToDesigned(request, "/llms")
  }
  const body = await loadSource("llms.txt")
  return rawFileResponse(body, "text/plain")
}
