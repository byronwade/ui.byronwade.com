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
});
