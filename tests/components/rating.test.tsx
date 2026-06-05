/**
 * Tests for <Rating /> (components/ui/rating.tsx) — interactive star rating +
 * the read-only RatingBadge consolidation. Covers click/keyboard/hover, the
 * controlled + readonly modes, the badge variant, the context guard, and a11y.
 */

import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import { HeartIcon } from "lucide-react";

import {
  Rating,
  RatingButton,
  RatingBadge,
} from "@/components/ui/rating";

function Stars(props: React.ComponentProps<typeof Rating>) {
  return (
    <Rating {...props}>
      {Array.from({ length: 5 }).map((_, i) => (
        <RatingButton key={i} />
      ))}
    </Rating>
  );
}

// Each star renders two layers: an outline base + a `fill-current` copy clipped
// to `width: <fill>%`. Helpers read the fill widths to assert what's shown.
function fillWidths(container: HTMLElement): string[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>('[data-slot="rating-button-fill"]'),
  ).map((el) => el.style.width);
}
function fullyFilled(container: HTMLElement): number {
  return fillWidths(container).filter((w) => w === "100%").length;
}

// Stub layout so the half-select pointer math (getBoundingClientRect) is
// deterministic in jsdom, which otherwise reports a zero-width rect.
function stubRect(el: Element, left: number, width: number) {
  vi.spyOn(el, "getBoundingClientRect").mockReturnValue({
    left,
    width,
    right: left + width,
    top: 0,
    bottom: 0,
    height: 0,
    x: left,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
}

describe("Rating — render", () => {
  it("renders a radiogroup of 5 star buttons", () => {
    render(<Stars defaultValue={0} />);
    expect(screen.getByRole("radiogroup", { name: "Rating" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  it("fills the stars up to the value", () => {
    const { container } = render(<Stars value={3} readOnly />);
    expect(fullyFilled(container)).toBe(3);
    expect(fillWidths(container)).toEqual([
      "100%",
      "100%",
      "100%",
      "0%",
      "0%",
    ]);
  });

  it("tone follows the brand token", () => {
    const { container } = render(<Stars value={2} readOnly />);
    expect(container.querySelector('[data-slot="rating"]')).toHaveClass("text-brand");
  });
});

describe("Rating — interaction", () => {
  it("selects a value on click (uncontrolled)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Stars defaultValue={0} onValueChange={onValueChange} />);
    await user.click(screen.getAllByRole("radio")[2]);
    expect(onValueChange).toHaveBeenCalledWith(3);
  });

  it("fires the (event, value) onChange too", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Stars defaultValue={0} onChange={onChange} />);
    await user.click(screen.getAllByRole("radio")[0]);
    expect(onChange).toHaveBeenCalledWith(expect.anything(), 1);
  });

  it("supports arrow-key navigation", () => {
    const onValueChange = vi.fn();
    render(<Stars defaultValue={2} onValueChange={onValueChange} />);
    const second = screen.getAllByRole("radio")[1];
    second.focus();
    fireEvent.keyDown(second, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenCalledWith(3);
    const third = screen.getAllByRole("radio")[2];
    fireEvent.keyDown(third, { key: "ArrowLeft" });
    expect(onValueChange).toHaveBeenCalledWith(2);
  });

  it("jumps to ends with shift/meta + arrow", () => {
    const onValueChange = vi.fn();
    render(<Stars defaultValue={2} onValueChange={onValueChange} />);
    const btn = screen.getAllByRole("radio")[1];
    btn.focus();
    fireEvent.keyDown(btn, { key: "ArrowRight", shiftKey: true });
    expect(onValueChange).toHaveBeenCalledWith(5);
    fireEvent.keyDown(screen.getAllByRole("radio")[4], { key: "ArrowLeft", metaKey: true });
    expect(onValueChange).toHaveBeenCalledWith(1);
  });

  it("ignores unrelated keys", () => {
    const onValueChange = vi.fn();
    render(<Stars defaultValue={2} onValueChange={onValueChange} />);
    const btn = screen.getAllByRole("radio")[1];
    btn.focus();
    fireEvent.keyDown(btn, { key: "Enter" });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("previews on hover and resets on leave", async () => {
    const user = userEvent.setup();
    const { container } = render(<Stars defaultValue={1} />);
    const buttons = screen.getAllByRole("radio");
    await user.hover(buttons[3]);
    expect(fullyFilled(container)).toBe(4);
    await user.unhover(buttons[3]);
    fireEvent.mouseLeave(container.querySelector('[data-slot="rating"]')!);
    expect(fullyFilled(container)).toBe(1);
  });
});

describe("Rating — read only", () => {
  it("disables the buttons and ignores clicks", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Stars value={3} readOnly onValueChange={onValueChange} />);
    const btn = screen.getAllByRole("radio")[4];
    expect(btn).toBeDisabled();
    await user.click(btn).catch(() => {});
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("ignores arrow keys (handleKeyDown readOnly guard)", () => {
    const onValueChange = vi.fn();
    render(<Stars value={3} readOnly onValueChange={onValueChange} />);
    // Keydown events still fire on disabled buttons; the readOnly guard returns
    // before any value change.
    fireEvent.keyDown(screen.getAllByRole("radio")[2], { key: "ArrowRight" });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe("Rating — controlled vs uncontrolled", () => {
  it("does not write internal state when controlled (skips setUncontrolled)", async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    // Controlled (value supplied) but NOT readOnly — clicking exercises the
    // `if (!isControlled) setUncontrolled` false side: notify only, no internal write.
    render(<Stars value={2} onValueChange={onValueChange} />);
    await user.click(screen.getAllByRole("radio")[3]);
    expect(onValueChange).toHaveBeenCalledWith(4);
    // Value is owned by the parent, so the rendered selection stays at 2.
    expect(screen.getByRole("radio", { name: "2 stars" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("falls back to index 0 when a button has no provided index", () => {
    // Wrapping RatingButton in a function component means Children.map injects
    // `index` onto the wrapper, not the button — so providedIndex is undefined
    // and `providedIndex ?? 0` takes the `?? 0` side.
    const Star = () => <RatingButton />;
    render(
      <Rating value={0}>
        <Star />
        <Star />
      </Rating>,
    );
    const radios = screen.getAllByRole("radio");
    // Both buttons render with index 0 → both labelled "1 star".
    expect(radios).toHaveLength(2);
    radios.forEach((r) => expect(r).toHaveAttribute("aria-label", "1 star"));
  });

  it("skips falsy children in Children.map", () => {
    render(
      <Rating value={0}>
        {null}
        {false}
        <RatingButton />
      </Rating>,
    );
    // Only the real RatingButton renders; the null/false children are dropped.
    expect(screen.getAllByRole("radio")).toHaveLength(1);
  });
});

describe("RatingBadge", () => {
  it("shows the score with one decimal + a star", () => {
    const { container } = render(<RatingBadge value={4.8} />);
    expect(screen.getByText("4.8")).toBeInTheDocument();
    expect(container.querySelector("svg.fill-current")).not.toBeNull();
  });
  it("shows max and count when provided", () => {
    render(<RatingBadge value={3.5} max={5} count={1240} />);
    expect(screen.getByText("/ 5")).toBeInTheDocument();
    expect(screen.getByText("(1240)")).toBeInTheDocument();
  });
  it("omits max/count when absent", () => {
    render(<RatingBadge value={4.2} />);
    expect(screen.queryByText(/\//)).not.toBeInTheDocument();
  });
});

function HalfStars(props: React.ComponentProps<typeof Rating>) {
  return (
    <Rating allowHalf {...props}>
      {Array.from({ length: 5 }).map((_, i) => (
        <RatingButton key={i} />
      ))}
    </Rating>
  );
}

describe("Rating — fractional display", () => {
  it("renders a partial fill for a .5 value", () => {
    const { container } = render(<HalfStars value={3.5} readOnly />);
    expect(fillWidths(container)).toEqual([
      "100%",
      "100%",
      "100%",
      "50%",
      "0%",
    ]);
  });

  it("renders arbitrary fractions for a read-only average", () => {
    const { container } = render(<HalfStars value={3.7} readOnly />);
    expect(fillWidths(container)[3]).toBe("70%");
  });
});

describe("Rating — half mode (slider)", () => {
  it("exposes slider semantics instead of a radiogroup", () => {
    render(<HalfStars value={2.5} />);
    const slider = screen.getByRole("slider", { name: "Rating" });
    expect(slider).toHaveAttribute("aria-valuemin", "0");
    expect(slider).toHaveAttribute("aria-valuemax", "5");
    expect(slider).toHaveAttribute("aria-valuenow", "2.5");
    expect(slider).toHaveAttribute("aria-valuetext", "2.5 of 5 stars");
    expect(screen.queryByRole("radiogroup")).toBeNull();
    expect(screen.queryAllByRole("radio")).toHaveLength(0);
  });

  it("steps by 0.5 with arrow keys (right/up, left/down)", () => {
    const onValueChange = vi.fn();
    render(<HalfStars value={3} onValueChange={onValueChange} />);
    const slider = screen.getByRole("slider");
    slider.focus();
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    expect(onValueChange).toHaveBeenLastCalledWith(3.5);
    fireEvent.keyDown(slider, { key: "ArrowUp" });
    expect(onValueChange).toHaveBeenLastCalledWith(3.5);
    fireEvent.keyDown(slider, { key: "ArrowDown" });
    expect(onValueChange).toHaveBeenLastCalledWith(2.5);
  });

  it("jumps to bounds with shift + arrow", () => {
    const onValueChange = vi.fn();
    render(<HalfStars value={3} onValueChange={onValueChange} />);
    const slider = screen.getByRole("slider");
    fireEvent.keyDown(slider, { key: "ArrowRight", shiftKey: true });
    expect(onValueChange).toHaveBeenLastCalledWith(5);
    fireEvent.keyDown(slider, { key: "ArrowLeft", metaKey: true });
    expect(onValueChange).toHaveBeenLastCalledWith(0.5);
  });

  it("ignores unrelated slider keys", () => {
    const onValueChange = vi.fn();
    render(<HalfStars value={3} onValueChange={onValueChange} />);
    fireEvent.keyDown(screen.getByRole("slider"), { key: "Enter" });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("selects a half on a star's left side, whole on its right", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <HalfStars defaultValue={0} onValueChange={onValueChange} />,
    );
    const third = container.querySelectorAll('[data-slot="rating-button"]')[2];
    stubRect(third, 0, 20);
    fireEvent.click(third, { clientX: 5 }); // left half → 2.5
    expect(onValueChange).toHaveBeenLastCalledWith(2.5);
    fireEvent.click(third, { clientX: 15 }); // right half → 3
    expect(onValueChange).toHaveBeenLastCalledWith(3);
  });

  it("previews the hovered half and resets on leave", () => {
    const { container } = render(<HalfStars defaultValue={0} />);
    const fourth = container.querySelectorAll('[data-slot="rating-button"]')[3];
    stubRect(fourth, 0, 20);
    fireEvent.mouseMove(fourth, { clientX: 5 }); // index 3 + 0.5 = 3.5
    expect(fillWidths(container)).toEqual([
      "100%",
      "100%",
      "100%",
      "50%",
      "0%",
    ]);
    fireEvent.mouseLeave(container.querySelector('[data-slot="rating"]')!);
    expect(fullyFilled(container)).toBe(0);
  });

  it("is inert when read-only", () => {
    const onValueChange = vi.fn();
    const { container } = render(
      <HalfStars value={2.5} readOnly onValueChange={onValueChange} />,
    );
    const slider = screen.getByRole("slider");
    expect(slider).toHaveAttribute("aria-readonly", "true");
    expect(slider).toHaveAttribute("tabindex", "-1");
    fireEvent.keyDown(slider, { key: "ArrowRight" });
    const star = container.querySelectorAll('[data-slot="rating-button"]')[0];
    stubRect(star, 0, 20);
    fireEvent.click(star, { clientX: 15 });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("has no axe violations in half mode", async () => {
    const { container } = render(<HalfStars value={3.5} readOnly />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("Rating — form support", () => {
  it("renders a hidden input carrying the value when named", () => {
    const { container } = render(<Stars value={3} name="score" />);
    const input = container.querySelector<HTMLInputElement>(
      'input[type="hidden"][name="score"]',
    );
    expect(input).not.toBeNull();
    expect(input!.value).toBe("3");
  });

  it("omits the hidden input without a name", () => {
    const { container } = render(<Stars value={3} />);
    expect(container.querySelector('input[type="hidden"]')).toBeNull();
  });
});

describe("Rating — customization", () => {
  it("honors a custom icon size", () => {
    const { container } = render(
      <Rating value={1} readOnly>
        <RatingButton size={14} />
      </Rating>,
    );
    expect(container.querySelector("svg")).toHaveAttribute("width", "14");
  });

  it("renders a custom icon", () => {
    const { container } = render(
      <Rating value={1} readOnly>
        <RatingButton icon={<HeartIcon />} />
      </Rating>,
    );
    expect(container.querySelector("svg.lucide-heart")).not.toBeNull();
  });
});

describe("Rating — guard + a11y", () => {
  it("throws when RatingButton is used outside Rating", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<RatingButton />)).toThrow(/useRating/);
    spy.mockRestore();
  });

  it("has no axe violations (interactive + badge)", async () => {
    const { container } = render(
      <div>
        <Stars value={4} readOnly />
        <RatingBadge value={4.8} count={10} />
      </div>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
