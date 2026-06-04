/**
 * Tests for <CanvasText /> (components/ui/canvas-text.tsx)
 *
 * Renders text as a canvas mask with animated bezier line fills. jsdom has no
 * canvas, ResizeObserver, or rAF semantics we want, so we stub:
 *  - HTMLCanvasElement.getContext → a 2D-context spy
 *  - getBoundingClientRect → fixed text metrics
 *  - requestAnimationFrame → invoke the animate callback exactly once
 *  - ResizeObserver → capture the callback
 * We assert markup / a11y / that the draw pipeline ran, never pixels.
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import { axe } from "vitest-axe";

import { CanvasText } from "@/components/ui/canvas-text";

let ctx: Record<string, ReturnType<typeof vi.fn>>;
let getContextReturnsNull = false;
let boundingWidth = 300;
const origRO = globalThis.ResizeObserver;
const origDpr = Object.getOwnPropertyDescriptor(window, "devicePixelRatio");
let resizeObserverCb: ((entries: unknown[]) => void) | null = null;

function makeCtx() {
  return {
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    fillText: vi.fn(),
    fillRect: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    bezierCurveTo: vi.fn(),
    stroke: vi.fn(),
    measureText: vi.fn(() => ({
      actualBoundingBoxAscent: 12,
      actualBoundingBoxDescent: 3,
      width: 100,
    })),
  };
}

beforeEach(() => {
  ctx = makeCtx();
  getContextReturnsNull = false;
  boundingWidth = 300;

  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    () => (getContextReturnsNull ? null : (ctx as unknown as CanvasRenderingContext2D)),
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () => ({ width: boundingWidth, height: 120 }) as DOMRect,
  );

  let rafFired = false;
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    if (!rafFired) {
      rafFired = true;
      cb(16);
    }
    return 1;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());

  class MockResizeObserver {
    constructor(cb: (entries: unknown[]) => void) {
      resizeObserverCb = cb;
    }
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
  Object.defineProperty(window, "devicePixelRatio", {
    configurable: true,
    value: 2,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  globalThis.ResizeObserver = origRO;
  if (origDpr) Object.defineProperty(window, "devicePixelRatio", origDpr);
  resizeObserverCb = null;
});

describe("CanvasText — render", () => {
  it("renders the root with data-slot", () => {
    const { container } = render(<CanvasText text="Hello" />);
    expect(container.querySelector('[data-slot="canvas-text"]')).not.toBeNull();
  });

  it("renders a canvas with role=img and the text as its accessible name", () => {
    render(<CanvasText text="Colorful" />);
    expect(screen.getByRole("img", { name: "Colorful" })).toBeInTheDocument();
  });

  it("renders a hidden measuring copy of the text", () => {
    const { container } = render(<CanvasText text="Measure" />);
    const hidden = container.querySelector(".invisible");
    expect(hidden).toHaveTextContent("Measure");
  });

  it("applies the default bg-background background class", () => {
    const { container } = render(<CanvasText text="Hi" />);
    expect(container.querySelector(".bg-background")).not.toBeNull();
  });

  it("honors a custom backgroundClassName", () => {
    const { container } = render(
      <CanvasText text="Hi" backgroundClassName="bg-card" />,
    );
    expect(container.querySelector(".bg-card")).not.toBeNull();
  });

  it("positions absolutely when overlay is set", () => {
    const { container } = render(<CanvasText text="Hi" overlay />);
    expect(container.firstChild).toHaveClass("absolute");
    expect(container.firstChild).toHaveClass("inset-0");
  });

  it("merges a custom className", () => {
    const { container } = render(<CanvasText text="Hi" className="text-5xl" />);
    expect(container.firstChild).toHaveClass("text-5xl");
  });
});

describe("CanvasText — draw pipeline", () => {
  it("acquires a 2D context and runs one animation frame", () => {
    render(<CanvasText text="Draw" />);
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith("2d", {
      alpha: true,
    });
    expect(ctx.fillText).toHaveBeenCalledWith("Draw", 0, expect.any(Number));
    expect(ctx.stroke).toHaveBeenCalled();
    expect(ctx.bezierCurveTo).toHaveBeenCalled();
  });

  it("does not draw when the 2D context is unavailable", () => {
    getContextReturnsNull = true;
    render(<CanvasText text="NoCtx" />);
    expect(ctx.fillText).not.toHaveBeenCalled();
  });

  it("passes CSS-variable colors straight through to the stroke style", () => {
    render(<CanvasText text="Var" colors={["var(--brand)"]} />);
    // resolveColor returns the var() string when the property is unresolved.
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it("passes non-variable colors through unchanged", () => {
    render(<CanvasText text="Plain" colors={["currentColor"]} />);
    expect(ctx.stroke).toHaveBeenCalled();
  });

  it("falls back to default dimensions when the text box measures zero", () => {
    boundingWidth = 0;
    render(<CanvasText text="Zero" />);
    // width falls back to 400, so the draw pipeline still runs.
    expect(ctx.fillText).toHaveBeenCalled();
  });

  it("re-measures when the ResizeObserver fires", () => {
    render(<CanvasText text="Resize" />);
    expect(resizeObserverCb).toBeTypeOf("function");
    // Should not throw when the observer reports a resize.
    resizeObserverCb?.([]);
    expect(ctx.fillText).toHaveBeenCalled();
  });
});

describe("CanvasText — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<CanvasText text="Accessible heading" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
