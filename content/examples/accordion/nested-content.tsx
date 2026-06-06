"use client"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export default function Example() {
  return (
    <div className="mx-auto max-w-md py-10">
      <Accordion defaultValue={["overview"]}>
        <AccordionItem value="overview">
          <AccordionTrigger>Project overview</AccordionTrigger>
          <AccordionContent>
            <p>
              This project covers the full redesign of the onboarding flow,
              including mobile-first layouts and accessibility improvements.
            </p>
            <p>
              Estimated timeline: <strong>6 weeks</strong>. Primary stakeholders
              are Product, Design, and Engineering leads.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="milestones">
          <AccordionTrigger>Milestones</AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1 list-disc pl-4 text-muted-foreground">
              <li>Week 1–2: Discovery &amp; wireframes</li>
              <li>Week 3–4: High-fidelity designs &amp; review</li>
              <li>Week 5: Engineering handoff &amp; implementation</li>
              <li>Week 6: QA, staging review, launch</li>
            </ul>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="resources">
          <AccordionTrigger>Resources &amp; links</AccordionTrigger>
          <AccordionContent>
            <p>
              All assets and briefs are stored in the shared drive. Refer to the{" "}
              <a href="#" onClick={(e) => e.preventDefault()}>
                design brief
              </a>{" "}
              and{" "}
              <a href="#" onClick={(e) => e.preventDefault()}>
                technical spec
              </a>{" "}
              before starting implementation.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="faq">
          <AccordionTrigger>Frequently asked questions</AccordionTrigger>
          <AccordionContent>
            <p>
              <strong>Can I start before the kick-off meeting?</strong>
              <br />
              Yes, review the brief and flag questions in the shared doc ahead
              of time.
            </p>
            <p>
              <strong>Who approves final designs?</strong>
              <br />
              The product lead signs off on UX; the design lead approves visual
              quality.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
