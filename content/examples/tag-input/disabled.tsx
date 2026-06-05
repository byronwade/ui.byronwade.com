import { TagInput } from "@/components/ui/tag-input"

export default function Example() {
  return (
    <div className="flex w-full max-w-sm items-center justify-center p-8">
      <TagInput disabled defaultValue={["locked", "readonly"]} />
    </div>
  )
}
