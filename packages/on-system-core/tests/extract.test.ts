import { describe, it, expect } from "vitest";
import { parse } from "../src/parse.js";
import { extractClassTokens, extractStyleStrings, extractJsxElements, extractElementClasses } from "../src/extract.js";

describe("extractClassTokens", () => {
  it("reads string literal classNames with correct offsets", () => {
    const code = `const x = <div className="bg-brand p-4" />;`;
    const toks = extractClassTokens(parse(code));
    expect(toks.map((t) => t.value)).toEqual(["bg-brand", "p-4"]);
    expect(code.slice(...toks[0].range)).toBe("bg-brand");
  });
  it("reads cn() and template literal args", () => {
    const code = "const x = <div className={cn('text-[#333]', `bg-grid`)} />;";
    const toks = extractClassTokens(parse(code));
    expect(toks.map((t) => t.value)).toContain("text-[#333]");
    expect(toks.map((t) => t.value)).toContain("bg-grid");
  });
  it("skips dynamic expressions", () => {
    const code = "const x = <div className={cls} />;";
    expect(extractClassTokens(parse(code))).toEqual([]);
  });
});

describe("extractStyleStrings", () => {
  it("reads literal style values with prop + offsets", () => {
    const code = `const x = <div style={{ color: "#16a34a" }} />;`;
    const s = extractStyleStrings(parse(code));
    expect(s[0].prop).toBe("color");
    expect(code.slice(...s[0].range)).toBe("#16a34a");
  });
});

describe("extractJsxElements", () => {
  it("reads element names", () => {
    const code = `const x = <button><Input /></button>;`;
    expect(extractJsxElements(parse(code)).map((e) => e.name)).toEqual(["button", "Input"]);
  });
});

describe("extractElementClasses", () => {
  it("pairs each element with its own class tokens", () => {
    const code = `const x = <h1 className="text-4xl font-bold"><span className="bg-brand" /></h1>;`;
    const els = extractElementClasses(parse(code));
    const h1 = els.find((e) => e.name === "h1")!;
    expect(h1.classes.map((c) => c.value)).toEqual(["text-4xl", "font-bold"]);
    const span = els.find((e) => e.name === "span")!;
    expect(span.classes.map((c) => c.value)).toEqual(["bg-brand"]);
  });
});
