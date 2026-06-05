import { TagInput } from "@/components/ui/tag-input"

export default function Example() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4 p-8">
      <TagInput size="sm" defaultValue={["small"]} />
      <TagInput size="default" defaultValue={["default"]} />
      <TagInput size="lg" defaultValue={["large"]} />
    </div>
  )
}
