"use client"

import { useEffect, useState } from "react"
import {
  ImageCrop,
  ImageCropContent,
  ImageCropApply,
  ImageCropReset,
} from "@/components/ui/image-crop"

const SAMPLE_SRC =
  "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?q=80&w=600&auto=format&fit=crop"

export default function Example() {
  const [file, setFile] = useState<File | null>(null)
  const [, setCropped] = useState<string | null>(null)

  // Pull a real photo into a File so the crop chrome has actual pixels to work
  // with. Reading it back as a data URL (inside the component) keeps the crop
  // canvas same-origin, so Apply never taints.
  useEffect(() => {
    let active = true
    fetch(SAMPLE_SRC)
      .then((res) => res.blob())
      .then((blob) => {
        if (active) setFile(new File([blob], "sample.jpg", { type: blob.type }))
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-3 p-6">
      {file ? (
        <ImageCrop aspect={1} file={file} onCrop={setCropped}>
          <ImageCropContent className="rounded-lg edge" />
          <div className="flex gap-2">
            <ImageCropApply />
            <ImageCropReset />
          </div>
        </ImageCrop>
      ) : (
        <div className="aspect-square w-full animate-pulse rounded-lg edge bg-muted" />
      )}
    </div>
  )
}
