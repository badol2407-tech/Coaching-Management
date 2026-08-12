import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface DataTableColumn {
  label: string;
  className?: string;
}

interface DataTableProps {
  columns: DataTableColumn[];
  children: ReactNode;
}

export function DataTable({ columns, children }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border-primary/10 hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.label}
                className={`h-12 whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground ${column.className ?? ""}`}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  );
}
