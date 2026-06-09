import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, describe, it, vi } from "vitest";
import { axe } from "vitest-axe";
import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";

// ─── helpers ───────────────────────────────────────────────────────────────

/** Controlled wrapper that tracks typed value and exposes it via data-testid */
function ControlledTextarea(props: React.ComponentProps<typeof Textarea>) {
  const [value, setValue] = useState(props.defaultValue as string ?? "");
  return (
    <>
      <span data-testid="value">{value}</span>
      <Textarea
        {...props}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </>
  );
}

// ─── 1. Renders without crashing (default usage) ───────────────────────────
describe("renders without crashing", () => {
  it("mounts with no props", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders a <textarea> element (role=textbox)", () => {
    render(<Textarea />);
    const el = screen.getByRole("textbox");
    expect(el.tagName).toBe("TEXTAREA");
  });

  it("renders with data-slot=textarea attribute", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveAttribute("data-slot", "textarea");
  });

  it("renders with a placeholder", () => {
    render(<Textarea placeholder="Type here…" />);
    expect(screen.getByPlaceholderText("Type here…")).toBeInTheDocument();
  });

  it("renders with a defaultValue (uncontrolled)", () => {
    render(<Textarea defaultValue="Hello world" />);
    expect(screen.getByRole("textbox")).toHaveValue("Hello world");
  });

  it("renders with a controlled value prop", () => {
    render(<Textarea value="Controlled" onChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).toHaveValue("Controlled");
  });

  it("renders inside a <form> without crashing", () => {
    render(
      <form>
        <Textarea name="message" />
      </form>
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("renders with an id and is matchable by label", () => {
    render(
      <>
        <label htmlFor="my-ta">Label</label>
        <Textarea id="my-ta" />
      </>
    );
    expect(screen.getByLabelText("Label")).toBeInTheDocument();
  });
});

// ─── 2. Base CSS classes ───────────────────────────────────────────────────
describe("base CSS classes", () => {
  it("has class flex", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("flex");
  });

  it("has class w-full", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("w-full");
  });

  it("has class rounded-lg", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("rounded-lg");
  });

  it("has class border", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("border");
  });

  it("has class border-input", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("border-input");
  });

  it("has visible input fill in light mode", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("bg-input/30");
    expect(screen.getByRole("textbox")).not.toHaveClass("bg-transparent");
  });

  it("has class min-h-16", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("min-h-16");
  });

  it("has class transition-colors", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("transition-colors");
  });

  it("has class outline-none", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("outline-none");
  });

  it("has class px-2.5", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("px-2.5");
  });

  it("has class py-2", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("py-2");
  });

  it("has class text-base", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("text-base");
  });

  it("has class field-sizing-content", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("field-sizing-content");
  });
});

// ─── 3. Custom className merging ──────────────────────────────────────────
describe("custom className", () => {
  it("accepts a custom className and applies it", () => {
    render(<Textarea className="custom-class" />);
    expect(screen.getByRole("textbox")).toHaveClass("custom-class");
  });

  it("custom className does NOT remove base classes", () => {
    render(<Textarea className="extra" />);
    const el = screen.getByRole("textbox");
    expect(el).toHaveClass("extra");
    expect(el).toHaveClass("rounded-lg");
    expect(el).toHaveClass("border");
    expect(el).toHaveClass("w-full");
  });

  it("accepts multiple custom classes", () => {
    render(<Textarea className="font-mono text-xs field-sizing-fixed" />);
    const el = screen.getByRole("textbox");
    expect(el).toHaveClass("font-mono");
    expect(el).toHaveClass("text-xs");
    expect(el).toHaveClass("field-sizing-fixed");
  });

  it("fixed height override via className (field-sizing-fixed)", () => {
    render(<Textarea className="field-sizing-fixed max-h-64" />);
    const el = screen.getByRole("textbox");
    expect(el).toHaveClass("field-sizing-fixed");
    expect(el).toHaveClass("max-h-64");
  });
});

// ─── 4. Disabled state ────────────────────────────────────────────────────
describe("disabled state", () => {
  it("renders as disabled when disabled prop is set", () => {
    render(<Textarea disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("disabled textarea has disabled CSS classes", () => {
    render(<Textarea disabled />);
    const el = screen.getByRole("textbox");
    expect(el).toHaveClass("disabled:cursor-not-allowed");
  });

  it("disabled textarea has disabled:opacity-50 class", () => {
    render(<Textarea disabled />);
    expect(screen.getByRole("textbox")).toHaveClass("disabled:opacity-50");
  });

  it("disabled textarea has disabled:bg-input/50 class", () => {
    render(<Textarea disabled />);
    expect(screen.getByRole("textbox")).toHaveClass("disabled:bg-input/50");
  });

  it("disabled empty textarea still renders placeholder", () => {
    render(<Textarea disabled placeholder="You cannot edit this field" />);
    expect(
      screen.getByPlaceholderText("You cannot edit this field")
    ).toBeDisabled();
  });

  it("disabled prefilled textarea shows defaultValue", () => {
    render(
      <Textarea
        disabled
        defaultValue="This content is read-only and cannot be changed by the user."
      />
    );
    const el = screen.getByRole("textbox");
    expect(el).toBeDisabled();
    expect(el).toHaveValue(
      "This content is read-only and cannot be changed by the user."
    );
  });

  it("user cannot type into a disabled textarea", async () => {
    const user = userEvent.setup();
    render(<Textarea disabled defaultValue="initial" />);
    const el = screen.getByRole("textbox");
    await user.type(el, "more text");
    expect(el).toHaveValue("initial");
  });

  it("not disabled by default", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).not.toBeDisabled();
  });
});

// ─── 5. Readonly state ────────────────────────────────────────────────────
describe("readOnly state", () => {
  it("renders as readOnly when readOnly prop is set", () => {
    render(<Textarea readOnly value="read-only content" onChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("readonly");
  });

  it("readOnly textarea preserves the value", () => {
    const SNIPPET = "// Generated config\nexport const x = 1;";
    render(<Textarea readOnly value={SNIPPET} onChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).toHaveValue(SNIPPET);
  });

  it("user cannot modify a readOnly textarea via typing", async () => {
    const user = userEvent.setup();
    render(<Textarea readOnly value="fixed" onChange={vi.fn()} />);
    const el = screen.getByRole("textbox");
    await user.type(el, "extra");
    // Value stays the same because it is controlled + readOnly
    expect(el).toHaveValue("fixed");
  });

  it("readOnly textarea is not disabled (still focusable)", () => {
    render(<Textarea readOnly value="x" onChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).not.toBeDisabled();
  });

  it("readOnly textarea with rows=10 and font-mono className", () => {
    render(
      <Textarea
        readOnly
        value="code"
        onChange={vi.fn()}
        rows={10}
        className="font-mono text-xs field-sizing-fixed"
      />
    );
    const el = screen.getByRole("textbox");
    expect(el).toHaveAttribute("rows", "10");
    expect(el).toHaveClass("font-mono");
    expect(el).toHaveClass("text-xs");
  });
});

// ─── 6. aria-invalid / error state ────────────────────────────────────────
describe("aria-invalid (error state)", () => {
  it("renders without aria-invalid by default", () => {
    render(<Textarea />);
    // Not present or false
    const el = screen.getByRole("textbox");
    expect(el).not.toHaveAttribute("aria-invalid", "true");
  });

  it("has aria-invalid=true when aria-invalid prop is set to true", () => {
    render(<Textarea aria-invalid={true} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("has aria-invalid CSS classes applied", () => {
    render(<Textarea aria-invalid={true} />);
    const el = screen.getByRole("textbox");
    expect(el).toHaveClass("aria-invalid:border-destructive");
  });

  it("aria-invalid:ring-3 class is present", () => {
    render(<Textarea aria-invalid={true} />);
    expect(screen.getByRole("textbox")).toHaveClass("aria-invalid:ring-3");
  });

  it("aria-invalid:ring-destructive/20 class is present", () => {
    render(<Textarea aria-invalid={true} />);
    expect(screen.getByRole("textbox")).toHaveClass(
      "aria-invalid:ring-destructive/20"
    );
  });

  it("accepts aria-describedby for error message linkage", () => {
    render(
      <>
        <Textarea
          id="bio"
          aria-invalid={true}
          aria-describedby="bio-error"
          value="x"
          onChange={vi.fn()}
        />
        <p id="bio-error">Bio must be 120 characters or fewer.</p>
      </>
    );
    expect(screen.getByRole("textbox")).toHaveAttribute(
      "aria-describedby",
      "bio-error"
    );
  });

  it("error state can be toggled: valid→invalid via re-render", () => {
    const { rerender } = render(
      <Textarea aria-invalid={false} value="" onChange={vi.fn()} />
    );
    expect(screen.getByRole("textbox")).not.toHaveAttribute(
      "aria-invalid",
      "true"
    );

    rerender(<Textarea aria-invalid={true} value="too long" onChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });
});

// ─── 7. Required state ────────────────────────────────────────────────────
describe("required state", () => {
  it("accepts required prop", () => {
    render(
      <>
        <label htmlFor="desc">Description</label>
        <Textarea id="desc" required />
      </>
    );
    expect(screen.getByLabelText("Description")).toBeRequired();
  });

  it("not required by default", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).not.toBeRequired();
  });
});

// ─── 8. Native textarea HTML attributes ───────────────────────────────────
describe("native HTML attributes forwarded", () => {
  it("forwards name attribute", () => {
    render(<Textarea name="message" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("name", "message");
  });

  it("forwards id attribute", () => {
    render(<Textarea id="my-textarea" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("id", "my-textarea");
  });

  it("forwards rows attribute", () => {
    render(<Textarea rows={6} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "6");
  });

  it("forwards cols attribute", () => {
    render(<Textarea cols={40} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("cols", "40");
  });

  it("forwards maxLength attribute", () => {
    render(<Textarea maxLength={280} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("maxlength", "280");
  });

  it("forwards minLength attribute", () => {
    render(<Textarea minLength={20} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("minlength", "20");
  });

  it("forwards tabIndex attribute", () => {
    render(<Textarea tabIndex={2} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("tabindex", "2");
  });

  it("forwards autoFocus attribute", () => {
    render(<Textarea autoFocus />);
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("forwards spellCheck attribute", () => {
    render(<Textarea spellCheck={false} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("spellcheck", "false");
  });

  it("forwards data-* attributes", () => {
    render(<Textarea data-testid="custom-ta" data-custom="yes" />);
    expect(screen.getByTestId("custom-ta")).toHaveAttribute(
      "data-custom",
      "yes"
    );
  });

  it("forwards aria-label attribute", () => {
    render(<Textarea aria-label="Your message" />);
    expect(screen.getByRole("textbox", { name: "Your message" })).toBeInTheDocument();
  });

  it("forwards aria-labelledby attribute", () => {
    render(
      <>
        <span id="lbl">Notes</span>
        <Textarea aria-labelledby="lbl" />
      </>
    );
    expect(screen.getByRole("textbox", { name: "Notes" })).toBeInTheDocument();
  });

  it("forwards placeholder attribute", () => {
    render(<Textarea placeholder="Type something here…" />);
    expect(
      screen.getByPlaceholderText("Type something here…")
    ).toBeInTheDocument();
  });

  it("forwards autoComplete attribute", () => {
    render(<Textarea autoComplete="off" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("autocomplete", "off");
  });
});

// ─── 9. ref forwarding ────────────────────────────────────────────────────
describe("ref forwarding", () => {
  it("ref is forwarded to the underlying textarea element", () => {
    let ref: HTMLTextAreaElement | null = null;
    function TestComp() {
      const r = useRef<HTMLTextAreaElement>(null);
      ref = r.current;
      return (
        <Textarea
          ref={(el) => {
            ref = el;
          }}
        />
      );
    }
    render(<TestComp />);
    expect(ref).not.toBeNull();
    expect((ref as unknown as HTMLTextAreaElement)?.tagName).toBe("TEXTAREA");
  });
});

// ─── 10. Interactions: typing ─────────────────────────────────────────────
describe("interactions – typing", () => {
  it("fires onChange when user types a character", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "a");
    expect(onChange).toHaveBeenCalled();
  });

  it("reflects typed text in controlled component", async () => {
    const user = userEvent.setup();
    render(<ControlledTextarea />);
    await user.type(screen.getByRole("textbox"), "Hello");
    expect(screen.getByTestId("value")).toHaveTextContent("Hello");
  });

  it("accumulates multiple typed characters", async () => {
    const user = userEvent.setup();
    render(<ControlledTextarea />);
    await user.type(screen.getByRole("textbox"), "Hi there");
    expect(screen.getByRole("textbox")).toHaveValue("Hi there");
  });

  it("fires onChange with correct event target value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "test");
    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.target.value).toMatch(/test/);
  });

  it("supports pasting text", async () => {
    const user = userEvent.setup();
    render(<ControlledTextarea />);
    const ta = screen.getByRole("textbox");
    await user.click(ta);
    await user.paste("Pasted text");
    expect(screen.getByRole("textbox")).toHaveValue("Pasted text");
  });

  it("supports clearing text by selecting all and deleting", async () => {
    const user = userEvent.setup();
    render(<ControlledTextarea />);
    const ta = screen.getByRole("textbox");
    await user.type(ta, "some text");
    await user.clear(ta);
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("supports backspace to delete characters", async () => {
    const user = userEvent.setup();
    render(<ControlledTextarea />);
    const ta = screen.getByRole("textbox");
    await user.type(ta, "Hi");
    await user.keyboard("{Backspace}");
    expect(screen.getByRole("textbox")).toHaveValue("H");
  });

  it("multiline: Enter creates a newline", async () => {
    const user = userEvent.setup();
    render(<ControlledTextarea />);
    const ta = screen.getByRole("textbox");
    await user.type(ta, "line1{Enter}line2");
    expect(screen.getByRole("textbox")).toHaveValue("line1\nline2");
  });

  it("does not fire onChange when disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea disabled onChange={onChange} />);
    await user.type(screen.getByRole("textbox"), "x");
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ─── 11. Interactions: focus/blur ─────────────────────────────────────────
describe("interactions – focus and blur", () => {
  it("receives focus on click", async () => {
    const user = userEvent.setup();
    render(<Textarea />);
    const ta = screen.getByRole("textbox");
    await user.click(ta);
    expect(ta).toHaveFocus();
  });

  it("fires onFocus callback when focused", async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    render(<Textarea onFocus={onFocus} />);
    await user.click(screen.getByRole("textbox"));
    expect(onFocus).toHaveBeenCalled();
  });

  it("fires onBlur callback when blurred", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(
      <>
        <Textarea onBlur={onBlur} />
        <button>other</button>
      </>
    );
    await user.click(screen.getByRole("textbox"));
    await user.click(screen.getByRole("button", { name: "other" }));
    expect(onBlur).toHaveBeenCalled();
  });

  it("focus is reachable via Tab key", async () => {
    const user = userEvent.setup();
    render(<Textarea />);
    await user.tab();
    expect(screen.getByRole("textbox")).toHaveFocus();
  });

  it("disabled textarea cannot receive focus via Tab", async () => {
    const user = userEvent.setup();
    render(<Textarea disabled />);
    await user.tab();
    expect(screen.getByRole("textbox")).not.toHaveFocus();
  });
});

// ─── 12. Character count example pattern ─────────────────────────────────
describe("character count integration (example pattern)", () => {
  const LIMIT = 280;

  function CharCountExample() {
    const [value, setValue] = useState("");
    const remaining = LIMIT - value.length;
    const isOver = remaining < 0;
    return (
      <div>
        <label htmlFor="post">Write a post</label>
        <Textarea
          id="post"
          placeholder="What's on your mind?"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-invalid={isOver}
          rows={4}
        />
        <span data-testid="remaining">{remaining}</span>
      </div>
    );
  }

  it("shows 280 remaining initially", () => {
    render(<CharCountExample />);
    expect(screen.getByTestId("remaining")).toHaveTextContent("280");
  });

  it("remaining count decreases as user types", async () => {
    const user = userEvent.setup();
    render(<CharCountExample />);
    await user.type(screen.getByRole("textbox"), "Hi");
    expect(screen.getByTestId("remaining")).toHaveTextContent("278");
  });

  it("aria-invalid is false when within limit", async () => {
    const user = userEvent.setup();
    render(<CharCountExample />);
    await user.type(screen.getByRole("textbox"), "Hello");
    expect(screen.getByRole("textbox")).not.toHaveAttribute("aria-invalid", "true");
  });

  it("aria-invalid becomes true when over limit", async () => {
    const user = userEvent.setup();
    render(<CharCountExample />);
    // Type 281 characters
    const longText = "a".repeat(281);
    await user.type(screen.getByRole("textbox"), longText);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });
});

// ─── 13. Label and hint pattern ──────────────────────────────────────────
describe("label and hint integration (example pattern)", () => {
  it("associates label via htmlFor/id", () => {
    render(
      <>
        <label htmlFor="notes">Notes</label>
        <Textarea id="notes" placeholder="Add any relevant notes…" rows={3} />
      </>
    );
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
  });

  it("forwards rows=3 attribute correctly", () => {
    render(<Textarea rows={3} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "3");
  });

  it("forwards rows=4 attribute correctly", () => {
    render(<Textarea rows={4} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "4");
  });

  it("required textarea is identified as required", () => {
    render(
      <>
        <label htmlFor="description">Description</label>
        <Textarea id="description" required rows={4} />
      </>
    );
    expect(screen.getByLabelText("Description")).toBeRequired();
  });
});

// ─── 14. Auto-resize (field-sizing-content) ───────────────────────────────
describe("auto-resize (field-sizing-content)", () => {
  it("has field-sizing-content class by default (auto-grow support)", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("field-sizing-content");
  });

  it("field-sizing-fixed via className overrides the default for fixed height", () => {
    render(<Textarea className="field-sizing-fixed" />);
    expect(screen.getByRole("textbox")).toHaveClass("field-sizing-fixed");
  });
});

// ─── 15. Placeholder styling class ────────────────────────────────────────
describe("placeholder styling", () => {
  it("has placeholder:text-muted-foreground class", () => {
    render(<Textarea placeholder="hint" />);
    expect(screen.getByRole("textbox")).toHaveClass(
      "placeholder:text-muted-foreground"
    );
  });
});

// ─── 16. Focus-visible styling classes ────────────────────────────────────
describe("focus-visible styling classes", () => {
  it("has focus-visible:border-ring class", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("focus-visible:border-ring");
  });

  it("has focus-visible:ring-3 class", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("focus-visible:ring-3");
  });

  it("has focus-visible:ring-ring/50 class", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("focus-visible:ring-ring/50");
  });
});

// ─── 17. Dark-mode classes ────────────────────────────────────────────────
describe("dark mode CSS classes", () => {
  it("has dark:bg-input/30 class", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("dark:bg-input/30");
  });

  it("has dark:disabled:bg-input/80 class", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass("dark:disabled:bg-input/80");
  });

  it("has dark:aria-invalid:border-destructive/50 class", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass(
      "dark:aria-invalid:border-destructive/50"
    );
  });

  it("has dark:aria-invalid:ring-destructive/40 class", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveClass(
      "dark:aria-invalid:ring-destructive/40"
    );
  });
});

// ─── 18. Uncontrolled → controlled / rerender ─────────────────────────────
describe("rerender behavior", () => {
  it("updating the value prop changes the displayed value", () => {
    const { rerender } = render(
      <Textarea value="first" onChange={vi.fn()} />
    );
    expect(screen.getByRole("textbox")).toHaveValue("first");
    rerender(<Textarea value="second" onChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).toHaveValue("second");
  });

  it("toggling disabled state updates the element", () => {
    const { rerender } = render(<Textarea disabled={false} />);
    expect(screen.getByRole("textbox")).not.toBeDisabled();
    rerender(<Textarea disabled={true} />);
    expect(screen.getByRole("textbox")).toBeDisabled();
    rerender(<Textarea disabled={false} />);
    expect(screen.getByRole("textbox")).not.toBeDisabled();
  });

  it("toggling aria-invalid updates the attribute", () => {
    const { rerender } = render(
      <Textarea aria-invalid={false} value="" onChange={vi.fn()} />
    );
    expect(screen.getByRole("textbox")).not.toHaveAttribute(
      "aria-invalid",
      "true"
    );
    rerender(<Textarea aria-invalid={true} value="" onChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });
});

// ─── 19. Form integration ─────────────────────────────────────────────────
describe("form integration", () => {
  it("participates in form via name attribute", () => {
    render(
      <form data-testid="form">
        <Textarea name="bio" defaultValue="my bio" />
      </form>
    );
    const ta = screen.getByRole("textbox");
    expect(ta).toHaveAttribute("name", "bio");
    expect(ta).toHaveValue("my bio");
  });

  it("a required empty textarea is invalid on form submission attempt", () => {
    render(
      <form data-testid="form">
        <label htmlFor="req">Required</label>
        <Textarea id="req" name="req" required />
      </form>
    );
    const ta = screen.getByRole("textbox");
    expect(ta).toBeRequired();
  });
});

// ─── 20. Edge cases ───────────────────────────────────────────────────────
describe("edge cases", () => {
  it("renders with an empty string value without crashing", () => {
    render(<Textarea value="" onChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("renders with a very long value without crashing", () => {
    const longValue = "a".repeat(10000);
    render(<Textarea value={longValue} onChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).toHaveValue(longValue);
  });

  it("renders with multiline value (newlines in defaultValue)", () => {
    render(<Textarea defaultValue={"line1\nline2\nline3"} />);
    expect(screen.getByRole("textbox")).toHaveValue("line1\nline2\nline3");
  });

  it("renders with special characters in value", () => {
    render(<Textarea value="<script>alert('xss')</script>" onChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).toHaveValue(
      "<script>alert('xss')</script>"
    );
  });

  it("renders with emoji in value", () => {
    render(<Textarea value="Hello 🎉" onChange={vi.fn()} />);
    expect(screen.getByRole("textbox")).toHaveValue("Hello 🎉");
  });

  it("onChange not called without user interaction", () => {
    const onChange = vi.fn();
    render(<Textarea onChange={onChange} />);
    expect(onChange).not.toHaveBeenCalled();
  });

  it("multiple textareas can coexist on the same page", () => {
    render(
      <>
        <Textarea aria-label="First" />
        <Textarea aria-label="Second" />
        <Textarea aria-label="Third" />
      </>
    );
    const textboxes = screen.getAllByRole("textbox");
    expect(textboxes).toHaveLength(3);
  });
});

// ─── 21. Accessibility (axe) ──────────────────────────────────────────────
describe("accessibility (axe)", () => {
  it("has no axe violations with a labeled textarea", async () => {
    const { container } = render(
      <>
        <label htmlFor="msg">Your message</label>
        <Textarea id="msg" placeholder="Type something here…" />
      </>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations with aria-label", async () => {
    const { container } = render(
      <Textarea aria-label="Message input" placeholder="Type here" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations in disabled state", async () => {
    const { container } = render(
      <>
        <label htmlFor="dis">Disabled field</label>
        <Textarea id="dis" disabled placeholder="Cannot edit" />
      </>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations in error state with describedby", async () => {
    const { container } = render(
      <>
        <label htmlFor="err">Bio</label>
        <Textarea
          id="err"
          aria-invalid={true}
          aria-describedby="err-msg"
          value="too long"
          onChange={vi.fn()}
        />
        <p id="err-msg">Must be 120 characters or fewer.</p>
      </>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations in readOnly state", async () => {
    const { container } = render(
      <>
        <label htmlFor="ro">Generated output</label>
        <Textarea id="ro" readOnly value="code snippet" onChange={vi.fn()} />
      </>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations in required state", async () => {
    const { container } = render(
      <>
        <label htmlFor="req">Description</label>
        <Textarea id="req" required rows={4} />
      </>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations after user has typed content", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <label htmlFor="typed">Message</label>
        <ControlledTextarea id="typed" />
      </>
    );
    await user.type(screen.getByRole("textbox"), "Hello world");
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
