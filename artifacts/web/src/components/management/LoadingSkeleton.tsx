import { TableCell, TableRow } from "@/components/ui/table";

interface LoadingSkeletonProps {
  rowKeyPrefix: string;
  thirdColumnWidth: string;
}

export function LoadingSkeleton({
  rowKeyPrefix,
  thirdColumnWidth,
}: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: 4 }).map((_, index) => (
        <TableRow key={`${rowKeyPrefix}-${index}`} className="border-primary/5">
          <TableCell className="px-4 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 animate-pulse rounded-full bg-primary/10" />
              <div className="space-y-2">
                <div className="h-3 w-28 animate-pulse rounded-full bg-primary/10" />
                <div className="h-2.5 w-20 animate-pulse rounded-full bg-primary/5" />
              </div>
            </div>
          </TableCell>
          <TableCell>
            <div className="h-3 w-32 animate-pulse rounded-full bg-primary/10" />
          </TableCell>
          <TableCell>
            <div
              className={`h-3 ${thirdColumnWidth} animate-pulse rounded-full bg-primary/10`}
            />
          </TableCell>
          <TableCell>
            <div className="h-6 w-16 animate-pulse rounded-full bg-primary/10" />
          </TableCell>
          <TableCell className="pr-4 sm:pr-6">
            <div className="ml-auto h-3 w-16 animate-pulse rounded-full bg-primary/10" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
