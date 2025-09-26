import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DetailsLoading() {
  return (
    <main className="m-4 flex flex-col md:flex-row md:justify-between gap-4">
      {/* Main Details Card */}
      <Card className="flex-1">
        <CardHeader>
          {/* Title and Description */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            {/* Edit Button */}
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Area Section */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>

          {/* Phone Number Section */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>

          {/* Base Pack Section */}
          <div className="p-3 border rounded-lg bg-muted/30">
            <div className="flex flex-row justify-between items-center mb-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-6 w-16 rounded-md" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Last Payment Section */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-28" />
          </div>
        </CardContent>

        <CardFooter className="flex-row-reverse">
          <Skeleton className="h-10 w-28 rounded-md" />
        </CardFooter>
      </Card>

      {/* Payments History Card */}
      <Card className="flex-1">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {/* Payment History Items */}
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-3 w-28" />
                  <Skeleton className="h-5 w-12 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-8 w-8 rounded-md ml-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  );
}
