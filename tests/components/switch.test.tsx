import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import { Switch } from "@/components/ui/switch";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Base UI Switch renders a <span role="switch"> (not a native checkbox).
 * `aria-checked` reflects the toggle state.
 */
function getSwitch(): HTMLElement {
  return screen.getByRole("switch");
}

// ─── Smoke ────────────────────────────────────────────────────────────────────

describe("Switch – smoke", () => {
  it("renders without crashing", () => {
    render(<Switch aria-label="Toggle" />);
    expect(getSwitch()).toBeInTheDocument();
  });

  it("has role='switch'", () => {
    render(<Switch aria-label="Toggle" />);
    expect(getSwitch()).toBeInTheDocument();
  });

  it("carries data-slot='switch'", () => {
    render(<Switch aria-label="Toggle" />);
    expect(getSwitch()).toHaveAttribute("data-slot", "switch");
  });

  it("contains a thumb child with data-slot='switch-thumb'", () => {
    render(<Switch aria-label="Toggle" />);
    const thumb = getSwitch().querySelector("[data-slot='switch-thumb']");
    expect(thumb).toBeInTheDocument();
  });

  it("is unchecked by default (aria-checked=false)", () => {
    render(<Switch aria-label="Toggle" />);
    expect(getSwitch()).toHaveAttribute("aria-checked", "false");
  });

  it("renders without aria-label via accessible label context", () => {
    render(
      <label>
        Enable notifications
        <Switch />
      </label>
    );
    // findByRole is fine here since no interaction needed
    expect(screen.getByRole("switch")).toBeInTheDocument();
  });
});

// ─── Default props ────────────────────────────────────────────────────────────

describe("Switch – default props", () => {
  it("defaults to size='default' → has data-size='default'", () => {
    render(<Switch aria-label="Toggle" />);
    expect(getSwitch()).toHaveAttribute("data-size", "default");
  });

  it("default size → has h-[18.4px] dimension class fragment", () => {
    render(<Switch aria-label="Toggle" />);
    expect(getSwitch().className).toContain("data-[size=default]:h-[18.4px]");
  });

  it("default size → has w-[32px] width class fragment", () => {
    render(<Switch aria-label="Toggle" />);
    expect(getSwitch().className).toContain("data-[size=default]:w-[32px]");
  });

  it("has base class 'rounded-full'", () => {
    render(<Switch aria-label="Toggle" />);
    expect(getSwitch().className).toContain("rounded-full");
  });

  it("has base class 'inline-flex'", () => {
    render(<Switch aria-label="Toggle" />);
    expect(getSwitch().className).toContain("inline-flex");
  });

  it("has base class 'transition-all'", () => {
    render(<Switch aria-label="Toggle" />);
    expect(getSwitch().className).toContain("transition-all");
  });

  it("has base class 'shrink-0'", () => {
    render(<Switch aria-label="Toggle" />);
    expect(getSwitch().className).toContain("shrink-0");
  });

  it("has base class 'items-center'", () => {
    render(<Switch aria-label="Toggle" />);
    expect(getSwitch().className).toContain("items-center");
  });

  it("has data-unchecked attribute when unchecked", () => {
    render(<Switch aria-label="Toggle" />);
    expect(getSwitch()).toHaveAttribute("data-unchecked");
  });

  it("does NOT have data-checked attribute when unchecked", () => {
    render(<Switch aria-label="Toggle" />);
    expect(getSwitch()).not.toHaveAttribute("data-checked");
  });
});

// ─── Size prop ────────────────────────────────────────────────────────────────

describe("Switch – size prop", () => {
  it("size='default' → data-size='default'", () => {
    render(<Switch aria-label="Toggle" size="default" />);
    expect(getSwitch()).toHaveAttribute("data-size", "default");
  });

  it("size='default' → class contains data-[size=default]:h-[18.4px]", () => {
    render(<Switch aria-label="Toggle" size="default" />);
    expect(getSwitch().className).toContain("data-[size=default]:h-[18.4px]");
  });

  it("size='default' → class contains data-[size=default]:w-[32px]", () => {
    render(<Switch aria-label="Toggle" size="default" />);
    expect(getSwitch().className).toContain("data-[size=default]:w-[32px]");
  });

  it("size='sm' → data-size='sm'", () => {
    render(<Switch aria-label="Toggle" size="sm" />);
    expect(getSwitch()).toHaveAttribute("data-size", "sm");
  });

  it("size='sm' → class contains data-[size=sm]:h-[14px]", () => {
    render(<Switch aria-label="Toggle" size="sm" />);
    expect(getSwitch().className).toContain("data-[size=sm]:h-[14px]");
  });

  it("size='sm' → class contains data-[size=sm]:w-[24px]", () => {
    render(<Switch aria-label="Toggle" size="sm" />);
    expect(getSwitch().className).toContain("data-[size=sm]:w-[24px]");
  });

  it("sm thumb has group-data-[size=sm]/switch:size-3 class", () => {
    render(<Switch aria-label="Toggle" size="sm" />);
    const thumb = getSwitch().querySelector("[data-slot='switch-thumb']")!;
    expect(thumb.className).toContain("group-data-[size=sm]/switch:size-3");
  });

  it("default thumb has group-data-[size=default]/switch:size-4 class", () => {
    render(<Switch aria-label="Toggle" size="default" />);
    const thumb = getSwitch().querySelector("[data-slot='switch-thumb']")!;
    expect(thumb.className).toContain("group-data-[size=default]/switch:size-4");
  });

  it("two sizes produce different data-size values", () => {
    const { container: c1 } = render(<Switch aria-label="Default" size="default" />);
    const { container: c2 } = render(<Switch aria-label="Small" size="sm" />);
    const s1 = c1.querySelector("[data-slot='switch']")!.getAttribute("data-size");
    const s2 = c2.querySelector("[data-slot='switch']")!.getAttribute("data-size");
    expect(s1).not.toBe(s2);
  });
});

// ─── Checked / unchecked state ───────────────────────────────────────────────

describe("Switch – checked state", () => {
  it("defaultChecked → aria-checked='true'", () => {
    render(<Switch aria-label="Toggle" defaultChecked />);
    expect(getSwitch()).toHaveAttribute("aria-checked", "true");
  });

  it("defaultChecked → has data-checked attribute", () => {
    render(<Switch aria-label="Toggle" defaultChecked />);
    expect(getSwitch()).toHaveAttribute("data-checked");
  });

  it("defaultChecked → does NOT have data-unchecked attribute", () => {
    render(<Switch aria-label="Toggle" defaultChecked />);
    expect(getSwitch()).not.toHaveAttribute("data-unchecked");
  });

  it("controlled checked=true → aria-checked='true'", () => {
    render(
      <Switch aria-label="Toggle" checked={true} onCheckedChange={() => {}} />
    );
    expect(getSwitch()).toHaveAttribute("aria-checked", "true");
  });

  it("controlled checked=false → aria-checked='false'", () => {
    render(
      <Switch aria-label="Toggle" checked={false} onCheckedChange={() => {}} />
    );
    expect(getSwitch()).toHaveAttribute("aria-checked", "false");
  });

  it("thumb has translate class when checked", () => {
    render(<Switch aria-label="Toggle" defaultChecked />);
    const thumb = getSwitch().querySelector("[data-slot='switch-thumb']")!;
    // The thumb class string must contain one of the translate classes
    expect(thumb.className).toContain("data-checked:translate-x-");
  });

  it("thumb has no positive translate when unchecked (translate-x-0 class)", () => {
    render(<Switch aria-label="Toggle" />);
    const thumb = getSwitch().querySelector("[data-slot='switch-thumb']")!;
    expect(thumb.className).toContain("data-unchecked:translate-x-0");
  });
});

// ─── Disabled state ───────────────────────────────────────────────────────────

describe("Switch – disabled state", () => {
  it("disabled → has data-disabled attribute", () => {
    render(<Switch aria-label="Toggle" disabled />);
    expect(getSwitch()).toHaveAttribute("data-disabled");
  });

  it("disabled → has opacity-50 class fragment", () => {
    render(<Switch aria-label="Toggle" disabled />);
    expect(getSwitch().className).toContain("data-disabled:opacity-50");
  });

  it("disabled → has cursor-not-allowed class fragment", () => {
    render(<Switch aria-label="Toggle" disabled />);
    expect(getSwitch().className).toContain("data-disabled:cursor-not-allowed");
  });

  it("disabled+unchecked → still has data-unchecked attribute", () => {
    render(<Switch aria-label="Toggle" disabled />);
    expect(getSwitch()).toHaveAttribute("data-unchecked");
  });

  it("disabled+defaultChecked → has data-disabled AND data-checked", () => {
    render(<Switch aria-label="Toggle" disabled defaultChecked />);
    expect(getSwitch()).toHaveAttribute("data-disabled");
    expect(getSwitch()).toHaveAttribute("data-checked");
  });

  it("disabled+sm → has data-disabled attribute", () => {
    render(<Switch aria-label="Toggle" disabled size="sm" />);
    expect(getSwitch()).toHaveAttribute("data-disabled");
  });

  it("disabled switch does NOT call onCheckedChange when clicked", async () => {
    const handler = vi.fn();
    render(
      <Switch aria-label="Toggle" disabled onCheckedChange={handler} />
    );
    const user = userEvent.setup();
    await user.click(getSwitch());
    expect(handler).not.toHaveBeenCalled();
  });

  it("disabled switch does NOT toggle aria-checked when clicked", async () => {
    render(<Switch aria-label="Toggle" disabled />);
    const user = userEvent.setup();
    await user.click(getSwitch());
    expect(getSwitch()).toHaveAttribute("aria-checked", "false");
  });
});

// ─── aria-invalid state ───────────────────────────────────────────────────────

describe("Switch – aria-invalid state", () => {
  it("aria-invalid={true} → sets aria-invalid attribute on the switch", () => {
    render(
      <Switch aria-label="Accept terms" aria-invalid={true} />
    );
    expect(getSwitch()).toHaveAttribute("aria-invalid", "true");
  });

  it("aria-invalid={true} → has aria-invalid:border-destructive class", () => {
    render(<Switch aria-label="Accept terms" aria-invalid={true} />);
    expect(getSwitch().className).toContain("aria-invalid:border-destructive");
  });

  it("aria-invalid={true} → has aria-invalid:ring-3 class", () => {
    render(<Switch aria-label="Accept terms" aria-invalid={true} />);
    expect(getSwitch().className).toContain("aria-invalid:ring-3");
  });

  it("aria-invalid={true} → has aria-invalid:ring-destructive/20 class", () => {
    render(<Switch aria-label="Accept terms" aria-invalid={true} />);
    expect(getSwitch().className).toContain("aria-invalid:ring-destructive/20");
  });

  it("aria-invalid without value → no aria-invalid attribute by default", () => {
    render(<Switch aria-label="Normal" />);
    expect(getSwitch()).not.toHaveAttribute("aria-invalid");
  });

  it("aria-invalid={true} with disabled → both data-disabled and aria-invalid present", () => {
    render(
      <Switch aria-label="Accept terms" aria-invalid={true} disabled />
    );
    expect(getSwitch()).toHaveAttribute("aria-invalid", "true");
    expect(getSwitch()).toHaveAttribute("data-disabled");
  });
});

// ─── Interactions ─────────────────────────────────────────────────────────────

describe("Switch – interactions (click toggle)", () => {
  it("clicking an uncontrolled switch toggles aria-checked from false to true", async () => {
    render(<Switch aria-label="Toggle" />);
    const user = userEvent.setup();
    expect(getSwitch()).toHaveAttribute("aria-checked", "false");
    await user.click(getSwitch());
    expect(getSwitch()).toHaveAttribute("aria-checked", "true");
  });

  it("clicking a checked uncontrolled switch toggles aria-checked back to false", async () => {
    render(<Switch aria-label="Toggle" defaultChecked />);
    const user = userEvent.setup();
    await user.click(getSwitch());
    expect(getSwitch()).toHaveAttribute("aria-checked", "false");
  });

  it("toggling calls onCheckedChange with true as first argument", async () => {
    const handler = vi.fn();
    render(<Switch aria-label="Toggle" onCheckedChange={handler} />);
    const user = userEvent.setup();
    await user.click(getSwitch());
    expect(handler).toHaveBeenCalledTimes(1);
    // Base UI passes (value, eventObject) — check the first arg
    expect(handler.mock.calls[0][0]).toBe(true);
  });

  it("toggling again calls onCheckedChange with false as first argument", async () => {
    const handler = vi.fn();
    render(<Switch aria-label="Toggle" defaultChecked onCheckedChange={handler} />);
    const user = userEvent.setup();
    await user.click(getSwitch());
    expect(handler.mock.calls[0][0]).toBe(false);
  });

  it("multiple toggles produce alternating true/false as first argument", async () => {
    const handler = vi.fn();
    render(<Switch aria-label="Toggle" onCheckedChange={handler} />);
    const user = userEvent.setup();
    await user.click(getSwitch()); // → true
    await user.click(getSwitch()); // → false
    await user.click(getSwitch()); // → true
    expect(handler.mock.calls[0][0]).toBe(true);
    expect(handler.mock.calls[1][0]).toBe(false);
    expect(handler.mock.calls[2][0]).toBe(true);
  });

  it("controlled switch updates when parent state changes", async () => {
    function Wrapper() {
      const [checked, setChecked] = React.useState(false);
      return (
        <>
          <Switch
            aria-label="Toggle"
            checked={checked}
            onCheckedChange={setChecked}
          />
          <button onClick={() => setChecked(true)}>Turn on</button>
        </>
      );
    }
    render(<Wrapper />);
    const user = userEvent.setup();
    expect(getSwitch()).toHaveAttribute("aria-checked", "false");
    await user.click(screen.getByRole("button", { name: "Turn on" }));
    expect(getSwitch()).toHaveAttribute("aria-checked", "true");
  });

  it("keyboard: Space key toggles the switch", async () => {
    render(<Switch aria-label="Toggle" />);
    const user = userEvent.setup();
    getSwitch().focus();
    await user.keyboard(" ");
    expect(getSwitch()).toHaveAttribute("aria-checked", "true");
  });

  it("keyboard: Enter key also toggles the switch (Base UI behavior)", async () => {
    // Base UI's Switch responds to both Space and Enter for toggle
    render(<Switch aria-label="Toggle" />);
    const user = userEvent.setup();
    getSwitch().focus();
    await user.keyboard("{Enter}");
    expect(getSwitch()).toHaveAttribute("aria-checked", "true");
  });

  it("can be focused via Tab", async () => {
    render(<Switch aria-label="Toggle" />);
    const user = userEvent.setup();
    await user.tab();
    expect(getSwitch()).toHaveFocus();
  });

  it("disabled switch is NOT focusable via Tab", async () => {
    render(
      <div>
        <Switch aria-label="Toggle" disabled />
        <input data-testid="other" />
      </div>
    );
    const user = userEvent.setup();
    await user.tab();
    expect(screen.getByTestId("other")).toHaveFocus();
  });
});

// ─── className prop ────────────────────────────────────────────────────────────

describe("Switch – className prop", () => {
  it("merges a custom className onto the switch", () => {
    render(<Switch aria-label="Toggle" className="my-custom" />);
    expect(getSwitch().className).toContain("my-custom");
  });

  it("custom className does not remove the base inline-flex class", () => {
    render(<Switch aria-label="Toggle" className="extra" />);
    expect(getSwitch().className).toContain("inline-flex");
  });

  it("custom className does not remove rounded-full class", () => {
    render(<Switch aria-label="Toggle" className="extra" />);
    expect(getSwitch().className).toContain("rounded-full");
  });

  it("multiple custom classes are all applied", () => {
    render(<Switch aria-label="Toggle" className="foo bar baz" />);
    const cls = getSwitch().className;
    expect(cls).toContain("foo");
    expect(cls).toContain("bar");
    expect(cls).toContain("baz");
  });
});

// ─── HTML attribute forwarding ────────────────────────────────────────────────

describe("Switch – HTML attribute forwarding", () => {
  it("forwards aria-label", () => {
    render(<Switch aria-label="Enable notifications" />);
    expect(screen.getByRole("switch", { name: "Enable notifications" })).toBeInTheDocument();
  });

  it("forwards id to the hidden input (Base UI uses its own id on the span)", () => {
    render(<Switch aria-label="Toggle" id="sw-id" />);
    // Base UI generates its own id on the switch span for internal labelling;
    // the passed id is forwarded to the hidden <input> element
    const input = document.querySelector("input[id='sw-id']");
    expect(input).toBeInTheDocument();
  });

  it("forwards data-testid attribute", () => {
    render(<Switch aria-label="Toggle" data-testid="my-switch" />);
    expect(screen.getByTestId("my-switch")).toBeInTheDocument();
  });

  it("forwards name attribute via hidden input", () => {
    render(<Switch aria-label="Toggle" name="notifications" />);
    // Base UI renders a hidden <input> with the name
    const input = document.querySelector("input[name='notifications']");
    expect(input).toBeInTheDocument();
  });

  it("forwards required attribute via hidden input", () => {
    render(<Switch aria-label="Toggle" required />);
    const input = document.querySelector("input") as HTMLInputElement;
    expect(input?.required).toBe(true);
  });

  it("forwards readOnly → has data-readonly attribute", () => {
    render(<Switch aria-label="Toggle" readOnly />);
    expect(getSwitch()).toHaveAttribute("data-readonly");
  });

  it("forwards required → has data-required attribute", () => {
    render(<Switch aria-label="Toggle" required />);
    expect(getSwitch()).toHaveAttribute("data-required");
  });

  it("forwards aria-describedby attribute", () => {
    render(
      <>
        <span id="hint">Toggle to enable</span>
        <Switch aria-label="Toggle" aria-describedby="hint" />
      </>
    );
    expect(getSwitch()).toHaveAttribute("aria-describedby", "hint");
  });
});

// ─── Re-render behavior ───────────────────────────────────────────────────────

describe("Switch – re-render behavior", () => {
  it("updates from checked=false to checked=true on re-render", () => {
    const { rerender } = render(
      <Switch aria-label="Toggle" checked={false} onCheckedChange={() => {}} />
    );
    expect(getSwitch()).toHaveAttribute("aria-checked", "false");
    rerender(
      <Switch aria-label="Toggle" checked={true} onCheckedChange={() => {}} />
    );
    expect(getSwitch()).toHaveAttribute("aria-checked", "true");
  });

  it("updates from enabled to disabled on re-render", () => {
    const { rerender } = render(<Switch aria-label="Toggle" />);
    expect(getSwitch()).not.toHaveAttribute("data-disabled");
    rerender(<Switch aria-label="Toggle" disabled />);
    expect(getSwitch()).toHaveAttribute("data-disabled");
  });

  it("updates size from default to sm on re-render", () => {
    const { rerender } = render(<Switch aria-label="Toggle" size="default" />);
    expect(getSwitch()).toHaveAttribute("data-size", "default");
    rerender(<Switch aria-label="Toggle" size="sm" />);
    expect(getSwitch()).toHaveAttribute("data-size", "sm");
  });

  it("onCheckedChange handler updates work after re-render", async () => {
    const handler = vi.fn();
    const { rerender } = render(
      <Switch aria-label="Toggle" onCheckedChange={handler} />
    );
    const user = userEvent.setup();
    await user.click(getSwitch());
    rerender(<Switch aria-label="Toggle" onCheckedChange={handler} />);
    await user.click(getSwitch());
    expect(handler).toHaveBeenCalledTimes(2);
  });
});

// ─── Multiple instances ───────────────────────────────────────────────────────

describe("Switch – multiple instances", () => {
  it("renders multiple switches without interference", () => {
    render(
      <div>
        <Switch aria-label="First" />
        <Switch aria-label="Second" />
        <Switch aria-label="Third" />
      </div>
    );
    expect(screen.getByRole("switch", { name: "First" })).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Second" })).toBeInTheDocument();
    expect(screen.getByRole("switch", { name: "Third" })).toBeInTheDocument();
  });

  it("toggling one switch does not affect another", async () => {
    render(
      <div>
        <Switch aria-label="First" />
        <Switch aria-label="Second" />
      </div>
    );
    const user = userEvent.setup();
    const [first, second] = screen.getAllByRole("switch");
    await user.click(first);
    expect(first).toHaveAttribute("aria-checked", "true");
    expect(second).toHaveAttribute("aria-checked", "false");
  });

  it("each switch tracks its own state independently", async () => {
    render(
      <div>
        <Switch aria-label="A" />
        <Switch aria-label="B" defaultChecked />
      </div>
    );
    const user = userEvent.setup();
    const a = screen.getByRole("switch", { name: "A" });
    const b = screen.getByRole("switch", { name: "B" });
    await user.click(a); // A on
    await user.click(b); // B off
    expect(a).toHaveAttribute("aria-checked", "true");
    expect(b).toHaveAttribute("aria-checked", "false");
  });
});

// ─── Common usage patterns from examples ─────────────────────────────────────

describe("Switch – usage patterns from examples", () => {
  it("works in a notification settings row pattern", async () => {
    function NotificationRow() {
      const [enabled, setEnabled] = React.useState(false);
      return (
        <div>
          <Switch
            aria-label="Notifications"
            checked={enabled}
            onCheckedChange={setEnabled}
          />
          <span>{enabled ? "on" : "off"}</span>
        </div>
      );
    }
    render(<NotificationRow />);
    const user = userEvent.setup();
    expect(screen.getByText("off")).toBeInTheDocument();
    await user.click(getSwitch());
    expect(screen.getByText("on")).toBeInTheDocument();
  });

  it("works as an invalid switch that shows error message on submit", async () => {
    function TermsForm() {
      const [agreed, setAgreed] = React.useState(false);
      const [submitted, setSubmitted] = React.useState(false);
      const isInvalid = submitted && !agreed;
      return (
        <div>
          <Switch
            aria-label="Accept terms"
            checked={agreed}
            onCheckedChange={(v) => {
              setAgreed(v);
              if (v) setSubmitted(false);
            }}
            aria-invalid={isInvalid}
          />
          <button onClick={() => setSubmitted(true)}>Submit</button>
          {isInvalid && <span role="alert">You must accept the terms.</span>}
        </div>
      );
    }
    render(<TermsForm />);
    const user = userEvent.setup();
    // Submit without agreeing → invalid
    await user.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(getSwitch()).toHaveAttribute("aria-invalid", "true");
    // Agree → clears invalid
    await user.click(getSwitch());
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(getSwitch()).not.toHaveAttribute("aria-invalid", "true");
  });

  it("works with a wrapping <label> for accessible labeling", async () => {
    render(
      <label htmlFor="dark-mode">
        Dark mode
        <Switch id="dark-mode" />
      </label>
    );
    // Switch accessible via its label text
    const sw = screen.getByRole("switch");
    expect(sw).toBeInTheDocument();
  });

  it("works in a list of settings controlled by parent state", async () => {
    function SettingsList() {
      const [states, setStates] = React.useState({
        darkMode: false,
        autoSave: true,
        analytics: false,
      });
      return (
        <div>
          {Object.entries(states).map(([key, val]) => (
            <Switch
              key={key}
              aria-label={key}
              checked={val}
              onCheckedChange={(v) =>
                setStates((prev) => ({ ...prev, [key]: v }))
              }
            />
          ))}
        </div>
      );
    }
    render(<SettingsList />);
    const user = userEvent.setup();
    const darkMode = screen.getByRole("switch", { name: "darkMode" });
    const autoSave = screen.getByRole("switch", { name: "autoSave" });
    expect(darkMode).toHaveAttribute("aria-checked", "false");
    expect(autoSave).toHaveAttribute("aria-checked", "true");
    await user.click(darkMode);
    expect(darkMode).toHaveAttribute("aria-checked", "true");
    // autoSave unchanged
    expect(autoSave).toHaveAttribute("aria-checked", "true");
  });
});

// ─── Thumb child element ───────────────────────────────────────────────────────

describe("Switch – thumb element", () => {
  it("thumb exists and has data-slot='switch-thumb'", () => {
    render(<Switch aria-label="Toggle" />);
    expect(
      getSwitch().querySelector("[data-slot='switch-thumb']")
    ).toBeInTheDocument();
  });

  it("thumb has pointer-events-none class", () => {
    render(<Switch aria-label="Toggle" />);
    const thumb = getSwitch().querySelector("[data-slot='switch-thumb']")!;
    expect(thumb.className).toContain("pointer-events-none");
  });

  it("thumb has rounded-full class", () => {
    render(<Switch aria-label="Toggle" />);
    const thumb = getSwitch().querySelector("[data-slot='switch-thumb']")!;
    expect(thumb.className).toContain("rounded-full");
  });

  it("thumb has transition-transform class", () => {
    render(<Switch aria-label="Toggle" />);
    const thumb = getSwitch().querySelector("[data-slot='switch-thumb']")!;
    expect(thumb.className).toContain("transition-transform");
  });

  it("thumb has bg-background class", () => {
    render(<Switch aria-label="Toggle" />);
    const thumb = getSwitch().querySelector("[data-slot='switch-thumb']")!;
    expect(thumb.className).toContain("bg-background");
  });

  it("thumb has data-checked attribute when switch is checked", async () => {
    render(<Switch aria-label="Toggle" defaultChecked />);
    const thumb = getSwitch().querySelector("[data-slot='switch-thumb']")!;
    expect(thumb).toHaveAttribute("data-checked");
  });

  it("thumb has data-unchecked attribute when switch is unchecked", () => {
    render(<Switch aria-label="Toggle" />);
    const thumb = getSwitch().querySelector("[data-slot='switch-thumb']")!;
    expect(thumb).toHaveAttribute("data-unchecked");
  });
});

// ─── Accessibility (axe) ──────────────────────────────────────────────────────

describe("Switch – accessibility (axe)", () => {
  it("default switch with aria-label has no axe violations", async () => {
    const { container } = render(<Switch aria-label="Enable notifications" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("checked switch has no axe violations", async () => {
    const { container } = render(
      <Switch aria-label="Enable notifications" defaultChecked />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("disabled switch has no axe violations", async () => {
    const { container } = render(
      <Switch aria-label="Enable notifications" disabled />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("disabled+checked switch has no axe violations", async () => {
    const { container } = render(
      <Switch aria-label="Enable notifications" disabled defaultChecked />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("size='sm' switch has no axe violations", async () => {
    const { container } = render(
      <Switch aria-label="Toggle feature" size="sm" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("size='default' switch has no axe violations", async () => {
    const { container } = render(
      <Switch aria-label="Toggle feature" size="default" />
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("switch with aria-invalid has no axe violations when describedby is also present", async () => {
    const { container } = render(
      <div>
        <Switch
          aria-label="Accept terms"
          aria-invalid={true}
          aria-describedby="error-msg"
        />
        <span id="error-msg" role="alert">
          You must accept the terms.
        </span>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("switch inside a label element has no axe violations", async () => {
    const { container } = render(
      <label>
        Dark mode
        <Switch />
      </label>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("multiple labeled switches have no axe violations", async () => {
    const { container } = render(
      <div>
        <Switch aria-label="Dark mode" />
        <Switch aria-label="Auto-save" defaultChecked />
        <Switch aria-label="Analytics" disabled />
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── Edge cases ───────────────────────────────────────────────────────────────

describe("Switch – edge cases", () => {
  it("className='' does not break rendering", () => {
    render(<Switch aria-label="Toggle" className="" />);
    expect(getSwitch()).toBeInTheDocument();
  });

  it("renders without any props (no crash)", () => {
    // No aria-label — still renders, just not easily queryable by role+name
    const { container } = render(<Switch />);
    expect(container.querySelector("[data-slot='switch']")).toBeInTheDocument();
  });

  it("onCheckedChange=undefined does not crash on click", async () => {
    render(<Switch aria-label="Toggle" />);
    const user = userEvent.setup();
    await expect(user.click(getSwitch())).resolves.toBeUndefined();
  });

  it("readOnly switch can be queried with data-readonly", () => {
    render(<Switch aria-label="Toggle" readOnly />);
    expect(getSwitch()).toHaveAttribute("data-readonly");
  });

  it("checked switch + disabled → data-checked AND data-disabled both present", () => {
    render(<Switch aria-label="Toggle" disabled defaultChecked />);
    expect(getSwitch()).toHaveAttribute("data-checked");
    expect(getSwitch()).toHaveAttribute("data-disabled");
  });

  it("sm disabled switch still has the size class and disabled class", () => {
    render(<Switch aria-label="Toggle" size="sm" disabled />);
    expect(getSwitch()).toHaveAttribute("data-size", "sm");
    expect(getSwitch()).toHaveAttribute("data-disabled");
  });
});
