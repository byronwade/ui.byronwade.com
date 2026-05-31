"use client";

import { useState } from "react";
import { DetailHeader } from "@/components/detail-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * Demonstrates the actions slot with multiple buttons and interactive state
 * (toggling a "pinned" state) to verify the flex row wrapping and gap behavior
 * on the right side of the header.
 */
export default function Example() {
  const [pinned, setPinned] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="max-w-4xl p-8">
      <DetailHeader
        title="sample-dataset-2026.parquet"
        badge={
          pinned ? (
            <Badge variant="secondary">Pinned</Badge>
          ) : (
            <Badge variant="outline">Unpinned</Badge>
          )
        }
        actions={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPinned((p) => !p)}
            >
              {pinned ? "Unpin" : "Pin"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
            >
              {copied ? "Copied!" : "Copy path"}
            </Button>
            <Button variant="outline" size="sm">
              Download
            </Button>
            <Button size="sm">Open</Button>
          </>
        }
        meta={[
          { label: "Format", value: "Parquet" },
          { label: "Rows", value: "1,240,000" },
          { label: "Size", value: "48.3 MB" },
          { label: "Uploaded", value: "Yesterday at 14:22" },
        ]}
      />
    </div>
  );
}
