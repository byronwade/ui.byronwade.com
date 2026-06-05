import { ButtonGroup } from "@/components/ui/button-group"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <div className="flex flex-col items-start gap-6 p-6">
      <ButtonGroup>
        <Button variant="outline">Left</Button>
        <Button variant="outline">Center</Button>
        <Button variant="outline">Right</Button>
      </ButtonGroup>

      <ButtonGroup orientation="vertical">
        <Button variant="outline">Top</Button>
        <Button variant="outline">Middle</Button>
        <Button variant="outline">Bottom</Button>
      </ButtonGroup>
    </div>
  )
}
