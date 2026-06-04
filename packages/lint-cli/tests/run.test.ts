import { describe, it, expect } from "vitest";
import { mkdtempSync, writeFileSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { run } from "../src/run.js";

function tmp(content: string): string {
  const dir = mkdtempSync(join(tmpdir(), "byronwade-lint-"));
  const file = join(dir, "x.tsx");
  writeFileSync(file, content);
  return file;
}

describe("run", () => {
  it("reports errors and returns a non-zero error count", async () => {
    const file = tmp(`const x = <div className="text-[#16a34a]" />;`);
    const res = await run([file]);
    expect(res.errorCount).toBeGreaterThan(0);
  });
  it("--fix rewrites the file on-system", async () => {
    const file = tmp(`const x = <div className="text-[#16a34a]" />;`);
    await run([file], { fix: true });
    expect(readFileSync(file, "utf8")).toContain("text-brand");
  });
});
