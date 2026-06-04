import { describe, it, expect } from "vitest";
import { checkOnSystem } from "../src/tools/check-on-system.js";

describe("checkOnSystem", () => {
  it("reports on-system for clean code", () => {
    const r = checkOnSystem({ code: `const x = <div className="bg-brand p-4" />;` });
    expect(r).toMatch(/on-system|0 violation/i);
  });
  it("reports violations with line numbers for off-system code", () => {
    const r = checkOnSystem({ code: `const x = <div className="text-[#16a34a]" />;` });
    expect(r).toContain("raw-color");
    expect(r).toMatch(/line \d+/i);
  });
  it("respects offSystemComponents off", () => {
    const r = checkOnSystem({ code: `const x = <button>go</button>;`, offSystemComponents: "off" });
    expect(r).not.toContain("off-system-component");
  });
});
