import { describe, it, expect } from "vitest";
import { registerTools } from "../src/server.js";
import { data } from "../src/data.js";

describe("registerTools", () => {
  it("registers all six tools with a passed registrar", () => {
    const names: string[] = [];
    const fakeServer = {
      registerTool(name: string) { names.push(name); },
    };
    registerTools(fakeServer as never, data);
    expect(names.sort()).toEqual([
      "check_on_system", "get_component_source", "get_design_rule",
      "list_design_tokens", "list_house_utilities", "search_components",
    ]);
  });
});
