"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

type Employee = {
  id: number;
  name: string;
  department: string;
  role: string;
  startDate: string;
  salary: number;
};

const employees: Employee[] = [
  { id: 1, name: "Alex Rivera", department: "Engineering", role: "Senior Engineer", startDate: "2021-03-15", salary: 130000 },
  { id: 2, name: "Morgan Chen", department: "Design", role: "Lead Designer", startDate: "2020-07-01", salary: 115000 },
  { id: 3, name: "Jordan Park", department: "Engineering", role: "Staff Engineer", startDate: "2019-01-20", salary: 155000 },
  { id: 4, name: "Casey Liu", department: "Product", role: "Product Manager", startDate: "2022-05-10", salary: 120000 },
  { id: 5, name: "Taylor Kim", department: "Design", role: "UX Researcher", startDate: "2023-02-28", salary: 95000 },
  { id: 6, name: "Sam Patel", department: "Engineering", role: "Engineer II", startDate: "2022-09-01", salary: 105000 },
];

type SortKey = keyof Employee;
type SortDir = "asc" | "desc" | null;

export default function Example() {
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      if (sortDir === "asc") setSortDir("desc");
      else if (sortDir === "desc") { setSortKey(null); setSortDir(null); }
      else setSortDir("asc");
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const sorted = [...employees].sort((a, b) => {
    if (!sortKey || !sortDir) return 0;
    const av = a[sortKey];
    const bv = b[sortKey];
    const cmp = typeof av === "number" && typeof bv === "number"
      ? av - bv
      : String(av).localeCompare(String(bv));
    return sortDir === "asc" ? cmp : -cmp;
  });

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground/50 inline" />;
    if (sortDir === "asc") return <ArrowUp className="ml-1.5 h-3.5 w-3.5 inline" />;
    return <ArrowDown className="ml-1.5 h-3.5 w-3.5 inline" />;
  }

  const headers: { key: SortKey; label: string; right?: boolean }[] = [
    { key: "name", label: "Name" },
    { key: "department", label: "Department" },
    { key: "role", label: "Role" },
    { key: "startDate", label: "Start Date" },
    { key: "salary", label: "Salary", right: true },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {headers.map(({ key, label, right }) => (
              <TableHead
                key={key}
                className={right ? "text-right cursor-pointer select-none" : "cursor-pointer select-none"}
                onClick={() => handleSort(key)}
              >
                {label}
                <SortIcon col={key} />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((emp) => (
            <TableRow key={emp.id}>
              <TableCell className="font-medium">{emp.name}</TableCell>
              <TableCell>{emp.department}</TableCell>
              <TableCell className="text-muted-foreground">{emp.role}</TableCell>
              <TableCell className="text-muted-foreground">{emp.startDate}</TableCell>
              <TableCell className="text-right font-mono text-sm">
                ${emp.salary.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
