import { render, waitFor } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

const codeToHtmlMock = vi.fn(
  async (code: string, opts: { lang: string; theme: string }) =>
    `<pre data-theme="${opts.theme}" data-lang="${opts.lang}"><code><span class="token-keyword">${code}</span></code></pre>`,
)

vi.mock("shiki", () => ({
  codeToHtml: (...args: Parameters<typeof codeToHtmlMock>) =>
    codeToHtmlMock(...args),
}))

import { CodeBlock } from "@/app/(docs)/_components/code-block"

describe("Docs CodeBlock", () => {
  it("renders real Shiki-highlighted light and dark code panels", async () => {
    const { container } = render(
      <CodeBlock code="const value = 1" lang="tsx" />,
    )

    await waitFor(() => {
      expect(container.querySelectorAll(".token-keyword")).toHaveLength(2)
    })

    expect(codeToHtmlMock).toHaveBeenCalledWith(
      "const value = 1",
      expect.objectContaining({ lang: "tsx", theme: "one-light" }),
    )
    expect(codeToHtmlMock).toHaveBeenCalledWith(
      "const value = 1",
      expect.objectContaining({ lang: "tsx", theme: "one-dark-pro" }),
    )
    expect(
      container.querySelector('[data-slot="docs-code-block-light"]'),
    ).toBeInTheDocument()
    expect(
      container.querySelector('[data-slot="docs-code-block-dark"]'),
    ).toBeInTheDocument()
  })
})
