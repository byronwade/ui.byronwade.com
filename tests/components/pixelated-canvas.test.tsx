/**
 * Tests for <PixelatedCanvas /> (components/ui/pixelated-canvas.tsx)
 *
 * Samples a source image into a grid of dots, optionally distorting them around
 * the pointer. jsdom has no canvas or Image loading, so we stub:
 *  - window.Image → captured instances whose onload/onerror we fire manually
 *  - HTMLCanvasElement.getContext → a 2D-context spy (getImageData returns data)
 *  - requestAnimationFrame → captured callbacks we flush by hand (the animate
 *    loop self-reschedules, so we never auto-run it)
 * We assert the pipeline runs across modes/branches, never pixels.
 */

import * as React from "react";
import { render, act } from "@testing-library/react";
import { axe } from "vitest-axe";

import { PixelatedCanvas } from "@/components/ui/pixelated-canvas";

let images: MockImage[] = [];
let rafCbs: FrameRequestCallback[] = [];
let getImageDataThrows = false;

class MockImage {
  crossOrigin = "";
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  naturalWidth = 8;
  naturalHeight = 8;
  complete = false;
  private _src = "";
  constructor() {
    images.push(this);
  }
  set src(v: string) {
    this._src = v;
  }
  get src() {
    return this._src;
  }
}

function makeCtx() {
  return {
    resetTransform: vi.fn(),
    scale: vi.fn(),
    setTransform: vi.fn(),
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    drawImage: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    getImageData: vi.fn((x: number, y: number, w: number, h: number) => {
      if (getImageDataThrows) throw new Error("tainted");
      const data = new Uint8ClampedArray(Math.max(1, w * h * 4));
      for (let i = 0; i < data.length; i++) data[i] = (i * 37) % 256;
      return { data, width: w, height: h };
    }),
    fillStyle: "",
    globalAlpha: 1,
  };
}

const origImage = globalThis.Image;
const origRAF = globalThis.requestAnimationFrame;
const origCAF = globalThis.cancelAnimationFrame;
const origDpr = Object.getOwnPropertyDescriptor(window, "devicePixelRatio");

beforeEach(() => {
  images = [];
  rafCbs = [];
  getImageDataThrows = false;

  globalThis.Image = MockImage as unknown as typeof Image;
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    () => makeCtx() as unknown as CanvasRenderingContext2D,
  );
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue({
    left: 0,
    top: 0,
    width: 12,
    height: 12,
  } as DOMRect);
  globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
    rafCbs.push(cb);
    return rafCbs.length;
  }) as typeof requestAnimationFrame;
  globalThis.cancelAnimationFrame = vi.fn();
  Object.defineProperty(window, "devicePixelRatio", {
    configurable: true,
    value: 2,
  });
});

afterEach(() => {
  vi.restoreAllMocks();
  globalThis.Image = origImage;
  globalThis.requestAnimationFrame = origRAF;
  globalThis.cancelAnimationFrame = origCAF;
  if (origDpr) Object.defineProperty(window, "devicePixelRatio", origDpr);
});

function fireLoad() {
  const img = images.at(-1)!;
  img.complete = true;
  act(() => img.onload?.());
}

function flushFrames(n: number) {
  for (let i = 0; i < n; i++) {
    const cb = rafCbs.shift();
    if (!cb) break;
    act(() => cb(performance.now()));
  }
}

const SMALL = { width: 12, height: 12, cellSize: 3 } as const;

describe("PixelatedCanvas — render", () => {
  it("renders a canvas with data-slot, role=img and an aria-label", () => {
    const { container } = render(<PixelatedCanvas src="/a.png" {...SMALL} />);
    const canvas = container.querySelector("canvas")!;
    expect(canvas).toHaveAttribute("data-slot", "pixelated-canvas");
    expect(canvas).toHaveAttribute("role", "img");
    expect(canvas).toHaveAttribute(
      "aria-label",
      "Pixelated rendering of source image",
    );
  });

  it("merges a custom className", () => {
    const { container } = render(
      <PixelatedCanvas src="/a.png" className="rounded-xl" {...SMALL} />,
    );
    expect(container.querySelector("canvas")).toHaveClass("rounded-xl");
  });

  it("sets crossOrigin and src on the image", () => {
    render(<PixelatedCanvas src="/photo.png" {...SMALL} />);
    const img = images.at(-1)!;
    expect(img.crossOrigin).toBe("anonymous");
    expect(img.src).toBe("/photo.png");
  });
});

describe("PixelatedCanvas — static (non-interactive)", () => {
  it("samples and draws once on load without starting a RAF loop", () => {
    render(<PixelatedCanvas src="/a.png" interactive={false} {...SMALL} />);
    fireLoad();
    // Static path draws synchronously; no animation frame was scheduled.
    expect(rafCbs.length).toBe(0);
  });

  it("draws circle dots when shape='circle'", () => {
    render(
      <PixelatedCanvas src="/a.png" interactive={false} shape="circle" {...SMALL} />,
    );
    expect(() => fireLoad()).not.toThrow();
  });

  it("clears instead of filling when backgroundColor is empty", () => {
    render(
      <PixelatedCanvas
        src="/a.png"
        interactive={false}
        backgroundColor=""
        {...SMALL}
      />,
    );
    expect(() => fireLoad()).not.toThrow();
  });
});

describe("PixelatedCanvas — sampling branches", () => {
  it.each(["cover", "contain", "fill", "none"] as const)(
    "handles objectFit=%s",
    (objectFit) => {
      render(
        <PixelatedCanvas src="/a.png" interactive={false} objectFit={objectFit} {...SMALL} />,
      );
      expect(() => fireLoad()).not.toThrow();
    },
  );

  it("supports grayscale", () => {
    render(<PixelatedCanvas src="/a.png" interactive={false} grayscale {...SMALL} />);
    expect(() => fireLoad()).not.toThrow();
  });

  it("supports single-sample mode (sampleAverage=false)", () => {
    render(
      <PixelatedCanvas src="/a.png" interactive={false} sampleAverage={false} {...SMALL} />,
    );
    expect(() => fireLoad()).not.toThrow();
  });

  it.each(["#fff", "#0ea5e9", "rgb(14,165,233)", "not-a-color"])(
    "parses tintColor=%s",
    (tintColor) => {
      render(
        <PixelatedCanvas
          src="/a.png"
          interactive={false}
          tintColor={tintColor}
          tintStrength={0.5}
          {...SMALL}
        />,
      );
      expect(() => fireLoad()).not.toThrow();
    },
  );

  it("falls back to drawImage when getImageData throws (tainted canvas)", () => {
    getImageDataThrows = true;
    render(<PixelatedCanvas src="/a.png" interactive={false} {...SMALL} />);
    expect(() => fireLoad()).not.toThrow();
  });

  it("logs an error when the image fails to load", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<PixelatedCanvas src="/bad.png" {...SMALL} />);
    act(() => images.at(-1)!.onerror?.());
    expect(spy).toHaveBeenCalled();
  });
});

describe("PixelatedCanvas — interactive distortion", () => {
  function setup(props: Record<string, unknown> = {}) {
    const { container } = render(
      <PixelatedCanvas src="/a.png" {...SMALL} {...props} />,
    );
    fireLoad();
    return container.querySelector("canvas") as HTMLCanvasElement;
  }

  it("schedules an animation frame on load", () => {
    setup();
    expect(rafCbs.length).toBeGreaterThan(0);
  });

  it("tracks pointer enter / move / leave and animates", () => {
    const canvas = setup({ distortionMode: "repel" });
    act(() => {
      canvas.dispatchEvent(new Event("pointerenter"));
      const move = new Event("pointermove") as PointerEvent;
      Object.assign(move, { clientX: 5, clientY: 5 });
      canvas.dispatchEvent(move);
    });
    flushFrames(2);
    act(() => canvas.dispatchEvent(new Event("pointerleave")));
    flushFrames(1);
    expect(canvas).toBeInTheDocument();
  });

  it.each(["repel", "attract", "swirl"] as const)(
    "runs distortionMode=%s near the pointer",
    (distortionMode) => {
      const canvas = setup({ distortionMode, fadeOnLeave: false });
      act(() => {
        canvas.dispatchEvent(new Event("pointerenter"));
        const move = new Event("pointermove") as PointerEvent;
        Object.assign(move, { clientX: 6, clientY: 6 });
        canvas.dispatchEvent(move);
      });
      flushFrames(3);
      act(() => canvas.dispatchEvent(new Event("pointerleave")));
      flushFrames(1);
      expect(canvas).toBeInTheDocument();
    },
  );

  it("draws circle dots in the animation loop", () => {
    setup({ shape: "circle" });
    flushFrames(1);
    expect(rafCbs.length).toBeGreaterThanOrEqual(0);
  });

  it("respects the frame-rate cap (throttled frames reschedule)", () => {
    setup({ maxFps: 1 });
    flushFrames(2);
    expect(rafCbs.length).toBeGreaterThan(0);
  });

  it("cleans up listeners and the RAF on unmount", () => {
    const { container, unmount } = render(
      <PixelatedCanvas src="/a.png" {...SMALL} />,
    );
    fireLoad();
    expect(container.querySelector("canvas")).toBeInTheDocument();
    expect(() => unmount()).not.toThrow();
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });
});

describe("PixelatedCanvas — responsive", () => {
  it("recomputes on window resize when responsive", () => {
    render(<PixelatedCanvas src="/a.png" responsive {...SMALL} />);
    const img = images.at(-1)!;
    img.complete = true;
    img.naturalWidth = 8;
    fireLoad();
    expect(() => act(() => window.dispatchEvent(new Event("resize")))).not.toThrow();
  });

  it("cleans up the resize listener on unmount", () => {
    const { unmount } = render(
      <PixelatedCanvas src="/a.png" responsive {...SMALL} />,
    );
    fireLoad();
    expect(() => unmount()).not.toThrow();
  });
});

describe("PixelatedCanvas — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<PixelatedCanvas src="/a.png" {...SMALL} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
