/**
 * Exhaustive tests for the ai-tool compound component
 *
 * Component source: components/ai-elements/tool.tsx
 *
 * Exports:
 *   Tool        – Collapsible root, data-slot="tool"
 *   ToolHeader  – CollapsibleTrigger header, data-slot="tool-header"
 *   ToolContent – CollapsibleContent body, data-slot="tool-content"
 *   ToolInput   – parameters block (CodeBlock of JSON input), data-slot="tool-input"
 *   ToolOutput  – result/error block, data-slot="tool-output" (null when empty)
 *
 * ToolHeader renders a status Badge whose label/icon/variant depend on `state`:
 *   input-streaming → "Pending"            (secondary)
 *   input-available → "Running"            (secondary)
 *   approval-requested → "Awaiting Approval" (warning)
 *   approval-responded → "Responded"       (secondary)
 *   output-available → "Completed"         (success)
 *   output-error → "Error"                 (destructive)
 *   output-denied → "Denied"               (warning)
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";

// `tool.tsx` renders `CodeBlock` (from ./code-block), which calls shiki's
// `codeToHtml` (WASM) inside a useEffect. Mock it so highlighting is
// deterministic and never throws an unhandled rejection in jsdom.
vi.mock("shiki", () => ({
  codeToHtml: async (code: string, opts: { lang: string; theme: string }) =>
    `<pre data-theme="${opts.theme}" data-lang="${opts.lang}"><code>${code}</code></pre>`,
}));

import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from "@/components/ai-elements/tool";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

type ToolState =
  | "input-streaming"
  | "input-available"
  | "approval-requested"
  | "approval-responded"
  | "output-available"
  | "output-error"
  | "output-denied";

const STATES: { state: ToolState; label: string }[] = [
  { state: "input-streaming", label: "Pending" },
  { state: "input-available", label: "Running" },
  { state: "approval-requested", label: "Awaiting Approval" },
  { state: "approval-responded", label: "Responded" },
  { state: "output-available", label: "Completed" },
  { state: "output-error", label: "Error" },
  { state: "output-denied", label: "Denied" },
];

function renderFullTool() {
  return render(
    <Tool defaultOpen>
      <ToolHeader
        state={"output-available" as ToolState}
        title="Search the web"
        type={"tool-web_search" as never}
      />
      <ToolContent>
        <ToolInput input={{ query: "hello" }} />
        <ToolOutput errorText={undefined} output={{ ok: true }} />
      </ToolContent>
    </Tool>
  );
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("Tool — renders without crashing", () => {
  it("renders a bare Tool without crashing", () => {
    const { container } = render(<Tool />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("renders a fully-composed tool without crashing", () => {
    expect(() => renderFullTool()).not.toThrow();
  });

  it("renders children inside Tool", () => {
    render(
      <Tool defaultOpen>
        <ToolContent>hello world</ToolContent>
      </Tool>
    );
    expect(screen.getByText("hello world")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. data-slot attributes
// ---------------------------------------------------------------------------

describe("Tool — data-slot attributes", () => {
  it("Tool root has data-slot='tool'", () => {
    const { container } = render(<Tool />);
    expect(container.firstChild).toHaveAttribute("data-slot", "tool");
  });

  it("ToolHeader has data-slot='tool-header'", () => {
    render(
      <Tool>
        <ToolHeader state={"input-available" as ToolState} type={"tool-x" as never} />
      </Tool>
    );
    expect(
      document.querySelector("[data-slot='tool-header']")
    ).toBeInTheDocument();
  });

  it("ToolHeader exposes title and chevron sub-slots", () => {
    render(
      <Tool>
        <ToolHeader state={"input-available" as ToolState} type={"tool-x" as never} />
      </Tool>
    );
    expect(
      document.querySelector("[data-slot='tool-header-meta']")
    ).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='tool-header-title']")
    ).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='tool-header-chevron']")
    ).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='tool-status-badge']")
    ).toBeInTheDocument();
  });

  it("ToolContent has data-slot='tool-content'", () => {
    render(
      <Tool defaultOpen>
        <ToolContent>body</ToolContent>
      </Tool>
    );
    expect(
      document.querySelector("[data-slot='tool-content']")
    ).toBeInTheDocument();
  });

  it("ToolInput has data-slot='tool-input'", () => {
    const { container } = render(<ToolInput input={{ a: 1 }} />);
    expect(container.querySelector("[data-slot='tool-input']")).toBeInTheDocument();
  });

  it("ToolOutput has data-slot='tool-output'", () => {
    const { container } = render(
      <ToolOutput errorText={undefined} output="done" />
    );
    expect(
      container.querySelector("[data-slot='tool-output']")
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. Tool base classes (DNA — edge, no border, tokens)
// ---------------------------------------------------------------------------

describe("Tool — base classes", () => {
  it("has rounded-lg class", () => {
    const { container } = render(<Tool />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "rounded-lg"
    );
  });

  it("elevates with edge and has no hard border", () => {
    const { container } = render(<Tool />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("edge");
    expect(cls).not.toContain("border-border");
  });

  it("has bg-card and text-card-foreground tokens", () => {
    const { container } = render(<Tool />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("bg-card");
    expect(cls).toContain("text-card-foreground");
  });

  it("has overflow-hidden class", () => {
    const { container } = render(<Tool />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "overflow-hidden"
    );
  });

  it("uses no raw color utilities", () => {
    const { container } = render(<Tool />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).not.toMatch(/#[0-9a-fA-F]{3,6}/);
    expect(cls).not.toMatch(/\b(green|red|blue|yellow|orange)-\d{3}\b/);
  });
});

// ---------------------------------------------------------------------------
// 4. ToolHeader — title vs derived label
// ---------------------------------------------------------------------------

describe("ToolHeader — title and type", () => {
  it("renders explicit title when provided", () => {
    render(
      <Tool>
        <ToolHeader
          state={"input-available" as ToolState}
          title="Custom Title"
          type={"tool-web_search" as never}
        />
      </Tool>
    );
    expect(screen.getByText("Custom Title")).toBeInTheDocument();
  });

  it("derives the label from type when no title (strips the leading segment)", () => {
    render(
      <Tool>
        <ToolHeader
          state={"input-available" as ToolState}
          type={"tool-web_search" as never}
        />
      </Tool>
    );
    expect(screen.getByText("web_search")).toBeInTheDocument();
  });

  it("derives a multi-segment label, rejoining with dashes", () => {
    render(
      <Tool>
        <ToolHeader
          state={"input-available" as ToolState}
          type={"tool-fetch-page-content" as never}
        />
      </Tool>
    );
    expect(screen.getByText("fetch-page-content")).toBeInTheDocument();
  });

  it("title is font-medium, never bold", () => {
    render(
      <Tool>
        <ToolHeader
          state={"input-available" as ToolState}
          title="T"
          type={"tool-x" as never}
        />
      </Tool>
    );
    const title = document.querySelector(
      "[data-slot='tool-header-title']"
    ) as HTMLElement;
    expect(title.className).toContain("font-medium");
    expect(title.className).not.toContain("font-bold");
    expect(title.className).not.toContain("font-semibold");
  });

  it("chevron rotates on open via group-data-[panel-open]", () => {
    render(
      <Tool>
        <ToolHeader
          state={"input-available" as ToolState}
          type={"tool-x" as never}
        />
      </Tool>
    );
    const chevron = document.querySelector(
      "[data-slot='tool-header-chevron']"
    ) as SVGElement;
    expect(chevron.getAttribute("class")).toContain(
      "group-data-[panel-open]:rotate-180"
    );
  });
});

// ---------------------------------------------------------------------------
// 5. Status badge — every state (label + variant + tokens, no raw color)
// ---------------------------------------------------------------------------

describe("ToolHeader — status badge per state", () => {
  it.each(STATES)(
    "state '$state' renders label '$label'",
    ({ state, label }) => {
      render(
        <Tool>
          <ToolHeader state={state as ToolState} type={"tool-x" as never} />
        </Tool>
      );
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  );

  it("badge uses font-mono (data texture) and rounded-full", () => {
    render(
      <Tool>
        <ToolHeader
          state={"output-available" as ToolState}
          type={"tool-x" as never}
        />
      </Tool>
    );
    const badge = document.querySelector(
      "[data-slot='tool-status-badge']"
    ) as HTMLElement;
    expect(badge.className).toContain("font-mono");
    expect(badge.className).toContain("rounded-full");
  });

  it.each(STATES)(
    "state '$state' badge uses only token colors (no raw hex/named color)",
    ({ state }) => {
      const { container } = render(
        <Tool>
          <ToolHeader state={state as ToolState} type={"tool-x" as never} />
        </Tool>
      );
      const html = container.innerHTML;
      expect(html).not.toMatch(/#[0-9a-fA-F]{3,6}/);
      expect(html).not.toMatch(/\b(green|red|blue|yellow|orange)-\d{3}\b/);
    }
  );

  it("error state badge resolves to a destructive icon token", () => {
    const { container } = render(
      <Tool>
        <ToolHeader
          state={"output-error" as ToolState}
          type={"tool-x" as never}
        />
      </Tool>
    );
    expect(container.querySelector(".text-destructive")).toBeInTheDocument();
  });

  it("completed state badge resolves to a success icon token", () => {
    const { container } = render(
      <Tool>
        <ToolHeader
          state={"output-available" as ToolState}
          type={"tool-x" as never}
        />
      </Tool>
    );
    expect(container.querySelector(".text-success")).toBeInTheDocument();
  });

  it("approval-responded state resolves to a brand icon token", () => {
    const { container } = render(
      <Tool>
        <ToolHeader
          state={"approval-responded" as ToolState}
          type={"tool-x" as never}
        />
      </Tool>
    );
    expect(container.querySelector(".text-brand")).toBeInTheDocument();
  });

  it("approval-requested state resolves to a warning icon token", () => {
    const { container } = render(
      <Tool>
        <ToolHeader
          state={"approval-requested" as ToolState}
          type={"tool-x" as never}
        />
      </Tool>
    );
    expect(container.querySelector(".text-warning")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. ToolContent
// ---------------------------------------------------------------------------

describe("ToolContent — classes and content", () => {
  it("renders children when open", () => {
    render(
      <Tool defaultOpen>
        <ToolContent>
          <p>panel body</p>
        </ToolContent>
      </Tool>
    );
    expect(screen.getByText("panel body")).toBeInTheDocument();
  });

  it("uses token-driven popover-foreground text", () => {
    render(
      <Tool defaultOpen>
        <ToolContent>x</ToolContent>
      </Tool>
    );
    const content = document.querySelector(
      "[data-slot='tool-content']"
    ) as HTMLElement;
    expect(content.className).toContain("text-popover-foreground");
  });
});

// ---------------------------------------------------------------------------
// 7. ToolInput
// ---------------------------------------------------------------------------

describe("ToolInput — parameters block", () => {
  it("renders the 'Parameters' heading", () => {
    render(<ToolInput input={{ a: 1 }} />);
    expect(screen.getByText("Parameters")).toBeInTheDocument();
  });

  it("heading is font-medium font-mono uppercase (data label)", () => {
    render(<ToolInput input={{ a: 1 }} />);
    const heading = screen.getByText("Parameters");
    expect(heading.className).toContain("font-medium");
    expect(heading.className).toContain("font-mono");
    expect(heading.className).toContain("uppercase");
  });

  it("accepts a complex object input without crashing", () => {
    expect(() =>
      render(<ToolInput input={{ nested: { deep: [1, 2, 3] }, flag: true }} />)
    ).not.toThrow();
  });

  it("accepts an undefined input without crashing", () => {
    expect(() => render(<ToolInput input={undefined} />)).not.toThrow();
  });

  it("forwards custom className", () => {
    const { container } = render(
      <ToolInput className="custom-input" input={{ a: 1 }} />
    );
    const el = container.querySelector(
      "[data-slot='tool-input']"
    ) as HTMLElement;
    expect(el.className).toContain("custom-input");
  });

  it("forwards HTML attributes", () => {
    const { container } = render(
      <ToolInput data-testid="ti" id="ti-1" input={{ a: 1 }} />
    );
    const el = container.querySelector("[data-slot='tool-input']");
    expect(el).toHaveAttribute("id", "ti-1");
    expect(el).toHaveAttribute("data-testid", "ti");
  });
});

// ---------------------------------------------------------------------------
// 8. ToolOutput — every branch
// ---------------------------------------------------------------------------

describe("ToolOutput — branches", () => {
  it("returns null when there is no output and no error", () => {
    const { container } = render(
      <ToolOutput errorText={undefined} output={undefined} />
    );
    expect(
      container.querySelector("[data-slot='tool-output']")
    ).not.toBeInTheDocument();
  });

  it("renders a 'Result' heading for a successful output", () => {
    render(<ToolOutput errorText={undefined} output="done" />);
    expect(screen.getByText("Result")).toBeInTheDocument();
  });

  it("renders an 'Error' heading when errorText is provided", () => {
    render(<ToolOutput errorText="boom" output={undefined} />);
    expect(screen.getByText("Error")).toBeInTheDocument();
  });

  it("renders the error text content", () => {
    render(<ToolOutput errorText="Network failed" output={undefined} />);
    expect(screen.getByText("Network failed")).toBeInTheDocument();
  });

  it("error container uses destructive token surface, not raw red", () => {
    const { container } = render(
      <ToolOutput errorText="boom" output={undefined} />
    );
    const out = container.querySelector(
      "[data-slot='tool-output']"
    ) as HTMLElement;
    expect(out.innerHTML).toContain("bg-destructive/10");
    expect(out.innerHTML).toContain("text-destructive");
    expect(out.innerHTML).not.toMatch(/\bred-\d{3}\b/);
  });

  it("success container uses muted token surface", () => {
    const { container } = render(
      <ToolOutput errorText={undefined} output="ok" />
    );
    const out = container.querySelector(
      "[data-slot='tool-output']"
    ) as HTMLElement;
    expect(out.innerHTML).toContain("bg-muted/50");
    expect(out.innerHTML).toContain("text-foreground");
  });

  it("renders a string output without crashing (CodeBlock branch)", () => {
    expect(() =>
      render(<ToolOutput errorText={undefined} output="plain string" />)
    ).not.toThrow();
  });

  it("renders an object output without crashing (JSON CodeBlock branch)", () => {
    expect(() =>
      render(
        <ToolOutput errorText={undefined} output={{ status: "ok", n: 42 }} />
      )
    ).not.toThrow();
  });

  it("renders a React element output directly (element branch)", () => {
    render(
      <ToolOutput
        errorText={undefined}
        output={<span data-testid="el-output">custom element</span>}
      />
    );
    expect(screen.getByTestId("el-output")).toBeInTheDocument();
    expect(screen.getByText("custom element")).toBeInTheDocument();
  });

  it("renders both errorText and (truthy) output together", () => {
    render(<ToolOutput errorText="warn" output="still here" />);
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("warn")).toBeInTheDocument();
  });

  it("forwards custom className", () => {
    const { container } = render(
      <ToolOutput className="custom-output" errorText={undefined} output="x" />
    );
    const el = container.querySelector(
      "[data-slot='tool-output']"
    ) as HTMLElement;
    expect(el.className).toContain("custom-output");
  });

  it("forwards HTML attributes", () => {
    const { container } = render(
      <ToolOutput
        data-testid="to"
        errorText={undefined}
        id="to-1"
        output="x"
      />
    );
    const el = container.querySelector("[data-slot='tool-output']");
    expect(el).toHaveAttribute("id", "to-1");
    expect(el).toHaveAttribute("data-testid", "to");
  });
});

// ---------------------------------------------------------------------------
// 9. className + attribute forwarding (Tool / ToolHeader / ToolContent)
// ---------------------------------------------------------------------------

describe("Tool family — className forwarding & merge", () => {
  it("Tool forwards custom className and keeps base classes", () => {
    const { container } = render(<Tool className="my-tool" />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("my-tool");
    expect(cls).toContain("rounded-lg");
    expect(cls).toContain("bg-card");
  });

  it("ToolHeader forwards custom className", () => {
    render(
      <Tool>
        <ToolHeader
          className="my-header"
          state={"input-available" as ToolState}
          type={"tool-x" as never}
        />
      </Tool>
    );
    const header = document.querySelector(
      "[data-slot='tool-header']"
    ) as HTMLElement;
    expect(header.className).toContain("my-header");
  });

  it("ToolContent forwards custom className", () => {
    render(
      <Tool defaultOpen>
        <ToolContent className="my-content">x</ToolContent>
      </Tool>
    );
    const content = document.querySelector(
      "[data-slot='tool-content']"
    ) as HTMLElement;
    expect(content.className).toContain("my-content");
  });

  it("Tool forwards HTML / aria attributes", () => {
    const { container } = render(
      <Tool aria-label="Tool call" data-testid="t" id="tool-1" />
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("id", "tool-1");
    expect(el).toHaveAttribute("aria-label", "Tool call");
    expect(el).toHaveAttribute("data-testid", "t");
  });
});

// ---------------------------------------------------------------------------
// 10. Interaction — collapsible open/close
// ---------------------------------------------------------------------------

describe("Tool — collapsible interaction", () => {
  it("ToolHeader is a button (collapsible trigger)", () => {
    render(
      <Tool>
        <ToolHeader
          state={"input-available" as ToolState}
          title="Toggle me"
          type={"tool-x" as never}
        />
      </Tool>
    );
    expect(
      screen.getByRole("button", { name: /Toggle me/ })
    ).toBeInTheDocument();
  });

  it("starts closed by default — panel content is not visible", () => {
    render(
      <Tool>
        <ToolHeader
          state={"input-available" as ToolState}
          title="Toggle me"
          type={"tool-x" as never}
        />
        <ToolContent>
          <p>hidden body</p>
        </ToolContent>
      </Tool>
    );
    expect(screen.queryByText("hidden body")).not.toBeInTheDocument();
  });

  it("clicking the header reveals the content", async () => {
    const user = userEvent.setup();
    render(
      <Tool>
        <ToolHeader
          state={"input-available" as ToolState}
          title="Toggle me"
          type={"tool-x" as never}
        />
        <ToolContent>
          <p>revealed body</p>
        </ToolContent>
      </Tool>
    );
    expect(screen.queryByText("revealed body")).not.toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /Toggle me/ }));
    expect(screen.getByText("revealed body")).toBeInTheDocument();
  });

  it("respects defaultOpen — content visible on mount", () => {
    render(
      <Tool defaultOpen>
        <ToolHeader
          state={"input-available" as ToolState}
          title="Toggle me"
          type={"tool-x" as never}
        />
        <ToolContent>
          <p>open body</p>
        </ToolContent>
      </Tool>
    );
    expect(screen.getByText("open body")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 11. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Tool — accessibility (axe)", () => {
  it("a closed tool header has no axe violations", async () => {
    const { container } = render(
      <main>
        <Tool>
          <ToolHeader
            state={"input-available" as ToolState}
            title="Search the web"
            type={"tool-web_search" as never}
          />
          <ToolContent>
            <ToolInput input={{ query: "hi" }} />
          </ToolContent>
        </Tool>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("an open tool with output has no axe violations", async () => {
    const { container } = render(
      <main>
        <Tool defaultOpen>
          <ToolHeader
            state={"output-available" as ToolState}
            title="Search the web"
            type={"tool-web_search" as never}
          />
          <ToolContent>
            <ToolInput input={{ query: "hi" }} />
            <ToolOutput errorText={undefined} output={{ ok: true }} />
          </ToolContent>
        </Tool>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("an error-state tool has no axe violations", async () => {
    const { container } = render(
      <main>
        <Tool defaultOpen>
          <ToolHeader
            state={"output-error" as ToolState}
            title="Search the web"
            type={"tool-web_search" as never}
          />
          <ToolContent>
            <ToolOutput errorText="Request failed" output={undefined} />
          </ToolContent>
        </Tool>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
