/**
 * Tests for <Rating /> (components/ui/rating.tsx) — interactive star rating +
 * the read-only RatingBadge consolidation. Covers click/keyboard/hover, the
 * controlled + readonly modes, the badge variant, the context guard, and a11y.
 */

import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

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

describe("Rating — render", () => {
  it("renders a radiogroup of 5 star buttons", () => {
    render(<Stars defaultValue={0} />);
    expect(screen.getByRole("radiogroup", { name: "Rating" })).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  it("marks stars up to the value active (fill-current)", () => {
    const { container } = render(<Stars value={3} readOnly />);
    const filled = container.querySelectorAll("svg.fill-current");
    expect(filled).toHaveLength(3);
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
    expect(container.querySelectorAll("svg.fill-current")).toHaveLength(4);
    await user.unhover(buttons[3]);
    fireEvent.mouseLeave(container.querySelector('[data-slot="rating"]')!);
    expect(container.querySelectorAll("svg.fill-current")).toHaveLength(1);
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
