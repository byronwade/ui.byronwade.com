import { NativeSelect } from "@/components/ui/native-select"

export default function Example() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-4 p-6">
      <NativeSelect aria-label="Small" size="sm" defaultValue="apple">
        <option value="apple">Small</option>
        <option value="banana">Banana</option>
      </NativeSelect>

      <NativeSelect aria-label="Default" defaultValue="apple">
        <option value="apple">Default</option>
        <option value="banana">Banana</option>
      </NativeSelect>

      <NativeSelect aria-label="Large" size="lg" defaultValue="apple">
        <option value="apple">Large</option>
        <option value="banana">Banana</option>
      </NativeSelect>

      <NativeSelect aria-label="Invalid" aria-invalid defaultValue="">
        <option value="" disabled>
          Required…
        </option>
        <option value="apple">Apple</option>
      </NativeSelect>
    </div>
  )
}
