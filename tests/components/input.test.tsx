/**
 * Exhaustive tests for <Input />
 *
 * Component source: components/ui/input.tsx
 * Built on: @base-ui-components/react Input primitive
 *
 * API (passes all standard <input> HTML attributes):
 *   type          string   – any valid HTML input type (text, email, password, search,
 *                            url, tel, number, date, time, color, file, …)
 *   placeholder   string   – placeholder text
 *   value         string   – controlled value
 *   defaultValue  string   – uncontrolled default
 *   disabled      boolean  – renders disabled state
 *   readOnly      boolean  – read-only state
 *   aria-invalid  boolean  – error/invalid state (adds destructive ring)
 *   className     string   – merged onto the input element
 *   id            string   – used with <label> for accessible labeling
 *   accept        string   – used with type="file"
 *   ref           Ref<HTMLInputElement> – forwarded ref
 *   onChange      handler  – controlled input handler
 *   …and any other React.ComponentProps<"input"> prop
 *
 * Base class tokens (always present):
 *   h-8 w-full min-w-0 rounded-lg border border-input bg-input/30
 *   px-2.5 py-1 text-base transition-colors outline-none
 *
 * State classes:
 *   disabled:  disabled:pointer-events-none disabled:cursor-not-allowed
 *              disabled:bg-input/50 disabled:opacity-50
 *   invalid:   aria-invalid:border-destructive aria-invalid:ring-3
 *              aria-invalid:ring-destructive/20
 *
 * Focus-visible:
 *   focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50
 *
 * data-slot="input" attribute always present.
 */

import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Input } from "@/components/ui/input";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the rendered <input> element. */
function getInput(container: HTMLElement): HTMLInputElement {
  return container.querySelector("input") as HTMLInputElement;
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing — default usage
// ---------------------------------------------------------------------------

describe("Input — renders without crashing", () => {
  it("renders with no props", () => {
    const { container } = render(<Input />);
    expect(getInput(container)).toBeInTheDocument();
  });

  it("renders as an <input> element", () => {
    const { container } = render(<Input />);
    expect(getInput(container).tagName).toBe("INPUT");
  });

  it("has data-slot='input' attribute", () => {
    const { container } = render(<Input />);
    expect(getInput(container)).toHaveAttribute("data-slot", "input");
  });

  it("renders with type='text' by default (browser default)", () => {
    const { container } = render(<Input />);
    // Without a type prop the browser defaults to 'text'
    const input = getInput(container);
    expect(input.type).toBe("text");
  });

  it("renders with an explicit type prop", () => {
    const { container } = render(<Input type="email" />);
    expect(getInput(container)).toHaveAttribute("type", "email");
  });

  it("renders placeholder text", () => {
    render(<Input placeholder="Enter your name" />);
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
  });

  it("renders with defaultValue", () => {
    const { container } = render(<Input defaultValue="hello" />);
    expect(getInput(container)).toHaveValue("hello");
  });

  it("renders with controlled value", () => {
    const { container } = render(
      <Input value="controlled" onChange={() => {}} />
    );
    expect(getInput(container)).toHaveValue("controlled");
  });

  it("renders with an id attribute", () => {
    const { container } = render(<Input id="my-input" />);
    expect(getInput(container)).toHaveAttribute("id", "my-input");
  });
});

// ---------------------------------------------------------------------------
// 2. Base CSS class tokens
// ---------------------------------------------------------------------------

describe("Input — base class tokens", () => {
  it("has h-8 class", () => {
    const { container } = render(<Input />);
    expect(getInput(container).className).toContain("h-8");
  });

  it("has w-full class", () => {
    const { container } = render(<Input />);
    expect(getInput(container).className).toContain("w-full");
  });

  it("has min-w-0 class", () => {
    const { container } = render(<Input />);
    expect(getInput(container).className).toContain("min-w-0");
  });

  it("has rounded-lg class", () => {
    const { container } = render(<Input />);
    expect(getInput(container).className).toContain("rounded-lg");
  });

  it("has border class", () => {
    const { container } = render(<Input />);
    expect(getInput(container).className).toContain("border");
  });

  it("has border-input class", () => {
    const { container } = render(<Input />);
    expect(getInput(container).className).toContain("border-input");
  });

  it("has visible input fill in light mode", () => {
    const { container } = render(<Input />);
    expect(getInput(container)).toHaveClass("bg-input/30");
    expect(getInput(container)).not.toHaveClass("bg-transparent");
  });

  it("has px-2.5 class", () => {
    const { container } = render(<Input />);
    expect(getInput(container).className).toContain("px-2.5");
  });

  it("has py-1 class", () => {
    const { container } = render(<Input />);
    expect(getInput(container).className).toContain("py-1");
  });

  it("has text-base class", () => {
    const { container } = render(<Input />);
    expect(getInput(container).className).toContain("text-base");
  });

  it("has transition-colors class", () => {
    const { container } = render(<Input />);
    expect(getInput(container).className).toContain("transition-colors");
  });

  it("has outline-none class", () => {
    const { container } = render(<Input />);
    expect(getInput(container).className).toContain("outline-none");
  });

  it("has placeholder:text-muted-foreground class", () => {
    const { container } = render(<Input />);
    expect(getInput(container).className).toContain("placeholder:text-muted-foreground");
  });

  it("has focus-visible:border-ring class", () => {
    const { container } = render(<Input />);
    expect(getInput(container).className).toContain("focus-visible:border-ring");
  });

  it("has focus-visible:ring-3 class", () => {
    const { container } = render(<Input />);
    expect(getInput(container).className).toContain("focus-visible:ring-3");
  });

  it("has focus-visible:ring-ring/50 class", () => {
    const { container } = render(<Input />);
    expect(getInput(container).className).toContain("focus-visible:ring-ring/50");
  });
});

// ---------------------------------------------------------------------------
// 3. Disabled state
// ---------------------------------------------------------------------------

describe("Input — disabled state", () => {
  it("is disabled when disabled prop is true", () => {
    const { container } = render(<Input disabled />);
    expect(getInput(container)).toBeDisabled();
  });

  it("has disabled:pointer-events-none class when disabled", () => {
    const { container } = render(<Input disabled />);
    expect(getInput(container).className).toContain("disabled:pointer-events-none");
  });

  it("has disabled:cursor-not-allowed class when disabled", () => {
    const { container } = render(<Input disabled />);
    expect(getInput(container).className).toContain("disabled:cursor-not-allowed");
  });

  it("has disabled:bg-input/50 class when disabled", () => {
    const { container } = render(<Input disabled />);
    expect(getInput(container).className).toContain("disabled:bg-input/50");
  });

  it("has disabled:opacity-50 class when disabled", () => {
    const { container } = render(<Input disabled />);
    expect(getInput(container).className).toContain("disabled:opacity-50");
  });

  it("is not disabled by default", () => {
    const { container } = render(<Input />);
    expect(getInput(container)).not.toBeDisabled();
  });

  it("disabled input with value still shows value", () => {
    const { container } = render(
      <Input disabled value="jane@example.com" readOnly />
    );
    expect(getInput(container)).toHaveValue("jane@example.com");
    expect(getInput(container)).toBeDisabled();
  });

  it("disabled input does not fire onChange when typed into", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<Input disabled onChange={onChange} />);
    // userEvent won't type into a disabled input
    await user.type(getInput(container), "abc");
    expect(onChange).not.toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 4. Read-only state
// ---------------------------------------------------------------------------

describe("Input — readOnly state", () => {
  it("is readOnly when readOnly prop is set", () => {
    const { container } = render(<Input readOnly value="read-only value" />);
    expect(getInput(container)).toHaveAttribute("readonly");
  });

  it("readOnly input retains its value", () => {
    const { container } = render(
      <Input readOnly value="sk_live_••••••••4f3a" />
    );
    expect(getInput(container)).toHaveValue("sk_live_••••••••4f3a");
  });

  it("readOnly input is not disabled", () => {
    const { container } = render(<Input readOnly value="token" />);
    expect(getInput(container)).not.toBeDisabled();
  });
});

// ---------------------------------------------------------------------------
// 5. Error / invalid state (aria-invalid)
// ---------------------------------------------------------------------------

describe("Input — aria-invalid / error state", () => {
  it("sets aria-invalid attribute to true when passed", () => {
    const { container } = render(<Input aria-invalid={true} />);
    expect(getInput(container)).toHaveAttribute("aria-invalid", "true");
  });

  it("has aria-invalid:border-destructive class", () => {
    const { container } = render(<Input aria-invalid={true} />);
    expect(getInput(container).className).toContain("aria-invalid:border-destructive");
  });

  it("has aria-invalid:ring-3 class", () => {
    const { container } = render(<Input aria-invalid={true} />);
    expect(getInput(container).className).toContain("aria-invalid:ring-3");
  });

  it("has aria-invalid:ring-destructive/20 class", () => {
    const { container } = render(<Input aria-invalid={true} />);
    expect(getInput(container).className).toContain("aria-invalid:ring-destructive/20");
  });

  it("does not have aria-invalid attribute when not in error state", () => {
    const { container } = render(<Input />);
    expect(getInput(container)).not.toHaveAttribute("aria-invalid");
  });

  it("aria-invalid=false means no aria-invalid attribute (or explicitly false)", () => {
    const { container } = render(<Input aria-invalid={false} />);
    const val = getInput(container).getAttribute("aria-invalid");
    // Could be null or "false" depending on the primitive; neither is "true"
    expect(val).not.toBe("true");
  });

  it("supports aria-describedby alongside aria-invalid", () => {
    const { container } = render(
      <>
        <Input id="err-email" aria-invalid={true} aria-describedby="err-msg" />
        <p id="err-msg">Invalid email</p>
      </>
    );
    expect(getInput(container)).toHaveAttribute("aria-describedby", "err-msg");
  });

  it("error state class tokens are always present in the class string (CSS variant)", () => {
    // The classes use CSS attribute selectors (aria-invalid:*), they appear
    // in the className regardless of whether aria-invalid is set
    const { container } = render(<Input />);
    const cls = getInput(container).className;
    expect(cls).toContain("aria-invalid:border-destructive");
    expect(cls).toContain("aria-invalid:ring-destructive/20");
  });
});

// ---------------------------------------------------------------------------
// 6. Input types
// ---------------------------------------------------------------------------

describe("Input — input types", () => {
  const types = [
    "text",
    "email",
    "password",
    "search",
    "url",
    "tel",
    "number",
    "date",
    "time",
    "color",
    "file",
  ] as const;

  types.forEach((type) => {
    it(`renders type="${type}" correctly`, () => {
      const { container } = render(<Input type={type} />);
      expect(getInput(container)).toHaveAttribute("type", type);
    });
  });

  it("type='file' renders as file input", () => {
    const { container } = render(<Input type="file" accept=".pdf,.doc" />);
    const input = getInput(container);
    expect(input).toHaveAttribute("type", "file");
    expect(input).toHaveAttribute("accept", ".pdf,.doc");
  });

  it("type='number' accepts numeric placeholder", () => {
    const { container } = render(<Input type="number" placeholder="0" />);
    expect(getInput(container)).toHaveAttribute("placeholder", "0");
  });

  it("type='date' accepts defaultValue", () => {
    const { container } = render(
      <Input type="date" defaultValue="2026-01-15" />
    );
    expect(getInput(container)).toHaveValue("2026-01-15");
  });

  it("type='time' accepts defaultValue", () => {
    const { container } = render(
      <Input type="time" defaultValue="09:30" />
    );
    expect(getInput(container)).toHaveValue("09:30");
  });

  it("type='color' accepts defaultValue hex color", () => {
    const { container } = render(
      <Input type="color" defaultValue="#16a34a" />
    );
    expect(getInput(container)).toHaveValue("#16a34a");
  });
});

// ---------------------------------------------------------------------------
// 7. className forwarding
// ---------------------------------------------------------------------------

describe("Input — className forwarding", () => {
  it("forwards a custom className to the input element", () => {
    const { container } = render(<Input className="my-custom-class" />);
    expect(getInput(container).className).toContain("my-custom-class");
  });

  it("merges custom class with base classes", () => {
    const { container } = render(<Input className="pl-8" />);
    const cls = getInput(container).className;
    expect(cls).toContain("pl-8");
    expect(cls).toContain("h-8");
    expect(cls).toContain("rounded-lg");
  });

  it("forwards multiple custom classes", () => {
    const { container } = render(<Input className="foo bar baz" />);
    const cls = getInput(container).className;
    expect(cls).toContain("foo");
    expect(cls).toContain("bar");
    expect(cls).toContain("baz");
  });

  it("overrides can be passed via className (e.g. border-0 for adornment pattern)", () => {
    const { container } = render(
      <Input className="border-0 ring-0 focus-visible:border-0 focus-visible:ring-0 rounded-none h-full" />
    );
    const cls = getInput(container).className;
    expect(cls).toContain("border-0");
    expect(cls).toContain("ring-0");
    expect(cls).toContain("rounded-none");
  });

  it("sr-only className renders visually hidden file input", () => {
    const { container } = render(<Input type="file" className="sr-only" />);
    expect(getInput(container).className).toContain("sr-only");
  });

  it("className is undefined by default — base classes still present", () => {
    const { container } = render(<Input />);
    const cls = getInput(container).className;
    expect(cls).toContain("h-8");
    expect(cls).toContain("w-full");
  });
});

// ---------------------------------------------------------------------------
// 8. User interactions — typing / value changes
// ---------------------------------------------------------------------------

describe("Input — typing and value interactions", () => {
  it("accepts typed input in uncontrolled mode", async () => {
    const user = userEvent.setup();
    const { container } = render(<Input type="text" />);
    const input = getInput(container);
    await user.click(input);
    await user.type(input, "hello world");
    expect(input).toHaveValue("hello world");
  });

  it("fires onChange when user types", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container } = render(<Input type="text" onChange={onChange} />);
    const input = getInput(container);
    await user.type(input, "abc");
    expect(onChange).toHaveBeenCalled();
  });

  it("controlled value updates via state change", async () => {
    function Controlled() {
      const [val, setVal] = React.useState("");
      return <Input value={val} onChange={(e) => setVal(e.target.value)} />;
    }
    const user = userEvent.setup();
    render(<Controlled />);
    const input = screen.getByRole("textbox");
    await user.type(input, "typed");
    expect(input).toHaveValue("typed");
  });

  it("clears value when user clears the field", async () => {
    const user = userEvent.setup();
    const { container } = render(<Input defaultValue="initial" />);
    const input = getInput(container);
    await user.click(input);
    // Select all then delete
    await user.keyboard("{Control>}a{/Control}{Delete}");
    expect(input).toHaveValue("");
  });

  it("does not update value when readOnly", async () => {
    const user = userEvent.setup();
    const { container } = render(<Input readOnly value="locked" />);
    const input = getInput(container);
    await user.click(input);
    await user.type(input, "XYZ");
    expect(input).toHaveValue("locked");
  });

  it("email input accepts email-shaped input", async () => {
    const user = userEvent.setup();
    render(<Input type="email" aria-label="Email" />);
    const input = screen.getByRole("textbox", { name: /email/i });
    await user.type(input, "test@example.com");
    expect(input).toHaveValue("test@example.com");
  });

  it("search input accepts text input", async () => {
    const user = userEvent.setup();
    render(<Input type="search" aria-label="Search" />);
    const input = screen.getByRole("searchbox", { name: /search/i });
    await user.type(input, "my query");
    expect(input).toHaveValue("my query");
  });

  it("password input hides characters (type='password')", () => {
    const { container } = render(<Input type="password" />);
    expect(getInput(container)).toHaveAttribute("type", "password");
  });

  it("number input accepts numeric string value", async () => {
    const user = userEvent.setup();
    const { container } = render(<Input type="number" />);
    const input = getInput(container);
    await user.click(input);
    await user.type(input, "42");
    expect(input).toHaveValue(42);
  });
});

// ---------------------------------------------------------------------------
// 9. Ref forwarding
// ---------------------------------------------------------------------------

describe("Input — ref forwarding", () => {
  it("forwards a ref to the underlying <input> element", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("ref.current.value can be set imperatively", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} defaultValue="" />);
    if (ref.current) {
      ref.current.value = "imperative";
      expect(ref.current.value).toBe("imperative");
    }
  });
});

// ---------------------------------------------------------------------------
// 10. HTML attribute forwarding
// ---------------------------------------------------------------------------

describe("Input — HTML attribute forwarding", () => {
  it("forwards name attribute", () => {
    const { container } = render(<Input name="email" />);
    expect(getInput(container)).toHaveAttribute("name", "email");
  });

  it("forwards autoComplete attribute", () => {
    const { container } = render(<Input autoComplete="email" />);
    expect(getInput(container)).toHaveAttribute("autocomplete", "email");
  });

  it("forwards maxLength attribute", () => {
    const { container } = render(<Input maxLength={50} />);
    expect(getInput(container)).toHaveAttribute("maxlength", "50");
  });

  it("forwards minLength attribute", () => {
    const { container } = render(<Input minLength={3} />);
    expect(getInput(container)).toHaveAttribute("minlength", "3");
  });

  it("forwards required attribute", () => {
    const { container } = render(<Input required />);
    expect(getInput(container)).toBeRequired();
  });

  it("forwards pattern attribute", () => {
    const { container } = render(<Input pattern="[a-z]+" />);
    expect(getInput(container)).toHaveAttribute("pattern", "[a-z]+");
  });

  it("forwards tabIndex attribute", () => {
    const { container } = render(<Input tabIndex={3} />);
    expect(getInput(container)).toHaveAttribute("tabindex", "3");
  });

  it("forwards data-* attributes", () => {
    const { container } = render(<Input data-testid="my-input" />);
    expect(getInput(container)).toHaveAttribute("data-testid", "my-input");
  });

  it("forwards aria-label attribute", () => {
    const { container } = render(<Input aria-label="Search" />);
    expect(getInput(container)).toHaveAttribute("aria-label", "Search");
  });

  it("forwards accept attribute for file input", () => {
    const { container } = render(
      <Input type="file" accept=".pdf,.doc,.docx" />
    );
    expect(getInput(container)).toHaveAttribute("accept", ".pdf,.doc,.docx");
  });
});

// ---------------------------------------------------------------------------
// 11. Label association (accessible labeling)
// ---------------------------------------------------------------------------

describe("Input — label association", () => {
  it("is discoverable by role when associated with a label", () => {
    render(
      <>
        <label htmlFor="labeled">First name</label>
        <Input id="labeled" type="text" />
      </>
    );
    expect(screen.getByRole("textbox", { name: /first name/i })).toBeInTheDocument();
  });

  it("is discoverable by aria-label", () => {
    render(<Input aria-label="Email address" type="email" />);
    expect(
      screen.getByRole("textbox", { name: /email address/i })
    ).toBeInTheDocument();
  });

  it("is discoverable by aria-labelledby", () => {
    render(
      <>
        <span id="lbl">Website URL</span>
        <Input aria-labelledby="lbl" type="url" />
      </>
    );
    expect(
      screen.getByRole("textbox", { name: /website url/i })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 12. With-label example pattern
// ---------------------------------------------------------------------------

describe("Input — with-label example patterns", () => {
  it("renders a First name field with label", () => {
    render(
      <div>
        <label htmlFor="first-name">First name</label>
        <Input id="first-name" type="text" placeholder="Jane" />
      </div>
    );
    expect(screen.getByRole("textbox", { name: /first name/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Jane")).toBeInTheDocument();
  });

  it("renders an Email field with label", () => {
    render(
      <div>
        <label htmlFor="email-addr">Email</label>
        <Input id="email-addr" type="email" placeholder="jane@example.com" />
      </div>
    );
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("jane@example.com")).toBeInTheDocument();
  });

  it("renders a Website field with label", () => {
    render(
      <div>
        <label htmlFor="website">Website</label>
        <Input id="website" type="url" placeholder="https://example.com" />
      </div>
    );
    expect(screen.getByRole("textbox", { name: /website/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("https://example.com")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 13. Disabled example pattern (multiple fields)
// ---------------------------------------------------------------------------

describe("Input — disabled example patterns", () => {
  it("renders a disabled text field", () => {
    render(<Input id="disabled-text" type="text" placeholder="account_name" disabled />);
    expect(screen.getByPlaceholderText("account_name")).toBeDisabled();
  });

  it("renders a disabled email field with a pre-filled value", () => {
    render(
      <Input id="disabled-email" type="email" value="jane@example.com" disabled readOnly />
    );
    const input = screen.getByDisplayValue("jane@example.com");
    expect(input).toBeDisabled();
  });

  it("renders a readOnly API token field (not disabled)", () => {
    render(
      <Input
        id="readonly-token"
        type="text"
        value="sk_live_••••••••••••••••4f3a"
        readOnly
      />
    );
    const input = screen.getByDisplayValue("sk_live_••••••••••••••••4f3a");
    expect(input).not.toBeDisabled();
    expect(input).toHaveAttribute("readonly");
  });
});

// ---------------------------------------------------------------------------
// 14. Error example pattern
// ---------------------------------------------------------------------------

describe("Input — error example patterns", () => {
  it("marks email input as invalid with aria-invalid", () => {
    render(
      <Input
        id="err-email"
        type="email"
        value="not-an-email"
        aria-invalid={true}
        aria-describedby="err-email-msg"
        onChange={() => {}}
      />
    );
    const input = screen.getByDisplayValue("not-an-email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", "err-email-msg");
  });

  it("marks password input as invalid with aria-invalid", () => {
    render(
      <Input
        id="err-password"
        type="password"
        value="abc"
        aria-invalid={true}
        onChange={() => {}}
      />
    );
    const input = document.querySelector("#err-password") as HTMLInputElement;
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("username input without error has no aria-invalid", () => {
    render(<Input id="err-username" type="text" value="validuser" onChange={() => {}} />);
    const input = document.querySelector("#err-username") as HTMLInputElement;
    expect(input).not.toHaveAttribute("aria-invalid", "true");
  });
});

// ---------------------------------------------------------------------------
// 15. With-adornment pattern (prefix/suffix text wrappers)
// ---------------------------------------------------------------------------

describe("Input — with-adornment patterns", () => {
  it("renders domain input with https:// prefix adornment wrapper", () => {
    render(
      <div>
        <label htmlFor="adorn-domain">Domain</label>
        <div>
          <span>https://</span>
          <Input
            id="adorn-domain"
            type="text"
            placeholder="example.com"
            className="border-0 ring-0 focus-visible:border-0 focus-visible:ring-0 rounded-none h-full"
          />
        </div>
      </div>
    );
    expect(screen.getByRole("textbox", { name: /domain/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("example.com")).toBeInTheDocument();
  });

  it("renders price input with $ prefix and USD suffix", () => {
    render(
      <div>
        <label htmlFor="adorn-price">Price</label>
        <div>
          <span>$</span>
          <Input
            id="adorn-price"
            type="number"
            placeholder="0.00"
            className="border-0 ring-0 focus-visible:border-0 focus-visible:ring-0 rounded-none h-full"
          />
          <span>USD</span>
        </div>
      </div>
    );
    expect(screen.getByPlaceholderText("0.00")).toBeInTheDocument();
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("renders storage size input with GB suffix", () => {
    render(
      <div>
        <label htmlFor="adorn-size">Storage limit</label>
        <div>
          <Input
            id="adorn-size"
            type="number"
            placeholder="100"
            className="border-0 ring-0 focus-visible:border-0 focus-visible:ring-0 rounded-none h-full"
          />
          <span>GB</span>
        </div>
      </div>
    );
    expect(screen.getByPlaceholderText("100")).toBeInTheDocument();
    expect(screen.getByText("GB")).toBeInTheDocument();
  });

  it("adornment input accepts typed text", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <label htmlFor="adorn-domain2">Domain</label>
        <div>
          <span>https://</span>
          <Input
            id="adorn-domain2"
            type="text"
            placeholder="example.com"
            className="border-0 ring-0 rounded-none"
          />
        </div>
      </div>
    );
    const input = screen.getByRole("textbox", { name: /domain/i });
    await user.type(input, "mysite.com");
    expect(input).toHaveValue("mysite.com");
  });
});

// ---------------------------------------------------------------------------
// 16. With-icon pattern (icon decorators via absolute positioning)
// ---------------------------------------------------------------------------

describe("Input — with-icon patterns", () => {
  it("renders search input with icon wrapper", () => {
    render(
      <div className="relative">
        <span aria-hidden="true">🔍</span>
        <Input type="search" placeholder="Search…" className="pl-8" aria-label="Search" />
      </div>
    );
    expect(screen.getByRole("searchbox", { name: /search/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Search…")).toBeInTheDocument();
  });

  it("renders email input with icon and pl-8 padding class", () => {
    render(
      <div className="relative">
        <span aria-hidden="true">📧</span>
        <Input type="email" placeholder="Email address" className="pl-8" aria-label="Email" />
      </div>
    );
    const input = screen.getByRole("textbox", { name: /email/i });
    expect(input.className).toContain("pl-8");
  });

  it("renders username input with icon and pl-8 padding class", () => {
    render(
      <div className="relative">
        <span aria-hidden="true">👤</span>
        <Input type="text" placeholder="Username" className="pl-8" aria-label="Username" />
      </div>
    );
    expect(screen.getByRole("textbox", { name: /username/i })).toBeInTheDocument();
  });

  it("renders password input with lock icon and pl-8 padding class", () => {
    render(
      <div className="relative">
        <span aria-hidden="true">🔒</span>
        <Input type="password" placeholder="Password" className="pl-8" />
      </div>
    );
    const input = document.querySelector("input[type='password']") as HTMLInputElement;
    expect(input.className).toContain("pl-8");
  });
});

// ---------------------------------------------------------------------------
// 17. With-button patterns (search + invite + copy)
// ---------------------------------------------------------------------------

describe("Input — with-button patterns", () => {
  it("renders search input alongside a button", () => {
    render(
      <div>
        <Input type="search" placeholder="Search items…" className="flex-1" aria-label="Search" />
        <button type="submit">Go</button>
      </div>
    );
    expect(screen.getByRole("searchbox", { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /go/i })).toBeInTheDocument();
  });

  it("invite button is disabled when email field is empty", async () => {
    function Invite() {
      const [invite, setInvite] = React.useState("");
      return (
        <div>
          <Input
            type="email"
            placeholder="colleague@company.com"
            value={invite}
            onChange={(e) => setInvite(e.target.value)}
            aria-label="Colleague email"
          />
          <button type="button" disabled={!invite}>
            Invite
          </button>
        </div>
      );
    }
    render(<Invite />);
    expect(screen.getByRole("button", { name: /invite/i })).toBeDisabled();
  });

  it("invite button becomes enabled after typing email", async () => {
    const user = userEvent.setup();
    function Invite() {
      const [invite, setInvite] = React.useState("");
      return (
        <div>
          <Input
            type="email"
            placeholder="colleague@company.com"
            value={invite}
            onChange={(e) => setInvite(e.target.value)}
            aria-label="Colleague email"
          />
          <button type="button" disabled={!invite}>
            Invite
          </button>
        </div>
      );
    }
    render(<Invite />);
    const input = screen.getByRole("textbox", { name: /colleague email/i });
    await user.type(input, "colleague@company.com");
    expect(screen.getByRole("button", { name: /invite/i })).not.toBeDisabled();
  });

  it("renders read-only share URL alongside copy button", () => {
    render(
      <div>
        <Input
          type="text"
          value="https://example.com/share/abc123"
          readOnly
          className="flex-1 font-mono text-xs"
          aria-label="Share link"
        />
        <button type="button" aria-label="Copy link">
          Copy
        </button>
      </div>
    );
    expect(
      screen.getByDisplayValue("https://example.com/share/abc123")
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy link/i })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 18. File upload input patterns
// ---------------------------------------------------------------------------

describe("Input — file upload patterns", () => {
  it("renders a file input with accept attribute", () => {
    render(
      <Input id="file-native" type="file" accept=".pdf,.doc,.docx" aria-label="Attachment" />
    );
    const input = document.querySelector("input[type='file']") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute("accept", ".pdf,.doc,.docx");
  });

  it("renders a visually hidden file input with sr-only", () => {
    render(
      <label>
        Click to upload
        <Input id="file-custom" type="file" className="sr-only" />
      </label>
    );
    const input = document.querySelector("input[type='file']") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.className).toContain("sr-only");
  });

  it("file input fires onChange when a file is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Input type="file" onChange={onChange} aria-label="File upload" />);
    const input = document.querySelector("input[type='file']") as HTMLInputElement;
    const file = new File(["hello"], "hello.pdf", { type: "application/pdf" });
    await user.upload(input, file);
    expect(onChange).toHaveBeenCalled();
  });
});

// ---------------------------------------------------------------------------
// 19. Input-types example — all types from the example file
// ---------------------------------------------------------------------------

describe("Input — input-types example", () => {
  const typeFields = [
    { id: "t-text", label: "Text", type: "text", placeholder: "Plain text" },
    { id: "t-email", label: "Email", type: "email", placeholder: "you@example.com" },
    { id: "t-url", label: "URL", type: "url", placeholder: "https://example.com" },
    { id: "t-tel", label: "Tel", type: "tel", placeholder: "+1 555 000 0000" },
    { id: "t-number", label: "Number", type: "number", placeholder: "0" },
    { id: "t-date", label: "Date", type: "date", defaultValue: "2026-01-15" },
    { id: "t-time", label: "Time", type: "time", defaultValue: "09:30" },
    { id: "t-color", label: "Color", type: "color", defaultValue: "#16a34a" },
  ] as const;

  typeFields.forEach(({ id, label, type, placeholder, defaultValue }) => {
    it(`type="${type}" renders and has correct type attribute`, () => {
      render(
        <div>
          <label htmlFor={id}>{label}</label>
          <Input
            id={id}
            type={type as string}
            placeholder={placeholder as string | undefined}
            defaultValue={defaultValue as string | undefined}
          />
        </div>
      );
      const input = document.querySelector(`#${id}`) as HTMLInputElement;
      expect(input).toHaveAttribute("type", type);
    });
  });
});

// ---------------------------------------------------------------------------
// 20. Default example pattern (controlled multiple inputs)
// ---------------------------------------------------------------------------

describe("Input — default example patterns", () => {
  it("renders four default inputs (text/email/password/search)", () => {
    render(
      <div>
        <Input type="text" placeholder="Full name" aria-label="Full name" />
        <Input type="email" placeholder="Email address" aria-label="Email address" />
        <Input type="password" placeholder="Password" />
        <Input type="search" placeholder="Search…" aria-label="Search" />
      </div>
    );
    expect(screen.getByRole("textbox", { name: /full name/i })).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email address/i })).toBeInTheDocument();
    expect(screen.getByRole("searchbox", { name: /search/i })).toBeInTheDocument();
    const password = document.querySelector("input[type='password']");
    expect(password).toBeInTheDocument();
  });

  it("controlled text input updates via state", async () => {
    function Wrapper() {
      const [value, setValue] = React.useState("");
      return (
        <Input
          type="text"
          placeholder="Full name"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          aria-label="Full name"
        />
      );
    }
    const user = userEvent.setup();
    render(<Wrapper />);
    const input = screen.getByRole("textbox", { name: /full name/i });
    await user.type(input, "Jane Doe");
    expect(input).toHaveValue("Jane Doe");
  });
});

// ---------------------------------------------------------------------------
// 21. Focus behavior
// ---------------------------------------------------------------------------

describe("Input — focus behavior", () => {
  it("can be focused programmatically", () => {
    const { container } = render(<Input aria-label="Focus test" />);
    const input = getInput(container);
    input.focus();
    expect(document.activeElement).toBe(input);
  });

  it("receives focus via userEvent click", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Focus test" />);
    const input = screen.getByRole("textbox");
    await user.click(input);
    expect(document.activeElement).toBe(input);
  });

  it("can be blurred after focusing", async () => {
    const user = userEvent.setup();
    render(<Input aria-label="Blur test" />);
    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.tab();
    expect(document.activeElement).not.toBe(input);
  });

  it("fires onFocus when focused", async () => {
    const user = userEvent.setup();
    const onFocus = vi.fn();
    render(<Input aria-label="onFocus test" onFocus={onFocus} />);
    const input = screen.getByRole("textbox");
    await user.click(input);
    expect(onFocus).toHaveBeenCalled();
  });

  it("fires onBlur when blurred", async () => {
    const user = userEvent.setup();
    const onBlur = vi.fn();
    render(<Input aria-label="onBlur test" onBlur={onBlur} />);
    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.tab();
    expect(onBlur).toHaveBeenCalled();
  });

  it("disabled input cannot be focused via userEvent", async () => {
    const user = userEvent.setup();
    render(<Input disabled aria-label="Disabled focus test" />);
    const input = screen.getByRole("textbox");
    await user.click(input);
    expect(document.activeElement).not.toBe(input);
  });
});

// ---------------------------------------------------------------------------
// 22. Keyboard interaction
// ---------------------------------------------------------------------------

describe("Input — keyboard interaction", () => {
  it("fires onKeyDown when a key is pressed", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    render(<Input aria-label="Key test" onKeyDown={onKeyDown} />);
    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.keyboard("{Enter}");
    expect(onKeyDown).toHaveBeenCalled();
  });

  it("fires onKeyUp when a key is released", async () => {
    const user = userEvent.setup();
    const onKeyUp = vi.fn();
    render(<Input aria-label="KeyUp test" onKeyUp={onKeyUp} />);
    const input = screen.getByRole("textbox");
    await user.click(input);
    await user.keyboard("{Enter}");
    expect(onKeyUp).toHaveBeenCalled();
  });

  it("Tab key moves focus away from the input", async () => {
    const user = userEvent.setup();
    render(
      <div>
        <Input aria-label="First" />
        <Input aria-label="Second" />
      </div>
    );
    const first = screen.getByRole("textbox", { name: /first/i });
    const second = screen.getByRole("textbox", { name: /second/i });
    await user.click(first);
    expect(document.activeElement).toBe(first);
    await user.tab();
    expect(document.activeElement).toBe(second);
  });
});

// ---------------------------------------------------------------------------
// 23. Re-render behavior
// ---------------------------------------------------------------------------

describe("Input — re-render behavior", () => {
  it("updates placeholder when prop changes", () => {
    const { rerender, container } = render(<Input placeholder="old" />);
    expect(getInput(container)).toHaveAttribute("placeholder", "old");
    rerender(<Input placeholder="new" />);
    expect(getInput(container)).toHaveAttribute("placeholder", "new");
  });

  it("updates type when prop changes", () => {
    const { rerender, container } = render(<Input type="text" />);
    expect(getInput(container)).toHaveAttribute("type", "text");
    rerender(<Input type="email" />);
    expect(getInput(container)).toHaveAttribute("type", "email");
  });

  it("transitions from enabled to disabled", () => {
    const { rerender, container } = render(<Input />);
    expect(getInput(container)).not.toBeDisabled();
    rerender(<Input disabled />);
    expect(getInput(container)).toBeDisabled();
  });

  it("transitions from valid to invalid (aria-invalid)", () => {
    const { rerender, container } = render(<Input />);
    expect(getInput(container)).not.toHaveAttribute("aria-invalid", "true");
    rerender(<Input aria-invalid={true} />);
    expect(getInput(container)).toHaveAttribute("aria-invalid", "true");
  });

  it("updates className when prop changes", () => {
    const { rerender, container } = render(<Input className="class-a" />);
    expect(getInput(container).className).toContain("class-a");
    rerender(<Input className="class-b" />);
    expect(getInput(container).className).toContain("class-b");
    expect(getInput(container).className).not.toContain("class-a");
  });
});

// ---------------------------------------------------------------------------
// 24. Accessibility (axe)
// ---------------------------------------------------------------------------

describe("Input — accessibility (axe)", () => {
  it("default input with aria-label has no violations", async () => {
    const { container } = render(<Input aria-label="Full name" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("input with explicit label element has no violations", async () => {
    const { container } = render(
      <div>
        <label htmlFor="ax-text">First name</label>
        <Input id="ax-text" type="text" placeholder="Jane" />
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("disabled input with label has no violations", async () => {
    const { container } = render(
      <div>
        <label htmlFor="ax-disabled">Username</label>
        <Input id="ax-disabled" type="text" placeholder="account_name" disabled />
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("readOnly input with label has no violations", async () => {
    const { container } = render(
      <div>
        <label htmlFor="ax-readonly">API token</label>
        <Input id="ax-readonly" type="text" value="sk_live_••••4f3a" readOnly />
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("invalid input with aria-invalid and aria-describedby has no violations", async () => {
    const { container } = render(
      <div>
        <label htmlFor="ax-invalid">Email</label>
        <Input
          id="ax-invalid"
          type="email"
          value="not-an-email"
          aria-invalid={true}
          aria-describedby="ax-invalid-msg"
          onChange={() => {}}
        />
        <p id="ax-invalid-msg" role="alert">
          Please enter a valid email address.
        </p>
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("required input with label has no violations", async () => {
    const { container } = render(
      <div>
        <label htmlFor="ax-required">Password</label>
        <Input id="ax-required" type="password" required />
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("file input with label has no violations", async () => {
    const { container } = render(
      <div>
        <label htmlFor="ax-file">Attachment</label>
        <Input id="ax-file" type="file" accept=".pdf" />
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("search input with aria-label has no violations", async () => {
    const { container } = render(<Input type="search" aria-label="Search items" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("number input with label has no violations", async () => {
    const { container } = render(
      <div>
        <label htmlFor="ax-number">Storage limit</label>
        <Input id="ax-number" type="number" placeholder="100" />
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("input with aria-labelledby has no violations", async () => {
    const { container } = render(
      <div>
        <span id="ax-lbl">Website</span>
        <Input aria-labelledby="ax-lbl" type="url" />
      </div>
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
