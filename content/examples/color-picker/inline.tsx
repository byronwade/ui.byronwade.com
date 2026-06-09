import {
  ColorPicker,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/ui/color-picker"

export default function Example() {
  return (
    <ColorPicker
      defaultValue="#16a34a"
      className="w-64 gap-3 rounded-lg edge bg-card p-3"
    >
      {/* A compact picker: saturation field, a hue rail, and the hex readout. */}
      <ColorPickerSelection className="aspect-[3/2] w-full" />
      <ColorPickerHue />
      <ColorPickerOutput />
    </ColorPicker>
  )
}
