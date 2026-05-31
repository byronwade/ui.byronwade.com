import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function Example() {
  return (
    <div className="mx-auto max-w-md py-10">
      <Accordion defaultValue={["item-1"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>What is your return policy?</AccordionTrigger>
          <AccordionContent>
            We accept returns within 30 days of purchase. Items must be in their
            original condition and packaging.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How long does shipping take?</AccordionTrigger>
          <AccordionContent>
            Standard shipping takes 3–5 business days. Expedited options are
            available at checkout.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Do you offer customer support?</AccordionTrigger>
          <AccordionContent>
            Yes, our support team is available Monday–Friday, 9 am–5 pm EST via
            email and live chat.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
