import { animalName } from "@/lib/identity"

export default function Example() {
  return (
    <ul className="text-sm text-muted-foreground">
      {["a", "b", "c"].map((s) => (
        <li key={s}>{animalName(s)}</li>
      ))}
    </ul>
  )
}
