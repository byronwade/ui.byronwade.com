"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const dropZoneVariants = cva(
  "group/drop-zone relative flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background text-center transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 hover:bg-muted/40 data-[dragging]:border-brand data-[dragging]:bg-brand/5 data-[invalid]:border-destructive data-[invalid]:bg-destructive/5 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  {
    variants: {
      size: {
        sm: "gap-2 px-4 py-6 text-xs",
        default: "gap-3 px-6 py-10 text-sm",
        lg: "gap-4 px-8 py-14 text-base",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
)

type DropZoneVariant = "media" | "list"

type DropZoneProps = Omit<React.ComponentProps<"div">, "onChange" | "onDrop"> &
  VariantProps<typeof dropZoneVariants> & {
    /** Comma-separated `accept` filter passed to the hidden input and used to reject mismatched drops. */
    accept?: string
    /** Allow selecting/dropping more than one file. */
    multiple?: boolean
    /** Max size per file in bytes; files over the limit are rejected. */
    maxSize?: number
    /** Controlled file list. When provided, the zone renders these files. */
    value?: File[]
    /** Fired with the next accepted file list (after add/remove). */
    onChange?: (files: File[]) => void
    /** Fired with only the newly accepted files from a drop/select. */
    onDrop?: (files: File[]) => void
    /** Fired with files rejected for wrong type or exceeding `maxSize`. */
    onReject?: (files: File[]) => void
    variant?: DropZoneVariant
    disabled?: boolean
    /** Primary instruction copy above the browse trigger. */
    label?: React.ReactNode
  }

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  const units = ["KB", "MB", "GB", "TB"]
  let value = bytes / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024
    unit += 1
  }
  return `${value.toFixed(1)} ${units[unit]}`
}

function matchesAccept(file: File, accept?: string) {
  if (!accept) return true
  const patterns = accept
    .split(",")
    .map((p) => p.trim().toLowerCase())
    .filter(Boolean)
  if (patterns.length === 0) return true
  const name = file.name.toLowerCase()
  const type = file.type.toLowerCase()
  return patterns.some((pattern) => {
    if (pattern.startsWith(".")) return name.endsWith(pattern)
    if (pattern.endsWith("/*")) return type.startsWith(pattern.slice(0, -1))
    return type === pattern
  })
}

function UploadGlyph() {
  return (
    <svg
      aria-hidden
      data-slot="drop-zone-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-6 text-muted-foreground"
    >
      <path d="M12 16V5" />
      <path d="m7 10 5-5 5 5" />
      <path d="M5 19h14" />
    </svg>
  )
}

function ImageThumb({ file }: { file: File }) {
  const [url, setUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    const objectUrl = URL.createObjectURL(file)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [file])

  return (
    <span
      data-slot="drop-zone-thumb"
      className="block aspect-square w-full overflow-hidden rounded-lg bg-muted edge"
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={file.name} src={url} className="size-full object-cover" />
      ) : null}
    </span>
  )
}

function DropZone({
  className,
  size = "default",
  variant = "media",
  accept,
  multiple = false,
  maxSize,
  value,
  onChange,
  onDrop,
  onReject,
  disabled = false,
  label = "Drag & drop files here",
  ...props
}: DropZoneProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [internal, setInternal] = React.useState<File[]>([])
  const [dragging, setDragging] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const dragDepth = React.useRef(0)

  const isControlled = value !== undefined
  const files = isControlled ? value : internal

  function commit(next: File[]) {
    if (!isControlled) setInternal(next)
    onChange?.(next)
  }

  function ingest(incoming: File[]) {
    if (disabled) return
    const accepted: File[] = []
    const rejected: File[] = []
    for (const file of incoming) {
      const tooBig = maxSize !== undefined && file.size > maxSize
      if (!matchesAccept(file, accept) || tooBig) rejected.push(file)
      else accepted.push(file)
    }

    if (rejected.length > 0) {
      const tooBig =
        maxSize !== undefined && rejected.some((f) => f.size > maxSize)
      setError(
        tooBig
          ? "Some files exceed the maximum size."
          : "Some files are not an accepted type.",
      )
      onReject?.(rejected)
    } else {
      setError(null)
    }

    if (accepted.length === 0) return
    const chosen = multiple ? accepted : accepted.slice(0, 1)
    const next = multiple ? [...files, ...chosen] : chosen
    onDrop?.(chosen)
    commit(next)
  }

  function openPicker() {
    if (disabled) return
    inputRef.current?.click()
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const list = event.target.files
    if (list) ingest(Array.from(list))
    event.target.value = ""
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    dragDepth.current = 0
    setDragging(false)
    ingest(Array.from(event.dataTransfer.files))
  }

  function handleDragEnter(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    if (disabled) return
    dragDepth.current += 1
    setDragging(true)
  }

  function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    if (disabled) return
    dragDepth.current -= 1
    if (dragDepth.current <= 0) {
      dragDepth.current = 0
      setDragging(false)
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (disabled) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      openPicker()
    }
  }

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index)
    setError(null)
    commit(next)
  }

  const hasFiles = files.length > 0
  const inputLabel = typeof label === "string" ? label : "Upload files"

  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
  }

  return (
    <div
      data-slot="drop-zone"
      data-variant={variant}
      data-dragging={dragging || undefined}
      data-invalid={error ? true : undefined}
      data-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : 0}
      onClick={openPicker}
      onKeyDown={handleKeyDown}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      className={cn(dropZoneVariants({ size }), className)}
      {...props}
    >
      <input
        ref={inputRef}
        data-slot="drop-zone-input"
        type="file"
        aria-label={inputLabel}
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleInputChange}
        className="sr-only"
        tabIndex={-1}
      />

      <UploadGlyph />

      <div data-slot="drop-zone-copy" className="flex flex-col gap-1">
        <p className="text-foreground">{label}</p>
        <p className="text-muted-foreground">
          or{" "}
          <Button
            type="button"
            variant="link"
            size="sm"
            data-slot="drop-zone-browse"
            disabled={disabled}
            onClick={(event) => {
              event.stopPropagation()
              openPicker()
            }}
          >
            browse
          </Button>
        </p>
      </div>

      {error ? (
        <p
          data-slot="drop-zone-error"
          role="alert"
          className="text-destructive"
        >
          {error}
        </p>
      ) : null}

      {hasFiles ? (
        variant === "media" ? (
          <div
            data-slot="drop-zone-grid"
            className="grid w-full grid-cols-3 gap-2 sm:grid-cols-4"
          >
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                data-slot="drop-zone-item"
                className="group/item relative"
                onClick={(e) => e.stopPropagation()}
              >
                <ImageThumb file={file} />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-xs"
                  aria-label={`Remove ${file.name}`}
                  data-slot="drop-zone-remove"
                  className="absolute -top-1.5 -right-1.5"
                  onClick={(event) => {
                    event.stopPropagation()
                    removeFile(index)
                  }}
                >
                  <RemoveGlyph />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <ul
            data-slot="drop-zone-list"
            className="flex w-full flex-col gap-1.5 text-left"
          >
            {files.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                data-slot="drop-zone-item"
                className="flex items-center gap-2 rounded-lg bg-muted/40 px-3 py-2 edge"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="flex-1 truncate text-foreground">
                  {file.name}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatBytes(file.size)}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Remove ${file.name}`}
                  data-slot="drop-zone-remove"
                  onClick={(event) => {
                    event.stopPropagation()
                    removeFile(index)
                  }}
                >
                  <RemoveGlyph />
                </Button>
              </li>
            ))}
          </ul>
        )
      ) : null}
    </div>
  )
}

function RemoveGlyph() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export { DropZone, dropZoneVariants }
export type { DropZoneProps, DropZoneVariant }
