"use client"

import { Bell, CreditCard, Lock, UserCircle } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-8">
      <Tabs defaultValue={0} orientation="vertical" className="w-full max-w-lg">
        <TabsList>
          <TabsTrigger value={0}>
            <UserCircle />
            Account
          </TabsTrigger>
          <TabsTrigger value={1}>
            <Lock />
            Privacy
          </TabsTrigger>
          <TabsTrigger value={2}>
            <Bell />
            Notifications
          </TabsTrigger>
          <TabsTrigger value={3}>
            <CreditCard />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value={0} className="rounded-xl edge p-5">
          <h3 className="text-sm font-semibold">Account</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your username, email, and profile photo.
          </p>
        </TabsContent>

        <TabsContent value={1} className="rounded-xl edge p-5">
          <h3 className="text-sm font-semibold">Privacy</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Control who can see your activity and data.
          </p>
        </TabsContent>

        <TabsContent value={2} className="rounded-xl edge p-5">
          <h3 className="text-sm font-semibold">Notifications</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose which events trigger email or push alerts.
          </p>
        </TabsContent>

        <TabsContent value={3} className="rounded-xl edge p-5">
          <h3 className="text-sm font-semibold">Billing</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your subscription, invoices, and payment methods.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
