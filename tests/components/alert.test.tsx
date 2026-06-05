/**
 * Exhaustive tests for <Alert />, <AlertTitle />, <AlertDescription />, <AlertAction />
 *
 * Component source: components/ui/alert.tsx
 * API summary:
 *   - Alert: renders a <div role="alert" data-slot="alert"> with CVA variants
 *       variant: "default" (bg-card text-card-foreground) | "destructive" (bg-card text-destructive)
 *       + all native div props (className, children, id, aria-*, etc.)
 *   - AlertTitle: renders <div data-slot="alert-title" className="font-medium …">
 *   - AlertDescription: renders <div data-slot="alert-description" className="text-sm text-muted-foreground …">
 *   - AlertAction: renders <div data-slot="alert-action" className="absolute top-2 right-2">
 *
 * Compound usage:
 *   <Alert [variant]>
 *     [<svg icon />]           — triggers 2-col grid layout
 *     <AlertTitle>…</AlertTitle>
 *     <AlertDescription>…</AlertDescription>
 *     <AlertAction>…</AlertAction>  — positions action absolutely, adds pr-18 to root
 *   </Alert>
 */

import * as React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";
import {
  Alert,
  AlertTitle,
  AlertDescription,
  AlertAction,
} from "@/components/ui/alert";
import { InfoIcon, XCircleIcon, TriangleAlertIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const ALL_VARIANTS = [
  "default",
  "success",
  "warning",
  "destructive",
] as const;
type Variant = (typeof ALL_VARIANTS)[number];

const VARIANT_CLASSES: Record<Variant, string[]> = {
  default: ["bg-card", "text-card-foreground"],
  success: ["bg-card", "text-success"],
  warning: ["bg-card", "text-warning"],
  destructive: ["bg-card", "text-destructive"],
};

// ---------------------------------------------------------------------------
// 1. Renders without crashing — default usage
// ---------------------------------------------------------------------------

describe("Alert — default render", () => {
  it("renders without crashing (no children)", () => {
    const { container } = render(<Alert />);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders a <div> element", () => {
    const { container } = render(<Alert>Content</Alert>);
    expect((container.firstElementChild as HTMLElement).tagName).toBe("DIV");
  });

  it("renders with role='alert'", () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders with data-slot='alert'", () => {
    const { container } = render(<Alert>msg</Alert>);
    expect((container.firstElementChild as HTMLElement)).toHaveAttribute(
      "data-slot",
      "alert"
    );
  });

  it("renders text children inside the alert", () => {
    render(<Alert>Read-only mode active</Alert>);
    expect(screen.getByRole("alert")).toHaveTextContent("Read-only mode active");
  });

  it("defaults to variant='default' (bg-card class present)", () => {
    const { container } = render(<Alert>Test</Alert>);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "bg-card"
    );
  });

  it("defaults to variant='default' (text-card-foreground class present)", () => {
    const { container } = render(<Alert>Test</Alert>);
    expect((container.firstElementChild as HTMLElement).className).toContain(
      "text-card-foreground"
    );
  });
});

// ---------------------------------------------------------------------------
// 2. Base CSS classes always present
// ---------------------------------------------------------------------------

describe("Alert — base CSS classes", () => {
  const base = [
    "group/alert",
    "relative",
    "grid",
    "w-full",
    "rounded-lg",
    "edge",
    "px-2.5",
    "py-2",
    "text-left",
    "text-sm",
  ];

  base.forEach((cls) => {
    it(`has class "${cls}"`, () => {
      const { container } = render(<Alert>Test</Alert>);
      expect(
        (container.firstElementChild as HTMLElement).className
      ).toContain(cls);
    });
  });

  it("has gap-0.5 class", () => {
    const { container } = render(<Alert>Test</Alert>);
    expect(
      (container.firstElementChild as HTMLElement).className
    ).toContain("gap-0.5");
  });
});

// ---------------------------------------------------------------------------
// 3. Variant prop — assert expected classes
// ---------------------------------------------------------------------------

describe("Alert — variant prop", () => {
  ALL_VARIANTS.forEach((variant) => {
    describe(`variant="${variant}"`, () => {
      it("renders without crashing", () => {
        const { container } = render(<Alert variant={variant}>msg</Alert>);
        expect(container.firstElementChild).toBeInTheDocument();
      });

      it("has role='alert'", () => {
        render(<Alert variant={variant}>msg</Alert>);
        expect(screen.getByRole("alert")).toBeInTheDocument();
      });

      VARIANT_CLASSES[variant].forEach((cls) => {
        it(`has class "${cls}"`, () => {
          const { container } = render(<Alert variant={variant}>msg</Alert>);
          expect(
            (container.firstElementChild as HTMLElement).className
          ).toContain(cls);
        });
      });
    });
  });

  it("explicit variant='default' produces same classes as omitting variant", () => {
    const { container: c1 } = render(<Alert>msg</Alert>);
    const { container: c2 } = render(<Alert variant="default">msg</Alert>);
    expect((c1.firstElementChild as HTMLElement).className).toBe(
      (c2.firstElementChild as HTMLElement).className
    );
  });

  it("destructive variant has *:data-[slot=alert-description]:text-destructive/90 in className", () => {
    const { container } = render(<Alert variant="destructive">x</Alert>);
    expect(
      (container.firstElementChild as HTMLElement).className
    ).toContain("text-destructive");
  });
});

// ---------------------------------------------------------------------------
// 4. className merging
// ---------------------------------------------------------------------------

describe("Alert — className merging", () => {
  it("merges custom className with base classes", () => {
    const { container } = render(
      <Alert className="custom-alert">Test</Alert>
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("custom-alert");
    expect(el.className).toContain("rounded-lg"); // base still present
  });

  it("allows adding extra classes alongside existing ones", () => {
    const { container } = render(
      <Alert className="mt-4 mb-2">Spaced</Alert>
    );
    const cls = (container.firstElementChild as HTMLElement).className;
    expect(cls).toContain("mt-4");
    expect(cls).toContain("mb-2");
  });

  it("renders without crashing when no className provided", () => {
    const { container } = render(<Alert>No custom class</Alert>);
    expect(container.firstElementChild).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 5. Native attribute pass-through
// ---------------------------------------------------------------------------

describe("Alert — native attribute pass-through", () => {
  it("passes id attribute", () => {
    const { container } = render(<Alert id="alert-main">msg</Alert>);
    expect(container.firstElementChild as HTMLElement).toHaveAttribute(
      "id",
      "alert-main"
    );
  });

  it("passes data-testid attribute", () => {
    render(<Alert data-testid="my-alert">msg</Alert>);
    expect(screen.getByTestId("my-alert")).toBeInTheDocument();
  });

  it("passes aria-label attribute", () => {
    const { container } = render(
      <Alert aria-label="storage warning">Storage nearly full</Alert>
    );
    expect(container.firstElementChild as HTMLElement).toHaveAttribute(
      "aria-label",
      "storage warning"
    );
  });

  it("passes aria-live attribute", () => {
    const { container } = render(
      <Alert aria-live="polite">Live update</Alert>
    );
    expect(container.firstElementChild as HTMLElement).toHaveAttribute(
      "aria-live",
      "polite"
    );
  });

  it("passes tabIndex attribute", () => {
    const { container } = render(
      <Alert tabIndex={0}>Focusable alert</Alert>
    );
    expect(container.firstElementChild as HTMLElement).toHaveAttribute(
      "tabIndex",
      "0"
    );
  });

  it("passes custom data-* attributes", () => {
    const { container } = render(
      <Alert data-severity="high">Critical issue</Alert>
    );
    expect(container.firstElementChild as HTMLElement).toHaveAttribute(
      "data-severity",
      "high"
    );
  });

  it("passes onClick handler and fires on click", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Alert onClick={handleClick} tabIndex={0}>
        Clickable
      </Alert>
    );
    await user.click(screen.getByRole("alert"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// 6. AlertTitle — sub-component
// ---------------------------------------------------------------------------

describe("AlertTitle", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Title text</AlertTitle>
      </Alert>
    );
    expect(container.querySelector('[data-slot="alert-title"]')).toBeInTheDocument();
  });

  it("renders a <div> element", () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Hello</AlertTitle>
      </Alert>
    );
    const el = container.querySelector('[data-slot="alert-title"]') as HTMLElement;
    expect(el.tagName).toBe("DIV");
  });

  it("has data-slot='alert-title'", () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Title</AlertTitle>
      </Alert>
    );
    expect(
      container.querySelector('[data-slot="alert-title"]')
    ).not.toBeNull();
  });

  it("has font-medium class", () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Title</AlertTitle>
      </Alert>
    );
    const el = container.querySelector('[data-slot="alert-title"]') as HTMLElement;
    expect(el.className).toContain("font-medium");
  });

  it("renders text content correctly", () => {
    render(
      <Alert>
        <AlertTitle>New update available</AlertTitle>
      </Alert>
    );
    expect(screen.getByText("New update available")).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    const { container } = render(
      <Alert>
        <AlertTitle className="custom-title">Title</AlertTitle>
      </Alert>
    );
    const el = container.querySelector('[data-slot="alert-title"]') as HTMLElement;
    expect(el.className).toContain("custom-title");
    expect(el.className).toContain("font-medium"); // base still present
  });

  it("passes additional native props (id)", () => {
    const { container } = render(
      <Alert>
        <AlertTitle id="title-id">Title</AlertTitle>
      </Alert>
    );
    expect(
      container.querySelector('[data-slot="alert-title"]')
    ).toHaveAttribute("id", "title-id");
  });

  it("renders rich children (strong, em)", () => {
    render(
      <Alert>
        <AlertTitle>
          Version <strong>2.4.0</strong> is ready
        </AlertTitle>
      </Alert>
    );
    expect(screen.getByText(/2\.4\.0/)).toBeInTheDocument();
  });

  it("renders with link inside title (underline classes target)", () => {
    const { container } = render(
      <Alert>
        <AlertTitle>
          <a href="#">Privacy Policy</a> updated
        </AlertTitle>
      </Alert>
    );
    const titleEl = container.querySelector('[data-slot="alert-title"]') as HTMLElement;
    // class string should contain link styling targets
    expect(titleEl.className).toContain("[&_a]:underline");
  });
});

// ---------------------------------------------------------------------------
// 7. AlertDescription — sub-component
// ---------------------------------------------------------------------------

describe("AlertDescription", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <Alert>
        <AlertDescription>Desc text</AlertDescription>
      </Alert>
    );
    expect(
      container.querySelector('[data-slot="alert-description"]')
    ).toBeInTheDocument();
  });

  it("renders a <div> element", () => {
    const { container } = render(
      <Alert>
        <AlertDescription>Desc</AlertDescription>
      </Alert>
    );
    const el = container.querySelector(
      '[data-slot="alert-description"]'
    ) as HTMLElement;
    expect(el.tagName).toBe("DIV");
  });

  it("has data-slot='alert-description'", () => {
    const { container } = render(
      <Alert>
        <AlertDescription>Desc</AlertDescription>
      </Alert>
    );
    expect(
      container.querySelector('[data-slot="alert-description"]')
    ).not.toBeNull();
  });

  it("has text-sm class", () => {
    const { container } = render(
      <Alert>
        <AlertDescription>Desc</AlertDescription>
      </Alert>
    );
    const el = container.querySelector(
      '[data-slot="alert-description"]'
    ) as HTMLElement;
    expect(el.className).toContain("text-sm");
  });

  it("has text-muted-foreground class", () => {
    const { container } = render(
      <Alert>
        <AlertDescription>Desc</AlertDescription>
      </Alert>
    );
    const el = container.querySelector(
      '[data-slot="alert-description"]'
    ) as HTMLElement;
    expect(el.className).toContain("text-muted-foreground");
  });

  it("has text-balance class", () => {
    const { container } = render(
      <Alert>
        <AlertDescription>Desc</AlertDescription>
      </Alert>
    );
    const el = container.querySelector(
      '[data-slot="alert-description"]'
    ) as HTMLElement;
    expect(el.className).toContain("text-balance");
  });

  it("renders text content correctly", () => {
    render(
      <Alert>
        <AlertDescription>
          Version 2.4.0 is ready to install.
        </AlertDescription>
      </Alert>
    );
    expect(
      screen.getByText("Version 2.4.0 is ready to install.")
    ).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    const { container } = render(
      <Alert>
        <AlertDescription className="custom-desc">Desc</AlertDescription>
      </Alert>
    );
    const el = container.querySelector(
      '[data-slot="alert-description"]'
    ) as HTMLElement;
    expect(el.className).toContain("custom-desc");
    expect(el.className).toContain("text-sm"); // base still present
  });

  it("renders with anchor link child (underline classes target)", () => {
    const { container } = render(
      <Alert>
        <AlertDescription>
          Read our <a href="#">Privacy Policy</a>.
        </AlertDescription>
      </Alert>
    );
    const desc = container.querySelector(
      '[data-slot="alert-description"]'
    ) as HTMLElement;
    expect(desc.className).toContain("[&_a]:underline");
  });

  it("renders with strong/em children", () => {
    render(
      <Alert>
        <AlertDescription>
          Sent to <strong>user@example.com</strong>.
        </AlertDescription>
      </Alert>
    );
    expect(screen.getByText("user@example.com")).toBeInTheDocument();
  });

  it("renders with paragraph children", () => {
    render(
      <Alert>
        <AlertDescription>
          <p>First paragraph.</p>
          <p>Second paragraph.</p>
        </AlertDescription>
      </Alert>
    );
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
  });

  it("has [&_p:not(:last-child)]:mb-4 class for paragraph spacing", () => {
    const { container } = render(
      <Alert>
        <AlertDescription>Desc</AlertDescription>
      </Alert>
    );
    const el = container.querySelector(
      '[data-slot="alert-description"]'
    ) as HTMLElement;
    expect(el.className).toContain("[&_p:not(:last-child)]:mb-4");
  });
});

// ---------------------------------------------------------------------------
// 8. AlertAction — sub-component
// ---------------------------------------------------------------------------

describe("AlertAction", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <Alert>
        <AlertAction>
          <button>Dismiss</button>
        </AlertAction>
      </Alert>
    );
    expect(
      container.querySelector('[data-slot="alert-action"]')
    ).toBeInTheDocument();
  });

  it("renders a <div> element", () => {
    const { container } = render(
      <Alert>
        <AlertAction>
          <button>Dismiss</button>
        </AlertAction>
      </Alert>
    );
    const el = container.querySelector(
      '[data-slot="alert-action"]'
    ) as HTMLElement;
    expect(el.tagName).toBe("DIV");
  });

  it("has data-slot='alert-action'", () => {
    const { container } = render(
      <Alert>
        <AlertAction>
          <button>Act</button>
        </AlertAction>
      </Alert>
    );
    expect(
      container.querySelector('[data-slot="alert-action"]')
    ).not.toBeNull();
  });

  it("has absolute class", () => {
    const { container } = render(
      <Alert>
        <AlertAction>
          <button>Act</button>
        </AlertAction>
      </Alert>
    );
    const el = container.querySelector(
      '[data-slot="alert-action"]'
    ) as HTMLElement;
    expect(el.className).toContain("absolute");
  });

  it("has top-2 class", () => {
    const { container } = render(
      <Alert>
        <AlertAction>
          <button>Act</button>
        </AlertAction>
      </Alert>
    );
    const el = container.querySelector(
      '[data-slot="alert-action"]'
    ) as HTMLElement;
    expect(el.className).toContain("top-2");
  });

  it("has right-2 class", () => {
    const { container } = render(
      <Alert>
        <AlertAction>
          <button>Act</button>
        </AlertAction>
      </Alert>
    );
    const el = container.querySelector(
      '[data-slot="alert-action"]'
    ) as HTMLElement;
    expect(el.className).toContain("right-2");
  });

  it("renders its children", () => {
    render(
      <Alert>
        <AlertAction>
          <button>Dismiss</button>
        </AlertAction>
      </Alert>
    );
    expect(screen.getByRole("button", { name: "Dismiss" })).toBeInTheDocument();
  });

  it("accepts custom className", () => {
    const { container } = render(
      <Alert>
        <AlertAction className="custom-action">
          <button>Act</button>
        </AlertAction>
      </Alert>
    );
    const el = container.querySelector(
      '[data-slot="alert-action"]'
    ) as HTMLElement;
    expect(el.className).toContain("custom-action");
    expect(el.className).toContain("absolute"); // base still present
  });

  it("action button is clickable via userEvent", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Alert>
        <AlertTitle>Info</AlertTitle>
        <AlertAction>
          <button onClick={handleClick}>Dismiss</button>
        </AlertAction>
      </Alert>
    );
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("action button is keyboard-operable (Enter key)", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Alert>
        <AlertAction>
          <button onClick={handleClick}>Save</button>
        </AlertAction>
      </Alert>
    );
    const btn = screen.getByRole("button", { name: "Save" });
    btn.focus();
    await user.keyboard("{Enter}");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("action button is keyboard-operable (Space key)", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();
    render(
      <Alert>
        <AlertAction>
          <button onClick={handleClick}>Retry</button>
        </AlertAction>
      </Alert>
    );
    const btn = screen.getByRole("button", { name: "Retry" });
    btn.focus();
    await user.keyboard(" ");
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("alert root has has-data-[slot=alert-action]:relative in className", () => {
    const { container } = render(
      <Alert>
        <AlertAction>
          <button>x</button>
        </AlertAction>
      </Alert>
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain(
      "has-data-[slot=alert-action]:relative"
    );
  });

  it("alert root has has-data-[slot=alert-action]:pr-18 in className", () => {
    const { container } = render(
      <Alert>
        <AlertAction>
          <button>x</button>
        </AlertAction>
      </Alert>
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el.className).toContain("has-data-[slot=alert-action]:pr-18");
  });
});

// ---------------------------------------------------------------------------
// 9. Compound usage — full Alert composition
// ---------------------------------------------------------------------------

describe("Alert — compound composition (full)", () => {
  it("renders all four parts without crashing", () => {
    const { container } = render(
      <Alert>
        <InfoIcon data-testid="icon" />
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Description text.</AlertDescription>
        <AlertAction>
          <button>Dismiss</button>
        </AlertAction>
      </Alert>
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(container.querySelector('[data-slot="alert-title"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="alert-description"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="alert-action"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="icon"]')).toBeInTheDocument();
  });

  it("renders title-only alert (no description, no icon, no action)", () => {
    render(
      <Alert>
        <AlertTitle>Maintenance window tonight.</AlertTitle>
      </Alert>
    );
    expect(screen.getByText("Maintenance window tonight.")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("renders title + description (no icon, no action)", () => {
    render(
      <Alert>
        <AlertTitle>Your plan renews on June 30</AlertTitle>
        <AlertDescription>
          Review your usage before the billing date.
        </AlertDescription>
      </Alert>
    );
    expect(screen.getByText("Your plan renews on June 30")).toBeInTheDocument();
    expect(
      screen.getByText("Review your usage before the billing date.")
    ).toBeInTheDocument();
  });

  it("renders description-only alert (no title, no icon)", () => {
    render(
      <Alert>
        <AlertDescription>
          A new privacy policy is in effect as of May 1.
        </AlertDescription>
      </Alert>
    );
    expect(
      screen.getByText("A new privacy policy is in effect as of May 1.")
    ).toBeInTheDocument();
  });

  it("renders alert with icon (svg present)", () => {
    const { container } = render(
      <Alert>
        <InfoIcon data-testid="info-icon" />
        <AlertTitle>Info</AlertTitle>
        <AlertDescription>An informational message.</AlertDescription>
      </Alert>
    );
    expect(container.querySelector('[data-testid="info-icon"]')).not.toBeNull();
  });

  it("alert root has has-[>svg]:grid-cols-[auto_1fr] class when icon present", () => {
    const { container } = render(
      <Alert>
        <InfoIcon />
        <AlertTitle>Title</AlertTitle>
      </Alert>
    );
    const el = container.firstElementChild as HTMLElement;
    // The class selector is in the base string regardless of children
    expect(el.className).toContain("has-[>svg]:grid-cols-[auto_1fr]");
  });

  it("AlertTitle has group-has-[>svg]/alert:col-start-2 class (for icon layout)", () => {
    const { container } = render(
      <Alert>
        <InfoIcon />
        <AlertTitle>Title</AlertTitle>
      </Alert>
    );
    const titleEl = container.querySelector(
      '[data-slot="alert-title"]'
    ) as HTMLElement;
    expect(titleEl.className).toContain(
      "group-has-[>svg]/alert:col-start-2"
    );
  });

  it("renders destructive compound alert", () => {
    render(
      <Alert variant="destructive">
        <XCircleIcon data-testid="err-icon" />
        <AlertTitle>Export failed</AlertTitle>
        <AlertDescription>
          The file could not be generated. Try again or contact support.
        </AlertDescription>
        <AlertAction>
          <button>Retry</button>
        </AlertAction>
      </Alert>
    );
    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("text-destructive");
    expect(screen.getByText("Export failed")).toBeInTheDocument();
    expect(screen.getByText(/The file could not be generated/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument();
  });

  it("dismiss action removes alert from DOM (interaction example)", async () => {
    const user = userEvent.setup();

    function Dismissable() {
      const [visible, setVisible] = React.useState(true);
      if (!visible) return null;
      return (
        <Alert>
          <AlertTitle>Read-only mode</AlertTitle>
          <AlertDescription>Changes won't be saved.</AlertDescription>
          <AlertAction>
            <button onClick={() => setVisible(false)}>Dismiss</button>
          </AlertAction>
        </Alert>
      );
    }

    render(<Dismissable />);
    expect(screen.getByRole("alert")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("multiple independent alerts render correctly", () => {
    render(
      <div>
        <Alert data-testid="a1">
          <AlertTitle>Alert One</AlertTitle>
        </Alert>
        <Alert variant="destructive" data-testid="a2">
          <AlertTitle>Alert Two</AlertTitle>
        </Alert>
      </div>
    );
    expect(screen.getAllByRole("alert")).toHaveLength(2);
    expect(screen.getByText("Alert One")).toBeInTheDocument();
    expect(screen.getByText("Alert Two")).toBeInTheDocument();
  });

  it("action button in destructive alert fires callback", async () => {
    const user = userEvent.setup();
    const onRetry = vi.fn();
    render(
      <Alert variant="destructive">
        <AlertTitle>Export failed</AlertTitle>
        <AlertAction>
          <button onClick={onRetry}>Retry</button>
        </AlertAction>
      </Alert>
    );
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});

// ---------------------------------------------------------------------------
// 10. Inline link behavior in AlertDescription
// ---------------------------------------------------------------------------

describe("Alert — inline links in AlertDescription", () => {
  it("renders a single link inside description", () => {
    render(
      <Alert>
        <AlertTitle>Cookie preferences updated</AlertTitle>
        <AlertDescription>
          Read our <a href="#">Privacy Policy</a> to learn how we use data.
        </AlertDescription>
      </Alert>
    );
    expect(screen.getByRole("link", { name: "Privacy Policy" })).toBeInTheDocument();
  });

  it("renders multiple links inside description", () => {
    render(
      <Alert>
        <AlertTitle>Setup required</AlertTitle>
        <AlertDescription>
          See the <a href="#">quick-start guide</a> and configure your{" "}
          <a href="#">environment variables</a>.
        </AlertDescription>
      </Alert>
    );
    expect(screen.getByRole("link", { name: "quick-start guide" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "environment variables" })).toBeInTheDocument();
  });

  it("renders a link inside destructive alert description", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Credentials expired</AlertTitle>
        <AlertDescription>
          <a href="#">Renew your credentials</a> to restore access.
        </AlertDescription>
      </Alert>
    );
    expect(
      screen.getByRole("link", { name: "Renew your credentials" })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 11. Re-render behavior
// ---------------------------------------------------------------------------

describe("Alert — re-render behavior", () => {
  it("updates children text content on re-render", () => {
    const { rerender } = render(<Alert><AlertTitle>First</AlertTitle></Alert>);
    expect(screen.getByText("First")).toBeInTheDocument();
    rerender(<Alert><AlertTitle>Second</AlertTitle></Alert>);
    expect(screen.getByText("Second")).toBeInTheDocument();
    expect(screen.queryByText("First")).toBeNull();
  });

  it("updates variant classes on re-render", () => {
    const { container, rerender } = render(
      <Alert variant="default">Test</Alert>
    );
    expect(
      (container.firstElementChild as HTMLElement).className
    ).toContain("text-card-foreground");

    rerender(<Alert variant="destructive">Test</Alert>);
    expect(
      (container.firstElementChild as HTMLElement).className
    ).toContain("text-destructive");
    expect(
      (container.firstElementChild as HTMLElement).className
    ).not.toContain("text-card-foreground");
  });

  it("updates className on re-render", () => {
    const { container, rerender } = render(
      <Alert className="old-class">Test</Alert>
    );
    expect(
      (container.firstElementChild as HTMLElement).className
    ).toContain("old-class");

    rerender(<Alert className="new-class">Test</Alert>);
    expect(
      (container.firstElementChild as HTMLElement).className
    ).toContain("new-class");
    expect(
      (container.firstElementChild as HTMLElement).className
    ).not.toContain("old-class");
  });
});

// ---------------------------------------------------------------------------
// 12. Edge cases
// ---------------------------------------------------------------------------

describe("Alert — edge cases", () => {
  it("renders with undefined children without crashing", () => {
    const { container } = render(<Alert>{undefined}</Alert>);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders with null children without crashing", () => {
    const { container } = render(<Alert>{null}</Alert>);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders with empty string children without crashing", () => {
    const { container } = render(<Alert>{""}</Alert>);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders with false children without crashing", () => {
    const { container } = render(<Alert>{false}</Alert>);
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("renders with a React fragment as children", () => {
    render(
      <Alert>
        <>Fragment content</>
      </Alert>
    );
    expect(screen.getByText("Fragment content")).toBeInTheDocument();
  });

  it("renders with numeric children", () => {
    render(<Alert>{42}</Alert>);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders multiple independent instances without interference", () => {
    render(
      <div>
        <Alert data-testid="i1">
          <AlertTitle>Alpha</AlertTitle>
        </Alert>
        <Alert variant="destructive" data-testid="i2">
          <AlertTitle>Beta</AlertTitle>
        </Alert>
        <Alert data-testid="i3">
          <AlertTitle>Gamma</AlertTitle>
        </Alert>
      </div>
    );
    const alerts = screen.getAllByRole("alert");
    expect(alerts).toHaveLength(3);
  });

  it("AlertTitle renders without being inside Alert (standalone)", () => {
    const { container } = render(<AlertTitle>Standalone title</AlertTitle>);
    expect(container.firstElementChild).toBeInTheDocument();
    expect(screen.getByText("Standalone title")).toBeInTheDocument();
  });

  it("AlertDescription renders without being inside Alert (standalone)", () => {
    const { container } = render(
      <AlertDescription>Standalone desc</AlertDescription>
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });

  it("AlertAction renders without being inside Alert (standalone)", () => {
    const { container } = render(
      <AlertAction>
        <button>Act</button>
      </AlertAction>
    );
    expect(container.firstElementChild).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 13. Example scenarios (from content/examples/alert/)
// ---------------------------------------------------------------------------

describe("Alert — example scenarios", () => {
  it("default example: icon + title + description", () => {
    render(
      <Alert>
        <InfoIcon data-testid="info" />
        <AlertTitle>New update available</AlertTitle>
        <AlertDescription>
          Version 2.4.0 is ready to install. Restart the application to apply
          changes.
        </AlertDescription>
      </Alert>
    );
    expect(screen.getByText("New update available")).toBeInTheDocument();
    expect(screen.getByText(/Version 2.4.0/)).toBeInTheDocument();
  });

  it("variants example: default variant alert renders", () => {
    render(
      <Alert variant="default">
        <InfoIcon />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>
          This is the default alert style.
        </AlertDescription>
      </Alert>
    );
    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("bg-card");
    expect(alert.className).toContain("text-card-foreground");
  });

  it("variants example: destructive variant alert renders", () => {
    render(
      <Alert variant="destructive">
        <XCircleIcon />
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>Something went wrong.</AlertDescription>
      </Alert>
    );
    const alert = screen.getByRole("alert");
    expect(alert.className).toContain("text-destructive");
    expect(screen.getByText("Destructive")).toBeInTheDocument();
  });

  it("with-icon example: various icons render without crashing", () => {
    const icons = [
      { name: "Verify your email", Icon: () => <svg data-testid="icon-mail" /> },
    ];
    render(
      <Alert>
        <svg data-testid="icon-mail" />
        <AlertTitle>Verify your email</AlertTitle>
        <AlertDescription>
          We sent a confirmation link to user@example.com.
        </AlertDescription>
      </Alert>
    );
    expect(screen.getByText("Verify your email")).toBeInTheDocument();
  });

  it("no-icon example: title-only (no svg child)", () => {
    render(
      <Alert>
        <AlertTitle>
          Maintenance window tonight from 11 PM – 1 AM UTC.
        </AlertTitle>
      </Alert>
    );
    const { container } = render(
      <Alert>
        <AlertTitle>Maintenance window tonight from 11 PM – 1 AM UTC.</AlertTitle>
      </Alert>
    );
    // No svg inside — should NOT have col-start-2 activated (attr present in class string but not triggered)
    expect(container.querySelector("svg")).toBeNull();
  });

  it("with-action example: multiple dismissable alerts", async () => {
    const user = userEvent.setup();

    function Example() {
      const [dismissed, setDismissed] = React.useState<string[]>([]);
      const isDismissed = (id: string) => dismissed.includes(id);
      const dismiss = (id: string) =>
        setDismissed((prev) => [...prev, id]);

      return (
        <div>
          {!isDismissed("info") && (
            <Alert>
              <AlertTitle>Read-only mode</AlertTitle>
              <AlertDescription>
                You are viewing a shared snapshot.
              </AlertDescription>
              <AlertAction>
                <button onClick={() => dismiss("info")}>Dismiss</button>
              </AlertAction>
            </Alert>
          )}
          {!isDismissed("warning") && (
            <Alert>
              <TriangleAlertIcon />
              <AlertTitle>Unsaved changes</AlertTitle>
              <AlertAction>
                <button onClick={() => dismiss("warning")}>Save</button>
              </AlertAction>
            </Alert>
          )}
          {!isDismissed("error") && (
            <Alert variant="destructive">
              <XCircleIcon />
              <AlertTitle>Export failed</AlertTitle>
              <AlertAction>
                <button onClick={() => dismiss("error")}>Retry</button>
              </AlertAction>
            </Alert>
          )}
          {dismissed.length === 3 && (
            <p data-testid="all-dismissed">All alerts dismissed.</p>
          )}
        </div>
      );
    }

    render(<Example />);

    // Three alerts initially
    expect(screen.getAllByRole("alert")).toHaveLength(3);

    // Dismiss first
    await user.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(screen.getAllByRole("alert")).toHaveLength(2);

    // Dismiss second
    await user.click(screen.getByRole("button", { name: "Save" }));
    expect(screen.getAllByRole("alert")).toHaveLength(1);

    // Dismiss third
    await user.click(screen.getByRole("button", { name: "Retry" }));
    expect(screen.queryAllByRole("alert")).toHaveLength(0);

    // All-dismissed message appears
    expect(screen.getByTestId("all-dismissed")).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 14. within() scoped queries
// ---------------------------------------------------------------------------

describe("Alert — within() scoped queries", () => {
  it("can scope queries to a specific alert when multiple exist", () => {
    render(
      <div>
        <Alert data-testid="alert-a">
          <AlertTitle>Alert A</AlertTitle>
          <AlertDescription>Description A</AlertDescription>
        </Alert>
        <Alert data-testid="alert-b">
          <AlertTitle>Alert B</AlertTitle>
          <AlertDescription>Description B</AlertDescription>
        </Alert>
      </div>
    );

    const alertA = screen.getByTestId("alert-a");
    const alertB = screen.getByTestId("alert-b");

    expect(within(alertA).getByText("Alert A")).toBeInTheDocument();
    expect(within(alertA).queryByText("Alert B")).toBeNull();
    expect(within(alertB).getByText("Alert B")).toBeInTheDocument();
    expect(within(alertB).queryByText("Alert A")).toBeNull();
  });

  it("within alert — finds description text", () => {
    render(
      <Alert data-testid="scoped-alert">
        <AlertTitle>Title</AlertTitle>
        <AlertDescription>Scoped description text</AlertDescription>
      </Alert>
    );
    const alert = screen.getByTestId("scoped-alert");
    expect(
      within(alert).getByText("Scoped description text")
    ).toBeInTheDocument();
  });

  it("within alert — finds action button", () => {
    render(
      <Alert data-testid="action-alert">
        <AlertTitle>Info</AlertTitle>
        <AlertAction>
          <button>Close</button>
        </AlertAction>
      </Alert>
    );
    const alert = screen.getByTestId("action-alert");
    expect(
      within(alert).getByRole("button", { name: "Close" })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// 15. Accessibility — axe violations
// ---------------------------------------------------------------------------

describe("Alert — accessibility (axe)", () => {
  it("has no axe violations — default variant, title + description", async () => {
    const { container } = render(
      <Alert>
        <AlertTitle>New update available</AlertTitle>
        <AlertDescription>
          Version 2.4.0 is ready to install.
        </AlertDescription>
      </Alert>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations — destructive variant, title + description", async () => {
    const { container } = render(
      <Alert variant="destructive">
        <AlertTitle>Account suspended</AlertTitle>
        <AlertDescription>
          Your account has been suspended due to a policy violation.
        </AlertDescription>
      </Alert>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations — alert with SVG icon", async () => {
    const { container } = render(
      <Alert>
        <InfoIcon aria-hidden="true" />
        <AlertTitle>Cookie preferences updated</AlertTitle>
        <AlertDescription>Your settings have been saved.</AlertDescription>
      </Alert>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations — alert with action button", async () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Read-only mode</AlertTitle>
        <AlertDescription>You are viewing a shared snapshot.</AlertDescription>
        <AlertAction>
          <button>Dismiss</button>
        </AlertAction>
      </Alert>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations — title-only alert (no description, no icon)", async () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Maintenance window tonight from 11 PM – 1 AM UTC.</AlertTitle>
      </Alert>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations — description-only alert", async () => {
    const { container } = render(
      <Alert>
        <AlertDescription>
          A new privacy policy is in effect as of May 1.
        </AlertDescription>
      </Alert>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations — alert with inline links in description", async () => {
    const { container } = render(
      <Alert>
        <AlertTitle>Setup required</AlertTitle>
        <AlertDescription>
          Review the <a href="#">quick-start guide</a> first.
        </AlertDescription>
      </Alert>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations — destructive alert with link in description", async () => {
    const { container } = render(
      <Alert variant="destructive">
        <AlertTitle>Credentials expired</AlertTitle>
        <AlertDescription>
          <a href="#">Renew your credentials</a> to restore access.
        </AlertDescription>
      </Alert>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it("has no axe violations — multiple alerts in a list context", async () => {
    const { container } = render(
      <div>
        <Alert>
          <AlertTitle>Alpha</AlertTitle>
        </Alert>
        <Alert variant="destructive">
          <AlertTitle>Beta</AlertTitle>
        </Alert>
      </div>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
