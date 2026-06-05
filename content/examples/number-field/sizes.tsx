import {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldDecrement,
  NumberFieldIncrement,
} from "@/components/ui/number-field"

const sizes = ["sm", "default", "lg"] as const

export default function Example() {
  return (
    <div className="flex flex-col items-center gap-4 p-8">
      {sizes.map((size) => (
        <NumberField key={size} size={size} defaultValue={3} min={0} max={10}>
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput aria-label={`Quantity (${size})`} />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      ))}
    </div>
  )
}
