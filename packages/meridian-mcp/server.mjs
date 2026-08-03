#!/usr/bin/env node
/**
 * Meridian MCP — thin alias over the shared contract-mcp server.
 * Do not fork tool lists here. Edit packages/contract-mcp + lib/platform/skeleton.ts.
 */
import { spawn } from "node:child_process"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

const here = dirname(fileURLToPath(import.meta.url))
const shared = join(here, "../contract-mcp/server.mjs")

const child = spawn(process.execPath, [shared], {
  stdio: "inherit",
  env: { ...process.env, CONTRACT_ID: process.env.CONTRACT_ID ?? "meridian" },
})

child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal)
  process.exit(code ?? 1)
})
