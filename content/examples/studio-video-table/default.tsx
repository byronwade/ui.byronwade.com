"use client"

import * as React from "react"
import { Copy, PencilSimple, Trash } from "@/lib/icons"

import { StudioVideoRow } from "@/components/studio-video-row"
import {
  StudioVideoTable,
  type StudioVideoSort,
} from "@/components/studio-video-table"

export default function Example() {
  const [sort, setSort] = React.useState<StudioVideoSort | undefined>({
    key: "views",
    direction: "desc",
  })

  return (
    <div className="w-[860px]">
      <StudioVideoTable sort={sort} onSortChange={setSort}>
        <StudioVideoRow
          title="Building a design system from scratch"
          visibility="public"
          date="Apr 3, 2026"
          views={128400}
          comments={842}
          likes={9600}
          menuItems={[
            {
              key: "edit",
              label: "Edit",
              icon: <PencilSimple className="size-4" />,
            },
            {
              key: "duplicate",
              label: "Duplicate",
              icon: <Copy className="size-4" />,
            },
            {
              key: "delete",
              label: "Delete",
              icon: <Trash className="size-4" />,
            },
          ]}
        />
        <StudioVideoRow
          title="Token theming deep dive"
          visibility="scheduled"
          date="May 12, 2026"
          views={0}
        />
      </StudioVideoTable>
    </div>
  )
}
