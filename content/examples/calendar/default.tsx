"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

export default function Example() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex justify-center p-6">
      <div className="w-fit rounded-2xl edge bg-card">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </div>
    </div>
  );
}
