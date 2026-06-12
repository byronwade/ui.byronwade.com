import { WarningCircle } from "@/lib/icons"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"

export default function Example() {
  return (
    <div className="grid max-w-sm gap-1.5">
      <InputGroup>
        <InputGroupAddon>
          <WarningCircle className="size-4 text-destructive" />
        </InputGroupAddon>
        <InputGroupInput
          aria-label="Email"
          aria-invalid
          aria-describedby="input-group-validation-error"
          defaultValue="not-an-email"
        />
      </InputGroup>
      <p id="input-group-validation-error" className="text-sm text-destructive">
        Enter a valid email address.
      </p>
    </div>
  )
}
