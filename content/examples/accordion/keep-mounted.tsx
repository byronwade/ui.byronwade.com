import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

/**
 * keepMounted — panels stay in the DOM when closed (useful for forms or
 * content that must persist state across open/close cycles, e.g. search engines
 * indexing hidden content or components with internal state).
 *
 * hiddenUntilFound — uses the native `hidden="until-found"` attribute so the
 * browser's built-in page search (Ctrl+F / Cmd+F) can locate and reveal
 * content inside closed panels automatically.
 */
export default function Example() {
  return (
    <div className="mx-auto max-w-md space-y-10 py-10">
      {/* keepMounted */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          keepMounted — panels remain in DOM when closed
        </p>
        <Accordion keepMounted defaultValue={["item-1"]}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Persisted panel A</AccordionTrigger>
            <AccordionContent>
              This panel's DOM node is never removed — useful when the content
              has internal state you want to preserve across toggles.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>Persisted panel B</AccordionTrigger>
            <AccordionContent>
              Even when closed, this panel exists in the DOM but is visually
              hidden.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      {/* hiddenUntilFound */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          hiddenUntilFound — browser search can reveal closed panels
        </p>
        <Accordion hiddenUntilFound defaultValue={["overview"]}>
          <AccordionItem value="overview">
            <AccordionTrigger>Product overview</AccordionTrigger>
            <AccordionContent>
              Try using your browser's find-in-page (⌘F / Ctrl+F) to search
              for text inside this accordion. Closed panels will open
              automatically when a match is found.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="specs">
            <AccordionTrigger>Technical specifications</AccordionTrigger>
            <AccordionContent>
              Dimensions: 200 × 150 × 50 mm. Weight: 420 g. Power consumption:
              12 W. Operating temperature: 0–40 °C. Search for "420" to test.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
