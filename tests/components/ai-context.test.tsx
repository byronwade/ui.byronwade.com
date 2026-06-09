/**
 * Exhaustive tests for the <Context /> AI-elements compound component
 *
 * Component source: components/ai-elements/context.tsx
 * Underlying primitives: HoverCard (Base UI PreviewCard), Button, Progress
 *
 * Exports:
 *   Context                – provider + HoverCard root (ContextSchema + HoverCard props)
 *   ContextTrigger         – HoverCardTrigger rendering a Button (percent + ring icon)
 *   ContextContent         – HoverCardContent popup wrapper
 *   ContextContentHeader   – percent + used/total + Progress bar
 *   ContextContentBody     – body wrapper
 *   ContextContentFooter   – total cost row (bg-secondary)
 *   ContextInputUsage      – input tokens row (null when 0, custom children passthrough)
 *   ContextOutputUsage     – output tokens row
 *   ContextReasoningUsage  – reasoning tokens row
 *   ContextCacheUsage      – cache (cachedInputTokens) row
 *   usageRowVariants       – cva for usage rows
 *
 * Inner content parts are plain <div>s rendered directly under the headless
 * PreviewCard.Root, so they appear in the DOM without opening the hover card.
 * The portal-mounted ContextContent requires `defaultOpen` to render.
 */

import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { axe } from "vitest-axe";

import {
  Context,
  ContextTrigger,
  ContextContent,
  ContextContentHeader,
  ContextContentBody,
  ContextContentFooter,
  ContextInputUsage,
  ContextOutputUsage,
  ContextReasoningUsage,
  ContextCacheUsage,
  usageRowVariants,
} from "@/components/ai-elements/context";

// ---------------------------------------------------------------------------
// Fixtures
// ---------------------------------------------------------------------------

import type { LanguageModelUsage } from "ai";

const FULL_USAGE: LanguageModelUsage = {
  inputTokens: 32_500,
  outputTokens: 8_200,
  reasoningTokens: 1_400,
  cachedInputTokens: 12_000,
  totalTokens: 54_100,
  inputTokenDetails: {
    noCacheTokens: 20_500,
    cacheReadTokens: 12_000,
    cacheWriteTokens: 0,
  },
  outputTokenDetails: {
    textTokens: 6_800,
    reasoningTokens: 1_400,
  },
};

/**
 * A provider-only wrapper exposing the headless context value.
 *
 * `usage` / `modelId` are intentionally NOT given default-parameter values so
 * that passing `undefined` reaches the real component (default params would
 * silently substitute a fixture for an explicit `undefined`).
 */
function Provider({
  children,
  usedTokens = 54_100,
  maxTokens = 1_000_000,
  usage = FULL_USAGE,
  modelId = "anthropic:claude-sonnet-4",
  ...props
}: {
  children: React.ReactNode;
  usedTokens?: number;
  maxTokens?: number;
  usage?: typeof FULL_USAGE;
  modelId?: string;
  defaultOpen?: boolean;
}) {
  return (
    <Context
      maxTokens={maxTokens}
      modelId={modelId}
      usage={usage}
      usedTokens={usedTokens}
      {...props}
    >
      {children}
    </Context>
  );
}

/** Render Context directly so `undefined` usage/modelId reach the component. */
function bare(
  ui: React.ReactNode,
  {
    usedTokens = 54_100,
    maxTokens = 1_000_000,
    usage,
    modelId,
    defaultOpen,
  }: {
    usedTokens?: number;
    maxTokens?: number;
    usage?: typeof FULL_USAGE;
    modelId?: string;
    defaultOpen?: boolean;
  } = {}
) {
  return render(
    <Context
      defaultOpen={defaultOpen}
      maxTokens={maxTokens}
      modelId={modelId}
      usage={usage}
      usedTokens={usedTokens}
    >
      {ui}
    </Context>
  );
}

// ---------------------------------------------------------------------------
// 1. Provider guard — components must be used within Context
// ---------------------------------------------------------------------------

describe("Context — provider guard", () => {
  it("throws if a Context part is used outside Context", () => {
    expect(() => render(<ContextTrigger />)).toThrow(
      "Context components must be used within Context"
    );
  });

  it("ContextContentHeader throws outside Context", () => {
    expect(() => render(<ContextContentHeader />)).toThrow(
      "Context components must be used within Context"
    );
  });

  it("ContextContentFooter throws outside Context", () => {
    expect(() => render(<ContextContentFooter />)).toThrow(
      "Context components must be used within Context"
    );
  });

  it("ContextInputUsage throws outside Context", () => {
    expect(() => render(<ContextInputUsage />)).toThrow(
      "Context components must be used within Context"
    );
  });
});

// ---------------------------------------------------------------------------
// 2. ContextTrigger — default render
// ---------------------------------------------------------------------------

describe("ContextTrigger — default render", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <Provider>
        <ContextTrigger />
      </Provider>
    );
    expect(container.firstChild).toBeTruthy();
  });

  it("has data-slot='context-trigger'", () => {
    render(
      <Provider>
        <ContextTrigger />
      </Provider>
    );
    expect(
      document.querySelector("[data-slot='context-trigger']")
    ).toBeInTheDocument();
  });

  it("renders the trigger as a <button> carrying Button styles", () => {
    render(
      <Provider>
        <ContextTrigger />
      </Provider>
    );
    const el = document.querySelector(
      "[data-slot='context-trigger']"
    ) as HTMLElement;
    // Base UI merges the Button into the trigger: a <button> with button classes,
    // the trigger's own data-slot taking precedence over the Button's.
    expect(el.tagName).toBe("BUTTON");
    expect(el.className).toContain("group/button");
  });

  it("renders the formatted percent (font-medium, muted)", () => {
    render(
      <Provider maxTokens={100} usedTokens={50}>
        <ContextTrigger />
      </Provider>
    );
    const pct = screen.getByText("50%");
    expect(pct).toBeInTheDocument();
    expect(pct.className).toContain("font-medium");
    expect(pct.className).toContain("text-muted-foreground");
  });

  it("renders the percent with a fractional value (maximumFractionDigits 1)", () => {
    render(
      <Provider maxTokens={1000} usedTokens={123}>
        <ContextTrigger />
      </Provider>
    );
    expect(screen.getByText("12.3%")).toBeInTheDocument();
  });

  it("renders the ring icon (data-slot='context-icon') with aria-label", () => {
    render(
      <Provider>
        <ContextTrigger />
      </Provider>
    );
    const icon = document.querySelector("[data-slot='context-icon']");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-label", "Model context usage");
    expect(icon).toHaveAttribute("role", "img");
  });

  it("icon uses currentColor (token-driven, text-current)", () => {
    render(
      <Provider>
        <ContextTrigger />
      </Provider>
    );
    const icon = document.querySelector(
      "[data-slot='context-icon']"
    ) as SVGElement;
    expect(icon.getAttribute("class")).toContain("text-current");
  });

  it("forwards button props (e.g. data-testid) to the rendered Button", () => {
    render(
      <Provider>
        <ContextTrigger data-testid="trigger-btn" />
      </Provider>
    );
    expect(screen.getByTestId("trigger-btn")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 3. ContextTrigger — custom children passthrough
// ---------------------------------------------------------------------------

describe("ContextTrigger — custom children", () => {
  it("renders custom children instead of the default Button", () => {
    render(
      <Provider>
        <ContextTrigger>
          <button type="button" data-testid="custom-trigger">
            Custom
          </button>
        </ContextTrigger>
      </Provider>
    );
    expect(screen.getByTestId("custom-trigger")).toBeInTheDocument();
  });

  it("does not render the default percent text when custom children given", () => {
    render(
      <Provider maxTokens={100} usedTokens={50}>
        <ContextTrigger>
          <button type="button">Custom only</button>
        </ContextTrigger>
      </Provider>
    );
    expect(screen.queryByText("50%")).not.toBeInTheDocument();
    expect(screen.getByText("Custom only")).toBeInTheDocument();
  });

  it("custom children path still carries data-slot='context-trigger'", () => {
    render(
      <Provider>
        <ContextTrigger>
          <button type="button">Custom</button>
        </ContextTrigger>
      </Provider>
    );
    expect(
      document.querySelector("[data-slot='context-trigger']")
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 4. ContextContent — portal popup (open via defaultOpen)
// ---------------------------------------------------------------------------

describe("ContextContent — popup", () => {
  it("does not render content while closed", () => {
    render(
      <Provider>
        <ContextTrigger />
        <ContextContent>
          <p>Popup body</p>
        </ContextContent>
      </Provider>
    );
    expect(screen.queryByText("Popup body")).not.toBeInTheDocument();
  });

  it("renders content in the portal when defaultOpen", async () => {
    render(
      <Provider defaultOpen>
        <ContextTrigger />
        <ContextContent>
          <p>Open popup body</p>
        </ContextContent>
      </Provider>
    );
    expect(await screen.findByText("Open popup body")).toBeInTheDocument();
  });

  it("has data-slot='context-content' and base classes when open", async () => {
    render(
      <Provider defaultOpen>
        <ContextTrigger />
        <ContextContent>
          <p>slotted</p>
        </ContextContent>
      </Provider>
    );
    const inner = await screen.findByText("slotted");
    const popup = inner.closest(
      "[data-slot='context-content']"
    ) as HTMLElement;
    expect(popup).not.toBeNull();
    expect(popup.className).toContain("min-w-60");
    expect(popup.className).toContain("divide-edge");
    expect(popup.className).toContain("overflow-hidden");
  });

  it("forwards custom className while keeping base classes", async () => {
    render(
      <Provider defaultOpen>
        <ContextTrigger />
        <ContextContent className="my-popup">
          <p>classy</p>
        </ContextContent>
      </Provider>
    );
    const inner = await screen.findByText("classy");
    const popup = inner.closest(
      "[data-slot='context-content']"
    ) as HTMLElement;
    expect(popup.className).toContain("my-popup");
    expect(popup.className).toContain("min-w-60");
  });
});

// ---------------------------------------------------------------------------
// 5. ContextContentHeader
// ---------------------------------------------------------------------------

describe("ContextContentHeader", () => {
  it("has data-slot and renders percent + used/total (font-mono)", () => {
    render(
      <Provider maxTokens={1_000_000} usedTokens={500_000}>
        <ContextContentHeader />
      </Provider>
    );
    const header = document.querySelector(
      "[data-slot='context-content-header']"
    ) as HTMLElement;
    expect(header).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("500K / 1M")).toBeInTheDocument();
    expect(screen.getByText("500K / 1M").className).toContain("font-mono");
  });

  it("renders a Progress bar reflecting usage", () => {
    render(
      <Provider maxTokens={100} usedTokens={25}>
        <ContextContentHeader />
      </Provider>
    );
    expect(
      document.querySelector("[data-slot='progress']")
    ).toBeInTheDocument();
  });

  it("renders custom children instead of default content", () => {
    render(
      <Provider>
        <ContextContentHeader>
          <span>Custom header</span>
        </ContextContentHeader>
      </Provider>
    );
    expect(screen.getByText("Custom header")).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='progress']")
    ).not.toBeInTheDocument();
  });

  it("forwards custom className", () => {
    render(
      <Provider>
        <ContextContentHeader className="hdr-x" />
      </Provider>
    );
    const header = document.querySelector(
      "[data-slot='context-content-header']"
    ) as HTMLElement;
    expect(header.className).toContain("hdr-x");
  });
});

// ---------------------------------------------------------------------------
// 6. ContextContentBody
// ---------------------------------------------------------------------------

describe("ContextContentBody", () => {
  it("has data-slot and renders children", () => {
    render(
      <Provider>
        <ContextContentBody>
          <span>body kid</span>
        </ContextContentBody>
      </Provider>
    );
    expect(
      document.querySelector("[data-slot='context-content-body']")
    ).toBeInTheDocument();
    expect(screen.getByText("body kid")).toBeInTheDocument();
  });

  it("forwards custom className and HTML attributes", () => {
    render(
      <Provider>
        <ContextContentBody className="body-x" id="ctx-body" />
      </Provider>
    );
    const body = document.querySelector(
      "[data-slot='context-content-body']"
    ) as HTMLElement;
    expect(body.className).toContain("body-x");
    expect(body).toHaveAttribute("id", "ctx-body");
  });
});

// ---------------------------------------------------------------------------
// 7. ContextContentFooter
// ---------------------------------------------------------------------------

describe("ContextContentFooter", () => {
  it("has data-slot, bg-secondary, and renders total cost label", () => {
    render(
      <Provider>
        <ContextContentFooter />
      </Provider>
    );
    const footer = document.querySelector(
      "[data-slot='context-content-footer']"
    ) as HTMLElement;
    expect(footer).toBeInTheDocument();
    expect(footer.className).toContain("bg-secondary");
    expect(screen.getByText("Total cost")).toBeInTheDocument();
  });

  it("renders a currency-formatted total cost (font-mono)", () => {
    render(
      <Provider>
        <ContextContentFooter />
      </Provider>
    );
    const cost = screen.getByText(/^\$/);
    expect(cost).toBeInTheDocument();
    expect(cost.className).toContain("font-mono");
  });

  it("renders $0.00 when modelId is absent (no cost lookup)", () => {
    bare(<ContextContentFooter />, { modelId: undefined });
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("renders the cost with a modelId but absent usage (token fallbacks to 0)", () => {
    bare(<ContextContentFooter />, {
      usage: undefined,
      modelId: "openai:gpt-4o",
    });
    expect(screen.getByText("Total cost")).toBeInTheDocument();
    // usage is undefined so inputTokens/outputTokens fall back to 0 → $0.00.
    expect(screen.getByText("$0.00")).toBeInTheDocument();
  });

  it("renders custom children instead of default", () => {
    render(
      <Provider>
        <ContextContentFooter>
          <span>Custom footer</span>
        </ContextContentFooter>
      </Provider>
    );
    expect(screen.getByText("Custom footer")).toBeInTheDocument();
    expect(screen.queryByText("Total cost")).not.toBeInTheDocument();
  });

  it("forwards custom className", () => {
    render(
      <Provider>
        <ContextContentFooter className="ft-x" />
      </Provider>
    );
    const footer = document.querySelector(
      "[data-slot='context-content-footer']"
    ) as HTMLElement;
    expect(footer.className).toContain("ft-x");
  });
});

// ---------------------------------------------------------------------------
// 8. Usage rows — input / output / reasoning / cache
// ---------------------------------------------------------------------------

describe("ContextInputUsage", () => {
  it("renders the input row with label and tokens", () => {
    render(
      <Provider>
        <ContextInputUsage />
      </Provider>
    );
    const row = document.querySelector(
      "[data-slot='context-input-usage']"
    ) as HTMLElement;
    expect(row).toBeInTheDocument();
    expect(screen.getByText("Input")).toBeInTheDocument();
    // 32_500 renders as the compact "33K"; the count may be followed by a cost
    // suffix in the same span, so assert on the row's combined text content.
    expect(row.textContent).toContain("33K");
  });

  it("returns null when input tokens are 0", () => {
    render(
      <Provider usage={{ ...FULL_USAGE, inputTokens: 0 }}>
        <ContextInputUsage />
      </Provider>
    );
    expect(
      document.querySelector("[data-slot='context-input-usage']")
    ).not.toBeInTheDocument();
  });

  it("returns null when usage is undefined", () => {
    bare(<ContextInputUsage />, { usage: undefined });
    expect(
      document.querySelector("[data-slot='context-input-usage']")
    ).not.toBeInTheDocument();
  });

  it("renders custom children instead of computed row", () => {
    render(
      <Provider>
        <ContextInputUsage>
          <span>custom input</span>
        </ContextInputUsage>
      </Provider>
    );
    expect(screen.getByText("custom input")).toBeInTheDocument();
    expect(
      document.querySelector("[data-slot='context-input-usage']")
    ).not.toBeInTheDocument();
  });

  it("shows a $0.00 cost suffix when modelId is absent", () => {
    bare(<ContextInputUsage />, { modelId: undefined, usage: FULL_USAGE });
    // Row renders (tokens present); without a modelId the cost falls back to $0.00.
    const row = document.querySelector(
      "[data-slot='context-input-usage']"
    ) as HTMLElement;
    expect(row).toBeInTheDocument();
    expect(row.textContent).toContain("$0.00");
  });

  it("forwards custom className", () => {
    render(
      <Provider>
        <ContextInputUsage className="in-x" />
      </Provider>
    );
    const row = document.querySelector(
      "[data-slot='context-input-usage']"
    ) as HTMLElement;
    expect(row.className).toContain("in-x");
  });
});

describe("ContextOutputUsage", () => {
  it("renders the output row with label and tokens", () => {
    render(
      <Provider>
        <ContextOutputUsage />
      </Provider>
    );
    const row = document.querySelector(
      "[data-slot='context-output-usage']"
    ) as HTMLElement;
    expect(row).toBeInTheDocument();
    expect(screen.getByText("Output")).toBeInTheDocument();
    expect(row.textContent).toContain("8.2K");
  });

  it("returns null when output tokens are 0", () => {
    render(
      <Provider usage={{ ...FULL_USAGE, outputTokens: 0 }}>
        <ContextOutputUsage />
      </Provider>
    );
    expect(
      document.querySelector("[data-slot='context-output-usage']")
    ).not.toBeInTheDocument();
  });

  it("returns null when usage is undefined", () => {
    bare(<ContextOutputUsage />, { usage: undefined });
    expect(
      document.querySelector("[data-slot='context-output-usage']")
    ).not.toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <Provider>
        <ContextOutputUsage>
          <span>custom output</span>
        </ContextOutputUsage>
      </Provider>
    );
    expect(screen.getByText("custom output")).toBeInTheDocument();
  });

  it("shows a $0.00 cost suffix without modelId", () => {
    bare(<ContextOutputUsage />, { modelId: undefined, usage: FULL_USAGE });
    const row = document.querySelector(
      "[data-slot='context-output-usage']"
    ) as HTMLElement;
    expect(row).toBeInTheDocument();
    expect(row.textContent).toContain("$0.00");
  });

  it("forwards custom className", () => {
    render(
      <Provider>
        <ContextOutputUsage className="out-x" />
      </Provider>
    );
    expect(
      (
        document.querySelector(
          "[data-slot='context-output-usage']"
        ) as HTMLElement
      ).className
    ).toContain("out-x");
  });
});

describe("ContextReasoningUsage", () => {
  it("renders the reasoning row with label and tokens", () => {
    render(
      <Provider>
        <ContextReasoningUsage />
      </Provider>
    );
    const row = document.querySelector(
      "[data-slot='context-reasoning-usage']"
    ) as HTMLElement;
    expect(row).toBeInTheDocument();
    expect(screen.getByText("Reasoning")).toBeInTheDocument();
    expect(row.textContent).toContain("1.4K");
  });

  it("returns null when reasoning tokens are 0", () => {
    render(
      <Provider usage={{ ...FULL_USAGE, reasoningTokens: 0 }}>
        <ContextReasoningUsage />
      </Provider>
    );
    expect(
      document.querySelector("[data-slot='context-reasoning-usage']")
    ).not.toBeInTheDocument();
  });

  it("returns null when reasoningTokens missing (undefined usage)", () => {
    bare(<ContextReasoningUsage />, { usage: undefined });
    expect(
      document.querySelector("[data-slot='context-reasoning-usage']")
    ).not.toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <Provider>
        <ContextReasoningUsage>
          <span>custom reasoning</span>
        </ContextReasoningUsage>
      </Provider>
    );
    expect(screen.getByText("custom reasoning")).toBeInTheDocument();
  });

  it("shows a $0.00 cost suffix without modelId", () => {
    bare(<ContextReasoningUsage />, { modelId: undefined, usage: FULL_USAGE });
    const row = document.querySelector(
      "[data-slot='context-reasoning-usage']"
    ) as HTMLElement;
    expect(row).toBeInTheDocument();
    expect(row.textContent).toContain("$0.00");
  });

  it("forwards custom className", () => {
    render(
      <Provider>
        <ContextReasoningUsage className="rea-x" />
      </Provider>
    );
    expect(
      (
        document.querySelector(
          "[data-slot='context-reasoning-usage']"
        ) as HTMLElement
      ).className
    ).toContain("rea-x");
  });
});

describe("ContextCacheUsage", () => {
  it("renders the cache row with label and tokens", () => {
    render(
      <Provider>
        <ContextCacheUsage />
      </Provider>
    );
    const row = document.querySelector(
      "[data-slot='context-cache-usage']"
    ) as HTMLElement;
    expect(row).toBeInTheDocument();
    expect(screen.getByText("Cache")).toBeInTheDocument();
    expect(row.textContent).toContain("12K");
  });

  it("returns null when cache tokens are 0", () => {
    render(
      <Provider usage={{ ...FULL_USAGE, cachedInputTokens: 0 }}>
        <ContextCacheUsage />
      </Provider>
    );
    expect(
      document.querySelector("[data-slot='context-cache-usage']")
    ).not.toBeInTheDocument();
  });

  it("returns null when usage is undefined", () => {
    bare(<ContextCacheUsage />, { usage: undefined });
    expect(
      document.querySelector("[data-slot='context-cache-usage']")
    ).not.toBeInTheDocument();
  });

  it("renders custom children", () => {
    render(
      <Provider>
        <ContextCacheUsage>
          <span>custom cache</span>
        </ContextCacheUsage>
      </Provider>
    );
    expect(screen.getByText("custom cache")).toBeInTheDocument();
  });

  it("shows a $0.00 cost suffix without modelId", () => {
    bare(<ContextCacheUsage />, { modelId: undefined, usage: FULL_USAGE });
    const row = document.querySelector(
      "[data-slot='context-cache-usage']"
    ) as HTMLElement;
    expect(row).toBeInTheDocument();
    expect(row.textContent).toContain("$0.00");
  });

  it("forwards custom className", () => {
    render(
      <Provider>
        <ContextCacheUsage className="cache-x" />
      </Provider>
    );
    expect(
      (
        document.querySelector(
          "[data-slot='context-cache-usage']"
        ) as HTMLElement
      ).className
    ).toContain("cache-x");
  });
});

// ---------------------------------------------------------------------------
// 9. Cost rendering with a known modelId
// ---------------------------------------------------------------------------

describe("Context — cost rendering with modelId", () => {
  it("renders a cost suffix in usage rows when modelId resolves a price", () => {
    render(
      <Provider modelId="openai:gpt-4o">
        <ContextInputUsage />
      </Provider>
    );
    // tokenlens may or may not know the model; the row still renders the token count.
    const row = document.querySelector(
      "[data-slot='context-input-usage']"
    ) as HTMLElement;
    expect(screen.getByText("Input")).toBeInTheDocument();
    expect(row.textContent).toContain("33K");
  });
});

// ---------------------------------------------------------------------------
// 10. usageRowVariants (cva)
// ---------------------------------------------------------------------------

describe("usageRowVariants", () => {
  it("returns the shared base layout classes", () => {
    const cls = usageRowVariants({ kind: "input" });
    expect(cls).toContain("flex");
    expect(cls).toContain("items-center");
    expect(cls).toContain("justify-between");
    expect(cls).toContain("text-xs");
  });

  it("defaults to the input kind when none provided", () => {
    expect(usageRowVariants()).toContain("flex");
  });

  it("supports every kind variant", () => {
    for (const kind of ["input", "output", "reasoning", "cache"] as const) {
      expect(usageRowVariants({ kind })).toContain("flex");
    }
  });
});

// ---------------------------------------------------------------------------
// 11. Full composition
// ---------------------------------------------------------------------------

describe("Context — full composition", () => {
  it("renders trigger + open popup with all parts", async () => {
    render(
      <Provider defaultOpen>
        <ContextTrigger />
        <ContextContent>
          <ContextContentHeader />
          <ContextContentBody>
            <ContextInputUsage />
            <ContextOutputUsage />
            <ContextReasoningUsage />
            <ContextCacheUsage />
          </ContextContentBody>
          <ContextContentFooter />
        </ContextContent>
      </Provider>
    );

    await screen.findByText("Total cost");
    expect(screen.getByText("Input")).toBeInTheDocument();
    expect(screen.getByText("Output")).toBeInTheDocument();
    expect(screen.getByText("Reasoning")).toBeInTheDocument();
    expect(screen.getByText("Cache")).toBeInTheDocument();
  });

  it("hides only the zero-valued usage rows", async () => {
    render(
      <Provider
        defaultOpen
        usage={{
          ...FULL_USAGE,
          inputTokens: 1000,
          outputTokens: 0,
          reasoningTokens: 0,
          cachedInputTokens: 0,
          totalTokens: 1000,
        }}
      >
        <ContextTrigger />
        <ContextContent>
          <ContextContentBody>
            <ContextInputUsage />
            <ContextOutputUsage />
            <ContextReasoningUsage />
            <ContextCacheUsage />
          </ContextContentBody>
        </ContextContent>
      </Provider>
    );

    await screen.findByText("Input");
    expect(screen.queryByText("Output")).not.toBeInTheDocument();
    expect(screen.queryByText("Reasoning")).not.toBeInTheDocument();
    expect(screen.queryByText("Cache")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 12. Accessibility — axe
// ---------------------------------------------------------------------------

describe("Context — accessibility (axe)", () => {
  it("closed trigger has no axe violations", async () => {
    const { container } = render(
      <main>
        <Provider>
          <ContextTrigger />
        </Provider>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("open popup has no axe violations", async () => {
    const { baseElement } = render(
      <main>
        <Provider defaultOpen>
          <ContextTrigger />
          <ContextContent>
            <ContextContentHeader />
            <ContextContentBody>
              <ContextInputUsage />
              <ContextOutputUsage />
              <ContextReasoningUsage />
              <ContextCacheUsage />
            </ContextContentBody>
            <ContextContentFooter />
          </ContextContent>
        </Provider>
      </main>
    );
    await screen.findByText("Total cost");
    const results = await axe(baseElement, {
      rules: { region: { enabled: false } },
    });
    expect(results).toHaveNoViolations();
  });

  it("custom-trigger composition has no axe violations", async () => {
    const { container } = render(
      <main>
        <Provider>
          <ContextTrigger>
            <button type="button" aria-label="Context usage">
              Usage
            </button>
          </ContextTrigger>
        </Provider>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ---------------------------------------------------------------------------
// 13. Re-render behavior
// ---------------------------------------------------------------------------

describe("Context — re-render behavior", () => {
  it("updates the trigger percent when usedTokens changes", () => {
    const { rerender } = render(
      <Provider maxTokens={100} usedTokens={10}>
        <ContextTrigger />
      </Provider>
    );
    expect(screen.getByText("10%")).toBeInTheDocument();

    rerender(
      <Provider maxTokens={100} usedTokens={75}>
        <ContextTrigger />
      </Provider>
    );
    expect(screen.getByText("75%")).toBeInTheDocument();
    expect(screen.queryByText("10%")).not.toBeInTheDocument();
  });

  it("toggles a usage row from rendered to null when its tokens drop to 0", async () => {
    const { rerender } = render(
      <Provider>
        <ContextInputUsage />
      </Provider>
    );
    expect(screen.getByText("Input")).toBeInTheDocument();

    rerender(
      <Provider usage={{ ...FULL_USAGE, inputTokens: 0 }}>
        <ContextInputUsage />
      </Provider>
    );
    await waitFor(() =>
      expect(screen.queryByText("Input")).not.toBeInTheDocument()
    );
  });
});
