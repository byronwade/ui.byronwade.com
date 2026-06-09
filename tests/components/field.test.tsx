/**
 * Tests for Field (components/ui/field.tsx) — form field layout primitives.
 */

import * as React from "react"
import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"

import { Input } from "@/components/ui/input"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field"

function EmailField({
  orientation = "vertical" as "vertical" | "horizontal" | "responsive",
  error,
}: {
  orientation?: "vertical" | "horizontal" | "responsive"
  error?: React.ComponentProps<typeof FieldError>["errors"]
}) {
  return (
    <FieldGroup>
      <Field orientation={orientation}>
        <FieldLabel htmlFor="email">Email</FieldLabel>
        <Input id="email" type="email" placeholder="you@example.com" />
        <FieldDescription>We never share your email.</FieldDescription>
        <FieldError errors={error} />
      </Field>
    </FieldGroup>
  )
}

describe("Field — render", () => {
  it("renders label, input, and description", () => {
    render(<EmailField />)
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
    expect(screen.getByText("We never share your email.")).toBeInTheDocument()
  })

  it("has data-slot attributes on field parts", () => {
    const { container } = render(<EmailField />)
    expect(container.querySelector('[data-slot="field-group"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="field"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="field-label"]')).not.toBeNull()
    expect(container.querySelector('[data-slot="field-description"]')).not.toBeNull()
  })

  it("renders a fieldset with legend", () => {
    render(
      <FieldSet>
        <FieldLegend>Account</FieldLegend>
        <Field>
          <FieldLabel htmlFor="name">Name</FieldLabel>
          <Input id="name" />
        </Field>
      </FieldSet>,
    )
    expect(screen.getByText("Account")).toHaveAttribute("data-slot", "field-legend")
    expect(document.querySelector('[data-slot="field-set"]')).not.toBeNull()
  })
})

describe("Field — orientation", () => {
  it("defaults to vertical orientation", () => {
    const { container } = render(<EmailField />)
    const field = container.querySelector('[data-slot="field"]')
    expect(field).toHaveAttribute("data-orientation", "vertical")
    expect(field).toHaveClass("flex-col")
  })

  it("applies horizontal orientation", () => {
    const { container } = render(<EmailField orientation="horizontal" />)
    const field = container.querySelector('[data-slot="field"]')
    expect(field).toHaveAttribute("data-orientation", "horizontal")
    expect(field).toHaveClass("flex-row")
  })

  it("applies responsive orientation", () => {
    const { container } = render(<EmailField orientation="responsive" />)
    const field = container.querySelector('[data-slot="field"]')
    expect(field).toHaveAttribute("data-orientation", "responsive")
  })
})

describe("FieldError", () => {
  it("renders a single error message from errors array", () => {
    render(<EmailField error={[{ message: "Invalid email" }]} />)
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid email")
    expect(document.querySelector('[data-slot="field-error"]')).not.toBeNull()
  })

  it("renders a list when multiple unique errors are provided", () => {
    render(
      <EmailField
        error={[{ message: "Too short" }, { message: "Invalid format" }]}
      />,
    )
    const alert = screen.getByRole("alert")
    expect(alert.querySelector("ul")).not.toBeNull()
    expect(alert).toHaveTextContent("Too short")
    expect(alert).toHaveTextContent("Invalid format")
  })

  it("returns null when there are no errors", () => {
    const { container } = render(<EmailField />)
    expect(container.querySelector('[data-slot="field-error"]')).toBeNull()
  })

  it("renders custom children instead of errors", () => {
    render(
      <Field>
        <FieldError>Custom error copy</FieldError>
      </Field>,
    )
    expect(screen.getByRole("alert")).toHaveTextContent("Custom error copy")
  })
})

describe("Field — extended parts", () => {
  it("renders field content and title slots", () => {
    render(
      <FieldGroup>
        <Field orientation="horizontal">
          <FieldTitle>Profile</FieldTitle>
          <FieldContent>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" />
          </FieldContent>
        </Field>
      </FieldGroup>,
    )
    expect(screen.getByText("Profile")).toHaveAttribute("data-slot", "field-label")
    expect(document.querySelector('[data-slot="field-content"]')).not.toBeNull()
  })

  it("renders a labeled field separator", () => {
    render(
      <FieldGroup>
        <FieldSeparator>Or continue with</FieldSeparator>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input id="email" />
        </Field>
      </FieldGroup>,
    )
    expect(screen.getByText("Or continue with")).toHaveAttribute(
      "data-slot",
      "field-separator-content",
    )
  })
})

/**
 * Auto-wiring: a Field that does NOT manually set htmlFor/id. Base UI's Field
 * primitive associates the label with the control and chains description + error
 * into the control's aria-describedby automatically.
 */
function AutoWiredField({
  invalid,
  error,
}: {
  invalid?: boolean
  error?: React.ComponentProps<typeof FieldError>["errors"]
}) {
  return (
    <FieldGroup>
      <Field invalid={invalid}>
        <FieldLabel>Username</FieldLabel>
        <Input type="text" />
        <FieldDescription>Pick something memorable.</FieldDescription>
        <FieldError errors={error} />
      </Field>
    </FieldGroup>
  )
}

describe("Field — auto-wiring (Base UI)", () => {
  it("associates the label with the control without manual htmlFor/id", () => {
    render(<AutoWiredField />)
    const control = screen.getByLabelText("Username")
    expect(control).toBe(screen.getByRole("textbox"))
  })

  it("chains the description into the control's aria-describedby", () => {
    const { container } = render(<AutoWiredField />)
    const control = screen.getByRole("textbox")
    const description = container.querySelector(
      '[data-slot="field-description"]',
    )
    expect(description?.id).toBeTruthy()
    expect(control.getAttribute("aria-describedby")).toContain(description!.id)
  })

  it("marks the control invalid and chains the error into aria-describedby", () => {
    const { container } = render(
      <AutoWiredField invalid error={[{ message: "Username is taken" }]} />,
    )
    const control = screen.getByRole("textbox")
    const fieldError = container.querySelector('[data-slot="field-error"]')
    expect(control).toHaveAttribute("aria-invalid", "true")
    expect(fieldError?.id).toBeTruthy()
    expect(control.getAttribute("aria-describedby")).toContain(fieldError!.id)
  })

  it("drives the field's data-invalid state for styling", () => {
    const { container } = render(<AutoWiredField invalid />)
    const field = container.querySelector('[data-slot="field"]')
    expect(field).toHaveAttribute("data-invalid")
  })
})

describe("Field — accessibility", () => {
  it("has no axe violations", async () => {
    const { container } = render(<EmailField />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations in the invalid state", async () => {
    const { container } = render(
      <AutoWiredField invalid error={[{ message: "Username is taken" }]} />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
