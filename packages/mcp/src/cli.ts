#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { registerTools } from "./server.js"
import { data } from "./data.js"

async function main() {
  const server = new McpServer({ name: "byronwade-ui", version: "0.1.0" })
  registerTools(server as never, data)
  await server.connect(new StdioServerTransport())
}
main().catch((err) => {
  console.error(err)
  process.exit(1)
})
