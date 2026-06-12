"use client"

import { Check, Copy } from "@/lib/icons"
import { useEffect, useState } from "react"
import { type BundledLanguage, codeToHtml } from "shiki"

async function highlightDocsCode(code: string, lang: string) {
  const language = lang as BundledLanguage

  return await Promise.all([
    codeToHtml(code, {
      lang: language,
      theme: "one-light",
    }),
    codeToHtml(code, {
      lang: language,
      theme: "one-dark-pro",
    }),
  ])
}

export function CodeBlock({
  code,
  lang = "tsx",
}: {
  code: string
  lang?: string
}) {
  const [copied, setCopied] = useState(false)
  const [lightHtml, setLightHtml] = useState("")
  const [darkHtml, setDarkHtml] = useState("")

  useEffect(() => {
    let cancelled = false

    highlightDocsCode(code, lang).then(([light, dark]) => {
      if (cancelled) return
      setLightHtml(light)
      setDarkHtml(dark)
    })

    return () => {
      cancelled = true
    }
  }, [code, lang])

  const copy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="relative min-w-0">
      <button
        type="button"
        onClick={copy}
        aria-label="Copy code"
        className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-md edge bg-background text-muted-foreground hover:text-foreground"
      >
        {copied ? (
          <Check className="size-3.5" />
        ) : (
          <Copy className="size-3.5" />
        )}
      </button>
      <div
        data-slot="docs-code-block-light"
        className="overflow-x-auto rounded-xl edge bg-muted/40 text-sm leading-relaxed dark:hidden [&_pre]:m-0 [&_pre]:bg-transparent! [&_pre]:p-4 [&_pre]:pr-12 [&_pre]:font-mono [&_pre]:text-sm"
        // Shiki output is produced from local example source strings.
        dangerouslySetInnerHTML={{ __html: lightHtml }}
      />
      <div
        data-slot="docs-code-block-dark"
        className="hidden overflow-x-auto rounded-xl edge bg-muted/40 text-sm leading-relaxed dark:block [&_pre]:m-0 [&_pre]:bg-transparent! [&_pre]:p-4 [&_pre]:pr-12 [&_pre]:font-mono [&_pre]:text-sm"
        // Shiki output is produced from local example source strings.
        dangerouslySetInnerHTML={{ __html: darkHtml }}
      />
    </div>
  )
}
