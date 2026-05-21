import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingAddons() {
  return (
    <main className="p-4">
      <ul className="space-y-4">
        {Array.from({ length: 10 }, (_, i) => i + 1).map((itemNo) => (
          <Card key={itemNo}>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-5 w-full md:w-1/2" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-1/2 md:w-1/4" />
              </CardDescription>
              <CardAction className="flex flex-row gap-2">
                <Skeleton className="h-8 w-8" />
                <Skeleton className="h-8 w-8" />
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </ul>
    </main>
  );
}
