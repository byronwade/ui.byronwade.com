import { KineticText } from "@/components/ui/kinetic-text"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-8">
      <KineticText
        text="Hover me"
        className="text-4xl tracking-tight text-foreground"
      />
    </div>
  )
}
