"use client"

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function Example() {
  return (
    <div className="flex flex-col items-center justify-center gap-10 p-8">
      {/* Single disabled tab */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          One tab disabled
        </p>
        <Tabs defaultValue={0}>
          <TabsList>
            <TabsTrigger value={0}>Documents</TabsTrigger>
            <TabsTrigger value={1}>Images</TabsTrigger>
            <TabsTrigger value={2} disabled>
              Videos
            </TabsTrigger>
          </TabsList>

          <TabsContent value={0} className="p-4">
            <p className="text-sm text-muted-foreground">
              Your documents are listed here.
            </p>
          </TabsContent>
          <TabsContent value={1} className="p-4">
            <p className="text-sm text-muted-foreground">
              Image gallery appears here.
            </p>
          </TabsContent>
          <TabsContent value={2} className="p-4">
            <p className="text-sm text-muted-foreground">
              Video library is coming soon.
            </p>
          </TabsContent>
        </Tabs>
      </div>

      {/* All but one disabled */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Multiple disabled
        </p>
        <Tabs defaultValue={0}>
          <TabsList>
            <TabsTrigger value={0}>Free</TabsTrigger>
            <TabsTrigger value={1} disabled>
              Pro
            </TabsTrigger>
            <TabsTrigger value={2} disabled>
              Enterprise
            </TabsTrigger>
          </TabsList>

          <TabsContent value={0} className="p-4">
            <p className="text-sm text-muted-foreground">
              Free plan features are available.
            </p>
          </TabsContent>
          <TabsContent value={1} className="p-4">
            <p className="text-sm text-muted-foreground">
              Upgrade to unlock Pro features.
            </p>
          </TabsContent>
          <TabsContent value={2} className="p-4">
            <p className="text-sm text-muted-foreground">
              Contact sales for Enterprise.
            </p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
