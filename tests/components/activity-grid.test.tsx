/**
 * Exhaustive tests for <ActivityGrid />
 *
 * Component source: components/ui/activity-grid.tsx
 * API:
 *   data     number[]   – per-cell counts (required)
 *   columns  number     – default 26, controls CSS grid-template-columns
 *   className string    – forwarded to the wrapper div
 *
 * Intensity buckets (relative to max value in data):
 *   0   → bg-muted         (level 0 — zero value)
 *   1   → bg-brand/30      (level 1)
 *   2   → bg-brand/50      (level 2)
 *   3   → bg-brand/75      (level 3)
 *   4   → bg-brand         (level 4 — full brand)
 *
 * Cell count formula: level = n<=0 ? 0 : clamp(ceil((n/max)*4), 1, 4)
 */

import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";
import { ActivityGrid } from "@/components/ui/activity-grid";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns all <span> child elements of the rendered grid wrapper. */
function getCells(container: HTMLElement): HTMLCollectionOf<HTMLSpanElement> {
  const wrapper = container.firstChild as HTMLElement;
  return wrapper.children as HTMLCollectionOf<HTMLSpanElement>;
}

/** Array of the class strings for every cell in the container. */
function cellClasses(container: HTMLElement): string[] {
  return Array.from(getCells(container)).map((el) => el.className);
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing — default usage
// ---------------------------------------------------------------------------

describe("ActivityGrid — renders without crashing", () => {
  it("renders with a minimal single-cell data array", () => {
    const { container } = render(<ActivityGrid data={[1]} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.tagName).toBe("DIV");
  });

  it("renders with an empty data array (no cells)", () => {
    const { container } = render(<ActivityGrid data={[]} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toBeInTheDocument();
    expect(wrapper.children).toHaveLength(0);
  });

  it("renders the correct number of cells matching data length", () => {
    const data = Array.from({ length: 26 * 7 }, (_, i) => i % 10);
    const { container } = render(<ActivityGrid data={data} />);
    expect(getCells(container)).toHaveLength(26 * 7);
  });

  it("each cell is a <span> element", () => {
    const { container } = render(<ActivityGrid data={[0, 1, 2]} />);
    const cells = Array.from(getCells(container));
    cells.forEach((cell) => expect(cell.tagName).toBe("SPAN"));
  });
});

// ---------------------------------------------------------------------------
// 2. Intensity levels — class assignment relative to max
// ---------------------------------------------------------------------------

describe("ActivityGrid — intensity level classes", () => {
  it("level 0 (zero value) → bg-muted", () => {
    const { container } = render(<ActivityGrid data={[0]} columns={1} />);
    const cell = getCells(container)[0];
    expect(cell.className).toContain("bg-muted");
  });

  it("level 1 (lowest non-zero) → bg-brand/30", () => {
    // data=[0,1,2,3,4] → max=4, level(1)=ceil(1/4*4)=1
    const { container } = render(<ActivityGrid data={[0, 1, 2, 3, 4]} columns={5} />);
    const cells = Array.from(getCells(container));
    expect(cells[1].className).toContain("bg-brand/30");
  });

  it("level 2 → bg-brand/50", () => {
    // data=[0,1,2,3,4] → max=4, level(2)=ceil(2/4*4)=2
    const { container } = render(<ActivityGrid data={[0, 1, 2, 3, 4]} columns={5} />);
    const cells = Array.from(getCells(container));
    expect(cells[2].className).toContain("bg-brand/50");
  });

  it("level 3 → bg-brand/75", () => {
    // data=[0,1,2,3,4] → max=4, level(3)=ceil(3/4*4)=3
    const { container } = render(<ActivityGrid data={[0, 1, 2, 3, 4]} columns={5} />);
    const cells = Array.from(getCells(container));
    expect(cells[3].className).toContain("bg-brand/75");
  });

  it("level 4 (max value) → bg-brand (full)", () => {
    // data=[0,1,2,3,4] → max=4, level(4)=ceil(4/4*4)=4
    const { container } = render(<ActivityGrid data={[0, 1, 2, 3, 4]} columns={5} />);
    const cells = Array.from(getCells(container));
    // bg-brand but NOT bg-brand/30, bg-brand/50, or bg-brand/75
    expect(cells[4].className).toContain("bg-brand");
    expect(cells[4].className).not.toContain("bg-brand/");
  });

  it("all-zero data: every cell is bg-muted", () => {
    const data = Array(10).fill(0);
    const { container } = render(<ActivityGrid data={data} columns={10} />);
    cellClasses(container).forEach((cls) => expect(cls).toContain("bg-muted"));
  });

  it("all-same non-zero data: every cell maps to level 4 (full brand)", () => {
    // When all values equal max, ceil((n/max)*4) = 4 for every cell
    const data = Array(10).fill(5);
    const { container } = render(<ActivityGrid data={data} columns={10} />);
    cellClasses(container).forEach((cls) => {
      expect(cls).toContain("bg-brand");
      expect(cls).not.toContain("bg-brand/");
    });
  });

  it("single positive cell is always level 4 (it equals the max)", () => {
    const { container } = render(<ActivityGrid data={[7]} columns={1} />);
    const cell = getCells(container)[0];
    expect(cell.className).toContain("bg-brand");
    expect(cell.className).not.toContain("bg-brand/");
  });

  it("negative values are treated as zero (bg-muted)", () => {
    const { container } = render(<ActivityGrid data={[-5, 3]} columns={2} />);
    const cells = Array.from(getCells(container));
    // -5 → n<=0 → level 0 → bg-muted
    expect(cells[0].className).toContain("bg-muted");
    // 3 is the max → level 4 → bg-brand
    expect(cells[1].className).toContain("bg-brand");
  });

  it("computes intensity relative to max, not absolute values", () => {
    // With data=[0, 100, 200, 300, 400] max=400
    // level(100)=ceil(100/400*4)=1, level(400)=4
    const { container } = render(
      <ActivityGrid data={[0, 100, 200, 300, 400]} columns={5} />
    );
    const cells = Array.from(getCells(container));
    expect(cells[0].className).toContain("bg-muted");
    expect(cells[1].className).toContain("bg-brand/30");
    expect(cells[2].className).toContain("bg-brand/50");
    expect(cells[3].className).toContain("bg-brand/75");
    expect(cells[4].className).toContain("bg-brand");
    expect(cells[4].className).not.toContain("bg-brand/");
  });

  it("level is capped at 4 even for very large values", () => {
    // value=100 with max=100 → ceil(100/100*4)=4
    const { container } = render(<ActivityGrid data={[100]} columns={1} />);
    const cell = getCells(container)[0];
    expect(cell.className).toContain("bg-brand");
    expect(cell.className).not.toContain("bg-brand/");
  });
});

// ---------------------------------------------------------------------------
// 3. The `columns` prop
// ---------------------------------------------------------------------------

describe("ActivityGrid — columns prop", () => {
  it("defaults to 26 columns when prop is omitted", () => {
    const { container } = render(<ActivityGrid data={[1, 2, 3]} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.gridTemplateColumns).toBe("repeat(26, minmax(0, 1fr))");
  });

  it("respects columns=12", () => {
    const data = Array.from({ length: 12 * 7 }, (_, i) => i % 5);
    const { container } = render(<ActivityGrid data={data} columns={12} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.gridTemplateColumns).toBe("repeat(12, minmax(0, 1fr))");
  });

  it("respects columns=52 (full year)", () => {
    const data = Array.from({ length: 52 * 7 }, (_, i) => i % 8);
    const { container } = render(<ActivityGrid data={data} columns={52} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.gridTemplateColumns).toBe("repeat(52, minmax(0, 1fr))");
  });

  it("respects columns=1 (single-column)", () => {
    const { container } = render(<ActivityGrid data={[0, 1]} columns={1} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.gridTemplateColumns).toBe("repeat(1, minmax(0, 1fr))");
  });

  it("respects columns=7 (week columns)", () => {
    const data = Array.from({ length: 7 }, (_, i) => i);
    const { container } = render(<ActivityGrid data={data} columns={7} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.gridTemplateColumns).toBe("repeat(7, minmax(0, 1fr))");
  });

  it("the grid wrapper always has the `grid` class", () => {
    const { container } = render(<ActivityGrid data={[1]} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("grid");
  });

  it("the grid wrapper has `w-fit` class", () => {
    const { container } = render(<ActivityGrid data={[1]} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("w-fit");
  });

  it("the grid wrapper has `gap-1` class", () => {
    const { container } = render(<ActivityGrid data={[1]} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("gap-1");
  });
});

// ---------------------------------------------------------------------------
// 4. The `className` prop
// ---------------------------------------------------------------------------

describe("ActivityGrid — className prop", () => {
  it("forwards a custom class to the wrapper div", () => {
    const { container } = render(
      <ActivityGrid data={[1]} className="my-custom-class" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("my-custom-class");
  });

  it("merges the custom class with the base grid classes", () => {
    const { container } = render(
      <ActivityGrid data={[1]} className="transition-all duration-200" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("grid");
    expect(wrapper.className).toContain("transition-all");
    expect(wrapper.className).toContain("duration-200");
  });

  it("className is undefined by default — base classes still present", () => {
    const { container } = render(<ActivityGrid data={[1]} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("grid");
    expect(wrapper.className).toContain("w-fit");
  });

  it("multiple space-separated custom classes are all forwarded", () => {
    const { container } = render(
      <ActivityGrid data={[1]} className="foo bar baz" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.className).toContain("foo");
    expect(wrapper.className).toContain("bar");
    expect(wrapper.className).toContain("baz");
  });
});

// ---------------------------------------------------------------------------
// 5. Cell shape classes
// ---------------------------------------------------------------------------

describe("ActivityGrid — cell shape classes", () => {
  it("each cell has `size-2.5` class", () => {
    const { container } = render(<ActivityGrid data={[1, 2, 3]} columns={3} />);
    Array.from(getCells(container)).forEach((cell) =>
      expect(cell.className).toContain("size-2.5")
    );
  });

  it("each cell has `rounded-full` class", () => {
    const { container } = render(<ActivityGrid data={[1, 2, 3]} columns={3} />);
    Array.from(getCells(container)).forEach((cell) =>
      expect(cell.className).toContain("rounded-full")
    );
  });
});

// ---------------------------------------------------------------------------
// 6. Edge cases & boundary conditions
// ---------------------------------------------------------------------------

describe("ActivityGrid — edge cases", () => {
  it("data with a single zero: max clamps to 1, cell is bg-muted", () => {
    // max = Math.max(1, ...data) → 1 when all data is 0
    const { container } = render(<ActivityGrid data={[0]} columns={1} />);
    expect(getCells(container)[0].className).toContain("bg-muted");
  });

  it("max guard prevents division-by-zero when data is all zeros", () => {
    // max = Math.max(1, 0, 0) = 1, level(0) = 0 → bg-muted (no crash)
    expect(() => render(<ActivityGrid data={[0, 0, 0]} columns={3} />)).not.toThrow();
  });

  it("large data array (365 cells) renders without crashing", () => {
    const data = Array.from({ length: 365 }, (_, i) => i % 15);
    expect(() => render(<ActivityGrid data={data} columns={52} />)).not.toThrow();
    const { container } = render(<ActivityGrid data={data} columns={52} />);
    expect(getCells(container)).toHaveLength(365);
  });

  it("value exactly at threshold boundary: ceil(n/max*4) rounds up correctly", () => {
    // data = [0, 1, 2, 3, 4] max = 4
    // level(1) = ceil(1/4*4) = ceil(1) = 1 → bg-brand/30
    const { container } = render(<ActivityGrid data={[0, 1, 2, 3, 4]} columns={5} />);
    const cells = Array.from(getCells(container));
    expect(cells[1].className).toContain("bg-brand/30");
    expect(cells[3].className).toContain("bg-brand/75");
  });

  it("fractional intermediate values bucket correctly", () => {
    // data = [0, 1, 3] max=3
    // level(1) = ceil(1/3*4) = ceil(1.33) = 2 → bg-brand/50
    // level(3) = ceil(3/3*4) = ceil(4) = 4 → bg-brand
    const { container } = render(<ActivityGrid data={[0, 1, 3]} columns={3} />);
    const cells = Array.from(getCells(container));
    expect(cells[0].className).toContain("bg-muted");
    expect(cells[1].className).toContain("bg-brand/50");
    expect(cells[2].className).toContain("bg-brand");
    expect(cells[2].className).not.toContain("bg-brand/");
  });

  it("columns prop does not affect how many cells render — data length governs", () => {
    const data = [1, 2, 3, 4, 5];
    const { container } = render(<ActivityGrid data={data} columns={100} />);
    expect(getCells(container)).toHaveLength(5);
  });

  it("data array with only one non-zero value and rest zeros", () => {
    // max = 7, other cells are 0 → bg-muted
    const data = [0, 0, 7, 0, 0];
    const { container } = render(<ActivityGrid data={data} columns={5} />);
    const cells = Array.from(getCells(container));
    expect(cells[0].className).toContain("bg-muted");
    expect(cells[2].className).toContain("bg-brand");
    expect(cells[4].className).toContain("bg-muted");
  });
});

// ---------------------------------------------------------------------------
// 7. Snapshot / structural tests
// ---------------------------------------------------------------------------

describe("ActivityGrid — structure", () => {
  it("wrapper is a direct single child of the container", () => {
    const { container } = render(<ActivityGrid data={[1]} />);
    expect(container.children).toHaveLength(1);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("cells are direct children of the wrapper div", () => {
    const data = [0, 5, 10];
    const { container } = render(<ActivityGrid data={data} columns={3} />);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.children).toHaveLength(3);
    Array.from(wrapper.children).forEach((child) =>
      expect(child.tagName).toBe("SPAN")
    );
  });

  it("renders predictably with a deterministic dataset", () => {
    const data = [0, 1, 2, 3, 4];
    const { container } = render(<ActivityGrid data={data} columns={5} />);
    const classes = cellClasses(container);
    expect(classes[0]).toContain("bg-muted");
    expect(classes[1]).toContain("bg-brand/30");
    expect(classes[2]).toContain("bg-brand/50");
    expect(classes[3]).toContain("bg-brand/75");
    expect(classes[4]).toContain("bg-brand");
  });
});

// ---------------------------------------------------------------------------
// 8. In-card usage pattern (from in-card.tsx example)
// ---------------------------------------------------------------------------

describe("ActivityGrid — in-card usage", () => {
  it("renders correctly when used as a single-cell legend swatch (columns=1)", () => {
    // from in-card.tsx: <ActivityGrid data={[0]} columns={1} /> etc.
    const values = [0, 1, 3, 7, 12];
    values.forEach((v) => {
      const { container } = render(<ActivityGrid data={[v]} columns={1} />);
      expect(getCells(container)).toHaveLength(1);
    });
  });

  it("legend swatch 0 → bg-muted", () => {
    const { container } = render(<ActivityGrid data={[0]} columns={1} />);
    expect(getCells(container)[0].className).toContain("bg-muted");
  });

  it("legend swatch 12 (max) → bg-brand (full)", () => {
    // Single cell equals the max → level 4
    const { container } = render(<ActivityGrid data={[12]} columns={1} />);
    const cell = getCells(container)[0];
    expect(cell.className).toContain("bg-brand");
    expect(cell.className).not.toContain("bg-brand/");
  });
});

// ---------------------------------------------------------------------------
// 9. Columns example patterns (from columns.tsx example)
// ---------------------------------------------------------------------------

describe("ActivityGrid — columns example patterns", () => {
  it("12-column compact week view renders 84 cells", () => {
    const data = Array.from({ length: 12 * 7 }, (_, i) =>
      Math.round(Math.abs(Math.sin(i * 0.7)) * 8)
    );
    const { container } = render(<ActivityGrid data={data} columns={12} />);
    expect(getCells(container)).toHaveLength(84);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.gridTemplateColumns).toBe("repeat(12, minmax(0, 1fr))");
  });

  it("52-column full-year view renders 364 cells", () => {
    const data = Array.from({ length: 52 * 7 }, (_, i) =>
      Math.round(Math.abs(Math.sin(i * 0.7)) * 8)
    );
    const { container } = render(<ActivityGrid data={data} columns={52} />);
    expect(getCells(container)).toHaveLength(364);
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper.style.gridTemplateColumns).toBe("repeat(52, minmax(0, 1fr))");
  });
});

// ---------------------------------------------------------------------------
// 10. Accessibility
// ---------------------------------------------------------------------------

describe("ActivityGrid — accessibility", () => {
  it("has no axe violations with a representative data set", async () => {
    const data = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10];
    const { container } = render(
      <section aria-label="Activity grid">
        <ActivityGrid data={data} columns={10} />
      </section>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with all-zero data", async () => {
    const data = Array(26).fill(0);
    const { container } = render(
      <section aria-label="Empty activity grid">
        <ActivityGrid data={data} columns={26} />
      </section>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with a single cell", async () => {
    const { container } = render(
      <section aria-label="Single cell activity">
        <ActivityGrid data={[5]} columns={1} />
      </section>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with full-year data set", async () => {
    const data = Array.from({ length: 52 * 7 }, (_, i) => i % 12);
    const { container } = render(
      <section aria-label="Annual activity grid">
        <ActivityGrid data={data} columns={52} />
      </section>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// 11. Re-render / prop update
// ---------------------------------------------------------------------------

describe("ActivityGrid — re-render behavior", () => {
  it("updates cells when data prop changes", () => {
    const { container, rerender } = render(
      <ActivityGrid data={[0, 0, 0]} columns={3} />
    );
    cellClasses(container).forEach((cls) => expect(cls).toContain("bg-muted"));

    rerender(<ActivityGrid data={[4, 4, 4]} columns={3} />);
    cellClasses(container).forEach((cls) => {
      expect(cls).toContain("bg-brand");
      expect(cls).not.toContain("bg-brand/");
    });
  });

  it("updates cell count when data array length changes", () => {
    const { container, rerender } = render(
      <ActivityGrid data={[1, 2, 3]} columns={3} />
    );
    expect(getCells(container)).toHaveLength(3);

    rerender(<ActivityGrid data={[1, 2, 3, 4, 5]} columns={5} />);
    expect(getCells(container)).toHaveLength(5);
  });

  it("updates grid columns when columns prop changes", () => {
    const { container, rerender } = render(
      <ActivityGrid data={[1, 2]} columns={2} />
    );
    expect(
      (container.firstChild as HTMLElement).style.gridTemplateColumns
    ).toBe("repeat(2, minmax(0, 1fr))");

    rerender(<ActivityGrid data={[1, 2]} columns={10} />);
    expect(
      (container.firstChild as HTMLElement).style.gridTemplateColumns
    ).toBe("repeat(10, minmax(0, 1fr))");
  });

  it("updates className when prop changes", () => {
    const { container, rerender } = render(
      <ActivityGrid data={[1]} className="class-a" />
    );
    expect((container.firstChild as HTMLElement).className).toContain("class-a");

    rerender(<ActivityGrid data={[1]} className="class-b" />);
    expect((container.firstChild as HTMLElement).className).toContain("class-b");
    expect((container.firstChild as HTMLElement).className).not.toContain("class-a");
  });
});

// ---------------------------------------------------------------------------
// 12. Gradient ramp (from intensity-levels.tsx example)
// ---------------------------------------------------------------------------

describe("ActivityGrid — gradient ramp example", () => {
  it("26-cell gradient ramp has correct first and last cell intensities", () => {
    // gradientRow[0] = round(0/25*12) = 0 → bg-muted
    // gradientRow[25] = round(25/25*12) = 12 → max, level 4 → bg-brand
    const gradientRow = Array.from({ length: 26 }, (_, i) => Math.round((i / 25) * 12));
    const { container } = render(<ActivityGrid data={gradientRow} columns={26} />);
    const cells = Array.from(getCells(container));

    expect(cells[0].className).toContain("bg-muted");
    // Last cell is max (12) → level 4 → bg-brand (full)
    expect(cells[25].className).toContain("bg-brand");
    expect(cells[25].className).not.toContain("bg-brand/");
  });
});
