import * as React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { axe } from "vitest-axe"
import { UploadRow, type UploadStatus } from "@/components/upload-row"

function getRoot(container: HTMLElement) {
  return container.querySelector("[data-slot='upload-row']") as HTMLElement
}

function getStatus(container: HTMLElement) {
  return container.querySelector(
    "[data-slot='upload-row-status']",
  ) as HTMLElement
}

function getPercent(container: HTMLElement) {
  return container.querySelector("[data-slot='upload-row-percent']")
}

const inFlight: UploadStatus[] = ["queued", "uploading", "processing"]

describe("UploadRow – smoke", () => {
  it("renders the root data-slot without crashing", () => {
    const { container } = render(
      <UploadRow filename="clip.mov" status="uploading" progress={10} />,
    )
    expect(getRoot(container)).toBeInTheDocument()
  })

  it("renders the filename", () => {
    render(<UploadRow filename="clip.mov" status="done" />)
    expect(screen.getByText("clip.mov")).toBeInTheDocument()
  })

  it("composes the progress primitive (renders a progressbar)", () => {
    render(<UploadRow filename="clip.mov" status="uploading" progress={50} />)
    expect(screen.getByRole("progressbar")).toBeInTheDocument()
  })

  it("merges a custom className while keeping base classes", () => {
    const { container } = render(
      <UploadRow
        filename="clip.mov"
        status="done"
        className="custom-class"
      />,
    )
    const root = getRoot(container)
    expect(root).toHaveClass("custom-class")
    expect(root).toHaveClass("flex")
    expect(root).toHaveClass("border-b")
  })

  it("forwards arbitrary props and reflects status as data-status", () => {
    render(
      <UploadRow
        filename="clip.mov"
        status="processing"
        progress={20}
        data-testid="row"
      />,
    )
    const el = screen.getByTestId("row")
    expect(el).toHaveAttribute("data-slot", "upload-row")
    expect(el).toHaveAttribute("data-status", "processing")
  })
})

describe("UploadRow – size label", () => {
  it("renders the sizeLabel as mono tabular text when present", () => {
    const { container } = render(
      <UploadRow filename="clip.mov" status="done" sizeLabel="248 MB" />,
    )
    const size = container.querySelector(
      "[data-slot='upload-row-size']",
    ) as HTMLElement
    expect(size).toBeInTheDocument()
    expect(size.textContent).toBe("248 MB")
    expect(size).toHaveClass("font-mono")
    expect(size).toHaveClass("tabular-nums")
  })

  it("omits the size element when sizeLabel is absent", () => {
    const { container } = render(
      <UploadRow filename="clip.mov" status="done" />,
    )
    expect(
      container.querySelector("[data-slot='upload-row-size']"),
    ).not.toBeInTheDocument()
  })
})

describe("UploadRow – status label and tone", () => {
  const cases: Array<{
    status: UploadStatus
    label: string
    badgeClass: string
  }> = [
    { status: "queued", label: "Queued", badgeClass: "bg-secondary" },
    { status: "uploading", label: "Uploading", badgeClass: "text-warning" },
    { status: "processing", label: "Processing", badgeClass: "text-warning" },
    { status: "done", label: "Done", badgeClass: "text-success" },
    { status: "error", label: "Error", badgeClass: "text-destructive" },
  ]

  it.each(cases)(
    "$status shows '$label' with the correct badge tone",
    ({ status, label, badgeClass }) => {
      const { container } = render(
        <UploadRow filename="clip.mov" status={status} progress={30} />,
      )
      expect(screen.getByText(label)).toBeInTheDocument()
      const badge = container.querySelector(
        "[data-slot='badge']",
      ) as HTMLElement
      expect(badge).toHaveClass(badgeClass)
    },
  )

  it("renders a status dot in the status region", () => {
    const { container } = render(
      <UploadRow filename="clip.mov" status="done" />,
    )
    const status = getStatus(container)
    expect(
      status.querySelector("[data-slot='status-dot']"),
    ).toBeInTheDocument()
  })

  it("renders a status icon glyph inside the badge", () => {
    const { container } = render(
      <UploadRow filename="clip.mov" status="done" />,
    )
    const badge = container.querySelector(
      "[data-slot='badge']",
    ) as HTMLElement
    expect(badge.querySelector("svg")).toBeInTheDocument()
  })

  it("spins the loader glyph while uploading", () => {
    const { container } = render(
      <UploadRow filename="clip.mov" status="uploading" progress={20} />,
    )
    const badge = container.querySelector(
      "[data-slot='badge']",
    ) as HTMLElement
    expect(badge.querySelector("svg")).toHaveClass("animate-spin")
  })

  it("does not spin the glyph for settled statuses", () => {
    const { container } = render(
      <UploadRow filename="clip.mov" status="done" />,
    )
    const badge = container.querySelector(
      "[data-slot='badge']",
    ) as HTMLElement
    expect(badge.querySelector("svg")).not.toHaveClass("animate-spin")
  })

  it("statusLabel overrides the default per-status label", () => {
    render(
      <UploadRow
        filename="clip.mov"
        status="processing"
        progress={88}
        statusLabel="Processing HD…"
      />,
    )
    expect(screen.getByText("Processing HD…")).toBeInTheDocument()
    expect(screen.queryByText("Processing")).not.toBeInTheDocument()
  })
})

describe("UploadRow – progress value", () => {
  it("reflects the live value while uploading", () => {
    render(<UploadRow filename="clip.mov" status="uploading" progress={42} />)
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "42",
    )
  })

  it("clamps an over-range value to 100", () => {
    render(<UploadRow filename="clip.mov" status="uploading" progress={140} />)
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    )
  })

  it("clamps a negative value to 0", () => {
    render(<UploadRow filename="clip.mov" status="uploading" progress={-5} />)
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    )
  })

  it("done always reads 100% regardless of progress prop", () => {
    render(<UploadRow filename="clip.mov" status="done" progress={10} />)
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "100",
    )
  })

  it("error clamps a provided progress value", () => {
    render(<UploadRow filename="clip.mov" status="error" progress={73} />)
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "73",
    )
  })

  it("error with no progress falls back to 0", () => {
    render(<UploadRow filename="clip.mov" status="error" />)
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "0",
    )
  })

  it("queued with no progress renders an indeterminate bar (no aria-valuenow)", () => {
    render(<UploadRow filename="clip.mov" status="queued" />)
    expect(screen.getByRole("progressbar")).not.toHaveAttribute(
      "aria-valuenow",
    )
  })

  it("processing reflects a provided value", () => {
    render(
      <UploadRow filename="clip.mov" status="processing" progress={88} />,
    )
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "88",
    )
  })
})

describe("UploadRow – percent text", () => {
  it("shows the mono percent only while uploading", () => {
    const { container } = render(
      <UploadRow filename="clip.mov" status="uploading" progress={42} />,
    )
    const percent = getPercent(container) as HTMLElement
    expect(percent).toBeInTheDocument()
    expect(percent.textContent).toBe("42%")
    expect(percent).toHaveClass("font-mono")
    expect(percent).toHaveClass("tabular-nums")
  })

  const noPercent: UploadStatus[] = ["queued", "processing", "done", "error"]
  it.each(noPercent)("omits the percent text when status is %s", (status) => {
    const { container } = render(
      <UploadRow filename="clip.mov" status={status} progress={42} />,
    )
    expect(getPercent(container)).not.toBeInTheDocument()
  })

  it("omits the percent text while uploading when progress is undefined", () => {
    const { container } = render(
      <UploadRow filename="clip.mov" status="uploading" />,
    )
    expect(getPercent(container)).not.toBeInTheDocument()
  })
})

describe("UploadRow – cancel action", () => {
  it.each(inFlight)(
    "shows Cancel for in-flight status %s and fires onCancel",
    (status) => {
      const onCancel = vi.fn()
      render(
        <UploadRow
          filename="clip.mov"
          status={status}
          progress={20}
          onCancel={onCancel}
        />,
      )
      const btn = screen.getByRole("button", { name: "Cancel" })
      fireEvent.click(btn)
      expect(onCancel).toHaveBeenCalledTimes(1)
    },
  )

  it("hides Cancel when no onCancel handler is provided", () => {
    render(<UploadRow filename="clip.mov" status="uploading" progress={20} />)
    expect(
      screen.queryByRole("button", { name: "Cancel" }),
    ).not.toBeInTheDocument()
  })

  it("hides Cancel once the upload is done even with a handler", () => {
    render(
      <UploadRow filename="clip.mov" status="done" onCancel={() => {}} />,
    )
    expect(
      screen.queryByRole("button", { name: "Cancel" }),
    ).not.toBeInTheDocument()
  })

  it("hides Cancel on error even with a handler", () => {
    render(
      <UploadRow filename="clip.mov" status="error" onCancel={() => {}} />,
    )
    expect(
      screen.queryByRole("button", { name: "Cancel" }),
    ).not.toBeInTheDocument()
  })
})

describe("UploadRow – retry action", () => {
  it("shows Retry on error and fires onRetry", () => {
    const onRetry = vi.fn()
    render(
      <UploadRow filename="clip.mov" status="error" onRetry={onRetry} />,
    )
    const btn = screen.getByRole("button", { name: "Retry" })
    fireEvent.click(btn)
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it("hides Retry when no onRetry handler is provided", () => {
    render(<UploadRow filename="clip.mov" status="error" />)
    expect(
      screen.queryByRole("button", { name: "Retry" }),
    ).not.toBeInTheDocument()
  })

  it("does not show Retry for non-error statuses", () => {
    render(
      <UploadRow
        filename="clip.mov"
        status="uploading"
        progress={20}
        onRetry={() => {}}
      />,
    )
    expect(
      screen.queryByRole("button", { name: "Retry" }),
    ).not.toBeInTheDocument()
  })

  it("omits the actions container when no applicable handler is present", () => {
    const { container } = render(
      <UploadRow filename="clip.mov" status="done" />,
    )
    expect(
      container.querySelector("[data-slot='upload-row-actions']"),
    ).not.toBeInTheDocument()
  })
})

describe("UploadRow – preview", () => {
  it("renders the thumbnail image when thumbnailSrc is set", () => {
    const { container } = render(
      <UploadRow
        filename="clip.mov"
        status="done"
        thumbnailSrc="https://example.com/poster.jpg"
      />,
    )
    expect(
      container.querySelector("[data-slot='thumbnail-image']"),
    ).toBeInTheDocument()
  })

  it("renders the placeholder when thumbnailSrc is absent", () => {
    const { container } = render(
      <UploadRow filename="clip.mov" status="done" />,
    )
    expect(
      container.querySelector("[data-slot='thumbnail-placeholder']"),
    ).toBeInTheDocument()
  })
})

describe("UploadRow – accessibility", () => {
  const statuses: UploadStatus[] = [
    "queued",
    "uploading",
    "processing",
    "done",
    "error",
  ]

  it.each(statuses)("has no axe violations for status %s", async (status) => {
    const { container } = render(
      <UploadRow
        filename="clip.mov"
        status={status}
        progress={40}
        sizeLabel="248 MB"
        onCancel={() => {}}
        onRetry={() => {}}
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations with a thumbnail image", async () => {
    const { container } = render(
      <UploadRow
        filename="clip.mov"
        status="uploading"
        progress={40}
        thumbnailSrc="https://example.com/poster.jpg"
      />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
