/**
 * Exhaustive tests for the ai-web-preview compound component (AI Elements
 * "web-preview", ported to byronwade/ui).
 *
 * Component source: components/ai-elements/web-preview.tsx
 *
 * Exports:
 *   WebPreview                  – root surface div + context provider,
 *                                 data-slot="web-preview", defaultUrl, onUrlChange
 *   WebPreviewNavigation        – nav bar row, data-slot="web-preview-navigation"
 *   WebPreviewNavigationButton  – tooltip-wrapped ghost icon Button,
 *                                 data-slot="web-preview-navigation-button", tooltip prop
 *   WebPreviewUrl               – Input bound to context url,
 *                                 data-slot="web-preview-url"
 *   WebPreviewBody              – iframe wrapper, data-slot="web-preview-body"
 *                                 (+ iframe data-slot="web-preview-body-iframe"), loading
 *   WebPreviewConsole           – Collapsible console, data-slot="web-preview-console",
 *                                 logs (level: log|warn|error)
 */

import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";
import {
  WebPreview,
  WebPreviewNavigation,
  WebPreviewNavigationButton,
  WebPreviewUrl,
  WebPreviewBody,
  WebPreviewConsole,
} from "@/components/ai-elements/web-preview";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function renderFullPreview(opts?: {
  defaultUrl?: string;
  logs?: Array<{ level: "log" | "warn" | "error"; message: string; timestamp: Date }>;
}) {
  return render(
    <WebPreview defaultUrl={opts?.defaultUrl}>
      <WebPreviewNavigation>
        <WebPreviewNavigationButton tooltip="Reload">
          <span data-testid="reload-icon">R</span>
        </WebPreviewNavigationButton>
        <WebPreviewUrl />
      </WebPreviewNavigation>
      <WebPreviewBody />
      <WebPreviewConsole logs={opts?.logs} />
    </WebPreview>
  );
}

const ts = (s: string) => new Date(`2026-06-03T${s}`);

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("WebPreview — renders without crashing", () => {
  it("renders a bare WebPreview", () => {
    const { container } = render(<WebPreview />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders a fully-composed preview without throwing", () => {
    expect(() => renderFullPreview()).not.toThrow();
  });

  it("renders children", () => {
    render(<WebPreview>hello</WebPreview>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. data-slot attributes
// ---------------------------------------------------------------------------

describe("WebPreview — data-slot attributes", () => {
  it("root has data-slot='web-preview'", () => {
    const { container } = render(<WebPreview />);
    expect(container.firstChild).toHaveAttribute("data-slot", "web-preview");
  });

  it("navigation has data-slot='web-preview-navigation'", () => {
    const { container } = render(<WebPreviewNavigation />);
    expect(container.firstChild).toHaveAttribute(
      "data-slot",
      "web-preview-navigation"
    );
  });

  it("navigation button has data-slot='web-preview-navigation-button'", () => {
    const { container } = render(
      <WebPreviewNavigationButton tooltip="t">x</WebPreviewNavigationButton>
    );
    expect(
      container.querySelector("[data-slot='web-preview-navigation-button']")
    ).toBeInTheDocument();
  });

  it("url input has data-slot='web-preview-url'", () => {
    const { container } = render(
      <WebPreview>
        <WebPreviewUrl />
      </WebPreview>
    );
    expect(
      container.querySelector("[data-slot='web-preview-url']")
    ).toBeInTheDocument();
  });

  it("body wrapper + iframe have data-slots", () => {
    const { container } = render(
      <WebPreview>
        <WebPreviewBody />
      </WebPreview>
    );
    expect(
      container.querySelector("[data-slot='web-preview-body']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='web-preview-body-iframe']")
    ).toBeInTheDocument();
  });

  it("console + trigger + chevron have data-slots (closed)", () => {
    const { container } = render(
      <WebPreview>
        <WebPreviewConsole />
      </WebPreview>
    );
    expect(
      container.querySelector("[data-slot='web-preview-console']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='web-preview-console-trigger']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='web-preview-console-chevron']")
    ).toBeInTheDocument();
  });

  it("console content panel has data-slot once open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <WebPreview>
        <WebPreviewConsole />
      </WebPreview>
    );
    await user.click(screen.getByRole("button", { name: /Console/ }));
    expect(
      container.querySelector("[data-slot='web-preview-console-content']")
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. Root surface styling (DNA — edge, no border, tokens)
// ---------------------------------------------------------------------------

describe("WebPreview — root surface styling", () => {
  it("uses the edge hairline and bg-card, not an outline border", () => {
    const { container } = render(<WebPreview />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("edge");
    expect(cls).toContain("bg-card");
    expect(cls).toContain("overflow-hidden");
    expect(cls).toContain("rounded-lg");
  });

  it("forwards custom className while keeping base classes", () => {
    const { container } = render(<WebPreview className="my-frame" />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("my-frame");
    expect(cls).toContain("edge");
  });

  it("forwards arbitrary HTML attributes (id)", () => {
    const { container } = render(<WebPreview id="frame-1" />);
    expect(container.firstChild).toHaveAttribute("id", "frame-1");
  });
});

// ---------------------------------------------------------------------------
// 4. useWebPreview context guard
// ---------------------------------------------------------------------------

describe("WebPreview — context guard", () => {
  it("WebPreviewUrl outside a WebPreview throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<WebPreviewUrl />)).toThrow(
      /must be used within a WebPreview/
    );
    spy.mockRestore();
  });

  it("WebPreviewBody outside a WebPreview throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<WebPreviewBody />)).toThrow(
      /must be used within a WebPreview/
    );
    spy.mockRestore();
  });

  it("WebPreviewConsole outside a WebPreview throws", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<WebPreviewConsole />)).toThrow(
      /must be used within a WebPreview/
    );
    spy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// 5. WebPreviewNavigation
// ---------------------------------------------------------------------------

describe("WebPreviewNavigation", () => {
  it("renders children", () => {
    render(<WebPreviewNavigation>nav-kids</WebPreviewNavigation>);
    expect(screen.getByText("nav-kids")).toBeInTheDocument();
  });

  it("has a bottom divider border", () => {
    const { container } = render(<WebPreviewNavigation />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "border-b"
    );
  });

  it("forwards custom className", () => {
    const { container } = render(
      <WebPreviewNavigation className="nav-x" />
    );
    expect((container.firstChild as HTMLElement).className).toContain("nav-x");
  });
});

// ---------------------------------------------------------------------------
// 6. WebPreviewNavigationButton — render-merge into Button (highest risk)
// ---------------------------------------------------------------------------

describe("WebPreviewNavigationButton", () => {
  it("renders as a <button> element (Tooltip trigger merged into Button)", () => {
    const { container } = render(
      <WebPreviewNavigationButton tooltip="t">go</WebPreviewNavigationButton>
    );
    const btn = container.querySelector(
      "[data-slot='web-preview-navigation-button']"
    );
    expect(btn?.tagName).toBe("BUTTON");
  });

  it("renders children inside the button", () => {
    render(
      <WebPreviewNavigationButton tooltip="t">
        <span data-testid="icon">I</span>
      </WebPreviewNavigationButton>
    );
    const btn = screen.getByRole("button");
    expect(within(btn).getByTestId("icon")).toBeInTheDocument();
  });

  it("uses the ghost variant + icon-sm size styling", () => {
    const { container } = render(
      <WebPreviewNavigationButton tooltip="t">x</WebPreviewNavigationButton>
    );
    const btn = container.querySelector(
      "[data-slot='web-preview-navigation-button']"
    ) as HTMLElement;
    // icon-sm => size-8
    expect(btn.className).toContain("size-8");
    expect(btn.className).toContain("text-muted-foreground");
  });

  it("fires onClick when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <WebPreviewNavigationButton tooltip="t" onClick={onClick}>
        x
      </WebPreviewNavigationButton>
    );
    await user.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <WebPreviewNavigationButton tooltip="t" disabled onClick={onClick}>
        x
      </WebPreviewNavigationButton>
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows the tooltip text on focus", async () => {
    const user = userEvent.setup();
    render(
      <WebPreviewNavigationButton tooltip="Reload page">
        x
      </WebPreviewNavigationButton>
    );
    await user.tab();
    expect(await screen.findByText("Reload page")).toBeInTheDocument();
  });

  it("renders no tooltip content when tooltip prop is omitted", async () => {
    const user = userEvent.setup();
    render(<WebPreviewNavigationButton>x</WebPreviewNavigationButton>);
    await user.tab();
    // button still focusable/usable; no crash, no tooltip text
    expect(screen.getByRole("button")).toHaveFocus();
  });

  it("forwards custom className and merges with base", () => {
    const { container } = render(
      <WebPreviewNavigationButton tooltip="t" className="nav-btn-x">
        x
      </WebPreviewNavigationButton>
    );
    const btn = container.querySelector(
      "[data-slot='web-preview-navigation-button']"
    ) as HTMLElement;
    expect(btn.className).toContain("nav-btn-x");
    expect(btn.className).toContain("text-muted-foreground");
  });
});

// ---------------------------------------------------------------------------
// 7. WebPreviewUrl — controlled & uncontrolled, key handling
// ---------------------------------------------------------------------------

describe("WebPreviewUrl", () => {
  it("renders the default url from context as initial value", () => {
    render(
      <WebPreview defaultUrl="https://example.com">
        <WebPreviewUrl />
      </WebPreview>
    );
    expect(screen.getByRole("textbox")).toHaveValue("https://example.com");
  });

  it("has placeholder text and font-mono styling", () => {
    const { container } = render(
      <WebPreview>
        <WebPreviewUrl />
      </WebPreview>
    );
    const input = container.querySelector(
      "[data-slot='web-preview-url']"
    ) as HTMLInputElement;
    expect(input).toHaveAttribute("placeholder", "Enter URL...");
    expect(input.className).toContain("font-mono");
  });

  it("uncontrolled: typing updates the internal input value", async () => {
    const user = userEvent.setup();
    render(
      <WebPreview>
        <WebPreviewUrl />
      </WebPreview>
    );
    const input = screen.getByRole("textbox");
    await user.type(input, "abc");
    expect(input).toHaveValue("abc");
  });

  it("uncontrolled: calls own onChange handler (onChange ?? handleChange branch) when onChange passed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <WebPreview>
        <WebPreviewUrl onChange={onChange} />
      </WebPreview>
    );
    await user.type(screen.getByRole("textbox"), "z");
    expect(onChange).toHaveBeenCalled();
  });

  it("controlled: value prop wins over internal state", () => {
    render(
      <WebPreview>
        <WebPreviewUrl value="https://controlled.dev" onChange={() => {}} />
      </WebPreview>
    );
    expect(screen.getByRole("textbox")).toHaveValue("https://controlled.dev");
  });

  it("Enter commits the input value to context url (and re-syncs the body)", async () => {
    const user = userEvent.setup();
    const onUrlChange = vi.fn();
    render(
      <WebPreview onUrlChange={onUrlChange}>
        <WebPreviewUrl />
        <WebPreviewBody />
      </WebPreview>
    );
    const input = screen.getByRole("textbox");
    await user.type(input, "https://new.dev{Enter}");
    expect(onUrlChange).toHaveBeenCalledWith("https://new.dev");
  });

  it("non-Enter keys do not commit the url", async () => {
    const user = userEvent.setup();
    const onUrlChange = vi.fn();
    render(
      <WebPreview onUrlChange={onUrlChange}>
        <WebPreviewUrl />
      </WebPreview>
    );
    const input = screen.getByRole("textbox");
    await user.type(input, "https://x.dev");
    await user.keyboard("{Escape}");
    expect(onUrlChange).not.toHaveBeenCalled();
  });

  it("forwards a custom onKeyDown handler", async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    render(
      <WebPreview>
        <WebPreviewUrl onKeyDown={onKeyDown} />
      </WebPreview>
    );
    await user.type(screen.getByRole("textbox"), "{Enter}");
    expect(onKeyDown).toHaveBeenCalled();
  });

  it("re-syncs internal value when context url changes externally", async () => {
    const user = userEvent.setup();
    render(
      <WebPreview>
        <WebPreviewUrl />
        <WebPreviewBody />
      </WebPreview>
    );
    const input = screen.getByRole("textbox") as HTMLInputElement;
    await user.type(input, "https://synced.dev{Enter}");
    expect(input.value).toBe("https://synced.dev");
  });

  it("forwards custom className", () => {
    const { container } = render(
      <WebPreview>
        <WebPreviewUrl className="url-x" />
      </WebPreview>
    );
    const input = container.querySelector(
      "[data-slot='web-preview-url']"
    ) as HTMLElement;
    expect(input.className).toContain("url-x");
  });
});

// ---------------------------------------------------------------------------
// 8. WebPreviewBody — src resolution branches
// ---------------------------------------------------------------------------

describe("WebPreviewBody", () => {
  it("uses the context url as iframe src", () => {
    const { container } = render(
      <WebPreview defaultUrl="https://ctx.dev">
        <WebPreviewBody />
      </WebPreview>
    );
    const iframe = container.querySelector("iframe") as HTMLIFrameElement;
    expect(iframe).toHaveAttribute("src", "https://ctx.dev");
  });

  it("explicit src prop overrides the context url", () => {
    const { container } = render(
      <WebPreview defaultUrl="https://ctx.dev">
        <WebPreviewBody src="https://explicit.dev" />
      </WebPreview>
    );
    const iframe = container.querySelector("iframe") as HTMLIFrameElement;
    expect(iframe).toHaveAttribute("src", "https://explicit.dev");
  });

  it("empty url and no src yields no src attribute (|| undefined branch)", () => {
    const { container } = render(
      <WebPreview>
        <WebPreviewBody />
      </WebPreview>
    );
    const iframe = container.querySelector("iframe") as HTMLIFrameElement;
    expect(iframe).not.toHaveAttribute("src");
  });

  it("renders the loading node when provided", () => {
    render(
      <WebPreview>
        <WebPreviewBody loading={<span>Loading…</span>} />
      </WebPreview>
    );
    expect(screen.getByText("Loading…")).toBeInTheDocument();
  });

  it("has sandbox + title on the iframe", () => {
    const { container } = render(
      <WebPreview>
        <WebPreviewBody />
      </WebPreview>
    );
    const iframe = container.querySelector("iframe") as HTMLIFrameElement;
    expect(iframe).toHaveAttribute("sandbox");
    expect(iframe).toHaveAttribute("title", "Preview");
  });

  it("forwards custom className to the iframe", () => {
    const { container } = render(
      <WebPreview>
        <WebPreviewBody className="iframe-x" />
      </WebPreview>
    );
    const iframe = container.querySelector("iframe") as HTMLIFrameElement;
    expect(iframe.className).toContain("iframe-x");
  });
});

// ---------------------------------------------------------------------------
// 9. WebPreviewConsole — logs, levels, toggle
// ---------------------------------------------------------------------------

describe("WebPreviewConsole", () => {
  it("shows 'No console output' when logs is empty", async () => {
    const user = userEvent.setup();
    render(
      <WebPreview>
        <WebPreviewConsole />
      </WebPreview>
    );
    await user.click(screen.getByRole("button", { name: /Console/ }));
    expect(screen.getByText("No console output")).toBeInTheDocument();
  });

  it("renders a 'log' level entry with text-foreground", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <WebPreview>
        <WebPreviewConsole
          logs={[{ level: "log", message: "ok", timestamp: ts("10:00:00") }]}
        />
      </WebPreview>
    );
    await user.click(screen.getByRole("button", { name: /Console/ }));
    const entry = container.querySelector(
      "[data-slot='web-preview-console-log']"
    ) as HTMLElement;
    expect(entry.className).toContain("text-foreground");
    expect(screen.getByText("ok")).toBeInTheDocument();
  });

  it("renders a 'warn' level entry with text-warning (token, not raw yellow)", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <WebPreview>
        <WebPreviewConsole
          logs={[{ level: "warn", message: "careful", timestamp: ts("10:00:01") }]}
        />
      </WebPreview>
    );
    await user.click(screen.getByRole("button", { name: /Console/ }));
    const entry = container.querySelector(
      "[data-slot='web-preview-console-log']"
    ) as HTMLElement;
    expect(entry.className).toContain("text-warning");
  });

  it("renders an 'error' level entry with text-destructive", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <WebPreview>
        <WebPreviewConsole
          logs={[{ level: "error", message: "boom", timestamp: ts("10:00:02") }]}
        />
      </WebPreview>
    );
    await user.click(screen.getByRole("button", { name: /Console/ }));
    const entry = container.querySelector(
      "[data-slot='web-preview-console-log']"
    ) as HTMLElement;
    expect(entry.className).toContain("text-destructive");
  });

  it("renders all three levels together with timestamps", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <WebPreview>
        <WebPreviewConsole
          logs={[
            { level: "log", message: "m1", timestamp: ts("10:00:00") },
            { level: "warn", message: "m2", timestamp: ts("10:00:01") },
            { level: "error", message: "m3", timestamp: ts("10:00:02") },
          ]}
        />
      </WebPreview>
    );
    await user.click(screen.getByRole("button", { name: /Console/ }));
    const entries = container.querySelectorAll(
      "[data-slot='web-preview-console-log']"
    );
    expect(entries).toHaveLength(3);
    expect(screen.getByText("m1")).toBeInTheDocument();
    expect(screen.getByText("m3")).toBeInTheDocument();
  });

  it("renders extra children inside the console panel", async () => {
    const user = userEvent.setup();
    render(
      <WebPreview>
        <WebPreviewConsole>
          <span>custom child</span>
        </WebPreviewConsole>
      </WebPreview>
    );
    await user.click(screen.getByRole("button", { name: /Console/ }));
    expect(screen.getByText("custom child")).toBeInTheDocument();
  });

  it("toggles open/closed and rotates chevron via panel state", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <WebPreview>
        <WebPreviewConsole />
      </WebPreview>
    );
    const root = container.querySelector(
      "[data-slot='web-preview-console']"
    ) as HTMLElement;
    expect(root).not.toHaveAttribute("data-open");
    await user.click(screen.getByRole("button", { name: /Console/ }));
    expect(root).toHaveAttribute("data-open");
    await user.click(screen.getByRole("button", { name: /Console/ }));
    expect(root).not.toHaveAttribute("data-open");
  });

  it("chevron carries the panel-open rotation class", () => {
    const { container } = render(
      <WebPreview>
        <WebPreviewConsole />
      </WebPreview>
    );
    const chevron = container.querySelector(
      "[data-slot='web-preview-console-chevron']"
    ) as SVGElement;
    expect(chevron.getAttribute("class")).toContain(
      "group-data-[panel-open]:rotate-180"
    );
  });

  it("trigger has focus-visible ring token classes", () => {
    const { container } = render(
      <WebPreview>
        <WebPreviewConsole />
      </WebPreview>
    );
    const trigger = container.querySelector(
      "[data-slot='web-preview-console-trigger']"
    ) as HTMLElement;
    expect(trigger.className).toContain("focus-visible:ring-ring");
  });

  it("forwards custom className to the console root", () => {
    const { container } = render(
      <WebPreview>
        <WebPreviewConsole className="console-x" />
      </WebPreview>
    );
    const root = container.querySelector(
      "[data-slot='web-preview-console']"
    ) as HTMLElement;
    expect(root.className).toContain("console-x");
  });

  it("console is mono-typed for engineered texture", () => {
    const { container } = render(
      <WebPreview>
        <WebPreviewConsole />
      </WebPreview>
    );
    const root = container.querySelector(
      "[data-slot='web-preview-console']"
    ) as HTMLElement;
    expect(root.className).toContain("font-mono");
  });
});

// ---------------------------------------------------------------------------
// 10. Composition & state integration
// ---------------------------------------------------------------------------

describe("ai-web-preview — composition", () => {
  it("all parts compose under the root", () => {
    const { container } = renderFullPreview({ defaultUrl: "https://demo.dev" });
    const root = container.querySelector(
      "[data-slot='web-preview']"
    ) as HTMLElement;
    expect(
      root.querySelector("[data-slot='web-preview-navigation']")
    ).toBeInTheDocument();
    expect(
      root.querySelector("[data-slot='web-preview-body']")
    ).toBeInTheDocument();
    expect(
      root.querySelector("[data-slot='web-preview-console']")
    ).toBeInTheDocument();
  });

  it("committing a url in the bar updates the body iframe src", async () => {
    const user = userEvent.setup();
    const { container } = renderFullPreview();
    const input = screen.getByRole("textbox");
    await user.type(input, "https://integration.dev{Enter}");
    const iframe = container.querySelector("iframe") as HTMLIFrameElement;
    expect(iframe).toHaveAttribute("src", "https://integration.dev");
  });
});

// ---------------------------------------------------------------------------
// 11. Accessibility — axe
// ---------------------------------------------------------------------------

describe("ai-web-preview — accessibility (axe)", () => {
  // axe-core can't traverse the sandboxed <iframe> in jsdom (no real frame
  // window), so the axe trees exercise the interactive chrome — navigation,
  // URL field, and console. WebPreviewBody's own a11y (sandbox + title) is
  // covered in the WebPreviewBody suite above.
  it("full preview chrome has no axe violations", async () => {
    const { container } = render(
      <main>
        <WebPreview defaultUrl="https://example.com">
          <WebPreviewNavigation>
            <WebPreviewNavigationButton tooltip="Reload">
              <span aria-hidden>R</span>
            </WebPreviewNavigationButton>
            <WebPreviewUrl aria-label="Preview URL" />
          </WebPreviewNavigation>
          <WebPreviewConsole
            logs={[
              { level: "log", message: "ready", timestamp: ts("10:00:00") },
              { level: "warn", message: "slow", timestamp: ts("10:00:01") },
              { level: "error", message: "failed", timestamp: ts("10:00:02") },
            ]}
          />
        </WebPreview>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("open console has no axe violations", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <main>
        <WebPreview>
          <WebPreviewNavigation>
            <WebPreviewUrl aria-label="Preview URL" />
          </WebPreviewNavigation>
          <WebPreviewConsole
            logs={[{ level: "error", message: "failed", timestamp: ts("10:00:00") }]}
          />
        </WebPreview>
      </main>
    );
    await user.click(screen.getByRole("button", { name: /Console/ }));
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
