import { machineDocGet } from "@/lib/contracts/machine-route"

/** /meridian/llms.txt — designed HTML for humans, plain text for agents. */
export async function GET(request: Request) {
  return machineDocGet("meridian", "llms", request)
}
