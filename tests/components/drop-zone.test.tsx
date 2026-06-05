import * as React from "react"
import { render, screen, fireEvent, within } from "@testing-library/react"
import {
  describe,
  it,
  expect,
  vi,
  beforeAll,
  afterAll,
  beforeEach,
} from "vitest"
import { axe } from "vitest-axe"

import { DropZone } from "@/components/ui/drop-zone"

function makeFile(
  name: string,
  { type = "image/png", size = 100 }: { type?: string; size?: number } = {}
) {
  const file = new File(["x"], name, { type })
  Object.defineProperty(file, "size", { value: size })
  return file
}

function fireDrop(zone: Element, files: File[]) {
  fireEvent.drop(zone, { dataTransfer: { files } })
}

function getZone(container: HTMLElement) {
  return container.querySelector("[data-slot='drop-zone']") as HTMLElement
}

let createSpy: ReturnType<typeof vi.fn>
let revokeSpy: ReturnType<typeof vi.fn>

beforeAll(() => {
  createSpy = vi.fn(() => "blob:mock-url")
  revokeSpy = vi.fn()
  Object.defineProperty(URL, "createObjectURL", { value: createSpy, configurable: true })
  Object.defineProperty(URL, "revokeObjectURL", { value: revokeSpy, configurable: true })
})

afterAll(() => {
  Reflect.deleteProperty(URL, "createObjectURL")
  Reflect.deleteProperty(URL, "revokeObjectURL")
})

beforeEach(() => {
  createSpy.mockClear()
  revokeSpy.mockClear()
})

describe("DropZone – render", () => {
  it("renders instructions and a browse trigger", () => {
    const { container } = render(<DropZone label="Drop here" />)
    expect(getZone(container)).toBeInTheDocument()
    expect(screen.getByText("Drop here")).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "browse" })
    ).toBeInTheDocument()
  })

  it("merges className and forwards props to the root", () => {
    const { container } = render(
      <DropZone className="custom" data-testid="dz" />
    )
    const zone = getZone(container)
    expect(zone).toHaveClass("custom")
    expect(zone).toHaveClass("flex")
    expect(zone).toHaveAttribute("data-testid", "dz")
  })

  it("renders a hidden file input reflecting accept/multiple", () => {
    const { container } = render(
      <DropZone accept="image/*" multiple />
    )
    const input = container.querySelector(
      "[data-slot='drop-zone-input']"
    ) as HTMLInputElement
    expect(input).toHaveAttribute("type", "file")
    expect(input).toHaveAttribute("accept", "image/*")
    expect(input.multiple).toBe(true)
  })
})

describe("DropZone – drag state", () => {
  it("sets the dragging state on drag enter and clears it on matching leave", () => {
    const { container } = render(<DropZone />)
    const zone = getZone(container)
    fireEvent.dragEnter(zone)
    expect(zone).toHaveAttribute("data-dragging", "true")
    fireEvent.dragLeave(zone)
    expect(zone).not.toHaveAttribute("data-dragging")
  })

  it("stays dragging until the last nested leave (depth counter)", () => {
    const { container } = render(<DropZone />)
    const zone = getZone(container)
    fireEvent.dragEnter(zone)
    fireEvent.dragEnter(zone)
    fireEvent.dragLeave(zone)
    expect(zone).toHaveAttribute("data-dragging", "true")
    fireEvent.dragLeave(zone)
    expect(zone).not.toHaveAttribute("data-dragging")
  })

  it("clears dragging after a drop", () => {
    const { container } = render(<DropZone />)
    const zone = getZone(container)
    fireEvent.dragEnter(zone)
    fireDrop(zone, [makeFile("a.png")])
    expect(zone).not.toHaveAttribute("data-dragging")
  })

  it("prevents default on drag over so the drop target is valid", () => {
    const { container } = render(<DropZone />)
    const event = new Event("dragover", { bubbles: true, cancelable: true })
    fireEvent(getZone(container), event)
    expect(event.defaultPrevented).toBe(true)
  })
})

describe("DropZone – accepting files", () => {
  it("fires onChange and onDrop when files are dropped", () => {
    const onChange = vi.fn()
    const onDrop = vi.fn()
    const { container } = render(
      <DropZone multiple onChange={onChange} onDrop={onDrop} />
    )
    fireDrop(getZone(container), [makeFile("a.png"), makeFile("b.png")])
    expect(onDrop).toHaveBeenCalledWith(
      expect.arrayContaining([expect.any(File)])
    )
    expect(onChange.mock.calls[0][0]).toHaveLength(2)
  })

  it("accepts files via the hidden input change", () => {
    const onChange = vi.fn()
    const { container } = render(<DropZone multiple onChange={onChange} />)
    const input = container.querySelector(
      "[data-slot='drop-zone-input']"
    ) as HTMLInputElement
    fireEvent.change(input, { target: { files: [makeFile("a.png")] } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(input.value).toBe("")
  })

  it("keeps only one file when not multiple, replacing previous", () => {
    const onChange = vi.fn()
    const { container } = render(<DropZone onChange={onChange} />)
    const zone = getZone(container)
    fireDrop(zone, [makeFile("a.png"), makeFile("b.png")])
    expect(onChange.mock.calls[0][0]).toHaveLength(1)
    fireDrop(zone, [makeFile("c.png")])
    expect(onChange.mock.calls[1][0]).toHaveLength(1)
    expect(onChange.mock.calls[1][0][0].name).toBe("c.png")
  })

  it("appends across multiple drops when multiple", () => {
    const onChange = vi.fn()
    const { container } = render(<DropZone multiple onChange={onChange} />)
    const zone = getZone(container)
    fireDrop(zone, [makeFile("a.png")])
    fireDrop(zone, [makeFile("b.png")])
    expect(onChange.mock.calls[1][0]).toHaveLength(2)
  })
})

describe("DropZone – rejection", () => {
  it("rejects a wrong type and shows an error + fires onReject", () => {
    const onReject = vi.fn()
    const onChange = vi.fn()
    const { container } = render(
      <DropZone accept="image/*" onReject={onReject} onChange={onChange} />
    )
    const zone = getZone(container)
    fireDrop(zone, [makeFile("doc.pdf", { type: "application/pdf" })])
    expect(onReject).toHaveBeenCalledTimes(1)
    expect(onChange).not.toHaveBeenCalled()
    expect(zone).toHaveAttribute("data-invalid", "true")
    expect(screen.getByRole("alert")).toHaveTextContent("not an accepted type")
  })

  it("rejects an oversized file with a size message", () => {
    const onReject = vi.fn()
    const { container } = render(
      <DropZone maxSize={50} onReject={onReject} />
    )
    fireDrop(getZone(container), [makeFile("big.png", { size: 9999 })])
    expect(onReject).toHaveBeenCalledTimes(1)
    expect(screen.getByRole("alert")).toHaveTextContent("exceed the maximum")
  })

  it("accepts the good files and rejects the bad ones in one drop", () => {
    const onReject = vi.fn()
    const onChange = vi.fn()
    const { container } = render(
      <DropZone
        accept=".png"
        multiple
        onReject={onReject}
        onChange={onChange}
      />
    )
    fireDrop(getZone(container), [
      makeFile("ok.png"),
      makeFile("no.gif", { type: "image/gif" }),
    ])
    expect(onReject).toHaveBeenCalledTimes(1)
    expect(onChange.mock.calls[0][0]).toHaveLength(1)
  })

  it("treats a blank accept as no filter", () => {
    const onChange = vi.fn()
    const { container } = render(
      <DropZone accept=" , " multiple onChange={onChange} />
    )
    fireDrop(getZone(container), [
      makeFile("anything.xyz", { type: "application/x-thing" }),
    ])
    expect(onChange.mock.calls[0][0]).toHaveLength(1)
  })

  it("matches accept by extension and by exact mime type", () => {
    const onChange = vi.fn()
    const { container } = render(
      <DropZone accept=".png,text/plain" multiple onChange={onChange} />
    )
    fireDrop(getZone(container), [
      makeFile("a.png"),
      makeFile("b.txt", { type: "text/plain" }),
    ])
    expect(onChange.mock.calls[0][0]).toHaveLength(2)
  })

  it("clears the error after a subsequent valid drop", () => {
    const { container } = render(<DropZone accept="image/*" />)
    const zone = getZone(container)
    fireDrop(zone, [makeFile("doc.pdf", { type: "application/pdf" })])
    expect(zone).toHaveAttribute("data-invalid", "true")
    fireDrop(zone, [makeFile("a.png")])
    expect(zone).not.toHaveAttribute("data-invalid")
  })
})

describe("DropZone – variants", () => {
  it("renders image thumbnails for the media variant and revokes object URLs", () => {
    const { container, unmount } = render(<DropZone variant="media" />)
    fireDrop(getZone(container), [makeFile("a.png")])
    expect(
      container.querySelector("[data-slot='drop-zone-thumb']")
    ).toBeInTheDocument()
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "blob:mock-url"
    )
    expect(createSpy).toHaveBeenCalled()
    unmount()
    expect(revokeSpy).toHaveBeenCalled()
  })

  it("renders a name/size list for the list variant", () => {
    const { container } = render(<DropZone variant="list" />)
    fireDrop(getZone(container), [makeFile("report.pdf", { size: 2048 })])
    expect(
      container.querySelector("[data-slot='drop-zone-list']")
    ).toBeInTheDocument()
    expect(screen.getByText("report.pdf")).toBeInTheDocument()
    expect(screen.getByText("2.0 KB")).toBeInTheDocument()
  })

  it.each([
    [100, "100 B"],
    [2048, "2.0 KB"],
    [5 * 1024 * 1024, "5.0 MB"],
    [3 * 1024 * 1024 * 1024, "3.0 GB"],
  ])("formats %i bytes as %s in the list", (size, label) => {
    const { container } = render(<DropZone variant="list" />)
    fireDrop(getZone(container), [makeFile("f.bin", { size })])
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it.each(["sm", "default", "lg"] as const)(
    "renders the %s size without crashing",
    (size) => {
      const { container } = render(<DropZone size={size} />)
      expect(getZone(container)).toBeInTheDocument()
    }
  )
})

describe("DropZone – removing files", () => {
  it("removes a file from the media grid", () => {
    const onChange = vi.fn()
    const { container } = render(
      <DropZone variant="media" multiple onChange={onChange} />
    )
    fireDrop(getZone(container), [makeFile("a.png"), makeFile("b.png")])
    const item = container.querySelector(
      "[data-slot='drop-zone-grid'] [data-slot='drop-zone-item']"
    ) as HTMLElement
    // Clicking the item itself is a no-op (it stops propagation to the zone).
    fireEvent.click(item)
    const remove = within(item).getByRole("button", { name: "Remove a.png" })
    fireEvent.click(remove)
    expect(onChange.mock.calls.at(-1)?.[0]).toHaveLength(1)
  })

  it("removes a file from the list and stops click propagation", () => {
    const { container } = render(<DropZone variant="list" multiple />)
    fireDrop(getZone(container), [makeFile("a.txt"), makeFile("b.txt")])
    const item = container.querySelector(
      "[data-slot='drop-zone-list'] [data-slot='drop-zone-item']"
    ) as HTMLElement
    fireEvent.click(item)
    const remove = within(item).getByRole("button", { name: "Remove a.txt" })
    fireEvent.click(remove)
    expect(screen.queryByText("a.txt")).not.toBeInTheDocument()
  })
})

describe("DropZone – picker", () => {
  it("opens the picker via the browse button click", () => {
    const { container } = render(<DropZone />)
    const input = container.querySelector(
      "[data-slot='drop-zone-input']"
    ) as HTMLInputElement
    const clickSpy = vi.spyOn(input, "click").mockImplementation(() => {})
    fireEvent.click(screen.getByRole("button", { name: "browse" }))
    expect(clickSpy).toHaveBeenCalled()
  })

  it("opens the picker on a zone click", () => {
    const { container } = render(<DropZone />)
    const input = container.querySelector(
      "[data-slot='drop-zone-input']"
    ) as HTMLInputElement
    const clickSpy = vi.spyOn(input, "click").mockImplementation(() => {})
    fireEvent.click(getZone(container))
    expect(clickSpy).toHaveBeenCalled()
  })

  it.each(["Enter", " "])("opens the picker on %s keydown", (key) => {
    const { container } = render(<DropZone />)
    const input = container.querySelector(
      "[data-slot='drop-zone-input']"
    ) as HTMLInputElement
    const clickSpy = vi.spyOn(input, "click").mockImplementation(() => {})
    fireEvent.keyDown(getZone(container), { key })
    expect(clickSpy).toHaveBeenCalled()
  })

  it("ignores other keys", () => {
    const { container } = render(<DropZone />)
    const input = container.querySelector(
      "[data-slot='drop-zone-input']"
    ) as HTMLInputElement
    const clickSpy = vi.spyOn(input, "click").mockImplementation(() => {})
    fireEvent.keyDown(getZone(container), { key: "Tab" })
    expect(clickSpy).not.toHaveBeenCalled()
  })

  it("ignores an input change with no files", () => {
    const onChange = vi.fn()
    const { container } = render(<DropZone onChange={onChange} />)
    const input = container.querySelector(
      "[data-slot='drop-zone-input']"
    ) as HTMLInputElement
    fireEvent.change(input, { target: { files: null } })
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe("DropZone – controlled", () => {
  it("renders the controlled value and reports changes without owning state", () => {
    const onChange = vi.fn()
    const value = [makeFile("controlled.txt", { size: 1024 })]
    const { container } = render(
      <DropZone variant="list" value={value} onChange={onChange} />
    )
    expect(screen.getByText("controlled.txt")).toBeInTheDocument()
    const remove = screen.getByRole("button", {
      name: "Remove controlled.txt",
    })
    fireEvent.click(remove)
    expect(onChange).toHaveBeenCalledWith([])
    // Still shows the value because the parent owns it.
    expect(screen.getByText("controlled.txt")).toBeInTheDocument()
    expect(getZone(container)).toBeInTheDocument()
  })
})

describe("DropZone – disabled", () => {
  it("does not open the picker, accept drops, or set drag state when disabled", () => {
    const onChange = vi.fn()
    const { container } = render(<DropZone disabled onChange={onChange} />)
    const zone = getZone(container)
    const input = container.querySelector(
      "[data-slot='drop-zone-input']"
    ) as HTMLInputElement
    const clickSpy = vi.spyOn(input, "click").mockImplementation(() => {})

    fireEvent.click(zone)
    fireEvent.keyDown(zone, { key: "Enter" })
    expect(clickSpy).not.toHaveBeenCalled()

    fireEvent.dragEnter(zone)
    expect(zone).not.toHaveAttribute("data-dragging")
    fireEvent.dragLeave(zone)

    fireDrop(zone, [makeFile("a.png")])
    expect(onChange).not.toHaveBeenCalled()
    expect(zone).toHaveAttribute("data-disabled", "true")
    expect(zone).toHaveAttribute("tabindex", "-1")
  })
})

describe("DropZone – accessibility", () => {
  it("has no axe violations when empty", async () => {
    const { container } = render(<DropZone label="Upload files" />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it("has no axe violations with files in each variant", async () => {
    const media = render(<DropZone variant="media" multiple />)
    fireDrop(getZone(media.container), [makeFile("a.png")])
    expect(await axe(media.container)).toHaveNoViolations()

    const list = render(<DropZone variant="list" multiple />)
    fireDrop(getZone(list.container), [makeFile("a.txt", { type: "text/plain" })])
    expect(await axe(list.container)).toHaveNoViolations()
  })
})
