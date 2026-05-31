"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function Example() {
  return (
    <div className="p-8">
      <Tabs defaultValue={0}>
        <TabsList>
          <TabsTrigger value={0}>Account</TabsTrigger>
          <TabsTrigger value={1}>Password</TabsTrigger>
          <TabsTrigger value={2}>Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value={0} className="p-4">
          <p className="text-sm text-muted-foreground">Manage your account details here.</p>
        </TabsContent>

        <TabsContent value={1} className="p-4">
          <p className="text-sm text-muted-foreground">Update your password here.</p>
        </TabsContent>

        <TabsContent value={2} className="p-4">
          <p className="text-sm text-muted-foreground">Configure notification preferences.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
