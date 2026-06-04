/**
 * Tests for <QRCode /> (components/ui/qr-code.tsx). The QR SVG is generated
 * asynchronously in an effect (qrcode + culori); colors resolve from the
 * --foreground/--background tokens. We assert it renders an svg, honors color
 * overrides + robustness, and the oklch parse paths.
 */

import * as React from "react";
import { render, waitFor } from "@testing-library/react";
import { axe } from "vitest-axe";

import { QRCode } from "@/components/ui/qr-code";

async function svgOf(container: HTMLElement) {
  await waitFor(() =>
    expect(container.querySelector('[data-slot="qr-code"] svg')).not.toBeNull(),
  );
  return container.querySelector('[data-slot="qr-code"]')!;
}

describe("QRCode", () => {
  it("renders an svg QR after the async effect", async () => {
    const { container } = render(<QRCode data="https://ui.byronwade.com" />);
    const el = await svgOf(container);
    expect(el).toHaveAttribute("data-slot", "qr-code");
    expect(el.querySelector("svg")).not.toBeNull();
  });

  it("parses an explicit oklch foreground (regex-match path)", async () => {
    const { container } = render(
      <QRCode data="hello" foreground="oklch(0.6 0.17 148)" background="oklch(0.99 0 0)" />,
    );
    await svgOf(container);
    // dark modules should be present as <path>/<rect> in the QR svg
    expect(container.querySelector('[data-slot="qr-code"] svg')).not.toBeNull();
  });

  it("falls back when colors are not oklch", async () => {
    const { container } = render(
      <QRCode data="hello" foreground="#000000" background="#ffffff" />,
    );
    const el = await svgOf(container);
    expect(el.querySelector("svg")).not.toBeNull();
  });

  it("honors a high robustness level", async () => {
    const { container } = render(<QRCode data="robust" robustness="H" />);
    await svgOf(container);
    expect(container.querySelector('[data-slot="qr-code"] svg')).not.toBeNull();
  });

  it("merges a custom className", async () => {
    const { container } = render(<QRCode data="x" className="rounded-lg" />);
    const el = await svgOf(container);
    expect(el).toHaveClass("rounded-lg");
  });

  it("logs and renders nothing if generation fails", async () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    // qrcode rejects on data that exceeds capacity at level H.
    const huge = "x".repeat(5000);
    const { container } = render(<QRCode data={huge} robustness="H" />);
    await waitFor(() => expect(spy).toHaveBeenCalled());
    expect(container.querySelector('[data-slot="qr-code"]')).toBeNull();
    spy.mockRestore();
  });

  it("has no axe violations", async () => {
    const { container } = render(<QRCode data="a11y" aria-label="QR to the site" role="img" />);
    await svgOf(container);
    expect(await axe(container)).toHaveNoViolations();
  });
});
