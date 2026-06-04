import { describe, it, expect } from "vitest";
import { searchComponents } from "../src/tools/search-components.js";
import type { McpData } from "../src/types.js";

const data: McpData = {
  components: [
    { name: "button", type: "registry:ui", description: "A clickable button", deps: ["@byronwade/utils"], install: "npx shadcn@latest add @byronwade/button", source: "x" },
    { name: "table", type: "registry:ui", description: "Tabular data display", deps: [], install: "npx shadcn@latest add @byronwade/table", source: "x" },
  ],
  rule: "", tokens: {}, utilities: [],
};

describe("searchComponents", () => {
  it("matches by name substring", () => {
    expect(searchComponents(data, { query: "butt" })).toContain("button");
    expect(searchComponents(data, { query: "butt" })).not.toContain("table");
  });
  it("matches by description substring (case-insensitive)", () => {
    expect(searchComponents(data, { query: "TABULAR" })).toContain("table");
  });
  it("includes the install command and deps", () => {
    expect(searchComponents(data, { query: "button" })).toContain("npx shadcn@latest add @byronwade/button");
  });
  it("empty query returns all components", () => {
    const r = searchComponents(data, { query: "" });
    expect(r).toContain("button");
    expect(r).toContain("table");
  });
  it("no match returns a clear message", () => {
    expect(searchComponents(data, { query: "zzzz" })).toMatch(/no components/i);
  });
});
