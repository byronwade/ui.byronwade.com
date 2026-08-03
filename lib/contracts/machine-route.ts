import {
  rawFileResponse,
  redirectToDesigned,
  wantsDesignedHtml,
} from "@/lib/docs/negotiate"
import {
  getAgentsMarkdown,
  getArchitectureMarkdown,
  getDesignMarkdown,
  getLlmsTxt,
} from "@/lib/contracts/machine-docs"

type DocKind = "design" | "agents" | "architecture" | "llms"

const humanPage: Record<DocKind, (id: string) => string> = {
  design: (id) => `/${id}/design`,
  agents: (id) => `/${id}/for-agents`,
  architecture: (id) => `/${id}/architecture`,
  llms: (id) => `/${id}/llms`,
}

async function markdownFor(kind: DocKind, contractId: string) {
  switch (kind) {
    case "design":
      return getDesignMarkdown(contractId)
    case "agents":
      return getAgentsMarkdown(contractId)
    case "architecture":
      return getArchitectureMarkdown(contractId)
    case "llms":
      return getLlmsTxt(contractId)
  }
}

/** Shared negotiated machine-doc GET handler for any contract id. */
export async function machineDocGet(
  contractId: string,
  kind: DocKind,
  request: Request,
) {
  if (wantsDesignedHtml(request)) {
    return redirectToDesigned(request, humanPage[kind](contractId))
  }
  const body = await markdownFor(kind, contractId)
  return rawFileResponse(
    body,
    kind === "llms" ? "text/plain" : "text/markdown",
  )
}

export type { DocKind }
