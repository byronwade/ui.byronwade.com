import { describe, it, expect } from "vitest";
import { detect } from "../src/detect.js";

describe("arbitrary-value detector", () => {
  it("flags a px spacing arbitrary value (suggestion only)", () => {
    const v = detect(`const x = <div className="p-[13px]" />;`);
    const av = v.filter((x) => x.detector === "arbitrary-value");
    expect(av).toHaveLength(1);
    expect(av[0].fix).toBeUndefined();
  });
  it("mechanically fixes prefix-[var(--token)] to the token utility", () => {
    const v = detect(`const x = <div className="bg-[var(--brand)]" />;`);
    const av = v.filter((x) => x.detector === "arbitrary-value");
    expect(av[0].fix?.text).toBe("bg-brand");
  });
  it("does not double-flag a raw color (raw-color owns it)", () => {
    const v = detect(`const x = <div className="text-[#16a34a]" />;`);
    expect(v.filter((x) => x.detector === "arbitrary-value")).toEqual([]);
  });
});
