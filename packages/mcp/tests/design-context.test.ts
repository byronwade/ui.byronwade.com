import { describe, it, expect } from "vitest";
import { getDesignRule } from "../src/tools/get-design-rule.js";
import { listDesignTokens } from "../src/tools/list-design-tokens.js";
import { listHouseUtilities } from "../src/tools/list-house-utilities.js";
import type { McpData } from "../src/types.js";

const data: McpData = {
  components: [],
  rule: "# byronwade rule\nTokens only.",
  tokens: { brand: { light: "oklch(0.6 0.17 148)", dark: "oklch(0.7 0.17 148)" } },
  utilities: ["bg-grid", "glow-brand"],
};

describe("design-context tools", () => {
  it("getDesignRule returns the rule text", () => {
    expect(getDesignRule(data)).toContain("Tokens only");
  });
  it("listDesignTokens lists names + values", () => {
    const r = listDesignTokens(data);
    expect(r).toContain("brand");
    expect(r).toContain("oklch(0.6 0.17 148)");
  });
  it("listHouseUtilities lists utilities", () => {
    const r = listHouseUtilities(data);
    expect(r).toContain("bg-grid");
    expect(r).toContain("glow-brand");
  });
});
