import { describe, it, expect } from "vitest";
import { variantJumps } from "@/app/(docs)/_components/docs-nav-data";

describe("variantJumps", () => {
  it("returns the authored variants for a component page", () => {
    const r = variantJumps("/docs/button");
    expect(r).not.toBeNull();
    expect(r!.slug).toBe("button");
    expect(r!.jumps.length).toBeGreaterThanOrEqual(18);
    expect(r!.jumps[0]).toHaveProperty("id");
    expect(r!.jumps[0]).toHaveProperty("name");
  });

  it("returns null for the catalog index and guide pages", () => {
    expect(variantJumps("/docs")).toBeNull();
    expect(variantJumps("/docs/installation")).toBeNull();
  });

  it("returns null for a component without authored variants", () => {
    expect(variantJumps("/docs/accordion")).toBeNull();
  });

  it("returns null for an unknown slug", () => {
    expect(variantJumps("/docs/not-a-real-component")).toBeNull();
  });
});
