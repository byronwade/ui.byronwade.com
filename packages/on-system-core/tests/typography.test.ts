import { describe, it, expect } from "vitest";
import { detect } from "../src/detect.js";

describe("typography detector", () => {
  it("flags font-bold on a heading and autofixes to font-medium", () => {
    const v = detect(`const x = <h1 className="text-4xl font-bold">Hi</h1>;`);
    const t = v.filter((x) => x.detector === "typography");
    expect(t).toHaveLength(1);
    expect(t[0].fix?.text).toBe("font-medium");
  });
  it("flags font-semibold and arbitrary heavy weights on headings", () => {
    expect(detect(`const x = <h2 className="font-semibold" />;`).some((x) => x.detector === "typography")).toBe(true);
    expect(detect(`const x = <h3 className="font-[700]" />;`).some((x) => x.detector === "typography")).toBe(true);
  });
  it("allows font-medium / font-normal on headings", () => {
    expect(detect(`const x = <h1 className="text-4xl font-medium" />;`).filter((x) => x.detector === "typography")).toEqual([]);
  });
  it("does not flag bold weight on non-heading elements", () => {
    expect(detect(`const x = <span className="font-bold" />;`).filter((x) => x.detector === "typography")).toEqual([]);
  });
});
