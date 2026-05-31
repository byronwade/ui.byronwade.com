/**
 * Exhaustive unit tests for the pure placement math in lib/bloom/placement.ts.
 *
 * This file has no React / Motion dependencies — it tests the resolver and the
 * auto-flip geometry directly. (Note: lib/** is outside the coverage `include`
 * glob, so this suite contributes correctness assurance but not coverage %.)
 */

import { describe, it, expect } from "vitest";
import {
  parsePlacement,
  resolvePlacement,
  flipIfNeeded,
  type BloomPlacement,
} from "@/lib/bloom/placement";

const ALL_PLACEMENTS: BloomPlacement[] = [
  "top", "top-start", "top-end",
  "bottom", "bottom-start", "bottom-end",
  "left", "left-start", "left-end",
  "right", "right-start", "right-end",
];

// ---------------------------------------------------------------------------
// parsePlacement
// ---------------------------------------------------------------------------
describe("parsePlacement", () => {
  it("defaults align to center for bare sides", () => {
    expect(parsePlacement("top")).toEqual({ side: "top", align: "center" });
    expect(parsePlacement("bottom")).toEqual({ side: "bottom", align: "center" });
    expect(parsePlacement("left")).toEqual({ side: "left", align: "center" });
    expect(parsePlacement("right")).toEqual({ side: "right", align: "center" });
  });

  it("parses explicit start/end alignments", () => {
    expect(parsePlacement("top-start")).toEqual({ side: "top", align: "start" });
    expect(parsePlacement("top-end")).toEqual({ side: "top", align: "end" });
    expect(parsePlacement("bottom-start")).toEqual({ side: "bottom", align: "start" });
    expect(parsePlacement("bottom-end")).toEqual({ side: "bottom", align: "end" });
    expect(parsePlacement("left-start")).toEqual({ side: "left", align: "start" });
    expect(parsePlacement("left-end")).toEqual({ side: "left", align: "end" });
    expect(parsePlacement("right-start")).toEqual({ side: "right", align: "start" });
    expect(parsePlacement("right-end")).toEqual({ side: "right", align: "end" });
  });
});

// ---------------------------------------------------------------------------
// resolvePlacement — full table for all 12 placements
// ---------------------------------------------------------------------------
describe("resolvePlacement — exhaustive table", () => {
  // Expected resolution per the GROW / ORIGIN maps and axis/barOrder rules.
  const TABLE: Record<
    BloomPlacement,
    {
      side: string;
      align: string;
      grow: string;
      axis: string;
      transformOrigin: string;
      barOrder: string;
    }
  > = {
    top:          { side: "top",    align: "center", grow: "down",  axis: "y", transformOrigin: "top center",    barOrder: "before" },
    "top-start":  { side: "top",    align: "start",  grow: "down",  axis: "y", transformOrigin: "top center",    barOrder: "before" },
    "top-end":    { side: "top",    align: "end",    grow: "down",  axis: "y", transformOrigin: "top center",    barOrder: "before" },
    bottom:        { side: "bottom", align: "center", grow: "up",    axis: "y", transformOrigin: "bottom center", barOrder: "after"  },
    "bottom-start":{ side: "bottom", align: "start",  grow: "up",    axis: "y", transformOrigin: "bottom center", barOrder: "after"  },
    "bottom-end":  { side: "bottom", align: "end",    grow: "up",    axis: "y", transformOrigin: "bottom center", barOrder: "after"  },
    left:          { side: "left",   align: "center", grow: "right", axis: "x", transformOrigin: "left center",   barOrder: "before" },
    "left-start":  { side: "left",   align: "start",  grow: "right", axis: "x", transformOrigin: "left center",   barOrder: "before" },
    "left-end":    { side: "left",   align: "end",    grow: "right", axis: "x", transformOrigin: "left center",   barOrder: "before" },
    right:         { side: "right",  align: "center", grow: "left",  axis: "x", transformOrigin: "right center",  barOrder: "after"  },
    "right-start": { side: "right",  align: "start",  grow: "left",  axis: "x", transformOrigin: "right center",  barOrder: "after"  },
    "right-end":   { side: "right",  align: "end",    grow: "left",  axis: "x", transformOrigin: "right center",  barOrder: "after"  },
  };

  for (const p of ALL_PLACEMENTS) {
    it(`resolves "${p}" correctly`, () => {
      expect(resolvePlacement(p)).toEqual(TABLE[p]);
    });
  }

  it("y-axis sides are top/bottom; x-axis sides are left/right", () => {
    expect(resolvePlacement("top").axis).toBe("y");
    expect(resolvePlacement("bottom").axis).toBe("y");
    expect(resolvePlacement("left").axis).toBe("x");
    expect(resolvePlacement("right").axis).toBe("x");
  });

  it("barOrder is 'after' for bottom/right, 'before' for top/left", () => {
    expect(resolvePlacement("bottom").barOrder).toBe("after");
    expect(resolvePlacement("right").barOrder).toBe("after");
    expect(resolvePlacement("top").barOrder).toBe("before");
    expect(resolvePlacement("left").barOrder).toBe("before");
  });
});

// ---------------------------------------------------------------------------
// flipIfNeeded — collision/auto-flip geometry
// ---------------------------------------------------------------------------
describe("flipIfNeeded", () => {
  const NEEDED = 430;
  const PAD = 12;

  it("does NOT flip when space on the requested side is ample", () => {
    const space = { top: 1000, bottom: 1000, left: 1000, right: 1000 };
    expect(flipIfNeeded("bottom", space, NEEDED, PAD)).toBe("bottom");
    expect(flipIfNeeded("top", space, NEEDED, PAD)).toBe("top");
    expect(flipIfNeeded("left", space, NEEDED, PAD)).toBe("left");
    expect(flipIfNeeded("right", space, NEEDED, PAD)).toBe("right");
  });

  it("does NOT flip at the exact boundary (space === needed + padding)", () => {
    // 430 + 12 = 442 exactly satisfies `space[side] >= needed + padding`.
    const space = { top: 100, bottom: 442, left: 100, right: 100 };
    expect(flipIfNeeded("bottom", space, NEEDED, PAD)).toBe("bottom");
  });

  it("flips to the opposite side when requested side lacks space and opposite has more", () => {
    // bottom is cramped, top is roomy → flip to top.
    const space = { top: 1000, bottom: 50, left: 500, right: 500 };
    expect(flipIfNeeded("bottom", space, NEEDED, PAD)).toBe("top");
    // top cramped, bottom roomy → flip to bottom.
    expect(flipIfNeeded("top", { top: 50, bottom: 1000, left: 0, right: 0 }, NEEDED, PAD)).toBe("bottom");
    // left cramped, right roomy → flip to right.
    expect(flipIfNeeded("left", { top: 0, bottom: 0, left: 50, right: 1000 }, NEEDED, PAD)).toBe("right");
    // right cramped, left roomy → flip to left.
    expect(flipIfNeeded("right", { top: 0, bottom: 0, left: 1000, right: 50 }, NEEDED, PAD)).toBe("left");
  });

  it("preserves alignment when flipping (start/end)", () => {
    const space = { top: 1000, bottom: 50, left: 0, right: 0 };
    expect(flipIfNeeded("bottom-start", space, NEEDED, PAD)).toBe("top-start");
    expect(flipIfNeeded("bottom-end", space, NEEDED, PAD)).toBe("top-end");
  });

  it("drops the align suffix when alignment is center on flip", () => {
    const space = { top: 1000, bottom: 50, left: 0, right: 0 };
    // "bottom" parses to center → flipped result is bare "top", not "top-center".
    expect(flipIfNeeded("bottom", space, NEEDED, PAD)).toBe("top");
  });

  it("does NOT flip when the requested side lacks space but the opposite is equal or worse", () => {
    // Both cramped, opposite not strictly greater → stay put.
    const equal = { top: 50, bottom: 50, left: 0, right: 0 };
    expect(flipIfNeeded("bottom", equal, NEEDED, PAD)).toBe("bottom");
    const worseOpposite = { top: 20, bottom: 50, left: 0, right: 0 };
    expect(flipIfNeeded("bottom", worseOpposite, NEEDED, PAD)).toBe("bottom");
  });

  it("flips toward the larger-opposite even when both sides are insufficient", () => {
    // Neither side fits 430, but top (300) > bottom (50) → flip to the larger.
    const space = { top: 300, bottom: 50, left: 0, right: 0 };
    expect(flipIfNeeded("bottom", space, NEEDED, PAD)).toBe("top");
  });
});
