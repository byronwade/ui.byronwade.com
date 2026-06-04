import { describe, it, expect } from "vitest";
import { detect } from "../src/detect.js";

describe("off-system-component detector", () => {
  it("warns on a raw <button>", () => {
    const v = detect(`const x = <button>Go</button>;`);
    const c = v.filter((x) => x.detector === "off-system-component");
    expect(c).toHaveLength(1);
    expect(c[0].severity).toBe("warn");
    expect(c[0].message).toContain("<Button>");
  });
  it("respects offSystemComponents: 'off'", () => {
    expect(detect(`const x = <button>Go</button>;`, { offSystemComponents: "off" })).toEqual([]);
  });
  it("escalates to error when configured", () => {
    const v = detect(`const x = <input />;`, { offSystemComponents: "error" });
    expect(v[0].severity).toBe("error");
  });
  it("does not flag a registry component", () => {
    expect(detect(`const x = <Button>Go</Button>;`)).toEqual([]);
  });
});
