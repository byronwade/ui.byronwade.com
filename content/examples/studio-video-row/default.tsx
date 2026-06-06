"use client"

import * as React from "react"
import { Copy, Pencil, Trash2 } from "lucide-react"

import { StudioVideoRow } from "@/components/studio-video-row"
import { StudioVideoTable } from "@/components/studio-video-table"

export default function Example() {
  const [allSelected, setAllSelected] = React.useState(false)

  return (
    <div className="w-[860px]">
      <StudioVideoTable
        allSelected={allSelected}
        onSelectAllChange={setAllSelected}
        defaultSort={{ key: "views", direction: "desc" }}
      >
        <StudioVideoRow
          title="Building a design system from scratch"
          description="A full walkthrough of tokens, primitives, and composites."
          thumbnailSrc="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&q=80"
          duration="18:24"
          visibility="public"
          date="Apr 3, 2026"
          dateLabel="Published"
          views={128400}
          comments={842}
          likes={9600}
          selected={allSelected}
          highlighted
          menuItems={[
            { key: "edit", label: "Edit", icon: <Pencil className="size-4" /> },
            {
              key: "duplicate",
              label: "Duplicate",
              icon: <Copy className="size-4" />,
            },
            {
              key: "delete",
              label: "Delete",
              icon: <Trash2 className="size-4" />,
            },
          ]}
          onClick={() => {}}
        />
        <StudioVideoRow
          title="Token theming deep dive"
          description="How a single --brand variable re-skins the whole system."
          visibility="scheduled"
          date="May 12, 2026"
          dateLabel="Scheduled"
          views={0}
          comments={0}
          likes={0}
          selected={allSelected}
          onClick={() => {}}
        />
        <StudioVideoRow
          title="Draft: accessibility audit notes"
          visibility="draft"
          dateLabel="Draft"
          selected={allSelected}
        />
      </StudioVideoTable>
    </div>
  )
}
