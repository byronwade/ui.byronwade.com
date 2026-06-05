import { MailIcon, SendIcon } from "lucide-react"
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
        <MailIcon className="size-4 opacity-50" />
      </InputGroupAddon>
      <InputGroupInput type="email" placeholder="you@example.com" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" aria-label="Send invite">
          <SendIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
