/**
 * Exhaustive tests for the AI CodeBlock compound component
 * (adapted from Vercel AI Elements).
 *
 * Component source: components/ai-elements/code-block.tsx
 *
 * Exports:
 *   highlightCode        – async helper: returns [lightHtml, darkHtml] via shiki
 *   CodeBlock            – root surface, data-slot="code-block"; renders light +
 *                          dark highlighted panels and an optional actions slot
 *   CodeBlockCopyButton  – copy-to-clipboard Button, data-slot="code-block-copy-button"
 *
 * `shiki` is mocked so highlighting is deterministic + synchronous-ish. The mock
 * echoes the theme + transformer presence so we can assert behavior without a
 * real WASM highlighter.
 */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { axe } from "vitest-axe";

// --- Mock shiki ------------------------------------------------------------
// codeToHtml normally compiles WASM grammars; mock it to a deterministic string
// that encodes the theme + whether a line-number transformer ran.
const codeToHtmlMock = vi.fn(
  async (
    code: string,
    opts: {
      lang: string;
      theme: string;
      transformers?: Array<{ name: string; line?: unknown }>;
    }
  ) => {
    const hasLineNumbers = (opts.transformers ?? []).some(
      (t) => t.name === "line-numbers"
    );
    return `<pre data-theme="${opts.theme}" data-lang="${opts.lang}" data-lines="${hasLineNumbers}"><code>${code}</code></pre>`;
  }
);

vi.mock("shiki", () => ({
  codeToHtml: (...args: Parameters<typeof codeToHtmlMock>) =>
    codeToHtmlMock(...args),
}));

import {
  CodeBlock,
  CodeBlockCopyButton,
  highlightCode,
} from "@/components/ai-elements/code-block";

const SAMPLE = `const x = 1;`;

afterEach(() => {
  codeToHtmlMock.mockClear();
});

// ---------------------------------------------------------------------------
// 1. highlightCode helper
// ---------------------------------------------------------------------------

describe("highlightCode — helper", () => {
  it("returns a [light, dark] tuple", async () => {
    const result = await highlightCode(SAMPLE, "ts");
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(2);
  });

  it("highlights with one-light and one-dark-pro themes", async () => {
    const [light, dark] = await highlightCode(SAMPLE, "ts");
    expect(light).toContain('data-theme="one-light"');
    expect(dark).toContain('data-theme="one-dark-pro"');
  });

  it("passes the language through to shiki", async () => {
    const [light] = await highlightCode(SAMPLE, "tsx");
    expect(light).toContain('data-lang="tsx"');
  });

  it("does NOT add line-number transformer by default", async () => {
    const [light, dark] = await highlightCode(SAMPLE, "ts");
    expect(light).toContain('data-lines="false"');
    expect(dark).toContain('data-lines="false"');
  });

  it("adds the line-number transformer when showLineNumbers is true", async () => {
    const [light, dark] = await highlightCode(SAMPLE, "ts", true);
    expect(light).toContain('data-lines="true"');
    expect(dark).toContain('data-lines="true"');
  });

  it("explicitly false showLineNumbers keeps transformers off", async () => {
    const [light] = await highlightCode(SAMPLE, "ts", false);
    expect(light).toContain('data-lines="false"');
  });

  it("invokes shiki codeToHtml twice (light + dark)", async () => {
    await highlightCode(SAMPLE, "ts");
    expect(codeToHtmlMock).toHaveBeenCalledTimes(2);
  });

  it("the line-number transformer prepends a line index span", async () => {
    // Drive the transformer's line() branch directly via the mock's captured call.
    await highlightCode("a\nb", "ts", true);
    const call = codeToHtmlMock.mock.calls[0][1];
    const transformer = call.transformers?.[0] as {
      name: string;
      line: (
        node: { children: Array<unknown> },
        line: number
      ) => void;
    };
    expect(transformer.name).toBe("line-numbers");
    const node = { children: [] as Array<unknown> };
    transformer.line(node, 7);
    expect(node.children).toHaveLength(1);
    const span = node.children[0] as {
      tagName: string;
      properties: { className: string[] };
      children: Array<{ value: string }>;
    };
    expect(span.tagName).toBe("span");
    expect(span.children[0].value).toBe("7");
    expect(span.properties.className).toContain("text-muted-foreground");
    expect(span.properties.className).toContain("select-none");
  });
});

// ---------------------------------------------------------------------------
// 2. CodeBlock — render + data-slot
// ---------------------------------------------------------------------------

describe("CodeBlock — render", () => {
  it("renders without crashing", () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("root has data-slot='code-block'", () => {
    render(<CodeBlock code={SAMPLE} language="ts" />);
    expect(
      document.querySelector("[data-slot='code-block']")
    ).toBeInTheDocument();
  });

  it("root element is a <div>", () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" />);
    expect(container.firstChild?.nodeName).toBe("DIV");
  });

  it("renders a viewport, light and dark panels", () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" />);
    expect(
      container.querySelector("[data-slot='code-block-viewport']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='code-block-light']")
    ).toBeInTheDocument();
    expect(
      container.querySelector("[data-slot='code-block-dark']")
    ).toBeInTheDocument();
  });

  it("highlights the code and injects shiki html into both panels", async () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" />);
    await waitFor(() => {
      const light = container.querySelector("[data-slot='code-block-light']");
      expect(light?.innerHTML).toContain('data-theme="one-light"');
    });
    const dark = container.querySelector("[data-slot='code-block-dark']");
    expect(dark?.innerHTML).toContain('data-theme="one-dark-pro"');
  });

  it("passes showLineNumbers through to the highlighter", async () => {
    const { container } = render(
      <CodeBlock code={SAMPLE} language="ts" showLineNumbers />
    );
    await waitFor(() => {
      const light = container.querySelector("[data-slot='code-block-light']");
      expect(light?.innerHTML).toContain('data-lines="true"');
    });
  });

  it("defaults showLineNumbers to false", async () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" />);
    await waitFor(() => {
      const light = container.querySelector("[data-slot='code-block-light']");
      expect(light?.innerHTML).toContain('data-lines="false"');
    });
  });
});

// ---------------------------------------------------------------------------
// 3. CodeBlock — DNA classes (tokens, edge, no hard border)
// ---------------------------------------------------------------------------

describe("CodeBlock — design tokens", () => {
  it("uses the inset edge hairline, not a hard border", () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("edge");
    expect(cls).not.toContain("border-border");
  });

  it("uses card surface tokens", () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("bg-card");
    expect(cls).toContain("text-card-foreground");
  });

  it("uses a radius from the scale (rounded-2xl) and clips overflow", () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("rounded-2xl");
    expect(cls).toContain("overflow-hidden");
  });

  it("exposes a group/code-block hook", () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" />);
    expect((container.firstChild as HTMLElement).className).toContain(
      "group/code-block"
    );
  });

  it("never hardcodes a raw color", () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" />);
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).not.toMatch(/#[0-9a-fA-F]{3,6}/);
    expect(cls).not.toMatch(/\b(rgb|hsl)\(/);
  });

  it("renders code as mono and uses scrollbar-thin panels", () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" />);
    const light = container.querySelector(
      "[data-slot='code-block-light']"
    ) as HTMLElement;
    expect(light.className).toContain("[&_code]:font-mono");
    expect(light.className).toContain("scrollbar-thin");
  });
});

// ---------------------------------------------------------------------------
// 4. CodeBlock — className + HTML attribute passthrough
// ---------------------------------------------------------------------------

describe("CodeBlock — passthrough", () => {
  it("merges a custom className without dropping base classes", () => {
    const { container } = render(
      <CodeBlock className="my-code-class" code={SAMPLE} language="ts" />
    );
    const cls = (container.firstChild as HTMLElement).className;
    expect(cls).toContain("my-code-class");
    expect(cls).toContain("bg-card");
  });

  it("forwards arbitrary HTML attributes (id, data-testid)", () => {
    const { container } = render(
      <CodeBlock
        code={SAMPLE}
        data-testid="cb"
        id="snippet-1"
        language="ts"
      />
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("id", "snippet-1");
    expect(el).toHaveAttribute("data-testid", "cb");
  });
});

// ---------------------------------------------------------------------------
// 5. CodeBlock — actions slot (children)
// ---------------------------------------------------------------------------

describe("CodeBlock — actions slot", () => {
  it("does NOT render the actions slot when there are no children", () => {
    const { container } = render(<CodeBlock code={SAMPLE} language="ts" />);
    expect(
      container.querySelector("[data-slot='code-block-actions']")
    ).not.toBeInTheDocument();
  });

  it("renders the actions slot when children are provided", () => {
    const { container } = render(
      <CodeBlock code={SAMPLE} language="ts">
        <button type="button">copy</button>
      </CodeBlock>
    );
    const actions = container.querySelector(
      "[data-slot='code-block-actions']"
    );
    expect(actions).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "copy" })).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. CodeBlockCopyButton — render + slot
// ---------------------------------------------------------------------------

describe("CodeBlockCopyButton — render", () => {
  it("renders a button", () => {
    render(
      <CodeBlock code={SAMPLE} language="ts">
        <CodeBlockCopyButton />
      </CodeBlock>
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("has data-slot='code-block-copy-button'", () => {
    const { container } = render(
      <CodeBlock code={SAMPLE} language="ts">
        <CodeBlockCopyButton />
      </CodeBlock>
    );
    expect(
      container.querySelector("[data-slot='code-block-copy-button']")
    ).toBeInTheDocument();
  });

  it("renders the copy icon by default", () => {
    const { container } = render(
      <CodeBlock code={SAMPLE} language="ts">
        <CodeBlockCopyButton />
      </CodeBlock>
    );
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders custom children instead of the icon", () => {
    render(
      <CodeBlock code={SAMPLE} language="ts">
        <CodeBlockCopyButton>Copy code</CodeBlockCopyButton>
      </CodeBlock>
    );
    expect(screen.getByText("Copy code")).toBeInTheDocument();
  });

  it("merges a custom className while keeping shrink-0", () => {
    const { container } = render(
      <CodeBlock code={SAMPLE} language="ts">
        <CodeBlockCopyButton className="custom-copy" />
      </CodeBlock>
    );
    const btn = container.querySelector(
      "[data-slot='code-block-copy-button']"
    ) as HTMLElement;
    expect(btn.className).toContain("custom-copy");
    expect(btn.className).toContain("shrink-0");
  });

  it("forwards extra props to the underlying Button", () => {
    render(
      <CodeBlock code={SAMPLE} language="ts">
        <CodeBlockCopyButton aria-label="Copy snippet" />
      </CodeBlock>
    );
    expect(
      screen.getByRole("button", { name: "Copy snippet" })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 7. CodeBlockCopyButton — copy interaction
// ---------------------------------------------------------------------------

describe("CodeBlockCopyButton — copy behavior", () => {
  // Real timers throughout: the copy handler is async (clipboard promise) and the
  // mocked shiki highlighter resolves on the microtask queue inside useEffect.
  // Fake timers stall those, so we use real timers + small real timeouts + waitFor.
  const originalClipboard = navigator.clipboard;

  afterEach(() => {
    setClipboard(originalClipboard);
    vi.restoreAllMocks();
  });

  function setClipboard(value: unknown) {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      writable: true,
      value,
    });
  }

  function renderWithClipboard(writeText: ReturnType<typeof vi.fn>) {
    setClipboard({ writeText });
  }

  it("writes the code to the clipboard on click", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    renderWithClipboard(writeText);

    render(
      <CodeBlock code="hello world" language="ts">
        <CodeBlockCopyButton />
      </CodeBlock>
    );
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() =>
      expect(writeText).toHaveBeenCalledWith("hello world")
    );
  });

  it("calls onCopy after a successful copy", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    renderWithClipboard(writeText);
    const onCopy = vi.fn();

    render(
      <CodeBlock code={SAMPLE} language="ts">
        <CodeBlockCopyButton onCopy={onCopy} />
      </CodeBlock>
    );
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(onCopy).toHaveBeenCalledTimes(1));
  });

  it("swaps to the check icon, then reverts after the timeout", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    renderWithClipboard(writeText);

    const { container } = render(
      <CodeBlock code={SAMPLE} language="ts">
        <CodeBlockCopyButton timeout={20} />
      </CodeBlock>
    );
    const iconBefore = container.querySelector("svg")?.outerHTML;
    fireEvent.click(screen.getByRole("button"));

    // success icon differs from the copy icon
    await waitFor(() =>
      expect(container.querySelector("svg")?.outerHTML).not.toBe(iconBefore)
    );

    // after the timeout it reverts to the copy icon
    await waitFor(() =>
      expect(container.querySelector("svg")?.outerHTML).toBe(iconBefore)
    );
  });

  it("defaults the reset timeout to 2000ms when none is given", async () => {
    const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout");
    const writeText = vi.fn().mockResolvedValue(undefined);
    renderWithClipboard(writeText);

    render(
      <CodeBlock code={SAMPLE} language="ts">
        <CodeBlockCopyButton />
      </CodeBlock>
    );
    fireEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(writeText).toHaveBeenCalled());
    // the reset timer is scheduled for the default 2000ms
    await waitFor(() =>
      expect(
        setTimeoutSpy.mock.calls.some(([, delay]) => delay === 2000)
      ).toBe(true)
    );
  });

  it("calls onError when the clipboard API is unavailable", async () => {
    setClipboard(undefined);
    const onError = vi.fn();

    render(
      <CodeBlock code={SAMPLE} language="ts">
        <CodeBlockCopyButton onError={onError} />
      </CodeBlock>
    );
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0][0].message).toBe("Clipboard API not available");
  });

  it("does NOT throw when clipboard is unavailable and no onError is given", async () => {
    setClipboard(undefined);

    render(
      <CodeBlock code={SAMPLE} language="ts">
        <CodeBlockCopyButton />
      </CodeBlock>
    );
    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
  });

  it("treats a clipboard without writeText as unavailable", async () => {
    setClipboard({});
    const onError = vi.fn();

    render(
      <CodeBlock code={SAMPLE} language="ts">
        <CodeBlockCopyButton onError={onError} />
      </CodeBlock>
    );
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(onError).toHaveBeenCalledTimes(1));
    expect(onError.mock.calls[0][0].message).toBe("Clipboard API not available");
  });

  it("calls onError when writeText rejects", async () => {
    const boom = new Error("denied");
    const writeText = vi.fn().mockRejectedValue(boom);
    renderWithClipboard(writeText);
    const onError = vi.fn();
    const onCopy = vi.fn();

    render(
      <CodeBlock code={SAMPLE} language="ts">
        <CodeBlockCopyButton onCopy={onCopy} onError={onError} />
      </CodeBlock>
    );
    fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(onError).toHaveBeenCalledWith(boom));
    expect(onCopy).not.toHaveBeenCalled();
  });

  it("does NOT throw when writeText rejects and no onError is given", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    renderWithClipboard(writeText);

    render(
      <CodeBlock code={SAMPLE} language="ts">
        <CodeBlockCopyButton />
      </CodeBlock>
    );
    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
    await waitFor(() => expect(writeText).toHaveBeenCalled());
  });
});

// ---------------------------------------------------------------------------
// 8. Accessibility — axe
// ---------------------------------------------------------------------------

describe("CodeBlock — accessibility (axe)", () => {
  it("a bare code block has no axe violations", async () => {
    const { container } = render(
      <main>
        <CodeBlock code={SAMPLE} language="ts" />
      </main>
    );
    await waitFor(() => {
      expect(
        container.querySelector("[data-slot='code-block-light']")?.innerHTML
      ).not.toBe("");
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("a code block with a labelled copy button has no axe violations", async () => {
    const { container } = render(
      <main>
        <CodeBlock code={SAMPLE} language="ts" showLineNumbers>
          <CodeBlockCopyButton aria-label="Copy code to clipboard" />
        </CodeBlock>
      </main>
    );
    await waitFor(() => {
      expect(
        container.querySelector("[data-slot='code-block-light']")?.innerHTML
      ).not.toBe("");
    });
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// 9. Re-render / prop updates
// ---------------------------------------------------------------------------

describe("CodeBlock — re-render", () => {
  it("re-highlights when the code prop changes", async () => {
    const { container, rerender } = render(
      <CodeBlock code="const a = 1;" language="ts" />
    );
    await waitFor(() => {
      expect(
        container.querySelector("[data-slot='code-block-light']")?.innerHTML
      ).toContain("const a = 1;");
    });

    rerender(<CodeBlock code="const b = 2;" language="ts" />);
    await waitFor(() => {
      expect(
        container.querySelector("[data-slot='code-block-light']")?.innerHTML
      ).toContain("const b = 2;");
    });
  });
});
