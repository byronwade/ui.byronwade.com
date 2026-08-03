import { machineDocGet } from "@/lib/contracts/machine-route"

export async function GET(request: Request) {
  return machineDocGet("atlas", "architecture", request)
}
