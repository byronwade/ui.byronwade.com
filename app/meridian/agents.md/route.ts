import { machineDocGet } from "@/lib/contracts/machine-route"

/** /meridian/agents.md — designed HTML for humans, markdown for agents. */
export async function GET(request: Request) {
  return machineDocGet("meridian", "agents", request)
}
