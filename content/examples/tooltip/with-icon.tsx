"use client"

import { Info, AlertTriangle, HelpCircle, Star } from "lucide-react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center justify-center gap-4 p-16">
        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
            <Info className="size-4" />
            <span className="sr-only">More info</span>
          </TooltipTrigger>
          <TooltipContent>More information about this field</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
            <AlertTriangle className="size-4 text-warning" />
            <span className="sr-only">Warning</span>
          </TooltipTrigger>
          <TooltipContent>
            This action may have unintended side effects
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
            <HelpCircle className="size-4" />
            <span className="sr-only">Help</span>
          </TooltipTrigger>
          <TooltipContent>Need help? Visit our documentation</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger render={<Button variant="ghost" size="icon" />}>
            <Star className="size-4 text-warning" />
            <span className="sr-only">Favorite</span>
          </TooltipTrigger>
          <TooltipContent>Mark as favorite</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
}
