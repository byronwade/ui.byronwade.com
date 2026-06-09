import {
  ColorPicker,
  ColorPickerAlpha,
  ColorPickerEyeDropper,
  ColorPickerFormat,
  ColorPickerHue,
  ColorPickerOutput,
  ColorPickerSelection,
} from "@/components/ui/color-picker"

const sizes = ["sm", "default", "lg"] as const

export default function Example() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-6 p-8">
      {sizes.map((size) => (
        <ColorPicker
          key={size}
          size={size}
          defaultValue="#1d4ed8"
          className="w-56 rounded-lg edge bg-card p-3"
        >
          <ColorPickerSelection />
          <div className="flex items-center gap-3">
            <ColorPickerEyeDropper />
            <div className="grid w-full gap-2">
              <ColorPickerHue />
              <ColorPickerAlpha />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ColorPickerOutput />
            <ColorPickerFormat />
          </div>
        </ColorPicker>
      ))}
    </div>
  )
}
