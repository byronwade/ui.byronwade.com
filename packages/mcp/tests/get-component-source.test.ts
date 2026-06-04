import { describe, it, expect } from "vitest";
import { getComponentSource } from "../src/tools/get-component-source.js";
import type { McpData } from "../src/types.js";

const data: McpData = {
  components: [
    { name: "button", type: "registry:ui", description: "d", deps: [], install: "i", source: "export const Button = () => null;" },
  ],
  rule: "", tokens: {}, utilities: [],
};

describe("getComponentSource", () => {
  it("returns the source for a known component", () => {
    expect(getComponentSource(data, { name: "button" })).toContain("export const Button");
  });
  it("returns a not-found message with near matches for unknown", () => {
    const r = getComponentSource(data, { name: "buton" });
    expect(r).toMatch(/not found/i);
    expect(r).toContain("button");
  });
});
