/**
 * Tests for <TagInput /> (components/ui/tag-input.tsx) — the Shopify-admin tags
 * input. Type to add chips, remove them, optional autocomplete. Covers
 * controlled + uncontrolled state, every commit/removal path, suggestion
 * filtering + selection, sizes, disabled, error ring, and a11y.
 */

import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { TagInput } from "@/components/ui/tag-input";

const field = () => screen.getByRole("textbox", { name: "Add tag" });

describe("TagInput — render", () => {
  it("renders the field and input slots", () => {
    const { container } = render(<TagInput defaultValue={["react"]} />);
    expect(container.querySelector('[data-slot="tag-input"]')).not.toBeNull();
    expect(
      container.querySelector('[data-slot="tag-input-field"]'),
    ).not.toBeNull();
    expect(
      container.querySelector('[data-slot="tag-input-input"]'),
    ).not.toBeNull();
  });

  it("renders existing tags", () => {
    render(<TagInput defaultValue={["react", "vue"]} />);
    expect(screen.getByText("react")).toBeInTheDocument();
    expect(screen.getByText("vue")).toBeInTheDocument();
  });

  it("uses a visible input fill on the field surface", () => {
    const { container } = render(<TagInput defaultValue={["react"]} />);
    const fieldSurface = container.querySelector(
      '[data-slot="tag-input-field"]',
    );
    expect(fieldSurface).toHaveClass("bg-input/30");
    expect(fieldSurface).not.toHaveClass("bg-transparent");
  });

  it("marks tags with neutral tone by default", () => {
    const { container } = render(<TagInput defaultValue={["react"]} />);
    expect(container.querySelector('[data-slot="tag-input-tag"]')).toHaveAttribute(
      "data-tone",
      "neutral",
    );
  });

  it("maps record tag tones to semantic badge variants", () => {
    const { container } = render(
      <TagInput
        defaultValue={["Qualified", "Blocked", "New"]}
        tagTones={{
          Qualified: "success",
          Blocked: "destructive",
          New: "brand",
        }}
      />,
    );
    const tags = container.querySelectorAll('[data-slot="tag-input-tag"]');
    expect(tags[0]).toHaveAttribute("data-tone", "success");
    expect(tags[0]).toHaveClass("bg-success/10", "text-success");
    expect(tags[1]).toHaveAttribute("data-tone", "destructive");
    expect(tags[1]).toHaveClass("bg-destructive/10", "text-destructive");
    expect(tags[2]).toHaveAttribute("data-tone", "brand");
    expect(tags[2]).toHaveClass("bg-primary", "text-primary-foreground");
  });

  it("shows the placeholder", () => {
    render(<TagInput placeholder="Add a tag…" />);
    expect(field()).toHaveAttribute("placeholder", "Add a tag…");
  });

  it("merges className onto the field", () => {
    const { container } = render(<TagInput className="custom-field" />);
    expect(container.querySelector('[data-slot="tag-input-field"]')).toHaveClass(
      "custom-field",
    );
  });

  it("focuses the input when the field is clicked", async () => {
    const user = userEvent.setup();
    const { container } = render(<TagInput />);
    await user.click(
      container.querySelector('[data-slot="tag-input-field"]') as HTMLElement,
    );
    expect(field()).toHaveFocus();
  });
});

describe("TagInput — adding tags", () => {
  it("adds a tag on Enter and fires onChange (controlled)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={["react"]} onChange={onChange} />);
    await user.type(field(), "vue{Enter}");
    expect(onChange).toHaveBeenCalledWith(["react", "vue"]);
  });

  it("adds a tag on comma", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={[]} onChange={onChange} />);
    await user.type(field(), "svelte,");
    expect(onChange).toHaveBeenCalledWith(["svelte"]);
  });

  it("updates internal state when uncontrolled", async () => {
    const user = userEvent.setup();
    render(<TagInput defaultValue={["react"]} />);
    await user.type(field(), "vue{Enter}");
    expect(screen.getByText("vue")).toBeInTheDocument();
    expect(field()).toHaveValue("");
  });

  it("ignores duplicate tags", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={["react"]} onChange={onChange} />);
    await user.type(field(), "react{Enter}");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("ignores an empty / whitespace-only commit", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={[]} onChange={onChange} />);
    await user.type(field(), "   {Enter}");
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("TagInput — removing tags", () => {
  it("removes a specific tag via its × button", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={["react", "vue"]} onChange={onChange} />);
    await user.click(screen.getByRole("button", { name: "Remove react" }));
    expect(onChange).toHaveBeenCalledWith(["vue"]);
  });

  it("removes the last tag on Backspace when the input is empty", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={["react", "vue"]} onChange={onChange} />);
    field().focus();
    await user.keyboard("{Backspace}");
    expect(onChange).toHaveBeenCalledWith(["react"]);
  });

  it("does not remove on Backspace when the input has text", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={["react"]} onChange={onChange} />);
    await user.type(field(), "v{Backspace}");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("does nothing on Backspace when there are no tags", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={[]} onChange={onChange} />);
    field().focus();
    await user.keyboard("{Backspace}");
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("TagInput — maxTags", () => {
  it("disables the input at the cap and prevents adding", () => {
    render(<TagInput value={["a", "b"]} maxTags={2} onChange={() => {}} />);
    expect(field()).toBeDisabled();
  });

  it("disables the input once a commit reaches the cap", async () => {
    // Under cap the input is enabled; committing the last allowed tag reaches
    // the cap and disables the field.
    const user = userEvent.setup();
    render(<TagInput defaultValue={["a"]} maxTags={2} />);
    await user.type(field(), "b{Enter}");
    expect(screen.getByText("b")).toBeInTheDocument();
    expect(field()).toBeDisabled();
  });
});

describe("TagInput — suggestions", () => {
  const SUGS = ["react", "redux", "vue"];

  it("filters suggestions as the user types", async () => {
    const user = userEvent.setup();
    render(<TagInput value={[]} onChange={() => {}} suggestions={SUGS} />);
    await user.type(field(), "re");
    const list = screen.getByRole("listbox");
    expect(within(list).getByText("react")).toBeInTheDocument();
    expect(within(list).getByText("redux")).toBeInTheDocument();
    expect(within(list).queryByText("vue")).toBeNull();
  });

  it("hides already-added suggestions", async () => {
    const user = userEvent.setup();
    render(
      <TagInput value={["react"]} onChange={() => {}} suggestions={SUGS} />,
    );
    await user.type(field(), "re");
    const list = screen.getByRole("listbox");
    expect(within(list).queryByText("react")).toBeNull();
    expect(within(list).getByText("redux")).toBeInTheDocument();
  });

  it("adds a suggestion when clicked", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={[]} onChange={onChange} suggestions={SUGS} />);
    await user.type(field(), "vu");
    await user.click(screen.getByRole("option", { name: "vue" }));
    expect(onChange).toHaveBeenCalledWith(["vue"]);
  });

  it("selects the highlighted suggestion on Enter via arrow keys", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={[]} onChange={onChange} suggestions={SUGS} />);
    await user.type(field(), "re");
    await user.keyboard("{ArrowDown}{Enter}");
    expect(onChange).toHaveBeenCalledWith(["react"]);
  });

  it("wraps highlight with ArrowUp from the top", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={[]} onChange={onChange} suggestions={SUGS} />);
    await user.type(field(), "re");
    await user.keyboard("{ArrowUp}{Enter}");
    // ArrowUp from -1 wraps to the last match ("redux").
    expect(onChange).toHaveBeenCalledWith(["redux"]);
  });

  it("ignores arrow keys when no suggestions are open", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={[]} onChange={onChange} />);
    field().focus();
    await user.keyboard("{ArrowDown}{ArrowUp}{Enter}");
    expect(onChange).not.toHaveBeenCalled();
  });

  it("moves highlight down then back up with arrow keys", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={[]} onChange={onChange} suggestions={SUGS} />);
    await user.type(field(), "re");
    // Down to "react" (0), down to "redux" (1), up back to "react" (0).
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowUp}{Enter}");
    expect(onChange).toHaveBeenCalledWith(["react"]);
  });

  it("commits free text when no suggestion is highlighted", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<TagInput value={[]} onChange={onChange} suggestions={SUGS} />);
    await user.type(field(), "react{Enter}");
    expect(onChange).toHaveBeenCalledWith(["react"]);
  });
});

describe("TagInput — sizes", () => {
  it.each(["sm", "default", "lg"] as const)("renders %s size", (size) => {
    const { container } = render(<TagInput size={size} defaultValue={["x"]} />);
    expect(
      container.querySelector('[data-slot="tag-input-field"]'),
    ).not.toBeNull();
  });
});

describe("TagInput — states", () => {
  it("disables the input and remove buttons when disabled", () => {
    render(<TagInput disabled defaultValue={["react"]} />);
    expect(field()).toBeDisabled();
    expect(screen.getByRole("button", { name: "Remove react" })).toBeDisabled();
  });

  it("applies the destructive ring when error", () => {
    const { container } = render(<TagInput error defaultValue={["x"]} />);
    expect(container.querySelector('[data-slot="tag-input-field"]')).toHaveClass(
      "border-destructive",
    );
    expect(field()).toHaveAttribute("aria-invalid", "true");
  });

  it("renders hidden inputs for form submission when name is set", () => {
    const { container } = render(
      <TagInput name="tags" defaultValue={["react", "vue"]} />,
    );
    const hidden = container.querySelectorAll('input[type="hidden"][name="tags"]');
    expect(hidden).toHaveLength(2);
  });

  it("passes through id to the input", () => {
    render(<TagInput id="topics" />);
    expect(field()).toHaveAttribute("id", "topics");
  });
});

describe("TagInput — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(
      <TagInput defaultValue={["react", "vue"]} placeholder="Add a tag…" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
