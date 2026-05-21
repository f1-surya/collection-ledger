import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="loading">
      {Array.from({ length: 15 }).map((_, i) => (
        <div key={i}>
          <div className="flex flex-row justify-between p-2">
            <div>
              <Skeleton className="h-6 w-48 mb-1" />
              <div className="flex flex-col text-xs">
                <Skeleton className="h-4 w-32 mb-1" />{" "}
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="text-sm font-semibold whitespace-nowrap">
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
          {14 !== i && <Separator className="w-full" />}
        </div>
      ))}
    </div>
  );
}
