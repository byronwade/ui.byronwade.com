import { Input } from "@/components/ui/input"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"

export default function Example() {
  return (
    <FieldGroup className="max-w-sm">
      <Field>
        <FieldLabel>Email</FieldLabel>
        <Input type="email" placeholder="you@example.com" />
        <FieldDescription>We never share your email.</FieldDescription>
      </Field>
      <Field invalid>
        <FieldLabel>Username</FieldLabel>
        <Input type="text" defaultValue="ab" />
        <FieldDescription>At least 3 characters.</FieldDescription>
        <FieldError errors={[{ message: "Username is too short." }]} />
      </Field>
    </FieldGroup>
  )
}
