import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"

export default function Example() {
  return (
    <div className="mx-auto max-w-md py-10">
      <p className="mb-4 text-sm text-muted-foreground">
        Multiple items can be open simultaneously.
      </p>
      <Accordion multiple defaultValue={["item-1", "item-3"]}>
        <AccordionItem value="item-1">
          <AccordionTrigger>General settings</AccordionTrigger>
          <AccordionContent>
            <p>
              Manage your display name, language preference, and time zone from
              the general settings panel.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Notifications</AccordionTrigger>
          <AccordionContent>
            <p>
              Choose which events trigger email, push, or in-app notifications.
              You can mute channels individually or pause all alerts.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Privacy &amp; security</AccordionTrigger>
          <AccordionContent>
            <p>
              Control who can see your profile, manage active sessions, and
              enable two-factor authentication for your account.
            </p>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-4">
          <AccordionTrigger>Billing</AccordionTrigger>
          <AccordionContent>
            <p>
              View your current plan, update payment methods, and download past
              invoices from the billing section.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
