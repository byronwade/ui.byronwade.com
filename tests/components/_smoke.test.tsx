import { render, screen } from "@testing-library/react";
import { expect, test } from "vitest";
import { axe } from "vitest-axe";
import { Button } from "@/components/ui/button";

test("Button renders with correct role and accessible name", () => {
  render(<Button>Hi</Button>);
  expect(screen.getByRole("button", { name: "Hi" })).toBeInTheDocument();
});

test("Button has no axe accessibility violations", async () => {
  const { container } = render(<Button>Hi</Button>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
