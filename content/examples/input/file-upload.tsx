"use client"

import * as React from "react"
import { Upload, X, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function Example() {
  const [file, setFile] = React.useState<File | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.target.files?.[0] ?? null)
  }

  function handleClear() {
    setFile(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="flex flex-col gap-5 p-6 max-w-sm w-full">
      {/* Native file input */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="file-native">Attachment</Label>
        <Input id="file-native" type="file" accept=".pdf,.doc,.docx" />
        <p className="text-xs text-muted-foreground">
          PDF or Word, up to 10 MB.
        </p>
      </div>

      {/* Custom styled trigger */}
      <div className="flex flex-col gap-1.5">
        <Label>Document</Label>
        <label
          htmlFor="file-custom"
          className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-input bg-muted/30 p-6 text-center transition-colors hover:bg-muted/50"
        >
          {file ? (
            <>
              <FileText className="size-8 text-muted-foreground" />
              <span className="text-sm font-medium">{file.name}</span>
              <span className="text-xs text-muted-foreground">
                {(file.size / 1024).toFixed(1)} KB
              </span>
            </>
          ) : (
            <>
              <Upload className="size-8 text-muted-foreground" />
              <span className="text-sm font-medium">Click to upload</span>
              <span className="text-xs text-muted-foreground">
                PNG, JPG, PDF up to 10 MB
              </span>
            </>
          )}
          <Input
            id="file-custom"
            ref={inputRef}
            type="file"
            className="sr-only"
            onChange={handleChange}
          />
        </label>
        {file && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="self-start gap-1 text-muted-foreground"
            onClick={handleClear}
          >
            <X className="size-3" />
            Remove file
          </Button>
        )}
      </div>
    </div>
  )
}
