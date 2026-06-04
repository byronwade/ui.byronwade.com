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

  // Non-spacing/non-radius arbitrary values must NOT be flagged
  it("does not flag duration-[0.35s] (animation utility, no scale)", () => {
    const v = detect(`const x = <div className="duration-[0.35s]" />;`);
    expect(v.filter((x) => x.detector === "arbitrary-value")).toEqual([]);
  });
  it("does not flag ease-[cubic-bezier(0.22,1,0.36,1)] (contains function)", () => {
    const v = detect(`const x = <div className="ease-[cubic-bezier(0.22,1,0.36,1)]" />;`);
    expect(v.filter((x) => x.detector === "arbitrary-value")).toEqual([]);
  });
  it("does not flag transition-[color,box-shadow] (multi-value with comma)", () => {
    const v = detect(`const x = <div className="transition-[color,box-shadow]" />;`);
    expect(v.filter((x) => x.detector === "arbitrary-value")).toEqual([]);
  });
  it("does not flag translate-y-[calc(-50%-2px)] (calc() expression)", () => {
    const v = detect(`const x = <div className="translate-y-[calc(-50%-2px)]" />;`);
    expect(v.filter((x) => x.detector === "arbitrary-value")).toEqual([]);
  });
  it("does not flag top-[60%] (percentage, not a bare length)", () => {
    const v = detect(`const x = <div className="top-[60%]" />;`);
    expect(v.filter((x) => x.detector === "arbitrary-value")).toEqual([]);
  });
  it("does not flag text-[13px] (text prefix has no token scale)", () => {
    const v = detect(`const x = <div className="text-[13px]" />;`);
    expect(v.filter((x) => x.detector === "arbitrary-value")).toEqual([]);
  });
  it("does not flag rounded-[inherit] (keyword, not a bare length)", () => {
    const v = detect(`const x = <div className="rounded-[inherit]" />;`);
    expect(v.filter((x) => x.detector === "arbitrary-value")).toEqual([]);
  });

  // Radius scale prefix with a bare length MUST flag
  it("flags rounded-[2px] (radius scale prefix with bare px value)", () => {
    const v = detect(`const x = <div className="rounded-[2px]" />;`);
    const av = v.filter((x) => x.detector === "arbitrary-value");
    expect(av).toHaveLength(1);
    expect(av[0].fix).toBeUndefined();
    expect(av[0].message).toContain("rounded-[2px]");
  });
});
