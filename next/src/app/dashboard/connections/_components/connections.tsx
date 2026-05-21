"use client";

import dynamic from "next/dynamic";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Connection } from "./columns";

const ConnectionsList = dynamic(() => import("./connections-list"));
const ConnectionsTable = dynamic(() => import("./connections-table"));
const CreateConnection = dynamic(
  () => import("@/app/dashboard/connections/_components/create"),
);

export function ConnectionsSkeleton() {
  return (
    <main className="p-4">
      <div className="space-y-4">
        {Array.from({ length: 10 }).map(() => (
          <Card key={Math.random()}>
            <CardHeader>
              <CardTitle>
                <Skeleton className="h-5 w-full md:w-1/2" />
              </CardTitle>
              <CardDescription>
                <Skeleton className="h-4 w-1/2 md:w-1/4" />
              </CardDescription>
              <CardAction>
                <Skeleton className="h-4 w-4 rounded-full" />
              </CardAction>
            </CardHeader>
            <CardContent className="flex justify-between text-sm font-semibold">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}

export default function Connections({
  connections,
  pages,
}: {
  connections: Connection[];
  pages: number;
}) {
  const isMobile = useIsMobile();

  return (
    <>
      {isMobile ? (
        <ConnectionsList connections={connections} pages={pages} />
      ) : (
        <ConnectionsTable data={connections} pages={pages} />
      )}
      <CreateConnection />
    </>
  );
}
