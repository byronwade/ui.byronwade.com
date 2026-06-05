"use client"

import { DescriptionBox } from "@/components/description-box"

export default function Example() {
  return (
    <div className="w-[640px]">
      <DescriptionBox views={2200000} timestamp="2 months ago">
        {`We rebuilt the entire onboarding flow from scratch this quarter, and in this video I walk through every decision — from the first wireframe to the shipped release.

You'll see how we cut the time-to-first-value in half, why we dropped the multi-step wizard, and the small interaction details that made the biggest difference.

Chapters, links, and the full design file are all below. Thanks for watching — drop a comment if you want a deeper dive on any section. #design #product #onboarding`}
      </DescriptionBox>
    </div>
  )
}
