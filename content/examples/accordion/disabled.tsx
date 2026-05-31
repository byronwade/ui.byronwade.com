import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function Example() {
  return (
    <div className="mx-auto max-w-md space-y-10 py-10">
      {/* Entire accordion disabled */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Entire accordion disabled
        </p>
        <Accordion disabled defaultValue={["item-1"]}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Account details</AccordionTrigger>
            <AccordionContent>
              Your account details are currently read-only.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Preferences</AccordionTrigger>
            <AccordionContent>
              Preference editing is unavailable at this time.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* Individual item disabled */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Individual item disabled
        </p>
        <Accordion defaultValue={["item-1"]}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Active feature</AccordionTrigger>
            <AccordionContent>
              This feature is enabled and fully interactive.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" disabled>
            <AccordionTrigger>Locked feature</AccordionTrigger>
            <AccordionContent>
              This content is not reachable while the item is disabled.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Another active feature</AccordionTrigger>
            <AccordionContent>
              This feature is also enabled and interactive.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
