"use client"

import { Bell, ChartBar, Gear, User } from "@/lib/icons"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-8">
      <Tabs defaultValue={0}>
        <TabsList>
          <TabsTrigger value={0}>
            <User />
            Profile
          </TabsTrigger>
          <TabsTrigger value={1}>
            <ChartBar />
            Stats
          </TabsTrigger>
          <TabsTrigger value={2}>
            <Bell />
            Alerts
          </TabsTrigger>
          <TabsTrigger value={3}>
            <Gear />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value={0} className="p-4">
          <p className="text-sm text-muted-foreground">
            View and edit your public profile information.
          </p>
        </TabsContent>

        <TabsContent value={1} className="p-4">
          <p className="text-sm text-muted-foreground">
            Usage statistics and activity trends.
          </p>
        </TabsContent>

        <TabsContent value={2} className="p-4">
          <p className="text-sm text-muted-foreground">
            Active alerts and threshold notifications.
          </p>
        </TabsContent>

        <TabsContent value={3} className="p-4">
          <p className="text-sm text-muted-foreground">
            General preferences and integrations.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
