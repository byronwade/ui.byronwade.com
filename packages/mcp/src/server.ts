import { z } from "zod";
import type { McpData } from "./types.js";
import { searchComponents } from "./tools/search-components.js";
import { getComponentSource } from "./tools/get-component-source.js";
import { checkOnSystem } from "./tools/check-on-system.js";
import { getDesignRule } from "./tools/get-design-rule.js";
import { listDesignTokens } from "./tools/list-design-tokens.js";
import { listHouseUtilities } from "./tools/list-house-utilities.js";

// Minimal structural type so this file (and its test) don't depend on the SDK's exact class.
interface Registrar {
  registerTool(
    name: string,
    config: { description: string; inputSchema?: Record<string, unknown> },
    handler: (args: Record<string, unknown>) => Promise<{ content: { type: "text"; text: string }[] }>
  ): void;
}

const text = (s: string) => ({ content: [{ type: "text" as const, text: s }] });

export function registerTools(server: Registrar, data: McpData): void {
  server.registerTool("search_components",
    { description: "Find byronwade/ui components by name or use-case. Returns description, install command, and deps.", inputSchema: { query: z.string().describe("name or use-case keywords; empty for all") } },
    async (a) => text(searchComponents(data, { query: String(a.query ?? "") })));

  server.registerTool("get_component_source",
    { description: "Return a byronwade/ui component's .tsx source.", inputSchema: { name: z.string().describe("component slug, e.g. button") } },
    async (a) => text(getComponentSource(data, { name: String(a.name ?? "") })));

  server.registerTool("check_on_system",
    { description: "Check whether a TSX snippet is on-system (tokens/primitives/house utilities). Returns violations with line numbers.", inputSchema: { code: z.string(), offSystemComponents: z.enum(["warn", "error", "off"]).optional() } },
    async (a) => text(checkOnSystem({ code: String(a.code ?? ""), offSystemComponents: a.offSystemComponents as "warn" | "error" | "off" | undefined })));

  server.registerTool("get_design_rule",
    { description: "Return the byronwade/ui design rule (the constraints to follow when generating UI).", inputSchema: {} },
    async () => text(getDesignRule(data)));

  server.registerTool("list_design_tokens",
    { description: "List byronwade/ui design tokens (names + OKLCH values). Never hardcode color.", inputSchema: {} },
    async () => text(listDesignTokens(data)));

  server.registerTool("list_house_utilities",
    { description: "List byronwade/ui house utilities (bg-grid, glow-brand, …). Reuse instead of re-rolling gradients/grids.", inputSchema: {} },
    async () => text(listHouseUtilities(data)));
}
