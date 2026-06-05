import { Textarea } from "@/components/ui/textarea"

export default function Example() {
  return (
    <div className="flex flex-col gap-4 p-6 max-w-md">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="disabled-empty"
          className="text-sm font-medium text-muted-foreground"
        >
          Disabled (empty)
        </label>
        <Textarea
          id="disabled-empty"
          placeholder="You cannot edit this field"
          disabled
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="disabled-prefilled"
          className="text-sm font-medium text-muted-foreground"
        >
          Disabled (pre-filled)
        </label>
        <Textarea
          id="disabled-prefilled"
          defaultValue="This content is read-only and cannot be changed by the user. It was set programmatically."
          disabled
        />
      </div>
    </div>
  )
}
