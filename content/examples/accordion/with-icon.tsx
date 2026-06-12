import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { Bell, CreditCard, ShieldCheck, Users } from "@/lib/icons"

export default function Example() {
  return (
    <div className="mx-auto max-w-md py-10">
      <Accordion defaultValue={["security"]}>
        <AccordionItem value="security">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <ShieldCheck className="size-4 shrink-0 text-muted-foreground" />
              Security
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Review login activity, manage trusted devices, and configure
              two-factor authentication to keep your account safe.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="notifications">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <Bell className="size-4 shrink-0 text-muted-foreground" />
              Notifications
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Choose how and when you receive alerts, via email, SMS, or in-app
              banners. Snooze all notifications for a set duration.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="billing">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <CreditCard className="size-4 shrink-0 text-muted-foreground" />
              Billing
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Update your payment method, review upcoming invoices, and change
              your subscription plan at any time.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="team">
          <AccordionTrigger>
            <span className="flex items-center gap-2">
              <Users className="size-4 shrink-0 text-muted-foreground" />
              Team access
            </span>
          </AccordionTrigger>
          <AccordionContent>
            <p>
              Invite members, assign roles, and control permissions across your
              organization from one place.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
