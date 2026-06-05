import * as React from "react"
import { render, within } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import { AppShell, type AppShellVariant } from "@/components/app-shell"

// ─── Fixtures ───────────────────────────────────────────────────────────────────

const ALL_VARIANTS: AppShellVariant[] = [
  "dashboard",
  "sidebar",
  "stacked",
  "three-column",
  "master-detail",
  "docs",
  "editor",
  "holy-grail",
  "focused",
  "command-center",
]

/** A render with every slot populated so each variant exercises all its regions. */
function full(variant: AppShellVariant) {
  return render(
    <AppShell
      variant={variant}
      header={<div data-testid="header-content">header</div>}
      nav={<div data-testid="nav-content">nav</div>}
      sidebar={<div data-testid="sidebar-content">sidebar</div>}
      panel={<div data-testid="panel-content">panel</div>}
      toolbar={<div data-testid="toolbar-content">toolbar</div>}
      aside={<div data-testid="aside-content">aside</div>}
      footer={<div data-testid="footer-content">footer</div>}
    >
      <div data-testid="main-content">content</div>
    </AppShell>,
  )
}

const slot = (container: HTMLElement, name: string) =>
  container.querySelector(`[data-slot="${name}"]`)

// ─── Smoke ───────────────────────────────────────────────────────────────────

describe("AppShell – smoke", () => {
  it("renders without crashing and defaults to the dashboard variant", () => {
    const { container, getByTestId } = render(
      <AppShell>
        <div data-testid="c">hi</div>
      </AppShell>,
    )
    expect(getByTestId("c")).toBeInTheDocument()
    expect(slot(container, "app-shell")).toHaveAttribute("data-variant", "dashboard")
  })

  it("always renders the content region with children", () => {
    for (const variant of ALL_VARIANTS) {
      const { container } = full(variant)
      expect(slot(container, "app-shell-content")).toBeInTheDocument()
      expect(within(container).getByTestId("main-content")).toBeInTheDocument()
    }
  })

  it("stamps the variant onto data-variant for every variant", () => {
    for (const variant of ALL_VARIANTS) {
      const { container } = full(variant)
      expect(slot(container, "app-shell")).toHaveAttribute("data-variant", variant)
    }
  })
})

// ─── Per-variant region composition ──────────────────────────────────────────

describe("AppShell – variant regions", () => {
  const expectations: Record<AppShellVariant, string[]> = {
    dashboard: ["app-shell-header", "app-shell-sidebar", "app-shell-footer"],
    sidebar: ["app-shell-sidebar"],
    stacked: ["app-shell-header", "app-shell-nav", "app-shell-footer"],
    "three-column": ["app-shell-sidebar", "app-shell-aside"],
    "master-detail": ["app-shell-sidebar", "app-shell-panel"],
    docs: ["app-shell-header", "app-shell-sidebar", "app-shell-aside"],
    editor: ["app-shell-toolbar", "app-shell-sidebar", "app-shell-aside"],
    "holy-grail": [
      "app-shell-header",
      "app-shell-sidebar",
      "app-shell-aside",
      "app-shell-footer",
    ],
    focused: ["app-shell-header", "app-shell-footer"],
    "command-center": ["app-shell-header", "app-shell-sidebar", "app-shell-toolbar"],
  }

  for (const variant of ALL_VARIANTS) {
    it(`${variant} renders its expected regions`, () => {
      const { container } = full(variant)
      for (const region of expectations[variant]) {
        expect(slot(container, region)).toBeInTheDocument()
      }
    })
  }

  it("master-detail renders three stacked panes (sidebar, panel, content)", () => {
    const { container } = full("master-detail")
    expect(slot(container, "app-shell-sidebar")).toBeInTheDocument()
    expect(slot(container, "app-shell-panel")).toBeInTheDocument()
    expect(slot(container, "app-shell-content")).toBeInTheDocument()
  })

  it("stacked renders a secondary nav strip", () => {
    const { container, getByTestId } = full("stacked")
    expect(slot(container, "app-shell-nav")).toBeInTheDocument()
    expect(getByTestId("nav-content")).toBeInTheDocument()
  })
})

// ─── Omitted slots (falsy branches) ──────────────────────────────────────────

describe("AppShell – omitted slots", () => {
  for (const variant of ALL_VARIANTS) {
    it(`${variant} renders content-only with no optional slots`, () => {
      const { container, getByTestId } = render(
        <AppShell variant={variant}>
          <div data-testid="only">only</div>
        </AppShell>,
      )
      expect(getByTestId("only")).toBeInTheDocument()
      expect(slot(container, "app-shell-content")).toBeInTheDocument()
      // No header/sidebar/aside/footer/nav/panel/toolbar were provided.
      expect(slot(container, "app-shell-header")).toBeNull()
      expect(slot(container, "app-shell-sidebar")).toBeNull()
      expect(slot(container, "app-shell-aside")).toBeNull()
      expect(slot(container, "app-shell-footer")).toBeNull()
      expect(slot(container, "app-shell-nav")).toBeNull()
      expect(slot(container, "app-shell-panel")).toBeNull()
      expect(slot(container, "app-shell-toolbar")).toBeNull()
    })
  }
})

// ─── className passthrough ───────────────────────────────────────────────────

describe("AppShell – className passthrough", () => {
  it("merges a custom className onto the root frame", () => {
    const { container } = render(
      <AppShell className="custom-frame-class">
        <div>c</div>
      </AppShell>,
    )
    expect(slot(container, "app-shell")).toHaveClass("custom-frame-class")
    // base frame classes are preserved alongside the override
    expect(slot(container, "app-shell")).toHaveClass("flex")
  })
})

// ─── Accessibility ───────────────────────────────────────────────────────────

describe("AppShell – accessibility (axe)", () => {
  // `region` is disabled: shell slots host arbitrary consumer content, so
  // wrapping every slot in a labeled landmark is the consumer's responsibility
  // (same precedent as the portaled-popup tests in this repo).
  const axeOpts = { rules: { region: { enabled: false } } }

  it("holy-grail (all five regions) has no landmark violations", async () => {
    const { container } = full("holy-grail")
    expect(await axe(container, axeOpts)).toHaveNoViolations()
  })

  it("three-column (nav sidebar + complementary aside) has no violations", async () => {
    const { container } = full("three-column")
    expect(await axe(container, axeOpts)).toHaveNoViolations()
  })

  it("dashboard renders without violations", async () => {
    const { container } = full("dashboard")
    expect(await axe(container, axeOpts)).toHaveNoViolations()
  })
})
