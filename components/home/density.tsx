import { Stage } from "@/components/cinematic/stage";
import { Reveal } from "@/components/cinematic/reveal";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const rows = [
  {
    id: "ISS-1842",
    title: "Tighten selected-state contrast on resource rows",
    status: "In progress",
    meta: "2h",
    active: true,
  },
  {
    id: "ISS-1839",
    title: "Ship reading-ui lane for docs surfaces",
    status: "Review",
    meta: "48m",
    active: false,
  },
  {
    id: "ISS-1831",
    title: "Map activity tokens to agent timeline",
    status: "Todo",
    meta: "—",
    active: false,
  },
  {
    id: "ISS-1820",
    title: "Align depth-soft with Polaris shadow-100",
    status: "Done",
    meta: "1d",
    active: false,
  },
];

function Density() {
  return (
    <Stage
      id="density"
      tone="paper"
      className="flex flex-col justify-center px-5 py-24 md:px-8 md:py-32"
    >
      <div className="mx-auto grid w-full max-w-6xl gap-14 lg:grid-cols-[0.9fr_1.2fr] lg:items-center lg:gap-20">
        <Reveal>
          <p className="font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            Density
          </p>
          <h2 className="mt-4 max-w-[14ch] text-3xl font-medium tracking-[-0.035em] text-foreground md:text-5xl">
            Scan like Linear. Rest like Polaris.
          </h2>
          <p className="reading-muted mt-5 max-w-md text-base leading-relaxed tracking-tight">
            Built on shadcn Table and Card. Selected state is brand wash — never
            a loud border.
          </p>
        </Reveal>

        <Reveal>
          <Card className="depth-soft">
            <CardHeader className="border-b">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Issues</CardTitle>
                  <CardDescription>Resource density demo</CardDescription>
                </div>
                <Badge variant="secondary" className="font-mono">
                  4 open
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5">ID</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden sm:table-cell">
                      Status
                    </TableHead>
                    <TableHead className="pr-5 text-right">Age</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.active ? "selected" : undefined}
                      className="data-[state=selected]:bg-brand/10"
                    >
                      <TableCell className="pl-5 font-mono text-xs text-muted-foreground">
                        {row.id}
                      </TableCell>
                      <TableCell className="max-w-[16rem] truncate tracking-tight">
                        {row.title}
                      </TableCell>
                      <TableCell className="hidden font-mono text-xs text-muted-foreground sm:table-cell">
                        {row.status}
                      </TableCell>
                      <TableCell className="pr-5 text-right font-mono text-xs text-muted-foreground">
                        {row.meta}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Reveal>
      </div>
    </Stage>
  );
}

export { Density };
