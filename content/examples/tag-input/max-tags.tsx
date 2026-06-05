import { TagInput } from "@/components/ui/tag-input"

export default function Example() {
  return (
    <div className="flex w-full max-w-sm items-center justify-center p-8">
      <TagInput
        defaultValue={["one", "two"]}
        maxTags={3}
        placeholder="Up to 3 tags…"
      />
    </div>
  )
}
