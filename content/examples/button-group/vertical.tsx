import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";

export default function Example() {
  return (
    <div className="flex items-start p-6">
      <ButtonGroup orientation="vertical">
        <Button variant="outline">Top</Button>
        <Button variant="outline">Middle</Button>
        <Button variant="outline">Bottom</Button>
      </ButtonGroup>
    </div>
  );
}
