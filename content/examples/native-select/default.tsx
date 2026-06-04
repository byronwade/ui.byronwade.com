import { NativeSelect } from "@/components/ui/native-select";

export default function Example() {
  return (
    <div className="flex max-w-xs flex-col gap-3 p-6">
      <NativeSelect defaultValue="">
        <option value="" disabled>
          Choose a fruit…
        </option>
        <option value="apple">Apple</option>
        <option value="banana">Banana</option>
        <option value="cherry">Cherry</option>
      </NativeSelect>

      <NativeSelect defaultValue="banana" disabled>
        <option value="banana">Banana (disabled)</option>
      </NativeSelect>
    </div>
  );
}
