"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-8">
      <Tabs defaultValue={0} orientation="vertical" className="w-full max-w-lg">
        <TabsList>
          <TabsTrigger value={0}>Profile</TabsTrigger>
          <TabsTrigger value={1}>Appearance</TabsTrigger>
          <TabsTrigger value={2}>Notifications</TabsTrigger>
          <TabsTrigger value={3}>Security</TabsTrigger>
        </TabsList>

        <TabsContent value={0} className="p-4">
          <h3 className="mb-1 text-sm font-semibold">Profile</h3>
          <p className="text-sm text-muted-foreground">
            Update your display name, bio, and avatar.
          </p>
        </TabsContent>

        <TabsContent value={1} className="p-4">
          <h3 className="mb-1 text-sm font-semibold">Appearance</h3>
          <p className="text-sm text-muted-foreground">
            Choose your preferred theme and font size.
          </p>
        </TabsContent>

        <TabsContent value={2} className="p-4">
          <h3 className="mb-1 text-sm font-semibold">Notifications</h3>
          <p className="text-sm text-muted-foreground">
            Control which emails and push alerts you receive.
          </p>
        </TabsContent>

        <TabsContent value={3} className="p-4">
          <h3 className="mb-1 text-sm font-semibold">Security</h3>
          <p className="text-sm text-muted-foreground">
            Manage your password and two-factor authentication.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
