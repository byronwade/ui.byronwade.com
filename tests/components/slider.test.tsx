/**
 * Tests for <Slider /> (components/ui/slider.tsx) — Base UI slider.
 * One thumb per value (an array makes it a range). We assert thumbs/roles,
 * value wiring, min/max/step, disabled, token classes, and a11y.
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { Slider } from "@/components/ui/slider";

describe("Slider — render", () => {
  it("renders a single thumb by default", () => {
    render(<Slider aria-label="Volume" defaultValue={40} />);
    expect(screen.getAllByRole("slider")).toHaveLength(1);
  });

  it("has data-slot='slider'", () => {
    const { container } = render(<Slider aria-label="Volume" defaultValue={40} />);
    expect(container.querySelector('[data-slot="slider"]')).not.toBeNull();
  });

  it("renders one thumb per value for a range", () => {
    render(<Slider aria-label="Price" defaultValue={[20, 80]} />);
    expect(screen.getAllByRole("slider")).toHaveLength(2);
  });

  it("renders track + indicator parts", () => {
    const { container } = render(<Slider aria-label="V" defaultValue={50} />);
    expect(container.querySelector('[data-slot="slider-track"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="slider-indicator"]')).not.toBeNull();
  });

  it("uses token surfaces (bg-muted track, bg-primary indicator)", () => {
    const { container } = render(<Slider aria-label="V" defaultValue={50} />);
    expect(container.querySelector('[data-slot="slider-track"]')).toHaveClass("bg-muted");
    expect(container.querySelector('[data-slot="slider-indicator"]')).toHaveClass("bg-primary");
  });
});

describe("Slider — size", () => {
  const track = (c: HTMLElement) =>
    c.querySelector('[data-slot="slider-track"]');
  const thumb = (c: HTMLElement) =>
    c.querySelector('[data-slot="slider-thumb"]');

  it("uses the default track + thumb size when no size prop is given", () => {
    const { container } = render(<Slider aria-label="V" defaultValue={50} />);
    expect(track(container)).toHaveClass("h-1.5");
    expect(thumb(container)).toHaveClass("size-4");
  });

  it("applies the sm size to track + thumb", () => {
    const { container } = render(
      <Slider aria-label="V" defaultValue={50} size="sm" />,
    );
    expect(track(container)).toHaveClass("h-1");
    expect(thumb(container)).toHaveClass("size-3");
  });

  it("applies the lg size to track + thumb", () => {
    const { container } = render(
      <Slider aria-label="V" defaultValue={50} size="lg" />,
    );
    expect(track(container)).toHaveClass("h-2");
    expect(thumb(container)).toHaveClass("size-5");
  });

  it("sizes every thumb in a range slider", () => {
    const { container } = render(
      <Slider aria-label="V" defaultValue={[20, 80]} size="lg" />,
    );
    const thumbs = container.querySelectorAll('[data-slot="slider-thumb"]');
    expect(thumbs).toHaveLength(2);
    thumbs.forEach((t) => expect(t).toHaveClass("size-5"));
  });
});

describe("Slider — value semantics", () => {
  it("reflects min/max/value on the thumb input", () => {
    render(<Slider aria-label="V" min={0} max={200} defaultValue={50} />);
    const thumb = screen.getByRole("slider");
    expect(thumb).toHaveAttribute("min", "0");
    expect(thumb).toHaveAttribute("max", "200");
    expect(thumb).toHaveAttribute("aria-valuenow", "50");
  });

  it("calls onValueChange when moved by keyboard", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Slider aria-label="V" defaultValue={50} onValueChange={onValueChange} />,
    );
    const thumb = screen.getByRole("slider");
    thumb.focus();
    await user.keyboard("{ArrowRight}");
    expect(onValueChange).toHaveBeenCalled();
  });

  it("respects a controlled value", () => {
    render(<Slider aria-label="V" value={[10, 90]} onValueChange={() => {}} />);
    const thumbs = screen.getAllByRole("slider");
    expect(thumbs[0]).toHaveAttribute("aria-valuenow", "10");
    expect(thumbs[1]).toHaveAttribute("aria-valuenow", "90");
  });
});

describe("Slider — disabled & className", () => {
  it("disables interaction", () => {
    render(<Slider aria-label="V" defaultValue={50} disabled />);
    expect(screen.getByRole("slider")).toBeDisabled();
  });

  it("merges custom className", () => {
    const { container } = render(
      <Slider aria-label="V" defaultValue={50} className="max-w-xs" />,
    );
    expect(container.firstChild).toHaveClass("max-w-xs");
  });
});

describe("Slider — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<Slider aria-label="Volume" defaultValue={40} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
