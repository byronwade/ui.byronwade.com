import { ChevronDownIcon } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Button } from "@/components/ui/button"

const FAQS = [
  {
    question: "Do you offer a free trial?",
    answer:
      "Every plan starts with a 14-day free trial. No credit card required to get started.",
  },
  {
    question: "Can I change my plan later?",
    answer:
      "Yes, upgrade, downgrade, or switch billing cycles at any time from your settings.",
  },
  {
    question: "How do I cancel my subscription?",
    answer:
      "Open Settings → Billing and choose Cancel plan. You keep access until the period ends.",
  },
]

export default function Example() {
  return (
    <div className="w-80 space-y-2">
      {FAQS.map((faq, index) => (
        <Collapsible
          key={faq.question}
          defaultOpen={index === 0}
          className="space-y-2"
        >
          <CollapsibleTrigger
            render={
              <Button variant="outline" className="w-full justify-between" />
            }
          >
            {faq.question}
            <ChevronDownIcon className="size-4 transition-transform group-aria-expanded/button:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="rounded-lg border px-4 py-3 text-sm text-muted-foreground">
            {faq.answer}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </div>
  )
}
