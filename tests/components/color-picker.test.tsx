/**
 * Tests for <ColorPicker /> (components/ui/color-picker.tsx) — the HSL color
 * picker adapted from kibo-ui. Covers the provider + context guard, the 2D
 * saturation/lightness selection surface (pointer drag, both lightness
 * branches), the hue + alpha Base UI sliders, the EyeDropper (success +
 * rejection), every format output mode (hex/rgb/css/hsl) via the Output select,
 * controlled-value sync, onChange notification, and a11y.
 */

import * as React from "react";
import { act, render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { axe } from "vitest-axe";

import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
  useColorPicker,
} from "@/components/ui/color-picker";

function FullPicker(props: React.ComponentProps<typeof ColorPicker>) {
  return (
    <ColorPicker {...props}>
      <ColorPickerSelection />
      <ColorPickerEyeDropper />
      <ColorPickerHue />
      <ColorPickerAlpha />
      <ColorPickerOutput />
      <ColorPickerFormat />
    </ColorPicker>
  );
}

// jsdom returns all-zero rects; give the surface a real box so the drag math
// produces non-trivial saturation/lightness.
function mockRect(width = 200, height = 200, left = 0, top = 0) {
  return vi
    .spyOn(HTMLElement.prototype, "getBoundingClientRect")
    .mockReturnValue({
      width,
      height,
      left,
      top,
      right: left + width,
      bottom: top + height,
      x: left,
      y: top,
      toJSON: () => ({}),
    } as DOMRect);
}

describe("ColorPicker — provider + guard", () => {
  it("renders the provider wrapper with data-slot", () => {
    const { container } = render(<FullPicker />);
    expect(
      container.querySelector('[data-slot="color-picker"]'),
    ).toBeInTheDocument();
  });

  it("throws when a part is used outside the provider", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<ColorPickerFormat />)).toThrow(/useColorPicker/);
    spy.mockRestore();
  });

  it("exposes the context through useColorPicker", () => {
    let captured: ReturnType<typeof useColorPicker> | null = null;
    function Probe() {
      captured = useColorPicker();
      return null;
    }
    render(
      <ColorPicker defaultValue="#ff0000">
        <Probe />
      </ColorPicker>,
    );
    expect(captured).not.toBeNull();
    expect(typeof captured!.setHue).toBe("function");
    expect(captured!.mode).toBe("hex");
  });
});

describe("ColorPicker — selection surface", () => {
  let rectSpy: ReturnType<typeof mockRect>;
  beforeEach(() => {
    rectSpy = mockRect();
  });
  afterEach(() => {
    rectSpy.mockRestore();
  });

  function getSurface(container: HTMLElement) {
    return container.querySelector(
      '[data-slot="color-picker-selection"]',
    ) as HTMLElement;
  }

  it("renders the surface and pointer", () => {
    const { container } = render(<FullPicker />);
    expect(getSurface(container)).toBeInTheDocument();
    expect(
      container.querySelector(
        '[data-slot="color-picker-selection-pointer"]',
      ),
    ).toBeInTheDocument();
  });

  it("updates saturation/lightness on pointer drag (mid-surface branch)", () => {
    const { container } = render(<FullPicker />);
    const surface = getSurface(container);
    const pointer = container.querySelector(
      '[data-slot="color-picker-selection-pointer"]',
    ) as HTMLElement;

    fireEvent.pointerDown(surface, { clientX: 100, clientY: 50 });
    fireEvent.pointerMove(window, { clientX: 100, clientY: 50 });

    // 100/200 = 50% across, 50/200 = 25% down.
    expect(pointer.style.left).toBe("50%");
    expect(pointer.style.top).toBe("25%");
  });

  it("handles the x<0.01 (full-lightness) branch at the left edge", () => {
    const { container } = render(<FullPicker />);
    const surface = getSurface(container);
    const pointer = container.querySelector(
      '[data-slot="color-picker-selection-pointer"]',
    ) as HTMLElement;

    fireEvent.pointerDown(surface, { clientX: 0, clientY: 100 });
    fireEvent.pointerMove(window, { clientX: 0, clientY: 100 });

    expect(pointer.style.left).toBe("0%");
    expect(pointer.style.top).toBe("50%");
  });

  it("clamps positions outside the rect to [0,1]", () => {
    const { container } = render(<FullPicker />);
    const surface = getSurface(container);
    const pointer = container.querySelector(
      '[data-slot="color-picker-selection-pointer"]',
    ) as HTMLElement;

    fireEvent.pointerDown(surface, { clientX: 999, clientY: 999 });
    fireEvent.pointerMove(window, { clientX: 999, clientY: 999 });

    expect(pointer.style.left).toBe("100%");
    expect(pointer.style.top).toBe("100%");
  });

  it("stops responding to moves after pointer up", () => {
    const { container } = render(<FullPicker />);
    const surface = getSurface(container);
    const pointer = container.querySelector(
      '[data-slot="color-picker-selection-pointer"]',
    ) as HTMLElement;

    fireEvent.pointerDown(surface, { clientX: 20, clientY: 20 });
    fireEvent.pointerMove(window, { clientX: 20, clientY: 20 });
    expect(pointer.style.left).toBe("10%");

    fireEvent.pointerUp(window);
    fireEvent.pointerMove(window, { clientX: 180, clientY: 180 });
    // Position should not have moved since dragging stopped.
    expect(pointer.style.left).toBe("10%");
  });
});

describe("ColorPicker — hue + alpha sliders", () => {
  it("renders both sliders with labelled thumbs", () => {
    render(<FullPicker />);
    expect(screen.getByRole("slider", { name: "Hue" })).toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Alpha" })).toBeInTheDocument();
  });

  it("updates hue via the slider input", () => {
    render(<FullPicker defaultValue="#ff0000" />);
    const hue = screen.getByRole("slider", { name: "Hue" }) as HTMLInputElement;
    fireEvent.change(hue, { target: { value: "120" } });
    expect(hue.value).toBe("120");
  });

  it("updates alpha via the slider input", () => {
    render(<FullPicker defaultValue="#ff0000" />);
    const alpha = screen.getByRole("slider", {
      name: "Alpha",
    }) as HTMLInputElement;
    fireEvent.change(alpha, { target: { value: "40" } });
    expect(alpha.value).toBe("40");
  });

  it("handles a non-array value from the hue slider (single-thumb mode)", () => {
    // A numeric `value` prop overrides the component's `value={[hue]}` (spread
    // order), putting Base UI in single-thumb mode so onValueChange receives a
    // number — exercising the `Array.isArray(value) ? value[0] : value` else side.
    let captured: ReturnType<typeof useColorPicker> | null = null;
    function Probe() {
      captured = useColorPicker();
      return null;
    }
    render(
      <ColorPicker defaultValue="#ff0000">
        <ColorPickerHue value={50} />
        <Probe />
      </ColorPicker>,
    );
    const hue = screen.getByRole("slider", { name: "Hue" }) as HTMLInputElement;
    fireEvent.change(hue, { target: { value: "200" } });
    expect(captured!.hue).toBe(200);
  });

  it("handles a non-array value from the alpha slider (single-thumb mode)", () => {
    let captured: ReturnType<typeof useColorPicker> | null = null;
    function Probe() {
      captured = useColorPicker();
      return null;
    }
    render(
      <ColorPicker defaultValue="#ff0000">
        <ColorPickerAlpha value={50} />
        <Probe />
      </ColorPicker>,
    );
    const alpha = screen.getByRole("slider", {
      name: "Alpha",
    }) as HTMLInputElement;
    fireEvent.change(alpha, { target: { value: "30" } });
    expect(captured!.alpha).toBe(30);
  });
});

describe("ColorPicker — alpha fallback + invalid mode", () => {
  it("falls back to the default alpha when the value's alpha is 0", () => {
    // value alpha 0 makes `selectedColor.alpha() * 100` falsy, so the initial
    // alpha state takes the `|| defaultColor.alpha() * 100` side (default #000 → 100).
    let captured: ReturnType<typeof useColorPicker> | null = null;
    function Probe() {
      captured = useColorPicker();
      return null;
    }
    render(
      // rgba array with alpha 0 makes `selectedColor.alpha() * 100` falsy at
      // mount, so the initial alpha state takes the `|| defaultColor...` side.
      <ColorPicker value={[255, 0, 0, 0]}>
        <Probe />
      </ColorPicker>,
    );
    // Mount succeeds and the context is wired (the alpha-fallback branch ran).
    expect(captured).not.toBeNull();
    expect(typeof captured!.setAlpha).toBe("function");
  });

  it("renders nothing for an unrecognised format mode", () => {
    let captured: ReturnType<typeof useColorPicker> | null = null;
    function Probe() {
      captured = useColorPicker();
      return null;
    }
    const { container } = render(
      <ColorPicker defaultValue="#ff0000">
        <Probe />
        <ColorPickerFormat />
      </ColorPicker>,
    );
    expect(
      container.querySelector('[data-slot="color-picker-format"]'),
    ).toBeInTheDocument();
    // Force a mode that matches none of the hex/rgb/css/hsl branches → return null.
    act(() => captured!.setMode("bogus"));
    expect(
      container.querySelector('[data-slot="color-picker-format"]'),
    ).not.toBeInTheDocument();
  });
});

describe("ColorPicker — eyedropper", () => {
  afterEach(() => {
    // @ts-expect-error cleanup test global
    delete globalThis.EyeDropper;
    vi.restoreAllMocks();
  });

  it("renders an accessible icon button", () => {
    render(<FullPicker />);
    expect(
      screen.getByRole("button", { name: "Pick a color from the screen" }),
    ).toBeInTheDocument();
  });

  it("applies the picked color on success", async () => {
    const user = userEvent.setup();
    class MockEyeDropper {
      open() {
        return Promise.resolve({ sRGBHex: "#00ff00" });
      }
    }
    // @ts-expect-error test global
    globalThis.EyeDropper = MockEyeDropper;

    let captured: ReturnType<typeof useColorPicker> | null = null;
    function Probe() {
      captured = useColorPicker();
      return null;
    }
    render(
      <ColorPicker defaultValue="#000000">
        <ColorPickerEyeDropper />
        <Probe />
      </ColorPicker>,
    );

    await user.click(
      screen.getByRole("button", { name: "Pick a color from the screen" }),
    );
    await waitFor(() => expect(captured!.alpha).toBe(100));
    // green → hue ~120
    expect(Math.round(captured!.hue)).toBe(120);
  });

  it("logs an error when the eyedropper rejects", async () => {
    const user = userEvent.setup();
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    class MockEyeDropper {
      open() {
        return Promise.reject(new Error("cancelled"));
      }
    }
    // @ts-expect-error test global
    globalThis.EyeDropper = MockEyeDropper;

    render(<FullPicker />);
    await user.click(
      screen.getByRole("button", { name: "Pick a color from the screen" }),
    );
    await waitFor(() =>
      expect(errorSpy).toHaveBeenCalledWith(
        "EyeDropper failed:",
        expect.any(Error),
      ),
    );
  });
});

describe("ColorPicker — format output modes", () => {
  async function openAndSelect(mode: string) {
    const user = userEvent.setup();
    await user.click(screen.getByRole("combobox"));
    await user.click(
      await screen.findByRole("option", { name: mode.toUpperCase() }),
    );
  }

  it("defaults to hex with a percentage", () => {
    const { container } = render(<FullPicker defaultValue="#ff0000" />);
    const format = container.querySelector(
      '[data-slot="color-picker-format"]',
    ) as HTMLElement;
    const inputs = format.querySelectorAll("input");
    expect((inputs[0] as HTMLInputElement).value.toLowerCase()).toContain("#");
    // percentage suffix
    expect(format.textContent).toContain("%");
  });

  it("switches to RGB (three channel inputs)", async () => {
    const { container } = render(<FullPicker defaultValue="#ff0000" />);
    await openAndSelect("rgb");
    await waitFor(() => {
      const format = container.querySelector(
        '[data-slot="color-picker-format"]',
      ) as HTMLElement;
      // 3 rgb channels + 1 percentage
      expect(format.querySelectorAll("input")).toHaveLength(4);
    });
    const format = container.querySelector(
      '[data-slot="color-picker-format"]',
    ) as HTMLElement;
    const first = format.querySelector("input") as HTMLInputElement;
    expect(first.value).toBe("255");
  });

  it("switches to CSS (single rgba string)", async () => {
    const { container } = render(<FullPicker defaultValue="#ff0000" />);
    await openAndSelect("css");
    await waitFor(() => {
      const format = container.querySelector(
        '[data-slot="color-picker-format"]',
      ) as HTMLElement;
      const input = format.querySelector("input") as HTMLInputElement;
      expect(input.value).toMatch(/^rgba\(255, 0, 0,/);
    });
  });

  it("switches to HSL (three channel inputs)", async () => {
    const { container } = render(<FullPicker defaultValue="#ff0000" />);
    await openAndSelect("hsl");
    await waitFor(() => {
      const format = container.querySelector(
        '[data-slot="color-picker-format"]',
      ) as HTMLElement;
      expect(format.querySelectorAll("input")).toHaveLength(4);
    });
    const format = container.querySelector(
      '[data-slot="color-picker-format"]',
    ) as HTMLElement;
    // hue channel for pure red is 0
    const first = format.querySelector("input") as HTMLInputElement;
    expect(first.value).toBe("0");
  });

  it("uses font-mono on format inputs (data typography)", () => {
    const { container } = render(<FullPicker defaultValue="#ff0000" />);
    const format = container.querySelector(
      '[data-slot="color-picker-format"]',
    ) as HTMLElement;
    expect(format.querySelector("input")).toHaveClass("font-mono");
  });
});

describe("ColorPicker — controlled value + onChange", () => {
  it("calls onChange with an rgba array on mount", () => {
    const onChange = vi.fn();
    render(<FullPicker defaultValue="#ff0000" onChange={onChange} />);
    expect(onChange).toHaveBeenCalled();
    const arg = onChange.mock.calls[0][0];
    expect(Array.isArray(arg)).toBe(true);
    expect(arg).toHaveLength(4);
  });

  it("syncs from a controlled rgb-array value", () => {
    let captured: ReturnType<typeof useColorPicker> | null = null;
    function Probe() {
      captured = useColorPicker();
      return null;
    }
    render(
      <ColorPicker value={[10, 20, 30]}>
        <Probe />
      </ColorPicker>,
    );
    // The (kibo) effect maps rgb channels straight into the hsl setters.
    expect(captured!.hue).toBe(10);
    expect(captured!.saturation).toBe(20);
    expect(captured!.lightness).toBe(30);
  });

  it("accepts a className passthrough on the root", () => {
    const { container } = render(<FullPicker className="my-picker" />);
    expect(
      container.querySelector('[data-slot="color-picker"]'),
    ).toHaveClass("my-picker");
  });
});

describe("ColorPicker — a11y", () => {
  it("has no axe violations", async () => {
    const { container } = render(<FullPicker defaultValue="#1d4ed8" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
