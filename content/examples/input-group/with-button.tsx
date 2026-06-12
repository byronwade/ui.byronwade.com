import { Envelope, PaperPlaneTilt } from "@/lib/icons"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function Example() {
  return (
    <InputGroup className="max-w-sm">
      <InputGroupAddon>
        <Envelope className="size-4 opacity-50" />
      </InputGroupAddon>
      <InputGroupInput type="email" placeholder="you@example.com" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" aria-label="Send invite">
          <PaperPlaneTilt />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
