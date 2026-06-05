"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function Example() {
  return (
    <div className="flex items-center justify-center p-8">
      <Tabs defaultValue={0}>
        <TabsList>
          <TabsTrigger value={0}>Overview</TabsTrigger>
          <TabsTrigger value={1}>Analytics</TabsTrigger>
          <TabsTrigger value={2}>Settings</TabsTrigger>
        </TabsList>

        <TabsContent value={0} className="p-4">
          <p className="text-sm text-muted-foreground">
            A high-level summary of your project is displayed here.
          </p>
        </TabsContent>

        <TabsContent value={1} className="p-4">
          <p className="text-sm text-muted-foreground">
            Detailed analytics and metrics appear on this panel.
          </p>
        </TabsContent>

        <TabsContent value={2} className="p-4">
          <p className="text-sm text-muted-foreground">
            Configure your project preferences in this section.
          </p>
        </TabsContent>
      </Tabs>
    </div>
  )
}
