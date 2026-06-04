/**
 * Exhaustive tests for the ai-model-selector compound component
 *
 * Component source: components/ai-elements/model-selector.tsx
 *
 * Exports (all thin wrappers over command + dialog primitives):
 *   ModelSelector          – Dialog root pass-through
 *   ModelSelectorTrigger   – DialogTrigger pass-through
 *   ModelSelectorContent   – DialogContent + Command, optional `title` (default "Model Selector")
 *   ModelSelectorDialog    – CommandDialog pass-through
 *   ModelSelectorInput     – CommandInput, extra h-auto py-3.5
 *   ModelSelectorList      – CommandList pass-through
 *   ModelSelectorEmpty     – CommandEmpty pass-through
 *   ModelSelectorGroup     – CommandGroup pass-through
 *   ModelSelectorItem      – CommandItem pass-through
 *   ModelSelectorShortcut  – CommandShortcut pass-through
 *   ModelSelectorSeparator – CommandSeparator pass-through
 *   ModelSelectorLogo      – <img>, data-slot="model-selector-logo"
 *   ModelSelectorLogoGroup – <div>, data-slot="model-selector-logo-group"
 *   ModelSelectorName      – <span>, data-slot="model-selector-name"
 *
 * Notes:
 *   - Dialog content is portaled to document.body and only mounts when open,
 *     so open-dependent tests render with `defaultOpen` and query the document.
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, afterAll, describe, it, expect, vi } from "vitest";
import { axe } from "vitest-axe";

beforeAll(() => {
  class ResizeObserverStub {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  vi.stubGlobal("ResizeObserver", ResizeObserverStub);
  Element.prototype.scrollIntoView = vi.fn();
});

afterAll(() => {
  vi.unstubAllGlobals();
});
import { Command } from "@/components/ui/command";
import {
  ModelSelector,
  ModelSelectorTrigger,
  ModelSelectorContent,
  ModelSelectorDialog,
  ModelSelectorInput,
  ModelSelectorList,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorItem,
  ModelSelectorShortcut,
  ModelSelectorSeparator,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
} from "@/components/ai-elements/model-selector";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Render a fully-populated, open selector. Content is portaled to body. */
function renderOpenSelector(
  contentProps: React.ComponentProps<typeof ModelSelectorContent> = {}
) {
  return render(
    <ModelSelector defaultOpen>
      <ModelSelectorTrigger>Open</ModelSelectorTrigger>
      <ModelSelectorContent {...contentProps}>
        <ModelSelectorInput placeholder="Search models" />
        <ModelSelectorList>
          <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
          <ModelSelectorGroup heading="Frontier">
            <ModelSelectorItem value="Claude Opus">
              <ModelSelectorLogo provider="anthropic" />
              <ModelSelectorName>Claude Opus</ModelSelectorName>
              <ModelSelectorShortcut>⌘1</ModelSelectorShortcut>
            </ModelSelectorItem>
          </ModelSelectorGroup>
          <ModelSelectorSeparator />
          <ModelSelectorGroup heading="Fast">
            <ModelSelectorItem value="Haiku">
              <ModelSelectorName>Haiku</ModelSelectorName>
            </ModelSelectorItem>
          </ModelSelectorGroup>
        </ModelSelectorList>
      </ModelSelectorContent>
    </ModelSelector>
  );
}

// ---------------------------------------------------------------------------
// 1. Renders without crashing
// ---------------------------------------------------------------------------

describe("ModelSelector — renders without crashing", () => {
  it("renders a closed selector (trigger only) without crashing", () => {
    expect(() =>
      render(
        <ModelSelector>
          <ModelSelectorTrigger>Open</ModelSelectorTrigger>
        </ModelSelector>
      )
    ).not.toThrow();
  });

  it("renders the trigger text", () => {
    render(
      <ModelSelector>
        <ModelSelectorTrigger>Pick a model</ModelSelectorTrigger>
      </ModelSelector>
    );
    expect(screen.getByText("Pick a model")).toBeInTheDocument();
  });

  it("renders a fully-composed open selector without crashing", () => {
    expect(() => renderOpenSelector()).not.toThrow();
  });

  it("mounts dialog content when open", () => {
    renderOpenSelector();
    expect(screen.getByText("Claude Opus")).toBeInTheDocument();
  });

  it("does not mount dialog content when closed", () => {
    render(
      <ModelSelector>
        <ModelSelectorTrigger>Open</ModelSelectorTrigger>
        <ModelSelectorContent>
          <ModelSelectorList>
            <ModelSelectorItem value="Hidden">Hidden model</ModelSelectorItem>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    expect(screen.queryByText("Hidden model")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 2. Trigger behavior
// ---------------------------------------------------------------------------

describe("ModelSelectorTrigger", () => {
  it("has data-slot='dialog-trigger'", () => {
    render(
      <ModelSelector>
        <ModelSelectorTrigger>Open</ModelSelectorTrigger>
      </ModelSelector>
    );
    expect(screen.getByText("Open")).toHaveAttribute(
      "data-slot",
      "dialog-trigger"
    );
  });

  it("opens the dialog on click", async () => {
    const user = userEvent.setup();
    render(
      <ModelSelector>
        <ModelSelectorTrigger>Open</ModelSelectorTrigger>
        <ModelSelectorContent>
          <ModelSelectorList>
            <ModelSelectorItem value="Revealed">Revealed model</ModelSelectorItem>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    expect(screen.queryByText("Revealed model")).not.toBeInTheDocument();
    await user.click(screen.getByText("Open"));
    expect(screen.getByText("Revealed model")).toBeInTheDocument();
  });

  it("forwards custom className", () => {
    render(
      <ModelSelector>
        <ModelSelectorTrigger className="custom-trigger">Open</ModelSelectorTrigger>
      </ModelSelector>
    );
    expect(screen.getByText("Open").className).toContain("custom-trigger");
  });
});

// ---------------------------------------------------------------------------
// 3. ModelSelectorContent — title default & override, Command wrapper
// ---------------------------------------------------------------------------

describe("ModelSelectorContent", () => {
  it("renders the default sr-only title 'Model Selector'", () => {
    renderOpenSelector();
    const title = screen.getByText("Model Selector");
    expect(title).toBeInTheDocument();
    expect(title.className).toContain("sr-only");
  });

  it("renders a custom title when provided", () => {
    renderOpenSelector({ title: "Choose a model" });
    expect(screen.getByText("Choose a model")).toBeInTheDocument();
    expect(screen.queryByText("Model Selector")).not.toBeInTheDocument();
  });

  it("wraps content in a Command (data-slot='command')", () => {
    renderOpenSelector();
    expect(
      document.body.querySelector("[data-slot='command']")
    ).toBeInTheDocument();
  });

  it("the dialog content carries the p-0 base class", () => {
    renderOpenSelector();
    const content = document.body.querySelector(
      "[data-slot='dialog-content']"
    ) as HTMLElement;
    expect(content.className).toContain("p-0");
  });

  it("forwards custom className onto the dialog content", () => {
    renderOpenSelector({ className: "custom-content" });
    const content = document.body.querySelector(
      "[data-slot='dialog-content']"
    ) as HTMLElement;
    expect(content.className).toContain("custom-content");
    expect(content.className).toContain("p-0");
  });

  it("the title is associated to the dialog (data-slot='dialog-title')", () => {
    renderOpenSelector();
    expect(screen.getByText("Model Selector")).toHaveAttribute(
      "data-slot",
      "dialog-title"
    );
  });
});

// ---------------------------------------------------------------------------
// 4. ModelSelectorDialog — CommandDialog pass-through
// ---------------------------------------------------------------------------

describe("ModelSelectorDialog", () => {
  it("renders its children when open", () => {
    render(
      <ModelSelectorDialog open title="Models" description="Pick one">
        <Command>
          <ModelSelectorList>
            <ModelSelectorItem value="Dialog model">Dialog model</ModelSelectorItem>
          </ModelSelectorList>
        </Command>
      </ModelSelectorDialog>
    );
    expect(screen.getByText("Dialog model")).toBeInTheDocument();
  });

  it("does not render children when closed", () => {
    render(
      <ModelSelectorDialog open={false} title="Models" description="Pick one">
        <Command>
          <ModelSelectorList>
            <ModelSelectorItem value="Hidden">Hidden dialog model</ModelSelectorItem>
          </ModelSelectorList>
        </Command>
      </ModelSelectorDialog>
    );
    expect(screen.queryByText("Hidden dialog model")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 5. ModelSelectorInput
// ---------------------------------------------------------------------------

describe("ModelSelectorInput", () => {
  it("renders an input with data-slot='command-input'", () => {
    renderOpenSelector();
    expect(
      document.body.querySelector("[data-slot='command-input']")
    ).toBeInTheDocument();
  });

  it("applies the h-auto py-3.5 sizing classes", () => {
    renderOpenSelector();
    const input = document.body.querySelector(
      "[data-slot='command-input']"
    ) as HTMLElement;
    expect(input.className).toContain("h-auto");
    expect(input.className).toContain("py-3.5");
  });

  it("forwards the placeholder", () => {
    renderOpenSelector();
    expect(screen.getByPlaceholderText("Search models")).toBeInTheDocument();
  });

  it("forwards a custom className merged with base", () => {
    render(
      <ModelSelector defaultOpen>
        <ModelSelectorContent>
          <ModelSelectorInput className="custom-input" placeholder="x" />
        </ModelSelectorContent>
      </ModelSelector>
    );
    const input = document.body.querySelector(
      "[data-slot='command-input']"
    ) as HTMLElement;
    expect(input.className).toContain("custom-input");
    expect(input.className).toContain("py-3.5");
  });

  it("accepts typed text and filters the list", async () => {
    const user = userEvent.setup();
    renderOpenSelector();
    const input = screen.getByPlaceholderText("Search models");
    await user.type(input, "Opus");
    expect(screen.getByText("Claude Opus")).toBeInTheDocument();
    expect(screen.queryByText("Haiku")).not.toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 6. ModelSelectorList / Empty
// ---------------------------------------------------------------------------

describe("ModelSelectorList & ModelSelectorEmpty", () => {
  it("list has data-slot='command-list'", () => {
    renderOpenSelector();
    expect(
      document.body.querySelector("[data-slot='command-list']")
    ).toBeInTheDocument();
  });

  it("renders the empty state when search has no matches", async () => {
    const user = userEvent.setup();
    renderOpenSelector();
    await user.type(
      screen.getByPlaceholderText("Search models"),
      "zzz-no-match"
    );
    expect(screen.getByText("No models found.")).toBeInTheDocument();
  });

  it("list forwards custom className", () => {
    render(
      <ModelSelector defaultOpen>
        <ModelSelectorContent>
          <ModelSelectorList className="custom-list">
            <ModelSelectorItem value="a">A</ModelSelectorItem>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    const list = document.body.querySelector(
      "[data-slot='command-list']"
    ) as HTMLElement;
    expect(list.className).toContain("custom-list");
  });
});

// ---------------------------------------------------------------------------
// 7. ModelSelectorGroup
// ---------------------------------------------------------------------------

describe("ModelSelectorGroup", () => {
  it("renders group headings", () => {
    renderOpenSelector();
    expect(screen.getByText("Frontier")).toBeInTheDocument();
    expect(screen.getByText("Fast")).toBeInTheDocument();
  });

  it("group has data-slot='command-group'", () => {
    renderOpenSelector();
    expect(
      document.body.querySelector("[data-slot='command-group']")
    ).toBeInTheDocument();
  });

  it("forwards custom className", () => {
    render(
      <ModelSelector defaultOpen>
        <ModelSelectorContent>
          <ModelSelectorList>
            <ModelSelectorGroup className="custom-group" heading="G">
              <ModelSelectorItem value="a">A</ModelSelectorItem>
            </ModelSelectorGroup>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    const group = document.body.querySelector(
      "[data-slot='command-group']"
    ) as HTMLElement;
    expect(group.className).toContain("custom-group");
  });
});

// ---------------------------------------------------------------------------
// 8. ModelSelectorItem
// ---------------------------------------------------------------------------

describe("ModelSelectorItem", () => {
  it("renders item content", () => {
    renderOpenSelector();
    expect(screen.getByText("Claude Opus")).toBeInTheDocument();
    expect(screen.getByText("Haiku")).toBeInTheDocument();
  });

  it("item has data-slot='command-item'", () => {
    renderOpenSelector();
    expect(
      document.body.querySelector("[data-slot='command-item']")
    ).toBeInTheDocument();
  });

  it("fires onSelect when chosen", async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();
    render(
      <ModelSelector defaultOpen>
        <ModelSelectorContent>
          <ModelSelectorList>
            <ModelSelectorItem onSelect={onSelect} value="Pickable">
              Pickable model
            </ModelSelectorItem>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    await user.click(screen.getByText("Pickable model"));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it("forwards custom className", () => {
    render(
      <ModelSelector defaultOpen>
        <ModelSelectorContent>
          <ModelSelectorList>
            <ModelSelectorItem className="custom-item" value="a">
              A
            </ModelSelectorItem>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    const item = document.body.querySelector(
      "[data-slot='command-item']"
    ) as HTMLElement;
    expect(item.className).toContain("custom-item");
  });
});

// ---------------------------------------------------------------------------
// 9. ModelSelectorShortcut
// ---------------------------------------------------------------------------

describe("ModelSelectorShortcut", () => {
  it("renders shortcut text with data-slot='command-shortcut'", () => {
    renderOpenSelector();
    const shortcut = screen.getByText("⌘1");
    expect(shortcut).toBeInTheDocument();
    expect(shortcut).toHaveAttribute("data-slot", "command-shortcut");
  });

  it("uses muted-foreground token (no raw color)", () => {
    renderOpenSelector();
    const shortcut = screen.getByText("⌘1");
    expect(shortcut.className).toContain("text-muted-foreground");
  });

  it("forwards custom className", () => {
    render(
      <ModelSelector defaultOpen>
        <ModelSelectorContent>
          <ModelSelectorList>
            <ModelSelectorItem value="a">
              A<ModelSelectorShortcut className="custom-shortcut">⌘9</ModelSelectorShortcut>
            </ModelSelectorItem>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    expect(screen.getByText("⌘9").className).toContain("custom-shortcut");
  });
});

// ---------------------------------------------------------------------------
// 10. ModelSelectorSeparator
// ---------------------------------------------------------------------------

describe("ModelSelectorSeparator", () => {
  it("renders with data-slot='command-separator'", () => {
    renderOpenSelector();
    expect(
      document.body.querySelector("[data-slot='command-separator']")
    ).toBeInTheDocument();
  });

  it("forwards custom className", () => {
    render(
      <ModelSelector defaultOpen>
        <ModelSelectorContent>
          <ModelSelectorList>
            <ModelSelectorSeparator className="custom-sep" />
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    const sep = document.body.querySelector(
      "[data-slot='command-separator']"
    ) as HTMLElement;
    expect(sep.className).toContain("custom-sep");
  });
});

// ---------------------------------------------------------------------------
// 11. ModelSelectorLogo
// ---------------------------------------------------------------------------

describe("ModelSelectorLogo", () => {
  it("renders an img with data-slot='model-selector-logo'", () => {
    render(<ModelSelectorLogo provider="anthropic" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("data-slot", "model-selector-logo");
  });

  it("builds the models.dev src from the provider", () => {
    render(<ModelSelectorLogo provider="openai" />);
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://models.dev/logos/openai.svg"
    );
  });

  it("sets an accessible alt from the provider", () => {
    render(<ModelSelectorLogo provider="google" />);
    expect(screen.getByRole("img", { name: "google logo" })).toBeInTheDocument();
  });

  it("has base sizing + dark:invert classes", () => {
    render(<ModelSelectorLogo provider="mistral" />);
    const img = screen.getByRole("img");
    expect(img.className).toContain("size-3");
    expect(img.className).toContain("dark:invert");
  });

  it("forwards custom className merged with base", () => {
    render(<ModelSelectorLogo className="custom-logo" provider="xai" />);
    const img = screen.getByRole("img");
    expect(img.className).toContain("custom-logo");
    expect(img.className).toContain("size-3");
  });

  it("forwards arbitrary props (custom provider string)", () => {
    render(<ModelSelectorLogo data-testid="logo" provider="my-custom-provider" />);
    const img = screen.getByTestId("logo");
    expect(img).toHaveAttribute(
      "src",
      "https://models.dev/logos/my-custom-provider.svg"
    );
  });
});

// ---------------------------------------------------------------------------
// 12. ModelSelectorLogoGroup
// ---------------------------------------------------------------------------

describe("ModelSelectorLogoGroup", () => {
  it("renders a div with data-slot='model-selector-logo-group'", () => {
    const { container } = render(
      <ModelSelectorLogoGroup>
        <ModelSelectorLogo provider="anthropic" />
      </ModelSelectorLogoGroup>
    );
    const group = container.querySelector(
      "[data-slot='model-selector-logo-group']"
    );
    expect(group).toBeInTheDocument();
    expect(group?.tagName).toBe("DIV");
  });

  it("uses token-driven ring/bg (no raw color)", () => {
    const { container } = render(<ModelSelectorLogoGroup />);
    const group = container.firstChild as HTMLElement;
    expect(group.className).toContain("[&>img]:bg-background");
    expect(group.className).toContain("[&>img]:ring-border");
    expect(group.className).toContain("dark:[&>img]:bg-foreground");
  });

  it("contains the logos passed as children", () => {
    render(
      <ModelSelectorLogoGroup>
        <ModelSelectorLogo provider="anthropic" />
        <ModelSelectorLogo provider="openai" />
      </ModelSelectorLogoGroup>
    );
    expect(screen.getAllByRole("img")).toHaveLength(2);
  });

  it("forwards custom className merged with base", () => {
    const { container } = render(
      <ModelSelectorLogoGroup className="custom-group" />
    );
    const group = container.firstChild as HTMLElement;
    expect(group.className).toContain("custom-group");
    expect(group.className).toContain("flex");
  });
});

// ---------------------------------------------------------------------------
// 13. ModelSelectorName
// ---------------------------------------------------------------------------

describe("ModelSelectorName", () => {
  it("renders a span with data-slot='model-selector-name'", () => {
    render(<ModelSelectorName>Claude Opus</ModelSelectorName>);
    const name = screen.getByText("Claude Opus");
    expect(name).toHaveAttribute("data-slot", "model-selector-name");
    expect(name.tagName).toBe("SPAN");
  });

  it("has truncate + flex-1 base classes", () => {
    render(<ModelSelectorName>X</ModelSelectorName>);
    const name = screen.getByText("X");
    expect(name.className).toContain("truncate");
    expect(name.className).toContain("flex-1");
  });

  it("forwards custom className merged with base", () => {
    render(<ModelSelectorName className="custom-name">Y</ModelSelectorName>);
    const name = screen.getByText("Y");
    expect(name.className).toContain("custom-name");
    expect(name.className).toContain("truncate");
  });

  it("forwards HTML attributes", () => {
    render(<ModelSelectorName id="model-name">Z</ModelSelectorName>);
    expect(screen.getByText("Z")).toHaveAttribute("id", "model-name");
  });
});

// ---------------------------------------------------------------------------
// 14. Accessibility — axe
// ---------------------------------------------------------------------------

describe("ModelSelector — accessibility (axe)", () => {
  it("closed trigger has no axe violations", async () => {
    const { container } = render(
      <main>
        <ModelSelector>
          <ModelSelectorTrigger>Open model selector</ModelSelectorTrigger>
        </ModelSelector>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // NOTE: cmdk renders ModelSelectorSeparator as role="separator", which is an
  // invalid child of the CommandList's role="listbox" (aria-required-children) —
  // a known cmdk quirk (see command.test.tsx). So the open-selector axe scenario
  // is separator-free, and every item carries text content for its accessible name.
  it("open selector (portaled, separator-free) has no axe violations", async () => {
    render(
      <ModelSelector defaultOpen>
        <ModelSelectorTrigger>Open</ModelSelectorTrigger>
        <ModelSelectorContent title="Choose a model">
          <ModelSelectorInput placeholder="Search models" />
          <ModelSelectorList>
            <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
            <ModelSelectorGroup heading="Frontier">
              <ModelSelectorItem value="Claude Opus">
                <ModelSelectorName>Claude Opus</ModelSelectorName>
              </ModelSelectorItem>
              <ModelSelectorItem value="GPT-5">
                <ModelSelectorName>GPT-5</ModelSelectorName>
              </ModelSelectorItem>
            </ModelSelectorGroup>
          </ModelSelectorList>
        </ModelSelectorContent>
      </ModelSelector>
    );
    // Dialog content is portaled to document.body. Scan the content subtree
    // (not the whole body): Base UI's portaled focus-guard <span role="button">
    // siblings live outside the dialog and are an unrelated, framework-owned quirk.
    const content = document.body.querySelector(
      "[data-slot='dialog-content']"
    ) as HTMLElement;
    const results = await axe(content);
    expect(results).toHaveNoViolations();
  });

  it("logo group with logos has no axe violations", async () => {
    const { container } = render(
      <main>
        <ModelSelectorLogoGroup>
          <ModelSelectorLogo provider="anthropic" />
          <ModelSelectorLogo provider="openai" />
        </ModelSelectorLogoGroup>
      </main>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
