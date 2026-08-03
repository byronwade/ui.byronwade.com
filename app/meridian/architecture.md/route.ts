import { machineDocGet } from "@/lib/contracts/machine-route"

/** /meridian/architecture.md — designed HTML for humans, markdown for agents. */
export async function GET(request: Request) {
  return machineDocGet("meridian", "architecture", request)
}
