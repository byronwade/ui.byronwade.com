import { describe, it, expect } from "vitest";
import { detect } from "../src/detect.js";

describe("raw-color detector", () => {
  it("flags a hex in a className arbitrary value and suggests a token fix", () => {
    const v = detect(`const x = <div className="text-[#16a34a]" />;`);
    expect(v).toHaveLength(1);
    expect(v[0].detector).toBe("raw-color");
    expect(v[0].fix?.text).toBe("text-brand");
  });
  it("flags a raw color in style", () => {
    const v = detect(`const x = <div style={{ color: "#dc2626" }} />;`);
    expect(v[0].detector).toBe("raw-color");
    expect(v[0].fix?.text).toMatch(/^var\(--/);
  });
  it("does not flag on-system classes", () => {
    expect(detect(`const x = <div className="bg-brand text-foreground" />;`)).toEqual([]);
  });
  it("does not flag var(--token) arbitrary values as raw color", () => {
    expect(detect(`const x = <div className="bg-[var(--brand)]" />;`)
      .filter((v) => v.detector === "raw-color")).toEqual([]);
  });

  // FIX 1 regression: compound className value must not produce a fix
  it("does not attach a fix for a compound arbitrary className value", () => {
    const v = detect(`const x = <div className="shadow-[0_1px_2px_red]" />;`);
    const rawColorViolation = v.find((viol) => viol.detector === "raw-color");
    // If a raw-color violation is emitted for the compound value, it must have no fix
    if (rawColorViolation) {
      expect(rawColorViolation.fix).toBeUndefined();
    }
  });

  // FIX 1 regression: whole-value arbitrary class still gets a fix
  it("still attaches a fix for a whole-value arbitrary className (text-[#16a34a])", () => {
    const v = detect(`const x = <div className="text-[#16a34a]" />;`);
    const rawColorViolation = v.find((viol) => viol.detector === "raw-color");
    expect(rawColorViolation).toBeDefined();
    expect(rawColorViolation!.fix?.text).toBe("text-brand");
  });
});
