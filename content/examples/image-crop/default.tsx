"use client";

import { useState } from "react";
import {
  ImageCrop,
  ImageCropContent,
  ImageCropApply,
  ImageCropReset,
} from "@/components/ui/image-crop";

const SAMPLE = new File([], "sample.png", { type: "image/png" });

export default function Example() {
  const [, setCropped] = useState<string | null>(null);
  return (
    <div className="flex flex-col items-center gap-3 p-6">
      <ImageCrop aspect={1} file={SAMPLE} onCrop={setCropped}>
        <ImageCropContent className="rounded-lg border border-border" />
        <div className="flex gap-2">
          <ImageCropApply />
          <ImageCropReset />
        </div>
      </ImageCrop>
    </div>
  );
}
