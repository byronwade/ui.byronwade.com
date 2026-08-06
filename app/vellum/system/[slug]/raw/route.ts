import { loadSource } from "@/lib/docs/load-source"
import { rawFileResponse } from "@/lib/docs/negotiate"
import { getSystemDoc } from "@/lib/docs/system-docs"

type Props = {
  params: Promise<{ slug: string }>
}

/** Always-raw markdown for agents: /system/<slug>/raw */
export async function GET(_request: Request, { params }: Props) {
  const { slug } = await params
  const doc = getSystemDoc(slug)
  if (!doc) {
    return new Response("Not found", { status: 404 })
  }
  const body = await loadSource(doc.sourcePath)
  return rawFileResponse(body, "text/markdown")
}
