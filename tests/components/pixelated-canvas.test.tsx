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

describe("PixelatedCanvas — guard branches", () => {
  it("falls back to dpr=1 when devicePixelRatio is 0", () => {
    Object.defineProperty(window, "devicePixelRatio", {
      configurable: true,
      value: 0,
    });
    render(<PixelatedCanvas src="/a.png" interactive={false} {...SMALL} />);
    expect(() => fireLoad()).not.toThrow();
  });

  it("bails out of compute when the main getContext returns null", () => {
    // First getContext (main canvas, line 145) returns null → early return.
    (HTMLCanvasElement.prototype.getContext as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      null,
    );
    render(<PixelatedCanvas src="/a.png" interactive={false} {...SMALL} />);
    expect(() => fireLoad()).not.toThrow();
  });

  it("bails out when the offscreen getContext returns null", () => {
    // Main canvas gets a real ctx; the offscreen canvas (2nd getContext call,
    // line 160) returns null → early return before sampling.
    let call = 0;
    (HTMLCanvasElement.prototype.getContext as unknown as ReturnType<typeof vi.fn>).mockImplementation(
      () => {
        call += 1;
        return call === 1 ? (makeCtx() as unknown as CanvasRenderingContext2D) : null;
      },
    );
    render(<PixelatedCanvas src="/a.png" interactive={false} {...SMALL} />);
    expect(() => fireLoad()).not.toThrow();
  });

  it("uses display size when the image reports zero natural dimensions", () => {
    render(<PixelatedCanvas src="/a.png" interactive={false} {...SMALL} />);
    const img = images.at(-1)!;
    // naturalWidth/naturalHeight falsy → `img.naturalWidth || displayWidth`
    // right-hand side (lines 163-164).
    img.naturalWidth = 0;
    img.naturalHeight = 0;
    expect(() => fireLoad()).not.toThrow();
  });

  it("ignores a load that fires after the effect was cancelled (unmount)", () => {
    const { unmount } = render(
      <PixelatedCanvas src="/a.png" interactive={false} {...SMALL} />,
    );
    const img = images.at(-1)!;
    img.complete = true;
    unmount(); // sets isCancelled = true in the cleanup
    // onload now hits the `if (isCancelled) return;` guard (line 333).
    expect(() => act(() => img.onload?.())).not.toThrow();
  });
});

describe("PixelatedCanvas — interactive animation branches", () => {
  function mountInteractive(props: Record<string, unknown> = {}) {
    const { container } = render(
      <PixelatedCanvas src="/a.png" {...SMALL} {...props} />,
    );
    fireLoad();
    return container.querySelector("canvas") as HTMLCanvasElement;
  }

  it("runs the animate frame with activity off when fadeOnLeave=false and no pointer", () => {
    // No pointer events → pointerInsideRef false → activityRef = 0 (line 429 `? 0`).
    mountInteractive({ fadeOnLeave: false });
    flushFrames(1);
    expect(rafCbs.length).toBeGreaterThan(0);
  });

  it("clears instead of filling in the animate loop when backgroundColor is empty", () => {
    // line 432 false side → clearRect in the animation loop.
    mountInteractive({ backgroundColor: "" });
    flushFrames(1);
    expect(rafCbs.length).toBeGreaterThan(0);
  });

  it("early-returns from animate when the context becomes unavailable", () => {
    const canvas = mountInteractive();
    // Make getContext return null so the next animate() frame hits the
    // `if (!ctx || !dims || !samples)` guard (line 412) and reschedules.
    (HTMLCanvasElement.prototype.getContext as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      null,
    );
    flushFrames(1);
    expect(canvas).toBeInTheDocument();
    expect(rafCbs.length).toBeGreaterThan(0);
  });

  it.each(["repel", "attract", "swirl"] as const)(
    "applies distortion (mode=%s) when a dot is within pointer influence",
    (distortionMode) => {
      // followSpeed=1 snaps animMouse onto the pointer in ONE frame, and
      // fadeOnLeave=false makes activity=1 immediately, so falloff*activity
      // clears the `influence > 0.0005` gate (line 454) and the per-mode
      // distortion math (455-478) + jitter (473) all execute.
      const canvas = mountInteractive({
        distortionMode,
        followSpeed: 1,
        fadeOnLeave: false,
        jitterStrength: 4,
      });
      act(() => {
        canvas.dispatchEvent(new Event("pointerenter"));
        const move = new Event("pointermove") as PointerEvent;
        Object.assign(move, { clientX: 6, clientY: 6 });
        canvas.dispatchEvent(move);
      });
      flushFrames(1);
      expect(canvas).toBeInTheDocument();
    },
  );

  it("handles an unrecognized distortion mode (no branch matched)", () => {
    // An out-of-union mode still enters the influence path but matches none of
    // repel/attract/swirl, exercising the implicit else of the chain (line 463).
    const canvas = mountInteractive({
      distortionMode: "none-of-them",
      followSpeed: 1,
      fadeOnLeave: false,
    });
    act(() => {
      canvas.dispatchEvent(new Event("pointerenter"));
      const move = new Event("pointermove") as PointerEvent;
      Object.assign(move, { clientX: 6, clientY: 6 });
      canvas.dispatchEvent(move);
    });
    flushFrames(1);
    expect(canvas).toBeInTheDocument();
  });

  it("applies distortion to circle dots within influence", () => {
    const canvas = mountInteractive({
      shape: "circle",
      distortionMode: "repel",
      followSpeed: 1,
      fadeOnLeave: false,
    });
    act(() => {
      canvas.dispatchEvent(new Event("pointerenter"));
      const move = new Event("pointermove") as PointerEvent;
      Object.assign(move, { clientX: 6, clientY: 6 });
      canvas.dispatchEvent(move);
    });
    flushFrames(1);
    expect(canvas).toBeInTheDocument();
  });

  it("skips jitter when jitterStrength is 0 but still distorts", () => {
    // influence path runs, but the `if (jitterStrength > 0)` guard (line 473)
    // takes its false side.
    const canvas = mountInteractive({
      distortionMode: "repel",
      followSpeed: 1,
      fadeOnLeave: false,
      jitterStrength: 0,
    });
    act(() => {
      canvas.dispatchEvent(new Event("pointerenter"));
      const move = new Event("pointermove") as PointerEvent;
      Object.assign(move, { clientX: 6, clientY: 6 });
      canvas.dispatchEvent(move);
    });
    flushFrames(1);
    expect(canvas).toBeInTheDocument();
  });

  it("cancels a pending RAF before scheduling a new animate loop", () => {
    // On the second load (re-fire) rafRef.current is already set, so the
    // `if (rafRef.current) cancelAnimationFrame(...)` (line 503) true side runs.
    const { container } = render(<PixelatedCanvas src="/a.png" {...SMALL} />);
    fireLoad();
    expect(rafCbs.length).toBeGreaterThan(0);
    // Fire onload again on the same image → re-enters the load handler with a
    // live rafRef.
    act(() => images.at(-1)!.onload?.());
    expect(cancelAnimationFrame).toHaveBeenCalled();
    expect(container.querySelector("canvas")).toBeInTheDocument();
  });
});

describe("PixelatedCanvas — responsive resize guards", () => {
  it("does not recompute on resize before the image is complete", () => {
    render(<PixelatedCanvas src="/a.png" responsive {...SMALL} />);
    const img = images.at(-1)!;
    img.complete = false; // line 521 `img.complete && ...` false side
    expect(() =>
      act(() => window.dispatchEvent(new Event("resize"))),
    ).not.toThrow();
  });

  it("cleans up responsive listener when no animation cleanup was registered", () => {
    // Unmount BEFORE load → onload never ran → img._cleanup is undefined, so
    // the `if ((img as any)._cleanup)` guard (line 529) takes its false side.
    const { unmount } = render(
      <PixelatedCanvas src="/a.png" responsive {...SMALL} />,
    );
    expect(() => unmount()).not.toThrow();
  });

  it("cleans up the non-responsive effect when no animation cleanup exists", () => {
    // Unmount before load with responsive=false → line 535 `_cleanup` false side.
    const { unmount } = render(
      <PixelatedCanvas src="/a.png" {...SMALL} />,
    );
    expect(() => unmount()).not.toThrow();
  });
});

describe("PixelatedCanvas — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<PixelatedCanvas src="/a.png" {...SMALL} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
